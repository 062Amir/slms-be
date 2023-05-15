import { Request, Response, Router } from "express";
import { HttpStatus, LeaveStatus, UserRoles } from "../data/app.constants";
import auth from "../middleware/auth.middleware";
import { createLeave, deleteLeave, getLeaves, getSingleLeave, updateLeave, updateLeaveStatus } from "../services/leave.service";

const leaveController = Router();

leaveController.get("/", auth([UserRoles.HOD, UserRoles.STAFF]), async (req: Request, res: Response) => {
  try {
    const response = await getLeaves(req);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

leaveController.post("/", auth([UserRoles.STAFF]), async (req: Request, res: Response) => {
  try {
    const leave = await createLeave(req);
    res.status(HttpStatus.CREATED).json(leave);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

leaveController.get("/:id", auth([UserRoles.HOD, UserRoles.STAFF]), async (req: Request, res: Response) => {
  try {
    const leave = await getSingleLeave(req.params.id);
    res.status(HttpStatus.OK).json(leave);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

leaveController.put("/:id", auth([UserRoles.STAFF]), async (req: Request, res: Response) => {
  try {
    const response = await updateLeave(req.params.id, req);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

leaveController.post("/:id/approve", auth([UserRoles.HOD]), async (req: Request, res: Response) => {
  try {
    const response = await updateLeaveStatus(req.params.id, LeaveStatus.APPROVED);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

leaveController.post("/:id/reject", auth([UserRoles.HOD]), async (req: Request, res: Response) => {
  try {
    const response = await updateLeaveStatus(req.params.id, LeaveStatus.REJECTED);
    res.status(HttpStatus.OK).json(response);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

leaveController.delete("/:id", auth([UserRoles.STAFF]), async (req: Request, res: Response) => {
  try {
    const leave = await deleteLeave(req.params.id);
    res.status(HttpStatus.OK).json(leave);
  } catch (error: any) {
    res.status(error?.code || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error?.message, error });
  }
});

export default leaveController;
