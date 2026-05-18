import { useFormContext } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";

export function KeteranganTab() {
  const { register } = useFormContext();

  return (
    <TabsContent value="keterangan" className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Keterangan</label>
        <textarea
          {...register("keterangan")}
          className="w-full border rounded p-2"
          rows={6}
          placeholder="Masukkan keterangan tambahan..."
        />
      </div>
    </TabsContent>
  );
}