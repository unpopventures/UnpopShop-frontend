import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import ArchLogomark from "../ui/ArchLogomark";
import TempleSkyline from "../ui/TempleSkyline";
import { useAuth } from "../../context/AuthContext";

export interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

export default function DashboardShell({
  navItems,
  sectionLabel,
  greeting,
  subtitle,
  children,
}: {
  navItems: NavItem[];
  sectionLabel: string;
  greeting: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-cream-100">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-forest-500 px-4 py-6 text-cream-50 lg:flex">
        <NavLink to="/" className="mb-8 flex items-center gap-2 px-2">
          <ArchLogomark className="h-9 w-9" />
          <span className="font-display text-lg font-semibold">
            Unpop<span className="text-gold-400">.shop</span>
          </span>
        </NavLink>

        <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream-100/50">
          {sectionLabel}
        </p>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split("/").length <= 3}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-cream-50 text-forest-600 font-semibold" : "text-cream-100/80 hover:bg-forest-400/40"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream-100/70 hover:bg-forest-400/40"
        >
          <LogOut size={17} />
          Log out
        </button>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="relative overflow-hidden border-b border-forest-100 bg-cream-50 px-6 py-6 sm:px-8">
          <TempleSkyline className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-70" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl text-forest-700 sm:text-3xl">{greeting}</h1>
              <p className="mt-1 text-sm text-forest-400">{subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative rounded-full bg-white p-2.5 text-forest-500 shadow-card">
                <Bell size={18} />
              </button>
              <div className="hidden items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-card sm:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-500 text-xs font-semibold text-cream-50">
                  {initials}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-forest-700">{user?.name}</p>
                  <p className="text-[11px] text-forest-400">{sectionLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
