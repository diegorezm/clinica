<?php

namespace App\Livewire\Users;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class Update extends Form
{
    public User $user;

    public function mount(User $user)
    {
        $this->name = $user->name;
        $this->email = $user->email;
        $this->role = $user->role;
        $this->user = $user;
    }

    public function submit()
    {
        DB::transaction(function () {
            try {
                $this->user->update([
                    'name' => $this->name,
                    'email' => $this->email,
                    'role' => $this->role,
                ]);
                return redirect('/dashboard/users/show/' . $this->user->id);
            } catch (\Exception $e) {
                DB::rollBack();
                $this->error($e->getMessage());
                throw $e;
            }
        });
    }

    public function render()
    {
        return view('livewire.users.update');
    }
}
