<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Authenticate admin credentials strictly against MySQL Database users table.
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $username = trim($request->input('username'));
        $password = trim($request->input('password'));

        try {
            // Search in MySQL Database (`users` table by `name` or `email`)
            $user = User::where('name', $username)->orWhere('email', $username)->first();

            if ($user && Hash::check($password, $user->password)) {
                $token = $user->createToken('admin-token')->plainTextToken;

                return response()->json([
                    'status' => 'success',
                    'message' => 'Login berhasil!',
                    'token' => $token,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ]
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server Database MySQL belum aktif / belum di-migrate. Mohon nyalakan Laragon/MySQL!'
            ], 500);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Username atau password salah! Silakan coba lagi.'
        ], 401);
    }

    /**
     * Admin logout.
     */
    public function logout(Request $request)
    {
        if ($request->user() && method_exists($request->user(), 'currentAccessToken')) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logout berhasil!'
        ]);
    }
}
