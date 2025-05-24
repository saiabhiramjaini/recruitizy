import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from "../schema";
import { sendEmail } from "../utils/email";
import { AuthenticatedAdminRequest } from "../utils/types";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, cPassword } = signupSchema.parse(
      req.body
    );

    if (password !== cPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const admin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });
    if (admin) {
      return res.status(409).json({ msg: "An Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const saveAdmin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ adminId: saveAdmin.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    res.cookie("token", token, { httpOnly: true });

    return res.status(201).json({ msg: "Account created Successfully", token });
  } catch (error: any) {
    if (error.errors && error.errors[0].message) {
      const message = error.errors[0].message;
      return res.status(400).json({ msg: message });
    }
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = signinSchema.parse(req.body);

    const admin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!admin) {
      return res.status(404).json({ msg: "Email doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET!);
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({ msg: "Signin successful", token });
  } catch (error: any) {
    if (error.errors && error.errors[0].message) {
      const message = error.errors[0].message;
      return res.status(400).json({ msg: message });
    }
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const existingUser = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, { httpOnly: true });

    const text = `${process.env.CLIENT_URL}/resetPassword/${token}`;
    const emailResult = await sendEmail(email, "Reset password", text);

    if (emailResult.success) {
      return res.status(200).json({ msg: "Email sent successfully" });
    } else {
      return res.status(500).json({ msg: emailResult.error });
    }
  } catch (error: any) {
    if (error.errors && error.errors[0].message) {
      const message = error.errors[0].message;
      return res.status(400).json({ msg: message });
    }

    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const profile = async (
  req: AuthenticatedAdminRequest,
  res: Response
) => {
  try {
    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    return res.status(200).json({ username: admin.username, email: admin.email });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const resetPassword = async (
  req: AuthenticatedAdminRequest,
  res: Response
) => {
  try {
    const { password, cPassword } = resetPasswordSchema.parse(req.body);
    const admin = req.admin;

    if (!admin) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (password !== cPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });
    const updatedUser = await prisma.admin.findUnique({
      where: { id: admin.id },
    });

    return res.status(200).json({
      msg: "Password updated successfully",
      admin: updatedUser,
    });
  } catch (error: any) {
    if (error.errors && error.errors[0].message) {
      const message = error.errors[0].message;
      return res.status(400).json({ msg: message });
    }
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(200).json({ msg: "Logged out successfully" });
};