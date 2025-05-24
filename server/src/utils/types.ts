import { Request } from "express";
import { Admin, Hr } from "@prisma/client";

export interface AuthenticatedAdminRequest extends Request {
  admin?: Admin;
}

export interface AuthenticatedHRRequest extends Request {
  hr?: Hr;
}
