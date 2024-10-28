<x-card title="{{ $title ?? 'Novo doutor' }}">
    <x-form wire:submit.prevent="submit">
        <x-button link="{{ url()->previous() }}" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
        <x-input label="Nome" wire:model="name" error-field="name" icon="o-user" clearable />
        <x-input label="Email" wire:model="email" error-field="email" icon="o-envelope" clearable />
        @if ($showPassword)
            <x-password autocomplete="new-password" label="Senha" wire:model="password" error-field="password"
                password-icon="o-lock-closed" password-visible-icon="o-lock-open" clearable />
        @endif()
        <x-input label="CRM" wire:model="crm" error-field="crm" icon="s-identification" clearable />
        <x-input label="Especialidade" wire:model="specialty" error-field="specialty" icon="o-clipboard" clearable />

        <x-choices label="Dias de trabalho" allow-all allow-all-text="Selecionar todos" remove-all-text="Remover todos"
            wire:model="work_days" :options="$this->workDaysOpts" multiple />

        <x-input label="Periodos" wire:model="period" error-field="period" icon="o-clock" clearable />

        <x-slot:actions>
            <x-button link="{{ url()->previous() }}" label="Cancelar" icon="o-x-mark" class="btn-outline" />
            <x-button label="Salvar" icon="o-check" class="btn-primary" type="submit" spinner="submit" />
        </x-slot:actions>
    </x-form>
</x-card>
