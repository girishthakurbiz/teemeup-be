import multerS3 from "multer-s3";
import multer from "multer";
import fs from "fs";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const bucketName: string = process.env.AWS_BUCKET_NAME!;
export const brandImageCollectionFolder: string = process.env.AWS_BRAND_IMAGES!;

export const checkValidImageExtension = (file: any) => {
  let fileArray = ["image/jpeg", "image/jpg", "image/png"];
  if (file.fieldname === "photo")
    fileArray = ["image/jpeg", "image/jpg", "image/png"];
  if (file && fileArray.includes(file.mimetype)) return true;
  return false;
};

export const uploadDesignFileToS3 = (foldername: string) =>
  multer({
    storage: multerS3({
      s3: s3Client,
      bucket: bucketName,
      key: async (req, file, cb) => {
        let url = `${foldername}/${file.fieldname}_${Date.now().toString()}.${
          file.originalname.split(".")[1]
        }`;
        return cb(null, url);
      },
    }),
    async fileFilter(req: any, file, cb) {
      // todo : check  image exist
      if (!checkValidImageExtension(file))
        return cb(
          new Error(
            "Please upload a photo of valid extension of jpg or jpeg or png format only."
          )
        );
      return cb(null, true);
    },
  });

export const uploadTDesignFileToS3 = (foldername: string) =>
  multer({
    storage: multerS3({
      s3: s3Client,
      bucket: bucketName,
      key: async (req, file, cb) => {
        let url = `${foldername}/${file.fieldname}_${Date.now().toString()}.${
          file.originalname.split(".")[1]
        }`;
        return cb(null, url);
      },
    }),
    async fileFilter(req: any, file, cb) {
      // todo : check  image exist
      if (!checkValidImageExtension(file))
        return cb(
          new Error(
            "Please upload a photo of valid extension of jpg or jpeg or png format only."
          )
        );
      return cb(null, true);
    },
  });

export async function uploadFileToS3(cloudPath: string, filepath: string) {
  const fileContent = fs.createReadStream(filepath);
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: cloudPath,
    Body: fileContent,
  });

  try {
    await s3Client.send(putObjectCommand);
    console.log("File uploaded successfully");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPreSignedUrl(filepath: string): Promise<string> {
  const params = {
    Bucket: bucketName,
    Key: filepath,
  };
  const command = new GetObjectCommand(params);

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 24 * 60 * 60,
    });
    return signedUrl;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw error;
  }
}
