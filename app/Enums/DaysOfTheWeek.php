<?php

namespace App\Enums;

enum DaysOfTheWeek: string
{
    case Segunda = '1';
    case Terça = '2';
    case Quarta = '3';
    case Quinta = '4';
    case Sexta = '5';
    case Sábado = '6';

    public function getName(): string
    {
        return match ($this) {
            DaysOfTheWeek::Segunda => 'Segunda-feira',
            DaysOfTheWeek::Terça => 'Terça-feira',
            DaysOfTheWeek::Quarta => 'Quarta-feira',
            DaysOfTheWeek::Quinta => 'Quinta-feira',
            DaysOfTheWeek::Sexta => 'Sexta-feira',
            DaysOfTheWeek::Sábado => 'Sábado',
        };
    }
}
