import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_WIDTH = 2000;
const THUMB_SIZE = 600;

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export interface ProcessedImage {
  url: string;
  thumbnailUrl: string;
  metadata: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

export async function processImage(
  buffer: Buffer,
  originalName: string
): Promise<ProcessedImage> {
  await ensureUploadDir();

  const id = randomUUID();
  const baseName = `${id}`;
  const fullName = `${baseName}.webp`;
  const thumbName = `${baseName}-thumb.webp`;

  const fullPath = path.join(UPLOAD_DIR, fullName);
  const thumbPath = path.join(UPLOAD_DIR, thumbName);

  const image = sharp(buffer);
  const imageMeta = await image.metadata();

  // Process full image (downscale if > MAX_WIDTH)
  const fullPipeline = image.clone().webp({ quality: 85 });
  if (imageMeta.width && imageMeta.width > MAX_WIDTH) {
    fullPipeline.resize(MAX_WIDTH, undefined, { withoutEnlargement: true });
  }

  const fullInfo = await fullPipeline.toFile(fullPath);

  // Process thumbnail
  await image
    .clone()
    .resize(THUMB_SIZE, THUMB_SIZE, { fit: "cover" })
    .webp({ quality: 75 })
    .toFile(thumbPath);

  return {
    url: `/uploads/${fullName}`,
    thumbnailUrl: `/uploads/${thumbName}`,
    metadata: {
      width: fullInfo.width,
      height: fullInfo.height,
      format: "webp",
      size: fullInfo.size,
    },
  };
}

export async function deleteImage(url: string) {
  try {
    const filename = path.basename(url);
    const fullPath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(fullPath);
  } catch {
    // Ignore missing files
  }
}
