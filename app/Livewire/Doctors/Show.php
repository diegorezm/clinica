<?php

namespace App\Livewire\Doctors;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Livewire\Component;
use Mary\Traits\Toast;
use PhpParser\Node\Stmt\TryCatch;

class Show extends Component
{
    use Toast;
    public User $user;
    public Doctor $doctor;

    public bool $showModal = false;

    public function mount(Doctor $doctor)
    {
        $this->doctor = $doctor;
        $this->user = $doctor->user;
    }

    public function delete()
    {
        try {
            if (Gate::allows('admin', Auth::user())) {
                $this->doctor->delete();
                $this->showModal = false;
                $this->success('Doutor excluído com sucesso!');
                sleep(1);
                return redirect('/dashboard/doctors');
            }
            $this->showModal = false;
            $this->error('Voce não tem permissão para realizar essa ação!');
        } catch (\Exception $th) {
            $this->showModal = false;
            $this->error("Não foi possível excluir o doutor. Tente novamente mais tarde.");
        }
        return;
    }

    public function render()
    {
        return view('livewire.doctors.show');
    }
}
