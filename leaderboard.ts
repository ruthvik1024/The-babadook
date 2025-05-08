import { query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Top leaderboard entries for a mode
export const topLeaderboard = query({
  args: { mode: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leaderboard")
      .withIndex("by_mode", (q) => q.eq("mode", args.mode))
      .order("desc")
      .take(20);
  },
});

// Get user emails for leaderboard display
export const getUserEmails = query({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    const idToEmail: Record<Id<"users">, { email?: string }> = {};
    for (const userId of args.userIds) {
      const user = await ctx.db.get(userId);
      if (user) {
        idToEmail[userId] = { email: user.email };
      }
    }
    return idToEmail;
  },
});
