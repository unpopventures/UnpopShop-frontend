import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PublicNavbar from "../../components/layout/PublicNavbar";
import Footer from "../../components/layout/Footer";
import ArchLogomark from "../../components/ui/ArchLogomark";
import { useAuth } from "../../context/AuthContext";
import { apiErrorMessage } from "../../api/client";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      const dest = user.role === "ADMIN" ? "/admin" : user.role === "MANUFACTURER" ? "/manufacturer" : "/buyer";
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(dest);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <PublicNavbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <ArchLogomark className="mb-3 h-12 w-12" />
            <h1 className="font-display text-2xl text-forest-700">Welcome back</h1>
            <p className="mt-1 text-sm text-forest-400">Log in to your Unpop.shop account</p>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-4 p-6">
            <div>
              <label className="label">Email</label>
              <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                required
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-forest-400">
            New to Unpop?{" "}
            <Link to="/register/buyer" className="font-semibold text-gold-600 hover:underline">
              Create a buyer account
            </Link>{" "}
            or{" "}
            <Link to="/register/manufacturer" className="font-semibold text-gold-600 hover:underline">
              list your brand
            </Link>
            .
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-forest-200 bg-cream-100 p-4 text-xs text-forest-400">
            <p className="mb-1 font-semibold text-forest-600">Demo logins (after seeding the database)</p>
            <p>Buyer: buyer@example.com / Buyer@12345</p>
            <p>Manufacturer: sriveni@example.com / Manufacturer@123</p>
            <p>Admin: admin@unpop.shop / Admin@12345</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
