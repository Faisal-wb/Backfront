<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicContentController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AuthController;

use App\Http\Controllers\Api\SiteSettingController;

/*
|--------------------------------------------------------------------------
| Public API Routes (Read-Only - No Login Required)
|--------------------------------------------------------------------------
*/
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
});

