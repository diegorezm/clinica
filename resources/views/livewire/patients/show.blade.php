<div>
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
    <x-modal wire:model="showModal" title="Tem certeza?"
        subtitle="Tem certeza de que deseja deletar este registro? Esta ação é permanente e o registro não poderá ser recuperado.">
        <x-slot:actions>
            <x-button label="Cancelar" @click="$wire.showModal = false" />
            <x-button label="Deletar" class="btn-error" wire:click="delete" spinner />
        </x-slot:actions>
    </x-modal>

</div>
