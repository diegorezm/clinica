<?php

namespace App\Livewire\Appointments;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Livewire\Component;
use Mary\Traits\Toast;

class Show extends Component
{
    use Toast;
    public Appointment $appointment;
    public User $user;
    public Doctor $doctor;
    public Patient $patient;

    public bool $showModal = false;

    public function mount(Appointment $appointment)
    {
        $this->appointment = $appointment;
        $this->doctor = $appointment->doctor;
        $this->patient = $appointment->patient;
        $this->user = $appointment->doctor->user;
    }

    public function delete()
    {
        DB::transaction(function () {
            try {
                $this->appointment->delete();
                $this->success('Agendamento removido com sucesso.', position: 'toast-bottom');
                $this->showModal = false;
                return redirect("/dashboard/appointments");
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                $this->error('Erro ao remover consulta.', position: 'toast-bottom');
                DB::rollBack();
            }
        });
    }

    public function render()
    {
        return view('livewire.appointments.show');
    }
}
