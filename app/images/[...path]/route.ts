import { readFile } from "node:fs/promises";
import path from "node:path";

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const root = path.join(process.cwd(), "images");
  const filePath = path.resolve(root, ...segments);

  if (!filePath.startsWith(`${root}${path.sep}`)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(filePath);
    const contentType = contentTypes[path.extname(filePath).toLowerCase()];

    if (!contentType) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
