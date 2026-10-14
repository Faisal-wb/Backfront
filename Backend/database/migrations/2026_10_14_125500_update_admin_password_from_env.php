<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Updates admin password securely from ADMIN_DEFAULT_PASSWORD env variable if set.
     */
    public function up(): void
    {
        $newPassword = env('ADMIN_DEFAULT_PASSWORD');

        if (!empty($newPassword)) {
            User::where('name', 'admin')
                ->orWhere('email', 'admin@tjkt.sch.id')
                ->update([
                    'password' => Hash::make($newPassword),
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
