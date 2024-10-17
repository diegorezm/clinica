<?php

namespace App\Livewire\Users;

use App\Models\User;
use App\Validation\UserRules;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Mary\Traits\Toast;

abstract class Form extends Component
{
    use Toast, UserRules;
    public string $email = '';

    public string $name = '';

    public string $password = '';

    public string $role = 'regular';

    protected function validation()
    {
        $this->validate($this->userRules(), [
            'email.required' => 'O email é obrigatório.',
            'name.required' => 'O nome é obrigatório.',
            'password.required' => 'A senha é obrigatória.',
            'role.required' => 'A permissão é obrigatória.',
        ]);
    }

    #[Computed()]
    public function roleOpts()
    {
        return [
            ['id' => 'admin', 'name' => 'Administrador'],
            ['id' => 'regular', 'name' => 'Normal'],
        ];
    }

    public abstract function submit();
    public abstract function render();
}
