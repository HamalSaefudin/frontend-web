# 📘 API Contract — Master COA Module

---

# 📌 1. Metadata

## Execution Metadata

- Feature Name: master-coa-management
- Module: master-coa
- Version: v1.0

---

## Governance Metadata

- Author: BA Team
- Date: 2026-05-19
- Stakeholders: Product, FE, BE, Finance

---

# 🔗 2. Source Reference

SOURCE FSD:

```txt
docs/master-coa/fsd/master.coa.fsd.md
```

---

# 🔐 3. Authentication

All endpoints require:
- **Type:** Bearer JWT
- **Role:** ADMIN

---

# 🚀 4. API Endpoints

---

# API-001 — Create Master COA

## Traceability

| Type | Reference |
|---|---|
| User Story | US-001 |
| Acceptance Criteria | AC-001 |
| Inputs | coaName, branches, transactions |
| Outputs | coaId, status, createdAt, updatedAt |
| Errors | BRANCH_ALREADY_USED, INVALID_COA_NAME |

---

## Endpoint

```
POST /api/v1/master-coas
```

---

## Description

Create new Master COA dengan default status = ACTIVE. coaId auto-generated format "COA01", "COA02", dst.

---

## Request Body

```json
{
  "coaName": "COA Operasional",
  "branches": [
    "BDG01",
    "JKT01"
  ],
  "transactions": [
    {
      "transactionName": "Kas Masuk",
      "category": "TRX_IN",
      "subgroup": "PENERIMAAN",
      "group": "OPERASIONAL"
    }
  ]
}
```

---

## Success Response — 201

```json
{
  "success": true,
  "code": "COA_CREATED",
  "message": "Master COA created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "coaId": "COA01",
    "status": "ACTIVE",
    "createdAt": "2026-05-19T10:30:00Z",
    "updatedAt": "2026-05-19T10:30:00Z"
  },
  "errors": []
}
```

---

## Error Responses

### BRANCH_ALREADY_USED — 409

```json
{
  "success": false,
  "code": "BRANCH_ALREADY_USED",
  "message": "Branch already used by another active COA",
  "data": null,
  "errors": []
}
```

---

### INVALID_COA_NAME — 400

```json
{
  "success": false,
  "code": "INVALID_COA_NAME",
  "message": "COA name is required",
  "data": null,
  "errors": [
    {
      "field": "coaName",
      "message": "COA name is required"
    }
  ]
}
```

---

# API-002 — Update Master COA

## Traceability

| Type | Reference |
|---|---|
| User Story | US-002 |
| Acceptance Criteria | AC-002 |
| Inputs | coaId, coaName, branches |
| Outputs | coaId, message, updatedAt |
| Errors | COA_NOT_FOUND, BRANCH_ALREADY_USED |

---

## Endpoint

```
PUT /api/v1/master-coas/{coaId}
```

---

## Description

Update existing Master COA. Transaction type management included via transactions array.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| coaId | string | Master COA ID (e.g., "COA01") |

---

## Request Body

```json
{
  "coaName": "COA Operasional Updated",
  "branches": [
    "BDG01"
  ],
  "transactions": [
    {
      "transactionName": "Kas Keluar",
      "category": "TRX_OUT",
      "subgroup": "PENGELUARAN",
      "group": "OPERASIONAL"
    }
  ]
}
```

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_UPDATED",
  "message": "Master COA updated successfully",
  "data": {
    "coaId": "COA01",
    "coaName": "COA Operasional Updated",
    "status": "ACTIVE",
    "updatedAt": "2026-05-19T11:00:00Z"
  },
  "errors": []
}
```

---

## Error Responses

### COA_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "COA_NOT_FOUND",
  "message": "Master COA not found",
  "data": null,
  "errors": []
}
```

---

### BRANCH_ALREADY_USED — 409

```json
{
  "success": false,
  "code": "BRANCH_ALREADY_USED",
  "message": "Branch already used by another active COA",
  "data": null,
  "errors": []
}
```

---

# API-003 — Activate Master COA

## Traceability

| Type | Reference |
|---|---|
| User Story | US-003 |
| Acceptance Criteria | AC-003 |
| Inputs | coaId |
| Outputs | coaId, status, updatedAt |
| Errors | INVALID_STATE, COA_NOT_FOUND |

---

## Endpoint

```
PATCH /api/v1/master-coas/{coaId}/activate
```

---

## Description

Activate Master COA dengan current status = INACTIVE.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| coaId | string | Master COA ID (e.g., "COA01") |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_ACTIVATED",
  "message": "Master COA activated successfully",
  "data": {
    "coaId": "COA01",
    "status": "ACTIVE",
    "updatedAt": "2026-05-19T11:30:00Z"
  },
  "errors": []
}
```

---

## Error Responses

### INVALID_STATE — 409

```json
{
  "success": false,
  "code": "INVALID_STATE",
  "message": "COA already active",
  "data": null,
  "errors": []
}
```

---

### COA_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "COA_NOT_FOUND",
  "message": "Master COA not found",
  "data": null,
  "errors": []
}
```

---

# API-004 — Deactivate Master COA

## Traceability

| Type | Reference |
|---|---|
| User Story | US-004 |
| Acceptance Criteria | AC-004 |
| Inputs | coaId |
| Outputs | coaId, status, updatedAt |
| Errors | INVALID_STATE, COA_NOT_FOUND |

---

## Endpoint

```
PATCH /api/v1/master-coas/{coaId}/deactivate
```

---

## Description

Deactivate Master COA dengan current status = ACTIVE.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| coaId | string | Master COA ID (e.g., "COA01") |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_DEACTIVATED",
  "message": "Master COA deactivated successfully",
  "data": {
    "coaId": "COA01",
    "status": "INACTIVE",
    "updatedAt": "2026-05-19T12:00:00Z"
  },
  "errors": []
}
```

---

## Error Responses

### INVALID_STATE — 409

```json
{
  "success": false,
  "code": "INVALID_STATE",
  "message": "COA already inactive",
  "data": null,
  "errors": []
}
```

---

### COA_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "COA_NOT_FOUND",
  "message": "Master COA not found",
  "data": null,
  "errors": []
}
```

---

# API-005 — Copy Master COA

## Traceability

| Type | Reference |
|---|---|
| User Story | US-005 |
| Acceptance Criteria | AC-005 |
| Inputs | coaId, branches |
| Outputs | newCoaId, status, createdAt, updatedAt |
| Errors | COA_NOT_FOUND, BRANCH_ALREADY_USED |

---

## Endpoint

```
POST /api/v1/master-coas/{coaId}/copy
```

---

## Description

Copy existing Master COA beserta detail transaksi.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| coaId | string | Source Master COA ID (e.g., "COA01") |

---

## Request Body

```json
{
  "branches": [
    "SBY01"
  ]
}
```

---

## Success Response — 201

```json
{
  "success": true,
  "code": "COA_COPIED",
  "message": "Master COA copied successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "coaId": "COA02",
    "status": "ACTIVE",
    "createdAt": "2026-05-19T12:30:00Z",
    "updatedAt": "2026-05-19T12:30:00Z"
  },
  "errors": []
}
```

---

## Error Responses

### COA_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "COA_NOT_FOUND",
  "message": "Master COA not found",
  "data": null,
  "errors": []
}
```

---

### BRANCH_ALREADY_USED — 409

```json
{
  "success": false,
  "code": "BRANCH_ALREADY_USED",
  "message": "Branch already used by another active COA",
  "data": null,
  "errors": []
}
```

---

# API-006 — Delete Master COA

## Traceability

| Type | Reference |
|---|---|
| User Story | US-006 |
| Acceptance Criteria | AC-006 |
| Inputs | coaId |
| Outputs | coaId, message |
| Errors | COA_ALREADY_USED, COA_NOT_FOUND |

---

## Endpoint

```
DELETE /api/v1/master-coas/{coaId}
```

---

## Description

Delete Master COA yang belum pernah digunakan transaksi.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| coaId | string | Master COA ID (e.g., "COA01") |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_DELETED",
  "message": "Master COA deleted successfully",
  "data": {
    "coaId": "COA01"
  },
  "errors": []
}
```

---

## Error Responses

### COA_ALREADY_USED — 422

```json
{
  "success": false,
  "code": "COA_ALREADY_USED",
  "message": "Master COA already used in transaction",
  "data": null,
  "errors": []
}
```

---

### COA_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "COA_NOT_FOUND",
  "message": "Master COA not found",
  "data": null,
  "errors": []
}
```

---

# API-007 — Get Master COA Detail

## Traceability

| Type | Reference |
|---|---|
| User Story | US-007 |
| Acceptance Criteria | AC-007 |
| Inputs | coaId |
| Outputs | full COA detail with transactions |
| Errors | COA_NOT_FOUND |

---

## Endpoint

```
GET /api/v1/master-coas/{coaId}
```

---

## Description

Get Master COA detail by ID.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| coaId | string | Master COA ID (e.g., "COA01") |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_DETAIL_SUCCESS",
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "coaId": "COA01",
    "coaName": "COA Operasional",
    "status": "ACTIVE",
    "branches": [
      "BDG01",
      "JKT01"
    ],
    "transactions": [
      {
        "transactionId": "COA01-TRX001",
        "transactionName": "Kas Masuk",
        "category": "TRX_IN",
        "status": "ACTIVE"
      }
    ],
    "createdAt": "2026-05-19T10:30:00Z",
    "updatedAt": "2026-05-19T11:00:00Z"
  },
  "errors": []
}
```

---

## Error Responses

### COA_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "COA_NOT_FOUND",
  "message": "Master COA not found",
  "data": null,
  "errors": []
}
```

---

# API-008 — List Master COA

## Traceability

| Type | Reference |
|---|---|
| User Story | US-008 |
| Acceptance Criteria | AC-008 |
| Inputs | keyword, status |
| Outputs | COA list with pagination |
| Errors | - |

---

## Endpoint

```
GET /api/v1/master-coas
```

---

## Description

Get list of Master COA dengan optional filtering.

---

## Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | NO | Search by COA name |
| status | string | NO | ACTIVE / INACTIVE |
| page | integer | NO | Page number (default: 0) |
| size | integer | NO | Page size (default: 10) |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_LIST_SUCCESS",
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "coaId": "COA01",
        "coaName": "COA Operasional",
        "status": "ACTIVE",
        "branches": ["BDG01"],
        "createdAt": "2026-05-19T10:30:00Z",
        "updatedAt": "2026-05-19T11:00:00Z"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  },
  "errors": []
}
```

---

# API-009 — Manage COA Transaction Type

## Traceability

| Type | Reference |
|---|---|
| User Story | US-009 |
| Acceptance Criteria | AC-009 |
| Notes | Managed via API-001 (Create) and API-002 (Update) request body |

---

## Description

Transaction type management dilakukan via request body pada endpoint Create dan Update. Tidak ada endpoint terpisah untuk transaction type management.

---

# 🚫 5. Out of Scope

- Multi currency support
- Integration external accounting system
- Import/export COA
- Approval workflow
- Hard delete API
- Separate endpoint for transaction type management (handled via Create/Update)

---

# 🔗 6. Dependencies

- Master Parameter
- Transaction Cash Module
- Transaction Bank Module
- Admin authentication (Bearer JWT)
- Audit logging

---