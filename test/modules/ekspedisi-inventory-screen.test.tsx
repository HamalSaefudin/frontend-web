import { describe, expect, it, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { renderWithProviders } from "../utils/render";

import { EkspedisiInventoryScreen } from "@/modules/ekspedisi-inventory/EkspedisiInventoryScreen";

const fetchEkspedisiInventoryListMock = vi.hoisted(() => vi.fn());
const fetchEkspedisiInventoryDetailMock = vi.hoisted(() => vi.fn());
const processEkspedisiInventoryMock = vi.hoisted(() => vi.fn());

vi.mock("@/services/ekspedisi-inventory", async () => {
  const actual = await vi.importActual<typeof import("@/services/ekspedisi-inventory")>(
    "@/services/ekspedisi-inventory"
  );

  return {
    ...actual,
    fetchEkspedisiInventoryList: fetchEkspedisiInventoryListMock,
    fetchEkspedisiInventoryDetail: fetchEkspedisiInventoryDetailMock,
    processEkspedisiInventory: processEkspedisiInventoryMock,
  };
});

function buildListRecord() {
  return {
    id: "inv-1",
    tanggalFj: "2026-04-20",
    noFj: "FJ-001",
    namaPembeli: "John Doe",
    kodeVarian: "VAR-125",
    namaVarian: "Vario 125",
    kodeWarna: "W-RED",
    namaWarna: "Merah",
    noMesin: "ME-1001",
    noRangka: "RA-2001",
    status: "DRAFT",
  } as const;
}

function buildDetailRecord() {
  return {
    id: "inv-1",
    cabang: "Jakarta Pusat",
    tipeUnit: "Scooter",
    noFj: "FJ-001",
    noPdi: "PDI-001",
    warnaUnit: "Merah",
    noRangka: "RA-2001",
    noEkspedisi: "EXP-01",
    noMesin: "ME-1001",
    namaPembeli: "John Doe",
    items: [
      {
        id: "ksu-0",
        kodeKsu: "KSU-001",
        namaKsu: "KSU A",
        jenisKsu: "KACA",
        qrCode: "QR-KSU-001",
        scan: false,
        menyusul: true,
      },
      {
        id: "ksu-1",
        kodeKsu: "KSU-010",
        namaKsu: "KSU B",
        jenisKsu: "PLAT",
        qrCode: "QR-KSU-010",
        scan: true,
        menyusul: false,
      },
    ],
  };
}

function getKsuTableDataRows(dialog: HTMLElement) {
  const rows = within(dialog).getAllByRole("row");
  return rows.filter((tr) => tr.querySelectorAll("td").length > 0);
}

describe("EkspedisiInventoryScreen", () => {
  beforeEach(() => {
    fetchEkspedisiInventoryListMock.mockReset();
    fetchEkspedisiInventoryDetailMock.mockReset();
    processEkspedisiInventoryMock.mockReset();

    fetchEkspedisiInventoryListMock.mockResolvedValue({
      data: [buildListRecord()],
      total: 1,
    });

    fetchEkspedisiInventoryDetailMock.mockResolvedValue(buildDetailRecord());
    processEkspedisiInventoryMock.mockResolvedValue(undefined);
  });

  it("renders heading and list row from query", async () => {
    renderWithProviders(<EkspedisiInventoryScreen />);

    expect(
      screen.getByRole("heading", { name: /EKSPEDISI/i }),
    ).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("FJ-001")).toBeInTheDocument());
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("submits filters on Cari button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EkspedisiInventoryScreen />);

    await waitFor(() => expect(screen.getByText("FJ-001")).toBeInTheDocument());

    // Status select (searchable): pick DRAFT
    const allComboboxes = screen.getAllByRole("combobox");
    const statusCombo = allComboboxes.find((el) => el.textContent?.includes("Semua Status")) ?? allComboboxes[0]!;
    await user.click(statusCombo);
    await user.click(await screen.findByRole("option", { name: "DRAFT" }));

    // Keyword
    await user.clear(screen.getByPlaceholderText("Search..."));
    await user.type(screen.getByPlaceholderText("Search..."), "John");

    await user.click(screen.getByRole("button", { name: /^Cari$/i }));

    await waitFor(() => {
      expect(fetchEkspedisiInventoryListMock).toHaveBeenLastCalledWith(
        1,
        5,
        expect.objectContaining({ status: "DRAFT", keyword: "John" }),
      );
    });
  });

  it("shows empty state when list returns no rows", async () => {
    fetchEkspedisiInventoryListMock.mockResolvedValue({
      data: [],
      total: 0,
    });

    renderWithProviders(<EkspedisiInventoryScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Sorry, no matching records found/i)).toBeInTheDocument();
    });
  });

  it("opens modal and pre-fills header + KSU items from detail response", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EkspedisiInventoryScreen />);

    await waitFor(() => expect(screen.getByText("FJ-001")).toBeInTheDocument());

    await user.click(screen.getByTitle("Edit"));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(within(dialog).getByDisplayValue("Jakarta Pusat")).toBeInTheDocument();
      expect(within(dialog).getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    // KSU items rendered as input values
    await waitFor(() => {
      expect(within(dialog).getByDisplayValue("KSU-001")).toBeInTheDocument();
      expect(within(dialog).getByDisplayValue("KSU-010")).toBeInTheDocument();
    });
  });

  it("+ Tambah appends a row and renumbers the KSU table", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EkspedisiInventoryScreen />);

    await waitFor(() => expect(screen.getByTitle("Edit")).toBeInTheDocument());
    await user.click(screen.getByTitle("Edit"));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(within(dialog).getByDisplayValue("KSU-001")).toBeInTheDocument());
    const initialRows = getKsuTableDataRows(dialog);
    expect(initialRows.length).toBe(2);
    expect(initialRows[0].querySelectorAll("td")[0]).toHaveTextContent("1");
    expect(initialRows[1].querySelectorAll("td")[0]).toHaveTextContent("2");

    await user.click(within(dialog).getByRole("button", { name: /\+\s*Tambah/i }));

    const nextRows = await waitFor(() => getKsuTableDataRows(dialog));
    expect(nextRows.length).toBe(3);
    expect(nextRows[2].querySelectorAll("td")[0]).toHaveTextContent("3");
  });

  it("deleting a row updates row numbering", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EkspedisiInventoryScreen />);

    await waitFor(() => expect(screen.getByTitle("Edit")).toBeInTheDocument());
    await user.click(screen.getByTitle("Edit"));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(within(dialog).getByDisplayValue("KSU-001")).toBeInTheDocument());
    const initialRows = getKsuTableDataRows(dialog);
    expect(initialRows.length).toBe(2);

    const deleteButtons = within(dialog).getAllByRole("button", { name: /Delete/i });
    await user.click(deleteButtons[0]!);

    const afterRows = await waitFor(() => getKsuTableDataRows(dialog));
    expect(afterRows.length).toBe(1);
    expect(afterRows[0].querySelectorAll("td")[0]).toHaveTextContent("1");
  });

  it("enforces minimum one KSU row", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EkspedisiInventoryScreen />);

    await waitFor(() => expect(screen.getByTitle("Edit")).toBeInTheDocument());
    await user.click(screen.getByTitle("Edit"));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(within(dialog).getByDisplayValue("KSU-001")).toBeInTheDocument());

    // Delete both existing rows
    const deleteButtons = within(dialog).getAllByRole("button", { name: /Delete/i });
    await user.click(deleteButtons[0]!);

    const deleteButtonsAfterFirst = within(dialog).getAllByRole("button", { name: /Delete/i });
    expect(deleteButtonsAfterFirst.length).toBeGreaterThanOrEqual(1);
    await user.click(deleteButtonsAfterFirst[0]!);

    // Submit and expect min-rows validation error
    await user.click(within(dialog).getByRole("button", { name: /^Proses$/i }));
    expect(
      await within(dialog).findByText(/Minimal 1 KSU dibutuhkan/i),
    ).toBeInTheDocument();
  });

  it("shows validation errors for required Kode KSU and duplicate Kode KSU", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EkspedisiInventoryScreen />);
    await waitFor(() => expect(screen.getByTitle("Edit")).toBeInTheDocument());
    await user.click(screen.getByTitle("Edit"));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() =>
      expect(within(dialog).getByDisplayValue("KSU-001")).toBeInTheDocument(),
    );

    const kodeInputs = within(dialog).getAllByLabelText("Kode KSU");
    await user.clear(kodeInputs[0]!);

    await user.click(within(dialog).getByRole("button", { name: /^Proses$/i }));

    expect(
      await within(dialog).findByText(/Kode KSU wajib diisi/i),
    ).toBeInTheDocument();

    const kodeInputsAfterFirstSubmit = within(dialog).getAllByLabelText("Kode KSU");
    fireEvent.change(kodeInputsAfterFirstSubmit[0]!, { target: { value: "KSU-010" } });

    await user.click(within(dialog).getByRole("button", { name: /^Proses$/i }));

    const duplicateErrors = await within(dialog).findAllByText(/Kode KSU tidak boleh duplicate/i);
    expect(duplicateErrors.length).toBeGreaterThan(0);
  });

  it("enforces Scan required when Menyusul is false", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EkspedisiInventoryScreen />);
    await waitFor(() => expect(screen.getByTitle("Edit")).toBeInTheDocument());
    await user.click(screen.getByTitle("Edit"));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(within(dialog).getByDisplayValue("KSU-001")).toBeInTheDocument());

    // Row 1: make Menyusul off, Scan off
    const scanSwitch = within(dialog).getAllByRole("switch", { name: /Scan/i }).at(0)!;
    const menyusulSwitch = within(dialog).getAllByRole("switch", { name: /Menyusul/i }).at(0)!;

    if (menyusulSwitch.getAttribute("aria-checked") !== "false") {
      await user.click(menyusulSwitch);
    }
    if (scanSwitch.getAttribute("aria-checked") !== "false") {
      await user.click(scanSwitch);
    }

    await user.click(within(dialog).getByRole("button", { name: /^Proses$/i }));

    expect(await within(dialog).findByText(/Scan wajib jika Menyusul = false/i)).toBeInTheDocument();
  });

  it("successful Proses calls API, closes modal, and shows success feedback", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EkspedisiInventoryScreen />);

    await waitFor(() => expect(screen.getByTitle("Edit")).toBeInTheDocument());
    await user.click(screen.getByTitle("Edit"));

    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(within(dialog).getByDisplayValue("KSU-001")).toBeInTheDocument());

    // Ensure first row passes: Menyusul true means scan not required; set Scan true anyway
    const scanSwitch = within(dialog).getAllByRole("switch", { name: /Scan/i }).at(0)!;
    if (scanSwitch.getAttribute("aria-checked") !== "true") {
      await user.click(scanSwitch);
    }

    await user.click(within(dialog).getByRole("button", { name: /^Proses$/i }));

    await waitFor(() => expect(processEkspedisiInventoryMock).toHaveBeenCalled());

    expect(await screen.findByText(/Data ekspedisi berhasil diproses/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    // Payload includes KSU scan + menyusul
    const payload = processEkspedisiInventoryMock.mock.calls[0]![0];
    expect(payload.id).toBe("inv-1");
    expect(payload.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kodeKsu: "KSU-001" }),
      ]),
    );
  });
});

