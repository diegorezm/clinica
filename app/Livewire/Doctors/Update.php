<?php

namespace App\Livewire\Doctors;

use App\Validation\DoctorRules;
use App\Models\Doctor;
use App\Models\User;
use App\Validation\UserRules;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Livewire\Component;
use Mary\Traits\Toast;

class Update extends Component
{

    use Toast, DoctorRules, UserRules;

    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $specialty = '';
    public string $crm = '';
    public string $role = 'doctor';
    public int $user_id;
    public int $doctor_id;

    public function submit()
    {
        if (!Gate::allows('admin', Auth::user())) {
            $this->error('Voce não tem permissão para realizar essa ação!');
            sleep(1);
            return redirect('/dashboard/doctors');
        }
        DB::transaction(function () {
            $this->submit_user();
            $this->submit_doctor();
        });
        return redirect('/dashboard/doctors');
    }

    public function submit_user()
    {
        $this->validate($this->userRules($this->user_id));
        $user = User::find($this->user_id);
        $user->update([
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
        ]);
    }

    public function submit_doctor()
    {
        $this->validate($this->doctorRules());
        $doctor = Doctor::find($this->doctor_id);
        $doctor->update([
            'specialty' => $this->specialty,
            'crm' => $this->crm,
        ]);
    }

    public function mount(Doctor $doctor)
    {
        if (!$doctor->user) {
            $this->error('Algo deu errado!');
            sleep(2);
            return redirect('/dashboard/doctors');
        }

        $this->doctor_id = $doctor->id;
        $this->name = $doctor->user->name;
        $this->email = $doctor->user->email;
        $this->password = $doctor->user->password;
        $this->specialty = $doctor->specialty;
        $this->crm = $doctor->crm;
        $this->user_id = $doctor->user_id;
    }

    public function render()
    {
        return view('livewire.doctors.update');
    }
}
