# Panduan Optimasi Performa Website Frontend

Dokumen ini berisi rangkuman langkah-langkah optimasi yang telah diterapkan untuk mengatasi masalah *lag* (performa lambat/berat) pada website ini. Anda dapat menggunakan panduan ini sebagai rujukan di masa mendatang jika kembali menemui isu serupa.

## 1. Kompresi dan Optimasi Ukuran Gambar
**Masalah Sebelumnya:**
Ukuran aset gambar berformat `.jpg` dan `.png` di dalam `src/assets/TKJ/` sangat raksasa (rata-rata 8MB - 16MB *per gambar*). Hal ini menyebabkan beban *network* sangat tinggi saat memuat website dan ukuran total *build* (*dist*) membengkak hingga **82 MB**. Selain itu, *browser* bekerja ekstra keras untuk melakukan proses *decoding* gambar resolusi tinggi, yang mengakibatkan CPU/GPU spike dan *stuttering*.

**Solusi & Cara Mengatasi:**
- **Ubah format ke WebP:** WebP memberikan kualitas visual yang hampir identik dengan ukuran *file* yang jauh lebih kecil.
- **Resize resolusi maksimal:** Kami memastikan tidak ada gambar yang resolusinya melebihi 1920 piksel (karena resolusi layar paling umum adalah 1080p).
- **Proses:** Menggunakan *library* Node.js `sharp` untuk melakukan *batch compress*.
- **Hasil:** Ukuran folder *build* turun drastis dari **82 MB** menjadi **1.6 MB** saja.

*Saran di Masa Depan:* Jika ada tambahan gambar baru, pastikan dikompresi dahulu sebelum dimasukkan ke repositori (misalnya menggunakan website seperti Squoosh, TinyPNG, atau _script_ konverter WebP).

## 2. Penghentian Render Loop pada Canvas yang Tidak Terlihat
**Masalah Sebelumnya:**
Komponen `FluidCanvasCursor` menggunakan `requestAnimationFrame` untuk merender partikel merah (*fluid*). Sayangnya, *loop* ini berjalan abadi (60 FPS) melakukan `ctx.clearRect()` meskipun tidak ada partikel sama sekali (misal kursor mouse tidak bergerak). Hal ini membuang resource CPU dan GPU secara sia-sia.

**Solusi & Cara Mengatasi:**
- **Validasi jumlah partikel:** Menambahkan pengecekan di dalam blok `render()`. Jika `particles.length === 0`, maka matikan status berjalannya (`isRunning = false`) dan gunakan `return` untuk menghentikan *loop* animasi.
- **Trigger ulang (Start Loop):** Fungsi `requestAnimationFrame` akan dijalankan ulang (*re-trigger*) hanya di dalam *event listener* `onMouseMove` jika *mouse* kembali bergerak dan *loop* animasi sedang dalam status mati.

## 3. Throttle + requestAnimationFrame pada Event Scroll
**Masalah Sebelumnya:**
Ada beberapa komponen (seperti `TopScrollProgress` dan `App` utama) yang menempelkan *listener* pada event `scroll` dari `window`. Tiap kali *user* menggulung layar meski hanya satu piksel, state dari *React* terus terbarui tanpa henti (seperti menghitung persentase lebar garis merah atau mendeteksi *section* mana yang aktif). Pembaruan state yang terlalu masif ini mencekik *Main Thread* dari browser.

**Solusi & Cara Mengatasi:**
- **Implementasi Throttle dengan `requestAnimationFrame`:** 
  Event `scroll` dibatasi supaya *React* hanya meng-*update* state-nya pada *frame* berikutnya di layar (maksimal mengikuti *refresh rate* monitor).
- Menggunakan bendera (flag) boolean ringan (`ticking = false`) untuk menolak event baru sampai frame animasi yang tertunda selesai digambar oleh *browser*.

*Contoh Penerapan:*
```javascript
let ticking = false;
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      // Jalankan kalkulasi dan update state React di sini
      ticking = false;
    });
    ticking = true;
  }
};
window.addEventListener("scroll", handleScroll, { passive: true });
```
*(Catatan ekstra: Opsi `{ passive: true }` ditambahkan untuk memberi tahu *browser* bahwa *scroll* tidak akan dibatalkan, sehingga performa ulir/thread *scroll* akan lebih mulus).*

## 4. Efisiensi Interval Autoplay di Gallery
**Masalah Sebelumnya:**
Komponen `GallerySection` memiliki efek berganti foto secara otomatis menggunakan `setInterval`. Sayangnya, setiap kali `activeIdx` berganti, efek `useEffect` membersihkan interval lama (`clearInterval`) dan membuat ulang interval yang baru. Ini merupakan pola *churning* memori yang kurang ideal.

**Solusi & Cara Mengatasi:**
- Daripada membaca *state* `activeIdx` di dalam *dependency array* useEffect, kita dapat memanfaatkan *callback state update* di dalam *React*:
  `setActiveIdx((cur) => (cur + 1) % items.length);`
- Dengan ini, `useEffect` yang bertugas menjalankan `setInterval` hanya perlu dijalankan sekali (atau setidaknya tidak bergantung pada indeks foto saat ini), menghilangkan beban terus menerus dari membuat-buang interval.

## 5. Implementasi Halus menggunakan Framer Motion
Untuk komponen penunjuk progres di bagian paling atas layar (`TopScrollProgress`), kalkulasi lebar garis menggunakan nilai persentase manual sudah digantikan menggunakan utilitas bawaan *React* `framer-motion`:
- Menggunakan *hook* `useScroll()` dan div `motion.div` dengan animasi fisika per (spring) yang mulus `useSpring()`.
- Hal ini memanfaatkan optimasi grafis tingkat rendah dari framer motion agar lebih mulus dipandang mata namun sangat bersahabat bagi performa perangkat (lebih cepat daripada *event listener* `scroll` *React* buatan sendiri).
