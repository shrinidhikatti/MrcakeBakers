import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  image: z.string().min(1, 'Image is required'),
  categoryId: z.string().min(1, 'Category is required'),
  inStock: z.boolean().optional().default(true),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').optional().default(0),
  lowStockAlert: z.number().int().min(0).optional().default(10),
  weight: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  allergens: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
});

// Order validation schemas
export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be positive'),
      price: z.number().positive('Price must be positive'),
    })
  ).min(1, 'At least one item is required'),
  deliveryAddress: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(10, 'Valid phone number is required'),
    address: z.string().min(10, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  }),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  deliverySlot: z.string().min(1, 'Delivery slot is required'),
  specialInstructions: z.string().optional(),
  paymentMethod: z.enum(['COD', 'ONLINE']).default('COD'),
});

// User update validation
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'CUSTOMER', 'DELIVERY_PARTNER']).optional(),
});

// Wishlist validation
export const wishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

// Format Zod errors for API responses
export function formatZodErrors(errors: z.ZodError): string[] {
  return errors.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
}
