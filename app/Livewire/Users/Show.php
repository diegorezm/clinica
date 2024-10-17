<?php

namespace App\Livewire\Users;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Livewire\Component;
use Mary\Traits\Toast;

class Show extends Component
{
    use Toast;
    public User $user;
    public bool $showModal = false;
    public function mount(User $user)
    {
        $this->user = $user;
    }
    public function delete()
    {
        DB::transaction(function () {
            try {
                $this->user->delete();
                $this->toast('success', 'Usuário excluído com sucesso!');
                sleep(1);
                return redirect('/dashboard/users');
            } catch (\Exception $e) {
                DB::rollBack();
                $this->toast('error', $e->getMessage());
                throw $e;
            }
        });
    }

    public function render()
    {
        return view('livewire.users.show');
    }
}
