import multer from "multer";
import { AppDefaults, AppMessages, HttpStatus, ImageMimeType } from "../data/app.constants";
import { AppError } from "../classes/app-error.class";

const imageFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (!(ImageMimeType as any)[file.mimetype]) {
    return cb(new AppError(HttpStatus.BAD_REQUEST, AppMessages.ONLY_IMAGE_ALLOWED), false);
  }
  cb(undefined, true);
};

const imageValidator = multer({
  fileFilter: imageFilter,
  storage: multer.memoryStorage(),
  limits: {
    fileSize: AppDefaults.FILE_SIZE_LIMIT as number,
  },
}).single(AppDefaults.USER_PROFILE_FIELD_NAME);

export default imageValidator;
