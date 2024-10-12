<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\DaysOfTheWeek;
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
            'fn' => fake()->jobTitle(),
            'work_periods' => fake()->randomElements(['m', 't', 'n'], 3),
            'work_days' => fake()->randomElements([
                DaysOfTheWeek::Segunda->value,
                DaysOfTheWeek::Terça->value,
                DaysOfTheWeek::Quarta->value,
                DaysOfTheWeek::Quinta->value,
                DaysOfTheWeek::Sexta->value,
                DaysOfTheWeek::Sábado->value,
            ], 5),
            'user_id' => User::class
        ];
    }
}
