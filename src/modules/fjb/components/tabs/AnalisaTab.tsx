import { useFormContext } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";

export function AnalisaTab() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <TabsContent value="analisa" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rekomendasi SA *</label>
          <textarea
            {...register("rekomendasiSa")}
            className="w-full border rounded p-2"
            rows={4}
          />
          {errors.rekomendasiSa && (
            <p className="text-xs text-destructive mt-1">{errors.rekomendasiSa.message as string}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Keluhan Konsumen *</label>
          <textarea
            {...register("keluhanKonsumen")}
            className="w-full border rounded p-2"
            rows={4}
          />
          {errors.keluhanKonsumen && (
            <p className="text-xs text-destructive mt-1">{errors.keluhanKonsumen.message as string}</p>
          )}
        </div>
      </div>
    </TabsContent>
  );
}