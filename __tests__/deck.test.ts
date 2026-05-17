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
});