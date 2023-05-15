import { Request } from "express";
import { AppMessages, HttpStatus, LeaveStatus, PopulateKeys, QueryBuilderKeys, ValidationKeys } from "../data/app.constants";
import { IListResponse } from "../interfaces/response.interface";
import { buildQuery } from "./util.service";
import Leave from "../models/leave.model";
import { ILeave } from "../interfaces/leave.interface";
import validate from "../validators/validation";
import { AppError } from "../classes/app-error.class";

const getLeaves = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.LEAVE_LIST, req);

  let leaves = await Leave.find(query)
    .populate({
      path: PopulateKeys.USER,
      select: "name _id",
    })
    .populate(PopulateKeys.DEPARTMENT)
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit);

  const total = await Leave.countDocuments(query);

  return {
    data: leaves,
    total,
  };
};

const createLeave = async (req: Request): Promise<ILeave> => {
  const reqBody: ILeave = req.body;
  // Validating leave before saving into DB
  const errorMessage = validate(ValidationKeys.NEW_LEAVE, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is leave already exist within date range
  const leaveExistInRange = await isLeaveExistInDateRange(req);
  if (leaveExistInRange) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.LEAVE_EXIST_IN_RANGE);
  }

  // Saving data in DB
  const leave = new Leave({
    fromDate: reqBody.fromDate || "",
    toDate: reqBody.toDate || "",
    reason: reqBody.reason || "",
    user: req.user._id,
    department: req.user.department?._id,
  });
  const savedLeave = await leave.save();
  return { ...savedLeave.toJSON(), user: req.user };
};

const getSingleLeave = async (id: string): Promise<ILeave | null> => {
  return await Leave.findOne({ _id: id })
    .populate({
      path: PopulateKeys.USER,
      select: "name _id",
    })
    .populate(PopulateKeys.DEPARTMENT);
};

const updateLeave = async (id: string, req: Request): Promise<any> => {
  // Validating leave before saving into DB
  const errorMessage = validate(ValidationKeys.UPDATE_LEAVE, req.body);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const leave = await getSingleLeave(id);
  if (!leave) {
    throw new AppError(HttpStatus.NOT_FOUND, AppMessages.LEAVE_NOT_EXIST);
  }

  if (leave.status === LeaveStatus.APPROVED || leave.status === LeaveStatus.REJECTED) {
    const msg = `${AppMessages.CAN_NOT_UPDATE_LEAVE} ${leave.status.toLowerCase()}`;
    throw new AppError(HttpStatus.BAD_REQUEST, msg);
  }

  // Checking is leave already exist within date range
  const leaveExistInRange = await isLeaveExistInDateRange(req);
  if (leaveExistInRange && leaveExistInRange._id.toString() !== id) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.LEAVE_EXIST_IN_RANGE);
  }

  return await Leave.findByIdAndUpdate(id, req.body).populate(PopulateKeys.USER).populate(PopulateKeys.DEPARTMENT);
};

const updateLeaveStatus = async (id: string, status: `${LeaveStatus}`): Promise<any> => {
  // Validating leave before saving into DB
  const errorMessage = validate(ValidationKeys.UPDATE_LEAVE_STATUS, { status });
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const leave = await getSingleLeave(id);
  if (!leave) {
    throw new AppError(HttpStatus.NOT_FOUND, AppMessages.LEAVE_NOT_EXIST);
  }

  return await Leave.findByIdAndUpdate(id, { status }).populate(PopulateKeys.USER).populate(PopulateKeys.DEPARTMENT);
};

const deleteLeave = async (id: string): Promise<any> => {
  const leave = await getSingleLeave(id);
  if (!leave) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.LEAVE_NOT_EXIST);
  }

  if (leave.status === LeaveStatus.APPROVED || leave.status === LeaveStatus.REJECTED) {
    const msg = `${AppMessages.CAN_NOT_DELETE_LEAVE} ${leave.status.toLowerCase()}`;
    throw new AppError(HttpStatus.BAD_REQUEST, msg);
  }

  await Leave.deleteOne({ _id: id });
  return { _id: id };
};

const deleteUserLeaves = async (userId: string) => {
  return await Leave.deleteMany({ user: userId });
};

const isLeaveExistInDateRange = async (req: Request) => {
  return await Leave.findOne({
    $and: [
      {
        fromDate: { $lte: new Date(req.body.toDate) },
        toDate: { $gte: new Date(req.body.fromDate) },
        user: { $eq: req.user._id },
      },
    ],
  });
};

export { getLeaves, createLeave, getSingleLeave, updateLeave, updateLeaveStatus, deleteLeave, deleteUserLeaves };
