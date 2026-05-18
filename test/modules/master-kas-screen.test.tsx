import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MasterKasScreen } from "../../src/modules/master-kas/MasterKasScreen";
import * as useMasterKas from "../../src/modules/master-kas/hooks/useMasterKas";

vi.mock("../../src/modules/master-kas/hooks/useMasterKas");

const mockKasList = {
  data: [
    {
      id: "1",
      kodeKas: "KS001",
      namaCabang: "Cabang Jakarta",
      namaKas: "Kas Jakarta Pusat",
      status: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
};

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
  vi.mocked(useMasterKas.useQueryMasterKasList).mockReturnValue({
    data: mockKasList,
    isLoading: false,
    isFetching: false,
    error: null,
  } as ReturnType<typeof useMasterKas.useQueryMasterKasList>);
  vi.mocked(useMasterKas.useQueryCabang).mockReturnValue({
    data: [
      { id: "1", kodeCabang: "CB001", namaCabang: "Cabang Jakarta", namaLead: "John Doe" },
    ],
    isLoading: false,
  } as ReturnType<typeof useMasterKas.useQueryCabang>);
  vi.mocked(useMasterKas.useMutationCreateMasterKas).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  } as unknown as ReturnType<typeof useMasterKas.useMutationCreateMasterKas>);
  vi.mocked(useMasterKas.useMutationUpdateMasterKas).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  } as unknown as ReturnType<typeof useMasterKas.useMutationUpdateMasterKas>);
  vi.mocked(useMasterKas.useMutationDeleteMasterKas).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  } as unknown as ReturnType<typeof useMasterKas.useMutationDeleteMasterKas>);
  vi.mocked(useMasterKas.useMutationUpdateMasterKasStatus).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  } as unknown as ReturnType<typeof useMasterKas.useMutationUpdateMasterKasStatus>);
  vi.mocked(useMasterKas.useMutationExportMasterKas).mockReturnValue({
    mutateAsync: vi.fn().mockResolvedValue(new Blob()),
    isPending: false,
  } as unknown as ReturnType<typeof useMasterKas.useMutationExportMasterKas>);
};

describe("MasterKasScreen", () => {
  beforeEach(() => {
    setupHookMocks();
  });

  it("renders the screen title", () => {
    const { Wrapper } = createTestWrapper();
    render(<MasterKasScreen />, { wrapper: Wrapper });
    expect(screen.getByText("Master Kas")).toBeInTheDocument();
  });

  it("shows toolbar with action buttons", () => {
    const { Wrapper } = createTestWrapper();
    render(<MasterKasScreen />, { wrapper: Wrapper });
    expect(screen.getByText("Tambah")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
    expect(screen.getByText("Cetak")).toBeInTheDocument();
  });

  it("shows search field", () => {
    const { Wrapper } = createTestWrapper();
    render(<MasterKasScreen />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText("Cari nama kas...")).toBeInTheDocument();
  });

  it("renders table with kas data", () => {
    const { Wrapper } = createTestWrapper();
    render(<MasterKasScreen />, { wrapper: Wrapper });
    expect(screen.getByText("KS001")).toBeInTheDocument();
    expect(screen.getByText("Kas Jakarta Pusat")).toBeInTheDocument();
  });

  it("opens form modal when Tambah is clicked", () => {
    const { Wrapper } = createTestWrapper();
    render(<MasterKasScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText("Tambah"));
    expect(screen.getByText("Tambah Data Kas")).toBeInTheDocument();
  });

  it("opens filter popup when Filter is clicked", () => {
    const { Wrapper } = createTestWrapper();
    render(<MasterKasScreen />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText("Filter"));
    expect(screen.getByText("Filter Data Kas")).toBeInTheDocument();
  });

  it("shows Cari button for search", () => {
    const { Wrapper } = createTestWrapper();
    render(<MasterKasScreen />, { wrapper: Wrapper });
    expect(screen.getByText("Cari")).toBeInTheDocument();
  });
});