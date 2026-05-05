<?php

namespace App\Rules;

use App\Models\Record;
use App\Models\Statement;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class EnsureStatementAmountDoesntExceedAllocable implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $i = explode('.', $attribute)[1];
        $statement_id = request()->input("statements.$i.id");

        /** @var Record $record */
        $record = request()->route('record');
        $statement = $record?->statements()->find($statement_id) ?: Statement::find($statement_id);

        $allocable = $statement->amount - $statement->allocations()->sum('amount') + ($statement->pivot?->amount ?? 0);

        if ($statement->amount > 0) {
            if ($value <= 0) {
                $fail('The amount must be positive');

                return;
            }

            if (round($allocable - $value, 2) < 0) {
                $fail('This amount exceeds what can be allocated');

                return;
            }
        }

        if ($statement->amount < 0) {
            if ($value >= 0) {
                $fail('The amount must be negative');

                return;
            }

            if (round($allocable - $value, 2) > 0) {
                $fail('This amount exceeds what can be allocated');

                return;
            }
        }
    }
}
