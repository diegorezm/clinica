<div>
    <!-- HEADER -->
    <x-header title="Doutores" separator progress-indicator>
        <x-slot:middle class="!justify-end">
            <x-input placeholder="Procure por nome/crm..." wire:model.live.debounce.300ms="search" clearable
                icon="o-magnifying-glass" />
        </x-slot:middle>
        @if (Auth::user()->role == 'admin')
            <x-slot:actions>
                <x-button label="Novo" icon="o-plus" class="btn-primary" link="/dashboard/doctors/create" />
                <x-buttons.bulkdelete />
            </x-slot:actions>
        @endif
    </x-header>

    <!-- TABLE  -->
    <x-card>
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
</div>
