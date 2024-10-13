<?php

namespace App\Livewire\Users;

use App\Models\User;
use App\Validation\UserRules;
use Livewire\Component;
use Mary\Traits\Toast;

class Create extends Component
{
    use Toast, UserRules;

    public string $name = '';
    public string $email = '';
    public string $password = '';
    public array $user_roles = [
        "regular",
        "doctor",
        "admin",
    ];
    public string $role = $user_roles[0];
    public bool $multiStep = false;

    public function mount()
    {
    }

    public function submit()
    {
        $this->validate($this->userRules());
        User::create([
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'role' => $this->role,
        ]);
        $this->success('Registro criado com sucesso.', position: 'toast-bottom');
        if (!$this->multiStep) {
            sleep(1);
            return redirect('/dashboard/users');
        }
    }

    public function render()
    {
        return view('livewire.users.create');
    }
}
