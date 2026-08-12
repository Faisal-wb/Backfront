<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactController extends Controller
{
    /**
     * Store a new public contact / PPDB inquiry message in MySQL database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'message' => 'required|string',
        ]);

        $msg = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'status' => 'unread',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pesan pendaftaran/kontak berhasil tersimpan di database MySQL!',
            'data' => $msg
        ], 201);
    }
}
