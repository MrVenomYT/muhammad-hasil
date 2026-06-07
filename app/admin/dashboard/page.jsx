"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "@/components/Motion";
import {
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ExternalLink,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Plus,
  Save,
  Sparkles,
  Star,
  Trash2,
  UserRound
} from "lucide-react";
import { projectTags, defaultProfileInfo } from "@/lib/defaultData";
import { generateProjectThumbnail } from "@/lib/thumbnailGenerator";
import { normalizeList } from "@/lib/projectUtils";
import { isAdminAuthed, setAdminAuthed, uid } from "@/lib/portfolioStore";
import { usePortfolioData } from "@/components/DataProvider";

const initialProject = { title: "", description: "", liveUrl: "", thumbnail: "", tag: "Next.js", features: "", technologies: "", frameworks: "", tools: "" };
const initialReview = { name: "", role: "", rating: 5, message: "" };
const emptyInfoItem = { title: "", organization: "", year: "", description: "" };
const emptyCertificateItem = { title: "", organization: "", provider: "", credentialUrl: "", year: "", description: "" };
const emptySkill = { title: "", level: 80 };

function getSidebarGroups(data, profileDraft) {
  return [
    {
      label: "Dashboard",
      items: [
        { id: "overview", target: "overview", label: "Overview", hint: "Stats and actions", icon: LayoutDashboard, count: "Live" },
        { id: "inbox", target: "inbox", label: "Contact Inbox", hint: "Client messages", icon: Inbox, count: data.contacts.length }
      ]
    },
    {
      label: "Content",
      items: [
        { id: "projects", target: "projects", label: "Projects", hint: "Cards and tags", icon: FolderKanban, count: data.projects.length },
        { id: "reviews", target: "reviews", label: "Reviews", hint: "Testimonials", icon: Star, count: data.reviews.length },
        { id: "about", target: "about", label: "About Profile", hint: "Bio and hire link", icon: UserRound, count: profileDraft.skills.length }
      ]
    },
    {
      label: "Profile Proof",
      items: [
        { id: "education", target: "credentials", label: "Education", hint: "Studies history", icon: BookOpen, count: profileDraft.education.length },
        { id: "certificates", target: "credentials", label: "Certificates", hint: "Credential links", icon: Award, count: profileDraft.certificates.length },
        { id: "experience", target: "credentials", label: "Experience", hint: "Current and past jobs", icon: BriefcaseBusiness, count: profileDraft.experience.length }
      ]
    }
  ];
}

export default function DashboardPage() {
  const router = useRouter();
  const data = usePortfolioData();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [project, setProject] = useState(initialProject);
  const [review, setReview] = useState(initialReview);
  const [profileDraft, setProfileDraft] = useState(defaultProfileInfo);
  const [skillDraft, setSkillDraft] = useState(emptySkill);
  const [itemDrafts, setItemDrafts] = useState({
    education: emptyInfoItem,
    certificates: emptyCertificateItem,
    experience: emptyInfoItem
  });
  const projectPreviewThumbnail = useMemo(() => (
    project.title ? project.thumbnail || generateProjectThumbnail(project) : ""
  ), [project]);

  useEffect(() => {
    if (!isAdminAuthed()) {
      router.replace("/admin");
      return;
    }
    setCheckedAuth(true);
  }, [router]);

  useEffect(() => {
    if (data.profileInfo) setProfileDraft(data.profileInfo);
  }, [data.profileInfo]);

  function logout() {
    setAdminAuthed(false);
    router.push("/admin");
  }

  const sidebarGroups = getSidebarGroups(data, profileDraft);

  function jumpTo(target, activeId = target) {
    setActiveSection(activeId);
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addProject(event) {
    event.preventDefault();
    const thumbnail = project.thumbnail || generateProjectThumbnail(project);
    data.addProject({
      ...project,
      thumbnail,
      features: normalizeList(project.features),
      technologies: normalizeList(project.technologies),
      frameworks: normalizeList(project.frameworks, [project.tag]),
      tools: normalizeList(project.tools)
    });
    setProject(initialProject);
  }

  function addReview(event) {
    event.preventDefault();
    data.addReview(review);
    setReview(initialReview);
  }

  function uploadThumbnail(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProject((current) => ({ ...current, thumbnail: reader.result }));
    reader.readAsDataURL(file);
  }

  function updateProfile(nextProfile) {
    setProfileDraft(nextProfile);
    data.updateProfileInfo(nextProfile);
  }

  function addSkill(event) {
    event.preventDefault();
    updateProfile({
      ...profileDraft,
      skills: [{ ...skillDraft, id: uid("skill"), level: Number(skillDraft.level || 80) }, ...profileDraft.skills]
    });
    setSkillDraft(emptySkill);
  }

  function deleteSkill(id) {
    updateProfile({ ...profileDraft, skills: profileDraft.skills.filter((skill) => skill.id !== id) });
  }

  function addInfoItem(event, section) {
    event.preventDefault();
    updateProfile({
      ...profileDraft,
      [section]: [{ ...itemDrafts[section], id: uid(section) }, ...profileDraft[section]]
    });
    setItemDrafts({ ...itemDrafts, [section]: section === "certificates" ? emptyCertificateItem : emptyInfoItem });
  }

  function deleteInfoItem(section, id) {
    updateProfile({ ...profileDraft, [section]: profileDraft[section].filter((item) => item.id !== id) });
  }

  if (!checkedAuth) {
    return (
      <div className="aurora-shell grid min-h-screen place-items-center px-4 text-paper">
        <div className="glass-panel rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-pulse rounded-2xl bg-gold" />
          <p className="text-sm font-black uppercase tracking-[0.24em] text-gold">Checking access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef6ff] text-ink">
      <div className="flex min-h-screen">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-80 border-r border-white/10 bg-ink text-paper shadow-[20px_0_70px_rgba(15,23,42,.22)] lg:block">
          <Sidebar groups={sidebarGroups} activeSection={activeSection} onJump={jumpTo} onLogout={logout} />
        </aside>

        <div className="min-w-0 flex-1 lg:pl-80">
          <MobileNav groups={sidebarGroups} activeSection={activeSection} onJump={jumpTo} onLogout={logout} />

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <section id="overview" className="scroll-mt-24">
              <HeroHeader />

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Stat icon={BarChart3} label="Total visits" value={data.visits.toLocaleString()} tone="gold" />
                <Stat icon={FolderKanban} label="Projects" value={data.projects.length} tone="plum" />
                <Stat icon={MessageSquareText} label="Reviews" value={data.reviews.length} tone="teal" />
                <Stat icon={Inbox} label="Messages" value={data.contacts.length} tone="rose" />
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
                <Panel title="Portfolio health" eyebrow="Live overview" icon={Sparkles}>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <HealthItem label="Content CMS" value="Active" />
                    <HealthItem label="Public routes" value="Ready" />
                    <HealthItem label="Vercel build" value="Passing" />
                  </div>
                </Panel>
                <Panel title="Quick actions" eyebrow="Move fast" icon={CheckCircle2}>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <QuickAction label="Add project" icon={Plus} onClick={() => jumpTo("projects")} />
                    <QuickAction label="Update about" icon={FileText} onClick={() => jumpTo("about")} />
                    <QuickAction label="Add certificate" icon={Award} onClick={() => jumpTo("credentials", "certificates")} />
                  </div>
                </Panel>
              </div>
            </section>

            <section id="projects" className="mt-8 scroll-mt-24">
              <SectionTitle icon={FolderKanban} title="Project manager" copy="Create frontend project cards, assign tags, and publish them instantly to public project routes." />
              <div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
                <Panel title="Create project" eyebrow="Public portfolio" icon={Plus}>
                  <form onSubmit={addProject} className="space-y-4">
                    <Input label="Title" value={project.title} onChange={(value) => setProject({ ...project, title: value })} />
                    <Input label="Live URL" value={project.liveUrl} onChange={(value) => setProject({ ...project, liveUrl: value })} />
                    <Textarea id="project-description" label="Description" value={project.description} onChange={(value) => setProject({ ...project, description: value })} />
                    <Select label="Tag" value={project.tag} onChange={(value) => setProject({ ...project, tag: value })} options={projectTags} />
                    <Textarea id="project-features" label="Features" required={false} placeholder="One feature per line" value={project.features} onChange={(value) => setProject({ ...project, features: value })} />
                    <Textarea id="project-technologies" label="Technologies" required={false} placeholder="JavaScript, Tailwind CSS, API..." value={project.technologies} onChange={(value) => setProject({ ...project, technologies: value })} />
                    <Textarea id="project-frameworks" label="Frameworks" required={false} placeholder="React.js, Next.js, Node.js..." value={project.frameworks} onChange={(value) => setProject({ ...project, frameworks: value })} />
                    <Textarea id="project-tools" label="Tools used" required={false} placeholder="GitHub, Vercel, Figma..." value={project.tools} onChange={(value) => setProject({ ...project, tools: value })} />
                    <div className="rounded-2xl border border-plum/15 bg-plum/5 p-4">
                      <p className="text-sm font-black text-plum">AI thumbnail is automatic</p>
                      <p className="mt-1 text-xs leading-5 text-ink/55">Leave upload empty and the dashboard will generate a custom project thumbnail from the title, tag, and description.</p>
                    </div>
                    {project.title && (
                      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
                        <img src={projectPreviewThumbnail} alt="Generated project thumbnail preview" width="1200" height="750" className="aspect-[16/10] w-full object-cover" />
                      </div>
                    )}
                    <FileInput label="Optional custom thumbnail upload" onChange={uploadThumbnail} />
                    <ActionButton label="Create project" icon={Plus} />
                  </form>
                </Panel>
                <ListPanel title="Published projects" icon={FolderKanban}>
                  {data.projects.map((item) => <Row key={item.id} title={item.title} meta={item.isDefault ? `${item.tag} / Default` : item.tag} onDelete={item.isDefault ? null : () => data.deleteProject(item.id)} />)}
                </ListPanel>
              </div>
            </section>

            <section id="reviews" className="mt-8 scroll-mt-24">
              <SectionTitle icon={Star} title="Review manager" copy="Manage testimonials and keep client feedback polished." />
              <div className="grid gap-6 xl:grid-cols-[.95fr_1.05fr]">
                <Panel title="Add review" eyebrow="Testimonials" icon={Star}>
                  <form onSubmit={addReview} className="space-y-4">
                    <Input label="Name" value={review.name} onChange={(value) => setReview({ ...review, name: value })} />
                    <Input label="Role" value={review.role} onChange={(value) => setReview({ ...review, role: value })} />
                    <Input label="Rating" type="number" min="1" max="5" value={review.rating} onChange={(value) => setReview({ ...review, rating: value })} />
                    <Textarea id="review-message" label="Message" value={review.message} onChange={(value) => setReview({ ...review, message: value })} />
                    <ActionButton label="Add review" icon={Plus} />
                  </form>
                </Panel>
                <ListPanel title="Current reviews" icon={MessageSquareText}>
                  {data.reviews.map((item) => <Row key={item.id} title={item.name} meta={item.isDefault ? `${item.role} / Default` : item.role} copy={`${item.rating}/5 stars`} onDelete={item.isDefault ? null : () => data.deleteReview(item.id)} />)}
                </ListPanel>
              </div>
            </section>

            <section id="about" className="mt-8 scroll-mt-24">
              <SectionTitle icon={UserRound} title="About page CMS" copy="Control biography, highlights, hire link, and skill badges from one clean editor." />
              <Panel title="Profile information" eyebrow="About content" icon={UserRound}>
                <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
                  <div>
                    <Textarea id="profile-bio" label="Professional bio" rows="7" value={profileDraft.bio} onChange={(value) => updateProfile({ ...profileDraft, bio: value })} />
                    <div className="mt-4">
                      <Input label="Hire Me Fiverr Link" type="url" required={false} placeholder="https://www.fiverr.com/your-profile" value={profileDraft.hireMeUrl || ""} onChange={(value) => updateProfile({ ...profileDraft, hireMeUrl: value })} />
                    </div>
                    <label htmlFor="profile-highlights" className="mt-4 block text-sm font-black text-ink/70">Highlights</label>
                    <textarea
                      id="profile-highlights"
                      rows="5"
                      value={profileDraft.highlights.join("\n")}
                      onChange={(event) => updateProfile({ ...profileDraft, highlights: event.target.value.split("\n").filter(Boolean) })}
                      className="mt-2 w-full resize-none rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-plum focus:ring-4 focus:ring-plum/10"
                    />
                  </div>
                  <div>
                    <form onSubmit={addSkill} className="rounded-[1.4rem] border border-ink/10 bg-white p-4 shadow-[0_16px_45px_rgba(18,16,24,.06)]">
                      <h3 className="mb-4 flex items-center gap-2 text-xl font-black"><UserRound className="h-5 w-5 text-plum" /> Add skill</h3>
                      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                        <Input label="Skill title" value={skillDraft.title} onChange={(value) => setSkillDraft({ ...skillDraft, title: value })} />
                        <Input label="Level" type="number" min="1" max="100" value={skillDraft.level} onChange={(value) => setSkillDraft({ ...skillDraft, level: value })} />
                      </div>
                      <ActionButton label="Save skill" icon={Save} />
                    </form>
                    <div className="mt-4 space-y-3">
                      {profileDraft.skills.map((skill) => (
                        <Row key={skill.id} title={skill.title} meta={`${skill.level}%`} onDelete={() => deleteSkill(skill.id)} compact />
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>
            </section>

            <section id="credentials" className="mt-8 scroll-mt-24">
              <SectionTitle icon={Award} title="Education, certificates, jobs" copy="A professional profile area with proof links and career history." />
              <div className="grid gap-6 xl:grid-cols-3">
                <InfoManager icon={BookOpen} title="Education" section="education" draft={itemDrafts.education} setDraft={(draft) => setItemDrafts({ ...itemDrafts, education: draft })} items={profileDraft.education} onAdd={addInfoItem} onDelete={deleteInfoItem} />
                <InfoManager icon={Award} title="Certificates" section="certificates" draft={itemDrafts.certificates} setDraft={(draft) => setItemDrafts({ ...itemDrafts, certificates: draft })} items={profileDraft.certificates} onAdd={addInfoItem} onDelete={deleteInfoItem} certificateMode />
                <InfoManager icon={BriefcaseBusiness} title="Experience" section="experience" draft={itemDrafts.experience} setDraft={(draft) => setItemDrafts({ ...itemDrafts, experience: draft })} items={profileDraft.experience} onAdd={addInfoItem} onDelete={deleteInfoItem} />
              </div>
            </section>

            <section id="inbox" className="mt-8 scroll-mt-24 pb-10">
              <SectionTitle icon={Inbox} title="Contact inbox" copy="View and delete messages submitted from the contact page." />
              <ListPanel title="Contact submissions" icon={Inbox}>
                {data.contacts.length ? data.contacts.map((item) => <Row key={item.id} title={item.name} meta={item.email} copy={item.message} onDelete={() => data.deleteContact(item.id)} />) : <EmptyState label="No contact submissions yet." />}
              </ListPanel>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ groups, activeSection, onJump, onLogout }) {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.07] p-5 shadow-[0_18px_55px_rgba(0,0,0,.18)]">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gold text-ink shadow-glow">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="relative mt-4 text-2xl font-black">Hasil Studio</h2>
        <p className="relative mt-2 text-sm leading-6 text-paper/58">A clean portfolio CMS for projects, profile proof, reviews, and inbox.</p>
      </div>
      <nav className="mt-6 space-y-5 overflow-auto pr-1">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.24em] text-paper/35">{group.label}</p>
            <div className="space-y-2">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => onJump(item.target, item.id)} className={`group flex w-full items-center gap-3 rounded-[1.3rem] px-3 py-3 text-left transition ${active ? "bg-gold text-ink shadow-glow" : "text-paper/68 hover:bg-white/8 hover:text-paper"}`}>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${active ? "bg-ink/10" : "bg-paper/8 group-hover:bg-paper/12"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black">{item.label}</span>
                      <span className={`block truncate text-xs ${active ? "text-ink/58" : "text-paper/38"}`}>{item.hint}</span>
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-black ${active ? "bg-ink/10 text-ink" : "bg-paper/8 text-paper/55"}`}>{item.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <button onClick={onLogout} className="mt-auto flex items-center gap-3 rounded-2xl border border-paper/10 px-4 py-3 text-sm font-black text-paper/70 transition hover:border-rose/40 hover:text-rose">
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </div>
  );
}

function MobileNav({ groups, activeSection, onJump, onLogout }) {
  const items = groups.flatMap((group) => group.items);

  return (
    <div className="sticky top-0 z-30 border-b border-ink/10 bg-[#eef6ff]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-plum">Dashboard</p>
          <h1 className="text-xl font-black">Hasil Admin</h1>
        </div>
        <button onClick={onLogout} className="rounded-2xl border border-ink/10 bg-white p-3 text-ink/60">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => onJump(item.target, item.id)} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${activeSection === item.id ? "bg-ink text-paper" : "bg-white text-ink/62"}`}>
              <Icon className="h-4 w-4" />
              {item.label}
              <span className={`rounded-full px-2 py-0.5 ${activeSection === item.id ? "bg-paper/15" : "bg-ink/5"}`}>{item.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HeroHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] bg-ink p-6 text-paper shadow-[0_24px_80px_rgba(15,23,42,.22)] sm:p-8">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-plum/20 blur-3xl" />
      <div className="relative z-10 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="inline-flex rounded-full bg-gold/15 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-gold">Private dashboard</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">Portfolio Command Center</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-paper/62 sm:text-base">Manage projects, testimonials, messages, certificates, hire links, and About page content from one responsive workspace.</p>
        </div>
        <div className="rounded-[1.4rem] border border-paper/10 bg-paper/8 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-paper/42">Status</p>
          <p className="mt-2 flex items-center gap-2 text-lg font-black text-gold"><CheckCircle2 className="h-5 w-5" /> Live CMS</p>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, tone }) {
  const tones = {
    gold: "bg-gold/12 text-gold",
    plum: "bg-plum/12 text-plum",
    teal: "bg-teal/12 text-teal",
    rose: "bg-rose/12 text-rose"
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-[1.6rem] border border-white bg-white/90 p-5 shadow-[0_18px_55px_rgba(18,16,24,.08)] backdrop-blur">
      <div className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-4xl font-black">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink/45">{label}</p>
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, copy }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-plum"><Icon className="h-4 w-4" /> Manager</p>
        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/55">{copy}</p>
      </div>
    </div>
  );
}

function Panel({ title, eyebrow, icon: Icon, children, className = "" }) {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`rounded-[1.8rem] border border-white bg-white/90 p-5 shadow-[0_18px_55px_rgba(15,23,42,.08)] backdrop-blur sm:p-6 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow && <p className="text-xs font-black uppercase tracking-[0.22em] text-plum/70">{eyebrow}</p>}
          <h3 className="mt-1 text-2xl font-black">{title}</h3>
        </div>
        {Icon && <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-gold"><Icon className="h-5 w-5" /></div>}
      </div>
      {children}
    </motion.section>
  );
}

function ListPanel({ title, icon: Icon, children }) {
  return (
    <Panel title={title} eyebrow="Current data" icon={Icon}>
      <div className="max-h-[34rem] space-y-3 overflow-auto pr-1">{children}</div>
    </Panel>
  );
}

function InfoManager({ icon: Icon, title, section, draft, setDraft, items, onAdd, onDelete, certificateMode = false }) {
  return (
    <Panel title={title} eyebrow="Profile data" icon={Icon}>
      <form onSubmit={(event) => onAdd(event, section)} className="space-y-4">
        <Input label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
        <Input label={certificateMode ? "Issuer / Platform" : "Organization"} value={draft.organization} onChange={(value) => setDraft({ ...draft, organization: value })} />
        {certificateMode && (
          <>
            <Input label="Provider" required={false} placeholder="LinkedIn, Udemy, Coursera..." value={draft.provider} onChange={(value) => setDraft({ ...draft, provider: value })} />
            <Input label="Certificate Link" type="url" required={false} placeholder="https://..." value={draft.credentialUrl} onChange={(value) => setDraft({ ...draft, credentialUrl: value })} />
          </>
        )}
        <Input label="Year" value={draft.year} onChange={(value) => setDraft({ ...draft, year: value })} />
        <Textarea id={`${section}-description`} label="Description" value={draft.description} onChange={(value) => setDraft({ ...draft, description: value })} />
        <ActionButton label={`Add ${title}`} icon={Plus} />
      </form>
      <div className="mt-5 space-y-3">
        {items.map((item) => <Row key={item.id} title={item.title} meta={certificateMode ? `${item.provider || "Certificate"} / ${item.year}` : item.year} copy={item.credentialUrl || item.organization} link={item.credentialUrl} onDelete={() => onDelete(section, item.id)} compact />)}
      </div>
    </Panel>
  );
}

function HealthItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/42">{label}</p>
      <p className="mt-3 flex items-center gap-2 text-lg font-black text-teal"><CheckCircle2 className="h-5 w-5" /> {value}</p>
    </div>
  );
}

function QuickAction({ label, icon: Icon, onClick }) {
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} onClick={onClick} className="flex items-center justify-between rounded-2xl border border-ink/8 bg-white px-4 py-4 text-left font-black transition hover:border-plum/30 hover:text-plum">
      <span className="flex items-center gap-3"><Icon className="h-5 w-5" /> {label}</span>
      <Plus className="h-4 w-4" />
    </motion.button>
  );
}

function Input({ label, value, onChange, type = "text", required = true, ...props }) {
  const fallbackId = useId();
  const id = `dashboard-${label.toLowerCase().replaceAll(" ", "-")}-${fallbackId.replaceAll(":", "")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-black text-ink/70">{label}</label>
      <input id={id} required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-plum focus:ring-4 focus:ring-plum/10" {...props} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  const fallbackId = useId();
  const id = `dashboard-${label.toLowerCase()}-${fallbackId.replaceAll(":", "")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-black text-ink/70">{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-plum focus:ring-4 focus:ring-plum/10">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

function FileInput({ label, onChange }) {
  const fallbackId = useId();
  const id = `dashboard-file-${fallbackId.replaceAll(":", "")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-black text-ink/70">{label}</label>
      <input id={id} type="file" accept="image/*" onChange={onChange} className="w-full rounded-2xl border border-dashed border-ink/18 bg-white px-4 py-4 text-sm text-ink/62 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-black file:text-paper hover:border-plum/40" />
    </div>
  );
}

function Textarea({ id, label, value, onChange, rows = 4, required = true, placeholder = "" }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-black text-ink/70">{label}</label>
      <textarea id={id} required={required} placeholder={placeholder} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} className="w-full resize-none rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-ink/35 focus:border-plum focus:ring-4 focus:ring-plum/10" />
    </div>
  );
}

function ActionButton({ label, icon: Icon }) {
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3 font-black text-paper shadow-[0_14px_35px_rgba(18,16,24,.2)] transition hover:bg-plum">
      <Icon className="h-4 w-4" />
      {label}
    </motion.button>
  );
}

function Row({ title, meta, copy, link, onDelete, compact = false }) {
  return (
    <motion.div whileHover={{ y: -2 }} className={`rounded-2xl border border-ink/10 bg-white ${compact ? "p-3" : "p-4"} shadow-[0_12px_35px_rgba(18,16,24,.05)]`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-black">{title}</h3>
          <p className="mt-1 text-sm font-bold text-plum">{meta}</p>
        </div>
        {onDelete ? (
          <button onClick={onDelete} className="shrink-0 rounded-xl border border-ink/10 p-2 text-ink/45 transition hover:border-rose/40 hover:text-rose" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        ) : (
          <span className="shrink-0 rounded-xl border border-ink/10 bg-ink/5 px-3 py-2 text-xs font-black text-ink/42">Default</span>
        )}
      </div>
      {copy && (
        link ? (
          <a href={link} target="_blank" className="mt-3 inline-flex max-w-full items-center gap-2 break-all text-sm font-black leading-6 text-plum hover:text-rose">
            <ExternalLink className="h-4 w-4 shrink-0" />
            {copy}
          </a>
        ) : (
          <p className="mt-3 text-sm leading-6 text-ink/58">{copy}</p>
        )
      )}
    </motion.div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/18 bg-white/65 p-8 text-center text-sm font-bold text-ink/45">
      {label}
    </div>
  );
}
