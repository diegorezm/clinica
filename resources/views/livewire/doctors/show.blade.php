<div class="space-y-4">
    <x-button link="/dashboard/doctors" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />
    <x-card title="Doutor" shadow separator>
        <div class="flex flex-col space-y-2">
            <div>
                <strong>Nome:</strong> {{ $user->name }}
            </div>
            <div>
                <strong>Email:</strong> {{ $user->email }}
            </div>
            <div>
                <strong>CRM:</strong> {{ $doctor->crm }}
            </div>
            <div>
                <strong>Especialidade:</strong> {{ $doctor->specialty }}
            </div>
            <div>
                <strong>Dias de trabalho: </strong>
                @foreach ($this->showWorkDays() as $day)
                    {{ $day }}@if (!$loop->last)
                        ,
                    @endif
                @endforeach
            </div>

            <div>
                <strong>Periodos: </strong>
                @foreach ($this->showWorkPeriods() as $period)
                    {{ $period }}@if (!$loop->last)
                        ,
                    @endif
                @endforeach
            </div>
        </div>
        <div>
        </div>
        @if (Auth::user()->role == 'admin')
            <x-slot:actions>
                <x-button icon="o-pencil" label="Editar" class="btn-primary"
                    link="/dashboard/doctors/update/{{ $doctor->id }}" />
                <x-button label="Deletar" icon="o-trash" @click="$wire.showModal = true" class="btn-error" />
            </x-slot:actions>
        @endif
    </x-card>
    <x-modal.delete />
</div>
