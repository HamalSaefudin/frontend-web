# FUNCTIONAL SPECIFICATION DOCUMENT (FSD)

## 1. Overview
Fitur: Faktur Jual Bengkel (FJB) - NOS  
Tujuan: Mengelola transaksi bengkel mulai dari pencatatan unit, customer, hingga transaksi jasa & part.

---

## 2. Actor
- Admin FJB
- Service Advisor (SA)

---

## 3. Main Features
- View list FJB
- Filter data berdasarkan periode & cabang
- Create FJB (modal form)
- Edit / Delete / Print FJB
- Multi-tab form untuk input detail transaksi

---

## 4. List Page

### 4.1 Filter Section
Field:
- Cabang (Dropdown)
- Periode (Date Range)
- Search (Nama Customer / No Polisi)

Action:
- Button "Cari"

---

### 4.2 Table Data

Column:
- No
- Tanggal FJB
- No FJB
- No Polisi
- Nama Pemilik
- Nama Pembawa
- No Mesin
- No Rangka
- Kode Varian
- Kode Warna
- Nama Warna
- Status (COMPLETED / DRAFT / DELETED)
- Aksi:
  - View
  - Edit
  - Delete
  - Print

---

### 4.3 Bottom Action
- Tambah Data → Open Modal
- Cetak

---

## 5. Modal Form (Create/Edit FJB)

### 5.1 Header Section

Field:
- Cabang *
- No Booking
- No Faktur Jual Bengkel (auto)
- No Prospect
- Tanggal FJB
- Jenis Prospect
- Tipe FJB *
- No Hotline

Radio:
- Work Order
- Direct Sales

---

## 6. Tabs

---

### 6.1 Tab: Data Unit

Field:
- Nomor Polisi *
- Nama Varian *
- Nomor Rangka *
- Tahun Motor
- Nomor Mesin *
- Informasi Bensin
- Kode Varian *
- KM Terakhir *

Action:
- Button "CEK" (cek nomor mesin)

---

### 6.2 Tab: Data Pemilik

Field:
- Checkbox: Pembeli adalah perusahaan/PT
- Nama Pemilik *
- Jenis Kelamin *
- NIK *
- Pekerjaan 1 *
- No HP 1 *
- Pekerjaan 2
- No HP 2
- Agama *
- Email *

---

### 6.3 Tab: Data Pembawa

(Similar dengan Data Pemilik)

---

### 6.4 Tab: Analisa

Field:
- Rekomendasi SA *
- Keluhan Konsumen *

---

### 6.5 Tab: Data Transaksi

#### Section: Job / Jasa Bengkel
- Button Tambah
- Table:
  - Kode Jasa
  - Nama Jasa
  - Service Category
  - Harga Sistem
  - Harga Diberikan
  - Diskon %
  - Estimasi Waktu
  - Total Harga

#### Section: Part Dengan QR
- Button Tambah

#### Section: Part Tanpa QR
- Button Tambah

#### Summary:
- Total Estimasi Waktu
- Total Sebelum Diskon
- Diskon
- Total Setelah Diskon

---

### 6.6 Tab: Data Tambahan

Field:
- No Work Order *
- Jenis Pit *
- Tanggal Service *
- Waktu Pendaftaran
- Waktu PKB
- Waktu Selesai
- Asal Unit Entry *
- Total FRT
- Nama Mekanik *
- SA *
- Final Check *
- Admin FJB

---

### 6.7 Tab: Keterangan

(Field bebas / optional)

---

## 7. Actions

- Clear → reset form
- Confirm Order → submit data

---

## 8. Validation Rules

- Field bertanda (*) wajib diisi
- Nomor Polisi unik
- Nomor Mesin harus valid (via CEK)
- Minimal 1 item di transaksi

---

## 9. Notes

- Layout dan detail field mengikuti prototype HTML (fj.html)
- Semua dropdown menggunakan master data
- Table menggunakan pagination