"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, PackageOpen } from "lucide-react";
import { api, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export default function Page() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get<Product[]>(`/api/products/category/${id}`);
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to load category products:", err);
        setError("Không thể tải sản phẩm trong danh mục này.");
      } finally {
        setLoading(false);
      }
    };

    if (id) void loadProducts();
  }, [id]);

  return (
    <>
      <div className="page-header">
        <div>
          <Link href="/" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800">
            <ArrowLeft size={16} />
            Back to categories
          </Link>
          <p className="eyebrow">Category products</p>
          <h1 className="section-title mt-2">Products</h1>
          <p className="muted mt-2">
            Browse all active products available in this category.
          </p>
        </div>
      </div>

      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="card h-80 animate-pulse">
              <div className="mb-4 h-40 rounded-2xl bg-slate-200" />
              <div className="h-5 w-2/3 rounded bg-slate-200" />
              <div className="mt-3 h-4 rounded bg-slate-200" />
              <div className="mt-6 h-6 w-1/2 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="soft-card flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-500">
            <PackageOpen size={30} />
          </div>
          <h2 className="text-lg font-bold text-slate-950">
            No active products found
          </h2>
          <p className="muted mt-2">
            This category does not have any active products right now.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.productId} p={product} />
          ))}
        </div>
      )}
    </>
  );
}
