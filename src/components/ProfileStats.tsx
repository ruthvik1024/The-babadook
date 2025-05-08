import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ProfileStats() {
  const sessions = useQuery(api.sessions.listSessions) || [];
  if (!sessions.length) {
    return (
      <div className="text-slate-400 text-center">No typing sessions yet.</div>
    );
  }
  const bestWpm = Math.max(...sessions.map((s) => s.wpm));
  const avgAccuracy =
    sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length;
  // Streak: count consecutive days with a session
  const days = sessions
    .map((s) => new Date(s.endedAt).toDateString())
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    if (
      prev.getFullYear() === curr.getFullYear() &&
      prev.getMonth() === curr.getMonth() &&
      prev.getDate() - curr.getDate() === 1
    ) {
      streak++;
    } else {
      break;
    }
  }
  return (
    <div className="bg-zinc-900/80 rounded-lg p-4 shadow text-white mt-4">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <span role="img" aria-label="Babadook">👻</span>
        Your Typing Stats
      </h3>
      <div className="mb-2">
        <span className="font-semibold">Best WPM:</span> {bestWpm}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Avg Accuracy:</span> {(avgAccuracy * 100).toFixed(1)}%
      </div>
      <div className="mb-2">
        <span className="font-semibold">Practice Streak:</span> {streak} day{streak !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
