## Context

Fitur Ekspedisi - Inventory berfokus pada proses operasional inventory kendaraan yang siap diekspedisi. Berdasarkan `docs/REQUIREMENT_INVENTORY.md`, user harus dapat melihat daftar unit, melakukan filter, membuka modal edit, menambah item KSU, dan menjalankan proses validasi sebelum unit diproses. Prototype `docs/inventory.html` menjadi acuan utama untuk struktur visual: toolbar filter, tabel list, modal edit, header read-only, tab operasional, tabel KSU, dan footer action.

Arsitektur aplikasi saat ini menggunakan React, TypeScript, feature-based modules, service layer terpisah, hooks untuk query/mutation, dan komponen UI reusable. Fitur inventory perlu mengikuti pola yang sama agar mudah dirawat dan konsisten dengan modul lain seperti Faktur Jual, Receiving Unit, dan master data.

Constraints:
- Prototype menunjukkan enam tab, tetapi requirement detail perilaku paling lengkap baru tersedia untuk tab KSU.
- Header modal bersifat read-only sehingga data utama unit berasal dari list/detail API, bukan input manual user.
- Validasi bisnis KSU harus berjalan sebelum aksi `Proses`.
- Requirement menyebut CRUD berjalan normal, tetapi prototype dan deskripsi saat ini terutama menekankan list, edit, dan proses; implementasi awal harus memperjelas bahwa CRUD item fokus pada data KSU dalam modal.
- Endpoint backend final belum terlihat pada dokumen, sehingga service layer harus mudah dimock atau diberi TODO contract.

## Goals / Non-Goals

**Goals:**
- Menyediakan halaman list inventory ekspedisi dengan kolom sesuai requirement.
- Menyediakan filter berdasarkan status dan keyword pencarian.
- Menyediakan modal edit dengan header read-only dan tab sesuai prototype.
- Menyediakan pengelolaan tabel KSU: tambah row, hapus row, prefill data, dan validasi.
- Menyediakan alur submit proses yang memvalidasi data lalu me-refresh list.

**Non-Goals:**
- Membangun workflow approval atau tracking ekspedisi multi-step di luar proses inventory.
- Menyelesaikan integrasi penuh untuk semua tab selain KSU bila requirement detailnya belum tersedia.
- Menambahkan upload/preview media kompleks untuk tab Foto pada fase awal.
- Mendesain ulang layout prototype menjadi pola UI lain seperti wizard atau halaman detail terpisah.

## Decisions

### Decision 1: Gunakan Halaman List + Modal Edit Sebagai Alur Utama
**Approach**: User bekerja dari satu halaman list, lalu melakukan edit/proses melalui modal.

**Rationale**:
- Sesuai requirement dan prototype.
- Mempercepat alur operasional tanpa perpindahan halaman.
- Konsisten dengan kebutuhan aksi cepat pada data ekspedisi.

**Alternative Considered**: Halaman detail terpisah → ditolak karena tidak sesuai prototype dan memperpanjang alur kerja.

### Decision 2: Fokus Scope Interaktif Awal pada Tab KSU, Tab Lain Disiapkan sebagai Container
**Approach**: Implementasi awal menyediakan tab KSU dengan perilaku lengkap, sementara tab Hadiah, Barang Lain, Part, Sopir, dan Foto disiapkan sebagai scaffold/container sampai requirement detail tersedia.

**Rationale**:
- Requirement validasi dan interaksi detail baru jelas untuk KSU.
- Mengurangi risiko asumsi berlebihan pada tab lain.
- Tetap menjaga struktur UI sesuai prototype.

**Alternative Considered**: Memaksakan semua tab memiliki perilaku penuh sejak awal → ditolak karena spesifikasi detail belum cukup.

### Decision 3: Data KSU Disimpan sebagai Collection Dinamis di Form Modal
**Approach**: Gunakan array item KSU sebagai state utama tab, dengan row yang dapat ditambah dan dihapus.

**Rationale**:
- Cocok dengan perilaku `+ Tambah` pada prototype.
- Memudahkan validasi minimal satu item, duplikasi kode, dan relasi scan/menyusul.
- Lebih fleksibel untuk prefill saat mode edit.

**Alternative Considered**: Menyimpan KSU dalam field statis tetap → ditolak karena tidak mendukung jumlah item dinamis.

### Decision 4: Validasi Bisnis Dijalankan di Level Row dan Submit
**Approach**: Setiap row KSU divalidasi untuk field wajib dan aturan bisnis, lalu seluruh tabel divalidasi ulang saat tombol `Proses` ditekan.

**Rationale**:
- Requirement mencantumkan aturan wajib, no duplicate, minimal 1 KSU, dan hubungan scan/menyusul.
- Mengurangi kemungkinan data salah lolos karena user hanya mengubah sebagian row.
- Memudahkan penandaan error langsung ke baris terkait.

**Alternative Considered**: Validasi hanya saat submit → ditolak karena feedback UX menjadi terlambat.

### Decision 5: Filter List Mengikuti Contract yang Siap untuk Backend
**Approach**: Service list menerima parameter `status`, `keyword`, `page`, dan `pageSize` walaupun implementasi awal dapat memakai mock data.

**Rationale**:
- Sesuai kebutuhan filter sederhana pada requirement.
- Memudahkan perpindahan dari mock ke backend tanpa mengubah kontrak UI.
- Mendukung pagination/refresh di masa lanjut.

**Alternative Considered**: Filter murni client-side tanpa parameter service → ditolak karena menyulitkan integrasi backend nanti.

## Risks / Trade-offs

**[Detail Tab Selain KSU Belum Lengkap]** → Risiko placeholder terlalu sederhana atau perlu refactor saat requirement final datang. Mitigasi: jadikan tab lain container modular agar mudah dilengkapi kemudian.

**[Validasi Duplikasi KSU]** → Risiko mismatch bila backend punya definisi unik tambahan selain `kodeKsu`. Mitigasi: gunakan validasi frontend berdasarkan kode dan siapkan mapping error backend.

**[Aksi Scan dan Menyusul]** → Risiko interpretasi boolean berbeda dari backend. Mitigasi: definisikan payload eksplisit (`isScanned`, `isPending`) dan dokumentasikan transformasinya di service layer.

**[Refresh Setelah Proses]** → Refetch penuh lebih sederhana tetapi menambah request. Mitigasi: mulai dengan invalidasi/refetch penuh untuk akurasi data.

## Migration Plan

**Phase 1: Foundation**
1. Buat module `ekspedisi-inventory` dan service mock.
2. Definisikan types, constants, dan validation schema.
3. Bangun list page dengan toolbar filter dan table.

**Phase 2: Modal Workflow**
1. Implement modal edit dan header read-only sesuai prototype.
2. Tambahkan tab navigation.
3. Implement tab KSU lengkap beserta add/remove row.

**Phase 3: Validation & Process Flow**
1. Tambahkan validasi business rules KSU.
2. Sambungkan tombol `Proses` ke mutation/service.
3. Tutup modal dan refresh list saat sukses.

**Phase 4: Hardening**
1. Lengkapi test coverage.
2. Siapkan tab selain KSU untuk pengembangan lanjutan.
3. Ganti mock service dengan endpoint backend final saat tersedia.

**Rollback Strategy**: Sembunyikan route/menu modul inventory ekspedisi dan isolasi perubahan di module baru bila implementasi perlu ditunda.

## Open Questions

1. Apakah `Tanggal FJ`, `Kode Varian`, `Nama Varian`, `Kode Warna`, dan `Nama Warna` seluruhnya berasal dari satu endpoint list utama?
2. Apakah aksi `Cetak` pada footer modal harus aktif pada fase awal atau cukup placeholder?
3. Apakah tab Hadiah, Barang Lain, Part, Sopir, dan Foto akan memakai pola data dinamis seperti KSU atau berbeda?
4. Bagaimana sumber data lookup untuk `Kode KSU`, `Nama KSU`, dan `Jenis KSU` saat user menambah row?
5. Apakah `Scan wajib` berarti checkbox scan harus true, atau harus ada nilai QR/hasil scan yang tersimpan?
6. Apakah status list memiliki enumerasi tetap, misalnya `DRAFT`, `PROCESSED`, `CANCELLED`?