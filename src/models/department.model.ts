import { Schema, model } from "mongoose";
import { SchemaNames } from "../data/app.constants";
import { IDepartment } from "../interfaces/department.interface";

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Department = model<IDepartment>(SchemaNames.DEPARTMENT, departmentSchema);
export default Department;
