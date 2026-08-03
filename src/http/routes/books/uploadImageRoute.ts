import { uploadImageBookController } from '@/http/controller/books/uploadImageBook';
import { upload } from '@/utils/multer-config';
import { Router, type NextFunction, type Request, type Response } from 'express';

const uploadImageBookRouter = Router();

uploadImageBookRouter.post(
  '/:id/upload',
  upload.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    await uploadImageBookController(req, res, next);
  },
);

export { uploadImageBookRouter };
