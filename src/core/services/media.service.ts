import { randomUUID } from "crypto";
import { diskStorage, StorageEngine } from "multer";
import { extname } from "path";

const storage: StorageEngine = diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, randomUUID + "_" + extname(file.originalname));
    }
});

export const uploadVideo = (source: Express.Multer.File) => {

}