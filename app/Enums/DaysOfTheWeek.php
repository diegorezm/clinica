<?php

namespace App\Enums;

enum DaysOfTheWeek: string
{
    case Segunda = '0';
    case Terça = '1';
    case Quarta = '2';
    case Quinta = '3';
    case Sexta = '4';
    case Sábado = '5';

    // Método opcional para retornar o nome legível
    public function getName(): string
    {
        return match ($this) {
            DiaDaSemana::Segunda => 'Segunda-feira',
            DiaDaSemana::Terça => 'Terça-feira',
            DiaDaSemana::Quarta => 'Quarta-feira',
            DiaDaSemana::Quinta => 'Quinta-feira',
            DiaDaSemana::Sexta => 'Sexta-feira',
            DiaDaSemana::Sábado => 'Sábado',
        };
    }
}
