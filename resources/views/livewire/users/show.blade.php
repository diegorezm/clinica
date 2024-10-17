<div>
    <div class="space-y-10">
        <x-button link="/dashboard/users" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
        <x-card title="Usuário" shadow separator>
            <div class="flex flex-col space-y-2">
                <div>
                    <strong>Nome:</strong> {{ $user->name }}
                </div>
                <div>
                    <strong>Email:</strong> {{ $user->email }}
                </div>

                <div>
                    <strong>Permissão:</strong>
                    <x-users.roles :role="$user->role" />
                </div>
            </div>

            <x-slot:actions>
                <x-button icon="o-pencil" label="Editar" class="btn-primary"
                    link="/dashboard/users/update/{{ $user->id }}" />
                <x-button label="Deletar" icon="o-trash" @click="$wire.showModal = true;" class="btn-error" />
            </x-slot:actions>
        </x-card>
    </div>
    <x-modal.delete />
</div>
