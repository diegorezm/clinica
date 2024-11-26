<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BackupController extends Controller
{
    function index()
    {
        return view('pages.backups.index');
    }
}
