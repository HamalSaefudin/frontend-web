import { InputField, Button, Alert, AlertDescription, AlertTitle, AppModal, Tabs, TabsList, TabsTrigger, TabsContent } from "@frontend/ui"
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMutationProcessEkspedisiInventory,
  useQueryEkspedisiInventoryDetail,
} from "../hooks/useEkspedisiInventory";
import { ekspedisiInventoryProcessSchema } from "../schemas/validationSchemas";
import type { EkspedisiInventoryProcessFormValues } from "../types";
import { mapEkspedisiInventoryDetailToProcessFormValues } from "../../../services/ekspedisi-inventory";
import { KsuTab } from "./tabs/KsuTab";
import { PlaceholderTab } from "./tabs/PlaceholderTab";
import { EKSPEDISI_INVENTORY_TABS } from "../constants/ekspedisi-inventory-tabs";
import type { EkspedisiInventoryDetail } from "@frontend/shared/types/types-ekspedisi.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";

function defaultProcessValues(): EkspedisiInventoryProcessFormValues {
  return {
    cabang: "",
    tipeUnit: "",
    noFJ: "",
    noPDI: "",
    warnaUnit: "",
    noRangka: "",
    noEkspedisi: "",
    noMesin: "",
    namaPembeli: "",
    items: [],
  };
}

interface EkspedisiInventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventoryId?: string | null;
  onProcessSuccess?: () => void;
}

export function EkspedisiInventoryModal({
  open,
  onOpenChange,
  inventoryId,
  onProcessSuccess,
}: EkspedisiInventoryModalProps) {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("ksu");
  const [localError, setLocalError] = useState<string | null>(null);

  const detailQuery = useQueryEkspedisiInventoryDetail(
    open ? inventoryId : null,
  );
  const processMutation = useMutationProcessEkspedisiInventory();

  const methods = useForm<EkspedisiInventoryProcessFormValues>({
    resolver: zodResolver(ekspedisiInventoryProcessSchema),
    mode: "onSubmit",
    defaultValues: defaultProcessValues(),
  });
  const { control, reset, handleSubmit } = methods;

  useEffect(() => {
    if (!open) return;
    setActiveTab("ksu");
    setLocalError(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!detailQuery.data) return;

    const mapped = mapEkspedisiInventoryDetailToProcessFormValues(
      detailQuery.data.data.data as EkspedisiInventoryDetail,
    );
    reset(mapped);
    setActiveTab("ksu");
  }, [detailQuery.data, open, reset]);

  const modalTitle = useMemo(() => {
    return "Ekspedisi - Inventory";
  }, []);

  const handleRefresh = () => {
    // Refresh list + detail (the screen owns the active filters/page)
    qc.invalidateQueries({ queryKey: ["ekspedisi-inventory-list"] });
    if (inventoryId)
      qc.invalidateQueries({
        queryKey: ["ekspedisi-inventory-detail", inventoryId],
      });
  };

  const handleProcessSubmit = async (
    values: EkspedisiInventoryProcessFormValues,
  ) => {
    if (!inventoryId) return;
    setLocalError(null);

    try {
      await processMutation.mutateAsync({
        id: inventoryId,
        items: values.items.map((it) => ({
          kodeKsu: it.kodeKsu,
          scan: it.scan,
          menyusul: it.menyusul,
        })),
      });

      onProcessSuccess?.();
      onOpenChange(false);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Terjadi kesalahan saat proses.";
      setLocalError(msg);
    }
  };

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={modalTitle}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleProcessSubmit)}
          className="space-y-5"
        >
          {localError ? (
            <Alert className="border border-destructive/40 bg-destructive/5 text-destructive">
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{localError}</AlertDescription>
            </Alert>
          ) : null}

          {detailQuery.isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-4">
              <Controller
                name="cabang"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Cabang"
                    disabled
                    className="bg-secondary/50"
                  />
                )}
              />
              <Controller
                name="tipeUnit"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Tipe Unit"
                    disabled
                    className="bg-secondary/50"
                  />
                )}
              />
              <Controller
                name="noFJ"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="No FJ"
                    disabled
                    className="bg-secondary/50"
                  />
                )}
              />
              <Controller
                name="noPDI"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="No PDI"
                    disabled
                    className="bg-secondary/50"
                  />
                )}
              />
              <Controller
                name="warnaUnit"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="Warna Unit"
                    disabled
                    className="bg-secondary/50"
                  />
                )}
              />
              <Controller
                name="noRangka"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="No Rangka"
                    disabled
                    className="bg-secondary/50"
                  />
                )}
              />
              <Controller
                name="noEkspedisi"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="No Ekspedisi"
                    disabled
                    className="bg-secondary/50"
                  />
                )}
              />
              <Controller
                name="noMesin"
                control={control}
                render={({ field }) => (
                  <InputField
                    {...field}
                    label="No Mesin"
                    disabled
                    className="bg-secondary/50"
                  />
                )}
              />
              <Controller
                name="namaPembeli"
                control={control}
                render={({ field }) => (
                  <div className="md:col-span-4">
                    <InputField
                      {...field}
                      label="Nama Pembeli"
                      disabled
                      className="bg-secondary/50"
                    />
                  </div>
                )}
              />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="overflow-x-auto">
              {EKSPEDISI_INVENTORY_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="ksu" forceMount>
              <KsuTab />
            </TabsContent>

            {EKSPEDISI_INVENTORY_TABS.filter((t) => t.value !== "ksu").map(
              (tab) => (
                <PlaceholderTab key={tab.value} value={tab.value} />
              ),
            )}
          </Tabs>

          <div className="flex items-center justify-between gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleRefresh}
              disabled={processMutation.isPending}
            >
              Refresh
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.print()}
                disabled={processMutation.isPending}
              >
                Cetak
              </Button>
              <Button
                type="submit"
                disabled={processMutation.isPending || detailQuery.isLoading}
              >
                {processMutation.isPending ? "Memproses..." : "Proses"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </AppModal>
  );
}
