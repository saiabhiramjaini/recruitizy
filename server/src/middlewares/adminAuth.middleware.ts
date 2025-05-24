import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedAdminRequest } from "../utils/types";
import { Response, NextFunction } from "express";

const prisma = new PrismaClient();
const Admin = prisma.admin;

export const adminAuthMiddleware = async (
  req: AuthenticatedAdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
      adminId: number;
    };
    const admin = await Admin.findUnique({ where: { id: decode.adminId } });

    if (!admin) {
      return res.status(401).json({ msg: "Invalid token, user not found" });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
