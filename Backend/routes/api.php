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
Route::get('/storage/site_content/{filename}', function ($filename) {
    $path = storage_path('app/public/site_content/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
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
|--------------------------------------------------------------------------
*/
Route::post('/contact', [ContactController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Admin Auth Route
|--------------------------------------------------------------------------
*/
Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/admin/logout', [AuthController::class, 'logout']);


/*
|--------------------------------------------------------------------------
| Protected Admin Routes (Requires Sanctum Token Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/site-content', [SiteSettingController::class, 'update']);
    
    // Gallery Admin Routes
    Route::post('/admin/gallery', [AdminGalleryController::class, 'store']);
    Route::post('/admin/gallery/{id}', [AdminGalleryController::class, 'update']); // Use POST for multipart form-data updates
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

