import fs from "fs";
import path from "path";

import uploadConfig from "@/configs/upload.js";

class DiskStorage {
  async saveFile(file: string) {
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file);
    const targetPath = path.resolve(uploadConfig.UPLOAD_FOLDER, file);

    try {
      await fs.promises.access(tmpPath);
    } catch (error) {
      throw new Error(`Failed to save file: ${uploadConfig.TMP_FOLDER}`);
    }

    await fs.promises.mkdir(uploadConfig.UPLOAD_FOLDER, { recursive: true });
    await fs.promises.rename(tmpPath, targetPath);

    return file;
  }

  async deleteFile(file: string, type?: "tmp" | "upload") {
    const typePath =
      type === "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOAD_FOLDER;

    const filePath = path.resolve(typePath, file);

    try {
      await fs.promises.access(filePath);
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.log(`Failed to delete file: ${filePath}`);
      throw error;
    }
  }
}

export { DiskStorage };
