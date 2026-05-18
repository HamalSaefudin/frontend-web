import { useFormContext, Controller } from "react-hook-form";
import { TabsContent } from "@/components/ui/tabs";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface DataUnitTabProps {
  onCekNomorMesin?: () => void;
}

export function DataUnitTab({ onCekNomorMesin }: DataUnitTabProps) {
  const { register, control, formState: { errors } } = useFormContext();

  return (
    <TabsContent value="data-unit" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Nomor Polisi *"
          {...register("nomorPolisi")}
          error={errors.nomorPolisi?.message as string}
        />
        <InputField
          label="Nama Varian *"
          {...register("namaVarian")}
          error={errors.namaVarian?.message as string}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Nomor Rangka *"
          {...register("nomorRangka")}
          error={errors.nomorRangka?.message as string}
        />
        <InputField
          label="Tahun Motor"
          type="number"
          {...register("tahunMotor", { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <InputField
              label="Nomor Mesin *"
              {...register("nomorMesin")}
              error={errors.nomorMesin?.message as string}
            />
          </div>
          {onCekNomorMesin && (
            <div className="flex items-end">
              <Button type="button" variant="outline" onClick={onCekNomorMesin}>
                CEK
              </Button>
            </div>
          )}
        </div>
        <InputField
          label="Informasi Bensin"
          {...register("informasiBensin")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="kodeVarian"
          control={control}
          render={({ field }) => (
            <SelectField
              label="Kode Varian"
              mode="single"
              value={field.value || undefined}
              onChange={(value) => field.onChange(value)}
              options={[]}
              placeholder="Pilih Kode Varian"
            />
          )}
        />
        <InputField
          label="KM Terakhir"
          type="number"
          {...register("kmTerakhir", { valueAsNumber: true })}
        />
      </div>
    </TabsContent>
  );
}