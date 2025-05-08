import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ProfileStats from "./ProfileStats";

function Profile() {
  const user = useQuery(api.auth.loggedInUser);
  const achievements = useQuery(api.achievements.getAchievements) || null;
  if (user === undefined || achievements === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  if (!user) {
    return <div className="text-center text-slate-400">Sign in to view your profile.</div>;
  }
  return (
    <div className="bg-zinc-900/80 rounded-lg p-6 shadow max-w-lg mx-auto text-white">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <span role="img" aria-label="Babadook">👻</span>
        Profile
      </h2>
      <div className="mb-2">
        <span className="font-semibold">Name:</span> {user.name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">XP:</span> {achievements?.xp ?? 0}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Streak:</span> {achievements?.streak ?? 0} days
      </div>
      <div className="mb-2">
        <span className="font-semibold">Badges:</span>{" "}
        {achievements?.badges.length
          ? achievements.badges.map((b, i) => (
              <span key={i} className="inline-block bg-indigo-800 text-indigo-100 px-2 py-1 rounded mr-2">
                {b}
              </span>
            ))
          : "None"}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Last Session:</span>{" "}
        {achievements?.lastSession
          ? new Date(achievements.lastSession).toLocaleString()
          : "Never"}
      </div>
      <ProfileStats />
    </div>
  );
}

export default Profile;
