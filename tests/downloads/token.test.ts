import { describe, expect, it } from "vitest";
import {
  hashDownloadToken,
  signDownloadToken,
  verifyDownloadToken,
} from "@/lib/downloads/token";

const SECRET = "download_test_secret";

function future(minutes = 60): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function sign(
  overrides: {
    downloadId?: string;
    orderId?: string;
    expiresAt?: Date;
    secret?: string;
  } = {},
) {
  return signDownloadToken({
    downloadId: overrides.downloadId ?? "download-1",
    orderId: overrides.orderId ?? "order-1",
    expiresAt: overrides.expiresAt ?? future(),
    secret: overrides.secret ?? SECRET,
  });
}

describe("download tokens", () => {
  it("round-trips a valid token", () => {
    const expiresAt = future();
    const token = sign({ expiresAt });
    const result = verifyDownloadToken(token, SECRET);

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.payload).toEqual({
        d: "download-1",
        o: "order-1",
        e: Math.floor(expiresAt.getTime() / 1000),
      });
    }
  });

  it("rejects an edited token", () => {
    const token = sign();
    const tampered = token.replace(/^./, token[0] === "a" ? "b" : "a");

    expect(verifyDownloadToken(tampered, SECRET).valid).toBe(false);
  });

  it("rejects an expired token", () => {
    const token = sign({ expiresAt: new Date(Date.now() - 60_000) });
    const result = verifyDownloadToken(token, SECRET);

    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain("expired");
  });

  it("rejects a token signed with another secret", () => {
    const token = sign();

    expect(verifyDownloadToken(token, "another_secret").valid).toBe(false);
  });

  it("refuses to sign without a secret", () => {
    expect(() => sign({ secret: "" })).toThrow(/secret is required/i);
  });

  it("hashes tokens stably for storage", () => {
    expect(hashDownloadToken("abc")).toHaveLength(64);
    expect(hashDownloadToken("abc")).toBe(hashDownloadToken("abc"));
  });
});
