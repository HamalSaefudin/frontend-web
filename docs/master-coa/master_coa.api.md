# 📘 API Contract — Master COA Module

---

# 📌 1. Metadata

## Execution Metadata

- Feature Name: master-coa-management
- Module: master-coa
- Version: v1.0

---

## Governance Metadata

- Author:
- Date:
- Stakeholders:

---

# 🔗 2. Source Reference

SOURCE FSD:

```txt
docs/fsd/master-coa.fsd.md
```

---

# 🚀 3. API Endpoints

---

# API-001 — Create Master COA

## Traceability

| Type | Reference |
|---|---|
| User Story | US-001 |
| Acceptance Criteria | AC-001 |
| Flow | FLOW-001 |
| Inputs | coaName, branches, transactions |
| Outputs | coaId, status |
| Errors | BRANCH_ALREADY_USED, INVALID_COA_NAME |

---

## Endpoint

```txt
POST /api/v1/master-coas
```

---

## Description

Create new Master COA dengan default status = ACTIVE.

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
    "coaId": "COA01",
    "status": "ACTIVE"
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
| Flow | Simple Flow US-002 |
| Inputs | coaId, coaName, branches |
| Outputs | message |
| Errors | COA_NOT_FOUND, BRANCH_ALREADY_USED |

---

## Endpoint

```txt
PUT /api/v1/master-coas/{coaId}
```

---

## Description

Update existing Master COA.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| coaId | UUID | Master COA ID |

---

## Request Body

```json
{
  "coaName": "COA Operasional Updated",
  "branches": [
    "BDG01"
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
    "coaId": "uuid"
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
| Flow | FLOW-002 |
| Inputs | coaId |
| Outputs | status |
| Errors | INVALID_STATE, COA_NOT_FOUND |

---

## Endpoint

```txt
PATCH /api/v1/master-coas/{coaId}/activate
```

---

## Description

Activate Master COA dengan current status = INACTIVE.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| coaId | UUID | Master COA ID |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_ACTIVATED",
  "message": "Master COA activated successfully",
  "data": {
    "coaId": "uuid",
    "status": "ACTIVE"
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
| Flow | Simple Flow US-004 |
| Inputs | coaId |
| Outputs | status |
| Errors | INVALID_STATE, COA_NOT_FOUND |

---

## Endpoint

```txt
PATCH /api/v1/master-coas/{coaId}/deactivate
```

---

## Description

Deactivate Master COA dengan current status = ACTIVE.

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_DEACTIVATED",
  "message": "Master COA deactivated successfully",
  "data": {
    "coaId": "uuid",
    "status": "INACTIVE"
  },
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
| Flow | FLOW-004 |
| Inputs | coaId, branches |
| Outputs | newCoaId |
| Errors | COA_NOT_FOUND, BRANCH_ALREADY_USED |

---

## Endpoint

```txt
POST /api/v1/master-coas/{coaId}/copy
```

---

## Description

Copy existing Master COA beserta detail transaksi.

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
    "newCoaId": "COA02"
  },
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
| Flow | FLOW-003 |
| Inputs | coaId |
| Outputs | message |
| Errors | COA_ALREADY_USED, COA_NOT_FOUND |

---

## Endpoint

```txt
DELETE /api/v1/master-coas/{coaId}
```

---

## Description

Delete Master COA yang belum pernah digunakan transaksi.

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_DELETED",
  "message": "Master COA deleted successfully",
  "data": {
    "coaId": "uuid"
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

# API-007 — Get Master COA Detail

## Traceability

| Type | Reference |
|---|---|
| User Story | US-007 |
| Acceptance Criteria | AC-007 |
| Flow | Simple Flow US-007 |
| Inputs | coaId |
| Outputs | master COA detail |
| Errors | COA_NOT_FOUND |

---

## Endpoint

```txt
GET /api/v1/master-coas/{coaId}
```

---

## Description

Get Master COA detail by ID.

---

## Success Response — 200

```json
{
  "success": true,
  "code": "COA_DETAIL_SUCCESS",
  "message": "Success",
  "data": {
    "coaId": "COA01",
    "coaName": "COA Operasional",
    "status": "ACTIVE",
    "branches": [
      "BDG01"
    ],
    "transactions": [
      {
        "transactionId": "COA01-TRX001",
        "transactionName": "Kas Masuk",
        "category": "TRX_IN",
        "status": "ACTIVE"
      }
    ]
  },
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
| Flow | Simple Flow US-008 |
| Inputs | keyword, status |
| Outputs | COA list |
| Errors | - |

---

## Endpoint

```txt
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
| page | integer | NO | Page number |
| size | integer | NO | Page size |

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
        "coaId": "COA01",
        "coaName": "COA Operasional",
        "status": "ACTIVE"
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

# 🔗 4. Dependencies

- Master Parameter
- Transaction Cash Module
- Transaction Bank Module
- Admin authentication
- Audit logging

---

# 🚫 5. Out of Scope

- Multi currency support
- Integration external accounting system
- Import/export COA
- Approval workflow
- Hard delete API

---
