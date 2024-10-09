import { DeleteObjectCommand, DeleteObjectCommandInput, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { HttpError } from "../utilities/http-error.class";

const bucket: string = process.env.S3_BUCKET_NAME!

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACC_KEY!,
        secretAccessKey: process.env.S3_SECRET_ACC_KEY!
    },
    region: process.env.S3_BUCKET_REGION!
});


export const saveFile = async (file: Express.Multer.File, checkMime?: string): Promise<string | undefined> => {
    if (checkMime && !file.mimetype.startsWith(checkMime)) {
        throw new HttpError(400, "Please, provide a proper video source.");
    }

    const sourceCommand: PutObjectCommandInput = {
        Bucket: bucket,
        Key: randomUUID() + "_" + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    }

    const command: PutObjectCommand = new PutObjectCommand(sourceCommand);

    //await s3Client.send(command);
    return sourceCommand.Key;
}

export const deleteFile = async (fileName: string) => {
    const sourceCommand: DeleteObjectCommandInput = {
        Bucket: bucket,
        Key: fileName
    }

    const command: DeleteObjectCommand = new DeleteObjectCommand(sourceCommand);

    await s3Client.send(command);
}