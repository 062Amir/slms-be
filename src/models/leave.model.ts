import mongoose, { Schema, model } from "mongoose";
import { LeaveStatus, SchemaNames } from "../data/app.constants";
import { ILeave } from "../interfaces/leave.interface";

const leaveSchema = new Schema<ILeave>(
  {
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, required: true, default: LeaveStatus.PENDING },
    user: { type: mongoose.Schema.Types.ObjectId, ref: SchemaNames.USER, required: true, default: LeaveStatus.PENDING },
    department: { type: mongoose.Schema.Types.ObjectId, ref: SchemaNames.DEPARTMENT, required: true },
  },
  {
    timestamps: true,
  }
);

const Leave = model<ILeave>(SchemaNames.LEAVE, leaveSchema);
export default Leave;
