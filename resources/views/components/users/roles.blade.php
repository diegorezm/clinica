@props(['role'])

@switch($role)
    @case('admin')
        <span class="badge badge-warning">Admin</span>
    @break

    @case('doctor')
        <span class="badge badge-primary">Médico</span>
    @break

    @case('regular')
        <span class="badge badge-ghost">Normal</span>
    @break
@endswitch
