import { Link } from "react-router-dom";
import { Heart, MapPin, Package, Factory, Globe2 } from "lucide-react";
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
  const image = product.images?.split(",").map((value) => value.trim()).find(Boolean);
  const markets = product.exportMarkets?.split(",").map((value) => value.trim()).filter(Boolean) || [];

  return (
    <div className="card group overflow-hidden">
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-cream-200 text-forest-300">
        {image ? (
          <img src={image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <span className="font-display text-3xl">{product.name.charAt(0)}</span>
        )}
        {onToggleFavorite && (
          <button
            type="button"
            aria-label={isFavorite ? "Remove from saved products" : "Save product"}
            aria-pressed={Boolean(isFavorite)}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-card ${isFavorite ? "text-red-500" : "text-forest-300 hover:text-red-400"}`}
          >
            <Heart size={15} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="eyebrow mb-1">{product.category?.name}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mb-1 truncate font-display text-base text-forest-700 group-hover:text-gold-600">{product.name}</h3>
        </Link>
        <p className="mb-3 flex items-center gap-1 text-xs text-forest-400">
          <MapPin size={12} /> {product.manufacturer?.companyName} · {product.originState || product.originCountry}
        </p>
        <div className="flex items-start justify-between gap-2">
          <div>
            {product.pricePerUnit != null ? (
              <p className="text-sm font-semibold text-forest-700">{product.currency} {product.pricePerUnit}<span className="text-xs font-normal text-forest-400">/{product.moqUnit}</span></p>
            ) : <p className="text-sm text-forest-400">Price on request</p>}
            {product.moq != null && <p className="text-xs text-forest-400">Minimum order: {product.moq} {product.moqUnit}</p>}
          </div>
          {product.manufacturer?.verificationStatus === "VERIFIED" && <Badge tone="success">Verified supplier</Badge>}
        </div>
        {(product.packagingOptions || product.productionCapacity) && (
          <div className="mt-3 space-y-1 border-t border-cream-200 pt-3 text-xs text-forest-500">
            {product.packagingOptions && <p className="flex gap-2"><Package size={13} className="shrink-0 text-forest-400" /><span><b>Packaging:</b> {product.packagingOptions}</span></p>}
            {product.productionCapacity && <p className="flex gap-2"><Factory size={13} className="shrink-0 text-forest-400" /><span><b>Capacity:</b> {product.productionCapacity}</span></p>}
            {markets.length > 0 && <p className="flex gap-2"><Globe2 size={13} className="shrink-0 text-forest-400" /><span><b>Declared markets:</b> {markets.slice(0, 3).join(", ")}{markets.length > 3 ? " +" : ""}</span></p>}
          </div>
        )}
        <Link to={`/products/${product.id}`} className="mt-4 inline-flex text-xs font-semibold text-gold-700 hover:underline">View product details <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
