<?php

namespace App\Livewire\Appointments;

use Livewire\Component;
use App\Enums\AppointmentStatus;
use App\Models\Doctor;
use App\Models\Patient;
use App\Validation\AppointmentRules;
use Illuminate\Database\Eloquent\Collection;
use Livewire\Attributes\Computed;
use Mary\Traits\Toast;

abstract class Form extends Component
{
    use Toast, AppointmentRules;
    public string $date;
    public string $time;
    public string $status = AppointmentStatus::P->value;
    public ?string $obs = null;
    public ?int $doctor_id = null;
    public ?int $patient_id = null;

    public Collection $patients;
    public Collection $doctors;

    protected function validation()
    {
        $this->validate($this->rules(), [
            'date.required' => 'A data é obrigatória.',
            'date.date' => 'A data deve ser uma data válida.',
            'date.after' => 'A data deve ser uma data futura.',

            'patient_id.required' => 'O paciente é obrigatório.',
            'doctor_id.required' => 'O médico é obrigatório.',

            'time.required' => 'O horário é obrigatório.',
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