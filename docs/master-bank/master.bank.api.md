# 📘 API Contract — Master Bank Module

---

# 📌 1. Metadata

## Execution Metadata

- Feature Name: master-bank-management
- Module: master-bank
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
docs/fsd/master-bank.fsd.md
```

---

# 🚀 3. API Endpoints

---

# API-001 — Create Bank

## Traceability

| Type                | Reference                          |
|---------------------|------------------------------------|
| User Story          | US-001                             |
| Acceptance Criteria | AC-001                             |
| Flow                | FLOW-001                           |
| Inputs              | code, name                         |
| Outputs             | id, status                         |
| Errors              | BANK_CODE_EXISTS, INVALID_BANK_CODE |

---

## Endpoint

```txt
POST /api/v1/master-banks
```

---

## Description

Create new bank dengan default status = ACTIVE.

---

## Request Body

```json
{
  "code": "014",
  "name": "BCA"
}
```

---

## Success Response — 201

```json
{
  "success": true,
  "code": "BANK_CREATED",
  "message": "Bank created successfully",
  "data": {
    "id": "uuid",
    "status": "ACTIVE"
  },
  "errors": []
}
```

---

## Error Responses

### BANK_CODE_EXISTS — 409

```json
{
  "success": false,
  "code": "BANK_CODE_EXISTS",
  "message": "Bank code already exists",
  "data": null,
  "errors": []
}
```

---

### INVALID_BANK_CODE — 400

```json
{
  "success": false,
  "code": "INVALID_BANK_CODE",
  "message": "Invalid bank code",
  "data": null,
  "errors": [
    {
      "field": "code",
      "message": "Bank code is required"
    }
  ]
}
```

---

# API-002 — Update Bank

## Traceability

| Type                | Reference                                    |
|---------------------|----------------------------------------------|
| User Story          | US-002                                       |
| Acceptance Criteria | AC-002                                       |
| Flow                | Simple Flow US-002                           |
| Inputs              | bankId, code, name                           |
| Outputs             | message                                      |
| Errors              | BANK_NOT_FOUND, BANK_CODE_EXISTS             |

---

## Endpoint

```txt
PUT /api/v1/master-banks/{bankId}
```

---

## Description

Update existing bank data.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| bankId | UUID | Bank ID |

---

## Request Body

```json
{
  "code": "008",
  "name": "Bank Mandiri"
}
```

---

## Success Response — 200

```json
{
  "success": true,
  "code": "BANK_UPDATED",
  "message": "Bank updated successfully",
  "data": {
    "bankId": "uuid"
  },
  "errors": []
}
```

---

## Error Responses

### BANK_CODE_EXISTS — 409

```json
{
  "success": false,
  "code": "BANK_CODE_EXISTS",
  "message": "Bank code already exists",
  "data": null,
  "errors": []
}
```

---

### BANK_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "BANK_NOT_FOUND",
  "message": "Bank not found",
  "data": null,
  "errors": []
}
```

---

# API-003 — Activate Bank

## Traceability

| Type                | Reference                     |
|---------------------|-------------------------------|
| User Story          | US-003                        |
| Acceptance Criteria | AC-003                        |
| Flow                | FLOW-002                      |
| Inputs              | bankId                        |
| Outputs             | status                        |
| Errors              | INVALID_STATE, BANK_NOT_FOUND |

---

## Endpoint

```txt
PATCH /api/v1/master-banks/{bankId}/activate
```

---

## Description

Activate bank dengan current status = INACTIVE.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| bankId | UUID | Bank ID |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "BANK_ACTIVATED",
  "message": "Bank activated successfully",
  "data": {
    "bankId": "uuid",
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
  "message": "Bank already active",
  "data": null,
  "errors": []
}
```

---

### BANK_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "BANK_NOT_FOUND",
  "message": "Bank not found",
  "data": null,
  "errors": []
}
```

---

# API-004 — Deactivate Bank

## Traceability

| Type                | Reference                     |
|---------------------|-------------------------------|
| User Story          | US-004                        |
| Acceptance Criteria | AC-004                        |
| Flow                | Simple Flow US-004            |
| Inputs              | bankId                        |
| Outputs             | status                        |
| Errors              | INVALID_STATE, BANK_NOT_FOUND |

---

## Endpoint

```txt
PATCH /api/v1/master-banks/{bankId}/deactivate
```

---

## Description

Deactivate bank dengan current status = ACTIVE.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| bankId | UUID | Bank ID |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "BANK_DEACTIVATED",
  "message": "Bank deactivated successfully",
  "data": {
    "bankId": "uuid",
    "status": "INACTIVE"
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
  "message": "Bank already inactive",
  "data": null,
  "errors": []
}
```

---

### BANK_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "BANK_NOT_FOUND",
  "message": "Bank not found",
  "data": null,
  "errors": []
}
```

---

# API-005 — Get Bank Detail

## Traceability

| Type                | Reference       |
|---------------------|-----------------|
| User Story          | US-005          |
| Acceptance Criteria | AC-005          |
| Flow                | Simple Flow US-005 |
| Inputs              | bankId          |
| Outputs             | bank detail     |
| Errors              | BANK_NOT_FOUND  |

---

## Endpoint

```txt
GET /api/v1/master-banks/{bankId}
```

---

## Description

Get detail bank by ID.

---

## Path Parameters

| Parameter | Type | Description |
|---|---|---|
| bankId | UUID | Bank ID |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "BANK_DETAIL_SUCCESS",
  "message": "Success",
  "data": {
    "id": "uuid",
    "code": "014",
    "name": "BCA",
    "status": "ACTIVE",
    "createdAt": "2026-05-06T10:00:00Z",
    "updatedAt": "2026-05-06T10:00:00Z"
  },
  "errors": []
}
```

---

## Error Responses

### BANK_NOT_FOUND — 404

```json
{
  "success": false,
  "code": "BANK_NOT_FOUND",
  "message": "Bank not found",
  "data": null,
  "errors": []
}
```

---

# API-006 — List Banks

## Traceability

| Type                | Reference         |
|---------------------|-------------------|
| User Story          | US-006            |
| Acceptance Criteria | AC-006            |
| Flow                | Simple Flow US-006 |
| Inputs              | keyword, status   |
| Outputs             | bank list         |
| Errors              | -                 |

---

## Endpoint

```txt
GET /api/v1/master-banks
```

---

## Description

Get list of banks with optional filtering.

---

## Query Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| keyword | string | NO | Search by code or name |
| status | string | NO | Filter by ACTIVE / INACTIVE |
| page | integer | NO | Page number |
| size | integer | NO | Page size |

---

## Success Response — 200

```json
{
  "success": true,
  "code": "BANK_LIST_SUCCESS",
  "message": "Success",
  "data": {
    "items": [
      {
        "id": "uuid",
        "code": "014",
        "name": "BCA",
        "status": "ACTIVE"
      },
      {
        "id": "uuid",
        "code": "008",
        "name": "Bank Mandiri",
        "status": "ACTIVE"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 10,
      "totalItems": 2,
      "totalPages": 1
    }
  },
  "errors": []
}
```

---

# 🔗 4. Dependencies

- Bank database
- Admin authentication
- Audit logging

---

# 🚫 5. Out of Scope

- Integration ke external banking API
- Bank account management
- Auto synchronization bank data
- Multi currency management
- Permanent delete bank data
- Hard delete API

---