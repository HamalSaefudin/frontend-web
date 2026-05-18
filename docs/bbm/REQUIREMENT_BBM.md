# FUNCTIONAL SPECIFICATION DOCUMENT (FSD)

## Feature: BBM (Belum Lengkap)

### Overview
Fitur ini digunakan untuk mengelola data BBM yang belum lengkap, termasuk pencatatan dokumen referensi, informasi bank, dan status cetakan.

---

## Main Features
- View list BBM
- Filter berdasarkan cabang & periode
- Create / Edit / Delete BBM
- Lookup dokumen referensi

---

## List Page
- Table:
  - No
  - Tanggal BBM
  - Nomor BBM
  - Jenis Dokumen
  - No Dokumen Ref
  - Bank
  - Nilai
  - Status Cetakan
  - Aksi

- Filter:
  - Cabang
  - Periode

---

## Modal Form

### Header
- Tanggal BBM
- No BBM
- No Dokumen Ref 1 & 2

### Bank Info
- Nama Bank
- Nama Rekening
- Nomor Rekening
- Terima Dari
- Nilai Rupiah

### Additional Info
- Terbilang
- Guna Membayar
- Keterangan

### Footer
- Jenis Transaksi
- Jenis Dokumen
- Realisasi

---

## Modal Referensi
- Filter Nama Pembeli
- Table referensi dokumen

---

## Validation
- Field wajib harus diisi
- Nilai > 0

---

## Success Criteria
- CRUD berjalan
- Filter berjalan
- Modal referensi berfungsi
