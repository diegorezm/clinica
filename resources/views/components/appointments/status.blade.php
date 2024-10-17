@switch($status)
    @case('p')
        <x-badge value="Pendente" class="badge-neutral" />
    @break

    @case('f')
        <x-badge value="Falta" class="badge-error" />
    @break

    @case('fj')
        <x-badge value="Falta Justificada" class="badge-warning" />
    @break

    @case('fm')
        <x-badge value="Falta do Medico" class="badge-warning" />
    @break

    @case('ok')
        <x-badge value="Ok" class="badge-success" />
    @break

    @default
        <x-badge value="Indefinido" class="badge-neutral" />
@endswitch
