import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../context/AuthContext";
import { apiErrorMessage } from "../../api/client";

const initial = { name: "", email: "", password: "", phone: "", companyName: "", country: "", city: "", industry: "" };

export default function RegisterBuyer() {
  const { registerBuyer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof initial>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerBuyer(form);
      toast.success("Welcome to Unpop.shop!");
      navigate("/buyer");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <PublicNavbar />
      <main className="flex-1 px-6 py-14">
        <div className="mx-auto max-w-xl">
          <p className="eyebrow mb-2 text-center">Buyer account</p>
          <h1 className="mb-1 text-center font-display text-2xl text-forest-700">Start sourcing from India</h1>
          <p className="mb-8 text-center text-sm text-forest-400">
            Browse verified manufacturers, submit bulk quotes, and let Unpop manage the negotiation.
          </p>

          <form onSubmit={handleSubmit} className="card grid gap-4 p-6 sm:grid-cols-2">
            <Field label="Full name" value={form.name} onChange={(v) => update("name", v)} required />
            <Field label="Work email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
            <Field label="Password" type="password" value={form.password} onChange={(v) => update("password", v)} required />
            <Field label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} />
            <Field label="Company name" value={form.companyName} onChange={(v) => update("companyName", v)} required />
            <Field label="Country" value={form.country} onChange={(v) => update("country", v)} required />
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} />
            <Field label="Industry" value={form.industry} onChange={(v) => update("industry", v)} />
            <div className="sm:col-span-2">
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Creating account..." : "Create buyer account"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-forest-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-gold-600 hover:underline">
              Log in
            </Link>
            . Manufacturer?{" "}
            <Link to="/register/manufacturer" className="font-semibold text-gold-600 hover:underline">
              List your brand
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input required={required} type={type} className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
