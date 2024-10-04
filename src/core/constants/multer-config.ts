import multer, { memoryStorage } from "multer";

export const multerConfig = multer({
    storage: memoryStorage()
} as const);