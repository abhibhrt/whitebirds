import express from "express";
import prisma from "../utils/prismaClient.js";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";
import {
  validate,
  createOrderSchema,
  paramIdSchema,
} from "../validators/userValidation.js";
const router = express.Router();

/* -------------------- CREATE ORDER -------------------- */
router.post(
  "/",
  protect,
  validate(createOrderSchema),
  asyncHandler(async (req, res) => {
    const { productId, quantity, expected, paymentMode } = req.body;

    // Check product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: "product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ error: "not enough stock available" });
    }

    // Get user with address + mobNo
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { address: true },
    });
    if (!user) return res.status(404).json({ error: "user not found" });
    if (!user.mobNo) {
      return res.status(400).json({ error: "mobile number is required in profile" });
    }
    if (!user.address) {
      return res.status(400).json({ error: "address is required in profile" });
    }

    // Calculate total (apply discount if exists)
    const discountedPrice =
      product.discount > 0
        ? product.price - (product.price * product.discount) / 100
        : product.price;
    const total = discountedPrice * quantity;

    // Create order
    const order = await prisma.orders.create({
      data: {
        userId: req.user.id,
        productId,
        quantity,
        expected: expected ? new Date(expected) : new Date(),
        total,
        paymentMode,
        status: "Pending",
      },
      include: {
        product: { select: { id: true, title: true, price: true, discount: true } },
      },
    });

    // Reduce stock
    await prisma.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });

    res.status(201).json({
      message: "order placed successfully",
      order,
      deliveryAddress: user.address,
      mobile: user.mobNo,
    });
  })
);

/* -------------------- GET ALL ORDERS (USER) -------------------- */
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const orders = await prisma.orders.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            discount: true,
            images: {
              take: 1,
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  })
);

/* -------------------- GET SINGLE ORDER (USER) -------------------- */
router.get(
  "/:id",
  protect,
  validate(paramIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const orderId = req.params.id;

    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        product: { select: { id: true, title: true, price: true, discount: true } },
      },
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: "order not found" });
    }

    res.json(order);
  })
);

/* -------------------- CANCEL ORDER (USER) -------------------- */
router.put(
  "/:id/cancel",
  protect,
  validate(paramIdSchema, "params"),
  asyncHandler(async (req, res) => {
    const orderId = req.params.id;

    const order = await prisma.orders.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (["Cancelled", "Shipped", "Delivered"].includes(order.status)) {
      return res.status(400).json({ error: "Order cannot be cancelled" });
    }

    const updatedOrder = await prisma.orders.update({
      where: { id: orderId },
      data: { status: "Cancelled" },
    });

    // Restore stock
    if (updatedOrder.productId) {
      await prisma.product.update({
        where: { id: updatedOrder.productId },
        data: { stock: { increment: updatedOrder.quantity } },
      });
    }

    res.json({
      message: "order cancelled successfully",
      order: updatedOrder,
    });
  })
);

export default router;