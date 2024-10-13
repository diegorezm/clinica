<?php

namespace App\Http\Controllers;

use App\Models\Doctor;

class DoctorController extends Controller
{
    public function index()
    {
        return view("pages.doctors.index");
    }

    public function create()
    {
        return view("pages.doctors.create");
    }

    public function update(Doctor $doctor)
    {
        return view("pages.doctors.update", [
            'doctor' => $doctor
        ]);
    }

    public function show(Doctor $doctor)
    {
        return view("pages.doctors.show", [
            'doctor' => $doctor
        ]);
    }
}
