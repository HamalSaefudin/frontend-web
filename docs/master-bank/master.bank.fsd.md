# 📘 Functional Specification Document (FSD v2 - AI First)

---

## 📌 1. Metadata

### Execution Metadata
- Feature Name: master-bank-management
- Module: master-bank
- Version: v1.2

### Governance Metadata
- Author: BA Team
- Date: 2026-05-06
- Stakeholders: Product, FE, BE, Finance

---

## 🎯 2. Business Objective

### Problem
Sistem membutuhkan master data bank yang terstandarisasi untuk mendukung transaksi pembayaran, refund, dan integrasi rekening.

### Target User
- Admin
- Finance

### Expected Outcome
- Admin dapat membuat dan mengelola data bank
- Sistem memiliki referensi bank yang konsisten
- Bank dapat diaktifkan atau dinonaktifkan sesuai kebutuhan bisnis

---

## 👤 3. User Stories

### US-001 — Create Bank
Sebagai admin, saya ingin menambahkan data bank agar dapat digunakan pada sistem. ** gambar 2 **

### US-002 — Update Bank
Sebagai admin, saya ingin mengubah data bank agar tetap valid dan terbaru. ** gambar 3 **

### US-003 — Activate Bank
Sebagai admin, saya ingin mengaktifkan bank agar dapat digunakan untuk transaksi.

### US-004 — Deactivate Bank
Sebagai admin, saya ingin menonaktifkan bank agar tidak dapat digunakan untuk transaksi baru.

### US-005 — Get Bank Detail
Sebagai admin, saya ingin melihat detail bank agar dapat melakukan validasi data. ** gambar 3 **

### US-006 — List Banks
Sebagai admin, saya ingin melihat daftar bank agar dapat melakukan pencarian dan pengelolaan data.  ** gambar 1 **

---

## 🧠 4. Domain Model

### Entity: Bank

| Field     | Type     | Required | Constraints      | Description         |
|-----------|----------|----------|------------------|---------------------|
| id        | UUID     | YES      | PK               | ID bank             |
| code      | string   | YES      | unique, max 20   | Kode bank           |
| name      | string   | YES      | max 255          | Nama bank           |
| status    | string   | YES      | ACTIVE, INACTIVE | Status bank         |
| createdAt | datetime | YES      | auto-generated   | Waktu pembuatan     |
| updatedAt | datetime | YES      | auto-generated   | Waktu perubahan     |

---

## 🔄 5. State Machine

### Entity: Bank

STATE: INACTIVE

ACTION: activate  
→ NEXT STATE: ACTIVE

---

STATE: ACTIVE

ACTION: deactivate  
→ NEXT STATE: INACTIVE

---

## 🔗 6. User Story → State Mapping

| User Story | Action     | From State | To State |
|------------|------------|------------|----------|
| US-003     | activate   | INACTIVE   | ACTIVE   |
| US-004     | deactivate | ACTIVE     | INACTIVE |

---

## 🔁 7. Business Flow (Complex)

### FLOW-001 → US-001 (Create Bank)

STEP 1: Admin input data bank

VALIDATE:
- code wajib
- code harus unik
- name wajib

IF valid:
→ PROCESS: simpan bank dengan status = ACTIVE  
→ RESPONSE: success

ELSE:
→ RESPONSE: validation error

---

### FLOW-002 → US-003 (Activate Bank)

STEP 1: Admin klik activate

VALIDATE:
- bank harus ada
- status = INACTIVE

IF valid:
→ UPDATE status = ACTIVE  
→ RESPONSE: success

ELSE:
→ RESPONSE: error

---

## ⚡ 8. Simple Flow

### US-002 — Update Bank
- Admin mengubah data bank
- System memvalidasi input
- Data disimpan jika valid

---

### US-004 — Deactivate Bank
- Admin klik deactivate
- Status berubah menjadi INACTIVE jika sebelumnya ACTIVE

---

### US-005 — Get Bank Detail
- Admin memilih data bank
- System menampilkan detail bank

---

### US-006 — List Banks
- Admin membuka halaman daftar bank
- System menampilkan daftar bank
- Admin dapat melakukan pencarian/filter

---

## 📥 9. Input Definition (High-Level, Traceable)

- code → US-001, US-002
- name → US-001, US-002
- bankId → US-002, US-003, US-004, US-005
- keyword → US-006
- status → US-006

---

## 📤 10. Output Definition (High-Level, Traceable)

- id → US-001, US-005, US-006
- code → US-005, US-006
- name → US-005, US-006
- status → semua user story
- createdAt → US-005
- updatedAt → US-005
- message → semua command action

---

## ⚠️ 11. Error Definition (Traceable)

- BANK_NOT_FOUND → digunakan pada US-002, US-003, US-004, US-005
- BANK_CODE_EXISTS → digunakan pada US-001, US-002
- INVALID_STATE → digunakan pada US-003, US-004
- INVALID_BANK_CODE → digunakan pada US-001, US-002

---

## 📜 12. Business Rules (Traceable)

### RULE-001 → US-001, US-002 (Create / Update Bank)
IF code sudah terdaftar  
THEN reject  
ERROR_CODE: BANK_CODE_EXISTS

---

### RULE-002 → US-003 (Activate Bank)
IF status != INACTIVE  
THEN reject  
ERROR_CODE: INVALID_STATE

---

### RULE-003 → US-004 (Deactivate Bank)
IF status != ACTIVE  
THEN reject  
ERROR_CODE: INVALID_STATE

---

### RULE-004 → US-001, US-002
IF code kosong  
THEN reject  
ERROR_CODE: INVALID_BANK_CODE

---

## ⚠️ 13. Edge Cases (Traceable)

- [US-001] Create bank dengan code existing → error
- [US-002] Update bank dengan code existing → error
- [US-003] Activate bank yang sudah ACTIVE → error
- [US-004] Deactivate bank yang sudah INACTIVE → error
- [US-002] Update bank yang tidak ditemukan → error
- [US-005] Get detail bank yang tidak ditemukan → error
- [US-006] List bank tanpa data → return empty list

---

## 🎯 14. Acceptance Criteria (Traceable & Testable)

### AC-001 → US-001 (Create Bank)

GIVEN admin input bank data  
WHEN data valid  
THEN system creates new bank  
AND returns bank ID

GIVEN bank code already exists  
WHEN admin submit request  
THEN system rejects request  
AND returns BANK_CODE_EXISTS error

---

### AC-002 → US-002 (Update Bank)

GIVEN bank exists  
WHEN admin updates valid data  
THEN system updates bank successfully

GIVEN bank code already exists in another bank  
WHEN admin updates bank code  
THEN system rejects request  
AND returns BANK_CODE_EXISTS error

GIVEN bank not found  
WHEN admin updates bank  
THEN system rejects request  
AND returns BANK_NOT_FOUND error

---

### AC-003 → US-003 (Activate Bank)

GIVEN bank status = INACTIVE  
WHEN admin activates bank  
THEN system changes status to ACTIVE

GIVEN bank status != INACTIVE  
WHEN admin activates bank  
THEN system rejects request  
AND returns INVALID_STATE error

---

### AC-004 → US-004 (Deactivate Bank)

GIVEN bank status = ACTIVE  
WHEN admin deactivates bank  
THEN system changes status to INACTIVE

GIVEN bank status != ACTIVE  
WHEN admin deactivates bank  
THEN system rejects request  
AND returns INVALID_STATE error

---

### AC-005 → US-005 (Get Bank Detail)

GIVEN bank exists  
WHEN admin requests bank detail  
THEN system returns bank detail

GIVEN bank not found  
WHEN admin requests bank detail  
THEN system rejects request  
AND returns BANK_NOT_FOUND error

---

### AC-006 → US-006 (List Banks)

GIVEN admin opens bank list  
WHEN data exists  
THEN system returns bank list

GIVEN no data exists  
WHEN admin opens bank list  
THEN system returns empty list

---

## 🔗 15. Dependencies

- Bank database
- Admin authentication
- Audit logging

---

## 🚫 16. Out of Scope

- Integration ke external banking API
- Bank account management
- Auto synchronization bank data
- Multi currency management
- Permanent delete bank data
- Hard delete API

---

## 🔄 17. Action Mapping

| Action     | Entity | Description     |
|------------|--------|-----------------|
| create     | Bank   | create bank     |
| update     | Bank   | update bank     |
| activate   | Bank   | activate bank   |
| deactivate | Bank   | deactivate bank |
| get-detail | Bank   | get bank detail |
| list       | Bank   | list bank data  |

---

## 🔗 API Contract Note

Detail API (endpoint, request/response JSON) didefinisikan pada:
docs/api-contract/master-bank.api.md

---

# 🧪 Verification Note

Test scenario dibuat pada fase QA Verification:
sementara di buat di luar project

---

# ✅ Definition of Done

- Semua acceptance criteria terpenuhi
- Tidak ada invalid state transition
- Semua rule terhubung ke user story
- Semua error & edge case ter-trace dengan jelas
- API contract sesuai dengan FSD

---

# 🔁 Flow Definition Guideline

Flow digunakan hanya jika diperlukan untuk menjelaskan proses bisnis.

## 📌 Kapan menggunakan Business Flow (Structured)

Gunakan jika:
- Proses memiliki beberapa langkah (multi-step)
- Terdapat validasi penting
- Terdapat kondisi/percabangan (IF/ELSE)
- Melibatkan perubahan state yang kompleks
- Berisiko tinggi jika salah implementasi

---

## ⚡ Kapan menggunakan Simple Flow (Non-Structured)

Gunakan jika:
- Proses sederhana dan linear
- Validasi minimal
- Tidak ada percabangan kompleks
- Mudah dipahami tanpa struktur formal

---

## 🚫 Kapan tidak perlu Flow

Tidak perlu menuliskan flow jika:
- Hanya perubahan state sederhana (cukup State Machine + Rules)
- Hanya operasi read/query
- Hanya berupa constraint atau business rule
- Sudah jelas dari section lain (tidak menambah informasi baru)

---

## 🎯 Prinsip Utama

Gunakan tingkat detail yang sesuai dengan kompleksitas:

- Complex → Business Flow
- Simple → Simple Flow
- Trivial / implicit → No Flow

Hindari:
- Over-detail (semua dibuat formal)
- Under-detail (flow penting tidak dijelaskan)

---