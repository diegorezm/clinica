<x-modal wire:model="showModal" title="Tem certeza?"
    subtitle="Tem certeza de que deseja deletar este registro? Esta ação é permanente e o registro não poderá ser recuperado.">
    <x-slot:actions>
        <x-button label="Cancelar" @click="$wire.showModal = false" />
        <x-button label="Deletar" class="btn-error" wire:click="delete" spinner />
    </x-slot:actions>
</x-modal>
