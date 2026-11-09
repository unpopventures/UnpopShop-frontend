import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ArchLogomark from "../ui/ArchLogomark";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/products", label: "Shop" },
  { to: "/brands", label: "Brands" },
  { to: "/bulk-quote", label: "Wholesale" },
];

export default function PublicNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dashboardPath = user?.role === "ADMIN" ? "/admin" : user?.role === "MANUFACTURER" ? "/manufacturer" : "/buyer";

  return (
    <header className="sticky top-0 z-40 border-b border-forest-100/80 bg-cream-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Unpop home">
          <ArchLogomark className="h-9 w-9" />
          <span className="font-display text-lg font-semibold tracking-tight text-forest-700">
            Unpop<span className="text-gold-500">.shop</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-forest-700" : "text-forest-400 hover:text-forest-700"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link to={dashboardPath} className="btn-primary">My dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register/manufacturer" className="btn-outline">Sell on Unpop</Link>
              <Link to="/products" className="btn-primary">Explore products</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-forest-600 transition hover:bg-forest-50 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div id="mobile-navigation" className="border-t border-forest-100 bg-cream-50 px-5 py-4 sm:px-6 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-forest-600 hover:bg-forest-50"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="my-3 border-t border-forest-100" />
          {user ? (
            <Link to={dashboardPath} className="btn-primary w-full" onClick={() => setOpen(false)}>
              My dashboard
            </Link>
          ) : (
            <div className="grid gap-2">
              <Link to="/login" className="btn-outline w-full" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/register/manufacturer" className="btn-outline w-full" onClick={() => setOpen(false)}>Sell on Unpop</Link>
              <Link to="/products" className="btn-primary w-full" onClick={() => setOpen(false)}>Explore products</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
