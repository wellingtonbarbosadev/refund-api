import upload from "@/configs/upload.js";
import { DiskStorage } from "@/utils/disk-storage.js";
import type { Request, Response } from "express";
import path from "path";
import z from "zod";
import { ZodError } from "zod";

class UploadsController {
  async upload(request: Request, response: Response) {
    const diskStorage = new DiskStorage();

    const fileSchema = z
      .object({
        filename: z.string().min(1, "Arquivo obrigatório"),
        mimetype: z
          .string()
          .refine(
            (type) => upload.ACCEPTED_FILE_TYPES.includes(type),
            "Tipo de arquivo não aceito. Arquivos aceitos: " +
              upload.ACCEPTED_FILE_TYPES.join(", "),
          ),
        size: z
          .number()
          .positive()
          .refine(
            (size) => size <= upload.MAX_FILE_SIZE,
            `Tamanho máximo excedido. Tamanho máximo: ${upload.MAX_SIZE}MB`,
          ),
      })
      .loose();

    if (!request.file) {
      return response.status(400).json({
        message: "No file uploaded",
      });
    }

    try {
      const file = fileSchema.parse(request.file);

      const filename = await diskStorage.saveFile(file.filename);

      return response.status(201).json({
        message: "Upload successful",
        filename,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename, "tmp");
        }
      }
      throw error;
    }
  }
}

export { UploadsController };
