"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Category, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import {
  ArrowRight,
  BadgeCheck,
  Layers3,
  PackageOpen,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
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
      <section className="glass-panel mb-10 overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 sm:p-8 lg:p-12">
            <p className="eyebrow mb-4">SimpleShop marketplace</p>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl lg:text-6xl">
              Clean e-commerce flow for products, cart, and orders.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              A professional full-stack storefront built with ASP.NET Core Web API,
              PostgreSQL, JWT authentication, and Next.js.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search" className="btn-primary">
                <PackageSearch size={18} />
                Browse products
              </Link>

              <Link href="/register" className="btn-secondary">
                Create account
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: BadgeCheck, label: "Products", value: products.length },
                { icon: Layers3, label: "Categories", value: categories.length },
                { icon: ShieldCheck, label: "Security", value: "JWT" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="stat-card flex items-center gap-3">
                    <span className="icon-chip h-10 w-10 rounded-2xl">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-lg font-black text-slate-950">
                        {item.value}
                      </span>
                      <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">
                        {item.label}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hero-accent m-4 p-6 sm:m-6 lg:m-8">
            <div className="flex h-full min-h-[330px] flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-teal-200">Exam scope</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight">
                    End-to-end store workflow
                  </h2>
                </div>
                <span className="rounded-2xl bg-white/10 p-3 text-teal-100 ring-1 ring-white/10">
                  <Store size={24} />
                </span>
              </div>

              <div className="mt-8 grid gap-3">
                {[
                  "Public product browsing and search",
                  "User account with protected cart",
                  "Checkout with stock update",
                  "Order history and order detail",
                ].map((label, index) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-400 text-sm font-black text-slate-950">
                      {index + 1}
                    </span>
                    <span className="font-bold text-white/95">{label}</span>
                  </div>
                ))}
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
                <div className="aspect-[4/3] bg-slate-200" />
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
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            <p className="font-bold">Unable to load home data</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && featuredProducts.length === 0 && (
          <div className="empty-state">
            <PackageOpen className="mx-auto mb-4 text-slate-400" size={32} />
            <h3 className="text-lg font-black text-slate-900">No active products</h3>
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
              Select a category to view active products in that group.
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
          <div className="empty-state">
            <Layers3 className="mx-auto mb-4 text-slate-400" size={32} />
            <h3 className="text-lg font-black text-slate-900">No active categories</h3>
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
                className="group card flex min-h-48 flex-col justify-between hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="icon-chip text-lg font-black">
                    {category.categoryName.charAt(0).toUpperCase()}
                  </div>
                  <span className="rounded-2xl bg-slate-100 p-2 text-slate-500 transition group-hover:bg-teal-700 group-hover:text-white">
                    <ArrowRight size={17} />
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-black tracking-tight text-slate-950">
                    {category.categoryName}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {category.categoryDescription || "Browse products in this category."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
