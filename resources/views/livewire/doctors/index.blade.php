<div>
    <!-- HEADER -->
    <x-header title="Doutores" separator progress-indicator>
        <x-slot:middle class="!justify-end">
            <x-input placeholder="Procure por nome/crm..." wire:model.live.debounce.300ms="filters.search" clearable
                icon="o-magnifying-glass">
                <x-slot:append>
                    <x-button label="Filtrar" icon="o-funnel" class="btn-primary rounded-s-none"
                        @click="$wire.showDrawer = true" responsive />
                </x-slot:append>
            </x-input>
        </x-slot:middle>
        @if (Auth::user()->role == 'admin')
            <x-slot:actions>
                <x-button label="Novo" icon="o-plus" class="btn-primary" link="/dashboard/doctors/create"
                    responsive />
                <x-buttons.bulkdelete />
            </x-slot:actions>
        @endif

    </x-header>

    <div class="hidden md:flex flex-col gap-2">
        <h2>Filtrando por: </h2>
        <div class="flex gap-2">
            <x-badge value="Dia: {{ $this->getDayName($filters['workDay']) }}" class="badge-primary" />
        </div>
    </div>

    <!-- TABLE  -->
    <x-card class="mt-4">
        @if (Auth::user()->role == 'admin')
            <x-table :headers="$this->headers" selectable wire:model="selected" :rows="$this->doctors" :sort-by="$sortBy"
                link="/dashboard/doctors/show/{id}" with-pagination>
                <x-slot:empty>
                    <x-icon name="o-cube" label="A tabela esta vazia." />
                </x-slot:empty>
            </x-table>
        @else
            <x-table :headers="$this->headers" :rows="$this->doctors" :sort-by="$sortBy" link="/dashboard/doctors/show/{id}"
                with-pagination>
                <x-slot:empty>
                    <x-icon name="o-cube" label="A tabela esta vazia." />
                </x-slot:empty>
            </x-table>
        @endif
    </x-card>
    <x-modal.bulkdelete />

    <x-drawer class="w-full lg:w-1/3" wire:model="showDrawer" title="Filtros" right separator with-close-button>

        <div class="space-y-4">
            <x-input placeholder="Procure por nome/crm..." wire:model.live.debounce.300ms="filters.search" clearable
                icon="o-magnifying-glass" />

            <x-choices-offline label="Dia de trabalho" wire:model.live="filters.workDay" :options="$this->workDaysOpts()" single
                searchable placeholder="Selecione..." />

            <x-button label="Limpar" class="btn-primary" wire:click="clear" icon="m-bars-3-bottom-left" />
        </div>
    </x-drawer>

</div>
