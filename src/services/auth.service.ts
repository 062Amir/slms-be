import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import { AppDefaults, AppMessages, HttpStatus, PopulateKeys, UserStatus, ValidationKeys } from "../data/app.constants";
import { ILoginCredentials } from "../interfaces/login-credentials.interface";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { compareBcryptValue, encodeBase64 } from "./util.service";
import * as jwt from "jsonwebtoken";
import ResetToken from "../models/reset-token.model";
import { bcryptValue } from "./util.service";
import { IUpdatePassword } from "../interfaces/reset.interface";
import { removeItem, setItem } from "./cache.service";

interface ILoginResponse {
  token: string;
  user: IUser | string;
}

const login = async (reqBody: ILoginCredentials): Promise<ILoginResponse> => {
  // Validating user before saving into DB
  const errorMessage = validate(ValidationKeys.LOGIN, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is user already exist
  let user: any = await User.findOne({
    $or: [{ email: reqBody.userName }, { userName: reqBody.userName }, { contactNumber: reqBody.userName }],
  }).populate(PopulateKeys.DEPARTMENT);
  if (!user || !(await compareBcryptValue(reqBody.password, user.password))) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_CREDENTIALS);
  }

  // Checking is account active
  if (user.status === UserStatus.INACTIVE) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ACCOUNT_INACTIVE);
  }

  user = { ...user.toJSON(), password: undefined };
  const encryptedUser = encodeBase64(encodeBase64(user));

  // Creating token
  const token = jwt.sign({ user: encryptedUser }, process.env.TOKEN_SECRET_KEY || "", { expiresIn: "1d" });
  setItem(token, user._id, AppDefaults.ONE_DAY_IN_MILLISECONDS);
  return { token, user };
};

const resetPassVerifyEmail = async (email: string): Promise<{ user: IUser; link: string }> => {
  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.USER_NOT_EXIST);
  }
  let token = await ResetToken.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  const resetToken = encodeBase64(encodeBase64(`${user._id}${new Date().getTime()}`));
  const hashToken = await bcryptValue(resetToken);

  await new ResetToken({
    userId: user._id,
    token: hashToken,
    createdAt: Date.now(),
  }).save();

  return {
    user,
    link: `${process.env.FRONT_END_URL}reset?token=${resetToken}&id=${user._id}`,
  };
};

const updatePassword = async (reqBody: IUpdatePassword) => {
  let passwordResetToken = await ResetToken.findOne({ userId: reqBody.userId });
  if (!passwordResetToken || !(await compareBcryptValue(reqBody.token, passwordResetToken.token))) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_OR_EXPIRE_TOKEN);
  }

  const hashedPassword = await bcryptValue(reqBody.password);
  await User.findByIdAndUpdate(reqBody.userId, { password: hashedPassword });
  const user: any = await User.findById({ _id: reqBody.userId }).select("-password");
  await passwordResetToken.deleteOne();
  return user;
};

const logout = (req: Request) => {
  const token = req.headers && req.headers.authorization ? req.headers.authorization.split("Bearer ")[1] : "";
  if (token) {
    // Removing token from cache
    removeItem(token);
  }
  return true;
};

export { login, resetPassVerifyEmail, updatePassword, logout };
