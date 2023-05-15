import { Request, Response, Router } from "express";
import { AppMessages, HttpStatus, UserStatus } from "../data/app.constants";
import { createUser } from "../services/user.service";
import { login, resetPassVerifyEmail, updatePassword } from "../services/auth.service";
import { uploadFileOnFirebase } from "../services/upload.service";
import imageValidator from "../validators/image.validator";
import { AppError } from "../classes/app-error.class";
import { sendAccountRegisteredMail, sendResetPasswordMail } from "../services/mail.service";

const authController = Router();

authController.post("/register", imageValidator, async (req: Request, res: Response) => {
  try {
    // TODO: File error to be handle
    let uploadedFileUrl = null;
    if (req.file) {
      uploadedFileUrl = await uploadFileOnFirebase(req.file as Express.Multer.File);
      if (!uploadedFileUrl) {
        throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_IMAGE);
      }
    }
    const user = await createUser({ ...req.body, status: UserStatus.INACTIVE, profileImage: uploadedFileUrl });
    await sendAccountRegisteredMail(user);
    res.status(HttpStatus.OK).json(user);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

authController.post("/login", async (req: Request, res: Response) => {
  try {
    const response = await login(req.body);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

authController.post("/verify-email", async (req: Request, res: Response) => {
  try {
    const response = await resetPassVerifyEmail(req.body.email);
    await sendResetPasswordMail(response.user, response.link);
    res.status(HttpStatus.OK).json({ link: response.link });
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

authController.post("/reset", async (req: Request, res: Response) => {
  try {
    const user = await updatePassword(req.body);
    res.status(HttpStatus.OK).json(user);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

export default authController;
