<?php

namespace App\Livewire\Login;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Rule;
use Livewire\Component;
use Mary\Traits\Toast;

class Form extends Component
{
    use Toast;

    #[Rule(['required', 'email'])]
    public string $email = '';

    #[Rule(['required', 'min:4', 'max:255'])]
    public string $password = '';

    public function submit(Request $request)
    {
        $this->validate();
        $credentials = [
            'email' => $this->email,
            'password' => $this->password
        ];
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        }
        $this->error(
            'Não foi possivel realizar o login',
            'Email ou senha inválidos',
        );
    }

    public function render()
    {
        return view('livewire.login.form');
    }
}
