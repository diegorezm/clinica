<?php

namespace App\Livewire\Doctors;

use App\Validation\DoctorRules;
use App\Validation\UserRules;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Mary\Traits\Toast;
use App\Enums\DaysOfTheWeek;
use DateTime;

abstract class Form extends Component
{
    use Toast, DoctorRules, UserRules;
    public string $name = '';
    public string $email = '';
    public string $password = '';
    public string $specialty = '';
    public string $crm = '';
    public string $role = 'doctor';
    public array $work_days = [];

    public $selectedTab = '0';
    public array $workingHours = [];
    public ?int $user_id = -1;
    protected $listeners = ['addWorkingHours' => 'addWorkingHours'];


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
        ]);
    }

    public function validateWorkingHours($startTime, $endTime, $day)
    {
        $start = DateTime::createFromFormat('H:i', $startTime);
        $end = DateTime::createFromFormat('H:i', $endTime);

        if ($start === false || $end === false) {
            throw new \InvalidArgumentException('Invalid time format. Please use H:i format.');
        }

        if ($start >= $end) {
            $this->error('Erro de validação', 'O horário final ' . $endTime . ' deve ser maior que o horário inicial ' . $startTime . '.');
            $this->addError('end_time', 'O horário final ' . $endTime . ' deve ser maior que o horário inicial ' . $startTime . '. Erro em: ' . $this->getDayName($day) . ' .');
            throw new \InvalidArgumentException('Start time must be earlier than end time.');
        }
    }


    public function updatedSelectedTab()
    {
        if ($this->selectedTab === '1') {
            $this->loadWorkingDays();
        }
    }

    public function loadWorkingDays()
    {
        foreach ($this->work_days as $day) {
            if (!isset($this->workingHours[$day])) {
                $this->workingHours[$day] = [];
            }
        }
    }

    public function addWorkingHours($day)
    {
        if (!isset($this->workingHours[$day])) {
            $this->workingHours[$day][] = ['start_time' => '00:00', 'end_time' => '00:00', 'interval' => '40'];
        }
        $this->workingHours[$day][] = ['start_time' => '00:00', 'end_time' => '00:00', 'interval' => '40'];
    }

    public function removeWorkingHours($day, $index)
    {
        unset($this->workingHours[$day][$index]);
    }


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

    #[Computed()]
    protected function getDayName($day_id)
    {
        return [
            DaysOfTheWeek::Segunda->value => DaysOfTheWeek::Segunda->getName(),
            DaysOfTheWeek::Terça->value => DaysOfTheWeek::Terça->getName(),
            DaysOfTheWeek::Quarta->value => DaysOfTheWeek::Quarta->getName(),
            DaysOfTheWeek::Quinta->value => DaysOfTheWeek::Quinta->getName(),
            DaysOfTheWeek::Sexta->value => DaysOfTheWeek::Sexta->getName(),
            DaysOfTheWeek::Sábado->value => DaysOfTheWeek::Sábado->getName(),
        ][$day_id];
    }

    public abstract function submit();
    protected abstract function submitUser();
    protected abstract function submitDoctor();
}
