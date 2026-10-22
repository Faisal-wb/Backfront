<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/storage/{folder}/{filename}', function ($folder, $filename) {
    $allowedFolders = ['gallery', 'teachers', 'achievements', 'site_content', 'site', 'content'];
    if (!in_array($folder, $allowedFolders, true)) {
        abort(404);
    }

    $cleanFilename = basename($filename);
    if ($cleanFilename !== $filename || !preg_match('/^[a-zA-Z0-9_\-\.]+$/', $cleanFilename)) {
        abort(404);
    }

    $basePath = realpath(storage_path('app/public/' . $folder));
    if (!$basePath) {
        abort(404);
    }

    $filePath = realpath($basePath . DIRECTORY_SEPARATOR . $cleanFilename);
    if (!$filePath || !str_starts_with($filePath, $basePath) || !file_exists($filePath)) {
        abort(404);
    }

    return response()->file($filePath);
});
