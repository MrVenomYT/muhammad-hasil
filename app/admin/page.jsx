"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { setAdminAuthed } from "@/lib/portfolioStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (form.username === "Muhammad Hasil" && form.password === "H03214981005a") {
      setAdminAuthed(true);
      router.push("/admin/dashboard");
      return;
    }
    setError("Invalid admin credentials.");
  }

  return (
    <div className="aurora-shell min-h-screen px-4 py-10 text-paper sm:px-6 lg:px-8">
      <div className="precision-grid fixed inset-0 pointer-events-none" />
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden lg:block">
          <div className="glass-panel rounded-[2.2rem] p-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-gold">
              <Sparkles className="h-4 w-4" />
              Private portfolio studio
            </p>
            <h1 className="mt-8 text-6xl font-black tracking-tight">Control every portfolio section from one place.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-paper/62">Projects, reviews, certificates, jobs, profile content, Fiverr hire link, and contact messages stay editable without exposing the dashboard publicly.</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {["Hidden route", "Local CMS", "Vercel ready"].map((item) => (
                <div key={item} className="rounded-3xl border border-paper/10 bg-paper/[0.055] p-5">
                  <ShieldCheck className="mb-4 h-6 w-6 text-gold" />
                  <p className="font-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel w-full rounded-[2.2rem] p-5 shadow-glow sm:p-8">
          <div className="mb-8">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl border border-gold/25 bg-gold/15">
              <LockKeyhole className="h-7 w-7 text-gold" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-gold">Admin access</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Welcome back.</h1>
            <p className="mt-3 text-sm leading-6 text-paper/58">Sign in to manage your portfolio content and dashboard data.</p>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="admin-username" className="mb-2 block text-sm font-bold text-paper/70">Username</label>
              <input id="admin-username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className="w-full rounded-2xl border border-paper/10 bg-ink/55 px-4 py-3 text-paper outline-none transition placeholder:text-paper/30 focus:border-gold focus:ring-4 focus:ring-gold/10" />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-bold text-paper/70">Password</label>
              <input id="admin-password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-2xl border border-paper/10 bg-ink/55 px-4 py-3 text-paper outline-none transition placeholder:text-paper/30 focus:border-gold focus:ring-4 focus:ring-gold/10" />
            </div>
            {error && <p className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-sm font-bold text-rose">{error}</p>}
            <button className="magnetic-hover inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 font-black text-ink transition hover:bg-paper">
              Enter dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
