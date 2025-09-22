import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";
import { validate, createReviewSchema } from "../validators/userValidation.js";

const router = express.Router();

/* -------------------- ADD REVIEW -------------------- */
router.post(
  "/",
  protect,
  validate(createReviewSchema),
  asyncHandler(async (req, res) => {
    const { productId, rating, feedback } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Count reviews by this user for this product today
    const reviewCount = await prisma.reviews.count({
      where: {
        userId: req.user.id,
        productId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (reviewCount >= 2) {
      return res.status(429).json({
        error: "Rate limit exceeded: You can only add 2 reviews per product per day",
      });
    }

    // Create review
    const review = await prisma.reviews.create({
      data: {
        userId: req.user.id,
        productId,
        rating,
        feedback,
      },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, title: true } },
      },
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  })
);

export default router;