<x-form wire:submit="submit">
    <x-input label="Email" wire:model="email" error-field="email" type="email" icon="o-envelope"
        placeholder="exemple@email.com" clearable />
    <x-password autocomplete="new-password" label="Senha" wire:model="password" error-field="password"
        password-icon="o-lock-closed" password-visible-icon="o-lock-open" clearable />

    <x-slot:actions>
        <x-button label="Enviar" class="btn-outline btn-md" type="submit" spinner="submit" />
    </x-slot:actions>
</x-form>
