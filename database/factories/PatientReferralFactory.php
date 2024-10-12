<?php

namespace Database\Factories;

use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PatientReferral>
 */
class PatientReferralFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'cid' => fake()->numberBetween(100000000, 999999999),
            'crm' => fake()->numberBetween(100000, 999999),
            'doctor_fn' => fake()->jobTitle(),
            'patient_id' => Patient::class,
        ];
    }
}
