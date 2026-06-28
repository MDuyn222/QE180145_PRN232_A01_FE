
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await api.get<Category[]>("/api/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Không thể tải danh sách danh mục.");
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSearching(true);
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
            Filter by name, price range, or category to find the right item.
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
              Searching...
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

      {!searching && !error && products.length === 0 && (
        <div className="soft-card flex flex-col items-center justify-center py-14 text-center">
          <div className="mb-4 rounded-2xl bg-teal-100 p-4 text-teal-700">
            <PackageSearch size={30} />
          </div>
          <h2 className="text-lg font-bold text-slate-950">
            Ready when you are
          </h2>
          <p className="muted mt-2">
            Enter search criteria and click Search to view matching products.
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            p={product}
          />
        ))}
      </div>
    </>
  );
}
