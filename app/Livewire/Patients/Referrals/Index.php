<?php

namespace App\Livewire\Patients\Referrals;

use App\Models\Patient;
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

    public int $toDeleteReferralId = -1;

    public array $sortBy = ['column' => 'cid', 'direction' => 'asc'];

    public function mount(Patient $patient)
    {
        $this->patient = $patient;
    }

    #[Computed()]
    public function referrals()
    {
        return $this->patient->referrals()
            ->when($this->search, fn ($query) => $query->where('doctor_fn', 'like', "%{$this->search}%")->orWhere('cid', 'like', "%{$this->search}%")->orWhere('crm', 'like', "%{$this->search}%"))
            ->orderBy($this->sortBy['column'], $this->sortBy['direction'])
            ->paginate($this->perPage);
    }

    #[Computed()]
    public function headers()
    {
        return [
            ['key' => 'cid', 'label' => 'CID'],
            ['key' => 'crm', 'label' => 'CRM', 'sortable' => false],
            ['key' => 'doctor_fn', 'label' => 'Função', 'sortable' => false],
            ['key' => 'created_at', 'label' => 'Criado em', 'sortable' => false],
        ];
    }

    public function delete()
    {
        $this->patient->referrals()->where('id', $this->toDeleteReferralId)->delete();
        $this->success('Encaminhamento removido com sucesso.', position: 'toast-bottom');
        $this->showModal = false;
        $this->toDeleteReferralId = -1;
    }

    public function render()
    {
        return view('livewire.patients.referrals.index');
    }
}
