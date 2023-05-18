import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, UserStatus } from "../data/app.constants";
import Auth from "../middleware/auth.middleware";
import { login, logout, resetPassVerifyEmail, updatePassword } from "../services/auth.service";
import { sendAccountRegisteredMail, sendResetPasswordMail } from "../services/mail.service";
import { uploadFileOnFirebase } from "../services/upload.service";
import { createUser } from "../services/user.service";
import imageValidator from "../validators/image.validator";

const authController = Router();

authController.post(
  "/register",
  imageValidator,
  AsyncHandler(async (req: Request, res: Response) => {
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
  })
);

authController.post(
  "/login",
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await login(req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

authController.post(
  "/logout",
  Auth(),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = logout(req);
    res.status(HttpStatus.OK).json(response);
  })
);

authController.post(
  "/verify-email",
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await resetPassVerifyEmail(req.body.email);
    await sendResetPasswordMail(response.user, response.link);
    res.status(HttpStatus.OK).json(response.link);
  })
);

authController.post(
  "/reset",
  AsyncHandler(async (req: Request, res: Response) => {
    const user = await updatePassword(req.body);
    res.status(HttpStatus.OK).json(user);
  })
);

export default authController;
