
"use client";

import { FormEvent, useEffect, useState } from "react";
import { api, Category, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

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
      <h1 className="mb-6 text-3xl font-bold">Search products</h1>

      <form
        onSubmit={handleSearch}
        className="card mb-8 grid gap-3 md:grid-cols-5"
      >
        <input
          name="name"
          className="input"
          placeholder="Product name"
        />

        <input
          name="minPrice"
          type="number"
          min="0"
          className="input"
          placeholder="Min price"
        />

        <input
          name="maxPrice"
          type="number"
          min="0"
          className="input"
          placeholder="Max price"
        />

        <select
          name="categoryId"
          className="input"
          disabled={loadingCategories}
        >
          <option value="">
            {loadingCategories ? "Loading categories..." : "All categories"}
          </option>

          {categories.map((category) => (
            <option
              key={category.categoryId}
              value={category.categoryId}
            >
              {category.categoryName}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="btn-primary"
          disabled={searching}
        >
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      {error && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!searching && !error && products.length === 0 && (
        <p className="text-slate-600">
          Enter search criteria and click Search.
        </p>
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

