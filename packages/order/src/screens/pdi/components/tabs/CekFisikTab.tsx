import { SelectField, type SelectOption, InputField } from "@frontend/ui"
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { PdiFormData } from "../../schemas/validationSchemas";

const STATUS_OPTIONS: SelectOption[] = [
  { value: "OK", label: "OK" },
  { value: "NOT_OK", label: "Not OK" },
];

export function CekFisikTab() {
  const { control } = useFormContext<PdiFormData>();
  const { fields } = useFieldArray({ control, name: "checklist" });

  if (fields.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Cek Fisik Unit</h3>
        <div className="text-center py-8 text-muted-foreground">
          Belum ada checklist item
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Cek Fisik Unit</h3>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((field, idx) => (
          <div key={field.id} className="space-y-2">
            <Controller
              name={`checklist.${idx}.status`}
              control={control}
              render={({ field: f }) => (
                <SelectField
                  mode="simple"
                  label={field.namaItem}
                  options={STATUS_OPTIONS}
                  value={STATUS_OPTIONS.find((o) => o.value === f.value)}
                  onChange={(opt) =>
                    f.onChange(opt?.value as "OK" | "NOT_OK")
                  }
                />
              )}
            />
            <Controller
              name={`checklist.${idx}.notes`}
              control={control}
              render={({ field: f }) => (
                <InputField
                  {...f}
                  value={f.value ?? ""}
                  placeholder="Catatan (opsional)"
                />
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
