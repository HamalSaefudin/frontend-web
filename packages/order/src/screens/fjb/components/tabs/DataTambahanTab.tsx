import { InputField, TabsContent } from "@frontend/ui"
import { Controller, useFormContext } from "react-hook-form";

export function DataTambahanTab() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <TabsContent value="data-tambahan" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="No Work Order *"
          {...register("noWorkOrder")}
          error={errors.noWorkOrder?.message as string}
        />
        <InputField
          label="Jenis Pit *"
          {...register("jenisPit")}
          error={errors.jenisPit?.message as string}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="tanggalService"
          control={control}
          render={({ field }) => (
            <InputField
              label="Tanggal Service *"
              type="date"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              error={errors.tanggalService?.message as string}
            />
          )}
        />
        <InputField
          label="Waktu Pendaftaran"
          {...register("waktuPendaftaran")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Waktu PKB"
          {...register("waktuPkb")}
        />
        <InputField
          label="Waktu Selesai"
          {...register("waktuSelesai")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Asal Unit Entry"
          {...register("asalUnitEntry")}
        />
        <InputField
          label="Total FRT"
          type="number"
          {...register("totalFrt", { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Nama Mekanik *"
          {...register("namaMekanik")}
          error={errors.namaMekanik?.message as string}
        />
        <InputField
          label="SA *"
          {...register("sa")}
          error={errors.sa?.message as string}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Final Check"
          {...register("finalCheck")}
        />
        <InputField
          label="Admin FJB"
          {...register("adminFjb")}
        />
      </div>
    </TabsContent>
  );
}