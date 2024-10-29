<?php

namespace App\Http\Controllers;

use App\Models\Appointment;

class AppointmentController extends Controller
{
    public function index()
    {
        return view('pages.appointments.index');
    }

    public function create()
    {
        return view('pages.appointments.create');
    }

    public function update(Appointment $appointment)
    {
        return view('pages.appointments.update', [
            'appointment' => $appointment,
        ]);
    }

    public function show(Appointment $appointment)
    {
        return view('pages.appointments.show', [
            'appointment' => $appointment
        ]);
    }

    public function available()
    {
        return view('pages.appointments.available');
    }
}
