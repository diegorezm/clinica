<x-modal wire:model="showModal" title="Tem certeza?"
    subtitle="Tem certeza de que deseja deletar estes registros? Esta ação é permanente e os registros não poderão ser recuperados.">
    <x-slot:actions>
        <x-button label="Cancelar" @click="$wire.showModal = false" />
        <x-button label="Deletar" class="btn-error" wire:click="delete" spinner />
    </x-slot:actions>
</x-modal>
