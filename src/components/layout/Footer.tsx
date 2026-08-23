import { Link } from "react-router-dom";
import ArchLogomark from "../ui/ArchLogomark";

export default function Footer() {
  return (
    <footer className="border-t border-forest-100 bg-forest-500 text-cream-100/80">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ArchLogomark className="h-8 w-8" />
              <span className="font-display text-base font-semibold text-cream-50">Unpop.shop</span>
            </div>
            <p className="text-sm text-cream-100/60">
              The global sourcing platform for Indian homegrown brands and manufacturers.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-cream-100/50">Buyers</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-cream-50">Discover products</Link></li>
              <li><Link to="/bulk-quote" className="hover:text-cream-50">Request a bulk quote</Link></li>
              <li><Link to="/register/buyer" className="hover:text-cream-50">Create a buyer account</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-cream-100/50">Manufacturers</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register/manufacturer" className="hover:text-cream-50">List your brand</Link></li>
              <li><Link to="/login" className="hover:text-cream-50">Manufacturer login</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-cream-100/50">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#how-it-works" className="hover:text-cream-50">How Unpop works</Link></li>
              <li><a href="mailto:hello@unpop.shop" className="hover:text-cream-50">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-cream-50/10 pt-6 text-xs text-cream-100/50">
          © {new Date().getFullYear()} Unpop.shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
