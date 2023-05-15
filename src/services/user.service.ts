import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, PopulateKeys, QueryBuilderKeys, UserRoles, UserStatus, ValidationKeys } from "../data/app.constants";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { getSingleDepartment } from "./department.service";
import { bcryptValue, buildQuery } from "./util.service";
import { IListResponse } from "../interfaces/response.interface";

const getUsers = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.USER_LIST, req);

  let users = await User.find(query)
    .populate(PopulateKeys.DEPARTMENT)
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit);

  const total = await User.countDocuments(query);
  // TODO: Need to check is api returning password
  return {
    data: users,
    total,
  };
};

const createUser = async (reqBody: IUser): Promise<IUser> => {
  // Validating user before saving into DB
  const errorMessage = validate(ValidationKeys.NEW_USER, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is user already exist
  const existUser = await User.findOne({
    $or: [{ email: reqBody.email }, { userName: reqBody.userName }, { contactNumber: reqBody.contactNumber }],
  });
  if (existUser) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.USER_ALREADY_EXISTS);
  }

  // Hashing Password before saving into DB
  const hashedPassword = await bcryptValue(reqBody.password);

  // Saving data in DB
  const user = new User({
    name: reqBody.name || "",
    userName: reqBody.userName || "",
    email: reqBody.email || "",
    contactNumber: reqBody.contactNumber || "",
    department: reqBody.department || "",
    password: hashedPassword || "",
    role: reqBody.role || "",
    profileImage: reqBody.profileImage || null,
    status: reqBody.status || UserStatus.INACTIVE,
  });
  const savedUser: any = await user.save();
  return { ...savedUser.toJSON(), password: "", department: await getSingleDepartment(savedUser.department as string) };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ _id: id }).populate(PopulateKeys.DEPARTMENT);
};

const updateUser = async (id: string, reqBody: IUser, updateStatus?: boolean): Promise<any> => {
  // Validating user before saving into DB
  const errorMessage = validate(updateStatus ? ValidationKeys.UPDATE_USER_STATUS : ValidationKeys.UPDATE_USER, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const user = await getSingleUser(id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, AppMessages.USER_NOT_EXIST);
  }

  return await User.findByIdAndUpdate(id, reqBody).populate(PopulateKeys.DEPARTMENT);
};

const deleteUser = async (id: string): Promise<any> => {
  const department = await getSingleUser(id);
  if (!department) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.USER_NOT_EXIST);
  }

  await User.deleteOne({ _id: id });
  return { _id: id };
};

export { createUser, getUsers, getSingleUser, updateUser, deleteUser };
