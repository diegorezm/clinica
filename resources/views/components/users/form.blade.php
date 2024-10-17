@props([
    'showPassword' => true,
])
<x-card title="{{ $title ?? 'Novo usuário' }}">
    <x-form wire:submit.prevent="submit">
        <x-button link="/dashboard/users" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
        <x-input label="Nome" wire:model="name" error-field="name" icon="o-user" clearable />
        <x-input label="Email" wire:model="email" error-field="email" icon="o-envelope" clearable />

        @if ($showPassword)
            <x-password label="Senha" wire:model="password" right />
        @endif
        <x-choices label="Permissão" wire:model="role" :options="$this->roleOpts" error-field="role" icon="o-user" single />

        <x-slot:actions>
            <x-button link="/dashboard/users" label="Cancelar" icon="o-x-mark" class="btn-outline" />
            <x-button label="Salvar" icon="o-check" class="btn-primary" type="submit" spinner="submit" />
        </x-slot:actions>
    </x-form>
</x-card>
