import * as bcrypt from "bcryptjs";
import { AppDefaults, QueryBuilderKeys, UserRoles } from "../data/app.constants";
import { SortOrder } from "mongoose";
import { IBuildQuery, IQuery } from "../interfaces/query.interface";
import { Request } from "express";

const bcryptValue = async (value: any): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(value, salt);
};

const compareBcryptValue = async (value: any, hashedValue: any): Promise<boolean> => {
  return await bcrypt.compare(value, hashedValue);
};

const encodeBase64 = (value: any) => {
  return Buffer.from(JSON.stringify(value)).toString("base64");
};

const decodeBase64 = (value: any) => {
  return JSON.parse(Buffer.from(value, "base64").toString("ascii"));
};

const buildQuery = (queryBuilderKey: `${QueryBuilderKeys}`, req: Request, defaultValues?: IQuery): IBuildQuery => {
  const queryParams: IQuery = {
    page: parseInt(req.query.page as string) - 1 || defaultValues?.page || 0,
    limit: parseInt(req.query.limit as string) || defaultValues?.limit || 0,
    sort: (req.query.sort || defaultValues?.sort || AppDefaults.SORT) as string,
    sortBy: (req.query.sortBy || req.query.orderBy || defaultValues?.sortBy || AppDefaults.SORT_BY) as SortOrder,
  };

  let query: any = {};

  switch (queryBuilderKey) {
    case QueryBuilderKeys.DEPARTMENT_LIST:
      query = {
        $or: [{ name: { $regex: req.query.q || "", $options: "i" } }],
      };
      return { query, queryParams };

    case QueryBuilderKeys.USER_LIST:
      query = {
        $and: [
          {
            $or: [
              { name: { $regex: req.query.q || "", $options: "i" } },
              { email: { $regex: req.query.q || "", $options: "i" } },
              { userName: { $regex: req.query.q || "", $options: "i" } },
              { contactNumber: { $regex: req.query.q || "", $options: "i" } },
            ],
          },
        ],
      };
      if (req.query.department) {
        query.$and.push({ department: { $eq: req.query.department } });
      }
      if (req.query.status) {
        query.$and.push({ status: { $eq: req.query.status } });
      }
      if (req.user.role === UserRoles.ADMIN) {
        query.$and.push({ role: { $eq: UserRoles.HOD } });
      }
      if (req.user.role === UserRoles.HOD) {
        query.$and.push({ role: { $eq: UserRoles.STAFF } });
      }
      return { query, queryParams };
    case QueryBuilderKeys.LEAVE_LIST:
      query = {
        $and: [
          {
            $or: [{ reason: { $regex: req.query.q || "", $options: "i" } }],
          },
        ],
      };
      if (req.query.fromDate && req.query.toDate) {
        const date = {
          fromDate: req.query.fromDate.toString().split("T")[0],
          toDate: req.query.toDate.toString().split("T")[0],
        };
        query.$and.push({ fromDate: { $gte: new Date(date.fromDate) } });
        query.$and.push({ toDate: { $lte: new Date(date.toDate) } });
      }
      if (req.query.status) {
        query.$and.push({ status: { $eq: req.query.status } });
      }
      if (req.user.role === UserRoles.HOD && req.user.department?._id) {
        query.$and.push({ department: { $eq: req.user.department._id } });
      }
      if (req.user.role === UserRoles.STAFF) {
        query.$and.push({ user: { $eq: req.user._id } });
      }
      return { query, queryParams };

    default:
      return { query, queryParams };
  }
};

export { bcryptValue, compareBcryptValue, encodeBase64, decodeBase64, buildQuery };
