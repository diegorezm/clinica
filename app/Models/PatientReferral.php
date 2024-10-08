<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientReferral extends Model
{
    /** @use HasFactory<\Database\Factories\PatientReferralFactory> */
    use HasFactory;

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
