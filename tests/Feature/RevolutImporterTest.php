<?php

namespace Tests\Feature;

use App\Models\Account;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class RevolutImporterTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_includes_pending_revolut_statements_in_the_imported_count(): void
    {
        Account::query()->create([
            'id' => 'revolut-account',
            'name' => 'Revolut',
            'balance' => 0,
            'bank' => 'Revolut',
        ]);

        $csv = <<<'CSV'
State,Started Date,Description,Amount,Fee
PENDING,2026-09-13 09:30:00,Groceries,-42.10,0
CSV;

        $this->post('/api/importer/revolut', [
            'account_id' => 'revolut-account',
            'file' => UploadedFile::fake()->createWithContent('revolut.csv', $csv),
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJson([
                'imported' => 1,
                'reindexed' => 0,
                'skipped' => 0,
            ]);
    }

    public function test_it_imports_completed_and_pending_revolut_statements(): void
    {
        Account::query()->create([
            'id' => 'revolut-account',
            'name' => 'Revolut',
            'balance' => 0,
            'bank' => 'Revolut',
        ]);

        $csv = <<<'CSV'
State,Started Date,Description,Amount,Fee
COMPLETED,2026-09-12 10:15:00,Coffee,-5.50,0
PENDING,2026-09-13 09:30:00,Groceries,-42.10,0
CSV;

        $response = $this->post('/api/importer/revolut', [
            'account_id' => 'revolut-account',
            'file' => UploadedFile::fake()->createWithContent('revolut.csv', $csv),
        ], ['Accept' => 'application/json']);

        $response
            ->assertOk()
            ->assertJson([
                'imported' => 2,
                'reindexed' => 0,
                'skipped' => 0,
            ]);

        $this->assertDatabaseHas('statements', [
            'account_id' => 'revolut-account',
            'description' => 'Coffee',
            'amount' => -5.50,
            'is_pending' => false,
        ]);
        $this->assertDatabaseHas('statements', [
            'account_id' => 'revolut-account',
            'description' => 'Groceries',
            'amount' => -42.10,
            'is_pending' => true,
        ]);

        $this->post('/api/importer/revolut', [
            'account_id' => 'revolut-account',
            'file' => UploadedFile::fake()->createWithContent('revolut.csv', $csv),
        ], ['Accept' => 'application/json'])
            ->assertOk()
            ->assertJson([
                'imported' => 0,
                'reindexed' => 0,
                'skipped' => 2,
            ]);

        $this->assertDatabaseCount('statements', 2);
    }
}
