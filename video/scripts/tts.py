"""Kokoro narration for the guide film. Called by `narrate.ts`; not meant to be run by hand.

Reads a job file, speaks every sentence separately, trims each one to its voiced audio, then lays
the sentences out with exact pauses between them. Prints where each sentence landed as JSON.
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


def trim(samples: np.ndarray, rate: int) -> np.ndarray:
    """Cut the model's own leading and trailing silence so our pauses are the only pauses."""
    window = int(rate * 0.01)
    loud = np.flatnonzero(np.abs(samples) > 0.012)
    if loud.size == 0:
        return samples
    return samples[max(0, loud[0] - window) : loud[-1] + window * 4]


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
        length = len(voiced) / rate
        parts.append({"start": cursor, "end": cursor + length})
        pieces += [voiced, np.zeros(int(rate * part["pauseAfter"]), dtype=np.float32)]
        cursor += length + part["pauseAfter"]
    audio = np.concatenate(pieces)
    with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
        sf.write(wav.name, audio, rate)
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", wav.name,
             "-codec:a", "libmp3lame", "-b:a", "96k", segment["file"]],
            check=True,
        )
    results.append({"file": segment["file"], "duration": len(audio) / rate, "parts": parts})
    print(f"  {Path(segment['file']).name}", file=sys.stderr)

print(json.dumps(results))
