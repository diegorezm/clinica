<?php

namespace App\Enums;

enum Periods: string
{
    case Morning = '0';
    case Afternoon = '1';
    case Night = '2';

    public function getName(): string
    {
        return match ($this) {
            Periods::Morning => 'Manhã',
            Periods::Afternoon => 'Tarde',
            Periods::Night => 'Noite',
        };
    }
}
