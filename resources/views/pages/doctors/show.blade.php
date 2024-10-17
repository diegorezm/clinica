<x-layouts.app title="doutor">
    <div class="w-full space-y-10">
        <livewire:doctors.show :$doctor />
        <livewire:appointments.index :doctor_id="$doctor->id" />
    </div>
</x-layouts.app>
