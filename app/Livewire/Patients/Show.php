<?php

namespace App\Livewire\Patients;

use App\Models\Patient;
use Illuminate\Support\Facades\DB;
use Livewire\Component;
use Mary\Traits\Toast;

class Show extends Component
{
    use Toast;

    public Patient $patient;
    public bool $showModal = false;

    public string $selectedTab = 'referrals';

    public function mount(Patient $patient)
    {
        $this->patient = $patient;
    }

    public function delete()
    {
        DB::transaction(function () {
            try {
                $this->patient->delete();
                $this->showModal = false;
                $this->success('Paciente excluído com sucesso!');
                sleep(1);
                return redirect('/dashboard/patients');
            } catch (\Exception $e) {
                $this->error($e->getMessage());
                DB::rollBack();
                throw $e;
            }
        });
    }

    public function render()
    {
        return view('livewire.patients.show');
    }
}
