import { Response, NextFunction } from "express";
import { AuthRequest } from "./authenticate";

const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Not Authenticated" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res
        .status(401)
        .json({ message: "Access denied. You do not have the permission " });
      return;
    }
    next();
  };
};

export default authorize;
