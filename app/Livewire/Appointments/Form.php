<?php

namespace App\Livewire\Appointments;

use Livewire\Component;
use App\Enums\AppointmentStatus;
use App\Models\Doctor;
use App\Models\Patient;
use App\Validation\AppointmentRules;
use Illuminate\Database\Eloquent\Collection;
use Livewire\Attributes\Computed;
use Livewire\Attributes\Url;
use Mary\Traits\Toast;

abstract class Form extends Component
{
    use Toast, AppointmentRules;

    #[Url(as: 'date')]
    public ?string $date = null;

    #[Url(as: 'time')]
    public ?string $time = null;

    public string $status = AppointmentStatus::P->value;
    public ?string $obs = null;
    #[Url(as: 'doctorId')]
    public ?int $doctor_id = null;
    #[Url(as: 'patientId')]
    public ?int $patient_id = null;

    public Collection $patients;
    public Collection $doctors;

    protected function validation(bool $forUpdate = false)
    {
        $this->validate($this->appointmentRules($forUpdate), [
            'date.required' => 'A data é obrigatória.',
            'date.date' => 'A data deve ser uma data válida.',
            'date.after' => 'A data deve ser uma data futura.',

            'patient_id.required' => 'O paciente é obrigatório.',
            'doctor_id.required' => 'O médico é obrigatório.',

            'time.required' => 'O horário é obrigatório.',
            'date.after_or_equal' => 'A data deve ser hoje ou uma data futura.',
        ]);
    }

    public function patientSearch(string $value = '')
    {
        $selectedOption = Patient::where('id', $this->patient_id)->get();
        $this->patients = Patient::where('name', 'like', '%' . $value . '%')->orWhere('rg', 'like', '%' . $value . '%')
            ->orderBy('name')
            ->take(5)
            ->get()
            ->merge($selectedOption);
    }

    public function doctorSearch(string $value = '')
    {
        $selectedOption = Doctor::where('id', $this->doctor_id)->get();
        $this->doctors = Doctor::whereHas('user', function ($query) use ($value) {
            $query->where('name', 'like', '%' . $value . '%');
        })->with('user')->take(5)->get()->merge($selectedOption);
    }

    #[Computed()]
    protected function statusOpts()
    {
        return [
            ['id' => AppointmentStatus::P->value, 'name' => AppointmentStatus::P->getName()],
            ['id' => AppointmentStatus::F->value, 'name' => AppointmentStatus::F->getName()],
            ['id' => AppointmentStatus::FJ->value, 'name' => AppointmentStatus::FJ->getName()],
            ['id' => AppointmentStatus::FM->value, 'name' => AppointmentStatus::FM->getName()],
            ['id' => AppointmentStatus::OK->value, 'name' => AppointmentStatus::OK->getName()],
        ];
    }

    abstract public function submit();
    abstract public function render();
}
