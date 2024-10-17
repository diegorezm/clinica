<div>
    <!-- HEADER -->
    <x-header title="Usuários" separator progress-indicator>
        <x-slot:middle class="!justify-end">
            <x-input placeholder="Procure por nome/email..." wire:model.live.debounce.300ms="search" clearable
                icon="o-magnifying-glass" />
        </x-slot:middle>
        <x-slot:actions>
            <x-button label="Novo" icon="o-plus" class="btn-primary" link="/dashboard/users/create" />
            <x-buttons.bulkdelete />
        </x-slot:actions>
    </x-header>

    <!-- TABLE  -->
    <x-card>
        <x-table :headers="$this->headers" selectable wire:model="selected" :rows="$this->users" :sort-by="$sortBy"
            link="/dashboard/users/show/{id}" with-pagination>
            <x-slot:empty>
                <x-icon name="o-cube" label="A tabela esta vazia." />
                @scope('cell_role', $user)
                    <x-users.roles :role="$user->role" />
                @endscope
            </x-slot:empty>
        </x-table>
    </x-card>
    <x-modal.bulkdelete />
</div>
