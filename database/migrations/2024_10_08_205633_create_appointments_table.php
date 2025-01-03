<?php

use App\Models\Doctor;
use App\Models\Patient;
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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date');
            // pendente, falta, falta justificada, falta do médico, ok
            $table->enum('status', ['p', 'f', 'fj', 'fm', 'ok'])->default('p');
            $table->string('obs')->nullable();
            $table->foreignIdFor(Doctor::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(Patient::class)->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
