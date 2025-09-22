import express from "express";
import prisma from "../utils/prismaClient.js";

const router = express.Router();

// READ All Products
router.get("/", async (req, res) => {
    const products = await prisma.product.findMany({
      include: { images: true, reviews: true, highlights: true },
    });
    res.json(products);
  }
);

export default router;