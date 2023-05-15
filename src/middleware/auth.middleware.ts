import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppMessages, HttpStatus, UserRoles, UserStatus } from "../data/app.constants";
import { AppError } from "../classes/app-error.class";
import { decodeBase64 } from "../services/util.service";

const auth = (roles?: `${UserRoles}`[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers && req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : "";
      const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET_KEY || "");
      req.user = decodeBase64(decodeBase64(decodedToken.user));
      if (req.user.status !== UserStatus.ACTIVE) {
        throw new AppError(HttpStatus.UNAUTHORIZED, AppMessages.ACCOUNT_INACTIVE);
      }
      if (roles?.length && !roles.includes(req.user.role)) {
        throw new AppError(HttpStatus.FORBIDDEN, AppMessages.UNAUTHORIZED);
      }
      next();
    } catch (error: any) {
      res.status(error?.code || HttpStatus.UNAUTHORIZED).json({ message: error?.message || AppMessages.SESSION_EXPIRED, error });
    }
  };
};

export default auth;
