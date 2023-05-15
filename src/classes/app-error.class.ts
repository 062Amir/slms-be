import { AppMessages } from "../data/app.constants";

export class AppError extends Error {
  code: number;
  message: string;
  constructor(statusCode: number, msg: any = null) {
    msg = msg || AppMessages.DEFAULT_ERROR;
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);

    this.code = statusCode;
    this.message = msg;
  }
}
