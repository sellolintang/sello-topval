# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Membuat file `lib/supabase/server.js` untuk mengelola koneksi klien Supabase sisi server menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` dari environment variable.
- Mengubah `app/page.jsx` menjadi *async Server Component* untuk mengambil data secara langsung dari tabel "produk" di Supabase.
- Menambahkan penanganan error (pesan error merah) saat gagal mengambil data.
- Menambahkan status kosong dengan pesan "Belum ada produk" bila tabel tidak memiliki data.
- Menghapus `CatatanBelumAktif` dan data *dummy* dari halaman.

**Perbaikan:**
- (Tidak ada perbaikan yang dilakukan untuk saat ini)

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Mengubah file `app/produk/[id]/page.jsx` agar mengambil detail satu produk menggunakan id URL, di sisi server dari Supabase.
- Memakai `supabaseServer.from("produk").select("*").eq("id", id).single()` untuk mengambil data secara presisi.
- Memanggil `notFound()` dari `next/navigation` jika produk tidak ada di database atau jika terjadi error saat pengambilan data.
- Menghapus komponen `CatatanBelumAktif` dan data *dummy* dari halaman sambil tetap mempertahankan komponen `TombolWhatsApp` dan tampilannya.

**Perbaikan:**
- (Belum ada perbaikan sejauh ini)

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
