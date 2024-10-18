<?php

namespace App\Livewire\Users;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class Create extends Form
{

    public function submit()
    {
        $this->validation();
        DB::transaction(function () {
            try {
                User::create([
                    'name' => $this->name,
                    'email' => $this->email,
                    'password' => Hash::make($this->password),
                    'role' => $this->role,
                ]);
                $this->success('Usuário criado com sucesso!');
                return redirect('/dashboard/users');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->error('Erro ao criar registro.');
                throw $e;
            }
        });
    }

    public function render()
    {
        return view('livewire.users.create');
    }
}
