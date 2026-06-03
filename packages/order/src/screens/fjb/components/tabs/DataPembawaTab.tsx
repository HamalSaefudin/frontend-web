import { InputField, SelectField, TabsContent } from "@frontend/ui"
import { useFormContext, Controller } from "react-hook-form";
export function DataPembawaTab() {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <TabsContent value="data-pembawa" className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Controller
          name="pembawaIsPerusahaan"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="pembawaIsPerusahaan"
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-4 h-4"
            />
          )}
        />
        <label htmlFor="pembawaIsPerusahaan" className="text-sm font-medium">
          Data Perusahaan
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Nama *"
          {...register("pembawaNama")}
          error={errors.pembawaNama?.message as string}
        />
        <Controller
          name="pembawaJenisKelamin"
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
              error={errors.pembawaJenisKelamin?.message as string}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="NIK"
          {...register("pembawaNik")}
        />
        <InputField
          label="Pekerjaan"
          {...register("pembawaPekerjaan")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="No HP *"
          {...register("pembawaNoHp")}
          error={errors.pembawaNoHp?.message as string}
        />
        <Controller
          name="pembawaAgama"
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
          {...register("pembawaEmail")}
        />
      </div>
    </TabsContent>
  );
}