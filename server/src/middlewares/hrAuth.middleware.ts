import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedHRRequest } from "../utils/types";
import { Response, NextFunction } from "express";

const prisma = new PrismaClient();
const HR = prisma.hr;

export const hrAuthMiddleware = async (
  req: AuthenticatedHRRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
      hrId: number;
    };
    const hr = await HR.findUnique({ where: { id: decode.hrId } });

    if (!hr) {
      return res.status(401).json({ msg: "Invalid token, user not found" });
    }

    req.hr = hr;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
