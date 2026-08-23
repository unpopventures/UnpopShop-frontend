import { Link } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import { Product } from "../../types";
import { Badge } from "../ui/Primitives";

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}) {
  return (
    <div className="card group overflow-hidden">
      <div className="relative flex h-36 items-center justify-center bg-cream-200 text-forest-300">
        <span className="font-display text-3xl">{product.name.charAt(0)}</span>
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-card ${
              isFavorite ? "text-red-500" : "text-forest-300 hover:text-red-400"
            }`}
          >
            <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="eyebrow mb-1">{product.category?.name}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mb-1 truncate font-display text-base text-forest-700 group-hover:text-gold-600">
            {product.name}
          </h3>
        </Link>
        <p className="mb-2 flex items-center gap-1 text-xs text-forest-400">
          <MapPin size={12} /> {product.manufacturer?.companyName} · {product.originState || product.originCountry}
        </p>
        <div className="flex items-center justify-between">
          <div>
            {product.pricePerUnit ? (
              <p className="text-sm font-semibold text-forest-700">
                {product.currency} {product.pricePerUnit}
                <span className="text-xs font-normal text-forest-400">/{product.moqUnit}</span>
              </p>
            ) : (
              <p className="text-sm text-forest-400">Price on request</p>
            )}
            {product.moq && <p className="text-xs text-forest-400">MOQ: {product.moq} {product.moqUnit}</p>}
          </div>
          {product.manufacturer?.verificationStatus === "VERIFIED" && <Badge tone="success">Verified</Badge>}
        </div>
      </div>
    </div>
  );
}
