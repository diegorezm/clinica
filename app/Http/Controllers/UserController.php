<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return view('pages.users.index');
    }
    public function create()
    {
        return view('pages.users.create');
    }

    public function update(User $user)
    {
        return view('pages.users.update', [
            'user' => $user
        ]);
    }

    public function show(User $user)
    {
        return view('pages.users.show', [
            'user' => $user
        ]);
    }
}
