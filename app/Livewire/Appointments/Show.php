<?php

namespace App\Livewire\Appointments;

use App\Models\Appointment;
use Livewire\Component;
use Mary\Traits\Toast;

class Show extends Component
{
    use Toast;
    public Appointment $appointment;

    public bool $showModal = false;

    public function mount(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function render()
    {
        return view('livewire.appointments.show');
    }

    public function delete()
    {
        $this->appointment->delete();
        $this->success('Agendamento removido com sucesso.', position: 'toast-bottom');
        $this->showModal = false;
        return redirect("/dashboard/appointments");
    }
}
