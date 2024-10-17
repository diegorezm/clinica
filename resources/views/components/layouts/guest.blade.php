<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{ $title ?? 'Page Title' }}</title>
    <wireui:scripts />
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <main class="p-4">
        {{ $slot }}
    </main>
    <x-toast />
</body>
</html>
