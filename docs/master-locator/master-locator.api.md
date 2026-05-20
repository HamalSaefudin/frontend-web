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
PATCH /api/v1/master-locator/{lokasiId}/status
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