## Why

Pre Delivery Inspection (PDI) is a critical process for vehicle units before delivery to customers. This feature enables users to perform physical inspection, manage KSU, gifts, other items, parts, and supporting photos in a unified modal interface. Currently, there is no dedicated PDI feature in the system, making it difficult to track inspection status and manage the complete PDI workflow.

## What Changes

- Add new PDI module with main list page showing Belum PDI (Not Inspected) and Sudah PDI (Inspected) tabs
- Implement unit filtering and search by Nomor Mesin (Engine Number) or Kode Varian (Variant Code)
- Create PDI process modal with 6 tabs: Cek Fisik Unit, KSU, Hadiah, Barang Lain, Part, and Foto
- Add form for physical inspection checklist with unit header information (read-only)
- Implement CRUD operations for KSU, Hadiah, Barang Lain, and Part items
- Add photo upload functionality for supporting documentation
- Include footer actions: Refresh, Simpan (Save), Tolak (Reject), and Proses (Process)
- Add branch dropdown filter at the top of the list page
- Implement pagination for the unit list table

## Capabilities

### New Capabilities

- `pdi-list-page`: Main PDI list page with branch dropdown, tab navigation (Belum PDI/Sudah PDI), filtering, and search
- `pdi-process-modal`: Full-width modal for PDI processing with header unit information and tabbed content
- `pdi-physical-checklist`: Form for physical unit inspection with checklist items
- `pdi-ksu-management`: CRUD interface for accessories (KSU) items during PDI
- `pdi-gift-management`: CRUD interface for gift items during PDI
- `pdi-other-items-management`: CRUD interface for other items during PDI
- `pdi-part-management`: CRUD interface for parts during PDI
- `pdi-photo-upload`: Photo upload functionality for supporting PDI documentation

### Modified Capabilities

- `branch-data-table`: No changes required
- `document-upload`: May need extension to support PDI photo upload use case

## Impact

- New module: `src/modules/pdi/`
- New components: PDI list page, PDI modal, tab components, form components
- New services: PDI API integration
- New types: PDI-related TypeScript interfaces
- Dependencies: Existing UI components (ModalProvider, Table, Tabs, etc.)
