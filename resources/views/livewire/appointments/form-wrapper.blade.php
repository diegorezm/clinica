<div>
    <x-tabs wire:model="selectedTab">
        <x-tab name="create" label="Agendar consulta" icon="o-user">
            <livewire:appointments.create />
        </x-tab>

        <x-tab name="bulk" label="Agendar múltiplas consultas" icon="o-users">
            <livewire:appointments.bulk-create />
        </x-tab>
    </x-tabs>
</div>
