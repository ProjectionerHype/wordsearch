import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  updated?: string;
  children: ReactNode;
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground flex flex-col">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <main className="relative z-10 w-full max-w-2xl mx-auto px-5 md:px-6 py-8 md:py-12 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to game
        </Link>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
          {title}
        </h1>
        {updated && (
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-6">
            Last updated: {updated}
          </p>
        )}

        <article className="prose-content space-y-5 text-[15px] leading-relaxed text-foreground/85">
          {children}
        </article>

        <footer className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          <span className="ml-auto">© {new Date().getFullYear()} dailywordsearch.fun</span>
        </footer>
      </main>
    </div>
  );
}
