<?php

namespace App\Livewire\Appointments;

use App\Models\Appointment;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Livewire\WithPagination;
use App\Enums\AppointmentStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Mary\Traits\Toast;

class Index extends Component
{
    use Toast, WithPagination;

    public string $search = '';

    public int $perPage = 10;

    public array $selected = [];

    public bool $showModal = false;

    public bool $showDrawer = false;

    public array $filters = [
        'month' => null,
        'year' => null,
        'status' => null,
        'doctor' => null,
        'patient' => null,
        'time' => null
    ];

    public array $sortBy = ['column' => 'date', 'direction' => 'asc'];

    public function clear(): void
    {
        $doctorId = $this->filters['doctor'];
        $patientId = $this->filters['patient'];
        $this->reset();
        $this->success('Filtros limpos.', position: 'toast-bottom');
        if ($doctorId) {
            $this->filters['doctor'] = $doctorId;
        }
        if ($patientId) {
            $this->filters['patient'] = $patientId;
        }
    }
    #[Computed()]
    protected function yearOpts()
    {
        // Get the oldest appointment year
        $oldestYear = Appointment::query()
            ->orderBy('date', 'asc')
            ->value('date');

        // If there's no record, default to the current year
        $startYear = $oldestYear ? Carbon::parse($oldestYear)->year : now()->year;

        // Get the latest appointment year
        $latestYear = Appointment::query()
            ->orderBy('date', 'desc')
            ->value('date');

        // If there's no record, default to the current year
        $endYear = $latestYear ? Carbon::parse($latestYear)->year : now()->year;

        // Generate the year options
        $years = [];
        for ($year = $startYear; $year <= $endYear; $year++) {
            $years[] = [
                'id' => $year,
                'name' => (string) $year,
            ];
        }

        return $years;
    }

    #[Computed()]
    public function headers(): array
    {
        return [
            ['key' => 'id', 'label' => '#', 'class' => 'text-primary'],
            ['key' => 'date', 'label' => 'Data'],
            ['key' => 'doctor.user.name', 'label' => 'Doutor', 'sortable' => false],
            ['key' => 'patient.name', 'label' => 'Paciente', 'sortable' => false],
            ['key' => 'status', 'label' => 'Status', 'class' => 'hidden md:flex', 'sortable' => false],
        ];
    }

    #[Computed()]
    public function appointments()
    {
        $appointments = Appointment::with(['doctor.user', 'patient'])
            ->when($this->search, function ($query) {
                $this->setPage(1);
                $query->whereHas('doctor.user', function ($subQuery) {
                    $subQuery->where('name', 'like', "%{$this->search}%");
                })
                    ->orWhereHas('patient', function ($subQuery) {
                        $subQuery->where('name', 'like', "%{$this->search}%")->orWhere('rg', 'like', "%{$this->search}%");
                    });
            })->when($this->filters['month'], function ($query) {
                $this->setPage(1);
                $query->whereMonth('date', $this->filters['month']);
            })
            ->when($this->filters['year'], function ($query) {
                $this->setPage(1);
                $query->whereYear('date', $this->filters['year']);
            })
            ->when($this->filters['status'], function ($query) {
                $this->setPage(1);
                $query->where('status', $this->filters['status']);
            })
            ->when($this->filters['time'], function ($query) {
                $this->setPage(1);
                $t = Carbon::createFromFormat('H:i', $this->filters['time'])->format('H:i:s');
                $query->whereTime('date', $t);
            })
            ->when($this->filters['doctor'], function ($query) {
                $query->where('doctor_id', $this->filters['doctor']);
            })
            ->when($this->filters['patient'], function ($query) {
                $query->where('patient_id', $this->filters['patient']);
            });

        return $appointments->orderBy(...array_values($this->sortBy))
            ->paginate($this->perPage);
    }
    protected function isValidTimeFormat($time)
    {
        return \DateTime::createFromFormat('H:i', $time) !== false;
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

    #[Computed()]
    protected function monthOpts()
    {
        return [
            ['id' => '01', 'name' => 'Janeiro'],
            ['id' => '02', 'name' => 'Fevereiro'],
            ['id' => '03', 'name' => 'Março'],
            ['id' => '04', 'name' => 'Abril'],
            ['id' => '05', 'name' => 'Maio'],
            ['id' => '06', 'name' => 'Junho'],
            ['id' => '07', 'name' => 'Julho'],
            ['id' => '08', 'name' => 'Agosto'],
            ['id' => '09', 'name' => 'Setembro'],
            ['id' => '10', 'name' => 'Outubro'],
            ['id' => '11', 'name' => 'Novembro'],
            ['id' => '12', 'name' => 'Dezembro'],
        ];
    }

    public function delete()
    {
        if (count($this->selected) == 0) {
            $this->error('Selecione pelo menos um encaminhamento.', position: 'toast-bottom');
            $this->showModal = false;
            return;
        }
        DB::transaction(function () {
            try {
                Appointment::destroy($this->selected);
                $this->success('Agendamentos removidos com sucesso.', position: 'toast-bottom');
            } catch (\Exception $e) {
                Log::error($e->getMessage());
                $this->error('Erro ao remover consultas.');
                DB::rollBack();
            } finally {
                $this->selected = [];
                $this->showModal = false;
            }
        });
    }

    public function mount(int $patient_id = null, int $doctor_id = null)
    {
        if ($patient_id) {
            $this->filters['patient'] = $patient_id;
        }
        if ($doctor_id) {
            $this->filters['doctor'] = $doctor_id;
        }
    }

    public function render()
    {
        return view('livewire.appointments.index');
    }
}
