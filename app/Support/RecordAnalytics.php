<?php

namespace App\Support;

use App\Models\Record;
use Illuminate\Support\Collection;

class RecordAnalytics
{
    public function contribution(Record $record): array
    {
        $amount = $this->cents($record->amount);

        return match ($record->analytics_treatment) {
            'income' => ['income' => $amount, 'spending' => 0, 'contributions' => 0, 'withdrawals' => 0],
            'spending' => ['income' => 0, 'spending' => -$amount, 'contributions' => 0, 'withdrawals' => 0],
            'saving_investment' => [
                'income' => 0,
                'spending' => 0,
                'contributions' => max(-$amount, 0),
                'withdrawals' => max($amount, 0),
            ],
            'neutral' => ['income' => 0, 'spending' => 0, 'contributions' => 0, 'withdrawals' => 0],
            default => [
                'income' => max($amount, 0),
                'spending' => max(-$amount, 0),
                'contributions' => 0,
                'withdrawals' => 0,
            ],
        };
    }

    public function summarize(Collection $records): array
    {
        $summary = [
            'income' => 0,
            'spending' => 0,
            'gross_spending' => 0,
            'refunds' => 0,
            'contributions' => 0,
            'withdrawals' => 0,
            'pending_income' => 0,
            'pending_spending' => 0,
            'pending_gross_spending' => 0,
            'pending_refunds' => 0,
            'pending_count' => 0,
            'unbucketed_count' => 0,
            'daily' => [],
            'categories' => [],
            'buckets' => [],
        ];

        foreach ($records as $record) {
            $value = $this->contribution($record);
            $date = $record->datetime->toDateString();
            $category = $record->category->parent ?? $record->category;

            $summary['income'] += $value['income'];
            $summary['spending'] += $value['spending'];
            $summary['contributions'] += $value['contributions'];
            $summary['withdrawals'] += $value['withdrawals'];
            $summary['gross_spending'] += max($value['spending'], 0);
            $summary['refunds'] += max(-$value['spending'], 0);

            if ($record->is_pending) {
                $summary['pending_count']++;
                $summary['pending_income'] += $value['income'];
                $summary['pending_spending'] += $value['spending'];
                $summary['pending_gross_spending'] += max($value['spending'], 0);
                $summary['pending_refunds'] += max(-$value['spending'], 0);
            }

            if ($value['spending'] !== 0 && $record->bucket_id === null) {
                $summary['unbucketed_count']++;
            }

            $summary['daily'][$date] ??= [
                'date' => $date,
                'income' => 0,
                'spending' => 0,
                'contributions' => 0,
                'withdrawals' => 0,
                'records' => 0,
            ];
            $summary['daily'][$date]['income'] += $value['income'];
            $summary['daily'][$date]['spending'] += $value['spending'];
            $summary['daily'][$date]['contributions'] += $value['contributions'];
            $summary['daily'][$date]['withdrawals'] += $value['withdrawals'];
            $summary['daily'][$date]['records']++;

            if ($value['spending'] !== 0) {
                $summary['categories'][$category->id] ??= [
                    'id' => $category->id,
                    'name' => $category->name,
                    'icon' => $category->icon,
                    'color' => $category->color,
                    'spending' => 0,
                    'records' => 0,
                    'bucket_spending' => [],
                ];
                $summary['categories'][$category->id]['spending'] += $value['spending'];
                $summary['categories'][$category->id]['records']++;
                $bucketKey = $record->bucket_id ?? 'unbucketed';
                $summary['categories'][$category->id]['bucket_spending'][$bucketKey] ??= 0;
                $summary['categories'][$category->id]['bucket_spending'][$bucketKey] += $value['spending'];

                if ($record->bucket) {
                    $summary['buckets'][$record->bucket->id] ??= [
                        'id' => $record->bucket->id,
                        'name' => $record->bucket->name,
                        'color' => $record->bucket->color,
                        'group' => $record->bucket->group,
                        'pace_kind' => $record->bucket->pace_kind,
                        'spending' => 0,
                        'records' => 0,
                    ];
                    $summary['buckets'][$record->bucket->id]['spending'] += $value['spending'];
                    $summary['buckets'][$record->bucket->id]['records']++;
                }
            }
        }

        $summary['surplus'] = $summary['income'] - $summary['spending'];
        $summary['surplus_rate'] = $summary['income'] > 0
            ? $summary['surplus'] / $summary['income'] * 100
            : null;

        ksort($summary['daily']);
        uasort($summary['categories'], fn ($a, $b) => $b['spending'] <=> $a['spending']);

        return $this->fromCents($summary);
    }

    private function cents(mixed $amount): int
    {
        return (int) round((float) $amount * 100);
    }

    private function fromCents(array $summary): array
    {
        $moneyFields = [
            'income', 'spending', 'gross_spending', 'refunds', 'contributions', 'withdrawals',
            'pending_income', 'pending_spending', 'pending_gross_spending', 'pending_refunds', 'surplus',
        ];
        foreach ($moneyFields as $field) {
            $summary[$field] /= 100;
        }

        foreach ($summary['daily'] as &$day) {
            foreach (['income', 'spending', 'contributions', 'withdrawals'] as $field) {
                $day[$field] /= 100;
            }
            $day['net'] = $day['income'] - $day['spending'];
        }
        unset($day);

        foreach (['categories', 'buckets'] as $group) {
            foreach ($summary[$group] as &$item) {
                $item['spending'] /= 100;
                if ($group === 'categories') {
                    foreach ($item['bucket_spending'] as &$amount) {
                        $amount /= 100;
                    }
                    unset($amount);
                }
            }
            unset($item);
            $summary[$group] = array_values($summary[$group]);
        }

        $summary['daily'] = array_values($summary['daily']);

        return $summary;
    }
}
