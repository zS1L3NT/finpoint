<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;

class AccountController extends Controller
{
    public function update(Account $account)
    {
        $dto = request()->validate([
            'name' => 'required|string',
        ]);

        $account->update($dto);

        return $account;
    }
}
