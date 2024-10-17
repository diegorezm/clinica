<x-card title="{{ $title ?? 'Nova consulta' }}">
    <x-form wire:submit.prevent="submit">
        <x-button link="{{ url()->previous() }}" icon="o-arrow-left" class="btn-circle btn-outline btn-sm" />

        <x-input wire:model="date" label="Data" type="date" icon="o-calendar" error-field="date" />
        <x-input wire:model="time" label="Horario" type="time" icon="o-clock" error-field="time" />

        <x-choices label="Paciente" wire:model="patient_id" icon="o-users" :options="$this->patients"
            search-function="patientSearch" debounce="300ms" min-chars="2" single searchable>
            @scope('item', $patient)
                <x-list-item :item="$patient">
                    <x-slot:value>
                        {{ $patient->name }}
                    </x-slot:value>
                    <x-slot:sub-value>
                        Rg: {{ $patient->rg }}
                    </x-slot:sub-value>
                </x-list-item>
            @endscope

            @scope('selection', $patient)
                {{ $patient->name }}
            @endscope
        </x-choices>

        <x-choices label="Doutor" wire:model="doctor_id" icon="o-clipboard-document-list" :options="$this->doctors"
            search-function="doctorSearch" debounce="300ms" min-chars="2" single searchable>
            @scope('item', $doctor)
                <x-list-item :item="$doctor">
                    <x-slot:value>
                        {{ $doctor->user->name }}
                    </x-slot:value>
                    <x-slot:sub-value>
                        {{ $doctor->specialty }}
                    </x-slot:sub-value>
                </x-list-item>
            @endscope

            @scope('selection', $doctor)
                {{ $doctor->user->name }}
            @endscope
        </x-choices>

        <x-choices label="Status" wire:model="status" :options="$this->statusOpts()" single />

        <x-textarea label="Observações" wire:model="obs" placeholder="..." hint="Este é um campo opcional."
            rows="5" inline maxlength="1000" class="rounded-lg" />
        <x-slot:actions>
            <x-button link="{{ url()->previous() }}" label="Cancelar" icon="o-x-mark" class="btn-outline" />
            <x-button label="Salvar" icon="o-check" class="btn-primary" type="submit" spinner="submit" />
        </x-slot:actions>
    </x-form>
</x-card>
