<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quota;

class QuotaController extends Controller
{
    public function store()
    {
        $dto = request()->validate([
            'name' => 'required|string',
            'month' => 'required|date_format:F',
            'year' => 'required|date_format:Y',
            'amount' => 'required|decimal:0,2',
        ]);

        $quota = Quota::create($dto);

        return $quota;
    }

    public function update(Quota $quota)
    {
        $dto = request()->validate([
            'name' => 'required|string',
            'amount' => 'required|decimal:0,2',
        ]);

        $quota->update($dto);

        return $quota;
    }

    public function destroy(Quota $quota)
    {
        $quota->delete();

        return [];
    }
}
