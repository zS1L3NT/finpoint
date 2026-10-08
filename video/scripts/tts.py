"""Kokoro narration for the guide film. Called by `narrate.ts`; not meant to be run by hand.

Reads a job file and speaks each part in one breath, so sentences flow into each other with the
voice's own rhythm instead of being stitched together. A part may hold several sentences; their
positions are recovered from the pauses the voice takes between them. Parts are laid out with
exact pauses, and where every sentence landed is printed as JSON.
"""

import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

job = json.loads(Path(sys.argv[1]).read_text())
kokoro = Kokoro(job["model"], job["voices"])
THRESHOLD = 0.012


def trim(samples: np.ndarray, rate: int) -> np.ndarray:
    """Cut the model's own leading and trailing silence so our pauses are the only pauses."""
    window = int(rate * 0.01)
    loud = np.flatnonzero(np.abs(samples) > THRESHOLD)
    if loud.size == 0:
        return samples
    return samples[max(0, loud[0] - window) : loud[-1] + window * 4]


def gaps(samples: np.ndarray, rate: int) -> list[tuple[float, float]]:
    """Silent stretches inside the speech, as (start, end) seconds, longest pauses included."""
    hop = int(rate * 0.01)
    frames = len(samples) // hop
    loud = np.array(
        [np.abs(samples[i * hop : (i + 1) * hop]).max() > THRESHOLD for i in range(frames)]
    )
    found, start = [], None
    for index, voiced in enumerate(loud):
        if not voiced and start is None:
            start = index
        elif voiced and start is not None:
            if index - start >= 8:  # 80 ms or more
                found.append((start * hop / rate, index * hop / rate))
            start = None
    return found


def sentence_spans(samples: np.ndarray, rate: int, weights: list[float]) -> list[tuple[float, float]]:
    """Where each sentence sits: the longest pauses nearest the expected boundaries split them."""
    length = len(samples) / rate
    if len(weights) <= 1:
        return [(0.0, length)]
    total = sum(weights)
    expected, running = [], 0.0
    for weight in weights[:-1]:
        running += weight
        expected.append(running / total * length)
    candidates = gaps(samples, rate)
    cuts = []
    for target in expected:
        # Prefer long pauses close to where the sentence should end.
        best = max(
            (gap for gap in candidates if gap not in cuts),
            key=lambda gap: (gap[1] - gap[0]) - abs((gap[0] + gap[1]) / 2 - target) * 0.25,
            default=None,
        )
        cuts.append(best if best else (target, target))
    cuts.sort()
    spans, cursor = [], 0.0
    for start, end in cuts:
        spans.append((cursor, start))
        cursor = end
    spans.append((cursor, length))
    return spans


results = []
for segment in job["segments"]:
    rate = 24000
    pieces = [np.zeros(int(rate * segment["leadIn"]), dtype=np.float32)]
    cursor = segment["leadIn"]
    parts = []
    for part in segment["parts"]:
        samples, rate = kokoro.create(
            part["text"], voice=job["voice"], speed=job["speed"], lang=job["lang"]
        )
        voiced = trim(samples.astype(np.float32), rate)
        for start, end in sentence_spans(voiced, rate, part.get("weights", [1])):
            parts.append({"start": cursor + start, "end": cursor + end})
        length = len(voiced) / rate
        pieces += [voiced, np.zeros(int(rate * part["pauseAfter"]), dtype=np.float32)]
        cursor += length + part["pauseAfter"]
    audio = np.concatenate(pieces)
    with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
        sf.write(wav.name, audio, rate)
        subprocess.run(
            [*job["ffmpeg"], "-hide_banner", "-loglevel", "error", "-y", "-i", wav.name,
             "-codec:a", "libmp3lame", "-b:a", "96k", segment["file"]],
            check=True,
        )
    results.append({"file": segment["file"], "duration": len(audio) / rate, "parts": parts})
    print(f"  {Path(segment['file']).name}", file=sys.stderr)

print(json.dumps(results))
