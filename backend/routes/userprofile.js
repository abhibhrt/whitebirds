import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";
import { validate, updateProfileSchema } from "../validators/userValidation.js";

const router = express.Router();

/* -------------------- UPDATE PROFILE -------------------- */
router.put(
  "/update",
  protect,
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const { name, mobNo, address } = req.body;

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { address: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check mobile requirement
    if (!user.mobNo && !mobNo) {
      return res.status(400).json({
        error: "Mobile number is required since it's not set yet",
      });
    }

    // Update basic fields
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(mobNo && { mobNo }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobNo: true,
        role: true,
        createdAt: true,
        address: true,
      },
    });

    // Handle address
    if (address) {
      if (user.address) {
        await prisma.address.update({
          where: { userId: req.user.id },
          data: address,
        });
      } else {
        await prisma.address.create({
          data: {
            ...address,
            userId: req.user.id,
          },
        });
      }
    }

    // Fetch final profile
    const finalUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { address: true },
    });

    res.json({
      message: "Profile updated successfully",
      user: finalUser,
    });
  })
);

export default router;