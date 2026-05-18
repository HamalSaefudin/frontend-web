# Feature Requirements Document (FSD)

---

## 1. Feature Overview

**Feature Name**:  
> Master Data Kas Management

**Description**:  
> Fitur ini digunakan untuk mengelola master data kas pada sistem. User dapat melakukan pencarian, filtering, penambahan, perubahan, dan penghapusan data kas yang terhubung dengan cabang tertentu. Sistem juga menyediakan pengaturan status aktif/nonaktif untuk setiap data kas.

---

## 2. Feature Behavior

### Frontend: User Experience & Interactions

---

#### 2.1 View (List Page)
🖼️ Refer to: **Image 1**

- Saat user membuka halaman:
  - Menampilkan data master kas dalam bentuk table
  - Data ditampilkan menggunakan pagination

**Table Columns:**
- No
- Kode Kas
- Nama Cabang
- Nama Kas
- Status
- Aksi (Edit, Delete)

**Layout Notes:**
- Toolbar berada di atas table
- Search field berada di kiri atas
- Tombol filter berada di kanan atas
- Table menggunakan full width layout
- Pagination berada di bawah table
- Tombol action:
  - Tambah
  - Cetak

**Behavior:**
- Klik tombol **Cari**
  → Menjalankan pencarian berdasarkan Nama Kas

- Klik icon **Filter**
  → Membuka popup filter (Image 4)

- Klik icon **Edit**
  → Membuka modal edit data (Image 2)

- Klik icon **Delete**
  → Menampilkan confirmation modal delete

- Klik toggle status
  → Mengubah status aktif/nonaktif data kas

- Klik tombol **Tambah**
  → Membuka modal create data (Image 3)

- Klik tombol **Cetak**
  → Generate / print data master kas

---

#### 2.2 Filter / Search
🖼️ Refer to: **Image 4**

- Saat user klik tombol **Filter**:
  - Menampilkan popup filter

**Field Filter:**
- Kode Kas
- Nama Cabang
- Nama Kas
- Status

**Behavior:**
- Klik tombol **Terapkan**
  - Data table ter-refresh berdasarkan filter

- Klik tombol **Hapus**
  - Reset seluruh filter

- Klik icon close
  - Menutup popup filter

---

#### 2.3 Create Data
🖼️ Refer to: **Image 3**

- Saat user klik tombol **Tambah**:
  - Menampilkan modal form data kas

**Field Form:**
- Kode Kas: text → mandatory
- Nama Cabang: dropdown/select → mandatory
- Nama Kas: text → mandatory
- Status: toggle switch → optional

**Layout Notes (IMPORTANT):**
- Form menggunakan single column layout
- Form ditampilkan dalam modal popup
- Footer form memiliki tombol Simpan
- Header modal:
  - Judul Form Data Kas
  - Tombol close

**Validation Rules:**
- Kode Kas wajib diisi
- Nama Cabang wajib dipilih
- Nama Kas wajib diisi
- Kode Kas harus unik
- Error message muncul di bawah field jika tidak valid

**Success Behavior:**
- Modal tertutup
- Data table di-refresh
- Toast success muncul

---

#### 2.4 View Detail
🖼️ Refer to: [Image 2]

- Menampilkan seluruh field dalam kondisi read-only apabila mode detail digunakan

**Field Displayed:**
- Kode Kas
- Nama Cabang
- Nama Kas
- Status

---

#### 2.5 Edit Data
🖼️ Refer to: **Image 2**

- Saat user klik tombol **Edit**:
  - Membuka modal edit dengan data pre-filled

**Editable Fields:**
- Nama Cabang
- Nama Kas
- Status

**Read Only Field:**
- Kode Kas

**Layout Notes (CRITICAL):**
- Layout menggunakan single column form
- Modal memiliki:
  - Header
  - Form section
  - Footer button

**Special Interaction:**
- Toggle status dapat langsung diubah
- Dropdown Nama Cabang menggunakan searchable select

**Validation:**
- Sama seperti Create

**Success Behavior:**
- Modal tertutup
- Data table di-refresh
- Toast success muncul

---

#### 2.6 Delete Data
🖼️ Refer to: [Delete Confirmation Modal]

- Saat user klik tombol **Delete**:
  - Menampilkan confirmation modal

**Behavior:**
- Jika user konfirmasi:
  - Hit API delete
  - Refresh data table
  - Menampilkan toast success

- Jika batal:
  - Tutup modal

**Validation:**
- Data yang sedang digunakan oleh transaksi tidak dapat dihapus

---

#### 2.7 Print Data
🖼️ Refer to: **Image 1**

- User dapat melakukan print/export data master kas

**Behavior:**
- Data yang dicetak mengikuti filter aktif
- Format output dapat berupa PDF atau Excel

---

### Backend: Service Behavior & Data Requirements

#### Data Requirements

**API Master Kas**
- Get list data kas (pagination, search, filter)
- Create data kas
- Update data kas
- Delete data kas
- Update status aktif/nonaktif
- Print/export data kas

**API Dropdown**
- Get list cabang

---

#### Request Parameters

### Get List API

| Parameter | Type | Description |
|---|---|---|
| page | number | Current page |
| limit | number | Rows per page |
| namaKas | string | Search nama kas |
| kodeKas | string | Filter kode kas |
| cabangId | string | Filter cabang |
| status | boolean | Filter status |

---

#### Response Fields

| Field | Type | Description |
|---|---|---|
| id | string |
| kodeKas | string |
| namaCabang | string |
| namaKas | string |
| status | boolean |
| createdAt | datetime |
| updatedAt | datetime |

---

#### Validation Rules

- Kode Kas wajib unik
- Nama Kas wajib diisi
- Nama Cabang wajib dipilih
- Status default:
  - Create → OFF
- Tidak boleh duplicate Kode Kas
- Delete hanya diperbolehkan jika data belum digunakan transaksi

---

## 3. Success Criteria

**Indikator keberhasilan fitur:**
- CRUD master kas berjalan tanpa error
- Search dan filter berjalan dengan benar
- Pagination berfungsi dengan baik
- Status aktif/nonaktif dapat diubah
- Validasi mandatory field berjalan dengan benar
- Data tampil sesuai filter dan search
- Print/export berhasil menghasilkan file sesuai data filter aktif