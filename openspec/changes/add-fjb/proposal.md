## Why

Faktur Jual Bengkel (FJB) adalah modul penting dalam sistem NOS yang mengelola transaksi bengkel mulai dari pencatatan unit, customer, hingga transaksi jasa dan part. Saat ini belum ada modul FJB di codebase, sehingga tim membutuhkan perubahan yang jelas untuk implementasi fitur ini.

Prototype `docs/fjb/prototype.html` menunjukkan struktur UI multi-tab form yang harus diikuti, dengan berbagai tab: Data Unit, Data Pemilik, Data Pembawa, Analisa, Data Transaksi, Data Tambahan, dan Keterangan. Requirement `docs/fjb/REQUIREMENT_FJB.md` mendefinisikan aktor (Admin FJB, Service Advisor), fitur utama (list, filter, create/edit, print), dan detail field per tab.

## What Changes

- Menambahkan module **FJB (Faktur Jual Bengkel)** baru untuk mengelola transaksi bengkel.
- Menyediakan **list page FJB** dengan filter periode dan cabang, serta tabel data dengan kolom lengkap.
- Menyediakan **multi-tab modal form** untuk create/edit FJB dengan 7 tab sesuai prototype.
- Menyediakan **CRUD operations**: View, Edit, Delete, dan Print FJB.
- Mendukung **dropdown master data** untuk field seperti cabang, tipe FJB, variant, warna, pekerjaan, agama, dan Jenis Pit.

## Capabilities

### New Capabilities

- `fjb-list-page`: Menampilkan list FJB dengan filter periode, cabang, dan search.
- `fjb-filtering`: Memfilter data berdasarkan periode dan nama customer/no polisi.
- `fjb-create-form`: Modal form multi-tab untuk membuat FJB baru.
- `fjb-edit-form`: Modal form multi-tab untuk edit FJB existing.
- `fjb-view-mode`: Mode view-only untuk melihat detail FJB.
- `fjb-print-action`: Aksi print FJB.

### Modified Capabilities

- `codebase-architecture`: ENFORCED - implementasi harus mengikuti pola arsitektur codebase.
  - Service API berada di `/src/services/`
  - Hooks fitur berada di `/src/modules/fjb/hooks/`
  - Komponen UI menggunakan reusable components (`@/components/ui/*`)
  - Multi-tab forms split ke files (`tabs/<TabName>Tab.tsx`)
  - HTML mockup adalah reference only, bukan salin CSS mentah
  - Dates gunakan Day.js, bukan `new Date()`

## Impact

- **New Module**: `/src/modules/fjb/` untuk screen, components, hooks, schemas, constants, dan types.
- **New Service**: `/src/services/fjb.ts` untuk list, detail, create, update, dan lookup master data.
- **UI Flow**: Halaman list dengan filter dan modal multi-tab sesuai `docs/fjb/prototype.html`.
- **Validation**: Validasi field mandatory, unique nomor polisi, valid nomor mesin, minimal 1 item transaksi.
- **Testing**: Test untuk list rendering, filter, CRUD forms, tab navigation, dan validasi.