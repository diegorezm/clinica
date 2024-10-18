<?php

namespace App\Livewire\Appointments;

use App\Models\Appointment;
use DateTime;
use Illuminate\Support\Facades\DB;

class Update extends Form
{
    public Appointment $appointment;
    public function mount(Appointment $appointment)
    {
        $this->appointment = $appointment;
        $this->doctorSearch();
        $this->patientSearch();

        $this->date = $this->appointment->date->format('Y-m-d');
        $this->time = $this->appointment->date->format('H:i');
        $this->status = $this->appointment->status;
        $this->doctor_id = $this->appointment->doctor_id;
        $this->patient_id = $this->appointment->patient_id;

        $this->obs = $this->appointment->obs;
    }

    public function submit()
    {
        $this->validation();
        $dateTime = DateTime::createFromFormat('Y-m-d H:i', $this->date . ' ' . $this->time);
        DB::transaction(function () use ($dateTime) {
            try {
                $this->appointment->update([
                    'date' => $dateTime,
                    'status' => $this->status,
                    'doctor_id' => $this->doctor_id,
                    'patient_id' => $this->patient_id,
                    'obs' => $this->obs,
                ]);
                $this->success('Consulta marcada.');
                sleep(1);
                return redirect('/dashboard/appointments/show/' . $this->appointment->id);
            } catch (\Exception $e) {
                $this->error($e->getMessage());
                DB::rollBack();
                throw $e;
            }
        });
    }

    public function render()
    {
        return view('livewire.appointments.update');
    }
}
