<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\PatientReferral;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'role' => 'admin',
            'password' => Hash::make('admin'),
        ]);

        User::factory()->count(20)->create();
        User::query()->inRandomOrder()->limit(10)->get()
            ->each(function (User $user) {
                $user->update(['role' => 'doctor']);
                Doctor::factory()->create([
                    'user_id' => $user->id,
                ]);
            });

        Patient::factory()->count(100)->create();
        Patient::query()->get()
            ->each(function (Patient $patient) {
                PatientReferral::factory()->count(10)->create([
                    'patient_id' => $patient->id
                ]);
            });

        Appointment::factory()->count(30)->create();
    }
}
