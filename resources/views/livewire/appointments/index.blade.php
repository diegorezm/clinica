<div>
    <!-- HEADER -->
    <x-header title="Consultas" separator progress-indicator>
        <x-slot:middle class="!justify-end">
            <x-input placeholder="Procure por nome/rg..." wire:model.live.debounce.300ms="search"
                icon="o-magnifying-glass">
                <x-slot:append>
                    <x-button label="Filtrar" icon="o-funnel" class="btn-primary rounded-s-none"
                        @click="$wire.showDrawer = true" responsive />
                </x-slot:append>
            </x-input>
        </x-slot:middle>
        <x-slot:actions>
            <x-button label="Novo" icon="o-plus" class="btn-primary" link="/dashboard/appointments/create" />
            <x-buttons.bulkdelete />
        </x-slot:actions>
    </x-header>

    <!-- TABLE  -->
    <x-card>
        <x-table :headers="$this->headers" selectable wire:model="selected" :rows="$this->appointments" :sort-by="$sortBy"
            link="/dashboard/appointments/show/{id}" with-pagination>
            <x-slot:empty>
                <x-icon name="o-cube" label="A tabela esta vazia." />
            </x-slot:empty>
            @scope('cell_date', $appointment)
                {{ $appointment->date->format('d/m/Y, H:i') }}
            @endscope
            @scope('cell_status', $appointment)
                <x-appointments.status :status="$appointment->status" />
            @endscope
        </x-table>
    </x-card>

    <x-modal.bulkdelete />
    <x-drawer class="w-full lg:w-1/3" wire:model="showDrawer" title="Filtros" right separator with-close-button>
        <div class="w-full space-y-4">
            <x-input placeholder="Procure por nome/rg..." label="Procurar" wire:model.live.debounce.300ms="search"
                icon="o-magnifying-glass" />
            <x-choices-offline label="Ano" type="year" wire:model.live="filters.year" icon="o-calendar"
                :options="$this->yearOpts()" single searchable placeholder="Selecione..." />
            <x-choices-offline label="Mês" wire:model.live="filters.month" :options="$this->monthOpts()" single searchable
                placeholder="Selecione..." />
            <x-choices label="Status" wire:model.live="filters.status" :options="$this->statusOpts()" single />
            <x-button label="Limpar" class="btn-primary" wire:click="clear" icon="m-bars-3-bottom-left" />
        </div>
    </x-drawer>
</div>
