import { NextFunction, Request, Response } from "express";
import { AppMessages, HttpStatus } from "../data/app.constants";
import { camelToTitleCase } from "../services/util.service";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HttpStatus.NOT_FOUND);
  next(error);
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err?.code || HttpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message;

  // If Mongoose not found error, set to 404 and change message
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = HttpStatus.NOT_FOUND;
    message = AppMessages.NOT_FOUND;
  }

  if (err.code === 11000) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = `${camelToTitleCase(Object.keys(err.keyValue)[0])} already exists`;
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
