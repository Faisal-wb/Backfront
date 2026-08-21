<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminTeacherController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // max 10MB
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'initials' => 'required|string|max:10',
            'color' => 'nullable|string|max:20',
            'order' => 'nullable|integer',
        ]);

        $url = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('teachers', 'public');
            $url = '/storage/' . $path;
        }

        $teacher = Teacher::create([
            'name' => $request->name,
            'role' => $request->role,
            'initials' => $request->initials,
            'color' => $request->color ?? '#DC2626',
            'image' => $url,
            'order' => $request->order ?? 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Guru berhasil ditambahkan.',
            'data' => $teacher
        ]);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'initials' => 'required|string|max:10',
            'color' => 'nullable|string|max:20',
            'order' => 'nullable|integer',
        ]);

        $url = $teacher->image;

        if ($request->hasFile('image')) {
            // Delete old file if it exists and is local
            if ($url && str_starts_with($url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('teachers', 'public');
            $url = '/storage/' . $path;
        }

        $teacher->update([
            'name' => $request->name,
            'role' => $request->role,
            'initials' => $request->initials,
            'color' => $request->color ?? $teacher->color,
            'image' => $url,
            'order' => $request->order ?? $teacher->order,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Guru berhasil diperbarui.',
            'data' => $teacher
        ]);
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);

        if ($teacher->image && str_starts_with($teacher->image, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $teacher->image);
            Storage::disk('public')->delete($oldPath);
        }

        $teacher->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Guru berhasil dihapus.'
        ]);
    }
}
