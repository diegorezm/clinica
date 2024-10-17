<?php

namespace App\Livewire\Doctors;

use App\Models\Doctor;
use App\Models\DoctorWorkDays;
use App\Models\DoctorWorkPeriod;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class Create extends Form
{
    public function submit()
    {
        if (!Gate::allows('admin', Auth::user())) {

            $this->error('Voce não tem permissão para realizar essa ação!');
            sleep(1);
            return redirect('/dashboard/doctors');
        }
        DB::transaction(function () {
            $this->submitUser();

            if (is_null($this->user_id)) {
                throw new \Exception('Algo deu errado');
            }
            $this->submitDoctor();
        });
        return redirect('/dashboard/doctors');
    }

    protected function submitUser()
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

    protected function submitDoctor()
    {

        if (is_null($this->user_id)) {
            $this->error('User must be created before creating a doctor.');
            return;
        }

        $this->validate($this->doctorRules());
        $doctor = Doctor::create([
            'user_id' => $this->user_id,
            'specialty' => $this->specialty,
            'crm' => $this->crm,
        ]);

        $workDayData = array_map(fn ($day) => ['doctor_id' => $doctor->id, 'day' => $day], $this->work_days);
        $workPeriodData = array_map(fn ($period) => ['doctor_id' => $doctor->id, 'period' => $period], $this->work_periods);
        DoctorWorkDays::insert($workDayData);
        DoctorWorkPeriod::insert($workPeriodData);
    }

    public function render()
    {
        return view('livewire.doctors.create');
    }
}
