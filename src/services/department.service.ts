import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, QueryBuilderKeys, SortBy, ValidationKeys } from "../data/app.constants";
import { IDepartment } from "../interfaces/department.interface";
import Department from "../models/department.model";
import validate from "../validators/validation";
import { buildQuery } from "./util.service";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";

const getDepartments = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.DEPARTMENT_LIST, req, { sort: "name", sortBy: SortBy.ASC } as IQuery);

  const departments = await Department.find(query)
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit);

  const total = await Department.countDocuments(query);

  return {
    data: departments,
    total,
  };
};

const createDepartment = async (reqBody: IDepartment): Promise<IDepartment> => {
  // Validating department before saving into DB
  const errorMessage = validate(ValidationKeys.DEPARTMENT, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is department already exist with same name
  const departmentExist = await isDepartmentExistWithSame(reqBody.name);
  if (departmentExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DEPARTMENT_EXIST);
  }

  // Saving data in DB
  const department = new Department({
    name: reqBody.name || "",
  });
  return await department.save();
};

const getSingleDepartment = async (id: string): Promise<IDepartment | null> => {
  return await Department.findOne({ _id: id });
};

const updateDepartment = async (id: string, reqBody: IDepartment): Promise<any> => {
  // Validating department before saving into DB
  const errorMessage = validate(ValidationKeys.DEPARTMENT, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const department = await getSingleDepartment(id);
  if (!department) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DEPARTMENT_NOT_EXIST);
  }

  // Checking is department already exist with same name
  const departmentExist = await isDepartmentExistWithSame(reqBody.name);
  if (departmentExist && departmentExist._id.toString() !== id) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DEPARTMENT_EXIST);
  }

  return await Department.findByIdAndUpdate(id, reqBody, { new: true });
};

const deleteDepartment = async (id: string): Promise<any> => {
  const department = await getSingleDepartment(id);
  if (!department) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DEPARTMENT_NOT_EXIST);
  }

  await Department.deleteOne({ _id: id });
  return { _id: id };
};

const isDepartmentExistWithSame = (name: string) => {
  return Department.findOne({ name });
};

export { getDepartments, createDepartment, getSingleDepartment, updateDepartment, deleteDepartment };
