"use client";

import { RefreshCw } from "lucide-react";

export default function Error({ reset }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#121018,#241a24)] px-4 py-24 text-paper">
      <div className="max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose">Error</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">Something needs a refresh</h1>
        <p className="mt-5 text-paper/65">The app caught a temporary rendering issue. Try again without losing your page state.</p>
        <button onClick={reset} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-black text-ink transition hover:bg-paper">
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
