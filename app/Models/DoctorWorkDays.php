<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\DaysOfTheWeek;

class DoctorWorkDays extends Model
{
    /** @use HasFactory<\Database\Factories\DoctorWorkDaysFactory> */
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'day',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function getDayNameAttribute()
    {
        return DaysOfTheWeek::from($this->day)->getName();
    }
}
