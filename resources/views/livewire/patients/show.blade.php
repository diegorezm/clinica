<div class="space-y-4">

    <x-button link="{{ url()->previous() }}" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
    <x-card title="Paciente" shadow separator>
        <div class="flex flex-col space-y-2">
            <div>
                <strong>Nome:</strong> {{ $patient->name }}
            </div>
            <div>
                <strong>Telefone:</strong> {{ $patient->phone }}
            </div>
            <div>
                <strong>RG:</strong> {{ $patient->rg }}
            </div>
            <div>
                <strong>Convênio:</strong> {{ $patient->insurance }}
            </div>
            <div>
                <strong>Número da carteira:</strong> {{ $patient->insurance_number }}
            </div>
        </div>

        <x-slot:actions>
            <x-button icon="o-pencil" label="Editar" class="btn-primary"
                link="/dashboard/patients/update/{{ $patient->id }}" />
            <x-button label="Deletar" icon="o-trash" @click="$wire.showModal = true" class="btn-error" />
        </x-slot:actions>
    </x-card>

    <livewire:patients.referrals.index :$patient />

    <x-modal.delete />
</div>
