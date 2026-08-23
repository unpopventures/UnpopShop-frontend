import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Brand } from "../../types";
import { Badge } from "../ui/Primitives";

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link to={`/brands/${brand.id}`} className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-500 font-display text-lg text-cream-50">
        {brand.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold text-forest-700">{brand.name}</p>
        <p className="flex items-center gap-1 truncate text-xs text-forest-400">
          <MapPin size={11} /> {brand.state || brand.manufacturer?.state || "India"}
        </p>
      </div>
      {brand.manufacturer?.verificationStatus === "VERIFIED" && <Badge tone="success">Verified</Badge>}
    </Link>
  );
}
