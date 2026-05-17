import { validateConfig } from "../lib/validation";

describe("validateConfig", () => {
  const valid = { rows: 4, cols: 4, timeoutSeconds: 60 };

  it("accepts a valid config", () => {
    expect(validateConfig(valid)).toEqual({ ok: true });
  });

  it("rejects rows below minimum", () => {
    const result = validateConfig({ ...valid, rows: 1 });
    expect(result.ok).toBe(false);
  });

  it("rejects odd total cells", () => {
    const result = validateConfig({ ...valid, rows: 3, cols: 3 });
    expect(result.ok).toBe(false);
  });

  it("rejects timeout below minimum", () => {
    const result = validateConfig({ ...valid, timeoutSeconds: 5 });
    expect(result.ok).toBe(false);
  });
});