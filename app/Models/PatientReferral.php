<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientReferral extends Model
{
    /** @use HasFactory<\Database\Factories\PatientReferralFactory> */
    use HasFactory;

    public $fillable = [
        'patient_id',
        'doctor_specialty',
        'cid',
        'crm',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }
}
