"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, Category, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Filter, PackageSearch, Search } from "lucide-react";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingCategories(true);
        setSearching(true);
        setError("");

        const [categoryResponse, productResponse] = await Promise.all([
          api.get<Category[]>("/api/categories"),
          api.get<Product[]>("/api/products/search"),
        ]);

        setCategories(categoryResponse.data);
        setProducts(productResponse.data);
      } catch (err) {
        console.error("Failed to load search page data:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng kiểm tra backend.");
        setProducts([]);
      } finally {
        setLoadingCategories(false);
        setSearching(false);
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

      const fields = ["name", "minPrice", "maxPrice", "categoryId"];

      fields.forEach((field) => {
        const value = formData.get(field)?.toString().trim();

        if (value) {
          query.set(field, value);
        }
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
            Browse all available products or filter by name, price range, and category.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className="card mb-8 grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr_auto]"
      >
        <div>
          <label className="label">Product name</label>
          <input name="name" className="input" placeholder="Search by name" />
        </div>

        <div>
          <label className="label">Min price</label>
          <input
            name="minPrice"
            type="number"
            min="0"
            className="input"
            placeholder="0"
          />
        </div>

        <div>
          <label className="label">Max price</label>
          <input
            name="maxPrice"
            type="number"
            min="0"
            className="input"
            placeholder="Any"
          />
        </div>

        <div>
          <label className="label">Category</label>
          <select
            name="categoryId"
            className="input"
            disabled={loadingCategories}
          >
            <option value="">
              {loadingCategories ? "Loading categories..." : "All categories"}
            </option>

            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary self-end"
          disabled={searching}
        >
          {searching ? (
            <>
              <Filter size={18} />
              Loading...
            </>
          ) : (
            <>
              <Search size={18} />
              Search
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      )}

      {searching && (
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

      {!searching && !error && products.length === 0 && (
        <div className="soft-card flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-4 rounded-2xl bg-teal-100 p-4 text-teal-700">
            <PackageSearch size={30} />
          </div>
          <h2 className="text-lg font-bold text-slate-950">
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
