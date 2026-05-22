# 📘 API Contract — Master Lokasi Warehouse Module

---

# 📌 1. Metadata

## Execution Metadata

- Feature Name: master-locator
- Module: master-locator
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
docs/fsd/master-locator.fsd.md
```

---

# 🚀 3. API Endpoints

---

# API-001 — Create Lokasi Warehouse

## Endpoint

```txt
POST /api/v1/master-locator
```

## Request Body

```json
{
  "kodeLokasi": "WH-JKT-01",
  "kodeCabang": "JKT01",
  "namaLokasi": "Warehouse Jakarta Utama"
}
```

## Success Response — 201

```json
{
  "success": true,
  "code": "LOKASI_CREATED",
  "message": "Lokasi warehouse created successfully",
  "data": {
    "id": "uuid"
  },
  "errors": []
}
```

---

# API-002 — Update Lokasi Warehouse

## Endpoint

```txt
PUT /api/v1/master-locator/{lokasiId}
```

## Request Body

```json
{
  "kodeLokasi": "WH-JKT-02",
  "kodeCabang": "JKT01",
  "namaLokasi": "Warehouse Jakarta Timur"
}
```

## Success Response — 200

```json
{
  "success": true,
  "code": "LOKASI_UPDATED",
  "message": "Lokasi warehouse updated successfully",
  "data": {
    "lokasiId": "uuid"
  },
  "errors": []
}
```

---

# API-003 — Delete Lokasi Warehouse

## Endpoint

```txt
DELETE /api/v1/master-locator/{lokasiId}
```

## Success Response — 200

```json
{
  "success": true,
  "code": "LOKASI_DELETED",
  "message": "Lokasi warehouse deleted successfully",
  "data": {
    "lokasiId": "uuid"
  },
  "errors": []
}
```

---

# API-004 — Get Detail Lokasi Warehouse

## Endpoint

```txt
GET /api/v1/master-locator/{lokasiId}
```

## Success Response — 200

```json
{
  "success": true,
  "code": "LOKASI_DETAIL_SUCCESS",
  "message": "Success",
  "data": {
    "id": "uuid",
    "kodeLokasi": "WH-JKT-01",
    "kodeCabang": "JKT01",
    "namaLokasi": "Warehouse Jakarta Utama"
  },
  "errors": []
}
```

---

# API-005 — List Lokasi Warehouse

## Endpoint

```txt
GET /api/v1/master-locator
```

## Success Response — 200

```json
{
  "success": true,
  "code": "LOKASI_LIST_SUCCESS",
  "message": "Success",
  "data": {
    "items": []
  },
  "errors": []
}
```

---

# API-006 — Filter Lokasi Warehouse

## Endpoint

```txt
GET /api/v1/master-locator/filter
```

## Query Parameters

| Parameter     | Type   | Required | Description                                      | Default |
|---------------|--------|----------|------------------------------------------------|---------|
| kodeLokasi    | String | No       | Filter by kode lokasi (wildcard/partial match) | -       |
| kodeCabang    | String | No       | Filter by kode cabang (wildcard/partial match) | -       |
| namaLokasi    | String | No       | Filter by nama lokasi (wildcard/partial match) | -       |
| page          | int    | No       | Page number (1-based)                          | 1       |
| size          | int    | No       | Page size                                       | 10      |

## Wildcard & Pagination Behavior

- **Wildcard**: All filter parameters use partial matching (contains/LIKE pattern)
- **Single Parameter**: Sending only 1 filter parameter returns all records matching that criteria
- **Multiple Parameters**: When sending multiple parameters, all conditions are applied (AND logic)
- **No Filter Parameters**: When all filter parameters are empty/null, returns all records (with pagination)
- **Pagination**: Results are sorted by `createdAt` descending

## Example Requests

### Single filter parameter (wildcard)

```txt
GET /api/v1/master-locator/filter?kodeLokasi=WH-JKT
```
Returns all locators where kodeLokasi contains "WH-JKT"

### Single filter parameter with pagination

```txt
GET /api/v1/master-locator/filter?kodeLokasi=WH&page=1&size=20
```
Returns first 20 results where kodeLokasi contains "WH"

### Multiple filter parameters (AND logic)

```txt
GET /api/v1/master-locator/filter?kodeCabang=JKT01&namaLokasi=Jakarta
```
Returns locators where kodeCabang contains "JKT01" AND namaLokasi contains "Jakarta"

### Multiple filter parameters with pagination

```txt
GET /api/v1/master-locator/filter?kodeLokasi=WH&kodeCabang=JKT&namaLokasi=Warehouse&page=1&size=5
```
Returns page 2 (5 items per page) matching all three filter conditions

### No filter parameters (return all with pagination)

```txt
GET /api/v1/master-locator/filter?page=1&size=10
```
Returns first 10 locators (all records)

### Empty filter (return all)

```txt
GET /api/v1/master-locator/filter
```
Returns all locators with default pagination (page=1, size=10)

## Success Response — 200

```json
{
  "success": true,
  "code": "LOKASI_FILTER_SUCCESS",
  "message": "Success",
  "data": {
    "items": []
  },
  "errors": []
}
```

---

# API-007 — Update Status Lokasi Warehouse

## Endpoint

```txt
PUT /api/v1/master-locator/{lokasiId}/status
```

## Request Body

```json
{
  "status": "INACTIVE"
}
```

atau

```json
{
  "status": "ACTIVE"
}
```

## Success Response — 200

```json
{
  "success": true,
  "code": "LOKASI_STATUS_UPDATED",
  "message": "Lokasi warehouse status updated successfully",
  "data": {
    "lokasiId": "uuid",
    "status": "INACTIVE"
  },
  "errors": []
}
```