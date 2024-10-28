<x-card title="{{ $title ?? 'Novo paciente' }}">
    <x-form wire:submit.prevent="submit">
        <x-button link="{{ url()->previous() }}" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
        <x-input label="Nome" wire:model="name" error-field="name" icon="o-user" clearable />
        <x-input label="Telefone" wire:model="phone" error-field="phone" icon="o-phone" clearable maxlength="15" />
        <x-input label="RG" wire:model="rg" error-field="rg" icon="o-identification" clearable />
        <x-input label="Convênio" wire:model="insurance" error-field="insurance" icon="o-credit-card" clearable />

        <x-input label="Nº do convênio" wire:model="insurance_number" error-field="insurance_number"
            icon="o-numbered-list" clearable />
        <x-slot:actions>
            <x-button link="{{ url()->previous() }}" label="Cancelar" icon="o-x-mark" class="btn-outline" />
            <x-button label="Salvar" icon="o-check" class="btn-primary" type="submit" spinner="submit" />
        </x-slot:actions>
    </x-form>

</x-card>
