import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, UserRoles, UserStatus } from "../data/app.constants";
import { IUser } from "../interfaces/user.interface";
import Auth from "../middleware/auth.middleware";
import { deleteUserLeaves } from "../services/leave.service";
import { sendAccountActivationMail, sendAccountCreatedMail } from "../services/mail.service";
import { uploadFileOnFirebase } from "../services/upload.service";
import { createUser, deleteUser, getSingleUser, getUsers, updateUser } from "../services/user.service";
import imageValidator from "../validators/image.validator";

const userController = Router();

userController.get(
  "/",
  Auth([UserRoles.ADMIN, UserRoles.HOD]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getUsers(req);
    res.status(HttpStatus.OK).json(response);
  })
);

userController.get(
  "/:id",
  Auth(),
  AsyncHandler(async (req: Request, res: Response) => {
    const user = await getSingleUser(req.params.id);
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, AppMessages.USER_NOT_EXIST);
    }
    res.status(HttpStatus.OK).json(user);
  })
);

userController.delete(
  "/:id",
  Auth([UserRoles.ADMIN, UserRoles.HOD]),
  AsyncHandler(async (req: Request, res: Response) => {
    const user = await deleteUser(req.params.id);
    await deleteUserLeaves(req.params.id);
    res.status(HttpStatus.OK).json(user);
  })
);

userController.post(
  "/",
  Auth([UserRoles.ADMIN, UserRoles.HOD]),
  imageValidator,
  AsyncHandler(async (req: Request, res: Response) => {
    let uploadedFileUrl = null;
    if (req.file) {
      uploadedFileUrl = await uploadFileOnFirebase(req.file as Express.Multer.File);
      if (!uploadedFileUrl) {
        throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_IMAGE);
      }
    }
    const user = await createUser({ ...req.body, status: UserStatus.ACTIVE, profileImage: uploadedFileUrl });
    await sendAccountCreatedMail({ ...user, password: req.body.password });
    res.status(HttpStatus.CREATED).json(user);
  })
);

userController.put(
  "/:id",
  Auth(),
  imageValidator,
  AsyncHandler(async (req: Request, res: Response) => {
    if (req.user.role !== UserRoles.ADMIN && req.user._id !== req.params.id) {
      throw new AppError(HttpStatus.FORBIDDEN, AppMessages.UNAUTHORIZED);
    }
    if (req.file) {
      const uploadedFileUrl = await uploadFileOnFirebase(req.file as Express.Multer.File);
      if (!uploadedFileUrl) {
        throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_IMAGE);
      }
      req.body.profileImage = uploadedFileUrl;
    }
    const response = await updateUser(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

userController.post(
  "/:id/activate",
  Auth([UserRoles.ADMIN, UserRoles.HOD]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateUser(req.params.id, { status: UserStatus.ACTIVE } as IUser, true);
    await sendAccountActivationMail(response);
    res.status(HttpStatus.OK).json(response);
  })
);

userController.post(
  "/:id/deactivate",
  Auth([UserRoles.ADMIN, UserRoles.HOD]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateUser(req.params.id, { status: UserStatus.INACTIVE } as IUser, true);
    res.status(HttpStatus.OK).json(response);
  })
);

export default userController;
