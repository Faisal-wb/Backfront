<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminAchievementController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable',
            'image_url' => 'nullable|string',
            'event' => 'required|string|max:255',
            'result' => 'required|string|max:255',
            'tier' => 'nullable|string|max:50',
            'year' => 'required|string|max:10',
            'icon' => 'nullable|string|max:50',
            'order' => 'nullable|integer',
        ]);

        $imageUrl = $request->image_url;

        if ($request->boolean('remove_image') || $request->input('remove_image') === '1') {
            $imageUrl = null;
        } elseif ($request->hasFile('image')) {
            $path = $request->file('image')->store('achievements', 'public');
            $imageUrl = '/api/storage/' . $path;
        } elseif (is_string($request->image) && !empty($request->image)) {
            $imageUrl = $request->image;
        } elseif (empty($imageUrl) || $imageUrl === 'null') {
            $imageUrl = null;
        }

        $achievement = Achievement::create([
            'event' => $request->event,
            'result' => $request->result,
            'tier' => $request->tier ?? 'gold',
            'year' => $request->year,
            'icon' => $request->icon ?? 'Award',
            'image' => $imageUrl,
            'order' => $request->order ?? 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Prestasi berhasil ditambahkan.',
            'data' => $achievement
        ]);
    }

    public function update(Request $request, $id)
    {
        $achievement = Achievement::findOrFail($id);

        $request->validate([
            'image' => 'nullable',
            'image_url' => 'nullable|string',
            'event' => 'required|string|max:255',
            'result' => 'required|string|max:255',
            'tier' => 'nullable|string|max:50',
            'year' => 'required|string|max:10',
            'icon' => 'nullable|string|max:50',
            'order' => 'nullable|integer',
        ]);

        $imageUrl = $achievement->image;

        if ($request->boolean('remove_image') || $request->input('remove_image') === '1' || $request->input('remove_image') === 'true') {
            if ($imageUrl && str_contains($imageUrl, '/storage/achievements/')) {
                $oldPath = 'achievements/' . basename($imageUrl);
                Storage::disk('public')->delete($oldPath);
            }
            $imageUrl = null;
        } elseif ($request->hasFile('image')) {
            // Delete old file if stored locally
            if ($imageUrl && str_contains($imageUrl, '/storage/achievements/')) {
                $oldPath = 'achievements/' . basename($imageUrl);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('achievements', 'public');
            $imageUrl = '/api/storage/' . $path;
        } elseif ($request->has('image_url') || $request->has('image')) {
            $candidate = $request->image_url ?? $request->image;
            if (empty($candidate) || $candidate === 'null' || $candidate === '') {
                if ($imageUrl && str_contains($imageUrl, '/storage/achievements/')) {
                    $oldPath = 'achievements/' . basename($imageUrl);
                    Storage::disk('public')->delete($oldPath);
                }
                $imageUrl = null;
            } elseif (is_string($candidate)) {
                $imageUrl = $candidate;
            }
        }

        $achievement->update([
            'event' => $request->event,
            'result' => $request->result,
            'tier' => $request->tier ?? $achievement->tier,
            'year' => $request->year,
            'icon' => $request->icon ?? $achievement->icon,
            'image' => $imageUrl,
            'order' => $request->order ?? $achievement->order,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Prestasi berhasil diperbarui.',
            'data' => $achievement
        ]);
    }

    public function destroy($id)
    {
        $achievement = Achievement::findOrFail($id);

        if ($achievement->image && str_contains($achievement->image, '/storage/achievements/')) {
            $oldPath = 'achievements/' . basename($achievement->image);
            Storage::disk('public')->delete($oldPath);
        }

        $achievement->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Prestasi berhasil dihapus.'
        ]);
    }
}
