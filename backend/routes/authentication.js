import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../utils/prismaClient.js";
import { validate, signupSchema, loginSchema } from "../validators/userValidation.js";
import { setAuthCookie } from "../utils/cookieControll.js";

const router = express.Router();

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// SIGNUP
router.post("/signup", validate(signupSchema), async (req, res, next) => {
  try {
    const { name, email, password, mobNo } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, mobNo },
      select: { id: true, name: true, email: true, mobNo:true, role: true },
    });

    const token = generateToken(user);
    setAuthCookie(res, token);

    res.status(201).json({ message: "signup successful", user });
  } catch (err) {
    next(err);
  }
});

// SIGNIN
router.post("/signin", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { address: true },
    });

    if (!user) return res.status(401).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Wrong password" });

    const token = generateToken(user);
    setAuthCookie(res, token);

    const { password: _, ...safeUser } = user;

    res.json({
      message: "Signin successful",
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
});


// SIGNOUT
router.post("/signout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    });
    res.json({ message: "signout successful" });
  } catch (err) {
    res.status(400).json({ error: "failed to logout" });
  }
});

export default router;