import upload from "@/configs/upload.js";
import type { Request, Response } from "express";
import z from "zod";

class UploadsController {
  async upload(request: Request, response: Response) {
    const fileSchema = z.object({
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
    });

    const file = fileSchema.parse(request.file);

    return response.status(201).json({
      message: "Upload successful",
      file,
    });
  }
}

export { UploadsController };
