"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Category, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import {
  ArrowRight,
  BadgeCheck,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoryResponse, productResponse] = await Promise.all([
          api.get<Category[]>("/api/categories"),
          api.get<Product[]>("/api/products"),
        ]);

        setCategories(categoryResponse.data);
        setProducts(productResponse.data);
      } catch (err) {
        console.error("Failed to load home data:", err);
        setError("Không thể tải dữ liệu trang chủ. Vui lòng kiểm tra backend.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const featuredProducts = products.slice(0, 6);

  return (
    <>
      <section className="glass-panel surface-grid mb-10 overflow-hidden">
        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10 lg:p-12">
          <div className="flex flex-col justify-center">
            <p className="eyebrow mb-4">SimpleShop marketplace</p>

            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-5xl lg:text-6xl">
              A cleaner store experience for browsing, cart, and orders.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              SimpleShop brings product discovery, account flow, cart checkout,
              and order tracking into one polished interface for the PRN232
              e-commerce assignment.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search" className="btn-primary">
                <PackageSearch size={18} />
                Search products
              </Link>

              <Link href="/register" className="btn-secondary">
                Create account
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: BadgeCheck, label: "Active products", value: products.length },
                { icon: ShieldCheck, label: "JWT account flow", value: "Secure" },
                { icon: ShoppingBag, label: "Order tracking", value: "Ready" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="stat-card flex items-center gap-3"
                  >
                    <span className="icon-chip h-10 w-10 rounded-xl">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-black text-slate-950">
                        {item.value}
                      </span>
                      <span className="block text-xs font-semibold text-slate-500">
                        {item.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-teal-700 via-teal-500 to-cyan-500 p-6 text-white shadow-2xl shadow-teal-900/15">
            <div className="absolute right-6 top-6 rounded-full bg-white/20 p-3 backdrop-blur">
              <Sparkles size={24} />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-end">
              <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                  <p className="text-3xl font-black">{categories.length}</p>
                  <p className="mt-1 text-sm text-white/85">Categories</p>
                </div>
                <div className="rounded-2xl bg-white/20 p-4 backdrop-blur">
                  <p className="text-3xl font-black">{products.length}</p>
                  <p className="mt-1 text-sm text-white/85">Products</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-2xl">
                <p className="inline-flex items-center gap-2 text-sm font-bold text-teal-700">
                  <Store size={16} />
                  Shopping flow
                </p>
                <div className="mt-4 space-y-3">
                  {["Browse products", "View product details", "Checkout cart"].map(
                    (label, index) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-black text-teal-700">
                          {index + 1}
                        </span>
                        <span className="font-semibold">{label}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="page-header">
          <div>
            <p className="eyebrow">Public product listing</p>
            <h2 className="section-title mt-2">Available products</h2>

            <p className="muted mt-2">
              Visitors can browse active products without logging in.
            </p>
          </div>

          <Link href="/search" className="btn-secondary">
            View all products
            <ArrowRight size={17} />
          </Link>
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="card animate-pulse p-0">
                <div className="aspect-[4/3] rounded-t-[1.4rem] bg-slate-200" />
                <div className="p-5">
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                  <div className="mt-3 h-4 rounded bg-slate-200" />
                  <div className="mt-6 h-6 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            <p className="font-semibold">Unable to load home data</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && featuredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              No active products
            </h3>

            <p className="mt-2 text-slate-500">
              There are currently no active products to display.
            </p>
          </div>
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.productId} p={product} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="page-header">
          <div>
            <p className="eyebrow">Browse by category</p>
            <h2 className="section-title mt-2">Product categories</h2>

            <p className="muted mt-2">
              Select a category to view its available products.
            </p>
          </div>
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card animate-pulse">
                <div className="h-6 w-2/3 rounded bg-slate-200" />
                <div className="mt-4 h-4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-800">
              No active categories
            </h3>

            <p className="mt-2 text-slate-500">
              There are currently no active product categories.
            </p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.categoryId}
                href={`/category/${category.categoryId}`}
                className="group card flex min-h-56 flex-col hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_60px_rgba(15,118,110,0.14)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="icon-chip text-xl font-black">
                    {category.categoryName.charAt(0).toUpperCase()}
                  </div>

                  <span className="rounded-full bg-slate-100 p-2 text-slate-400 transition group-hover:translate-x-1 group-hover:bg-teal-600 group-hover:text-white">
                    <ArrowRight size={17} />
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {category.categoryName}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                  {category.categoryDescription}
                </p>

                <p className="mt-auto pt-5 text-sm font-bold text-teal-700">
                  Browse products
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
