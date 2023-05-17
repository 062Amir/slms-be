import { Router } from "express";
import authController from "../controllers/auth.controller";
import departmentController from "../controllers/department.controller";
import userController from "../controllers/user.controller";
import leaveController from "../controllers/leave.controller";
import Auth from "../middleware/auth.middleware";

const routes = Router();

routes.use("/auth", authController);
routes.use("/departments", departmentController);
routes.use("/users", Auth(), userController);
routes.use("/leaves", Auth(), leaveController);

export default routes;
