import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { AppError } from "../classes/app-error.class";
import { AppMessages, HttpStatus, UserRoles } from "../data/app.constants";
import Auth from "../middleware/auth.middleware";
import { createDepartment, deleteDepartment, getDepartments, getSingleDepartment, updateDepartment } from "../services/department.service";

const departmentController = Router();

/*
  @desc: Get all departments
  @route: /departments
  @access: Public
  @role: Any
*/
departmentController.get(
  "/",
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getDepartments(req);
    res.status(HttpStatus.OK).json(response);
  })
);

/*
  @desc: Get single department
  @route: /departments/:id
  @access: Private
  @role: Any
*/
departmentController.get(
  "/:id",
  AsyncHandler(async (req: Request, res: Response) => {
    const department = await getSingleDepartment(req.params.id);
    if (!department) {
      throw new AppError(HttpStatus.NOT_FOUND, AppMessages.DEPARTMENT_NOT_EXIST);
    }
    res.status(HttpStatus.OK).json(department);
  })
);

departmentController.post(
  "/",
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const department = await createDepartment(req.body);
    res.status(HttpStatus.CREATED).json(department);
  })
);

departmentController.put(
  "/:id",
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateDepartment(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

departmentController.delete(
  "/:id",
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await deleteDepartment(req.params.id);
    res.status(HttpStatus.OK).json(response);
  })
);

export default departmentController;
