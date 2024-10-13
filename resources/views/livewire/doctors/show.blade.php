<div class="space-y-4">

    <x-button link="/dashboard/patients" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
    <x-card title="Doutor" shadow separator>
        <div class="flex flex-col space-y-2">
            <div>
                <strong>Nome:</strong> {{ $user->name }}
            </div>
            <div>
                <strong>Email:</strong> {{ $user->email }}
            </div>
            <div>
                <strong>CRM:</strong> {{ $doctor->crm }}
            </div>
            <div>
                <strong>Especialidade:</strong> {{ $doctor->specialty }}
            </div>
        </div>

        <x-slot:actions>
            <x-button icon="o-pencil" label="Editar" class="btn-primary"
                link="/dashboard/doctors/update/{{ $doctor->id }}" />
            <x-button label="Deletar" icon="o-trash" @click="$wire.showModal = true" class="btn-error" />
        </x-slot:actions>
    </x-card>
    <x-modal.delete />
</div>
