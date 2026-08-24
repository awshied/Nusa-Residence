import path from "path";

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

export const isValidFileType = (
  mimetype: string,
): mimetype is AllowedFileType => {
  return ALLOWED_FILE_TYPES.includes(mimetype as AllowedFileType);
};

export const getFileExtension = (originalname: string): string => {
  return path.extname(originalname).slice(1).toLowerCase() || "jpg";
};

export const generateFileName = (
  userId: string,
  originalname: string,
): string => {
  const extension = getFileExtension(originalname);
  return `${userId}_${Date.now()}.${extension}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};
