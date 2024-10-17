<?php

namespace App\Livewire\Doctors;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Mary\Traits\Toast;

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
        if (Gate::allows('admin', Auth::user())) {
            $this->doctor->delete();
            $this->showModal = false;
            $this->success('Doutor excluído com sucesso!');
            sleep(1);
            return redirect('/dashboard/doctors');
        }
        $this->showModal = false;
        $this->error('Voce não tem permissão para realizar essa ação!');
        return;
    }

    #[Computed()]
    public function showWorkDays()
    {
        $sortedWorkDays = $this->doctor->workDays()->orderBy('day')->get();
        return $sortedWorkDays->map(fn ($workDay) => $workDay->day_name)->toArray();
    }

    #[Computed()]
    public function showWorkPeriods()
    {
        $sortedWorkPeriods = $this->doctor->workPeriods()->orderBy('period')->get();
        return $sortedWorkPeriods->map(fn ($workPeriod) => $workPeriod->period_name)->toArray();
    }

    public function render()
    {
        return view('livewire.doctors.show');
    }
}
