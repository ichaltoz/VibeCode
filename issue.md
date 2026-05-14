# Issue: Implementasi Fitur Login User

## Deskripsi
Buat fitur login user menggunakan ElysiaJS dan Drizzle ORM. Fitur ini akan memverifikasi kredensial user (email dan password) dan menghasilkan token UUID yang disimpan dalam database (tabel `sessions`) sebagai penanda sesi aktif.

## 1. Perubahan Database (Schema)
Tambahkan definisi tabel `sessions` pada file Drizzle schema (biasanya di `src/db/schema.ts`).

**Definisi Tabel `sessions`:**
- `id`: integer, auto increment, primary key
- `token`: varchar(255), not null (akan diisi dengan UUID untuk token user yang login)
- `user_id`: integer, foreign key ke tabel `users` (kolom `id`)
- `created_at`: timestamp, default `current_timestamp`

*Catatan: Setelah memperbarui schema, jalankan perintah sinkronisasi Drizzle (contoh: `bunx drizzle-kit push`) untuk memperbarui database.*

## 2. Spesifikasi API

**Endpoint:** `POST /api/users/login`

**Request Body:**
```json
{
    "email": "ichal@example.com",
    "password": "password123"
}
```

**Response Body (Success):**
```json
{
   "data": "<UUID_TOKEN_DISINI>"
}
```

**Response Body (Error - Email/Password salah):**
```json
{
    "error": "Email atau Password Salah"
}
```

## 3. Struktur Folder dan Penamaan File
Gunakan standar struktur folder dan penamaan file berikut di dalam folder `src/`:
- **`src/routes/`**: Berisi file routing ElysiaJS. Gunakan format penamaan: `[nama]-route.ts` (contoh: `users-route.ts`).
- **`src/services/`**: Berisi file logic bisnis aplikasi (query database, validasi, dll). Gunakan format penamaan: `[nama]-service.ts` (contoh: `users-service.ts`).

## 4. Tahapan Implementasi (Step-by-Step Guide)

Silakan ikuti langkah-langkah berikut secara berurutan untuk mengimplementasikan fitur ini:

### Langkah 1: Update Skema Database
1. Buka file `src/db/schema.ts`.
2. Tambahkan definisi tabel `sessions` menggunakan tipe data dari `drizzle-orm/mysql-core` (seperti `int`, `varchar`, `timestamp`).
3. Pastikan relasi (Foreign Key) `user_id` merujuk ke tabel `users` dengan benar.
4. Jalankan perintah untuk menerapkan skema ke database (contoh: `bunx drizzle-kit push`).

### Langkah 2: Buat Business Logic di Service
1. Buat/buka file `src/services/users-service.ts`.
2. Buat fungsi/method (misal `loginUser`) di dalam service tersebut yang menerima parameter `email` dan `password`.
3. Alur logika fungsi login:
   - Lakukan query ke tabel `users` untuk mencari data berdasarkan `email`.
   - Jika user tidak ditemukan, lempar error atau return indikasi gagal.
   - Bandingkan `password` yang dikirim dengan password dari database. (Gunakan perbandingan string biasa atau bcrypt jika sebelumnya menggunakan hash).
   - Jika password tidak cocok, lempar error atau return indikasi gagal.
   - Jika validasi sukses:
     - Generate UUID string baru (bisa menggunakan `crypto.randomUUID()`).
     - Insert record baru ke tabel `sessions` berisi `token` (UUID tadi) dan `user_id` (id dari user yang berhasil login).
     - Kembalikan token UUID tersebut sebagai output fungsi.

### Langkah 3: Buat Routing di Route
1. Buat/buka file `src/routes/users-route.ts`.
2. Import service yang telah dibuat (`users-service.ts`).
3. Buat rute `POST /api/users/login` menggunakan instance Elysia.
4. Di dalam handler rute tersebut:
   - Ambil `email` dan `password` dari `body` request. Anda bisa menggunakan tipe validasi t.Object bawaan Elysia untuk memvalidasi body.
   - Panggil fungsi login dari service.
   - Tangani respons:
     - Jika service mengembalikan token (sukses), kirim response HTTP 200 dengan format JSON: `{ "data": "<token>" }`.
     - Jika service mengembalikan error/gagal (karena email/password salah), tangkap (catch) error tersebut dan kirim response error dengan format JSON: `{ "error": "Email atau Password Salah" }`. Pastikan HTTP status code di-set dengan sesuai (misalnya 400 Bad Request atau 401 Unauthorized).

### Langkah 4: Registrasi Route di Main App
1. Buka file entry point aplikasi (`src/index.ts`).
2. Import rute yang baru dibuat (`users-route.ts`).
3. Daftarkan/gunakan (`.use()`) rute tersebut ke instance utama ElysiaJS agar endpoint `/api/users/login` dapat diakses.

### Langkah 5: Pengujian
- Jalankan server pengembangan aplikasi.
- Lakukan pengujian endpoint menggunakan Postman, cURL, atau ekstensi REST Client.
- Uji skenario sukses (credentials benar) untuk memastikan token dikembalikan dan data session masuk ke database.
- Uji skenario gagal (credentials salah) untuk memastikan respons error yang tepat dikembalikan.
