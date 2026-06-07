export default function SectionHeading({ eyebrow, title, copy, align = "center" }) {
  return (
    <div className={`mx-auto mb-10 max-w-3xl px-1 ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow && <p className="mb-3 inline-flex rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-gold sm:text-xs">{eyebrow}</p>}
      <h2 className="text-3xl font-black leading-tight tracking-tight text-paper sm:text-5xl">{title}</h2>
      {copy && <p className="mt-4 text-base leading-8 text-paper/62">{copy}</p>}
    </div>
  );
}
