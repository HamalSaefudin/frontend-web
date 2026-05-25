import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCwIcon, SaveIcon, XIcon, CheckIcon } from "lucide-react";
import { AppModal } from "@/components/AppModal";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PdiUnit } from "@/types";
import {
  useQueryPdiData,
  useMutationProcessPdi,
  useMutationRejectPdi,
  useMutationSaveChecklist,
  useMutationSaveKsu,
  useMutationSaveHadiah,
  useMutationSaveBarangLain,
  useMutationSavePart,
} from "../hooks";
import { pdiFormSchema, type PdiFormData } from "../schemas/validationSchemas";
import { CekFisikTab } from "./tabs/CekFisikTab";
import { KsuTab } from "./tabs/KsuTab";
import { HadiahTab } from "./tabs/HadiahTab";
import { BarangLainTab } from "./tabs/BarangLainTab";
import { PartTab } from "./tabs/PartTab";
import { FotoTab } from "./tabs/FotoTab";

interface PdiModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: PdiUnit | null;
}

const defaultValues: PdiFormData = {
  checklist: [],
  ksu: [],
  hadiah: [],
  barangLain: [],
  parts: [],
  photos: [],
};

export function PdiModal({ open, onOpenChange, unit }: PdiModalProps) {
  const [activeTab, setActiveTab] = useState("cek-fisik");

  const { data: pdiData, isLoading, refetch } = useQueryPdiData(unit?.id ?? "");
  const processMutation = useMutationProcessPdi();
  const rejectMutation = useMutationRejectPdi();
  const saveChecklist = useMutationSaveChecklist();
  const saveKsu = useMutationSaveKsu();
  const saveHadiah = useMutationSaveHadiah();
  const saveBarangLain = useMutationSaveBarangLain();
  const savePart = useMutationSavePart();

  const methods = useForm<PdiFormData>({
    resolver: zodResolver(pdiFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      setActiveTab("cek-fisik");
      methods.reset(defaultValues);
      return;
    }
    if (pdiData) {
      methods.reset({
        checklist: pdiData.checklist,
        ksu: pdiData.ksu.map((i) => ({ ...i, isSaved: true })),
        hadiah: pdiData.hadiah.map((i) => ({ ...i, isSaved: true })),
        barangLain: pdiData.barangLain.map((i) => ({ ...i, isSaved: true })),
        parts: pdiData.parts.map((i) => ({ ...i, isSaved: true })),
        photos: pdiData.photos,
      });
    }
  }, [open, pdiData, methods]);

  const handleRefresh = () => {
    refetch();
  };

  const handleSave = methods.handleSubmit(async (data) => {
    if (!unit) return;
    const normalize = <T extends { id?: string; isSaved?: boolean }>(
      items: T[],
      prefix: string,
    ) =>
      items.map(({ id, ...rest }) => ({
        ...rest,
        id: id ?? `${prefix}-${Date.now()}-${Math.random()}`,
      }));

    await Promise.all([
      saveChecklist.mutateAsync({ unitId: unit.id, checklist: data.checklist }),
      saveKsu.mutateAsync({ unitId: unit.id, ksu: normalize(data.ksu, "ksu") }),
      saveHadiah.mutateAsync({
        unitId: unit.id,
        hadiah: normalize(data.hadiah, "hadiah"),
      }),
      saveBarangLain.mutateAsync({
        unitId: unit.id,
        barangLain: normalize(data.barangLain, "barang"),
      }),
      savePart.mutateAsync({
        unitId: unit.id,
        parts: normalize(data.parts, "part"),
      }),
    ]);
  });

  const handleTolak = async () => {
    if (!unit) return;
    try {
      await rejectMutation.mutateAsync(unit.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to reject PDI:", error);
    }
  };

  const handleProses = async () => {
    if (!unit) return;
    try {
      await processMutation.mutateAsync(unit.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to process PDI:", error);
    }
  };

  if (!unit) return null;

  const isSaving =
    saveChecklist.isPending ||
    saveKsu.isPending ||
    saveHadiah.isPending ||
    saveBarangLain.isPending ||
    savePart.isPending;

  return (
    <AppModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="PRE DELIVERY INSPECTION"
      className="max-w-[90vw] w-full"
    >
      {isLoading ? (
        <LoadingOverlay message="Memuat data PDI..." />
      ) : (
        <FormProvider {...methods}>
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-4">
            <InputField label="Cabang" value={unit.cabangName} disabled={true} />
            <InputField label="Warna Unit" value={unit.namaWarna} disabled={true} />
            <InputField label="No. FJ" value={unit.noFj} disabled={true} />
            <InputField label="No. PDI" value={unit.noPdi || ""} disabled={true} />
            <InputField label="No. Mesin" value={unit.nomorMesin} disabled={true} />
            <InputField label="Keterangan" value={unit.keterangan || ""} disabled={true} />
            <InputField label="Tipe Unit" value={unit.tipeUnit} disabled={true} />
            <InputField label="No. Rangka" value={unit.nomorRangka} disabled={true} />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="cek-fisik">Cek Fisik Unit</TabsTrigger>
              <TabsTrigger value="ksu">KSU</TabsTrigger>
              <TabsTrigger value="hadiah">Hadiah</TabsTrigger>
              <TabsTrigger value="barang-lain">Barang Lain</TabsTrigger>
              <TabsTrigger value="part">Part</TabsTrigger>
              <TabsTrigger value="foto">Foto</TabsTrigger>
            </TabsList>

            <TabsContent value="cek-fisik" className="mt-4">
              <CekFisikTab />
            </TabsContent>
            <TabsContent value="ksu" className="mt-4">
              <KsuTab />
            </TabsContent>
            <TabsContent value="hadiah" className="mt-4">
              <HadiahTab />
            </TabsContent>
            <TabsContent value="barang-lain" className="mt-4">
              <BarangLainTab />
            </TabsContent>
            <TabsContent value="part" className="mt-4">
              <PartTab />
            </TabsContent>
            <TabsContent value="foto" className="mt-4">
              <FotoTab unitId={unit.id} />
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-end mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCwIcon className="size-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              <SaveIcon className="size-4 mr-2" />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleTolak}
              disabled={rejectMutation.isPending}
            >
              <XIcon className="size-4 mr-2" />
              Tolak
            </Button>
            <Button
              onClick={handleProses}
              disabled={processMutation.isPending}
            >
              <CheckIcon className="size-4 mr-2" />
              Proses
            </Button>
          </div>
        </FormProvider>
      )}
    </AppModal>
  );
}
