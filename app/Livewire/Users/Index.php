<?php

namespace App\Livewire\Users;

use App\Models\User;
use Illuminate\Support\Facades\DB;
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
            ['key' => 'name', 'label' => 'Nome'],
            ['key' => 'email', 'label' => 'Email', 'sortable' => false],
            ['key' => 'role', 'label' => 'Permissão', 'sortable' => false],
        ];
    }

    #[Computed()]
    public function users()
    {
        $query = User::select('id', 'name', 'email', 'role');

        if ($this->search) {
            $query->where('name', 'like', "%{$this->search}%")
                ->orWhere('email', 'like', "%{$this->search}%");
        }

        $query->orderBy(...array_values($this->sortBy));
        return $query->paginate($this->perPage);
    }

    public function delete()
    {
        DB::transaction(function () {
            try {
                User::destroy($this->selected);
                $this->toast('success', 'Usuários excluídos com sucesso!');
                $this->reset();
                $this->showModal = false;
            } catch (\Exception $e) {
                $this->error('Erro ao excluir usuários.');
                throw $e;
            }
        });
    }

    public function render()
    {
        return view('livewire.users.index');
    }
}
