<?php

namespace App\Livewire\Patients\Referrals;

use App\Models\Patient;
use App\Models\PatientReferral;
use Illuminate\Support\Facades\DB;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Mary\Traits\Toast;

class Index extends Component
{
    use Toast;
    public Patient $patient;

    public string $search = '';

    public int $perPage = 10;

    public bool $showModal = false;

    public array $selected = [];

    public array $sortBy = ['column' => 'cid', 'direction' => 'asc'];

    public function mount(Patient $patient)
    {
        $this->patient = $patient;
    }

    #[Computed()]
    public function referrals()
    {
        $referrals = $this->patient->referrals();

        if ($this->search) {
            $referrals = $referrals->where('doctor_specialty', 'like', "%{$this->search}%")
                ->orWhere('cid', 'like', "%{$this->search}%")
                ->orWhere('crm', 'like', "%{$this->search}%");
        }
        return $referrals->orderBy($this->sortBy['column'], $this->sortBy['direction'])
            ->paginate($this->perPage);
    }

    #[Computed()]
    public function headers()
    {
        return [
            ['key' => 'cid', 'label' => 'CID'],
            ['key' => 'crm', 'label' => 'CRM', 'sortable' => false],
            ['key' => 'doctor_specialty', 'label' => 'Especialidade', 'sortable' => false],
            ['key' => 'created_at', 'label' => 'Criado em', 'sortable' => false],
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
            PatientReferral::destroy($this->selected);
        });
        $this->success('Encaminhamento removido com sucesso.', position: 'toast-bottom');
        $this->showModal = false;
        $this->selected = [];
    }

    public function render()
    {
        return view('livewire.patients.referrals.index');
    }
}
