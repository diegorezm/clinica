<?php

namespace App\Livewire\Backups;

use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Livewire\Attributes\Computed;
use Livewire\Component;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Livewire\WithPagination;
use Mary\Traits\Toast;

class Index extends Component
{
    use Toast, WithPagination;
    public $backups = [];
    public $appName;

    public $selected = [];
    public bool $showModal = false;

    public function mount()
    {
        $this->appName = config('app.name');
        $this->getBackups();
    }

    public function getBackups()
    {
        $directory = $this->appName;

        if (!Storage::disk('local')->exists($directory)) {
            error_log('Backup directory does not exist.');
            Log::error('Backup directory does not exist.');
            return;
        }

        $files = Storage::disk('local')->files($directory);

        $this->backups = collect($files)->map(function ($file) {
            $fileSizeInMB = Storage::size($file) / 1048576;
            $lastModifiedTimestamp = Storage::lastModified($file);
            $d = $this->parseFileName(basename($file));
            return [
                'id' => basename($file),
                'name' => basename($file),
                'path' => $file,
                'date' => $d->format('d-m-Y H:i'),
                'size' => number_format($fileSizeInMB, 2) .  ' MB',
                'last_modified' => date('Y-m-d H:i:s', Storage::lastModified($file)),
                'timestamp' => $lastModifiedTimestamp,
            ];
        });

        $this->backups = $this->backups->sortBy([
            ['timestamp', 'desc']
        ]);
    }

    #[Computed()]
    public function paginatedBackups(int $perPage = 10, array $options = [], ?int $page = null)
    {
        $page = $page ?: (Paginator::resolveCurrentPage() ?? 1);
        $items = $this->backups instanceof Collection ?  $this->backups : collect($this->backups);
        return new LengthAwarePaginator($items->forPage($page, $perPage), $items->count(), $perPage, $page, $options);
    }

    #[Computed()]
    public function headers(): array
    {
        return [
            ['key' => 'date', 'label' => 'Data', 'sortable' => true],
            ['key' => 'size', 'label' => 'Tamanho', 'sortable' => true],
            ['key' => 'last_modified', 'label' => 'Última Modificação', 'sortable' => true],
        ];
    }

    public function createBackup()
    {
        $exitCode = Artisan::call('backup:run');
        if ($exitCode !== 0) {
            Log::error("There was an error while creating the backup. Code: " . $exitCode);
            $this->error("There was an error while creating the backup. Code: " . $exitCode);
        } else {
            $this->success("Backup criado com sucesso.");
            $this->getBackups();
        }
    }

    public function download($fileName)
    {
        $filePath = $this->appName . '/' . $fileName;
        if (Storage::disk('local')->exists($filePath)) {
            return Storage::download($filePath);
        }
        $this->error("O arquivo não existe.");
    }

    public function delete()
    {
        if (empty($this->selected)) {
            $this->error('Selecione um backup para excluir');
            return;
        }

        foreach ($this->selected as $fileName) {
            $filePath = $this->appName . '/' . $fileName;
            if (Storage::disk('local')->exists($filePath)) {
                Storage::disk('local')->delete($filePath);
                Log::info("Backup file deleted: $filePath");
            } else {
                Log::error("Backup file not found: $filePath");
            }
        }
        $this->getBackups();
        $this->selected = [];
        $this->success('Backup excluído com sucesso');
        $this->showModal = false;
    }

    public function parseFileName($fileName)
    {
        $sp = explode(".", $fileName);
        $d = Carbon::createFromFormat('Y-m-d-H-i-s', $sp['0']);
        return $d;
    }

    public function render()
    {
        return view('livewire.backups.index');
    }
}
