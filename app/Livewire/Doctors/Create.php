<?php

namespace App\Livewire\Doctors;

use App\Models\Doctor;
use App\Models\User;
use App\Validation\DoctorRules;
use App\Validation\UserRules;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Livewire\Component;
use Mary\Traits\Toast;

class Create extends Component
{
    use Toast, DoctorRules, UserRules;

    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $specialty = '';
    public string $crm = '';
    public string $role = 'doctor';
    public ?int $user_id;

    public function submit()
    {
        if (!Gate::allows('admin', Auth::user())) {

            $this->error('Voce não tem permissão para realizar essa ação!');
            sleep(1);
            return redirect('/dashboard/doctors');
        }
        DB::transaction(function () {
            $this->submit_user();

            if (is_null($this->user_id)) {
                throw new \Exception('Algo deu errado');
            }
            $this->submit_doctor();
        });
        return redirect('/dashboard/doctors');
    }

    public function submit_user()
    {
        $this->validate($this->userRules());
        $user = User::create([
            'name' => $this->name,
            'email' => $this->email,
            'password' => Hash::make($this->password),
            'role' => $this->role,
        ]);
        $this->user_id = $user->id;
    }

    public function submit_doctor()
    {

        if (is_null($this->user_id)) {
            $this->error('User must be created before creating a doctor.');
            return;
        }

        $this->validate($this->doctorRules());
        Doctor::create([
            'user_id' => $this->user_id,
            'specialty' => $this->specialty,
            'crm' => $this->crm
        ]);
    }

    public function render()
    {
        return view('livewire.doctors.create');
    }
}
