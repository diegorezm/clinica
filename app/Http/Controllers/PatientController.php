<?php

namespace App\Http\Controllers;

use App\Models\Patient;

class PatientController extends Controller
{
    public function index()
    {
        return view('pages.patients.index');
    }

    public function create()
    {
        return view('pages.patients.create');
    }

    public function show(Patient $patient)
    {
        return view('pages.patients.show', [
            'patient' => $patient
        ]);
    }

    public function update(Patient $patient)
    {
        return view('pages.patients.update', [
            'patient' => $patient
        ]);
    }
}
