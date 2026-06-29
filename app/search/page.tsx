"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, Category, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Filter, PackageSearch, RotateCcw, Search } from "lucide-react";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const loadAllProducts = async () => {
    try {
      setSearching(true);
      setError("");
      const response = await api.get<Product[]>("/api/products/search");
      setProducts(response.data);
      setHasSearched(false);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("Không thể tải danh sách sản phẩm. Vui lòng kiểm tra backend.");
      setProducts([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingCategories(true);
        await Promise.all([
          api.get<Category[]>("/api/categories").then((response) => setCategories(response.data)),
          loadAllProducts(),
        ]);
      } catch (err) {
        console.error("Failed to load search page data:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSearching(true);
      setHasSearched(true);
      setError("");

      const formData = new FormData(event.currentTarget);
      const query = new URLSearchParams();

      ["name", "minPrice", "maxPrice", "categoryId"].forEach((field) => {
        const value = formData.get(field)?.toString().trim();
        if (value) query.set(field, value);
      });

      const response = await api.get<Product[]>(
        `/api/products/search?${query.toString()}`
      );

      setProducts(response.data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Không thể tìm kiếm sản phẩm. Vui lòng thử lại.");
      setProducts([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Product discovery</p>
          <h1 className="section-title mt-2">Search products</h1>
          <p className="muted mt-2">
            Filter active products by name, category, or price range.
          </p>
        </div>
        <button type="button" onClick={loadAllProducts} className="btn-secondary" disabled={searching}>
          <RotateCcw size={17} />
          Reset list
        </button>
      </div>

      <form
        onSubmit={handleSearch}
        className="card mb-8 grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr_auto]"
      >
        <div>
          <label className="label">Product name</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input name="name" className="input pl-11" placeholder="Search by name" />
          </div>
        </div>

        <div>
          <label className="label">Min price</label>
          <input name="minPrice" type="number" min="0" className="input" placeholder="0" />
        </div>

        <div>
          <label className="label">Max price</label>
          <input name="maxPrice" type="number" min="0" className="input" placeholder="Any" />
        </div>

        <div>
          <label className="label">Category</label>
          <select name="categoryId" className="input" disabled={loadingCategories}>
            <option value="">
              {loadingCategories ? "Loading..." : "All categories"}
            </option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn-primary self-end" disabled={searching}>
          <Filter size={18} />
          {searching ? "Loading..." : "Apply"}
        </button>
      </form>

      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-600">
          {searching ? "Loading products..." : `${products.length} product${products.length === 1 ? "" : "s"} found`}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      )}

      {searching && (
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

      {!searching && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <PackageSearch size={30} />
          </div>
          <h2 className="text-lg font-black text-slate-950">
            {hasSearched ? "No matching products" : "No products available"}
          </h2>
          <p className="muted mt-2">
            {hasSearched
              ? "Try changing the name, category, or price range."
              : "There are currently no active products to display."}
          </p>
        </div>
      )}

      {!searching && !error && products.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.productId} p={product} />
          ))}
        </div>
      )}
    </>
  );
}
