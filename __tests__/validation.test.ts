import {
  DEFAULT_CUSTOM_CONFIG,
  DIFFICULTY_CONFIGS,
  DIFFICULTY_DESCRIPTIONS,
  DIFFICULTY_LABELS,
  MAX_COLS,
  MAX_PAIRS,
  MAX_ROWS,
  MAX_TIMEOUT,
  MIN_COLS,
  MIN_ROWS,
  MIN_TIMEOUT,
  validateCustomConfig,
} from "../lib/validation";

describe("validateCustomConfig", () => {
  const valid = { rows: 4, cols: 4, timeoutSeconds: 60 };

  it("accepts a valid config", () => {
    expect(validateCustomConfig(valid.rows, valid.cols, valid.timeoutSeconds)).toBeNull();
  });

  it("rejects rows below minimum", () => {
    expect(validateCustomConfig(MIN_ROWS - 1, valid.cols, valid.timeoutSeconds)).toBe(
      "rows-range",
    );
  });

  it("rejects rows above maximum", () => {
    expect(validateCustomConfig(MAX_ROWS + 1, valid.cols, valid.timeoutSeconds)).toBe(
      "rows-range",
    );
  });

  it("rejects non-integer rows", () => {
    expect(validateCustomConfig(3.5, valid.cols, valid.timeoutSeconds)).toBe("rows-range");
  });

  it("rejects cols below minimum", () => {
    expect(validateCustomConfig(valid.rows, MIN_COLS - 1, valid.timeoutSeconds)).toBe(
      "cols-range",
    );
  });

  it("rejects cols above maximum", () => {
    expect(validateCustomConfig(valid.rows, MAX_COLS + 1, valid.timeoutSeconds)).toBe(
      "cols-range",
    );
  });

  it("rejects odd total cells", () => {
    expect(validateCustomConfig(3, 3, valid.timeoutSeconds)).toBe("odd-total");
  });

  it("rejects timeout below minimum", () => {
    expect(validateCustomConfig(valid.rows, valid.cols, MIN_TIMEOUT - 1)).toBe(
      "timeout-range",
    );
  });

  it("rejects timeout above maximum", () => {
    expect(validateCustomConfig(valid.rows, valid.cols, MAX_TIMEOUT + 1)).toBe(
      "timeout-range",
    );
  });

  it("rejects boards exceeding available pairs", () => {
    // Find a grid that's within row/col bounds but exceeds MAX_PAIRS pairs.
    // 6x6 = 36 cells = 18 pairs, which equals MAX_PAIRS (18) — should pass.
    // To exceed it we'd need >36 cells, which the row/col caps already prevent,
    // so this guard is exercised only if MAX_PAIRS < MAX_ROWS*MAX_COLS/2.
    const maxBoardPairs = (MAX_ROWS * MAX_COLS) / 2;
    if (maxBoardPairs > MAX_PAIRS) {
      expect(validateCustomConfig(MAX_ROWS, MAX_COLS, valid.timeoutSeconds)).toBe(
        "too-many-pairs",
      );
    } else {
      expect(validateCustomConfig(MAX_ROWS, MAX_COLS, valid.timeoutSeconds)).toBeNull();
    }
  });

  it("accepts the lowest valid configuration", () => {
    expect(validateCustomConfig(MIN_ROWS, MIN_COLS, MIN_TIMEOUT)).toBeNull();
  });
});

describe("DIFFICULTY_CONFIGS", () => {
  it("contains entries for easy, medium, and hard", () => {
    expect(Object.keys(DIFFICULTY_CONFIGS).sort()).toEqual(["easy", "hard", "medium"]);
  });

  it("every preset has an even cell count", () => {
    for (const [, cfg] of Object.entries(DIFFICULTY_CONFIGS)) {
      expect((cfg.rows * cfg.cols) % 2).toBe(0);
    }
  });

  it("every preset fits within the image pool and rule bounds", () => {
    for (const [, cfg] of Object.entries(DIFFICULTY_CONFIGS)) {
      expect(validateCustomConfig(cfg.rows, cfg.cols, cfg.timeoutSeconds)).toBeNull();
    }
  });

  it("each preset's difficulty field matches its key", () => {
    for (const [key, cfg] of Object.entries(DIFFICULTY_CONFIGS)) {
      expect(cfg.difficulty).toBe(key);
    }
  });
});

describe("DEFAULT_CUSTOM_CONFIG", () => {
  it("is tagged as custom", () => {
    expect(DEFAULT_CUSTOM_CONFIG.difficulty).toBe("custom");
  });

  it("is a valid custom configuration", () => {
    expect(
      validateCustomConfig(
        DEFAULT_CUSTOM_CONFIG.rows,
        DEFAULT_CUSTOM_CONFIG.cols,
        DEFAULT_CUSTOM_CONFIG.timeoutSeconds,
      ),
    ).toBeNull();
  });
});

describe("DIFFICULTY_LABELS / DIFFICULTY_DESCRIPTIONS", () => {
  const expectedKeys = ["easy", "medium", "hard", "custom"] as const;

  it("labels include all four difficulties", () => {
    for (const key of expectedKeys) {
      expect(DIFFICULTY_LABELS[key]).toBeTruthy();
    }
  });

  it("descriptions include all four difficulties", () => {
    for (const key of expectedKeys) {
      expect(DIFFICULTY_DESCRIPTIONS[key]).toBeTruthy();
    }
  });
});
