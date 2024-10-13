<?php

namespace App\Validation;

trait UserRules
{
    protected function userRules($userId = null): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
            'password' => ['required', 'string', 'min:4', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
        ];
    }
}
