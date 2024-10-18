<?php

namespace App\Livewire\Appointments;

use App\Models\Appointment;
use App\Models\Doctor;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class Create extends Form
{
    public function mount()
    {
        $this->doctorSearch();
        $this->patientSearch();

        $this->date = now()->format('Y-m-d');
        $this->time = '00:00';
    }

    public function submit()
    {
        $this->validation();
        $dateTime = DateTime::createFromFormat('Y-m-d H:i', $this->date . ' ' . $this->time);
        $appointmentDate = Carbon::instance($dateTime);
        $doctor = Doctor::find($this->doctor_id);
        if (!$doctor) {
            throw ValidationException::withMessages(['doctor_id' => 'Médico não encontrado.']);
        }
        $workDays = $doctor->workDays()->pluck('day')->toArray();

        if (!in_array($appointmentDate->dayOfWeek, $workDays)) {
            throw ValidationException::withMessages([
                'date' => 'Este médico não trabalha no dia selecionado.',
            ]);
        }
        DB::transaction(function () use ($dateTime) {
            try {
                $appointment = Appointment::create([
                    'date' => $dateTime,
                    'status' => $this->status,
                    'doctor_id' => $this->doctor_id,
                    'patient_id' => $this->patient_id,
                    'obs' => $this->obs,
                ]);

                $this->success('Consulta marcada.');
                sleep(1);
                return redirect('/dashboard/appointments/show/' . $appointment->id);
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                $this->error('Erro ao marcar consulta.');
                DB::rollBack();
                throw $e;
            }
        });
    }

    public function render()
    {
        return view('livewire.appointments.create');
    }
}
