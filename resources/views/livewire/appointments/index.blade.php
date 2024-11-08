<div>
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
            <x-button label="Novo" icon="o-plus" class="btn-primary" :link="route('appointments.create', [
                'doctorId' => $filters['doctor'] ?? null,
                'patientId' => $filters['patient'] ?? null,
            ])" responsive />
            <x-buttons.bulkdelete />
        </x-slot:actions>
    </x-header>

    <div class="hidden md:flex flex-col gap-2">
        <h2>Filtrando por: </h2>
        <div class="flex gap-2">
            <x-badge value="Ano: {{ $filters['year'] ?? 'Todos' }}" class="badge-primary" />
            <x-badge value="Mês: {{ $this->getMonthName($filters['month']) }}" class="badge-primary" />
            @if ($filters['day'])
                <x-badge value="Dia: {{ $this->formatDate($filters['day']) }}" class="badge-primary" />
            @endif
            @if ($filters['status'])
                <x-badge value="Status: {{ $this->getStatusName($filters['status']) }}" class="badge-primary" />
            @endif

        </div>
    </div>
    <!-- TABLE  -->
    <x-card class="mt-4">
        <x-table :headers="$this->headers" selectable wire:model="selected" :rows="$this->appointments" :sort-by="$sortBy"
            link="/dashboard/appointments/show/{id}" with-pagination>
            <x-slot:empty>
                <x-icon name="o-cube" label="A tabela esta vazia." />
            </x-slot:empty>
            @scope('cell_date', $appointment)
                {{ $appointment->date->format('d/m/Y') }}
            @endscope
            @scope('cell_hour', $appointment)
                {{ $appointment->date->format('H:i') }}
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

            <x-input label="Dia" wire:model.live="filters.day" type="date">
                <x-slot:append>
                    <x-button label="Hoje" class="btn-primary rounded-s-none" wire:click="setDayToCurrentDay" />
                </x-slot:append>
            </x-input>

            <x-input label="Horario" wire:model.live="filters.time" type="time" />
            <x-choices label="Status" wire:model.live="filters.status" :options="$this->statusOpts()" single />
            <x-button label="Limpar" class="btn-primary" wire:click="clear" icon="m-bars-3-bottom-left" />
        </div>
    </x-drawer>
</div>
