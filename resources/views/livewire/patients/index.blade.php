<div>
    <!-- HEADER -->
    <x-header title="Pacientes" separator progress-indicator>
        <x-slot:middle class="!justify-end">
            <x-input placeholder="Procure por nome/rg..." wire:model.live.debounce.300ms="search" clearable
                icon="o-magnifying-glass" />
        </x-slot:middle>
    </x-header>

    <!-- TABLE  -->
    <x-card>
        <x-table :headers="$headers" :rows="$patients" :sort-by="$sortBy" with-pagination per-page="perPage"
            :per-page-values="[5, 8, 10, 15]">
        </x-table>
    </x-card>
</div>
