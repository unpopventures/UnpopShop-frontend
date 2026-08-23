import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ArchLogomark from "../ui/ArchLogomark";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/products", label: "Discover products" },
  { to: "/brands", label: "Brands" },
  { to: "/bulk-quote", label: "Bulk quote" },
];

export default function PublicNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const dashboardPath = user?.role === "ADMIN" ? "/admin" : user?.role === "MANUFACTURER" ? "/manufacturer" : "/buyer";

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100 bg-cream-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2">
          <ArchLogomark className="h-9 w-9" />
          <span className="font-display text-lg font-semibold text-forest-700">
            Unpop<span className="text-gold-500">.shop</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-forest-700" : "text-forest-400 hover:text-forest-600"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link to={dashboardPath} className="btn-primary">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register/manufacturer" className="btn-outline">
                Sell on Unpop
              </Link>
              <Link to="/register/buyer" className="btn-primary">
                Start sourcing
              </Link>
            </>
          )}
        </div>

        <button className="p-2 text-forest-600 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-forest-100 bg-cream-50 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm font-medium text-forest-600" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <hr className="border-forest-100" />
            {user ? (
              <Link to={dashboardPath} className="btn-primary w-full" onClick={() => setOpen(false)}>
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline w-full" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register/manufacturer" className="btn-outline w-full" onClick={() => setOpen(false)}>
                  Sell on Unpop
                </Link>
                <Link to="/register/buyer" className="btn-primary w-full" onClick={() => setOpen(false)}>
                  Start sourcing
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
