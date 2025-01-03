<?php

namespace App\Livewire\Patients;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Livewire\WithPagination;
use Mary\Traits\Toast;

class Index extends Component
{
    use Toast, withPagination;

    public string $search = '';

    public int $perPage = 10;

    public array $sortBy = ['column' => 'id', 'direction' => 'asc'];

    public array $selected = [];

    public bool $showModal = false;


    // Clear filters
    public function clear(): void
    {
        $this->reset();
        $this->success('Filters cleared.', position: 'toast-bottom');
    }

    #[Computed()]
    public function headers(): array
    {
        return [
            ['key' => 'id', 'label' => '#', 'class' => 'text-primary font-bold'],
            ['key' => 'name', 'label' => 'Nome'],
            ['key' => 'phone', 'label' => 'Tel', 'sortable' => false],
            ['key' => 'rg', 'label' => 'RG', 'sortable' => false],
            ['key' => 'insurance', 'label' => 'Convenio', 'sortable' => false],
            ['key' => 'insurance_number', 'label' => 'N', 'sortable' => false]
        ];
    }


    #[Computed()]
    public function patients()
    {
        $patientIds = [];
        if (auth()->user()->role == 'doctor') {
            $patientIds = Appointment::query()->where('doctor_id', auth()->user()->doctor->id)
                ->pluck('patient_id')->toArray();
        }
        $patients = Patient::query();

        if (count($patientIds) > 0) {
            $patients->whereIn('id', $patientIds);
        }
        if ($this->search) {
            $patients = $patients->where('name', 'like', "%{$this->search}%")
                ->orWhere('rg', 'like', "%{$this->search}%");
        }
        return $patients->orderBy($this->sortBy['column'], $this->sortBy['direction'])->paginate($this->perPage);
    }

    public function delete()
    {
        DB::transaction(function () {
            try {
                Patient::destroy($this->selected);
                $this->selected = [];
                $this->showModal = false;
                $this->success('Registros removidos com sucesso.', position: 'toast-bottom');
            } catch (\Exception $e) {
                $this->error($e->getMessage());
                DB::rollBack();
            } finally {
                $this->selected = [];
                $this->showModal = false;
            }
        });
    }

    public function render()
    {
        return view('livewire.patients.index');
    }
}
