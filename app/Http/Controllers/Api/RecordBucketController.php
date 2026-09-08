<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bucket;
use App\Models\Record;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RecordBucketController extends Controller
{
    public function update()
    {
        $dto = request()->validate([
            'records' => 'required|array|min:1|max:1000',
            'records.*.id' => 'required|string|distinct|exists:records,id',
            'records.*.revision' => 'required|integer|min:1',
            'bucket_id' => 'nullable|string|exists:buckets,id',
        ]);

        $bucket = isset($dto['bucket_id']) ? Bucket::query()->findOrFail($dto['bucket_id']) : null;
        if ($bucket?->archived) {
            throw ValidationException::withMessages(['bucket_id' => 'Archived buckets cannot receive Records.']);
        }

        return DB::transaction(function () use ($dto, $bucket) {
            $records = Record::query()->whereIn('id', collect($dto['records'])->pluck('id'))->get()->keyBy('id');
            $stale = collect($dto['records'])->filter(fn ($item) => $records[$item['id']]->revision !== $item['revision']);
            if ($stale->isNotEmpty()) {
                return response()->json([
                    'message' => 'Some Records changed while you were working.',
                    'stale_ids' => $stale->pluck('id')->values(),
                ], 409);
            }

            if ($bucket) {
                $ineligible = $records->filter(fn ($record) => $record->analytics_treatment !== 'spending'
                    && ! ($record->analytics_treatment === 'automatic' && $record->amount < 0));
                if ($ineligible->isNotEmpty()) {
                    throw ValidationException::withMessages([
                        'records' => $ineligible->count().' selected Record(s) are not classified as spending.',
                    ]);
                }
            }

            foreach ($records as $record) {
                $record->update([
                    'bucket_id' => $bucket?->id,
                    'bucket_source' => $bucket ? 'manual' : null,
                    'revision' => $record->revision + 1,
                ]);
            }

            return ['updated' => $records->count()];
        });
    }
}
