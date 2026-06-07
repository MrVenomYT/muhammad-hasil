"use client";

import { RefreshCw } from "lucide-react";

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink text-paper">
        <div className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#121018,#241a24)] px-4 py-24">
          <div className="max-w-xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose">App error</p>
            <h1 className="mt-4 text-4xl font-black sm:text-6xl">Portfolio recovered an issue</h1>
            <p className="mt-5 text-paper/65">A required app boundary caught the error. Retry the page after the cache refresh.</p>
            <button onClick={reset} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-black text-ink transition hover:bg-paper">
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
