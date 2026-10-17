<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    | Batasi akses API hanya dari domain frontend yang diizinkan.
    | Tambahkan domain frontend production kamu di allowed_origins.
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'DELETE', 'OPTIONS'],

    'allowed_origins' => [
        'http://localhost:5173',      // Vite dev server lokal
        'http://localhost:3000',      // fallback dev
        'http://192.168.113.122',     // IP VPS lokal
        'https://lt3tjkt.smkthpati.sch.id', // Domain production HTTPS
        'http://lt3tjkt.smkthpati.sch.id',  // Domain production HTTP
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Izinkan cookie dikirim (diperlukan Sanctum)
    'supports_credentials' => true,

];
