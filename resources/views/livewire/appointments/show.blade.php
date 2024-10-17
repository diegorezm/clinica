<div class="space-y-4">
    <x-button link="/dashboard/appointments" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
    <x-card title="Consulta" shadow separator>
        <div class="flex flex-col space-y-2">
            <div>
                <strong>Doutor:</strong> <x-button label="{{ $appointment->doctor->user->name }}"
                    link="/dashboard/doctors/show/{{ $appointment->doctor->id }}" class="btn-sm btn-ghost" />
            </div>
            <div>
                <strong>Paciente:</strong> <x-button label="{{ $appointment->patient->name }}"
                    link="/dashboard/patients/show/{{ $appointment->patient->id }}" class="btn-sm btn-ghost" />
            </div>
            <div>
                <strong>Data:</strong> {{ $appointment->date->format('d/m/Y') }}
            </div>
            <div>
                <strong>Horario:</strong> {{ $appointment->date->format('H:i') }}
            </div>
            @if ($appointment->obs)
                <div>
                    <strong>Observação:</strong>
                    <p class="text-left">{{ $appointment->obs }}</p>
                </div>
            @endif
            <div>
                <x-appointments.status :status="$appointment->status" />
            </div>
            <div>
            </div>
            @if (Auth::user()->role == 'admin')
                <x-slot:actions>
                    <x-button icon="o-pencil" label="Editar" class="btn-primary"
                        link="/dashboard/appointments/update/{{ $appointment->id }}" />
                    <x-button label="Deletar" icon="o-trash" @click="$wire.showModal = true" class="btn-error" />
                </x-slot:actions>
            @endif
    </x-card>
    <x-modal.delete />
</div>
