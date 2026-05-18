## Why

Saat ini kebutuhan fitur Ekspedisi - Inventory baru tersedia dalam bentuk dokumen requirement awal dan prototype HTML, namun belum ada change OpenSpec yang merangkum tujuan bisnis, ruang lingkup implementasi, dan dampak teknisnya. Tim membutuhkan acuan perubahan yang jelas agar implementasi modul inventory ekspedisi konsisten dengan perilaku yang diminta, terutama pada halaman list, filter pencarian, modal edit, pengelolaan item KSU, dan validasi sebelum proses unit dijalankan.

Prototype `docs/inventory.html` juga menunjukkan struktur UI yang harus dipertahankan, seperti toolbar filter sederhana, tabel list utama, modal detail dengan header read-only, tab-tab operasional, tabel KSU, serta aksi `+ Tambah`, `Refresh`, `Cetak`, dan `Proses`. Perubahan ini dibutuhkan agar requirement bisnis dan prototype UI dapat diterjemahkan menjadi rencana implementasi yang siap dikerjakan.

## What Changes

- Menambahkan change OpenSpec baru untuk fitur **Ekspedisi - Inventory Management**.
- Mendefinisikan **list page** inventory ekspedisi dengan tabel data unit dan aksi edit.
- Mendefinisikan **filter/search** berdasarkan status dan keyword untuk menyaring data tabel.
- Mendefinisikan **modal edit** dengan header read-only, tab operasional, dan fokus implementasi awal pada tab KSU.
- Mendefinisikan alur **manajemen item KSU** termasuk tambah row, hapus row, validasi duplikasi, dan syarat scan/menyusul.
- Mendefinisikan alur **proses ekspedisi** yang menjalankan validasi, memanggil API, menutup modal, dan me-refresh data.

## Capabilities

### New Capabilities
- `ekspedisi-inventory-management`: Mengelola data inventory ekspedisi dari halaman list hingga edit detail unit.
- `ekspedisi-inventory-filtering`: Memfilter data inventory berdasarkan status dan keyword pencarian.
- `ekspedisi-inventory-edit-modal`: Menampilkan dan mengelola modal edit dengan informasi header, tab, dan aksi proses.
- `ekspedisi-inventory-ksu-management`: Menambah, menghapus, dan memvalidasi item KSU pada unit yang sedang diproses.
- `ekspedisi-inventory-validation`: Menjalankan validasi bisnis sebelum proses ekspedisi dikirim ke backend.

### Modified Capabilities
- `codebase-architecture`: ENFORCED - implementasi harus mengikuti pola arsitektur codebase yang ada.
  - Service API berada di `/src/services/`
  - Hooks fitur berada di `/src/modules/ekspedisi-inventory/hooks/`
  - Komponen UI mengikuti reusable component yang sudah tersedia

## Impact

- **New Module**: `/src/modules/ekspedisi-inventory/` untuk screen, components, hooks, schemas, constants, dan types.
- **New Service**: `/src/services/ekspedisi-inventory.ts` untuk list, detail, update proses, dan lookup pendukung.
- **UI Flow**: Halaman list dengan filter sederhana dan modal edit bertab mengikuti `docs/inventory.html`.
- **Validation**: Validasi item KSU dan aturan proses ekspedisi sebelum submit.
- **Testing**: Test untuk list rendering, filtering, modal edit, aksi tambah/hapus KSU, dan submit proses.