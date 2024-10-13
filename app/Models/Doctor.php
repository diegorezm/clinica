<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\DaysOfTheWeek;

class Doctor extends Model
{
    /** @use HasFactory<\Database\Factories\DoctorFactory> */
    use HasFactory;

    public $fillable = [
        'crm',
        'specialty',
        'work_periods',
        'work_days',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function workDaysNames()
    {
        return array_map(function ($dayCode) {
            return DaysOfTheWeek::from($dayCode)->getNome();
        }, $this->work_days);
    }

    public function casts()
    {
        return [
            'work_periods' => 'array',
            'work_days' => 'array',
        ];
    }
}
