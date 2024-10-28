<?php

namespace App\Livewire\Doctors;

use App\Models\Doctor;
use App\Models\DoctorWorkDays;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class Create extends Form
{
    public int $doctor_id = -1;
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
                    throw new \Exception('User id is not available. Please check the logs.');
                }
                $this->submitDoctor();
                if ($this->doctor_id < 0) {
                    return redirect('/dashboard/doctors');
                }
                return redirect('/dashboard/doctors/show/' . $this->doctor_id);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                $this->error('Erro ao criar registro.');
                DB::rollBack();
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

        // Don't really know why, but this only works if
        // i do it this way and not the normal way (Doctor::create)
        $doctor = new Doctor();
        $doctor->user_id = $this->user_id;
        $doctor->specialty = $this->specialty;
        $doctor->crm = $this->crm;
        $doctor->period = $this->period;
        $doctor->save();

        $this->doctor_id = $doctor->id;

        $workDayData = array_map(fn ($day) => ['doctor_id' => $doctor->id, 'day' => $day], $this->work_days);
        DoctorWorkDays::insert($workDayData);
    }

    public function render()
    {
        return view('livewire.doctors.create');
    }
}
