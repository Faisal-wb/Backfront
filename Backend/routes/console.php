<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('admin:set-password {pass?}', function ($pass = null) {
    $raw = $pass ?: env('ADMIN_NEW_PASS') ?: env('ADMIN_DEFAULT_PASSWORD');
    if (empty($raw)) {
        $this->warn('No password found in args or env.');
        return 1;
    }

    // Bersihkan dari spasi, enter, atau tanda petik yang tidak sengaja terbawa
    $cleanPass = trim($raw, " \t\n\r\0\x0B\"'");

    $user = User::where('name', 'admin')->orWhere('email', 'admin@tjkt.sch.id')->first();
    if (!$user) {
        $user = User::create([
            'name' => 'admin',
            'email' => 'admin@tjkt.sch.id',
            'password' => Hash::make($cleanPass),
        ]);
        $this->info("Akun admin dibuat: [{$user->name}] ({$user->email})");
    } else {
        $user->password = Hash::make($cleanPass);
        $user->save();
        $this->info("Password untuk user [{$user->name}] ({$user->email}) berhasil diupdate!");
    }

    // Verifikasi langsung apakah hash cocok
    if (Hash::check($cleanPass, $user->password)) {
        $this->info("Verifikasi hash: COCOK 100%! (Panjang karakter: " . strlen($cleanPass) . ")");
    } else {
        $this->error("Verifikasi hash: GAGAL!");
    }

    return 0;
})->purpose('Set or reset admin password securely');

