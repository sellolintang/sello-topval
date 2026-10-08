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
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Mengubah komponen `components/TombolWhatsApp.jsx` dari `<button>` menjadi elemen `<a>` (tautan).
- Menyambungkan URL tujuan ke `https://wa.me/` menggunakan `toko.nomorWhatsApp` dari `lib/toko.js`.
- Menambahkan parameter `text` otomatis dengan pesan yang memuat nama dan harga produk (`formatRupiah`), yang di-encode melalui `encodeURIComponent`.
- Tautan dibuka di tab baru (`target="_blank"`, `rel="noopener noreferrer"`) dengan tetap mempertahankan _styling_ tombol sebelumnya.

**Perbaikan:**
- (Tidak ada perbaikan lanjutan sejauh ini)

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Membuat fungsi `createClientSsr` di file `lib/supabase/ssr.js` memakai `@supabase/ssr` dan cookies untuk membuat klien Supabase agar *auth session* bisa disimpan.
- Membuat Server Actions `loginAction` dan `logoutAction` di `app/admin/actions.js` yang memanfaatkan `signInWithPassword` serta `signOut`.
- Mengubah `app/admin/login/page.jsx` agar terhubung dengan `loginAction` (menggunakan `useActionState`), menampilkan pesan error jika ada, dan menghapus `CatatanBelumAktif`.
- Mengganti komponen tombol "Keluar" di `components/NavAdmin.jsx` agar berada di dalam `<form>` dan mengeksekusi aksi `logoutAction`.

**Perbaikan:**
- (Tidak ada perbaikan yang dilakukan untuk saat ini)

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Membuat Server Action `changePasswordAction` di `app/admin/actions.js` untuk mengganti password admin via `supabase.auth.updateUser`.
- Menambahkan validasi di sisi server pada action tersebut untuk memastikan password baru minimal 8 karakter dan bernilai sama dengan isian konfirmasi password.
- Menghubungkan form di `app/admin/password/page.jsx` dengan action tersebut menggunakan `useActionState` (mengubahnya menjadi *Client Component*).
- Menampilkan pesan berhasil (hijau) atau pesan error (merah) sesuai kembalian dari eksekusi server action.
- Menghapus komponen referensi ke `CatatanBelumAktif` dan mempertahankan *styling* desain sebelumnya.

**Perbaikan:**
- (Belum ada perbaikan yang dilakukan)

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Membuat middleware `proxy.js` di root direktori proyek untuk mencegat akses ke URL `/admin/*` memakai `@supabase/ssr`.
- Aturan _redirect_ disetel agar pengunjung tanpa sesi akan ditendang ke `/admin/login`, dan admin yang sudah login bila mengunjungi halaman login akan diarahkan ke dasbor `/admin`.
- Menambahkan validasi `supabase.auth.getUser()` pada fungsi `changePasswordAction` di `app/admin/actions.js` agar hanya bisa dieksekusi bila *user* benar-benar login (melindungi dari serangan eksternal).
- Menghapus komponen referensi ke `CatatanBelumAktif` yang ada di halaman `app/admin/page.jsx`.

**Perbaikan:**
- (Tidak ada perbaikan lanjutan)

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
