# Issue: Implementasi Fitur Get Current User

## Deskripsi
Buat endpoint API untuk mengambil data profil user yang sedang login saat ini. Endpoint ini akan memvalidasi token otorisasi (Bearer Token) yang dikirim melalui header request, mencocokkannya dengan data sesi aktif di database, dan mengembalikan informasi user jika token tersebut valid.

## Spesifikasi API

**Endpoint:** `GET /api/users/current`

**Headers yang Dibutuhkan:**
- `Authorization`: `Bearer <token>` 

**Response Body (Success):**
```json
{
   "data": {
    "id": 1,
    "name": "Ichaltoz",
    "email": "ichaltoz@exampels.com",
    "created_at": "timestamp"
   }
}
```

**Response Body (Error):**
```json
{
    "error": "Unauthorized"
}
```

## Struktur Folder dan Penamaan File
- **Routes:** `src/routes/users-route.ts`
- **Services:** `src/services/users-service.ts`

## Tahapan Implementasi
1. Buat fungsi `getCurrentUser` di `src/services/users-service.ts`.
2. Gunakan `INNER JOIN` antara `sessions` dan `users`.
3. Tambahkan endpoint `GET /api/users/current` di `src/routes/users-route.ts`.
4. Validasi header `Authorization: Bearer <token>`.
