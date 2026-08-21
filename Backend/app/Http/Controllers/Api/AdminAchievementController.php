<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AdminAchievementController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'event' => 'required|string|max:255',
            'result' => 'required|string|max:255',
            'tier' => 'nullable|string|max:50',
            'year' => 'required|string|max:10',
            'icon' => 'nullable|string|max:50',
            'order' => 'nullable|integer',
        ]);

        $achievement = Achievement::create([
            'event' => $request->event,
            'result' => $request->result,
            'tier' => $request->tier ?? 'gold',
            'year' => $request->year,
            'icon' => $request->icon ?? 'Award',
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
            'event' => 'required|string|max:255',
            'result' => 'required|string|max:255',
            'tier' => 'nullable|string|max:50',
            'year' => 'required|string|max:10',
            'icon' => 'nullable|string|max:50',
            'order' => 'nullable|integer',
        ]);

        $achievement->update([
            'event' => $request->event,
            'result' => $request->result,
            'tier' => $request->tier ?? $achievement->tier,
            'year' => $request->year,
            'icon' => $request->icon ?? $achievement->icon,
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
        $achievement->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Prestasi berhasil dihapus.'
        ]);
    }
}
