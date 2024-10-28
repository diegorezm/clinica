<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Doctor>
 */
class DoctorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'crm' => (string) fake()->numberBetween(100000, 999999),
            'specialty' => fake()->jobTitle(),
            'period' => fake()->text(10),
            'user_id' => User::class
        ];
    }
}
