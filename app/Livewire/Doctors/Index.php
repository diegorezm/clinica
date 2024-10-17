<?php

namespace App\Livewire\Doctors;

use App\Models\Doctor;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Livewire\WithPagination;
use Mary\Traits\Toast;

class Index extends Component
{

    use Toast, WithPagination;

    public string $search = '';

    public int $perPage = 10;

    public array $selected = [];

    public bool $showModal = false;

    public array $sortBy = ['column' => 'id', 'direction' => 'asc'];

    #[Computed()]
    public function headers()
    {
        return [
            ['key' => 'id', 'label' => '#', 'class' => 'text-primary'],
            ['key' => 'user.name', 'label' => 'Nome', 'sortable' => false],
            ['key' => 'user.email', 'label' => 'Email', 'sortable' => false],
            ['key' => 'specialty', 'label' => 'Especialidade', 'sortable' => false],
            ['key' => 'crm', 'label' => 'CRM', 'sortable' => false],
        ];
    }

    #[Computed()]
    public function doctors()
    {
        $query = Doctor::with('user:id,name,email')
            ->select('id', 'user_id', 'crm', 'specialty');

        if ($this->search) {
            $query->whereHas('user', function ($q) {
                $q->where('name', 'like', "%{$this->search}%");
            })
                ->orWhere('crm', 'like', "%{$this->search}%")
                ->orWhere('cid', 'like', "%{$this->search}%");
        }
        $query->orderBy($this->sortBy['column'], $this->sortBy['direction']);
        return $query->paginate($this->perPage);
    }

    public function delete()
    {
        if (Gate::allows('admin', Auth::user())) {
            Doctor::destroy($this->selected);
            $this->success('Médico removido com sucesso.', position: 'toast-bottom');
            $this->showModal = false;
        } else {
            $this->showModal = false;
            $this->error('Acesso negado.', position: 'toast-bottom');
        }
    }

    public function render()
    {
        return view('livewire.doctors.index');
    }
}
