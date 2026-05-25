import { Link, useLocation } from "wouter";
import { NavItems } from "./Sidebar";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-t border-border z-50 px-2 pb-safe">
      <div className="h-full max-w-md mx-auto flex items-center justify-between">
        {NavItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full gap-1 relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              data-testid={`link-bottomnav-${item.name.toLowerCase()}`}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
              )}
              <item.icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} />
              <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
