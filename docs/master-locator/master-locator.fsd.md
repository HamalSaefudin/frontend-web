# 📘 Functional Specification Document (FSD v2 - AI First)

---

## 📌 1. Metadata

### Execution Metadata
- Feature Name: master-locator
- Module: master-locator
- Version: v1.0

### Governance Metadata
- Author: BA Team
- Date: 2026-05-19
- Stakeholders: Product, FE, BE, Warehouse, H1

---

## 🎯 2. Business Objective

### Problem
Sistem membutuhkan master data lokasi warehouse untuk menyimpan dan mengelola lokasi penyimpanan barang berdasarkan cabang dealer.

### Target User
- Admin Warehouse
- Admin H1

### Expected Outcome
- User dapat membuat dan mengelola data lokasi warehouse
- Sistem memiliki referensi lokasi penyimpanan yang konsisten
- Lokasi dapat digunakan untuk kebutuhan monitoring dan transaksi warehouse

---

## 👤 3. User Stories

### US-001 — Create Lokasi Warehouse
Sebagai admin, saya ingin menambahkan data lokasi warehouse agar dapat digunakan pada sistem. ** gambar 2 **

### US-002 — Update Lokasi Warehouse
Sebagai admin, saya ingin mengubah data lokasi warehouse agar data tetap valid dan terbaru. ** gambar 2 **

### US-003 — Delete Lokasi Warehouse
Sebagai admin, saya ingin menghapus data lokasi warehouse yang sudah tidak digunakan.

### US-004 — Get Detail Lokasi Warehouse
Sebagai admin, saya ingin melihat detail lokasi warehouse agar dapat melakukan validasi data. ** gambar 2 **

### US-005 — List Lokasi Warehouse
Sebagai admin, saya ingin melihat daftar lokasi warehouse agar dapat melakukan pencarian dan pengelolaan data. ** gambar 1 **

### US-006 — Filter Lokasi Warehouse
Sebagai admin, saya ingin melakukan filter data lokasi warehouse berdasarkan field tertentu. ** gambar 3 **

### US-007 — Update Status Lokasi Warehouse
Sebagai admin, saya ingin mengubah status lokasi warehouse menjadi ACTIVE atau INACTIVE agar lokasi dapat diaktifkan atau dinonaktifkan tanpa menghapus data.

---

## 🧠 4. Domain Model

### Entity: LokasiWarehouse

| Field        | Type     | Required | Constraints                | Description                          |
|--------------|----------|----------|----------------------------|--------------------------------------|
| id           | UUID     | YES      | PK                         | ID lokasi warehouse                  |
| kodeLokasi   | string   | YES      | unique, max 50             | Kode lokasi warehouse                |
| kodeCabang   | string   | YES      | FK master cabang           | Kode cabang                          |
| namaLokasi   | string   | YES      | max 255                    | Nama/deskripsi lokasi                |
| createdAt    | datetime | YES      | auto-generated             | Waktu pembuatan data                 |
| updatedAt    | datetime | YES      | auto-generated             | Waktu perubahan data                 |

---

## 🔄 5. State Machine

### Entity: LokasiWarehouse

STATE: ACTIVE

ACTION: update  
→ NEXT STATE: ACTIVE

---

STATE: ACTIVE

ACTION: deactivate  
→ NEXT STATE: INACTIVE

---

STATE: INACTIVE

ACTION: activate  
→ NEXT STATE: ACTIVE

---

STATE: ACTIVE

ACTION: delete  
→ NEXT STATE: DELETED

---

## 🔗 6. User Story → State Mapping

| User Story | Action      | From State | To State  |
|------------|-------------|------------|------------|
| US-002     | update      | ACTIVE     | ACTIVE     |
| US-003     | delete      | ACTIVE     | DELETED    |
| US-007     | deactivate  | ACTIVE     | INACTIVE   |
| US-007     | activate    | INACTIVE   | ACTIVE     |
---

## 🔁 7. Business Flow (Complex)

### FLOW-001 → US-001 (Create Lokasi Warehouse)

STEP 1: Admin klik button tambah

STEP 2: System menampilkan form input lokasi warehouse

STEP 3: Admin mengisi data:
- kode lokasi
- kode cabang
- nama lokasi

VALIDATE:
- kode lokasi wajib
- kode lokasi harus unik
- kode cabang wajib
- nama lokasi wajib

IF valid:
→ PROCESS: simpan data lokasi warehouse  
→ RESPONSE: success

ELSE:
→ RESPONSE: validation error

---

### FLOW-002 → US-002 (Update Lokasi Warehouse)

STEP 1: Admin klik button edit

STEP 2: System menampilkan detail data existing

STEP 3: Admin mengubah data lokasi warehouse

VALIDATE:
- data harus tersedia
- kode lokasi tetap unik

IF valid:
→ PROCESS: update data lokasi warehouse  
→ RESPONSE: success

ELSE:
→ RESPONSE: validation error

---

### FLOW-003 → US-006 (Filter Lokasi Warehouse)

STEP 1: Admin klik icon filter

STEP 2: System menampilkan popup filter

STEP 3: Admin mengisi parameter filter

SUPPORTED FILTER:
- kode lokasi
- kode cabang
- nama lokasi

RULE:
- semua operator pencarian mendukung wildcard %

IF filter diisi:
→ PROCESS: tampilkan data sesuai filter

ELSE:
→ PROCESS: tampilkan semua data

---

### FLOW-004 → US-007 (Update Status Lokasi Warehouse)

STEP 1: Admin memilih data lokasi warehouse

STEP 2: Admin klik action activate/deactivate

STEP 3: System melakukan validasi data

VALIDATE:
- data lokasi warehouse harus tersedia
- status tidak boleh sama dengan status existing

IF valid:
→ PROCESS: update status lokasi warehouse  
→ RESPONSE: success

ELSE:
→ RESPONSE: validation error

---

## ⚡ 8. Simple Flow

### US-003 — Delete Lokasi Warehouse
- Admin klik button delete
- System menghapus data lokasi warehouse
- Data hilang dari monitoring/list

---

### US-004 — Get Detail Lokasi Warehouse
- Admin memilih data lokasi
- System menampilkan detail lokasi warehouse

---

### US-005 — List Lokasi Warehouse
- Admin membuka halaman master lokasi warehouse
- System menampilkan daftar data lokasi warehouse
- User dapat melakukan pencarian berdasarkan kode lokasi

---

## 📥 9. Input Definition (High-Level, Traceable)

- kodeLokasi → US-001, US-002, US-005, US-006
- kodeCabang → US-001, US-002, US-006
- namaLokasi → US-001, US-002, US-006
- lokasiId → US-002, US-003, US-004
- keyword → US-005

---

## 📤 10. Output Definition (High-Level, Traceable)

- id → US-001, US-004, US-005
- kodeLokasi → US-004, US-005
- kodeCabang → US-004, US-005
- namaLokasi → US-004, US-005
- createdAt → US-004
- updatedAt → US-004
- message → semua command action

---

## ⚠️ 11. Error Definition (Traceable)

- LOKASI_NOT_FOUND → digunakan pada US-002, US-003, US-004, US-007
- LOKASI_CODE_EXISTS → digunakan pada US-001, US-002
- INVALID_KODE_LOKASI → digunakan pada US-001, US-002
- INVALID_KODE_CABANG → digunakan pada US-001, US-002
- INVALID_NAMA_LOKASI → digunakan pada US-001, US-002
- INVALID_STATUS → digunakan pada US-007
- STATUS_ALREADY_SET → digunakan pada US-007

---

## 📜 12. Business Rules (Traceable)

### RULE-001 → US-001, US-002
IF kode lokasi sudah terdaftar  
THEN reject  
ERROR_CODE: LOKASI_CODE_EXISTS


---

### RULE-002 → US-001, US-002
IF kode lokasi kosong  
THEN reject  
ERROR_CODE: INVALID_KODE_LOKASI

---

### RULE-003 → US-001, US-002
IF kode cabang kosong  
THEN reject  
ERROR_CODE: INVALID_KODE_CABANG

---

### RULE-004 → US-001, US-002
IF nama lokasi kosong  
THEN reject  
ERROR_CODE: INVALID_NAMA_LOKASI

---

### RULE-005 → US-006
IF user melakukan pencarian  
THEN system mendukung wildcard %

---

### RULE-006 → US-007
IF status bukan ACTIVE atau INACTIVE  
THEN reject  
ERROR_CODE: INVALID_STATUS

---

### RULE-007 → US-007
IF status baru sama dengan status existing  
THEN reject  
ERROR_CODE: STATUS_ALREADY_SET

---

## ⚠️ 13. Edge Cases (Traceable)

- [US-001] Create lokasi dengan kode lokasi existing → error
- [US-002] Update lokasi dengan kode lokasi existing → error
- [US-002] Update lokasi yang tidak ditemukan → error
- [US-003] Delete lokasi yang tidak ditemukan → error
- [US-004] Get detail lokasi yang tidak ditemukan → error
- [US-005] List lokasi tanpa data → return empty list
- [US-006] Filter tanpa parameter → tampilkan semua data
- [US-007] Update status lokasi yang tidak ditemukan → error
- [US-007] Update status dengan value invalid → error
- [US-007] Update status dengan status yang sama → error

---

## 🎯 14. Acceptance Criteria (Traceable & Testable)

### AC-001 → US-001 (Create Lokasi Warehouse)

GIVEN admin input data lokasi warehouse  
WHEN data valid  
THEN system creates new lokasi warehouse  
AND returns lokasi ID

GIVEN kode lokasi already exists  
WHEN admin submit request  
THEN system rejects request  
AND returns LOKASI_CODE_EXISTS error

---

### AC-002 → US-002 (Update Lokasi Warehouse)

GIVEN lokasi warehouse exists  
WHEN admin updates valid data  
THEN system updates lokasi warehouse successfully

GIVEN lokasi warehouse not found  
WHEN admin updates data  
THEN system rejects request  
AND returns LOKASI_NOT_FOUND error

---

### AC-003 → US-003 (Delete Lokasi Warehouse)

GIVEN lokasi warehouse exists  
WHEN admin deletes data  
THEN system removes lokasi warehouse successfully

GIVEN lokasi warehouse not found  
WHEN admin deletes data  
THEN system rejects request  
AND returns LOKASI_NOT_FOUND error

---

### AC-004 → US-004 (Get Detail Lokasi Warehouse)

GIVEN lokasi warehouse exists  
WHEN admin requests detail  
THEN system returns lokasi warehouse detail

GIVEN lokasi warehouse not found  
WHEN admin requests detail  
THEN system rejects request  
AND returns LOKASI_NOT_FOUND error

---

### AC-005 → US-005 (List Lokasi Warehouse)

GIVEN admin opens lokasi warehouse list  
WHEN data exists  
THEN system returns lokasi warehouse list

GIVEN no data exists  
WHEN admin opens lokasi warehouse list  
THEN system returns empty list

---

### AC-006 → US-006 (Filter Lokasi Warehouse)

GIVEN admin input filter parameter  
WHEN filter valid  
THEN system returns filtered lokasi warehouse data

GIVEN admin menggunakan wildcard %  
WHEN search executed  
THEN system supports wildcard search

---

### AC-007 → US-007 (Update Status Lokasi Warehouse)

GIVEN lokasi warehouse exists
WHEN admin changes status to ACTIVE or INACTIVE
THEN system updates lokasi warehouse status successfully

GIVEN lokasi warehouse not found
WHEN admin updates lokasi warehouse status
THEN system rejects request
AND returns LOKASI_NOT_FOUND error

GIVEN invalid status value
WHEN admin updates lokasi warehouse status
THEN system rejects request
AND returns INVALID_STATUS error

GIVEN lokasi warehouse already has requested status
WHEN admin updates lokasi warehouse status
THEN system rejects request
AND returns STATUS_ALREADY_SET error

---

## 🔗 15. Dependencies

- Master Cabang
- Admin authentication
- Warehouse database
- Audit logging

---

## 🚫 16. Out of Scope

- Multi warehouse hierarchy
- Auto synchronization warehouse
- Inventory stock management
- Warehouse transaction processing
- Hard delete database
- Integration external warehouse system

---

## 🔄 17. Action Mapping

| Action        | Entity           | Description                    |
|---------------|------------------|--------------------------------|
| create        | LokasiWarehouse  | create lokasi warehouse        |
| update        | LokasiWarehouse  | update lokasi warehouse        |
| delete        | LokasiWarehouse  | delete lokasi warehouse        |
| get-detail    | LokasiWarehouse  | get lokasi warehouse detail    |
| list          | LokasiWarehouse  | list lokasi warehouse data     |
| filter        | LokasiWarehouse  | filter lokasi warehouse data   |
| update-status | LokasiWarehouse  | update status lokasi warehouse |

---

## 🔗 API Contract Note

Detail API (endpoint, request/response JSON) didefinisikan pada:
docs/api-contract/master-locator.api.md

---

# 🧪 Verification Note

Test scenario dibuat pada fase QA Verification:
sementara dibuat di luar project

---

# ✅ Definition of Done

- Semua acceptance criteria terpenuhi
- Semua business rule tervalidasi
- Semua error & edge case terdokumentasi
- Filter wildcard berjalan sesuai requirement
- API contract sesuai dengan FSD
