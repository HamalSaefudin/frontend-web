import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { AppModal } from "@/components/AppModal";
import { fjbDetailSchema, type FjbDetailForm } from "../schemas/validationSchemas";
import type { FjbListItem } from "@/services/fjb-types";
import {
  useQueryFjbDetail,
  useMutationCreateFjb,
  useMutationUpdateFjb,
  useQueryMasterCabang,
  useQueryMasterTipeFjb,
  useMutationValidateNomorMesin,
} from "../hooks/useFjb";
import { DataUnitTab } from "./tabs/DataUnitTab";
import { DataPemilikTab } from "./tabs/DataPemilikTab";
import { DataPembawaTab } from "./tabs/DataPembawaTab";
import { AnalisaTab } from "./tabs/AnalisaTab";
import { DataTransaksiTab } from "./tabs/DataTransaksiTab";
import { DataTambahanTab } from "./tabs/DataTambahanTab";
import { KeteranganTab } from "./tabs/KeteranganTab";

interface FjbFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit" | "view";
  initialData?: FjbListItem | null;
}

const defaultValues: Partial<FjbDetailForm> = {
  workOrderType: "work-order",
  isPerusahaan: false,
  pembawaIsPerusahaan: false,
  jobs: [],
  partsWithQr: [],
  partsWithoutQr: [],
};

export function FjbFormModal({
  open,
  onOpenChange,
  mode,
  initialData,
}: FjbFormModalProps) {
  const isViewMode = mode === "view";
  const methods = useForm<FjbDetailForm>({
    resolver: zodResolver(fjbDetailSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const { data: detailData } = useQueryFjbDetail(mode !== "create" ? initialData?.id : undefined);
  const { data: masterCabang = [] } = useQueryMasterCabang();
  const { data: masterTipeFjb = [] } = useQueryMasterTipeFjb();
  const createMutation = useMutationCreateFjb();
  const updateMutation = useMutationUpdateFjb();
  const validateMutation = useMutationValidateNomorMesin();

  useEffect(() => {
    if (!open) return;
    if (detailData) {
      reset(detailData);
    } else if (!initialData) {
      reset(defaultValues);
    }
  }, [open, detailData, initialData, reset]);

  const getTitle = () => {
    if (isViewMode) return `View FJB - ${initialData?.noFjb || ""}`;
    if (mode === "edit") return "Edit FJB";
    return "Create FJB";
  };

  const onSubmit = async (data: FjbDetailForm) => {
    try {
      if (mode === "edit" && initialData?.id) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleCekNomorMesin = async () => {
    const nomorMesin = methods.getValues("nomorMesin");
    if (nomorMesin) {
      const result = await validateMutation.mutateAsync(nomorMesin);
      if (!result) {
        alert("Nomor Mesin tidak valid");
      }
    }
  };

  return (
    <AppModal isOpen={open} onClose={() => onOpenChange(false)} title={getTitle()}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header Fields */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="cabangId"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Cabang *"
                  mode="single"
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value)}
                  options={masterCabang}
                  disabled={isViewMode}
                  error={errors.cabangId?.message as string}
                />
              )}
            />
            <InputField
              label="No Booking"
              {...methods.register("noBooking")}
              disabled={isViewMode}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="No Faktur"
              {...methods.register("noFjb")}
              disabled
            />
            <InputField
              label="No Prospect"
              {...methods.register("noProspect")}
              disabled={isViewMode}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="tanggalFjb"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Tanggal FJB *"
                  value={field.value ? new Date(field.value) : undefined}
                  onChange={(date) => field.onChange(date?.toISOString().split("T")[0] || "")}
                  disabled={isViewMode}
                />
              )}
            />
            <Controller
              name="tipeFjb"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Tipe FJB *"
                  mode="single"
                  value={field.value || undefined}
                  onChange={(value) => field.onChange(value)}
                  options={masterTipeFjb}
                  disabled={isViewMode}
                  error={errors.tipeFjb?.message as string}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Jenis Prospect"
              {...methods.register("jenisProspect")}
              disabled={isViewMode}
            />
            <InputField
              label="No Hotline"
              {...methods.register("noHotline")}
              disabled={isViewMode}
            />
          </div>

          {/* Work Order Type Radio */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <Controller
                name="workOrderType"
                control={control}
                render={({ field }) => (
                  <input
                    type="radio"
                    value="work-order"
                    checked={field.value === "work-order"}
                    onChange={() => field.onChange("work-order")}
                    disabled={isViewMode}
                  />
                )}
              />
              <span>Work Order</span>
            </label>
            <label className="flex items-center gap-2">
              <Controller
                name="workOrderType"
                control={control}
                render={({ field }) => (
                  <input
                    type="radio"
                    value="direct-sales"
                    checked={field.value === "direct-sales"}
                    onChange={() => field.onChange("direct-sales")}
                    disabled={isViewMode}
                  />
                )}
              />
              <span>Direct Sales</span>
            </label>
          </div>

          {/* Tab Navigation */}
          <Tabs defaultValue="data-unit" className="w-full">
            <TabsList className="w-full flex-wrap">
              <TabsTrigger value="data-unit">Data Unit</TabsTrigger>
              <TabsTrigger value="data-pemilik">Data Pemilik</TabsTrigger>
              <TabsTrigger value="data-pembawa">Data Pembawa</TabsTrigger>
              <TabsTrigger value="analisa">Analisa</TabsTrigger>
              <TabsTrigger value="data-transaksi">Data Transaksi</TabsTrigger>
              <TabsTrigger value="data-tambahan">Data Tambahan</TabsTrigger>
              <TabsTrigger value="keterangan">Keterangan</TabsTrigger>
            </TabsList>

            <DataUnitTab onCekNomorMesin={handleCekNomorMesin} />
            <DataPemilikTab />
            <DataPembawaTab />
            <AnalisaTab />
            <DataTransaksiTab />
            <DataTambahanTab />
            <KeteranganTab />
          </Tabs>

          {/* Footer Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset(defaultValues)}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Confirm Order"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </AppModal>
  );
}