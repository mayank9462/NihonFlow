import { Link, useLocation } from "wouter";
import { Home, LayoutGrid, Type, BookOpen, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgress } from "@/hooks/useProgress";
import { XPBar } from "../XPBar";

export const NavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Hiragana", href: "/hiragana", icon: Type },
  { name: "Katakana", href: "/katakana", icon: LayoutGrid },
  { name: "Flashcards", href: "/flashcards", icon: BookOpen },
  { name: "Quiz", href: "/quiz", icon: Target },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const [location] = useLocation();
  const { profile } = useProgress();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border sticky top-0">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold font-jp">日</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">NihonFlow</span>
        </Link>
        <div className="mb-8">
          <XPBar xp={profile.xp} />
        </div>
        <nav className="flex flex-col gap-2">
          {NavItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.15)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-card hover:border-card-border border border-transparent"
                )}
                data-testid={`link-sidebar-${item.name.toLowerCase()}`}
              >
                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
