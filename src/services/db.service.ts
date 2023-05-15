import { connect } from "mongoose";

export const dbConnect = () => {
  connect(process.env.MONGO_URI || "")
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((error) => {
      console.log("Error accrued while connecting to DB", error);
    });
};
