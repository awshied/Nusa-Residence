import multer from "multer";
import { Request, Response, NextFunction } from "express";
import {
  ALLOWED_FILE_TYPES,
  isValidFileType,
  formatFileSize,
} from "../utils/pictureFile";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type UploadError = Error | multer.MulterError | null;

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (isValidFileType(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Tipe file tidak didukung. Gunakan: ${ALLOWED_FILE_TYPES.join(", ")}`,
      ),
    );
  }
};

const uploadFoto = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: fileFilter,
});

const handleUploadError = (
  err: UploadError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err.code, err.message);

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        sukses: false,
        pesan: `Ukuran file terlalu besar. Maksimal ${formatFileSize(MAX_FILE_SIZE)}.`,
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        sukses: false,
        pesan: "Hanya boleh upload 1 file.",
      });
    }

    return res.status(400).json({
      sukses: false,
      pesan: `Error upload: ${err.message}`,
    });
  }

  if (err) {
    console.error("Upload error:", err.message);
    return res.status(400).json({
      sukses: false,
      pesan: err.message || "Terjadi error saat upload file.",
    });
  }

  next();
};

export const handleMultipartForm = (
  fieldName: string,
  maxCount: number = 5,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    uploadFoto.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }

      console.log("📥 Body setelah multer:", req.body);
      console.log("📥 Files:", req.files ? (req.files as any).length : 0);

      if (req.body.amenities && typeof req.body.amenities === "string") {
        try {
          req.body.amenities = JSON.parse(req.body.amenities);
          console.log("✅ Amenities parsed to array:", req.body.amenities);
        } catch (e) {
          console.log("❌ Failed to parse amenities, keeping as string");
        }
      }

      next();
    });
  };
};

export const uploadSingleFile = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadFoto.single(fieldName)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }

      next();
    });
  };
};

export const uploadMultipleFiles = (
  fieldName: string,
  maxCount: number = 5,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadFoto.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }

      next();
    });
  };
};
