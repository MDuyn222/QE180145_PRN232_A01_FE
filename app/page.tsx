
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, Category } from "@/lib/api";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Category[]>("/api/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError(
          "Không thể tải danh mục sản phẩm. Vui lòng kiểm tra backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <>
      <section className="mb-10 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-600 px-6 py-12 text-white shadow-lg md:px-10">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">
            SimpleShop
          </p>

          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Find your next favorite product
          </h1>

          <p className="mt-4 max-w-xl text-base text-blue-100 md:text-lg">
            Browse active categories and discover products available in
            SimpleShop.
          </p>

          <Link
            href="/search"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            Search products
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Product categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select a category to view its available products.
            </p>
          </div>

          <Link
            href="/search"
            className="hidden font-medium text-blue-600 hover:text-blue-800 sm:block"
          >
            View all products →
          </Link>
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="card animate-pulse"
              >
                <div className="h-6 w-2/3 rounded bg-slate-200" />
                <div className="mt-4 h-4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-4/5 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">Unable to load categories</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
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
                className="card group border border-slate-200 transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
                    {category.categoryName.charAt(0).toUpperCase()}
                  </div>

                  <span className="text-xl text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {category.categoryName}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                  {category.categoryDescription}
                </p>

                <p className="mt-5 text-sm font-semibold text-blue-600">
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

