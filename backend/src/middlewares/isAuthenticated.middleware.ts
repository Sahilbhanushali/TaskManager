import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user._id) {
    console.log("Authentication failed:", {
      hasUser: !!req.user,
      hasSession: !!req.session,
      sessionKeys: req.session ? Object.keys(req.session) : [],
      cookies: req.headers.cookie ? "present" : "missing",
    });
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next();
};

export default isAuthenticated;
