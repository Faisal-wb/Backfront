<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminGalleryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:15360', // max 15MB
            'url' => 'nullable|string',
            'alt' => 'nullable|string|max:255',
            'tall' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        if (!$request->hasFile('image') && !$request->url) {
            return response()->json(['status' => 'error', 'message' => 'Image file or URL is required.'], 400);
        }

        $url = $request->url;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $url = '/storage/' . $path;
        }

        $gallery = GalleryItem::create([
            'url' => $url,
            'alt' => $request->alt ?? 'Foto Galeri TJKT',
            'tall' => $request->boolean('tall', false),
            'order' => $request->order ?? 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Foto berhasil ditambahkan.',
            'data' => $gallery
        ]);
    }

    public function update(Request $request, $id)
    {
        $gallery = GalleryItem::findOrFail($id);

        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:15360',
            'url' => 'nullable|string',
            'alt' => 'nullable|string|max:255',
            'tall' => 'nullable|boolean',
            'order' => 'nullable|integer',
        ]);

        $url = $gallery->url;

        if ($request->hasFile('image')) {
            // Delete old file if it exists and is local
            if (str_starts_with($url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('gallery', 'public');
            $url = '/storage/' . $path;
        } elseif ($request->url && $request->url !== $gallery->url) {
            if (str_starts_with($gallery->url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $gallery->url);
                Storage::disk('public')->delete($oldPath);
            }
            $url = $request->url;
        }

        $gallery->update([
            'url' => $url,
            'alt' => $request->alt ?? $gallery->alt,
            'tall' => $request->has('tall') ? $request->boolean('tall') : $gallery->tall,
            'order' => $request->order ?? $gallery->order,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Foto berhasil diperbarui.',
            'data' => $gallery
        ]);
    }

    public function destroy($id)
    {
        $gallery = GalleryItem::findOrFail($id);

        if (str_starts_with($gallery->url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $gallery->url);
            Storage::disk('public')->delete($oldPath);
        }

        $gallery->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Foto berhasil dihapus.'
        ]);
    }
}
