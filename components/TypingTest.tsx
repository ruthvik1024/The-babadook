import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Id } from "../../convex/_generated/dataModel";

const DEFAULT_TEXT =
  "The Babadook is watching you type. Type fast, type true, and don't let the Babadook catch you!";

function getWords(text: string) {
  return text.split(/\s+/);
}

function TypingTest({
  text = DEFAULT_TEXT,
  mode = "free",
  textId,
  onComplete,
  setLastKey,
}: {
  text?: string;
  mode?: string;
  textId?: Id<"texts">;
  onComplete?: () => void;
  setLastKey?: (k: string | undefined) => void;
}) {
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [keystrokes, setKeystrokes] = useState<
    { char: string; correct: boolean; timestamp: number }[]
  >([]);
  const [finished, setFinished] = useState(false);

  const saveSession = useMutation(api.sessions.saveSession);

  const words = getWords(text);
  const chars = text.split("");
  const currentIndex = input.length;
  const correctSoFar =
    text.slice(0, input.length) === input && input.length <= text.length;
  const errorCount = keystrokes.filter((k) => !k.correct).length;
  const correctCount = keystrokes.filter((k) => k.correct).length;
  const accuracy =
    keystrokes.length === 0
      ? 100
      : (correctCount / keystrokes.length) * 100;
  // WPM = (chars / 5) / minutes
  const wpm =
    elapsed > 0
      ? (((input.length / 5) / (elapsed / 60))).toFixed(1)
      : "0.0";

  // Timer
  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished]);

  // Focus input on mount and when finished changes
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!finished) {
      inputRef.current?.focus();
    }
  }, [finished]);

  // Handle input change
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (finished) return;
    const value = e.target.value;
    // Only allow up to text.length
    if (value.length > text.length) return;
    // Figure out what key was pressed
    const lastTyped = value[value.length - 1];
    if (!started && value.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }
    if (value.length > input.length) {
      // New char added
      const idx = value.length - 1;
      const char = value[idx];
      const correct = text[idx] === char;
      setKeystrokes((ks) => [
        ...ks,
        { char, correct, timestamp: Date.now() },
      ]);
      if (setLastKey) setLastKey(char);
      if (value.length === text.length) {
        setFinished(true);
        setElapsed(
          Math.round(((Date.now() - (startTime ?? Date.now())) / 1000) * 1)
        );
        setTimeout(() => {
          saveSession({
            wpm: Number(wpm),
            accuracy: accuracy / 100,
            errorCount,
            elapsed,
            mode,
            textId,
            customText: textId ? undefined : text,
            keystrokes,
          });
          if (onComplete) onComplete();
        }, 500);
      }
    }
    setInput(value);
  }

  // Reset on new text
  useEffect(() => {
    setInput("");
    setStarted(false);
    setStartTime(null);
    setElapsed(0);
    setKeystrokes([]);
    setFinished(false);
  }, [text, textId]);

  // Keyboard highlight reset
  useEffect(() => {
    if (!setLastKey) return;
    if (!input.length) {
      setLastKey(undefined);
      return;
    }
    const timeout = setTimeout(() => setLastKey(undefined), 200);
    return () => clearTimeout(timeout);
  }, [input, setLastKey]);

  return (
    <div className="bg-zinc-900/80 rounded-lg p-6 shadow flex flex-col gap-4">
      <div className="mb-2">
        <div className="flex flex-wrap gap-1 text-lg font-mono">
          {chars.map((char, i) => {
            let className = "";
            if (i < input.length) {
              className =
                input[i] === char
                  ? "text-green-400"
                  : "text-red-400 underline";
            } else if (i === input.length) {
              className = "bg-indigo-700 text-white rounded px-1";
            } else {
              className = "text-zinc-400";
            }
            return (
              <span key={i} className={className}>
                {char === " " ? <span className="inline-block w-3" /> : char}
              </span>
            );
          })}
        </div>
      </div>
      <input
        ref={inputRef}
        className="w-full border rounded p-2 bg-zinc-800 text-white font-mono text-lg outline-none"
        value={input}
        onChange={handleInputChange}
        disabled={finished}
        spellCheck={false}
        autoFocus
        aria-label="Typing input"
      />
      <div className="flex gap-4 text-sm text-zinc-300">
        <div>
          <span className="font-semibold">WPM:</span> {wpm}
        </div>
        <div>
          <span className="font-semibold">Accuracy:</span> {accuracy.toFixed(1)}%
        </div>
        <div>
          <span className="font-semibold">Errors:</span> {errorCount}
        </div>
        <div>
          <span className="font-semibold">Time:</span> {elapsed}s
        </div>
      </div>
      <AnimatePresence>
        {finished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-center text-green-400 font-bold text-xl mt-2"
          >
            Done! <span role="img" aria-label="party">🎉</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TypingTest;
