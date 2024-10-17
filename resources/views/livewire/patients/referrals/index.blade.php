<div>
    <x-card title="Encaminhamentos" class="space-y-4" shadow>
        <div class="flex flex-col lg:flex-row lg:justify-between w-full gap-2">
            <div class="w-full">
                <x-input placeholder="Procure por CID/CRM/Função..." wire:model.live.debounce.300ms="search" clearable
                    icon="o-magnifying-glass" class="w-full" />
            </div>
            <x-button label="Novo" icon="o-plus" class="btn-primary"
                link="/dashboard/patients/referrals/create/{{ $patient->id }}" />

            <x-buttons.bulkdelete />

        </div>
        <x-table class="mt-2" :headers="$this->headers" selectable wire:model="selected" :rows="$this->referrals" :sort-by="$sortBy"
            with-pagination>
            <x-slot:empty>
                <x-icon name="o-cube" label="A tabela esta vazia." />
            </x-slot:empty>
            @scope('cell_created_at', $referral)
                {{ $referral->created_at->format('d/m/Y') }}
            @endscope
            @scope('actions', $referral)
                <x-button icon="o-pencil" title="Editar" class="btn-outline btn-sm"
                    link="/dashboard/patients/referrals/update/{{ $referral->patient_id }}" />
            @endscope
        </x-table>
    </x-card>
    <x-modal.bulkdelete />
</div>
