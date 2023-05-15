import mongoose, { Schema, model } from "mongoose";
import { AppDefaults, SchemaNames } from "../data/app.constants";
import { IResetToken } from "../interfaces/reset.interface";

const resetTokenSchema = new Schema<IResetToken>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: SchemaNames.USER,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: AppDefaults.RESET_TOKEN_EXPIRY,
  },
});

const ResetToken = model<IResetToken>(SchemaNames.RESET_TOKEN, resetTokenSchema);
export default ResetToken;
