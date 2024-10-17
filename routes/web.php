<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PatientReferralController;
use Illuminate\Http\Request;

Route::get("/", fn () => redirect('/dashboard/patients'));


Route::view('/login', 'pages.login');

Route::post('/logout', function (Request $request) {
    Auth()->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login');
})->name('logout');


Route::group(['prefix' => 'dashboard', 'middleware' => AuthMiddleware::class], function () {
    Route::group(['prefix' => 'patients'], function () {
        Route::get("/", [PatientController::class, 'index']);
        Route::get("/create", [PatientController::class, 'create']);
        Route::get("/update/{patient}", [PatientController::class, 'update']);
        Route::get("/show/{patient}", [PatientController::class, 'show']);
        Route::group(['prefix' => 'referrals'], function () {
            Route::get("/create", [PatientReferralController::class, 'create'])->name('referrals.create');
            Route::get("/update/{referral}", [PatientReferralController::class, 'update'])->name('referrals.update');
        });
    });

    Route::group(['prefix' => 'doctors'], function () {
        Route::get("/", [DoctorController::class, 'index']);
        Route::get("/create", [DoctorController::class, 'create']);
        Route::get("/update/{doctor}", [DoctorController::class, 'update']);
        Route::get("/show/{doctor}", [DoctorController::class, 'show']);
    });

    Route::group(['prefix' => 'appointments'], function () {
        Route::get("/", [AppointmentController::class, 'index']);
        Route::get("/create", [AppointmentController::class, 'create'])->name('appointments.create');
        Route::get("/update/{appointment}", [AppointmentController::class, 'update']);
        Route::get("/show/{appointment}", [AppointmentController::class, 'show']);
    });
});
