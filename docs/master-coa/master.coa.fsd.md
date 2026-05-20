# 📘 Functional Specification Document (FSD v2 - AI First)

---

## 📌 1. Metadata

### Execution Metadata
- Feature Name: master-coa-management
- Module: master-coa
- Version: v1.0

### Governance Metadata
- Author: BA Team
- Date: 2026-05-19
- Stakeholders: Product, FE, BE, Finance

---

## 🎯 2. Business Objective

### Problem
Sistem membutuhkan pengelolaan Master COA (Chart of Account) yang terstandarisasi untuk mendukung transaksi Cash dan Bank pada seluruh cabang NAGAMAS.

### Target User
- Admin
- Finance
- Accounting

### Expected Outcome
- Admin dapat membuat dan mengelola Master COA
- Setiap cabang hanya memiliki satu COA aktif
- Jenis transaksi dapat digunakan pada transaksi Cash dan Bank
- Sistem memiliki referensi COA yang konsisten dan terkontrol

---

## 👤 3. User Stories

### US-001 — Create Master COA
Sebagai admin, saya ingin membuat Master COA agar dapat digunakan pada transaksi Cash dan Bank. ** gambar 4 **

### US-002 — Update Master COA
Sebagai admin, saya ingin mengubah data Master COA agar data tetap valid dan terbaru. ** gambar 2 **

### US-003 — Activate Master COA
Sebagai admin, saya ingin mengaktifkan COA agar dapat digunakan pada transaksi. ** gambar 1 **

### US-004 — Deactivate Master COA
Sebagai admin, saya ingin menonaktifkan COA agar tidak dapat digunakan pada transaksi baru. ** gambar 1 **

### US-005 — Copy Master COA
Sebagai admin, saya ingin menyalin data COA agar mempercepat proses setup COA baru. ** gambar 3 **

### US-006 — Delete Master COA
Sebagai admin, saya ingin menghapus COA yang belum pernah digunakan transaksi. ** gambar 5 **

### US-007 — Get Master COA Detail
Sebagai admin, saya ingin melihat detail COA agar dapat melakukan validasi data. ** gambar 2 **

### US-008 — List Master COA
Sebagai admin, saya ingin melihat daftar COA agar dapat melakukan pencarian dan pengelolaan data. ** gambar 1 **

### US-009 — Manage COA Transaction Type
Sebagai admin, saya ingin mengelola jenis transaksi pada COA agar dapat digunakan pada transaksi Cash dan Bank. ** gambar 2 **

---

b## 🧠 4. Domain Model

### Entity: MasterCoa

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| id | UUID | YES | PK | ID internal COA |
| coaId | string | YES | unique, auto-generated | ID COA format COA01 |
| coaName | string | YES | max 255 | Nama COA |
| branches | array | YES | minimal 1 | Cabang berlaku |
| status | string | YES | ACTIVE, INACTIVE | Status COA |
| createdAt | datetime | YES | auto-generated | Waktu pembuatan |
| updatedAt | datetime | YES | auto-generated | Waktu perubahan |

---

## 🔄 5. State Machine

### Entity: MasterCoa

STATE: INACTIVE

ACTION: activate  
→ NEXT STATE: ACTIVE

---

STATE: ACTIVE

ACTION: deactivate  
→ NEXT STATE: INACTIVE

---

## ⚠️ 11. Error Definition (Traceable)

- COA_NOT_FOUND
- BRANCH_ALREADY_USED
- INVALID_STATE
- COA_ALREADY_USED
- TRANSACTION_ALREADY_USED
- INVALID_CATEGORY
- INVALID_COA_NAME

---

## 🎯 14. Acceptance Criteria (Traceable & Testable)

### AC-001 → US-001 (Create Master COA)

GIVEN admin input data COA  
WHEN data valid  
THEN system creates new COA  
AND returns COA ID

---

### AC-002 → US-002 (Update Master COA)

GIVEN COA exists  
WHEN admin updates valid data  
THEN system updates COA successfully

---

### AC-003 → US-003 (Activate Master COA)

GIVEN COA status = INACTIVE  
WHEN admin activates COA  
THEN system changes status to ACTIVE

---

# ✅ Definition of Done

- Semua acceptance criteria terpenuhi
- Tidak ada invalid state transition
- Semua rule terhubung ke user story
- API contract sesuai dengan FSD

---
