import { connect } from "mongoose";

export const dbConnect = async () => {
  try {
    await connect(process.env.MONGO_URI || "");
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error accrued while connecting to DB", error);
    process.exit(1);
  }
};
