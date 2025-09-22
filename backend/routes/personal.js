import express from "express";
import prisma from "../utils/prismaClient.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate, updateProfileSchema } from "../validators/userValidation.js";

const router = express.Router();

// GET logged-in user details
router.get("/", protect, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        mobNo: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "user not found" });

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PUT - Update user details (except email)
router.put(
  "/update",
  protect,
  validate(updateProfileSchema),
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { name, mobNo, address } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          mobNo,
          address: address
            ? {
                upsert: {
                  update: {
                    state: address.state,
                    city: address.city,
                    pincode: address.pincode,
                    addressLine: address.addressLine,
                  },
                  create: {
                    state: address.state,
                    city: address.city,
                    pincode: address.pincode,
                    addressLine: address.addressLine,
                  },
                },
              }
            : undefined,
        },
        select: {
          id: true,
          name: true,
          email: true,
          mobNo: true,
          role: true,
          address: true,
          createdAt: true,
        },
      });

      res.json({ message: "updated successfully", user: updatedUser });
    } catch (err) {
      res.status(400).json({error: "failed to update"});
    }
  }
);

export default router;