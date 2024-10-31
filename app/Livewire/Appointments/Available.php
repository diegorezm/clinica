<?php

namespace App\Livewire\Appointments;

use App\Models\Doctor;
use Carbon\Carbon;
use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Enums\DaysOfTheWeek;
use App\Models\Appointment;
use Mary\Traits\Toast;

class Available extends Component
{
    use Toast;
    public bool $showDrawer = false;
    public array $filters = [
        'search' => null,
        'doctor_id' => null,
        'month' => null,
        'year' => null,
        'day_of_the_week' => null
    ];


    #[Computed()]
    public function availableTimes()
    {

        // Fetch all doctors
        $doctors = Doctor::with(['workHours', 'workDays'])
            ->when($this->filters['doctor_id'], function ($query) {
                $query->where('id', $this->filters['doctor_id']);
            })->when($this->filters['search'], function ($query) {
                $query->whereHas('user', function ($subquery) {
                    $subquery->where('name', 'like', "%{$this->filters['search']}%");
                })->orWhere('crm', 'like', "%{$this->filters['search']}%");
            })
            ->get();

        $availableTimes = [];

        foreach ($doctors as $doctor) {
            $workHoursByDay = $doctor->workHours->groupBy('day');

            $currentDate = Carbon::create($this->filters['year'], $this->filters['month'], 1);
            $endOfMonth = $currentDate->copy()->endOfMonth();

            while ($currentDate <= $endOfMonth) {
                $dayOfWeek = $currentDate->dayOfWeekIso;

                // Skip this day if it doesn't match any configured workday
                if (!isset($workHoursByDay[$dayOfWeek])) {
                    $currentDate->addDay();
                    continue;
                }

                // Skip this day if it doesn't match the selected filter
                if ($this->filters['day_of_the_week'] !== null && $this->filters['day_of_the_week'] != $dayOfWeek) {
                    $currentDate->addDay();
                    continue;
                }

                // Get work hours for the specific day
                $hours = $workHoursByDay[$dayOfWeek];

                // Iterate through available work hours for the day
                foreach ($hours as $hour) {
                    $startTime = Carbon::createFromFormat('H:i:s', $hour->start_time);
                    $endTime = Carbon::createFromFormat('H:i:s', $hour->end_time);
                    $interval = $hour->interval;

                    // Generate available time slots for the given day
                    while ($startTime < $endTime) {
                        $availableDateTime = $currentDate->copy()->setTimeFrom($startTime);

                        if ($availableDateTime->isPast()) {
                            $startTime->addMinutes($interval);
                            continue;
                        }

                        // Check for existing appointment at this time
                        if (Appointment::where('doctor_id', $doctor->id)
                            ->where('date', $availableDateTime->format('Y-m-d H:i:s'))->exists()
                        ) {
                            $startTime->addMinutes($interval);
                            continue;
                        }

                        $availableTimes[] = [
                            'doctor_id' => $doctor->id,
                            'name' => $doctor->user->name,
                            'crm' => $doctor->crm,
                            'date' => $availableDateTime->format('d-m-Y'),
                            'month' => $this->getMonthName($this->filters['month']),
                            'year' => $this->filters['year'],
                            'day' => $this->getDayName($dayOfWeek),
                            'time' => $startTime->format('H:i'),
                        ];

                        $startTime->addMinutes($interval);
                    }
                }

                // Move to the next day
                $currentDate->addDay();
            }
        }
        return $availableTimes;
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
            "" => "Todos",
        ][$day_id];
    }

    #[Computed()]
    protected function getMonthName($month_id)
    {
        return [
            1 => 'Janeiro',
            2 => 'Fevereiro',
            3 => 'Março',
            4 => 'Abril',
            5 => 'Maio',
            6 => 'Junho',
            7 => 'Julho',
            8 => 'Agosto',
            9 => 'Setembro',
            10 => 'Outubro',
            11 => 'Novembro',
            12 => 'Dezembro',
        ][$month_id];
    }


    public function clear(): void
    {
        $doctorId = $this->filters['doctor_id'];
        $this->reset();
        $this->success('Filtros limpos.', position: 'toast-bottom');
        if ($doctorId) {
            $this->filters['doctor'] = $doctorId;
        }
        $this->filters['month'] = Carbon::now()->format('m');
        $this->filters['year'] = Carbon::now()->year;
    }

    #[Computed()]
    public function headers(): array
    {
        return [
            ['key' => 'day', 'label' => 'Dia', 'sortable' => false],
            ['key' => 'date', 'label' => 'Data', 'sortable' => false],
            ['key' => 'month', 'label' => 'Mês', 'sortable' => false],
            ['key' => 'name', 'label' => 'Doutor', 'sortable' => false],
            ['key' => 'crm', 'label' => 'Crm', 'sortable' => false],
            ['key' => 'time', 'label' => 'Horario', 'sortable' => false],
        ];
    }

    #[Computed()]
    protected function monthOpts()
    {
        return [
            ['id' => '1', 'name' => 'Janeiro'],
            ['id' => '2', 'name' => 'Fevereiro'],
            ['id' => '3', 'name' => 'Março'],
            ['id' => '4', 'name' => 'Abril'],
            ['id' => '5', 'name' => 'Maio'],
            ['id' => '6', 'name' => 'Junho'],
            ['id' => '7', 'name' => 'Julho'],
            ['id' => '8', 'name' => 'Agosto'],
            ['id' => '9', 'name' => 'Setembro'],
            ['id' => '10', 'name' => 'Outubro'],
            ['id' => '11', 'name' => 'Novembro'],
            ['id' => '12', 'name' => 'Dezembro'],
        ];
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
    protected function yearOpts()
    {
        $currentYear = Carbon::now()->year;
        $nextYear = $currentYear + 1;
        return [
            ['id' => $currentYear, 'name' => (string) $currentYear],
            ['id' => $nextYear, 'name' => (string) $nextYear],
        ];
    }

    public function mount(int $doctorId = null)
    {
        if ($doctorId) {
            $this->filters['doctor_id'] = $doctorId;
        }
        $this->filters['month'] = Carbon::now()->format('m');

        $this->filters['year'] = Carbon::now()->year;
    }

    public function render()
    {
        return view('livewire.appointments.available');
    }
}
