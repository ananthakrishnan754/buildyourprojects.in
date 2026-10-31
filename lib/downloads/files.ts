import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

export type DeliverableFile = {
  path: string;
  filename: string;
  contentType: string;
  bytes: Buffer;
};

const KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;

const CONTENT_TYPES: Record<string, string> = {
  ".zip": "application/zip",
  ".pdf": "application/pdf",
  ".csv": "text/csv; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export function deliverableRoot(): string {
  return path.join(process.cwd(), "private", "downloads");
}

export function isValidDeliverableKey(key: string): boolean {
  return KEY_PATTERN.test(key);
}

function safeFilename(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120) || "download";
}

/**
 * Resolves `private/downloads/<key>/` to exactly one regular file. The caller
 * must call this before claiming a download attempt, so a missing file never
 * consumes the customer's quota.
 */
export async function resolveDeliverableFile(
  deliverableKey: string,
): Promise<DeliverableFile | null> {
  if (!isValidDeliverableKey(deliverableKey)) return null;

  const root = deliverableRoot();
  const directory = path.resolve(root, deliverableKey);
  const rootWithSeparator = `${path.resolve(root)}${path.sep}`;

  if (!directory.startsWith(rootWithSeparator)) return null;

  try {
    const directoryStat = await stat(directory);
    if (!directoryStat.isDirectory()) return null;

    const entries = await readdir(directory, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
      .map((entry) => entry.name);

    if (files.length === 0) return null;

    let filename: string;

    if (files.length === 1) {
      filename = files[0]!;
    } else {
      const preferred = files.find((name) =>
        name.toLowerCase().startsWith(`${deliverableKey.toLowerCase()}.`),
      );

      if (!preferred) return null;
      filename = preferred;
    }

    const filePath = path.resolve(directory, filename);

    if (!filePath.startsWith(`${directory}${path.sep}`)) return null;

    const bytes = await readFile(filePath);
    const extension = path.extname(filename).toLowerCase();

    return {
      path: filePath,
      filename: safeFilename(filename),
      contentType: CONTENT_TYPES[extension] ?? "application/octet-stream",
      bytes,
    };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT" || code === "EACCES" || code === "ENOTDIR") return null;
    throw error;
  }
}
