import Link from "next/link";
import { ArrowUpRight, Package, ShieldCheck } from "lucide-react";
import { Product, money } from "@/lib/api";

export default function ProductCard({ p }: { p: Product }) {
  const imageUrl = p.imageUrl || "https://placehold.co/800x600/e0f2f1/0f766e?text=SimpleShop";
  const isOutOfStock = p.stockQuantity <= 0;

  return (
    <Link
      href={`/products/${p.productId}`}
      className="group card block overflow-hidden p-0 hover:-translate-y-1 hover:border-teal-100 hover:shadow-[0_24px_60px_rgba(15,118,110,0.16)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={p.productName}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-teal-700 shadow-sm backdrop-blur">
            {p.categoryName || "Product"}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur ${
              isOutOfStock
                ? "bg-rose-50/95 text-rose-700"
                : "bg-emerald-50/95 text-emerald-700"
            }`}
          >
            {isOutOfStock ? "Out of stock" : "Available"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-bold leading-6 text-slate-950">
            {p.productName}
          </h3>
          <span className="rounded-full bg-teal-50 p-2 text-teal-700 transition group-hover:bg-teal-600 group-hover:text-white">
            <ArrowUpRight size={16} />
          </span>
        </div>

        {p.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {p.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldCheck size={15} className="text-teal-600" />
          Verified catalog item
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-xl font-black text-teal-700">{money(p.price)}</p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <Package size={14} />
            {p.stockQuantity} left
          </p>
        </div>
      </div>
    </Link>
  );
}
