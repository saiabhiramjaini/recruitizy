import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signinSchema } from "../schema";
import { AuthenticatedHRRequest } from "../utils/types";

const prisma = new PrismaClient();

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = signinSchema.parse(req.body);

    const hr = await prisma.hr.findFirst({
      where: {
        email,
      },
    });

    if (!hr) {
      return res.json({ msg: "Email doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, hr.password);
    if (!passwordMatch) {
      return res.json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign({ hrId: hr.id }, process.env.JWT_SECRET!);
    res.cookie("token", token, { httpOnly: true });
    return res.json({ msg: "Signin successful", token });
  } catch (error: any) {
    if (error.errors && error.errors[0].message) {
      const message = error.errors[0].message;
      return res.json({ msg: message });
    }
    console.error(error);
    return res.json({ msg: "Internal Server Error" });
  }
};

export const profile = async (req: AuthenticatedHRRequest, res: Response) => {
  try {
    const hr = req.hr;
    if (!hr) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    return res.json({ username: hr.username, email: hr.email });
  } catch (error) {
    console.error("Error fetching HR profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ msg: "Logged out successfully" });
};
