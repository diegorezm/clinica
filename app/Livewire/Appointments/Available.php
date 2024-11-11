<?php

namespace App\Livewire\Appointments;

use App\Models\Doctor;
use Livewire\WithPagination;
use Carbon\Carbon;
use Livewire\Attributes\Computed;
use Livewire\Component;
use App\Models\Appointment;
use App\Utils\DateUtils;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Mary\Traits\Toast;

class Available extends Component
{
    use Toast, WithPagination;
    public bool $showDrawer = false;
    public array $filters = [
        'search' => null,
        'doctor_id' => null,
        'month' => null,
        'year' => null,
        'day_of_the_week' => null,
    ];

    // TODO: This feels very slow, but i don't know how to make it faster or even if its possible to
    // make it faster. But i should think about improving it somehow.
    // This method is used to generate the available work times for the current month
    // and year. I don't think you should run it without a year and a month, it
    // would take too long.
    #[Computed()]
    public function availableTimes()
    {
        // Fetch all doctors, apply filters if they exist
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

        // prefech appointments for current time range
        $appointments = Appointment::query()
            ->when($this->filters['doctor_id'], function ($query) {
                $query->where('doctor_id', $this->filters['doctor_id']);
            })->when($this->filters['year'], function ($query) {
                $query->whereYear('date', $this->filters['year']);
            })->when($this->filters['month'], function ($query) {
                $query->whereMonth('date', $this->filters['month']);
            })->get();

        // For each doctor
        foreach ($doctors as $doctor) {
            // Get the appointments of this doctor, might be unnecessary when i'm already filtering by doctor
            // but i don't think it's a problem
            $doctorAppointments = $appointments->filter(fn ($appointment) => $appointment->doctor_id === $doctor->id);
            $workHoursByDay = $doctor->workHours->groupBy('day');

            $currentDate = Carbon::create($this->filters['year'], $this->filters['month'], 1);
            $endOfMonth = $currentDate->copy()->endOfMonth();

            // Go through each day of the month
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

                        // If the time is in the past, skip it
                        if ($availableDateTime->isPast()) {
                            $startTime->addMinutes($interval);
                            continue;
                        }

                        // Check for existing appointment at this time
                        if ($doctorAppointments
                            ->contains(
                                fn ($appointment) =>
                                $appointment->date->format('Y-m-d H:i:s') === $availableDateTime->format('Y-m-d H:i:s')
                            )
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

                        // Add the interval to the start time
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
    public function paginatedAvailableTimes(int $perPage = 20, array $options = [], ?int $page = null)
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?? 1);
        $availableTimes = $this->availableTimes();
        $items = $availableTimes instanceof Collection ?  $availableTimes : collect($availableTimes);
        return new LengthAwarePaginator($items->forPage($page, $perPage), $items->count(), $perPage, $page, $options);
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
            ['key' => 'time', 'label' => 'Horario', 'sortable' => false],
            ['key' => 'month', 'label' => 'Mês', 'sortable' => false],
            ['key' => 'name', 'label' => 'Doutor', 'sortable' => false],
        ];
    }

    #[Computed()]
    protected function monthOpts()
    {
        return DateUtils::monthOpts();
    }

    #[Computed()]
    protected function workDaysOpts()
    {
        return DateUtils::workDaysOpts();
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

    #[Computed()]
    protected function getDayName($day_id)
    {
        return DateUtils::getDayName($day_id);
    }

    #[Computed()]
    protected function getMonthName($month_id)
    {
        return DateUtils::getMonthName($month_id);
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
