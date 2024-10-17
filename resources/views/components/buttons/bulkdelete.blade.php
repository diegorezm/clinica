<div x-data="{ selected: @entangle('selected') }" x-show="selected.length > 0">
    <x-button class="btn-error" icon="o-trash" @click="$wire.showModal = true" responsive tooltip-left="Deletar">
        <span x-text="selected.length" />
    </x-button>
</div>
