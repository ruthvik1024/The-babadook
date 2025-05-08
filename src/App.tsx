import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import TypingTest from "./components/TypingTest";
import VirtualKeyboard from "./components/VirtualKeyboard";
import CustomTextManager from "./components/CustomTextManager";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import React, { useState, useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";
import ThemeToggle from "./components/ThemeToggle";

type Page = "typing" | "leaderboard" | "profile";

function App() {
  const [page, setPage] = useState<Page>("typing");
  // Theme state: "light" | "dark"
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Track last pressed key for VirtualKeyboard
  const [lastKey, setLastKey] = useState<string | undefined>(undefined);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-zinc-900 via-gray-900 to-slate-800 dark:from-zinc-900 dark:to-slate-900 light:from-indigo-50 light:to-slate-200 transition-colors">
      <header className="sticky top-0 z-10 bg-black/70 dark:bg-black/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-zinc-800">
        <h2 className="text-xl font-semibold accent-text flex items-center gap-2">
          <span role="img" aria-label="Babadook">👻</span>
          The Babadook
        </h2>
        <nav className="flex gap-4 items-center">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Authenticated>
            <button
              className={`px-3 py-1 rounded ${page === "typing" ? "bg-zinc-800 text-white" : "bg-zinc-700 text-zinc-200"}`}
              onClick={() => setPage("typing")}
            >
              Typing
            </button>
            <button
              className={`px-3 py-1 rounded ${page === "leaderboard" ? "bg-zinc-800 text-white" : "bg-zinc-700 text-zinc-200"}`}
              onClick={() => setPage("leaderboard")}
            >
              Leaderboard
            </button>
            <button
              className={`px-3 py-1 rounded ${page === "profile" ? "bg-zinc-800 text-white" : "bg-zinc-700 text-zinc-200"}`}
              onClick={() => setPage("profile")}
            >
              Profile
            </button>
            <SignOutButton />
          </Authenticated>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <div className="w-full max-w-2xl mx-auto">
          <Content page={page} setPage={setPage} lastKey={lastKey} setLastKey={setLastKey} />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content({
  page,
  setPage,
  lastKey,
  setLastKey,
}: {
  page: Page;
  setPage: (p: Page) => void;
  lastKey: string | undefined;
  setLastKey: (k: string | undefined) => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [customText, setCustomText] = useState<string | null>(null);
  const [customTextId, setCustomTextId] = useState<string | null>(null);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold accent-text mb-4 flex items-center justify-center gap-2">
            <span role="img" aria-label="Babadook">👻</span>
            The Babadook
          </h1>
          <p className="text-xl text-slate-300 dark:text-slate-400">
            Enter your name to start typing with the Babadook!
          </p>
        </div>
        <SignInForm />
      </div>
    );
  }

  if (page === "profile") {
    return <Profile />;
  }

  if (page === "leaderboard") {
    return <Leaderboard mode="free" />;
  }

  // Typing page
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold accent-text mb-4 flex items-center justify-center gap-2">
          <span role="img" aria-label="Babadook">👻</span>
          The Babadook
        </h1>
        <p className="text-xl text-slate-300 dark:text-slate-400">
          Welcome, {loggedInUser?.name ?? "friend"}!
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <TypingTest
            text={customText ?? undefined}
            textId={customTextId ? (customTextId as Id<"texts">) : undefined}
            mode="free"
            onComplete={() => {
              setCustomText(null);
              setCustomTextId(null);
            }}
            setLastKey={setLastKey}
          />
          <VirtualKeyboard pressedKey={lastKey} />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <CustomTextManager
            onSelect={(text, textId) => {
              setCustomText(text);
              setCustomTextId(textId);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
