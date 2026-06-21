import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary-v2";
import cloudinary from "../configs/cloudinary";

const allowedFile = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxFileSize = 5 * 1024 * 1024;

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (allowedFile.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Tipe file tidak didukung. Gunakan JPEG, PNG, WEBP, atau GIF."),
    );
  }
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary as any,
  params: async (req: any, file: Express.Multer.File) => {
    const userId = req.user?.id || "anonymous";
    const timestamp = Date.now();

    return {
      folder: "nusa-residence/profil",
      format: "webp",
      public_id: `${userId}_${timestamp}`,
      transformation: [
        { width: 400, height: 400, crop: "limit" },
        { quality: "auto" },
      ],
    };
  },
});

export const uploadFotoProfil = multer({
  storage: storage,
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: fileFilter,
});

export function handleUploadError(err: any, req: any, res: any, next: any) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        sukses: false,
        pesan: "Ukuran file terlalu besar. Maksimal 5MB.",
      });
    }
    return res.status(400).json({
      sukses: false,
      pesan: `Error upload: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      sukses: false,
      pesan: err.message,
    });
  }
  next();
}
