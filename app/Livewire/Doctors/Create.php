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
use Illuminate\Support\Facades\Log;

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
            try {
                $this->submitUser();
                if (is_null($this->user_id) || $this->user_id < 0) {
                    throw new \Exception('Algo deu errado');
                }
                $this->submitDoctor();
                return redirect('/dashboard/doctors');
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                $this->error('Erro ao criar registro.');
                DB::rollBack();
                throw $e;
            }
        });
    }

    protected function submitUser()
    {
        $this->validateUser();
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
        $this->validateDoctor();
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
