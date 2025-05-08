import React from "react";

// Simple QWERTY layout for MVP
const QWERTY = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

function VirtualKeyboard({
  pressedKey,
}: {
  pressedKey?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {QWERTY.map((row, i) => (
        <div key={i} className="flex gap-1">
          {row.map((key) => (
            <kbd
              key={key}
              className={
                "w-8 h-10 flex items-center justify-center rounded border bg-zinc-800 text-lg font-mono shadow text-white" +
                (pressedKey?.toUpperCase() === key
                  ? " bg-indigo-700 text-white"
                  : "")
              }
            >
              {key}
            </kbd>
          ))}
        </div>
      ))}
    </div>
  );
}

export default VirtualKeyboard;
