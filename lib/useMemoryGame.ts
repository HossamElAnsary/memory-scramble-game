"use client";

import { useEffect, useReducer, useRef } from "react";
import type { Card, GameConfig, GameStatus } from "./types";
import { generateDeck } from "./deck";

const MISMATCH_DELAY_MS = 700;
const TICK_MS = 250;

type State = {
  status: GameStatus;
  cards: Card[];
  config: GameConfig | null;
  remainingMs: number;
  moves: number;
  firstId: number | null;
  awaitingResolution: boolean;
};

type Action =
  | { type: "START"; config: GameConfig }
  | { type: "FLIP"; id: number }
  | { type: "RESOLVE_PAIR" }
  | { type: "TICK"; deltaMs: number }
  | { type: "RESET" };

const initialState: State = {
  status: "idle",
  cards: [],
  config: null,
  remainingMs: 0,
  moves: 0,
  firstId: null,
  awaitingResolution: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START": {
      const { rows, cols, timeoutSeconds } = action.config;
      const cards = generateDeck((rows * cols) / 2);
      return {
        status: "playing",
        cards,
        config: action.config,
        remainingMs: timeoutSeconds * 1000,
        moves: 0,
        firstId: null,
        awaitingResolution: false,
      };
    }

    case "FLIP": {
      if (state.status !== "playing") return state;
      if (state.awaitingResolution) return state;
      const card = state.cards[action.id];
      if (!card || card.status !== "hidden") return state;
      if (state.firstId === action.id) return state;

      const cards = state.cards.map((c) =>
        c.id === action.id ? { ...c, status: "revealed" as const } : c,
      );

      if (state.firstId === null) {
        return { ...state, cards, firstId: action.id };
      }

      const first = cards[state.firstId];
      const second = cards[action.id];
      const moves = state.moves + 1;

      if (first.face === second.face) {
        const matchedCards = cards.map((c) =>
          c.id === first.id || c.id === second.id
            ? { ...c, status: "matched" as const }
            : c,
        );
        const allMatched = matchedCards.every((c) => c.status === "matched");
        return {
          ...state,
          cards: matchedCards,
          moves,
          firstId: null,
          status: allMatched ? "won" : "playing",
        };
      }

      return {
        ...state,
        cards,
        moves,
        awaitingResolution: true,
      };
    }

    case "RESOLVE_PAIR": {
      if (!state.awaitingResolution) return state;
      const cards = state.cards.map((c) =>
        c.status === "revealed" ? { ...c, status: "hidden" as const } : c,
      );
      return { ...state, cards, firstId: null, awaitingResolution: false };
    }

    case "TICK": {
      if (state.status !== "playing") return state;
      const remainingMs = Math.max(0, state.remainingMs - action.deltaMs);
      if (remainingMs === 0) {
        const allMatched = state.cards.every((c) => c.status === "matched");
        return {
          ...state,
          remainingMs: 0,
          status: allMatched ? "won" : "lost",
        };
      }
      return { ...state, remainingMs };
    }

    case "RESET":
      return { ...initialState, config: state.config };

    default:
      return state;
  }
}

export function useMemoryGame() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const resolveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mismatch resolution timer.
  useEffect(() => {
    if (!state.awaitingResolution) return;
    resolveTimerRef.current = setTimeout(() => {
      dispatch({ type: "RESOLVE_PAIR" });
    }, MISMATCH_DELAY_MS);
    return () => {
      if (resolveTimerRef.current) clearTimeout(resolveTimerRef.current);
    };
  }, [state.awaitingResolution]);

  // Countdown timer.
  useEffect(() => {
    if (state.status !== "playing") return;
    const interval = setInterval(() => {
      dispatch({ type: "TICK", deltaMs: TICK_MS });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [state.status]);

  return {
    status: state.status,
    cards: state.cards,
    config: state.config,
    remainingMs: state.remainingMs,
    moves: state.moves,
    start: (config: GameConfig) => dispatch({ type: "START", config }),
    flip: (id: number) => dispatch({ type: "FLIP", id }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
