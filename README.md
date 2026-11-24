# CampusTask

CampusTask adalah aplikasi web manajemen tugas akademik mahasiswa yang dibangun sebagai tugas individu mata kuliah **Web Application Development**. Aplikasi ini membantu mahasiswa mencatat, memantau, dan menyelesaikan tugas perkuliahan melalui dashboard modern bertema hitam putih.

Aplikasi ini sepenuhnya berjalan di browser (client-side), menggunakan **localStorage** sebagai penyimpanan data, dan tidak memerlukan backend atau database eksternal.

---

## 1. Fitur Utama

- Dashboard dengan ringkasan statistik dinamis:
  - Total tugas
  - Jumlah tugas selesai
  - Jumlah tugas pending
  - Persentase penyelesaian
  - Jumlah tugas terlambat
- Manajemen tugas penuh (CRUD):
  - Tambah tugas baru dengan validasi form
  - Edit tugas yang sudah ada
  - Hapus tugas dengan dialog konfirmasi
  - Ubah status pending/completed langsung dari daftar
- Pencarian tugas berdasarkan judul atau nama mata kuliah.
- Filter berdasarkan status navigasi dan prioritas.
- Pengurutan berdasarkan tenggat, prioritas, atau judul.
- Indikator visual untuk tugas yang terlambat.
- Empty state ketika tidak ada tugas yang cocok.
- Toast notification untuk operasi berhasil maupun gagal.
- Desain responsif: sidebar desktop dan bottom navigation untuk mobile.
- Data persisten menggunakan `localStorage` dengan penanganan data rusak/tidak valid.
- Contoh tugas realistis otomatis dibuat pada peluncuran pertama.

---

## 2. Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Build tool | Vite 8 |
| Bahasa | TypeScript 5 (strict mode) |
| Logika aplikasi | Vanilla TypeScript (tanpa framework UI) |
| Markup | HTML5 |
| Styling | CSS3 + Tailwind CSS 4 melalui `@tailwindcss/vite` |
| Package manager | npm |
| Penyimpanan | Browser `localStorage` |
| Version control | Git & GitHub |

> Tailwind CSS digunakan hanya sebagai utilitas styling pada proses build. Seluruh logika aplikasi tetap ditulis dengan Vanilla TypeScript dan tidak menggunakan React, Vue, Angular, atau framework frontend sejenis.

### Dependencies

Tidak ada runtime dependencies. Aplikasi hanya memanfaatkan API bawaan browser.

### DevDependencies

| Paket | Fungsi |
|---|---|
| `vite` | Dev server dan production bundler |
| `typescript` | Compiler dan pengecekan tipe statis |
| `tailwindcss` | Generator utilitas CSS untuk tampilan dashboard |
| `@tailwindcss/vite` | Integrasi Tailwind CSS ke dalam Vite |

---

## 3. Instalasi dan Menjalankan Aplikasi

### Prasyarat

- Node.js 20.19+ atau 22.12+ (disarankan Node.js 24 karena digunakan saat pengembangan)
- npm 10+
- Git

### Langkah instalasi

```bash
npm install
```

### Menjalankan mode pengembangan

```bash
npm run dev
```

Vite akan menyajikan aplikasi di `http://localhost:3000`. Opsi `open: true` pada `vite.config.ts` akan membuka browser secara otomatis.

### Scripts npm

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan dev server Vite |
| `npm run build` | Menjalankan `tsc` lalu membuat build produksi di folder `dist/` |
| `npm run preview` | Melihat hasil build produksi secara lokal |
| `npm run typecheck` | Menjalankan pengecekan TypeScript tanpa menghasilkan file |

---

## 4. Konfigurasi Environment Variable

Proyek menggunakan file `.env` untuk konfigurasi publik yang tidak bersifat rahasia.

### `.env`

```env
VITE_APP_NAME=CampusTask
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Opsional: ubah saat deploy ke subdirectory, misalnya /campustask/
VITE_BASE_PATH=./
```

### `.env.example`

File `.env.example` sengaja disimpan di Git sebagai contoh konfigurasi. File `.env` **tidak boleh** di-commit karena sudah masuk ke `.gitignore`.

### Variabel yang digunakan

| Variabel | Kegunaan |
|---|---|
| `VITE_APP_NAME` | Nama aplikasi yang ditampilkan di sidebar dan judul halaman |
| `VITE_APP_VERSION` | Versi aplikasi yang ditampilkan di sidebar |
| `VITE_APP_ENV` | Label lingkungan, misalnya `development` atau `production` |
| `VITE_BASE_PATH` | Base path asset saat di-deploy ke subdirectory |

Semua variabel diakses melalui `import.meta.env`, misalnya:

```ts
const appName: string = import.meta.env.VITE_APP_NAME || 'CampusTask';
```

Deklarasi tipe untuk environment variable berada di `src/vite-env.d.ts`.

> Jangan pernah menyimpan password, API key, token, atau data sensitif lain di file yang diawali `VITE_`, karena nilai tersebut akan ikut ter-bundle ke JavaScript client.

---

## 5. Struktur Proyek

```text
campusTask/
├── .env                          # Konfigurasi lokal (tidak di-commit)
├── .env.example                  # Contoh konfigurasi (di-commit)
├── .gitignore                    # Daftar file/direktori yang diabaikan Git
├── index.html                    # Entry point HTML
├── package.json                  # Scripts dan devDependencies
├── package-lock.json             # Lockfile npm
├── tsconfig.json                 # Konfigurasi TypeScript strict
├── vite.config.ts                # Konfigurasi Vite, plugin Tailwind, dan base path
├── README.md                     # Dokumentasi proyek
├── dist/                         # Hasil build produksi (generated, diabaikan Git)
├── node_modules/                 # Dependensi npm (diabaikan Git)
└── src/
    ├── vite-env.d.ts             # Deklarasi tipe import.meta.env
    ├── styles/
    │   ├── main.css              # Tailwind import, scrollbar, dan animasi global
    │   └── components.css        # Refinement komponen dan responsive tweaks
    └── scripts/
        ├── main.ts               # Inisialisasi app, state, dan orkestrasi render
        ├── types/
        │   └── assignment.ts     # Interface, type alias, dan union type
        ├── services/
        │   └── storage.ts        # Generic localStorage utility + data sample
        ├── components/
        │   ├── dashboard.ts      # Sidebar dan mobile navigation
        │   ├── dashboard-header.ts# Sapaan, tanggal, dan statistik card
        │   ├── task-list.ts      # Tabel tugas, search, filter, sort, dan aksi
        │   ├── task-form.ts      # Modal tambah/edit tugas + validasi
        │   └── notifications.ts  # Toast dan dialog konfirmasi
        └── utils/
            ├── date.ts           # Format tanggal dan deteksi keterlambatan
            ├── filters.ts        # Search, filter, dan sort logic
            ├── html.ts           # Escape HTML untuk keamanan innerHTML
            └── statistics.ts     # Kalkulasi statistik dashboard
```

---

## 6. Konsep TypeScript yang Didemonstasikan

### A. Primitive Types

Digunakan secara eksplisit pada banyak file, antara lain:

- `string`: `title`, `course`, `dueDate`, `id`, `message`, `query`
- `number`: `completionRate`, `total`, `diffDays`, `rank`
- `boolean`: `isValid`, `isCompleted`, `isOverdue`, `found`

Contoh:

```ts
const query: string = searchQuery.trim().toLowerCase();
let isValid = true;
const completionRate: number = total > 0 ? Math.round((completed / total) * 100) : 0;
```

### B. Arrays

Typed array digunakan untuk kumpulan tugas dan konfigurasi:

```ts
const INITIAL_ASSIGNMENTS: Assignment[] = [ /* ... */ ];
const assignments: Assignment[] = getAssignments();
const PRIORITIES: Array<{ value: Priority; label: string }> = [ /* ... */ ];
```

### C. Interface

Interface utama ada di `src/scripts/types/assignment.ts`:

```ts
export interface Assignment {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: AssignmentStatus;
  createdAt: string;
}
```

Interface lain juga digunakan untuk props komponen, seperti `DashboardStats`, `SidebarProps`, `TaskListProps`, dan `AppState`, sehingga struktur data komponen tetap jelas.

### D. Type Alias dan Union Types

```ts
export type Priority = 'low' | 'medium' | 'high';
export type AssignmentStatus = 'pending' | 'completed';
export type NavigationFilter = 'all' | 'completed' | 'pending';

export type AssignmentFormValues = Omit<Assignment, 'id' | 'createdAt'>;
```

Union type juga dipakai pada parameter fungsi, misalnya:

```ts
export function showToast(
  message: string,
  type: 'success' | 'error' | 'info' = 'success'
): void
```

### E. Generics

Fungsi generic yang **benar-benar dipakai** ada di `src/scripts/services/storage.ts`:

```ts
export function getStorageData<T>(key: string, fallback: T): T
export function setStorageData<T>(key: string, value: T): void
```

Keduanya digunakan oleh `getAssignments()` dan `saveAssignments()`:

```ts
const stored = getStorageData<unknown>(STORAGE_KEY, null);
setStorageData<Assignment[]>(STORAGE_KEY, assignments);
```

Dengan pendekatan ini, penyimpanan localStorage bersifat reusable dan tetap type-safe untuk berbagai jenis data.

### F. Strict Mode dan Type Guard

`tsconfig.json` menggunakan `"strict": true`, `noUnusedLocals`, dan `noUnusedParameters`. Tidak ada penggunaan `any` yang tidak perlu.

Data localStorage divalidasi dengan type guard sebelum dipercaya sebagai `Assignment[]`:

```ts
function isAssignmentArray(value: unknown): value is Assignment[]
```

---

## 7. Alur Data Aplikasi

1. `main.ts` memuat data dari `getAssignments()`.
2. Jika localStorage kosong atau invalid, `storage.ts` membuat contoh tugas awal.
3. `render()` menghitung statistik, melakukan filter/sort, lalu merender komponen.
4. Setiap aksi pengguna (tambah, edit, hapus, toggle status) mengubah state.
5. Perubahan state disimpan kembali ke localStorage melalui `saveAssignments()`.
6. Tampilan dan statistik langsung di-render ulang.

---

## 8. Alur Git dan GitHub untuk Tugas Akademik

> Status saat ini: repository Git sudah diinisialisasi pada branch `main`, namun **belum ada commit** yang dibuat oleh asisten. Seluruh commit, branch, merge, push, pull, dan Pull Request harus Anda lakukan sendiri sesuai instruksi dosen.

### 8.1 Commit Awal

```bash
git add .
git commit -m "init: setup proyek Vite TypeScript CampusTask"
git branch -M main
```

### 8.2 Contoh Commit Messages

Gunakan pesan commit yang jelas dan konsisten:

```text
init: setup proyek Vite TypeScript CampusTask
feat: tambahkan interface Assignment dan storage localStorage
feat: implementasi dashboard dan statistik dinamis
feat: tambahkan form tambah dan edit tugas
feat: tambahkan fitur pencarian, filter, dan sorting
style: perbaiki tampilan responsif dan toast notification
docs: tambahkan README dan panduan deployment
```

### 8.3 Membuat Minimal 2 Branch

Branch utama sudah bernama `main`. Buat dua feature branch:

```bash
git checkout -b feature/task-form
# lakukan perubahan pada task-form.ts, lalu:
git add .
git commit -m "feat: validasi form tambah dan edit tugas"

git checkout main
git checkout -b feature/filter-sort
# lakukan perubahan pada filters.ts atau task-list.ts, lalu:
git add .
git commit -m "feat: tambahkan filter prioritas dan sorting"
```

### 8.4 Merge Feature Branch ke Main

```bash
git checkout main
git merge feature/task-form
git merge feature/filter-sort
```

Jika merge berhasil tanpa konflik, Git akan membuat merge commit otomatis.

### 8.5 Latihan Konflik Merge (Wajib untuk Tugas)

Latihan ini sengaja dibuat agar Anda memiliki pengalaman menyelesaikan merge conflict. Kedua branch akan mengubah **baris yang sama** di `README.md`.

```bash
# Dari branch main, buat branch pertama
git checkout main
git checkout -b conflict/branch-a
```

Tambahkan baris berikut di bagian paling atas `README.md`:

```text
Dibuat oleh Branch A.
```

Lalu commit:

```bash
git add README.md
git commit -m "docs: tambahkan penanda branch A"
```

Kembali ke `main`, lalu buat branch kedua:

```bash
git checkout main
git checkout -b conflict/branch-b
```

Tambahkan baris berikut di **posisi yang sama** di `README.md`:

```text
Dibuat oleh Branch B.
```

Lalu commit:

```bash
git add README.md
git commit -m "docs: tambahkan penanda branch B"
```

Sekarang coba gabungkan:

```bash
git checkout main
git merge conflict/branch-a
git merge conflict/branch-b
```

Pada perintah kedua, Git akan melaporkan konflik:

```text
CONFLICT (content): Merge conflict in README.md
Automatic merge failed; fix conflicts and then commit the result.
```

Buka `README.md`. Anda akan melihat penanda seperti ini:

```text
<<<<<<< HEAD
Dibuat oleh Branch A.
=======
Dibuat oleh Branch B.
>>>>>>> conflict/branch-b
```

Cara menyelesaikannya:

1. Hapus marker `<<<<<<<`, `=======`, dan `>>>>>>>`.
2. Tulis hasil gabungan yang Anda inginkan, misalnya:

```text
Dibuat oleh Branch A dan Branch B.
```

3. Simpan file, lalu jalankan:

```bash
git add README.md
git commit -m "merge: selesaikan konflik README dari branch A dan B"
```

Setelah konflik selesai, Anda bisa menghapus branch latihan jika tidak diperlukan:

```bash
git branch -d conflict/branch-a
git branch -d conflict/branch-b
```

### 8.6 Push, Pull, dan Pull Request

Hubungkan repository lokal ke GitHub (ganti URL dengan repository Anda sendiri):

```bash
git remote add origin https://github.com/USERNAME/campustask.git
git push -u origin main
```

Push semua branch yang ingin Anda ajukan:

```bash
git push -u origin feature/task-form
git push -u origin feature/filter-sort
```

Ambil pembaruan terbaru dari GitHub sebelum bekerja:

```bash
git pull origin main
```

Membuat Pull Request:

1. Buka repository GitHub Anda di browser.
2. Klik tab **Pull requests** → **New pull request**.
3. Pilih `base: main` dan `compare: feature/task-form`.
4. Isi judul, misalnya `feat: validasi form tambah dan edit tugas`.
5. Tuliskan deskripsi perubahan, lalu klik **Create pull request**.
6. Ulangi untuk branch fitur lain jika dosen meminta lebih dari satu PR.
7. Setelah disetujui, klik **Merge pull request**.

> Jangan push atau membuat PR otomatis tanpa instruksi. Lakukan sendiri agar Anda benar-benar memahami alur Git/GitHub.

---

## 9. Deployment ke Website Pribadi

### 9.1 Build Produksi

```bash
npm run build
```

Hasil build berada di folder `dist/`. Folder inilah yang di-upload ke hosting statis.

### 9.2 Struktur Build

```text
dist/
├── index.html
└── assets/
    ├── index-*.css
    ├── index-*.js
    └── index-*.js.map
```

Semua path asset menggunakan base path dari `VITE_BASE_PATH`, sehingga tidak ada URL `localhost` yang hardcode.

### 9.3 Deploy di Root Domain

Biarkan nilai default:

```env
VITE_BASE_PATH=./
```

Upload seluruh isi folder `dist/` ke direktori root hosting Anda.

### 9.4 Deploy di Subdirectory

Jika aplikasi diakses melalui `https://username.github.io/campustask/`, ubah `.env` menjadi:

```env
VITE_BASE_PATH=/campustask/
```

Lalu build ulang:

```bash
npm run build
```

Upload isi `dist/` ke folder `campustask/` pada hosting tersebut.

### 9.5 Langkah Umum Hosting Statis

1. Jalankan `npm install`.
2. Sesuaikan `.env` (khususnya `VITE_BASE_PATH`).
3. Jalankan `npm run build`.
4. Upload isi `dist/` melalui panel hosting, FTP, atau GitHub Actions.
5. Pastikan hosting melakukan fallback ke `index.html` untuk SPA routing. Aplikasi ini hanya memakai satu halaman, tetapi fallback tetap disarankan.
6. Uji akses di browser incognito dan pastikan tidak ada error 404 pada file CSS/JS.

### 9.6 Verifikasi Lokal Hasil Build

```bash
npm run preview
```

Buka alamat yang ditampilkan Vite (biasanya `http://localhost:4173`).

---

## 10. Reset Data Contoh

Data tersimpan di localStorage dengan key:

```text
campustask_assignments
```

Untuk mengembalikan contoh tugas awal:

1. Buka browser developer tools.
2. Masuk ke tab **Application** → **Local Storage**.
3. Hapus key `campustask_assignments`.
4. Refresh halaman.

---

## 11. Keterbatasan dan Tugas Manual

- Data hanya tersimpan di browser perangkat yang digunakan, belum tersinkron antarperangkat.
- Tidak ada fitur login, multi-user, atau backend.
- File `.env` sengaja tidak di-commit; Anda perlu menyalinnya dari `.env.example` setelah clone repository.
- Commit, branch, merge conflict exercise, push/pull, dan Pull Request harus Anda lakukan sendiri sesuai bagian 8.
- Deployment ke hosting pribadi belum dilakukan; aplikasi hanya dinyatakan **siap di-deploy** setelah Anda meng-upload folder `dist/`.

---

## 12. Ringkasan Validasi

Perintah berikut telah dijalankan saat pengembangan:

```bash
npm run typecheck
npm run build
```

Keduanya berhasil tanpa error. Audit npm menunjukkan **0 vulnerabilities** setelah menggunakan Vite versi terbaru.
