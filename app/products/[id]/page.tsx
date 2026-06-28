"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Package, Plus, ShoppingCart } from "lucide-react";
import { api, Product, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {
        toast.error("Product not found.");
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const addToCart = async () => {
    const u = getUser();

    if (!u || u.role !== "User") {
      router.push("/login");
      return;
    }

    if (!product) return;

    setAdding(true);

    try {
      await api.post("/api/cart/items", {
        productId: product.productId,
        quantity: qty,
      });

      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="card grid animate-pulse gap-8 md:grid-cols-2">
          <div className="h-80 rounded-3xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-10 w-1/2 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imageUrl =
    product.imageUrl ||
    "https://placehold.co/900x700/e0f2f1/0f766e?text=SimpleShop";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
      >
        <ArrowLeft size={16} />
        Back to shop
      </Link>

      <div className="card grid gap-8 p-5 md:grid-cols-2 md:p-8">
        <div className="overflow-hidden rounded-3xl bg-slate-100">
          <img
            src={imageUrl}
            alt={product.productName}
            className="h-full min-h-[360px] w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          {product.categoryName && (
            <p className="mb-3 inline-flex w-fit rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-700">
              {product.categoryName}
            </p>
          )}

          <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-4xl">
            {product.productName}
          </h1>

          {product.description && (
            <p className="mt-4 text-base leading-7 text-slate-600">
              {product.description}
            </p>
          )}

          <p className="mt-6 text-4xl font-black text-teal-700">
            {money(product.price)}
          </p>

          <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">
            <Package size={16} />
            {product.stockQuantity > 0 ? (
              `${product.stockQuantity} in stock`
            ) : (
              <span className="text-rose-600">Out of stock</span>
            )}
          </p>

          {product.stockQuantity > 0 && (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 text-slate-600 hover:bg-slate-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>

                <span className="min-w-14 border-x border-slate-200 px-5 py-3 text-center font-bold">
                  {qty}
                </span>

                <button
                  onClick={() =>
                    setQty((q) => Math.min(product.stockQuantity, q + 1))
                  }
                  className="p-3 text-slate-600 hover:bg-slate-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={addToCart}
                disabled={adding}
                className="btn-primary flex-1"
              >
                <ShoppingCart size={18} />
                {adding ? "Adding..." : "Add to cart"}
              </button>
            </div>
          )}

          {!getUser() && (
            <p className="mt-4 text-sm text-slate-500">
              <Link
                href="/login"
                className="font-semibold text-teal-700 hover:text-teal-800"
              >
                Login
              </Link>{" "}
              to add this item to your cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}