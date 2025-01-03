<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\DoctorWorkDays;
use App\Models\DoctorWorkingHour;
use App\Models\Patient;
use App\Models\PatientReferral;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'role' => 'admin',
            'password' => Hash::make('admin'),
        ]);

        User::factory()->create([
            'name' => 'normalguy',
            'email' => 'regularguy@admin.com',
            'role' => 'regular',
            'password' => Hash::make('regular'),
        ]);

        $regularDoctor = User::factory()->create([
            'name' => 'doctorguy',
            'email' => 'doctorguy@admin.com',
            'role' => 'doctor',
            'password' => Hash::make('regular'),
        ]);

        Doctor::factory()->create([
            'user_id' => $regularDoctor->id
        ]);

        User::factory()->count(50)->create();
        User::query()->inRandomOrder()->limit(30)->get()
            ->each(function (User $user) {
                if ($user->role !== 'admin') {
                    $user->update(['role' => 'doctor']);
                    Doctor::factory()->create([
                        'user_id' => $user->id,
                    ]);
                }
            });

        Doctor::query()->inRandomOrder()->get()
            ->each(function (Doctor $doctor) {
                DoctorWorkDays::factory()->count(3)->create([
                    'doctor_id' => $doctor->id
                ]);
                DoctorWorkingHour::factory()->count(3)->create([
                    'doctor_id' => $doctor->id
                ]);
            });

        Patient::factory()->count(50)->create();
        Patient::query()->get()
            ->each(function (Patient $patient) {
                PatientReferral::factory()->count(5)->create([
                    'patient_id' => $patient->id
                ]);
            });

        Appointment::factory()->count(30)->create();
    }
}
