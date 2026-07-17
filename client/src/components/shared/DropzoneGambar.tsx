import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  files: File[];
  setFiles: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
}

const DropzoneGambar = ({
  files,
  setFiles,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
}: Props) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => file.size <= maxSize);
      const invalidFiles = acceptedFiles.filter((file) => file.size > maxSize);

      if (invalidFiles.length > 0) {
        alert(
          `File ${invalidFiles.map((f) => f.name).join(", ")} melebihi batas ukuran 5MB.`,
        );
      }

      const remainingSlots = maxFiles - files.length;
      const filesToAdd = validFiles.slice(0, remainingSlots);

      if (filesToAdd.length < validFiles.length) {
        alert(`Maksimal ${maxFiles} gambar yang dapat diupload.`);
      }

      const newFiles = [...files, ...filesToAdd];
      setFiles(newFiles);

      // Buat preview
      const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [files, maxFiles, maxSize, setFiles],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxFiles: maxFiles - files.length,
    maxSize: maxSize,
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const reorderFiles = (fromIndex: number, toIndex: number) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);

    const newPreviews = [...previews];
    const [movedPreview] = newPreviews.splice(fromIndex, 1);
    newPreviews.splice(toIndex, 0, movedPreview);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary/50"
        } ${files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">📷</span>
          {isDragActive ? (
            <p className="text-primary font-semibold">
              Lepaskan gambar di sini...
            </p>
          ) : (
            <>
              <p className="font-semibold">Seret & Lepas Gambar</p>
              <p className="text-sm text-gray-500">
                atau klik untuk memilih file
              </p>
              <p className="text-xs text-gray-400">
                Maksimal {maxFiles} gambar • Format: JPG, PNG, WEBP, GIF • Maks
                5MB
              </p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">
              {files.length} dari {maxFiles} gambar dipilih
            </p>
            <button
              type="button"
              className="btn btn-ghost btn-xs text-error"
              onClick={() => {
                setFiles([]);
                previews.forEach((preview) => URL.revokeObjectURL(preview));
                setPreviews([]);
              }}
            >
              Hapus Semua
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative group aspect-square"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", index.toString());
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const fromIndex = parseInt(
                    e.dataTransfer.getData("text/plain"),
                  );
                  const toIndex = index;
                  if (fromIndex !== toIndex) {
                    reorderFiles(fromIndex, toIndex);
                  }
                }}
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border-2 border-base-200"
                />

                <div className="absolute top-1 left-1 bg-base-100/80 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>

                <button
                  type="button"
                  className="absolute top-1 right-1 btn btn-xs btn-circle btn-ghost bg-base-100/80 hover:bg-error hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  ✕
                </button>

                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-base-100/80 px-2 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  ⋮⋮⋮
                </div>
              </div>
            ))}

            {files.length < maxFiles && (
              <div
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary/50 cursor-pointer transition-colors"
                onClick={open}
              >
                <span className="text-2xl text-gray-400">+</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400">
            💡 Seret gambar untuk mengubah urutan (gambar pertama akan menjadi
            utama)
          </p>
        </div>
      )}
    </div>
  );
};

export default DropzoneGambar;
