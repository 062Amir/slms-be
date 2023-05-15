import * as Joi from "joi";
import { AppMessages, LeaveStatus, UserRoles, UserStatus, ValidationKeys } from "../data/app.constants";

const schemas = {
  [ValidationKeys.NEW_USER]: Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    department: Joi.string().required(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid(UserRoles.HOD, UserRoles.STAFF).required(),
    profileImage: Joi.any(),
    status: Joi.string().valid(UserStatus.ACTIVE, UserStatus.INACTIVE),
  }),
  [ValidationKeys.UPDATE_USER]: Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    profileImage: Joi.any(),
  }),
  [ValidationKeys.UPDATE_USER_STATUS]: Joi.object({
    status: Joi.string().valid(UserStatus.ACTIVE, UserStatus.INACTIVE).required(),
  }),
  [ValidationKeys.LOGIN]: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
  [ValidationKeys.DEPARTMENT]: Joi.object({
    name: Joi.string().required(),
  }),
  [ValidationKeys.NEW_LEAVE]: Joi.object({
    fromDate: Joi.date()
      .required()
      .min(new Date(new Date().setUTCHours(0, 0, 0, 0)))
      .message(AppMessages.FROM_DATE_GREATER_THAN_TODAY),
    toDate: Joi.date().required().min(Joi.ref("fromDate")).message(AppMessages.FROM_DATE_GREATER_THAN_TO_DATE),
    reason: Joi.string().required(),
    status: Joi.string().valid(LeaveStatus.PENDING),
  }),
  [ValidationKeys.UPDATE_LEAVE]: Joi.object({
    fromDate: Joi.date().required().min(new Date()).message(AppMessages.FROM_DATE_GREATER_THAN_TODAY),
    toDate: Joi.date().required().min(Joi.ref("fromDate")).message(AppMessages.FROM_DATE_GREATER_THAN_TO_DATE),
    reason: Joi.string().required(),
  }),
  [ValidationKeys.UPDATE_LEAVE_STATUS]: Joi.object({
    status: Joi.string().valid(LeaveStatus.APPROVED, LeaveStatus.REJECTED).required(),
  }),
};

const validate = (key: `${ValidationKeys}`, reqBody: any): boolean | string => {
  const { error } = schemas[key].validate(reqBody);
  return error?.details[0].message || false;
};

export default validate;
