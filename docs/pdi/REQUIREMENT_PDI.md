# Feature Requirements Document (FSD)

---

## 1. Feature Overview

**Feature Name**:  
> Pre Delivery Inspection (PDI)

**Description**:  
> Fitur ini digunakan untuk melakukan proses Pre Delivery Inspection (PDI) unit kendaraan sebelum dikirim ke customer. User dapat melihat daftar unit yang belum atau sudah diproses PDI, melakukan pengecekan fisik unit, mengelola data KSU, hadiah, barang lain, part, dan foto pendukung dalam satu modal proses PDI.

---

## 2. Feature Behavior

### Frontend: User Experience & Interactions

---

#### 2.1 View (List Page)
🖼️ Refer to: **Image 1**

- Image 1 merupakan main screen halaman Pre Delivery Inspection.

- Saat user membuka halaman:
  - Menampilkan dropdown cabang di bagian atas halaman
  - Menampilkan tab:
    - Belum PDI
    - Sudah PDI
  - Menampilkan toolbar filter dan search
  - Menampilkan data unit dalam bentuk table

**Table Columns:**
- No
- No. FJ
- Tanggal FJ
- Kode Varian
- Nama Varian
- Kode Warna
- Nama Warna
- Nomor Mesin
- Nomor Rangka
- Status
- Aksi

**Toolbar Filter:**
- Dropdown pilihan filter
  - Nomor Mesin
  - Kode Varian
- Input search
- Tombol Cari

**Layout Notes:**
- Toolbar berada di kanan atas table
- Table full width
- Menggunakan pagination
- Dropdown cabang berada di bagian kiri atas halaman

**Behavior:**
- Klik tab Belum PDI:
  - Menampilkan unit yang belum diproses PDI
- Klik tab Sudah PDI:
  - Menampilkan unit yang sudah diproses PDI
- Klik tombol Cari:
  - Data table ter-refresh berdasarkan filter
- Klik tombol Proses PDI:
  - Membuka modal Pre Delivery Inspection

---

#### 2.2 Filter / Search
🖼️ Refer to: **Image 1 & Image 6**

- User dapat memilih jenis filter menggunakan dropdown
- User dapat mengisi keyword pencarian

**Filter Available:**
- Nomor Mesin
- Kode Varian

**Interaction:**
- Dropdown filter muncul saat user klik field Pilih
- User memilih jenis filter terlebih dahulu sebelum input keyword pencarian

**Behavior:**
- Setelah user klik tombol Cari:
  - Data table difilter berdasarkan parameter
  - Pagination kembali ke halaman pertama

---

#### 2.3 Process PDI Modal
🖼️ Refer to: **Image 2 - 5**

- Image 2 sampai Image 5 merupakan detail tampilan masing-masing tab setelah user klik tombol Proses PDI pada main screen.

- Saat user klik tombol Proses PDI:
  - Menampilkan modal PRE DELIVERY INSPECTION

**Header Information (Read Only):**
- Cabang
- Warna Unit
- No. FJ
- No. PDI
- No. Mesin
- Keterangan
- Tipe Unit
- No. Rangka

**Layout Notes (IMPORTANT):**
- Header form menggunakan grid 3 column
- Form field menggunakan readonly style
- Modal full width
- Terdapat tabs di bawah informasi unit
- Footer button berada di kanan bawah

**Tabs Available:**
- Cek Fisik Unit (Image 2)
- KSU (Image 3)
- Hadiah (Image 4)
- Barang Lain (Image 5)
- Part
- Foto

**Footer Buttons:**
- Refresh
- Simpan
- Tolak
- Proses

---

## 3. Success Criteria

**Indikator keberhasilan fitur:**
- User dapat melihat daftar unit Belum PDI dan Sudah PDI
- Search dan filter berjalan dengan benar
- Modal PDI dapat dibuka tanpa error
- Semua checklist fisik dapat disimpan
- Pagination berjalan normal
- Status unit berubah setelah proses PDI selesai
