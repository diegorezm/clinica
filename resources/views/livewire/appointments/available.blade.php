<div>
    <x-header title="Horarios disponiveis" separator progress-indicator>
        <x-slot:middle class="!justify-end">
            <x-input placeholder="Procure por nome/crm..." wire:model.live.debounce.300ms="filters.search" clearable
                icon="o-magnifying-glass">

                <x-slot:append>
                    <x-button label="Filtrar" icon="o-funnel" class="btn-primary rounded-s-none"
                        @click="$wire.showDrawer = true" responsive />
                </x-slot:append>
            </x-input>
        </x-slot:middle>

    </x-header>

    <x-card>
        <x-table :headers="$this->headers" :rows="$this->availableTimes"
            link="/dashboard/appointments/create?time={time}&date={date}&doctorId={doctor_id}">

            <x-slot:empty>
                <x-icon name="o-cube" label="A tabela esta vazia." />
            </x-slot:empty>
        </x-table>
    </x-card>

    <x-drawer class="w-full lg:w-1/3" wire:model="showDrawer" title="Filtros" right separator with-close-button>
        <div class="space-y-4">
            <x-input placeholder="Procure por nome/crm..." wire:model.live.debounce.300ms="filters.search" clearable
                icon="o-magnifying-glass" />
            <x-choices-offline label="Ano" wire:model.live="filters.year" :options="$this->yearOpts()" single searchable
                placeholder="Selecione..." />

            <x-choices-offline label="Mês" wire:model.live="filters.month" :options="$this->monthOpts()" single searchable
                placeholder="Selecione..." />

            <x-choices-offline label="Dia" wire:model.live="filters.day_of_the_week" :options="$this->workDaysOpts()" single
                searchable placeholder="Selecione..." />

            <x-button label="Limpar" class="btn-primary" wire:click="clear" icon="m-bars-3-bottom-left" />
        </div>
    </x-drawer>
</div>
