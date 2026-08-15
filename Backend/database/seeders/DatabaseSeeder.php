<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stat;
use App\Models\HeroSlide;
use App\Models\Achievement;
use App\Models\GalleryItem;
use App\Models\Teacher;
use App\Models\Testimonial;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Stats
        Stat::truncate();
        $stats = [
            ['label' => 'SISWA AKTIF', 'value' => '436', 'suffix' => '', 'order' => 1],
            ['label' => 'GURU PRODUKTIF', 'value' => '9', 'suffix' => '', 'order' => 2],
            ['label' => 'PENGHARGAAN', 'value' => '35', 'suffix' => '', 'order' => 3],
            ['label' => 'PROYEK SUKSES', 'value' => '30', 'suffix' => '+', 'order' => 4],
        ];
        foreach ($stats as $s) {
            Stat::create($s);
        }

        // 2. Hero Slides
        HeroSlide::truncate();
        $slides = [
            [
                'category' => 'TEACHING FACTORY',
                'title' => 'Teaching Factory (TeFa) Proyek Industri',
                'badge_title' => 'Industrial Teaching Factory',
                'badge_sub' => '30+ Proyek Industri Sukses',
                'tags' => ['Project TeFa', 'Mitra Industri', 'SKKNI'],
                'url' => 'https://images.unsplash.com/photo-1719159381981-1327b22aff9b?w=1000&h=700&fit=crop&auto=format',
                'order' => 1
            ],
            [
                'category' => 'PROGRAMMING',
                'title' => 'Pengembangan Software, Web, & Mobile App',
                'badge_title' => 'Fullstack Software Engineering',
                'badge_sub' => 'PHP, Laravel, React, Node.js',
                'tags' => ['Laravel', 'React', 'Mobile App'],
                'url' => 'https://images.unsplash.com/photo-1764025130362-0162c3dd2035?w=1000&h=700&fit=crop&auto=format',
                'order' => 2
            ],
            [
                'category' => 'NETWORKING',
                'title' => 'Infrastruktur Jaringan & Keamanan Siber',
                'badge_title' => 'Industrial Networking Lab',
                'badge_sub' => 'Perangkat Cisco & MikroTik Asli',
                'tags' => ['Cisco CCNA', 'MikroTik MTCNA', 'Cybersec'],
                'url' => 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=1000&h=700&fit=crop&auto=format',
                'order' => 3
            ],
            [
                'category' => 'FIBER OPTIC',
                'title' => 'Telekomunikasi Fiber Optic & Splicing',
                'badge_title' => 'Fiber Optic Specialist',
                'badge_sub' => 'Splicing & OTDR Measurement',
                'tags' => ['Fiber Optic', 'FTTH', 'OTDR Testing'],
                'url' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&h=700&fit=crop&auto=format',
                'order' => 4
            ],
            [
                'category' => 'PRESTASI LKS',
                'title' => 'Juara 1 LKS Network Systems Administration',
                'badge_title' => 'Gold Medal Winner',
                'badge_sub' => 'LKS Tingkat Provinsi & Nasional',
                'tags' => ['Juara LKS', 'Siswa Berprestasi', 'Gold Medal'],
                'url' => 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=1000&h=700&fit=crop&auto=format',
                'order' => 5
            ],
            [
                'category' => 'KEGIATAN SISWA',
                'title' => 'Kolaborasi & Workshop Industri Digital',
                'badge_title' => 'Active Student Community',
                'badge_sub' => 'Mentorship & Coding Bootcamp',
                'tags' => ['Workshop', 'Bootcamp', 'Komunitas TJKT'],
                'url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&h=700&fit=crop&auto=format',
                'order' => 6
            ],
        ];
        foreach ($slides as $sl) {
            HeroSlide::create($sl);
        }

        // 3. Achievements
        Achievement::truncate();
        $achievements = [
            ['event' => 'LKS Web Technologies', 'result' => 'Juara 1 Nasional', 'tier' => 'gold', 'year' => '2019', 'icon' => 'Code', 'order' => 1],
            ['event' => 'LKS Cyber Security', 'result' => 'Juara 2 Provinsi', 'tier' => 'silver', 'year' => '2025', 'icon' => 'Shield', 'order' => 2],
            ['event' => 'Artificial Intelligence', 'result' => 'Juara 2 Provinsi', 'tier' => 'silver', 'year' => '2026', 'icon' => 'Monitor', 'order' => 3],
            ['event' => 'LKS Web Technologies', 'result' => 'Juara 1 Provinsi', 'tier' => 'gold', 'year' => '2026', 'icon' => 'Code', 'order' => 4],
            ['event' => 'IT Software Solution', 'result' => 'Juara 1 Kabupaten', 'tier' => 'gold', 'year' => '2025', 'icon' => 'Code', 'order' => 5],
            ['event' => 'Web Design Competition', 'result' => 'Juara 1 Kabupaten', 'tier' => 'gold', 'year' => '2026', 'icon' => 'Monitor', 'order' => 6],
        ];
        foreach ($achievements as $a) {
            Achievement::create($a);
        }

        // 4. Gallery Items
        GalleryItem::truncate();
        $gallery = [
            ['url' => 'https://images.unsplash.com/photo-1719159381981-1327b22aff9b?w=600&h=800&fit=crop&auto=format', 'alt' => 'Sesi Praktik Jaringan Komputer di Lab TJKT', 'tall' => true, 'order' => 1],
            ['url' => 'https://images.unsplash.com/photo-1764025130362-0162c3dd2035?w=600&h=400&fit=crop&auto=format', 'alt' => 'Workshop Coding & Software Engineering', 'tall' => false, 'order' => 2],
            ['url' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop&auto=format', 'alt' => 'Praktikum Fiber Optic Splicing & OTDR', 'tall' => false, 'order' => 3],
            ['url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=800&fit=crop&auto=format', 'alt' => 'Project Presentation Teaching Factory (TeFa)', 'tall' => true, 'order' => 4],
            ['url' => 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=600&h=400&fit=crop&auto=format', 'alt' => 'Konfigurasi Server & Router Cisco MikroTik', 'tall' => false, 'order' => 5],
            ['url' => 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=600&h=400&fit=crop&auto=format', 'alt' => 'Penyerahan Penghargaan LKS Tingkat Provinsi', 'tall' => false, 'order' => 6],
        ];
        foreach ($gallery as $g) {
            GalleryItem::create($g);
        }

        // 5. Teachers
        Teacher::truncate();
        $teachers = [
            ['name' => "M. Bahrun Ni'am, S.Kom.", 'role' => 'Ketua Jurusan TJKT', 'initials' => 'BN', 'color' => '#DC2626', 'order' => 1],
            ['name' => 'Dandi Habib Kuwayyis, S.Kom', 'role' => 'Guru Pemrograman Web', 'initials' => 'DH', 'color' => '#2563EB', 'order' => 2],
            ['name' => 'Dennim Sandika', 'role' => 'Guru Pemrograman Dekstop', 'initials' => 'DS', 'color' => '#7C3AED', 'order' => 3],
            ['name' => 'Andi Okta', 'role' => 'Guru Keamanan Jaringan', 'initials' => 'AO', 'color' => '#059669', 'order' => 4],
            ['name' => 'Kustiyadi, ST.', 'role' => 'Guru Teknik Jaringan', 'initials' => 'KY', 'color' => '#D97706', 'order' => 5],
            ['name' => 'Nanda Surisman, S.S.T.', 'role' => 'Guru Hardware', 'initials' => 'NS', 'color' => '#0891B2', 'order' => 6],
            ['name' => 'Nur Hidayah', 'role' => 'Guru Jaringan Komputer', 'initials' => 'NH', 'color' => '#DB2777', 'order' => 7],
            ['name' => 'Abdylla Adiyasa', 'role' => 'Guru Jaringan', 'initials' => 'AA', 'color' => '#CA8A04', 'order' => 8],
            ['name' => 'Andrean Dwi Wibowo', 'role' => 'Guru Jaringan Komputer', 'initials' => 'AW', 'color' => '#0D9488', 'order' => 9],
        ];
        foreach ($teachers as $t) {
            Teacher::create($t);
        }

        // 6. Testimonials
        Testimonial::truncate();
        $testimonials = [
            [
                'name' => 'Rizky Ramadhan',
                'role' => 'Network Engineer @ Telkom Indonesia',
                'quote' => 'Ilmu networking dari TJKT SMK TH sangat relevan dengan kebutuhan industri. Praktik Cisco dan MikroTik langsung di lab membuat saya siap kerja begitu lulus.',
                'year' => 'Alumni 2021',
                'initials' => 'RR',
                'order' => 1
            ],
            [
                'name' => 'Dina Setyowati',
                'role' => 'Fullstack Developer @ Shopee Indonesia',
                'quote' => 'Di TJKT saya belajar web development dari nol. Kurikulum programming-nya update dengan tech stack modern. Terima kasih bapak ibu guru TJKT!',
                'year' => 'Alumni 2022',
                'initials' => 'DS',
                'order' => 2
            ],
            [
                'name' => 'Fajar Nugroho',
                'role' => 'Cybersecurity Analyst @ Bank Mandiri',
                'quote' => 'Dasar keamanan jaringan dan sistem operasi yang diajarkan di TJKT menjadi fondasi kokoh untuk karir saya di bidang cybersecurity.',
                'year' => 'Alumni 2020',
                'initials' => 'FN',
                'order' => 3
            ],
        ];
        foreach ($testimonials as $tm) {
            Testimonial::create($tm);
        }

        // 7. Default Admin User (If table is empty)
        if (\App\Models\User::count() === 0) {
            \App\Models\User::create([
                'name' => 'admin',
                'email' => 'admin@tjkt.sch.id',
                'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            ]);
        }
    }
}


