import { prisma } from "@/lib/prisma";

export async function decrementStock(items: { productId: string; quantity: number }[]) {
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        quantity: { decrement: item.quantity },
      },
    });
  }

  // Check low stock after decrement
  await checkLowStock(items.map((i) => i.productId));
}

export async function checkLowStock(productIds: string[]) {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true, quantity: true, lowStockAlert: true },
  });

  for (const product of products) {
    if (product.quantity <= 0) {
      // Mark out of stock
      await prisma.product.update({
        where: { id: product.id },
        data: { inStock: false },
      });

      // Create OUT_OF_STOCK notification
      const existing = await prisma.adminNotification.findFirst({
        where: { productId: product.id, type: "OUT_OF_STOCK", read: false },
      });
      if (!existing) {
        await prisma.adminNotification.create({
          data: {
            type: "OUT_OF_STOCK",
            title: "Out of Stock",
            message: `${product.name} is out of stock (${product.quantity} remaining)`,
            productId: product.id,
          },
        });
      }
    } else if (product.quantity <= product.lowStockAlert) {
      // Create LOW_STOCK notification
      const existing = await prisma.adminNotification.findFirst({
        where: { productId: product.id, type: "LOW_STOCK", read: false },
      });
      if (!existing) {
        await prisma.adminNotification.create({
          data: {
            type: "LOW_STOCK",
            title: "Low Stock Alert",
            message: `${product.name} is running low (${product.quantity} remaining, threshold: ${product.lowStockAlert})`,
            productId: product.id,
          },
        });
      }
    }
  }
}
