<?php

use App\Models\Doctor;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('doctor_working_hours', function (Blueprint $table) {
            $table->id();
            $table->enum('day', ['1', '2', '3', '4', '5', '6']);
            $table->unsignedSmallInteger('interval')->default(40);
            $table->time('start_time');
            $table->time('end_time');
            $table->foreignIdFor(Doctor::class);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctor_working_hours');
    }
};