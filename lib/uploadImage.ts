import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function saveImageLocally(
  file: File,
  folder: string = 'products'
): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.name.split('.').pop();
    const filename = `${folder}-${uniqueSuffix}.${ext}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Return public URL
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}

export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = parsedUrl.pathname.toLowerCase();
    return validExtensions.some((ext) => pathname.endsWith(ext));
  } catch {
    // If URL parsing fails, check if it's a relative path
    if (url.startsWith('/')) {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      return validExtensions.some((ext) => url.toLowerCase().endsWith(ext));
    }
    return false;
  }
}

export function getImageUrl(image: string | null): string {
  if (!image) return '🍰'; // Default emoji fallback

  // If it's already a full URL or relative path, return it
  if (image.startsWith('http') || image.startsWith('/')) {
    return image;
  }

  // If it's a single emoji or short string, return as is
  if (image.length <= 4) {
    return image;
  }

  // Otherwise treat as filename and prepend uploads path
  return `/uploads/products/${image}`;
}
