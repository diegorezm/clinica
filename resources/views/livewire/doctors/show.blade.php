<div>
    <x-modal.delete />
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

        <x-tabs wire:model="selectedTab">
            <x-tab name="0" label="Agendamentos" class="space-y-4">
                <livewire:appointments.index :doctor_id="$doctor->id" />
            </x-tab>
            <x-tab name="1" label="Horarios disponíveis">
                <livewire:appointments.available :doctor_id="$doctor->id" />
            </x-tab>
            <x-tab name="2" label="Horarios">
                <x-card class="w-full flex items-center">
                    <div class="grid place-items-center grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        @if (count($workHours) > 0)
                            @foreach ($workHours as $day => $hours)
                                <x-card title="{{ $this->getDayName($day) }}" class="w-full" shadow separator>
                                    <div class="mt-2 space-y-6">
                                        @foreach ($hours as $index => $slot)
                                            <div class="flex flex-row justify-center items-center gap-4">
                                                <p><strong>Slot #{{ $index + 1 }}</strong></p>
                                                <p><strong>Começa às:</strong>
                                                    {{ \Carbon\Carbon::parse($slot['start_time'])->format('H:i') }}</p>
                                                <p><strong>Termina às:</strong>
                                                    {{ \Carbon\Carbon::parse($slot['end_time'])->format('H:i') }}</p>
                                                <p><strong>Intervalo entre as consultas:</strong>
                                                    {{ $slot['interval'] }} minutos</p>
                                            </div>
                                        @endforeach
                                    </div>
                                </x-card>
                            @endforeach
                        @else
                            <x-icon name="o-cube" label="Nenhum horário cadastrado." />
                        @endif
                    </div>
                </x-card>
            </x-tab>
        </x-tabs>
    </div>
</div>
