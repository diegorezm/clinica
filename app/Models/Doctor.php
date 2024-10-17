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

    public function workDays()
    {
        return $this->hasMany(DoctorWorkDays::class);
    }

    public function workPeriods()
    {
        return $this->hasMany(DoctorWorkPeriod::class);
    }

    public function casts()
    {
        return [];
    }
}
