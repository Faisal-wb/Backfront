<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\AdminGalleryController;
use App\Http\Controllers\Api\AdminTeacherController;
use App\Http\Controllers\Api\AdminAchievementController;
use App\Http\Controllers\Api\SiteSettingController;

/*
|--------------------------------------------------------------------------
| Public API Routes (Read-Only - No Login Required)
|--------------------------------------------------------------------------
*/
Route::get('/storage/{folder}/{filename}', function ($folder, $filename) {
    // Whitelist allowed storage folders strictly
    $allowedFolders = ['gallery', 'teachers', 'achievements', 'site_content', 'site', 'content'];
    if (!in_array($folder, $allowedFolders, true)) {
        abort(404);
    }

    // Sanitize filename to prevent any path traversal characters
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

Route::get('/site-content', [SiteSettingController::class, 'index']);
Route::get('/content', [PublicContentController::class, 'index']);
Route::get('/stats', [PublicContentController::class, 'stats']);
Route::get('/slides', [PublicContentController::class, 'slides']);
Route::get('/achievements', [PublicContentController::class, 'achievements']);
Route::get('/gallery', [PublicContentController::class, 'gallery']);
Route::get('/teachers', [PublicContentController::class, 'teachers']);
Route::get('/testimonials', [PublicContentController::class, 'testimonials']);

/*
|--------------------------------------------------------------------------
| Public Form Submission (Contact / PPDB Registration - Saves to MySQL)
| Protected with rate-limiting: max 10 requests per minute per IP
|--------------------------------------------------------------------------
*/
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:10,1');

/*
|--------------------------------------------------------------------------
| Admin Auth Route
| Protected with rate-limiting: max 5 login attempts per minute per IP (Anti Brute-Force)
|--------------------------------------------------------------------------
*/
Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:5,1');


/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Requires Sanctum Token Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout harus di dalam grup auth agar token yang dihapus adalah milik user yang login
    Route::post('/admin/logout', [AuthController::class, 'logout']);

    Route::post('/site-content', [SiteSettingController::class, 'update']);
    
    // Gallery Admin Routes
    Route::post('/admin/gallery', [AdminGalleryController::class, 'store']);
    Route::post('/admin/gallery/{id}', [AdminGalleryController::class, 'update']);
    Route::delete('/admin/gallery/{id}', [AdminGalleryController::class, 'destroy']);

    // Teacher Admin Routes
    Route::post('/admin/teachers', [AdminTeacherController::class, 'store']);
    Route::post('/admin/teachers/{id}', [AdminTeacherController::class, 'update']);
    Route::delete('/admin/teachers/{id}', [AdminTeacherController::class, 'destroy']);

    // Achievement Admin Routes
    Route::post('/admin/achievements', [AdminAchievementController::class, 'store']);
    Route::post('/admin/achievements/{id}', [AdminAchievementController::class, 'update']);
    Route::delete('/admin/achievements/{id}', [AdminAchievementController::class, 'destroy']);
});

