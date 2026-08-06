import type { NextFunction, Request, Response } from 'express';
import cloudinary from 'cloudinary';
import { Readable } from 'stream';
import { makeUploadImageBookUseCase } from '@/use-cases/factories/make-upload-book-image-use-case';
import { AppError } from '@/utils/errors/appError';

export async function uploadImageBookController(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params as { id: string };
  const file = req.file as Express.Multer.File;

  try {
    if (!file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const uploadResult = await new Promise<{ path: string }>((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: 'books', public_id: `${id}-${Date.now()}-${file.originalname}` },
        (error, result) => {
          if (error) return reject(error);
          resolve({ path: result?.secure_url || '' });
        },
      );
      Readable.from(file.buffer).pipe(stream);
    });

    const uploadUseCase = makeUploadImageBookUseCase();
    await uploadUseCase.execute({ id, image: uploadResult });

    return res.status(200).json({ message: 'Upload concluído com sucesso.' });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(404).send({ message: error.message });
    }
    next(error);
  }
}
