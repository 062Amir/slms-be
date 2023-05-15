import { Request, Response, Router } from "express";
import { AppMessages, HttpStatus, UserRoles } from "../data/app.constants";
import { createDepartment, deleteDepartment, getDepartments, getSingleDepartment, updateDepartment } from "../services/department.service";
import auth from "../middleware/auth.middleware";
import { AppError } from "../classes/app-error.class";

const departmentController = Router();

/*
  @desc: Get all departments
  @route: /departments
  @access: Public
  @role: Any
*/
departmentController.get("/", async (req: Request, res: Response) => {
  try {
    const response = await getDepartments(req);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

/*
  @desc: Get single department
  @route: /departments/:id
  @access: Private
  @role: Any
*/
departmentController.get("/:id", async (req: Request, res: Response) => {
  try {
    const department = await getSingleDepartment(req.params.id);
    if (!department) {
      throw new AppError(HttpStatus.NOT_FOUND, AppMessages.DEPARTMENT_NOT_EXIST);
    }
    res.status(HttpStatus.OK).json(department);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

departmentController.post("/", auth([UserRoles.ADMIN]), async (req: Request, res: Response) => {
  try {
    const department = await createDepartment(req.body);
    res.status(HttpStatus.CREATED).json(department);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

departmentController.put("/:id", auth([UserRoles.ADMIN]), async (req: Request, res: Response) => {
  try {
    const response = await updateDepartment(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

departmentController.delete("/:id", auth([UserRoles.ADMIN]), async (req: Request, res: Response) => {
  try {
    const response = await deleteDepartment(req.params.id);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

export default departmentController;
