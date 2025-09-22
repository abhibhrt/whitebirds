import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";
import {
  validate,
  addToCartSchema,
  updateCartSchema,
  paramIdSchema,
} from "../validators/userValidation.js";

const router = express.Router();

/* -------------------- Add to Cart -------------------- */
router.post(
  "/",
  protect,
  validate(addToCartSchema),
  asyncHandler(async (req, res) => {
    const { productId } = req.body;
    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // check if already in cart
    const existing = await prisma.cart.findFirst({
      where: { userId: req.user.id, productId },
    });

    let cartItem;
    if (existing) {
      res.status(400).json({ error: "product already in cart" });
    } else {
      cartItem = await prisma.cart.create({
        data: { userId: req.user.id, productId },
      });
    }

    res.status(201).json({
      message: "product added to cart",
      cartItem,
    });
  })
);

/* -------------------- Get User Cart -------------------- */
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: {
        product: { select: { id: true, title: true, price: true, stock: true } },
      },
    });

    res.json(cart)
  })
);

/* -------------------- Delete Item from Cart -------------------- */
router.delete(
  "/:id",
  protect,
  validate(paramIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const cartItem = await prisma.cart.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await prisma.cart.delete({ where: { id: cartItem.id } });

    res.json({ message: "Item removed from cart" });
  })
);

/* -------------------- Order All Cart Items -------------------- */
router.post(
  "/order-all",
  protect,
  asyncHandler(async (req, res) => {
    const cartItems = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (!cartItems.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // check stock
    for (let item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for product: ${item.product.title}`,
        });
      }
    }

    // create multiple orders in a transaction
    const orders = await prisma.$transaction(async (tx) => {
      const newOrders = [];

      for (let item of cartItems) {
        const order = await tx.orders.create({
          data: {
            userId: req.user.id,
            productId: item.productId,
            quantity: item.quantity,
            address: req.user.address || "Update address",
            mobile: req.user.mobNo || "Update mobile",
            status: "pending",
          },
        });

        // decrease stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        newOrders.push(order);
      }

      // clear cart
      await tx.cart.deleteMany({ where: { userId: req.user.id } });

      return newOrders;
    });

    res.status(201).json({
      message: "All cart items ordered successfully",
      orders,
    });
  })
);

export default router;