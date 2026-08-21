<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SiteSettingController extends Controller
{
    /**
     * Get the site content.
     */
    public function index()
    {
        $setting = SiteSetting::where('key', 'site_content')->first();

        if ($setting) {
            return response()->json([
                'status' => 'success',
                'data' => json_decode($setting->payload, true)
            ]);
        }

        return response()->json([
            'status' => 'success',
            'data' => null
        ]);
    }

    /**
     * Update the site content.
     */
    public function update(Request $request)
    {
        $payloadRaw = $request->input('payload');
        
        if ($payloadRaw && is_string($payloadRaw)) {
            $payload = json_decode($payloadRaw, true);
        } else {
            $payload = $request->all();
        }

        // Process base64 images or actual uploaded files
        $imageFields = [
            'heroImage1', 'heroImage2',
            'aboutImage1', 'aboutImage2',
            'kompetensiImageProgramming', 'kompetensiImageNetworking'
        ];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $path = $request->file($field)->store('site_content', 'public');
                $payload[$field] = '/api/storage/' . $path;
            } elseif (isset($payload[$field]) && is_string($payload[$field]) && str_starts_with($payload[$field], 'data:image')) {
                // Fallback for base64 image if any
                $base64Image = $payload[$field];
                
                // Extract extension
                $extension = explode('/', explode(':', substr($base64Image, 0, strpos($base64Image, ';')))[1])[1];
                
                // Remove the "data:image/xxx;base64," part
                $image = substr($base64Image, strpos($base64Image, ',') + 1); 
                $image = str_replace(' ', '+', $image); 
                
                // Generate unique filename
                $imageName = 'site_content/' . Str::random(10) . '_' . time() . '.' . $extension;
                
                // Save to storage
                Storage::disk('public')->put($imageName, base64_decode($image));
                
                // Update payload with URL
                $payload[$field] = '/api/storage/' . $imageName;
            }
        }

        SiteSetting::updateOrCreate(
            ['key' => 'site_content'],
            ['payload' => json_encode($payload)]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Site content updated successfully',
            'data' => $payload
        ]);
    }
}
