import { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { UploadIcon, TrashIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField, type SelectOption } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppModal } from "@/components/AppModal";
import type { PdiPhoto } from "@/types";
import { useMutationUploadPhoto, useMutationDeletePhoto } from "../../hooks";
import type { PdiFormData } from "../../schemas/validationSchemas";

const KATEGORI_OPTIONS: SelectOption[] = [
  { value: "EXTERIOR", label: "Exterior" },
  { value: "INTERIOR", label: "Interior" },
  { value: "DAMAGE", label: "Damage" },
  { value: "LAINNYA", label: "Lainnya" },
];

interface FotoTabProps {
  unitId: string;
}

export function FotoTab({ unitId }: FotoTabProps) {
  const { control } = useFormContext<PdiFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  const [kategori, setKategori] = useState<PdiPhoto["kategori"]>("EXTERIOR");
  const [previewPhoto, setPreviewPhoto] = useState<PdiPhoto | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutationUploadPhoto();
  const deleteMutation = useMutationDeletePhoto();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const newPhoto = await uploadMutation.mutateAsync({
          unitId,
          photo: { file, kategori },
        });
        append(newPhoto);
      } catch (error) {
        console.error("Failed to upload photo:", error);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteIdx === null) return;
    const photo = fields[deleteIdx];
    if (!photo) {
      setDeleteIdx(null);
      return;
    }
    try {
      await deleteMutation.mutateAsync({ unitId, photoId: photo.id });
      remove(deleteIdx);
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
    setDeleteIdx(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Foto</h3>
        <div className="flex gap-4 items-end">
          <SelectField
            mode="simple"
            label="Kategori"
            value={KATEGORI_OPTIONS.find((o) => o.value === kategori)}
            onChange={(opt) =>
              setKategori((opt?.value ?? "EXTERIOR") as PdiPhoto["kategori"])
            }
            options={KATEGORI_OPTIONS}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            <UploadIcon className="size-4 mr-2" />
            Upload Foto
          </Button>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Belum ada foto yang diupload
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {fields.map((photo, idx) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={photo.url}
                  alt={`Foto ${photo.kategori}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setPreviewPhoto(photo)}
                />
              </div>
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">
                  {photo.kategori}
                </span>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => setPreviewPhoto(photo)}
                  className="p-1 bg-white rounded shadow hover:bg-gray-100"
                >
                  <EyeIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteIdx(idx)}
                  className="p-1 bg-white rounded shadow hover:bg-gray-100 text-destructive"
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AppModal
        isOpen={!!previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        title="Preview Foto"
        className="max-w-2xl"
      >
        {previewPhoto && (
          <div>
            <img
              src={previewPhoto.url}
              alt={previewPhoto.kategori}
              className="w-full rounded-lg"
            />
            <div className="mt-4 text-center">
              <span className="px-3 py-1 bg-muted rounded text-sm">
                {previewPhoto.kategori}
              </span>
            </div>
          </div>
        )}
      </AppModal>

      <AlertDialog
        open={deleteIdx !== null}
        onOpenChange={() => setDeleteIdx(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Hapus Foto</AlertDialogTitle>
          <p>Apakah Anda yakin ingin menghapus foto ini?</p>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Hapus
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
