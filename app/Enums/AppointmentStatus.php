<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case P = 'p';
    case F = 'f';
    case FJ = 'fj';
    case FM = 'fm';
    case OK = 'ok';

    public function getName(): string
    {
        return match ($this) {
            self::P =>  'pendente',
            self::F => 'falta',
            self::FJ => 'falta justificada',
            self::FM => 'falta do médico',
            self::OK => 'ok',
        };
    }
}
