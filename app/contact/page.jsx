"use client";

import { useState } from "react";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { usePortfolioData } from "@/components/DataProvider";

export default function ContactPage() {
  const { addContact } = usePortfolioData();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function submit(event) {
    event.preventDefault();
    addContact(form);
    setForm({ name: "", email: "", message: "" });
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <div className="bg-[linear-gradient(180deg,#121018_0%,#1b1724_100%)] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="Contact" title="Tell me about the next build" copy="Messages are captured into the hidden admin dashboard through a mock local submission flow." />
        <div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
          <Reveal>
            <form onSubmit={submit} className="rounded-[2rem] border border-paper/10 bg-paper/[0.06] p-6 shadow-glow backdrop-blur-xl">
              <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-paper/70">Name</label>
              <input id="contact-name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mb-5 w-full rounded-2xl border border-paper/10 bg-ink/70 px-4 py-3 text-paper outline-none transition focus:border-gold" />
              <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-paper/70">Email</label>
              <input id="contact-email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mb-5 w-full rounded-2xl border border-paper/10 bg-ink/70 px-4 py-3 text-paper outline-none transition focus:border-gold" />
              <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-paper/70">Message</label>
              <textarea id="contact-message" required rows="6" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mb-5 w-full resize-none rounded-2xl border border-paper/10 bg-ink/70 px-4 py-3 text-paper outline-none transition focus:border-gold" />
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-bold text-ink transition hover:bg-paper">
                <Send className="h-4 w-4" />
                {sent ? "Message saved" : "Send message"}
              </button>
            </form>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-[2rem] border border-paper/10 bg-paper/[0.06] p-6">
              <h2 className="text-2xl font-bold">Social links</h2>
              <p className="mt-3 text-sm leading-7 text-paper/60">Prefer a direct line? Reach out through email or social profiles and I will follow up quickly.</p>
              <div className="mt-8 space-y-3">
                <Social icon={Mail} label="Email" href="mailto:hello@muhammadhasil.dev" />
                <Social icon={Github} label="GitHub" href="https://github.com/MrVenomYT" />
                <Social icon={Linkedin} label="LinkedIn" href="https://www.linkedin.com" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function Social({ icon: Icon, label, href }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} className="flex items-center gap-3 rounded-2xl border border-paper/10 bg-paper/[0.04] p-4 text-paper/70 transition hover:border-gold/40 hover:text-paper">
      <Icon className="h-5 w-5 text-gold" />
      {label}
    </a>
  );
}
