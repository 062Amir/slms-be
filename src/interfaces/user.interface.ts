import { UserRoles, UserStatus } from "../data/app.constants";
import { IDepartment } from "./department.interface";

export interface IUser {
  _id?: number | string;
  name: string;
  userName: string;
  email: string;
  contactNumber: string;
  department: IDepartment | null;
  password: string;
  role: UserRoles.ADMIN | UserRoles.HOD | UserRoles.STAFF;
  profileImage?: string;
  status?: `${UserStatus}`;
  createdAt: Date;
  updatedAt: Date;
}
