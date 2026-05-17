import { shuffle, generateDeck } from "../lib/deck";

describe("shuffle", () => {
  it("returns array with same length", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(arr.length);
  });

  it("does not mutate original array", () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe("generateDeck", () => {
  it("generates correct number of cards", () => {
    const deck = generateDeck(6);
    expect(deck).toHaveLength(12);
  });

  it("all cards start as hidden", () => {
    const deck = generateDeck(3);
    deck.forEach((card) => expect(card.status).toBe("hidden"));
  });

  it("each face appears exactly twice", () => {
    const deck = generateDeck(4);
    const faceCounts: Record<string, number> = {};
    deck.forEach((card) => {
      faceCounts[card.face] = (faceCounts[card.face] || 0) + 1;
    });
    Object.values(faceCounts).forEach((count) => {
      expect(count).toBe(2);
    });
  });

  it("every card has a non-empty label", () => {
    const deck = generateDeck(5);
    deck.forEach((card) => {
      expect(typeof card.label).toBe("string");
      expect(card.label.length).toBeGreaterThan(0);
    });
  });

  it("cards with the same face share the same label", () => {
    const deck = generateDeck(6);
    const faceToLabel = new Map<string, string>();
    for (const card of deck) {
      const existing = faceToLabel.get(card.face);
      if (existing === undefined) {
        faceToLabel.set(card.face, card.label);
      } else {
        expect(card.label).toBe(existing);
      }
    }
  });

  it("assigns sequential ids starting at 0", () => {
    const deck = generateDeck(4);
    const ids = deck.map((c) => c.id).sort((a, b) => a - b);
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("throws for pairCount below 1", () => {
    expect(() => generateDeck(0)).toThrow();
    expect(() => generateDeck(-1)).toThrow();
  });

  it("throws when pairCount exceeds the image pool", () => {
    expect(() => generateDeck(1000)).toThrow();
  });
});