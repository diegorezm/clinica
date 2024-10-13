<x-card title="Novo encaminhamento">
    <x-form wire:submit.prevent="submit">
        <x-button link="{{ url()->previous() }}" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
        <x-input label="CID" wire:model="cid" error-field="cid" icon="o-identification" clearable />
        <x-input label="CRM" wire:model="crm" error-field="crm" icon="s-identification" clearable />
        <x-input label="Função" wire:model="doctor_fn" error-field="doctor_fn" icon="o-clipboard" clearable />
        <x-slot:actions>
            <x-button link="{{ url()->previous() }}" label="Cancelar" icon="o-x-mark" class="btn-outline" />
            <x-button label="Salvar" icon="o-check" class="btn-primary" type="submit" spinner="submit" />
        </x-slot:actions>
    </x-form>
</x-card>
