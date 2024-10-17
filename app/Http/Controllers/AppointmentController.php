<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

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
}
