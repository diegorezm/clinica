<div>
    <x-card title="Novo doutor">
        <x-form wire:submit.prevent="submit">
            <x-button link="{{ url()->previous() }}" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />

            <x-steps wire:model="selectedTab">
                <x-step step="0" text="Informações" class="space-y-2">
                    <x-input label="Nome" wire:model="name" error-field="name" icon="o-user" clearable />
                    <x-input label="Email" wire:model="email" error-field="email" icon="o-envelope" clearable />
                    <x-password autocomplete="new-password" label="Senha" wire:model="password" error-field="password"
                        password-icon="o-lock-closed" password-visible-icon="o-lock-open" clearable />
                    <x-input label="CRM" wire:model="crm" error-field="crm" icon="s-identification" clearable />
                    <x-input label="Especialidade" wire:model="specialty" error-field="specialty" icon="o-clipboard"
                        clearable />

                    <x-choices label="Dias de trabalho" allow-all allow-all-text="Selecionar todos"
                        remove-all-text="Remover todos" wire:model="work_days" :options="$this->workDaysOpts" multiple />

                    <div class="mt-4 space-x-2">
                        <x-button link="/dashboard/doctors" label="Cancelar" icon="o-x-mark" class="btn-outline" />
                        <x-button label="Próximo" class="btn-primary"
                            @click="$wire.selectedTab = '1'; $wire.loadWorkingDays()" />
                    </div>
                </x-step>

                <x-step step="1" text="Horários de trabalho" class="space-y-2">
                    <h4 class="font-bold">Dias de Trabalho Selecionados:</h4>
                    <div class="grid place-items-center grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        @foreach ($this->work_days as $day)
                            <x-card title="{{ $this->getDayName($day) }}" class="w-full" shadow separator>
                                <x-button label="Adicionar Horário"
                                    wire:click.prevent="addWorkingHours({{ $day }})" class="btn-primary" />
                                @if (isset($workingHours[$day]) && count($workingHours[$day]) > 0)
                                    <div class="mt-2 space-y-2">
                                        @foreach ($workingHours[$day] as $index => $slot)
                                            <div class="flex flex-row justify-center items-center gap-2"
                                                wire:key="working-hour-{{ $day }}-{{ $index }}">
                                                <x-input label="Começa às" type="time"
                                                    wire:model="workingHours.{{ $day }}.{{ $index }}.start_time" />
                                                <x-input label="Termina às" type="time"
                                                    wire:model="workingHours.{{ $day }}.{{ $index }}.end_time" />
                                                <x-input label="Intervalo" type="number"
                                                    wire:model="workingHours.{{ $day }}.{{ $index }}.interval" />
                                                <x-button icon="o-x-mark" class="btn-ghost"
                                                    wire:click.prevent="removeWorkingHours({{ $day }}, {{ $index }})" />
                                            </div>
                                        @endforeach
                                    </div>
                                @endif
                            </x-card>
                        @endforeach
                    </div>

                    <div class="mt-12 space-x-2">
                        <x-button label="Voltar" class="btn-outline" type="button" @click="$wire.selectedTab = '0'" />
                        <x-button label="Salvar" icon="o-check" class="btn-primary" type="submit" spinner="submit" />
                    </div>
                </x-step>

            </x-steps>
            <x-errors title="Oops!" description="Ocorreu um erro ao criar o doutor." icon="o-face-frown" />
        </x-form>
    </x-card>
</div>
