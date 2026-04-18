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
 * @property string|null $source_statement_id
 * @property string|null $source_record_id
 * @property string $target_record_id
 * @property numeric $amount
 * @property string|null $source_check
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Allocation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Allocation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Allocation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Allocation whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Allocation whereSourceCheck($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Allocation whereSourceRecordId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Allocation whereSourceStatementId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Allocation whereTargetRecordId($value)
 */
	class Allocation extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Budget query()
 */
	class Budget extends \Eloquent {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetException newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetException newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BudgetException query()
 */
	class BudgetException extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $name
 * @property string $icon
 * @property string $color
 * @property string|null $parent_category_id
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Category> $children
 * @property-read int|null $children_count
 * @property-read mixed $can_delete
 * @property-read Category|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Record> $records
 * @property-read int|null $records_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Category whereParentCategoryId($value)
 */
	class Category extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property string $title
 * @property string|null $people
 * @property string|null $location
 * @property string|null $description
 * @property \Illuminate\Support\Carbon $datetime
 * @property numeric $amount
 * @property string $category_id
 * @property-read \App\Models\Category $category
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Record> $records
 * @property-read int|null $records_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Statement> $statements
 * @property-read int|null $statements_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereCategoryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereDatetime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record wherePeople($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Record whereTitle($value)
 */
	class Record extends \Eloquent {}
}

namespace App\Models{
/**
 * @property string $id
 * @property \Illuminate\Support\Carbon $date
 * @property string $description
 * @property numeric $amount
 * @property string $account_id
 * @property-read \App\Models\Account $account
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Allocation> $allocations
 * @property-read int|null $allocations_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Record> $records
 * @property-read int|null $records_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Statement whereId($value)
 */
	class Statement extends \Eloquent {}
}

