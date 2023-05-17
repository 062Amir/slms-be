import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { HttpStatus, LeaveStatus, UserRoles } from "../data/app.constants";
import Auth from "../middleware/auth.middleware";
import { createLeave, deleteLeave, getLeaves, getSingleLeave, updateLeave, updateLeaveStatus } from "../services/leave.service";

const leaveController = Router();

leaveController.get(
  "/",
  Auth([UserRoles.HOD, UserRoles.STAFF]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getLeaves(req);
    res.status(HttpStatus.OK).json(response);
  })
);

leaveController.post(
  "/",
  Auth([UserRoles.STAFF]),
  AsyncHandler(async (req: Request, res: Response) => {
    const leave = await createLeave(req);
    res.status(HttpStatus.CREATED).json(leave);
  })
);

leaveController.get(
  "/:id",
  Auth([UserRoles.HOD, UserRoles.STAFF]),
  AsyncHandler(async (req: Request, res: Response) => {
    const leave = await getSingleLeave(req.params.id);
    res.status(HttpStatus.OK).json(leave);
  })
);

leaveController.put(
  "/:id",
  Auth([UserRoles.STAFF]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateLeave(req.params.id, req);
    res.status(HttpStatus.OK).json(response);
  })
);

leaveController.post(
  "/:id/approve",
  Auth([UserRoles.HOD]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateLeaveStatus(req.params.id, LeaveStatus.APPROVED);
    res.status(HttpStatus.OK).json(response);
  })
);

leaveController.post(
  "/:id/reject",
  Auth([UserRoles.HOD]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateLeaveStatus(req.params.id, LeaveStatus.REJECTED);
    res.status(HttpStatus.OK).json(response);
  })
);

leaveController.delete(
  "/:id",
  Auth([UserRoles.STAFF]),
  AsyncHandler(async (req: Request, res: Response) => {
    const leave = await deleteLeave(req.params.id);
    res.status(HttpStatus.OK).json(leave);
  })
);

export default leaveController;
