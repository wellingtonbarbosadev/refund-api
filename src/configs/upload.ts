import multer from "multer";
import path from "path";
import crypto from "crypto";

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MAX_SIZE = 3; // 3MB
const MAX_FILE_SIZE = 1024 * 1024 * MAX_SIZE;
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    },
  }),
};

export default {
  MULTER,
  UPLOAD_FOLDER,
  TMP_FOLDER,
  MAX_SIZE,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
};
