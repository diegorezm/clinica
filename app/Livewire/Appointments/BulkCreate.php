<?php

namespace App\Livewire\Appointments;

use App\Models\Appointment;
use App\Models\Doctor;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class BulkCreate extends Form
{
    public string $startDate;
    public string $endDate;
    public int $interval = 7;

    public function mount()
    {
        $this->startDate = date('Y-m-d');
        $this->endDate = now()->addDays(1)->format('Y-m-d');
        $this->time = '00:00';
        $this->doctorSearch();
        $this->patientSearch();
    }

    public function submit()
    {
        $rules = array_diff_key($this->appointmentRules(), array_flip(['date']));
        $this->validate(array_merge($rules, [
            'startDate' => 'required|date|afterOrEqual:today',
            'endDate' => 'required|date|after:today|after:startDate',
            'interval' => 'required|integer|min:1',
        ]), [
            'startDate.required' => 'O campo de data de início é obrigatório.',
            'startDate.date' => 'O campo de data de início deve ser uma data válida.',
            'startDate.after_or_equal' => 'A data de início deve ser hoje ou uma data futura.',

            'endDate.required' => 'O campo de data de término é obrigatório.',
            'endDate.date' => 'O campo de data de término deve ser uma data válida.',
            'endDate.after' => 'A data de término deve ser após a data de início.',

            'patient_id.required' => 'O paciente é obrigatório.',
            'doctor_id.required' => 'O médico é obrigatório.',

            'time.required' => 'O horário é obrigatório.',
        ]);

        $startDate = DateTime::createFromFormat('Y-m-d', $this->startDate);
        $endDate = DateTime::createFromFormat('Y-m-d', $this->endDate);
        $time = DateTime::createFromFormat('H:i', $this->time);
        $startDate->setTime($time->format('H'), $time->format('i'));
        $currentDate = clone $startDate;
        $doctor = Doctor::find($this->doctor_id);

        if (!$doctor) {
            Log::error('Doctor not found with ID: ' . $this->doctor_id);
            throw ValidationException::withMessages(['doctor_id' => 'Médico não encontrado.']);
        }

        $workDays = $doctor->workDays()->pluck('day')->toArray();
        Log::info('Work days for doctor: ' . implode(',', $workDays));

        DB::beginTransaction();
        try {
            Log::info('Transaction started.');

            while ($currentDate <= $endDate) {
                $c = Carbon::instance($currentDate);
                Log::info('Current date: ' . $c->format('Y-m-d'));
                if (!in_array($c->dayOfWeek, $workDays)) {
                    throw ValidationException::withMessages([
                        'startDate' => 'O médico não trabalha no dia ' . $c->format('d/m/Y') . '.',
                    ]);
                }

                Appointment::create([
                    'date' => $currentDate->format('Y-m-d H:i:s'),
                    'status' => $this->status,
                    'doctor_id' => $this->doctor_id,
                    'patient_id' => $this->patient_id,
                    'obs' => $this->obs,
                ]);
                $currentDate->modify("+{$this->interval} days");
            }
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            $this->error("Erro ao marcar consultas.");
            throw $e;
        }

        DB::commit();
        $this->success('Consultas marcadas.');
        sleep(1);
        return redirect('/dashboard/appointments');
    }

    public function render()
    {
        return view('livewire.appointments.bulk-create');
    }
}
