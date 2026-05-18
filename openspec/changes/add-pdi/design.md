## Context

The Pre Delivery Inspection (PDI) feature is a new module for managing vehicle inspection before customer delivery. Currently, there is no dedicated PDI workflow in the system, making it difficult to track inspection status and manage the complete PDI process. This design outlines the implementation approach for a unified PDI interface with multiple tabs covering physical inspection, accessories, gifts, other items, parts, and documentation photos.

**Current State**: No PDI module exists. Unit inspection is likely managed manually or in external systems.

**Constraints**:
- Tech stack: React, TypeScript, TailwindCSS, React Query, React Router, Vite
- Modular feature-based architecture with consolidated hooks
- Mock data layer with backend API integration planned
- Must reuse existing UI components (ModalProvider, Table, Tabs, etc.)

**Stakeholders**: Vehicle delivery teams, warehouse staff, quality control personnel

## Goals / Non-Goals

**Goals:**
- Provide a unified PDI interface with tabbed navigation for different inspection aspects
- Enable filtering and search of units by branch, engine number, and variant code
- Track PDI status (Belum PDI / Sudah PDI) per unit
- Support physical inspection checklist, KSU management, gift management, other items, parts, and photo uploads
- Integrate with existing branch selection functionality

**Non-Goals:**
- Backend API implementation (mock data only for initial version)
- Print/export functionality for PDI reports
- Integration with external delivery systems
- Multi-language support beyond Indonesian

## Decisions

### 1. Modal-based PDI Process
**Decision**: PDI process opens in a full-width modal instead of a separate page.

**Rationale**: Keeps users in context of the list view while processing PDI. Modal allows quick navigation between units. Full-width maximizes screen real estate for the complex tabbed interface.

**Alternatives**: Separate page would require route management and context switching.

### 2. Tabbed Interface for PDI Content
**Decision**: Six tabs within the PDI modal: Cek Fisik Unit, KSU, Hadiah, Barang Lain, Part, Foto.

**Rationale**: Each category has distinct data structures and interactions. Tabs provide clear separation while keeping related actions within the same workflow.

**Alternatives**: Single-page form would be overwhelming. Accordion sections would cause scrolling issues with many items.

### 3. Read-only Header Information
**Decision**: Unit header info (Cabang, Warna Unit, No. FJ, etc.) is read-only.

**Rationale**: Header represents existing unit data that should not be editable during PDI. Prevents accidental data corruption. Editing would require separate unit edit functionality.

### 4. Branch Dropdown at List Page Top
**Decision**: Branch selection appears at the top-left of the PDI list page.

**Rationale**: Units are branch-specific. Users typically work within one branch context. Placing branch selection at top-left is a common pattern following left-to-right reading flow.

### 5. Optimistic UI Updates for List Changes
**Decision**: Use React Query mutations with optimistic updates for status changes.

**Rationale**: Immediate feedback improves perceived performance. Status changes (Belum PDI → Sudah PDI) should feel instant. Handle rollback on API failure.

## Risks / Trade-offs

[Risk] Complex modal with 6 tabs may be overwhelming for users
→ **Mitigation**: Clear visual hierarchy, consistent tab styling, logical grouping of related content

[Risk] Photo upload in modal could slow down the interface
→ **Mitigation**: Lazy load photo tab content, use thumbnail previews, consider chunked uploads for large files

[Risk] Pagination state may be lost when returning to list from modal
→ **Mitigation**: Preserve pagination state in URL params or component state, reset to page 1 on branch change

[Risk] Large number of KSU/Gift/Part items per unit could cause performance issues
→ **Mitigation**: Virtual scrolling if >50 items, pagination within each category, search/filter within lists

## Open Questions

- Should the PDI process support multiple units selected at once (batch processing)?
- What is the exact data structure for KSU, Hadiah, Barang Lain, and Part items? (Requires API spec)
- Are there any required vs optional fields for each tab?
- Should photos be required before the PDI can be marked as "Selesai" (Complete)?
- What validation rules apply to the physical checklist items?
