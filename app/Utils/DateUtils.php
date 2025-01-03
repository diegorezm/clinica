<?php

namespace App\Utils;

use App\Enums\DaysOfTheWeek;


class DateUtils
{
    public static function workDaysOpts()
    {
        return [
            ['id' => DaysOfTheWeek::Segunda->value, 'name' => DaysOfTheWeek::Segunda->getName()],
            ['id' => DaysOfTheWeek::Terça->value, 'name' => DaysOfTheWeek::Terça->getName()],
            ['id' => DaysOfTheWeek::Quarta->value, 'name' => DaysOfTheWeek::Quarta->getName()],
            ['id' => DaysOfTheWeek::Quinta->value, 'name' => DaysOfTheWeek::Quinta->getName()],
            ['id' => DaysOfTheWeek::Sexta->value, 'name' => DaysOfTheWeek::Sexta->getName()],
            ['id' => DaysOfTheWeek::Sábado->value, 'name' => DaysOfTheWeek::Sábado->getName()],
        ];
    }

    public static function monthOpts()
    {
        return [
            ['id' => '1', 'name' => 'Janeiro'],
            ['id' => '2', 'name' => 'Fevereiro'],
            ['id' => '3', 'name' => 'Março'],
            ['id' => '4', 'name' => 'Abril'],
            ['id' => '5', 'name' => 'Maio'],
            ['id' => '6', 'name' => 'Junho'],
            ['id' => '7', 'name' => 'Julho'],
            ['id' => '8', 'name' => 'Agosto'],
            ['id' => '9', 'name' => 'Setembro'],
            ['id' => '10', 'name' => 'Outubro'],
            ['id' => '11', 'name' => 'Novembro'],
            ['id' => '12', 'name' => 'Dezembro'],
        ];
    }

    public static function getMonthName($month_id)
    {
        return [
            '01' => 'Janeiro',
            '02' => 'Fevereiro',
            '03' => 'Março',
            '04' => 'Abril',
            '05' => 'Maio',
            '06' => 'Junho',
            '07' => 'Julho',
            '08' => 'Agosto',
            '09' => 'Setembro',
            '10' => 'Outubro',
            '11' => 'Novembro',
            '12' => 'Dezembro',
            '' => 'Todos'
        ][$month_id];
    }

    public static function getDayName($day_id)
    {
        return [
            DaysOfTheWeek::Segunda->value => DaysOfTheWeek::Segunda->getName(),
            DaysOfTheWeek::Terça->value => DaysOfTheWeek::Terça->getName(),
            DaysOfTheWeek::Quarta->value => DaysOfTheWeek::Quarta->getName(),
            DaysOfTheWeek::Quinta->value => DaysOfTheWeek::Quinta->getName(),
            DaysOfTheWeek::Sexta->value => DaysOfTheWeek::Sexta->getName(),
            DaysOfTheWeek::Sábado->value => DaysOfTheWeek::Sábado->getName(),
            "" => "Todos",
        ][$day_id];
    }
}
