import { ArrowRight, ClipboardCheck, Factory, Globe2, PackageSearch, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Footer from "../../components/layout/Footer";

const steps = [
  { icon: <ClipboardCheck size={20} />, title: "Create your manufacturer profile", body: "Share your company details, location, capabilities and the products you make." },
  { icon: <PackageSearch size={20} />, title: "Build your product catalogue", body: "Add specifications, minimum order quantities, capacity, packaging and indicative wholesale pricing." },
  { icon: <ShieldCheck size={20} />, title: "Complete verification by email", body: "The Unpop team will email you if supporting documents are required. Reply to that email with the requested documents for manual review." },
  { icon: <Globe2 size={20} />, title: "Get discovered by bulk buyers", body: "Make your supply capabilities easier for domestic and international buyers to find and enquire about." },
];

const profileItems = [
  "Company details and manufacturing location",
  "Product categories and specifications",
  "Minimum order quantities and production capacity",
  "Packaging options and lead times",
  "Relevant certifications and registrations (as applicable)",
  "Export experience and destination markets, where applicable",
];

export default function ManufacturersLanding() {
  return (
    <div className="min-h-screen bg-cream-50">
      <PublicNavbar />
      <main>
        <section className="bg-hero-pattern">
          <div className="section-shell grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div>
              <p className="eyebrow mb-4">For Indian manufacturers and homegrown brands</p>
              <h1 className="max-w-2xl text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">
                Take your products to a wider market.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-forest-500 sm:text-lg">
                Build your business profile on Unpop, showcase what you manufacture and make it easier for bulk buyers
                to discover your products and start a sourcing conversation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/register/manufacturer" className="btn-primary">
                  Register as a manufacturer <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn-outline">Already registered? Log in</Link>
              </div>
              <p className="mt-4 text-xs text-forest-400">
                Registration is an application to join the Unpop network. Verification and buyer enquiries are subject to review and availability.
              </p>
            </div>
            <div className="relative">
              <div className="surface-warm rounded-[2rem] border border-forest-100 p-7 shadow-card sm:p-9">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-500 text-cream-50">
                  <Factory size={24} />
                </div>
                <p className="eyebrow mb-2">Your supply profile</p>
                <h2 className="mb-6 text-2xl">Give buyers the information they need to source with confidence.</h2>
                <div className="space-y-3">
                  {profileItems.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-forest-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-600">
                        <ShieldCheck size={13} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-forest-100 bg-white p-4 shadow-card sm:block">
                <div className="flex items-center gap-3">
                  <Users className="text-gold-600" size={22} />
                  <div>
                    <p className="text-sm font-semibold text-forest-700">One structured profile</p>
                    <p className="text-xs text-forest-400">For buyer discovery and enquiries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell section-space">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="eyebrow mb-2">How it works</p>
            <h2 className="text-3xl sm:text-4xl">A clearer way to present your manufacturing business</h2>
            <p className="mt-4 text-sm leading-6 text-forest-400">
              Unpop is building a structured Indian manufacturer network for buyers looking for products and reliable supply partners.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <article key={step.title} className="card p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-forest-500 text-cream-50">
                  {step.icon}
                </div>
                <p className="mb-2 text-xs font-semibold tracking-widest text-gold-600">STEP 0{index + 1}</p>
                <h3 className="mb-2 text-lg">{step.title}</h3>
                <p className="text-sm leading-6 text-forest-400">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-cream-100">
          <div className="section-shell grid gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-2">Built for B2B sourcing</p>
              <h2 className="text-3xl">More than a product listing</h2>
              <p className="mt-4 text-sm leading-7 text-forest-500">
                A useful manufacturer profile helps buyers understand not just what you sell, but how you can supply:
                product specifications, order quantities, production capability, packaging and relevant documentation.
              </p>
            </div>
            <div className="card p-6 sm:p-8">
              <h3 className="mb-4 text-xl">What to prepare</h3>
              <ul className="space-y-3 text-sm text-forest-500">
                {[
                  "Company and contact information",
                  "Product list, descriptions and clear photographs",
                  "MOQ, production capacity and lead times",
                  "Relevant registrations and certifications, if applicable (the Unpop team will request supporting documents by email)",
                  "Packaging details and current markets served",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-semibold text-gold-600">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="section-shell py-16">
          <div className="rounded-[2rem] bg-forest-500 px-7 py-10 text-center text-cream-50 sm:px-12 sm:py-14">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-400">Join the Unpop manufacturer network</p>
            <h2 className="mx-auto max-w-2xl text-3xl text-cream-50 sm:text-4xl">Start building your supply profile today.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-cream-100/75">
              Register your business and begin adding the information buyers need to discover and evaluate your products.
            </p>
            <Link to="/register/manufacturer" className="btn-gold mt-7">
              Create manufacturer account <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
