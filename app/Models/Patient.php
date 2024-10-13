<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    /** @use HasFactory<\Database\Factories\PatientFactory> */
    use HasFactory;


    public $fillable = [
        'name',
        'phone',
        'rg',
        'insurance',
        'insurance_number',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function referrals()
    {
        return $this->hasMany(PatientReferral::class);
    }
}
