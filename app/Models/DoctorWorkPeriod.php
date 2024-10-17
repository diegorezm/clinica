<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\Periods;

class DoctorWorkPeriod extends Model
{
    /** @use HasFactory<\Database\Factories\DoctorWorkPeriodFactory> */
    use HasFactory;

    protected $fillable = [
        'doctor_id',
        'period',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function getPeriodNameAttribute()
    {
        return Periods::from($this->period)->getName();
    }
}
