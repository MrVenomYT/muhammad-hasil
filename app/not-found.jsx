import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#121018,#241a24)] px-4 py-24 text-paper">
      <div className="max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">Page not found</h1>
        <p className="mt-5 text-paper/65">The page you opened does not exist or has moved.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-black text-ink transition hover:bg-paper">
          <Home className="h-4 w-4" />
          Back home
        </Link>
      </div>
    </div>
  );
}
