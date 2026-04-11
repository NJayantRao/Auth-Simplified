import { Link } from "react-router";

/* ── Feature data ── */
const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "JWT + Refresh Tokens",
    description: "Short-lived access tokens with automatic silent rotation. Sessions stay alive without re-login prompts.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
      </svg>
    ),
    title: "Redis Session Store",
    description: "Instant token revocation and rate-limiting backed by Redis. Force-logout any session from anywhere.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    title: "Role-Based Access",
    description: "Middleware-level RBAC. Define roles and permissions once, enforce them on every route.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "TypeScript First",
    description: "Full type safety end-to-end. Every token, payload and middleware is fully typed and exported.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Fast Integration",
    description: "Drop into Express, Fastify or Hono in under 5 minutes. Zero boilerplate, just import and go.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: "Secure by Default",
    description: "HttpOnly cookies, CORS config, bcrypt hashing, and brute-force protection included out of the box.",
  },
];

/* ── Stack badges ── */
const stack = ["Node.js", "TypeScript", "Express", "JWT", "Redis", "Prisma", "PostgreSQL", "Bcrypt"];

/* ── How it works steps ── */
const steps = [
  { num: "01", title: "Clone the repo", desc: "One command to get the full auth boilerplate on your machine." },
  { num: "02", title: "Configure your env", desc: "Set your DB, Redis URL, and JWT secret in a single .env file." },
  { num: "03", title: "Import & ship", desc: "Import the auth middleware, define your routes, and deploy." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            AuthSystem
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex h-8 items-center px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-85 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 mb-6 px-3 py-1 rounded-full border border-border text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Open source · MIT License
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-5">
            Authentication boilerplate
            <br className="hidden sm:block" />
            <span className="text-muted-foreground"> for modern apps.</span>
          </h1>

          <p className="mx-auto max-w-xl text-base text-muted-foreground leading-relaxed mb-8">
            Pre-built auth with JWT, refresh tokens, Redis, and role-based access.
            Plug into your backend and start shipping features.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Link
              to="/sign-up"
              className="inline-flex h-10 items-center px-5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-85 transition-opacity"
            >
              Use Template
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 px-5 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Stack badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {stack.map((tech) => (
              <span key={tech} className="px-2.5 py-1 text-xs font-medium rounded-md border border-border text-muted-foreground bg-muted/40">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

        {/* ── Features ── */}
        <section id="features" className="max-w-5xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">What&apos;s included</p>
            <h2 className="text-2xl font-bold tracking-tight">Everything you need. Nothing you don&apos;t.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {features.map(({ icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="mt-0.5 shrink-0 size-8 rounded-md border border-border flex items-center justify-center text-muted-foreground bg-muted/30">
                  {icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

        {/* ── How it works ── */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-2xl font-bold tracking-tight">Up and running in 3 steps.</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map(({ num, title, desc }) => (
              <div key={num}>
                <span className="text-3xl font-black text-muted-foreground/25 tabular-nums">{num}</span>
                <h3 className="text-sm font-semibold text-foreground mt-3 mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Code snippet */}
          <div className="mt-10 rounded-lg border border-border bg-muted/40 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/60">
              <span className="size-2.5 rounded-full bg-red-400/70" />
              <span className="size-2.5 rounded-full bg-yellow-400/70" />
              <span className="size-2.5 rounded-full bg-green-400/70" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">app.ts</span>
            </div>
            <pre className="px-5 py-4 text-xs font-mono text-foreground leading-relaxed overflow-x-auto">
              <code>{`import { authRouter, requireAuth, requireRole } from "@/auth"

app.use("/auth", authRouter)

app.get("/dashboard",
  requireAuth(),
  requireRole("admin"),
  (req, res) => res.json({ user: req.user })
)`}</code>
            </pre>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-5xl mx-auto px-6"><div className="border-t border-border" /></div>

        {/* ── CTA ── */}
        <section className="max-w-5xl mx-auto px-6 py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-3">Stop building auth from scratch.</h2>
          <p className="text-sm text-muted-foreground mb-7 max-w-md mx-auto">
            Your users deserve secure access. Your team deserves their time back.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/sign-up"
              className="inline-flex h-10 items-center px-6 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-85 transition-opacity"
            >
              Start Using AuthSystem
            </Link>
            <a
              href="#"
              className="inline-flex h-10 items-center px-6 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Read the Docs
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AuthSystem. Built for developers.</p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms", "GitHub"].map((link) => (
              <a key={link} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}