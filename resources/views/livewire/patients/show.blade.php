<div class="space-y-10">

    <x-button link="/dashboard/patients" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
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
    <x-tabs wire:model="selectedTab">
        <x-tab name="referrals" label="Referências" icon="o-users">
            <livewire:patients.referrals.index :$patient />
        </x-tab>
        <x-tab name="appointments" label="Consultas" icon="o-calendar">
            <livewire:appointments.index :patient_id="$patient->id" />
        </x-tab>
    </x-tabs>
    <x-modal.delete />
</div>
