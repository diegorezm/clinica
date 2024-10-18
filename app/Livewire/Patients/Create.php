<?php

namespace App\Livewire\Patients;

use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class Create extends Form
{
    public function submit()
    {
        $this->validation();
        DB::transaction(function () {
            try {
                Patient::create([
                    'name' => $this->name,
                    'phone' => $this->phone,
                    'rg' => $this->rg ?: null,
                    'insurance' => $this->insurance,
                    'insurance_number' => $this->insurance_number,
                ]);
                $this->reset();
                $this->success('Registro criado com sucesso.', position: 'toast-bottom');
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
        return view('livewire.patients.create');
    }
}
