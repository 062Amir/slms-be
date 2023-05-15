import { LeaveStatus } from "../data/app.constants";
import { IDepartment } from "./department.interface";
import { IUser } from "./user.interface";

export interface ILeave {
  _id: string;
  fromDate: Date | string;
  toDate: Date | string;
  reason: string;
  status: `${LeaveStatus}`;
  user: IUser | string | null;
  department: IDepartment | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
