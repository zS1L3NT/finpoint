<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property string $id
 * @property string $name
 * @property numeric $balance
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Statement> $statements
 * @property-read int|null $statements_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Account whereName($value)
 */
	class Account extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category query()
 */
	class Category extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $date
 * @property numeric $value
 * @property string $description
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereValue($value)
 */
	class Record extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $account_id
 * @property string $id
 * @property string $transaction_date
 * @property string $value_date
 * @property string $statement_code
 * @property string $description
 * @property string $supplementary_code
 * @property string $supplementary_code_description
 * @property string $client_reference
 * @property string $additional_reference
 * @property string $status
 * @property string $currency
 * @property numeric|null $debit_amount
 * @property numeric|null $credit_amount
 * @property-read mixed $amount
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereAdditionalReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereClientReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereCreditAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereDebitAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereStatementCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereSupplementaryCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereSupplementaryCodeDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereTransactionDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereValueDate($value)
 */
	class Statement extends \Eloquent {}
}

