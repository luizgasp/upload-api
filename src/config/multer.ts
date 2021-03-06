import multer from "multer";
import path from "path";
import crypto from "crypto";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import { AppError } from "../shared/errors/AppError";

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.resolve(__dirname, "..", "..", "..", "tmp", "uploads"));
    },
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err, "");

        file.filename = `${hash.toString("hex")}-${file.originalname}`;

        callback(null, file.filename);
      })
    }
  }),
  s3: multerS3({
    s3: new aws.S3(),
    bucket: "vizion-bucket",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) callback(err, "");

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        callback(null, fileName);
      })
    }
  })
};

const multerConfig = {
  dest: path.resolve(__dirname, "..", "..", "..", "tmp", "uploads"),
  storage: storageTypes["s3"],
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new AppError("Invalid file type"));
    }
  }
}

export { multerConfig };