<?php

namespace App\Livewire\Patients;

use App\Models\Patient;
use Livewire\Component;
use Livewire\WithPagination;
use Mary\Traits\Toast;

class Index extends Component
{
    use Toast, withPagination;

    public string $search = '';

    public int $perPage = 10;

    public array $sortBy = ['column' => 'id', 'direction' => 'asc'];

    // Clear filters
    public function clear(): void
    {
        $this->reset();
        $this->success('Filters cleared.', position: 'toast-bottom');
    }

    public function headers(): array
    {
        return [['key' => 'id', 'label' => '#'], ['key' => 'name', 'label' => 'Nome'], ['key' => 'phone', 'label' => 'Tel'], ['key' => 'rg', 'label' => 'RG'], ['key' => 'insurance', 'label' => 'Convenio', 'sortable' => false], ['key' => 'insurance_number', 'label' => 'N', 'sortable' => false]];
    }

    public function patients()
    {
        return Patient::when($this->search, fn ($query) => $query->where('name', 'like', "%{$this->search}%")->orWhere('rg', 'like', "%{$this->search}%"))
            ->orderBy($this->sortBy['column'], $this->sortBy['direction'])
            ->paginate($this->perPage);
    }

    public function render()
    {
        return view('livewire.patients.index', [
            'patients' => $this->patients(),
            'headers' => $this->headers(),
            'perPage' => $this->perPage,
            'sortBy' => $this->sortBy,
            'search' => $this->search,
        ]);
    }
}
