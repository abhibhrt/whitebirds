import { z } from "zod";

// Middleware for validation
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];
    const result = schema.safeParse(data);
    if (result.success) {
      req[source] = result.data;
      return next();
    }
    return res.status(400).json({
      error: "please maintain a valid format",
      details: result.error.errors,
    });
  };
};

// User Signup
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email(),
  mobNo: z
    .string()
    .optional()
    .refine((s) => !s || /^\+?[0-9]{7,15}$/.test(s), "Invalid mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((p) => /[A-Z]/.test(p), "Must contain uppercase letter")
    .refine((p) => /[a-z]/.test(p), "Must contain lowercase letter")
    .refine((p) => /[0-9]/.test(p), "Must contain number")
    .refine((p) => /[!@#$%^&*(),.?\":{}|<>]/.test(p), "Must contain special char"),
});

// User Login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password required"),
});

// Add To Cart
export const addToCartSchema = z.object({
  productId: z.preprocess((val) => Number(val), z.number().int().positive()),
  quantity: z
    .preprocess((val) => Number(val), z.number().int().positive().min(1))
    .default(1),
});

// Update Cart
export const updateCartSchema = z.object({
  cartId: z.preprocess((val) => Number(val), z.number().int().positive()),
  quantity: z.preprocess((val) => Number(val), z.number().int().min(0)),
});

// Create Order
export const createOrderSchema = z.object({
  productId: z.preprocess((val) => Number(val), z.number().int().positive()),
  quantity: z.preprocess((val) => Number(val), z.number().int().positive().min(1)),
  paymentMode: z.enum(["COD", "ONLINE"]).default("COD"),
  expected: z
    .string()
    .optional()
    .refine((s) => {
      if (!s) return true;
      const d = new Date(s);
      return !Number.isNaN(d.getTime());
    }, "Invalid date format"),
});

// Update Profile
export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  mobNo: z
    .string()
    .optional()
    .refine((s) => !s || /^\+?[0-9]{7,15}$/.test(s), "Invalid mobile number"),
  address: z
    .object({
      state: z.string().min(1),
      city: z.string().min(1),
      pincode: z.string().min(3),
      addressLine: z.string().min(3),
    })
    .optional(),
});

// Create Review
export const createReviewSchema = z.object({
  productId: z.preprocess((val) => Number(val), z.number().int().positive()),
  rating: z.preprocess((val) => Number(val), z.number().int().min(1).max(5)),
  feedback: z.string().min(1).optional(),
});

// Param ID (for /:id routes)
export const paramIdSchema = z.object({
  id: z.preprocess((v) => Number(v), z.number().int().positive()),
});

export default {
  validate,
  signupSchema,
  loginSchema,
  addToCartSchema,
  updateCartSchema,
  createOrderSchema,
  updateProfileSchema,
  createReviewSchema,
  paramIdSchema,
};