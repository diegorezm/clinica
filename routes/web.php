<?php


use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatientController;
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
    });
});
