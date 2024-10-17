<div>
    <!-- HEADER -->
    <x-header title="Pacientes" separator progress-indicator>
        <x-slot:middle class="!justify-end">
            <x-input placeholder="Procure por nome/rg..." wire:model.live.debounce.300ms="search" clearable
                icon="o-magnifying-glass" class="text-pri" />
        </x-slot:middle>
        <x-slot:actions>
            <x-button label="Novo" icon="o-plus" class="btn-primary" link="/dashboard/patients/create" responsive />
            <x-buttons.bulkdelete />
        </x-slot:actions>
    </x-header>

    <!-- TABLE  -->
    <x-card>
        <x-table :headers="$this->headers" selectable wire:model="selected" :rows="$this->patients" :sort-by="$sortBy"
            link="/dashboard/patients/show/{id}" with-pagination>
            <x-slot:empty>
                <x-icon name="o-cube" label="A tabela esta vazia." />
            </x-slot:empty>
        </x-table>
    </x-card>

    <x-modal.bulkdelete />
</div>
