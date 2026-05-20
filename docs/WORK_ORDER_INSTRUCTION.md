# Instruksi Work Order

Cuma 4 langkah. Ikuti urutannya.

---

## 1. Business tulis requirement + prototype

Copy `docs/REQUIREMENTS_TEMPLATE.md` → isi bagian 1–3 (apa, siapa, bisa apa).

Setelah itu WAJIB lanjut:

### 1.1 Buat FSD (Feature Specification)
- Lengkapi requirement dengan detail behavior & flow
- Sertakan referensi image (jika ada)
- Gunakan format FSD yang sudah disepakati

---

### 1.2 Generate Prototype (HTML)

Gunakan template: `GENERATE_PROTOTYPE_PROMPT`

**Langkah:**
- Upload image reference (main page, modal, state, dll)
- Sertakan FSD yang sudah dibuat
- Generate HTML prototype (single file)

**Tujuan:**
- Menyamakan persepsi UI & layout sebelum development
- Menghindari ambiguity dari requirement text

---

### 1.3 Handover ke Developer

Berikan ke developer:
- ✅ FSD (Markdown)
- ✅ HTML Prototype (hasil generate)

Contoh yang bagus:  
`REQUIREMENT_RECEIVING_UNIT.md` + prototype HTML

---

## 2. Developer bikin proposal

```bash
/openspec-propose-task
```

Baca semua file yang muncul di `openspec/changes/<nama-fitur>/`.  
Kalau ada yang salah, **edit dulu sebelum ngoding**.

---

## 3. Developer kerjakan

```bash
/opsx:apply <nama-fitur>
```

---

## 4. Review & deploy

```bash
npm run build && npm run lint && npm run dev
```

Checklist manual:
- Create
- Edit
- View
- Delete
- Validasi error
- Filter / search
- Layout sesuai prototype

Buka PR → setelah merge, jalankan:
---

## Referensi

- [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)
- [CLAUDE.md](../CLAUDE.md)
