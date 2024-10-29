<?php

namespace Database\Factories;

use App\Models\Doctor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DoctorWorkingHour>
 */
class DoctorWorkingHourFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = \Carbon\Carbon::createFromFormat('H:i', $this->faker->date('H:i'));
        $duration = $this->faker->numberBetween(30, 120);
        $endTime = $startTime->copy()->addMinutes($duration);
        return [
            'start_time' => $startTime->format('H:i:s'),
            'end_time' => $endTime->format('H:i:s'),
            'day' => $this->faker->numberBetween(1, 6),
            'doctor_id' => Doctor::class,
        ];
    }
}
