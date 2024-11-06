# Portfolio Management API

API ini memungkinkan pengguna untuk mengelola portofolio, termasuk menambahkan, memperbarui, dan menghapus proyek terkait. Aplikasi ini menggunakan **Node.js**, **Express**, dan **Sequelize ORM** dengan **MySQL** sebagai basis data.

## Teknologi

- Node.js
- MySQL
- Sequelize CLI

## Langkah-langkah Instalasi

### 1. Clone Repository

Clone repository ini ke dalam lokal Anda:

```bash
git clone <repository-url>
cd <nama-folder-repository>
```

### 2. Install Dependensi

Jalankan perintah berikut untuk menginstal dependensi:

```bash
npm install
```

### 3. Konfigurasi Database

Buat file `.env` di root folder dan tambahkan konfigurasi database Anda:

```plaintext
DB_HOST=yourhost
DB_USER=yourroot
DB_PASSWORD=yourpassword
DB_NAME=yourdatabase
DB_DIALECT=mysql
DB_PORT=yourport
```

### 4. Membuat Database

Gunakan perintah berikut untuk membuat database:

```bash
npx sequelize-cli db:create
```

### 5. Migrasi Database

Jalankan migrasi untuk membuat tabel yang diperlukan dalam database:

```bash
npx sequelize-cli db:migrate
```

### 6. Menjalankan Seeder (Opsional)

Untuk mengisi data awal pada tabel `Users` dan `Portfolios`, jalankan seed berikut:

```bash
npx sequelize-cli db:seed:all
```

### 7. Menjalankan Server

Jalankan server lokal menggunakan perintah berikut:

```bash
npm run dev
```

Server akan berjalan pada `http://localhost:3000`.

---

## Endpoint API

#### Autentikasi dan Otorisasi

Untuk mengautentikasi permintaan API, Anda harus memberikan token Anda di header `Authorization`.

`POST {baseUrl}/users/login`

#### Mengambil Data Pengguna

| Metode | Endpoint           | Deskripsi                                  |
| ------ | ------------------ | ------------------------------------------ |
| `GET`  | `/users`           | Mendapatkan semua pengguna                 |
| `GET`  | `/users/:id`       | Mendapatkan pengguna berdasarkan id        |
| `GET`  | `/users/:id/posts` | Mendapatkan post berdasarkan id pengguna   |
| `POST` | `/users/login`     | Mendapatkan token pengguna                 |
| `POST` | `/users`           | Membuat pengguna baru                      |
| `PUT`  | `/users/:id`       | `require authentication` Mengedit pengguna |

#### Mengambil Data Post

| Metode   | Endpoint     | Deskripsi                                  |
| -------- | ------------ | ------------------------------------------ |
| `GET`    | `/posts`     | Mendapatkan semua post                     |
| `GET`    | `/posts/:id` | Mendapatkan post berdasarkan id            |
| `POST`   | `/posts`     | `require authentication` Membuat post baru |
| `PUT`    | `/posts/:id` | `require authentication` Mengedit post     |
| `DELETE` | `/posts/:id` | `require authentication` Menghapus post    |

#### Mengambil Data Komentar

| Metode   | Endpoint             | Deskripsi                                      |
| -------- | -------------------- | ---------------------------------------------- |
| `GET`    | `/comments`          | Mendapatkan semua komentar                     |
| `GET`    | `/comments/:id`      | Mendapatkan komentar berdasarkan id            |
| `GET`    | `/comments/:id/post` | Mendapatkan komentar berdasarkan id **post**   |
| `POST`   | `/comments`          | `require authentication` Membuat komentar baru |
| `PUT`    | `/comments/:id`      | `require authentication` Mengedit komentar     |
| `DELETE` | `/comments/:id`      | `require authentication` Menghapus komentar    |

#### Mengambil Data Like

| Metode   | Endpoint     | Deskripsi                                  |
| -------- | ------------ | ------------------------------------------ |
| `GET`    | `/likes`     | Mendapatkan semua like                     |
| `POST`   | `/likes`     | `require authentication` Membuat like baru |
| `DELETE` | `/likes/:id` | `require authentication` Menghapus like    |

#### Mengambil Data Berita

| Metode   | Endpoint    | Deskripsi                                    |
| -------- | ----------- | -------------------------------------------- |
| `GET`    | `/news`     | Mendapatkan semua berita                     |
| `GET`    | `/news/:id` | Mendapatkan berita berdasarkan id            |
| `POST`   | `/news`     | `require authentication` Membuat berita baru |
| `PUT`    | `/news/:id` | `require authentication` Mengedit berita     |
| `DELETE` | `/news/:id` | `require authentication` Menghapus berita    |

#### Mengambil Data Kategori

| Metode   | Endpoint          | Deskripsi                                      |
| -------- | ----------------- | ---------------------------------------------- |
| `GET`    | `/categories`     | Mendapatkan semua kategori                     |
| `GET`    | `/categories/:id` | Mendapatkan kategori berdasarkan id            |
| `POST`   | `/categories`     | `require authentication` Membuat kategori baru |
| `PUT`    | `/categories/:id` | `require authentication` Mengedit kategori     |
| `DELETE` | `/categories/:id` | `require authentication` Menghapus kategori    |

#### Mengambil Data Petisi

| Metode   | Endpoint         | Deskripsi                                    |
| -------- | ---------------- | -------------------------------------------- |
| `GET`    | `/petitions`     | Mendapatkan semua petisi                     |
| `GET`    | `/petitions/:id` | Mendapatkan petisi berdasarkan id            |
| `POST`   | `/petitions`     | `require authentication` Membuat petisi baru |
| `PUT`    | `/petitions/:id` | `require authentication` Mengedit petisi     |
| `DELETE` | `/petitions/:id` | `require authentication` Menghapus petisi    |

#### Mengambil Data Tanda Tangan

| Metode   | Endpoint          | Deskripsi                                          |
| -------- | ----------------- | -------------------------------------------------- |
| `GET`    | `/signatures`     | Mendapatkan semua tanda tangan                     |
| `GET`    | `/signatures/:id` | Mendapatkan tanda tangan berdasarkan id            |
| `POST`   | `/signatures`     | `require authentication` Membuat tanda tangan baru |
| `DELETE` | `/signatures/:id` | `require authentication` Menghapus tanda tangan    |
