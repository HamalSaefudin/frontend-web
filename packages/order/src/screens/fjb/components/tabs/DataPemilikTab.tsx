import { InputField, SelectField, TabsContent } from "@frontend/ui"
import { useFormContext, Controller } from "react-hook-form";
export function DataPemilikTab() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <TabsContent value="data-pemilik" className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Controller
          name="isPerusahaan"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="isPerusahaan"
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-4 h-4"
            />
          )}
        />
        <label htmlFor="isPerusahaan" className="text-sm font-medium">
          Data Perusahaan
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Nama *"
          {...register("pemilikNama")}
          error={errors.pemilikNama?.message as string}
        />
        <Controller
          name="pemilikJenisKelamin"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Jenis Kelamin *"
              mode="single"
              value={field.value || undefined}
              onChange={(value) => field.onChange(value)}
              options={[
                { value: "L", label: "Laki-Laki" },
                { value: "P", label: "Perempuan" },
              ]}
              error={errors.pemilikJenisKelamin?.message as string}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="NIK"
          {...register("pemilikNik")}
          error={errors.pemilikNik?.message as string}
        />
        <InputField
          label="Pekerjaan"
          {...register("pemilikPekerjaan")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="No HP *"
          {...register("pemilikNoHp")}
          error={errors.pemilikNoHp?.message as string}
        />
        <Controller
          name="pemilikAgama"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Agama"
              mode="single"
              value={field.value || undefined}
              onChange={(value) => field.onChange(value)}
              options={[]}
              placeholder="Pilih Agama"
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Email"
          type="email"
          {...register("pemilikEmail")}
        />
      </div>
    </TabsContent>
  );
}