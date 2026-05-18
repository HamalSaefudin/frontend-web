# Feature Requirements Document (FSD)

---

## 1. Feature Overview

**Feature Name**:  
> Ekspedisi - Inventory Management

**Description**:  
> Fitur ini digunakan untuk mengelola proses ekspedisi unit kendaraan dari sisi inventory, termasuk melihat daftar unit, melakukan pencarian, serta melakukan update detail ekspedisi melalui modal edit. User dapat menambahkan item KSU dan melakukan proses validasi sebelum unit diproses.

---

## 2. Feature Behavior

---

### 2.1 View (List Page)

- Saat user membuka halaman:
  - Menampilkan list data ekspedisi dalam bentuk table

**Table Columns:**
- No
- Tanggal FJ
- No FJ
- Nama Pembeli
- Kode Varian
- Nama Varian
- Kode Warna
- Nama Warna
- Nomor Mesin
- Nomor Rangka
- Status
- Aksi (Edit)

**Behavior:**
- Klik tombol **Edit (icon pensil)** → membuka modal Edit

---

### 2.2 Filter / Search

- User dapat:
  - Memilih **Status**
  - Mengisi keyword pencarian

**Behavior:**
- Klik tombol **Cari**
  - Table ter-refresh sesuai hasil filter

---

### 2.3 Edit Data

- Modal terbuka dengan data pre-filled

#### Header (Read Only)
- Cabang
- Tipe Unit
- No FJ
- No PDI
- Warna Unit
- No Rangka
- No Ekspedisi
- No Mesin
- Nama Pembeli

#### Tabs
- KSU
- Hadiah
- Barang Lain
- Part
- Sopir
- Foto

#### KSU Table
- No
- Kode KSU
- Nama KSU
- Jenis KSU
- QR Code
- Scan
- Menyusul
- Aksi

---

### Special Interaction

- Klik **+ Tambah**
  - Menambahkan row baru

---

### Validation Rules

- Kode KSU wajib
- Tidak boleh duplicate
- Minimal 1 KSU
- Jika Menyusul = false → Scan wajib

---

### Success Behavior

- Klik **Proses**
  - Validasi
  - Hit API
  - Modal close
  - Data refresh

---

## 3. Success Criteria

- CRUD berjalan normal
- Filter bekerja
- Validasi benar
