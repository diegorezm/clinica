<div>
    <!-- HEADER -->
    <x-header title="Doutores" separator progress-indicator>
        <x-slot:middle class="!justify-end">
            <x-input placeholder="Procure por nome/crm..." wire:model.live.debounce.300ms="search" clearable
                icon="o-magnifying-glass" />
        </x-slot:middle>
        <x-slot:actions>
            <x-button label="Novo" icon="o-plus" class="btn-primary" link="/dashboard/doctors/create" />
        </x-slot:actions>
    </x-header>

    <!-- TABLE  -->
    <x-card>
        <x-table :headers="$this->headers" :rows="$this->doctors" :sort-by="$sortBy" link="/dashboard/doctors/show/{id}"
            with-pagination>
            <x-slot:empty>
                <x-icon name="o-cube" label="A tabela esta vazia." />
            </x-slot:empty>
        </x-table>
    </x-card>
</div>
