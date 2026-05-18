import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type SortingState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Tailwind classes applied to both <th> and <td> for this column (e.g. "w-32", "min-w-48"). */
    className?: string;
    /** Tailwind classes applied only to the <th>. Combined with `className`. */
    headerClassName?: string;
    /** Tailwind classes applied only to the <td>. Combined with `className`. */
    cellClassName?: string;
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  className?: string;
  emptyStateMessage?: string;

  /**
   * false        → client-side: DataTable slices data internally
   * true/omitted → server-side: parent owns state, data is already paged
   */
  serverSide?: boolean;

  /** 0-indexed. Required for server-side; optional for controlled client-side. */
  page?: number;
  rowsPerPage?: number;
  /** Required for server-side so Next can be disabled correctly. */
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** Show loading skeleton */
  isLoading?: boolean;
}

interface PaginationState {
  page: number;
  rowsPerPage: number;
}

// ── Constants ────────────────────────────────────────────────────────────────

const ROWS_OPTIONS = [5, 10, 30];

// Row-model factories are stable references — define once outside the component
// so they never change between renders and don't confuse TanStack Table.
const coreRowModel = getCoreRowModel();
const sortedRowModel = getSortedRowModel();

// ── Pagination bar ───────────────────────────────────────────────────────────

interface PaginationBarProps {
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

function TablePagination({
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}: PaginationBarProps) {
  const [localRows, setLocalRows] = useState(rowsPerPage);

  useEffect(() => {
    setLocalRows(rowsPerPage);
  }, [rowsPerPage]);

  const from = total === 0 ? 0 : page * localRows + 1;
  const to = Math.min((page + 1) * localRows, total);
  const canPrev = page > 0;
  const canNext = to < total;

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm text-muted-foreground">
      {/* Left — rows per page */}
      <div className="flex items-center gap-2">
        <span>Rows per page</span>
        <select
          value={localRows}
          onChange={(e) => {
            const n = Number(e.target.value);
            setLocalRows(n); // instant visual update — only rerenders this bar
            onRowsPerPageChange(n); // triggers DataTable's heavier re-render after
          }}
          className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {ROWS_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Right — range info + prev / next */}
      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          {from}–{to} of {total}
        </span>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="rounded p-1.5 hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="rounded p-1.5 hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}

// ── DataTable ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  className,
  emptyStateMessage = "No data available",
  serverSide,
  page: pageProp,
  rowsPerPage: rowsPerPageProp,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  isLoading = false,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // Single state object → one re-render per change, not two
  const [internal, setInternal] = useState<PaginationState>({
    page: 0,
    rowsPerPage: 5,
  });

  // ── Mode detection ──────────────────────────────────────────────────────
  const isClientSide = serverSide === false;
  const isControlled = isClientSide && pageProp !== undefined;

  // ── Active values ───────────────────────────────────────────────────────
  const activePage =
    isClientSide && !isControlled ? internal.page : (pageProp ?? 0);
  const activeRows =
    isClientSide && !isControlled
      ? internal.rowsPerPage
      : (rowsPerPageProp ?? 5);
  const total = isClientSide ? data.length : (totalRows ?? 0);

  // Clamp so a filter shrinking data never leaves an empty view
  const maxPage = Math.max(0, Math.ceil(total / activeRows) - 1);
  const clampedPage = Math.min(activePage, maxPage);

  // ── Data slicing — memoized so the reference is stable between renders ──
  // Without useMemo, slice() always returns a new array → TanStack Table sees
  // "new data" every render → triggers internal recomputation → infinite loop.
  const displayData = useMemo(
    () =>
      isClientSide
        ? data.slice(clampedPage * activeRows, (clampedPage + 1) * activeRows)
        : data,
    [data, isClientSide, clampedPage, activeRows],
  );

  // ── Handlers ────────────────────────────────────────────────────────────
  const handlePageChange = (newPage: number) => {
    if (isClientSide && !isControlled)
      setInternal((s) => ({ ...s, page: newPage }));
    onPageChange?.(newPage);
  };

  const handleRowsChange = (newRows: number) => {
    if (isClientSide && !isControlled) {
      // Single setState call → single re-render
      setInternal({ page: 0, rowsPerPage: newRows });
    } else {
      onPageChange?.(0);
    }
    onRowsPerPageChange?.(newRows);
  };

  // ── Table instance ───────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: displayData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: coreRowModel,
    getSortedRowModel: sortedRowModel,
  });

  return (
    <div
      className={cn(
        "w-full rounded-lg border border-border bg-background",
        className,
      )}
    >
      {/* Scrollable table area */}
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn(
                      "h-10 px-5 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.headerClassName,
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="border-t border-border">
                  {Array.from({ length: columns.length }).map((_, cellIdx) => (
                    <td
                      key={`skeleton-cell-${cellIdx}`}
                      className="px-5 py-3 text-foreground"
                    >
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="h-0 border-0 p-0">
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <div className="text-4xl">📋</div>
                    <p className="text-sm text-muted-foreground">
                      {emptyStateMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border transition-colors hover:bg-secondary/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-5 py-3 text-foreground",
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.cellClassName,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <TablePagination
          page={clampedPage}
          rowsPerPage={activeRows}
          total={total}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsChange}
        />
      )}
    </div>
  );
}
