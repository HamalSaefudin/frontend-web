# Feature Requirements Document (FSD Template)

---

## 1. Feature Overview

**Feature Name**:  
> [Insert Feature Name]

**Description**:  
> Jelaskan secara singkat tujuan fitur ini (2–3 kalimat).

---

## 2. Feature Behavior

### Frontend: User Experience & Interactions

---

#### 2.1 View (List Page)
🖼️ Refer to: **Image 1**

- Saat user membuka halaman:
  - Menampilkan data dalam bentuk table

**Table Columns:**
- [Column 1]
- [Column 2]
- [Column 3]
- Action (Edit, Delete)

**Layout Notes (if needed):**
- Toolbar di atas table (search / filter)
- Table full width

**Behavior:**
- Klik tombol **Edit** → membuka modal (Image 2)

---

#### 2.2 Filter / Search
🖼️ Refer to: **Image 1**

- Saat user klik tombol **Filter**:
  - Menampilkan popup / panel filter

**Behavior:**
- Setelah apply filter:
  - Data table ter-refresh

---

#### 2.3 Create Data
🖼️ Refer to: **Image 2**

- Saat user klik tombol **Create**:
  - Menampilkan modal / halaman form

**Field Form:**
- [Field 1]&#58; [type] → mandatory / optional
- [Field 2]&#58; [type] → mandatory / optional
- [Field 3]&#58; [type] → mandatory / optional

**Layout Notes (IMPORTANT):**
- Form menggunakan **grid [2 / 3 / 4] column**
- Ada grouping section jika terlihat di image

**Validation Rules:**
- Field mandatory divalidasi saat submit
- Error message muncul di bawah field jika tidak valid

**Success Behavior:**
- Modal tertutup
- Data table di-refresh

---

#### 2.4 View Detail
🖼️ Refer to: [Image X if exist]

- Menampilkan semua field dalam kondisi **read-only**

---

#### 2.5 Edit Data
🖼️ Refer to: **Image 2 & Image 3**

- Saat user klik tombol **Edit**:
  - Membuka modal dengan data pre-filled

**Layout Notes (CRITICAL):**
- Header form grid: **[jumlah column]**
- Memiliki section:
  - Form
  - Tabs (jika ada)
  - Table (jika ada)
  - Footer

---

**Special Interaction:**
- Klik tombol **Tambah** (di dalam modal)
  → Menambahkan row ke table (lihat Image 3)

---

**Validation:**
- Sama seperti Create

**Success Behavior:**
- Modal tertutup
- Data table di-refresh

---

#### 2.6 Delete Data
🖼️ Refer to: [Image if exist]

- Saat user klik tombol **Delete**:
  - Menampilkan confirmation modal

**Behavior:**
- Jika user konfirmasi:
  - Hit API delete
  - Refresh data table
- Jika batal:
  - Tutup modal

---

#### 2.7 Upload (Optional)
🖼️ Refer to: [Image if exist]

- User dapat upload file (Excel/CSV)

---

### Backend: Service Behavior & Data Requirements

#### Data Requirements
- API untuk:
  - Get list (pagination, filter)
  - Create data
  - Update data
  - Delete data

- API untuk dropdown:
  - [Dropdown 1]
  - [Dropdown 2]

---

#### Validation Rules
- Validasi mandatory field
- Validasi conditional (jika ada)
---

## 3. Success Criteria

**Indikator keberhasilan fitur:**
- CRUD berjalan tanpa error
- Data tampil sesuai filter
- Validasi form berjalan dengan benar
- Pagination berfungsi dengan baik