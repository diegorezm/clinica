<?php

namespace App\Livewire\Doctors;

use App\Validation\DoctorRules;
use App\Validation\UserRules;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Mary\Traits\Toast;
use App\Enums\DaysOfTheWeek;

abstract class Form extends Component
{
    use Toast, DoctorRules, UserRules;
    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $specialty = '';
    public string $crm = '';
    public string $role = 'doctor';
    public string $period = '';
    public array $work_days = [];
    public ?int $user_id = -1;

    public function validateUser()
    {
        $this->validate($this->userRules($this->user_id), [
            'name.required' => 'O nome é obrigatório.',
            'email.required' => 'O email é obrigatório.',
            'password.required' => 'A senha é obrigatório.',
        ]);
    }

    public function validateDoctor()
    {
        $this->validate($this->doctorRules(), [
            'specialty.required' => 'A especialidade é obrigatória.',
            'crm.required' => 'O CRM é obrigatório.',
            'period.required' => 'O período é obrigatório.',
        ]);
    }

    public abstract function submit();
    protected abstract function submitUser();
    protected abstract function submitDoctor();

    #[Computed()]
    protected function workDaysOpts()
    {
        return [
            ['id' => DaysOfTheWeek::Segunda->value, 'name' => DaysOfTheWeek::Segunda->getName()],
            ['id' => DaysOfTheWeek::Terça->value, 'name' => DaysOfTheWeek::Terça->getName()],
            ['id' => DaysOfTheWeek::Quarta->value, 'name' => DaysOfTheWeek::Quarta->getName()],
            ['id' => DaysOfTheWeek::Quinta->value, 'name' => DaysOfTheWeek::Quinta->getName()],
            ['id' => DaysOfTheWeek::Sexta->value, 'name' => DaysOfTheWeek::Sexta->getName()],
            ['id' => DaysOfTheWeek::Sábado->value, 'name' => DaysOfTheWeek::Sábado->getName()],
        ];
    }
}
