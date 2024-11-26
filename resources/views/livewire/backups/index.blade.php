<div>
    <!-- HEADER -->
    <x-header title="Backups" separator progress-indicator>
        <x-slot:actions>
            <x-button label="Novo" icon="o-document-arrow-up" wire:click="createBackup" spinner class="btn-primary"
                responsive />
            <x-buttons.bulkdelete />
        </x-slot:actions>
    </x-header>

    <!-- TABLE  -->
    <x-card>
        <x-table :headers="$this->headers" selectable wire:model="selected" :rows="$this->paginatedBackups" selectable-key="name"
            with-pagination>
            <x-slot:empty>
                <x-icon name="o-cube" label="A tabela esta vazia." />
            </x-slot:empty>
            @scope('actions', $backup)
                <x-button icon="o-folder-arrow-down" class="btn-outline btn-sm"
                    wire:click="download('{{ $backup['name'] }}')" responsive spinner />
            @endscope
        </x-table>
    </x-card>
    <x-modal.bulkdelete />
</div>
