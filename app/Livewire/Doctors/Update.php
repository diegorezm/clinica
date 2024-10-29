<?php

namespace App\Livewire\Doctors;

use App\Models\Doctor;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class Update extends Form
{
    public int $doctor_id;

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
                $this->submitDoctor();
                return redirect('/dashboard/doctors/show/' . $this->doctor_id);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                $this->error('Erro ao atualizar registro.');
                DB::rollBack();
            }
        });
    }

    protected function submitUser()
    {
        $this->validate($this->userRules($this->user_id));
        $user = User::find($this->user_id);
        $user->update([
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
        ]);
    }

    protected function submitDoctor()
    {
        $this->validate($this->doctorRules());
        $doctor = Doctor::find($this->doctor_id);
        $doctor->specialty = $this->specialty;
        $doctor->crm = $this->crm;
        $doctor->save();

        // there has to be a better way to do this
        $doctor->workDays()->delete();
        $workDayData = array_map(fn ($day) => ['doctor_id' => $doctor->id, 'day' => $day], $this->work_days);
        $doctor->workDays()->insert($workDayData);

        $doctor->workHours()->delete();

        foreach ($this->workingHours as $day => $hours) {
            if (!in_array($day, $this->work_days) || empty($hours)) continue;
            foreach ($hours as $hour) {
                $this->validateWorkingHours($hour['start_time'], $hour['end_time'], $day);
                $startTime = Carbon::createFromFormat('H:i', $hour['start_time']);
                $endTime = Carbon::createFromFormat('H:i', $hour['end_time']);
                $doctor->workHours()->create([
                    'day' => $day,
                    'start_time' => $startTime->format('H:i:s'),
                    'end_time' => $endTime->format('H:i:s'),
                    'interval' => $hour['interval'],
                    'doctor_id' => $doctor->id
                ]);
            }
        }
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
        $this->work_days = $doctor->workDays()->select('day')->pluck('day')->toArray();

        foreach ($doctor->workHours as $hour) {
            $day = $hour->day;
            if (!isset($this->workingHours[$day])) {
                $this->workingHours[$day] = [];
            }
            $startTime = Carbon::createFromFormat('H:i:s', $hour->start_time);
            $endTime = Carbon::createFromFormat('H:i:s', $hour->end_time);
            $this->workingHours[$day][] = [
                'start_time' => $startTime->format('H:i'),
                'end_time' => $endTime->format('H:i'),
                'interval' => $hour->interval,
            ];
        }
    }

    public function render()
    {
        return view('livewire.doctors.update');
    }
}
