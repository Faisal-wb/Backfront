<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stat;
use App\Models\HeroSlide;
use App\Models\Achievement;
use App\Models\GalleryItem;
use App\Models\Teacher;
use App\Models\Testimonial;

class PublicContentController extends Controller
{
    /**
     * Get all public homepage dynamic data in a single payload.
     */
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'stats' => Stat::orderBy('order')->get(),
                'slides' => HeroSlide::orderBy('order')->get(),
                'achievements' => Achievement::orderBy('order')->get(),
                'gallery' => GalleryItem::orderBy('order')->get(),
                'teachers' => Teacher::orderBy('order')->get(),
                'testimonials' => Testimonial::orderBy('order')->get(),
            ]
        ]);
    }

    public function stats()
    {
        return response()->json(Stat::orderBy('order')->get());
    }

    public function slides()
    {
        return response()->json(HeroSlide::orderBy('order')->get());
    }

    public function achievements()
    {
        return response()->json(Achievement::orderBy('order')->get());
    }

    public function gallery()
    {
        return response()->json(GalleryItem::orderBy('order')->get());
    }

    public function teachers()
    {
        return response()->json(Teacher::orderBy('order')->get());
    }

    public function testimonials()
    {
        return response()->json(Testimonial::orderBy('order')->get());
    }
}
