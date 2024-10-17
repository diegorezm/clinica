<?php

namespace App\Livewire\Patients\Referrals;

use App\Validation\PatientReferralRules;
use Livewire\Attributes\Url;
use Livewire\Component;
use Mary\Traits\Toast;

abstract class Form extends Component
{

    use Toast, PatientReferralRules;

    public string $doctor_specialty = '';

    public string $cid = '';

    public string $crm = '';

    #[Url(as: 'patientId')]
    public int $patient_id;

    public function validation()
    {
        $this->validate($this->patientReferralRules(), [
            'patient_id.required' => 'O ID do paciente é obrigatório.',
            'patient_id.exists' => 'O paciente selecionado não existe.',
            'doctor_specialty.required' => 'A especialidade do médico é obrigatória.',
            'doctor_specialty.string' => 'A especialidade do médico deve ser uma string válida.',
            'doctor_specialty.max' => 'A especialidade do médico pode ter no máximo 255 caracteres.',
            'cid.required' => 'O CID é obrigatório.',
            'cid.string' => 'O CID deve ser uma string válida.',
            'cid.max' => 'O CID pode ter no máximo 125 caracteres.',
            'crm.required' => 'O CRM é obrigatório.',
            'crm.string' => 'O CRM deve ser uma string válida.',
            'crm.max' => 'O CRM pode ter no máximo 255 caracteres.',
        ]);
    }

    public abstract function submit();
    public abstract function render();
}
