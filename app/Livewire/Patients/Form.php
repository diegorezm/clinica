<?php

namespace App\Livewire\Patients;

use App\Validation\PatientRules;
use Livewire\Component;
use Mary\Traits\Toast;

abstract class Form extends Component
{

    use Toast, PatientRules;

    public $name = '';
    public $phone = '';
    public $rg = '';
    public $insurance = '';
    public $insurance_number = '';

    public function validation(?int $id = null)
    {
        $this->validate($this->patientRules($id), [
            'name.required' => 'O nome é obrigatório.',
            'phone.required' => 'O telefone é obrigatório.',
            'phone.min' => 'O telefone deve ter no mínimo 11 dígitos.',
            'phone.max' => 'O telefone pode ter no máximo 15 dígitos.',
            'rg.unique' => 'O RG já está cadastrado para outro paciente.',
            'rg.max' => 'O RG pode ter no máximo 20 caracteres.',
            'insurance.string' => 'O seguro deve ser uma string válida.',
            'insurance.max' => 'O seguro pode ter no máximo 255 caracteres.',
            'insurance_number.string' => 'O número do seguro deve ser uma string válida.',
            'insurance_number.max' => 'O número do seguro pode ter no máximo 255 caracteres.',
        ]);
    }
    public abstract function submit();
    public abstract function render();
}
