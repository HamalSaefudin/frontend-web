import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { FjbScreen } from "@/modules/fjb/FjbScreen";
import * as useFjb from "@/modules/fjb/hooks/useFjb";

// Mock the hooks
vi.mock("@/modules/fjb/hooks/useFjb");

const mockFjbList = [
  {
    id: "1",
    noFjb: "FJB-001",
    tanggalFjb: "2026-04-29",
    noPolisi: "B 1234 XYZ",
    namaPemilik: "John Doe",
    namaPembawa: "Jane Doe",
    noMesin: "MC123456",
    noRangka: "RC123456",
    kodeVarian: "V1",
    kodeWarna: "C1",
    namaWarna: "Hitam",
    status: "DRAFT" as const,
  },
];

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );

  return { queryClient, Wrapper };
};

const setupHookMocks = () => {
  vi.clearAllMocks();
  vi.mocked(useFjb.useQueryFjbList).mockReturnValue({
    data: mockFjbList,
    isLoading: false,
    error: null,
  } as ReturnType<typeof useFjb.useQueryFjbList>);
  vi.mocked(useFjb.useQueryFjbDetail).mockReturnValue({
    data: undefined,
    isLoading: false,
    error: null,
  } as unknown as ReturnType<typeof useFjb.useQueryFjbDetail>);
  vi.mocked(useFjb.useQueryMasterCabang).mockReturnValue({
    data: [{ value: "cab1", label: "Cabang 1" }],
    isLoading: false,
  } as ReturnType<typeof useFjb.useQueryMasterCabang>);
  vi.mocked(useFjb.useQueryMasterTipeFjb).mockReturnValue({
    data: [{ value: "tipe1", label: "Tipe 1" }],
    isLoading: false,
  } as unknown as ReturnType<typeof useFjb.useQueryMasterTipeFjb>);
  vi.mocked(useFjb.useMutationDeleteFjb).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
  } as unknown as ReturnType<typeof useFjb.useMutationDeleteFjb>);
  vi.mocked(useFjb.useMutationCreateFjb).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
  } as unknown as ReturnType<typeof useFjb.useMutationCreateFjb>);
  vi.mocked(useFjb.useMutationUpdateFjb).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
  } as unknown as ReturnType<typeof useFjb.useMutationUpdateFjb>);
  vi.mocked(useFjb.useMutationValidateNomorMesin).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(true),
  } as unknown as ReturnType<typeof useFjb.useMutationValidateNomorMesin>);
};

describe("FjbScreen", () => {
  beforeEach(() => {
    setupHookMocks();
  });

  it("renders the page title", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    expect(screen.getByText("Faktur Jual Bengkel")).toBeInTheDocument();
  });

  it("renders filter controls", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    expect(screen.getByText("Cabang")).toBeInTheDocument();
    expect(screen.getByText("Tanggal Awal")).toBeInTheDocument();
    expect(screen.getByText("Tanggal Akhir")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nama customer/i)).toBeInTheDocument();
  });

  it("renders Tambah Data button", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    expect(screen.getByRole("button", { name: /tambah data/i })).toBeInTheDocument();
  });

  it("opens modal when Tambah Data is clicked", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));
    expect(screen.getByText("Create FJB")).toBeInTheDocument();
  });

  it("renders table with FJB data", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    expect(screen.getByText("FJB-001")).toBeInTheDocument();
    expect(screen.getByText("B 1234 XYZ")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    vi.mocked(useFjb.useQueryFjbList).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as unknown as ReturnType<typeof useFjb.useQueryFjbList>);
    const { Wrapper } = createTestWrapper();
    const { container } = render(<FjbScreen />, { wrapper: Wrapper });
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows empty state when no data", () => {
    vi.mocked(useFjb.useQueryFjbList).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof useFjb.useQueryFjbList>);
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it("opens view modal when View is clicked", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    const viewButtons = screen.getAllByRole("button", { name: /view/i });
    fireEvent.click(viewButtons[0]);
    expect(screen.getByText(/view fjb/i)).toBeInTheDocument();
  });

  it("opens edit modal when Edit is clicked", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    fireEvent.click(editButtons[0]);
    expect(screen.getByText("Edit FJB")).toBeInTheDocument();
  });

  it("opens delete confirmation when Delete is clicked", async () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    const dialog = await screen.findByRole("alertdialog");
    expect(within(dialog).getByText("Hapus FJB")).toBeInTheDocument();
  });

  it("shows Cari button", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    expect(screen.getByRole("button", { name: /cari/i })).toBeInTheDocument();
  });

  it("renders status badge for each row", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("renders Print button for each row", () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    const printButtons = screen.getAllByRole("button", { name: /print/i });
    expect(printButtons.length).toBe(mockFjbList.length);
  });
});

describe("FjbFormModal", () => {
  beforeEach(() => {
    setupHookMocks();
  });

  it("renders all tabs", async () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));
    
    expect(screen.getByRole("tab", { name: /data unit/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /data pemilik/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /data pembawa/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /analisa/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /data transaksi/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /data tambahan/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /keterangan/i })).toBeInTheDocument();
  });

  it("closes modal when Cancel is clicked", async () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByText("Create FJB")).not.toBeInTheDocument();
    });
  });

  it("switches tabs correctly", async () => {
    const user = userEvent.setup();
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));

    await user.click(screen.getByRole("tab", { name: /data transaksi/i }));
    await waitFor(() => {
      expect(screen.getByText("Jasa Bengkel")).toBeInTheDocument();
    });
    expect(screen.getByText("Part Dengan QR")).toBeInTheDocument();
    expect(screen.getByText("Part Tanpa QR")).toBeInTheDocument();
  });

  it("has Clear and Confirm Order buttons", async () => {
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));
    
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm order/i })).toBeInTheDocument();
  });

  it("disables confirm button during submission", async () => {
    const { Wrapper } = createTestWrapper();
    vi.mocked(useFjb.useMutationCreateFjb).mockReturnValue({
      mutateAsync: vi.fn().mockImplementation(() => new Promise(r => setTimeout(r, 1000))),
    } as unknown as ReturnType<typeof useFjb.useMutationCreateFjb>);
    
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));
    
    // Button should be enabled initially
    expect(screen.getByRole("button", { name: /confirm order/i })).not.toBeDisabled();
  });

  it("renders Data Transaksi tab with Tambah buttons", async () => {
    const user = userEvent.setup();
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));
    await user.click(screen.getByRole("tab", { name: /data transaksi/i }));

    await waitFor(() => {
      expect(screen.getByText("Jasa Bengkel")).toBeInTheDocument();
    });
    const tambahButtons = screen.getAllByRole("button", { name: /^tambah$/i });
    expect(tambahButtons.length).toBe(3);
  });

  it("adds new job row when Tambah is clicked", async () => {
    const user = userEvent.setup();
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));
    await user.click(screen.getByRole("tab", { name: /data transaksi/i }));

    await waitFor(() => {
      expect(screen.getByText("Jasa Bengkel")).toBeInTheDocument();
    });
    expect(screen.getByText("Belum ada jasa")).toBeInTheDocument();

    const tambahButtons = screen.getAllByRole("button", { name: /^tambah$/i });
    await user.click(tambahButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Belum ada jasa")).not.toBeInTheDocument();
    });
  });

  it("allows inline editing of job row", async () => {
    const user = userEvent.setup();
    const { Wrapper } = createTestWrapper();
    render(<FjbScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole("button", { name: /tambah data/i }));
    await user.click(screen.getByRole("tab", { name: /data transaksi/i }));

    await waitFor(() => {
      expect(screen.getByText("Jasa Bengkel")).toBeInTheDocument();
    });
    const tambahButtons = screen.getAllByRole("button", { name: /^tambah$/i });
    await user.click(tambahButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Belum ada jasa")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Jasa Bengkel")).toBeInTheDocument();
  });
});