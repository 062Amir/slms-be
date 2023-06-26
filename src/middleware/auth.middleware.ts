import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppMessages, HttpStatus, UserRoles, UserStatus } from "../data/app.constants";
import { AppError } from "../classes/app-error.class";
import { decodeBase64 } from "../services/util.service";
import { getItem } from "../services/cache.service";

const Auth = (roles?: `${UserRoles}`[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers && req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : "";
    try {
      const tokenInfo: any = jwt.verify(token, process.env.TOKEN_SECRET_KEY || "");
      // Checking token is exist in cache or not
      if (!getItem(tokenInfo.userId)) {
        throw new AppError(HttpStatus.UNAUTHORIZED, AppMessages.SESSION_EXPIRED);
      }
      const userInfo: any = getItem(tokenInfo.userId);
      req.user = userInfo.user;
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

export default Auth;
