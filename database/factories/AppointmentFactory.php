<?php

namespace Database\Factories;

use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'date' => fake()->dateTime(),
            'status' => fake()->randomElement(['p', 'f', 'fj', 'fm', 'ok']),
            'doctor_id' => Doctor::inRandomOrder()->first()->id,
            'patient_id' => Patient::inRandomOrder()->first()->id,
        ];
    }
}
