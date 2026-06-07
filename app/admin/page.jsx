"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
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
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#f8f1e7,#eadfcc)] px-4 py-32 text-ink">
      <div className="w-full max-w-md rounded-[2rem] border border-ink/10 bg-paper p-6 shadow-[0_18px_55px_rgba(18,16,24,.12)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-plum/20 bg-plum/10">
            <LockKeyhole className="h-7 w-7 text-plum" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-plum">Hidden CMS</p>
          <h1 className="mt-3 text-3xl font-black">Admin access</h1>
        </div>
        <form onSubmit={submit}>
          <label htmlFor="admin-username" className="mb-2 block text-sm font-semibold text-ink/70">Username</label>
          <input id="admin-username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} className="mb-5 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-plum" />
          <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold text-ink/70">Password</label>
          <input id="admin-password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mb-5 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 outline-none transition focus:border-plum" />
          {error && <p className="mb-4 rounded-xl border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose">{error}</p>}
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-bold text-paper transition hover:bg-plum">
            <ShieldCheck className="h-4 w-4" />
            Enter dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
