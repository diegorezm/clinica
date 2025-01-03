<?php

namespace App\Livewire\Doctors;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Mary\Traits\Toast;
use App\Enums\DaysOfTheWeek;

class Show extends Component
{
    use Toast;
    public User $user;
    public Doctor $doctor;
    public array $workHours = [];
    public array $workDays = [];
    public bool $showModal = false;
    public string $selectedTab = '0';

    public function mount(Doctor $doctor)
    {
        $this->doctor = $doctor;
        $this->user = $doctor->user;

        $this->workDays = $doctor->workDays()->select('day')->pluck('day')->toArray();

        foreach ($doctor->workHours->sortBy('day') as $hour) {
            $day = $hour->day;
            if (!isset($this->workHours[$day])) {
                $this->workHours[$day] = [];
            }
            $this->workHours[$day][] = [
                'start_time' => $hour->start_time,
                'end_time' => $hour->end_time,
                'interval' => $hour->interval,
            ];
        }
    }

    public function delete()
    {
        if (Gate::allows('admin', Auth::user())) {
            DB::transaction(function () {
                try {
                    $this->doctor->user->delete();
                    $this->doctor->delete();
                    $this->success('Doutor excluído com sucesso!');
                    $this->showModal = false;
                    sleep(1);
                    return redirect('/dashboard/doctors');
                } catch (\Exception $e) {
                    Log::error($e->getMessage());
                    $this->error($e->getMessage());
                    DB::rollBack();
                }
            });
        } else {
            $this->showModal = false;
            $this->error('Voce não tem permissão para realizar essa ação!');
            return;
        }
    }

    #[Computed()]
    protected function getDayName($day_id)
    {
        return [
            DaysOfTheWeek::Segunda->value => DaysOfTheWeek::Segunda->getName(),
            DaysOfTheWeek::Terça->value => DaysOfTheWeek::Terça->getName(),
            DaysOfTheWeek::Quarta->value => DaysOfTheWeek::Quarta->getName(),
            DaysOfTheWeek::Quinta->value => DaysOfTheWeek::Quinta->getName(),
            DaysOfTheWeek::Sexta->value => DaysOfTheWeek::Sexta->getName(),
            DaysOfTheWeek::Sábado->value => DaysOfTheWeek::Sábado->getName(),
        ][$day_id];
    }

    #[Computed()]
    public function showWorkDays()
    {
        $sortedWorkDays = $this->doctor->workDays()->orderBy('day')->get();
        return $sortedWorkDays->map(fn ($workDay) => $workDay->day_name)->toArray();
    }

    public function render()
    {
        return view('livewire.doctors.show');
    }
}
