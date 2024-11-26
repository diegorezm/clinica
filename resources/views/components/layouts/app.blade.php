<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ isset($title) ? $title . ' - ' . config('app.name') : config('app.name') }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen font-sans antialiased bg-base-200/50 dark:bg-base-200">

    {{-- NAVBAR mobile only --}}
    <x-nav sticky class="lg:hidden">
        <x-slot:actions>
            <label for="main-drawer" class="lg:hidden me-3">
                <x-icon name="o-bars-3" class="cursor-pointer" />
            </label>
        </x-slot:actions>
    </x-nav>

    {{-- MAIN --}}
    <x-main full-width>
        <x-slot:sidebar drawer="main-drawer" class="bg-base-100 lg:bg-inherit">
            <x-menu activate-by-route class="h-full">
                <x-menu-item title="Pacientes" icon="o-users" link="/dashboard/patients" />
                @if (auth()->user()->role == 'doctor' && auth()->user()->doctor)
                    <x-menu-item title="Minhas consultas" icon="o-calendar" :link="route('doctors.show', ['doctor' => auth()->user()->doctor->id])" />
                @else
                    <x-menu-item title="Doutores" icon="o-clipboard-document-list" link="/dashboard/doctors" />
                    <x-menu-sub title="Consultas" icon="o-calendar">
                        <x-menu-item title="Todas as consultas" icon="o-list-bullet" link="/dashboard/appointments" />
                        <x-menu-item title="Horarios disponiveis" icon="o-check-badge"
                            link="/dashboard/appointments/available" />
                    </x-menu-sub>
                @endif
                @if (auth()->user()->role == 'admin')
                    <x-menu-item title="Usuários" icon="o-users" link="/dashboard/users" />
                    <x-menu-item title="Backups" icon="o-document-arrow-down" link="/dashboard/backups" />
                @endif

                {{-- User --}}
                <div class="mt-auto w-full ">
                    @if ($user = auth()->user())
                        <x-menu-separator />
                        <x-list-item :item="$user" value="name" sub-value="email" no-separator no-hover
                            class="-mx-2 !-my-2 rounded">
                            <x-slot:actions>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <x-button icon="o-power" class="btn-circle btn-ghost btn-xs" tooltip-left="Sair"
                                        no-wire-navigate type="submit" />
                                </form>
                            </x-slot:actions>
                        </x-list-item>

                        <x-menu-separator />
                    @endif
                </div>
            </x-menu>
        </x-slot:sidebar>

        <x-slot:content>
            {{ $slot }}
        </x-slot:content>
    </x-main>
    <x-toast />
</body>
</html>
