import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

function Leaderboard({ mode = "free" }: { mode?: string }) {
  const entries = useQuery(api.leaderboard.topLeaderboard, { mode }) || [];
  // Fetch user emails for leaderboard display
  const userIds = entries.map((e) => e.userId);
  const users = useQuery(
    api.leaderboard.getUserEmails,
    userIds.length ? { userIds } : "skip"
  ) || {};

  return (
    <div className="bg-zinc-900/80 rounded-lg p-4 shadow text-white">
      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
        <span role="img" aria-label="Babadook">👻</span>
        Leaderboard ({mode})
      </h3>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>User</th>
            <th>WPM</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e._id} className={i === 0 ? "font-bold" : ""}>
              <td>
                {users[e.userId]?.email
                  ? users[e.userId].email
                  : e.userId.slice(0, 6)}
              </td>
              <td>{e.wpm}</td>
              <td>{(e.accuracy * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
