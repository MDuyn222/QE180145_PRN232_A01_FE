"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Minus, Package, Plus, ShieldCheck, ShoppingCart } from "lucide-react";
import { api, Product, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get(`/api/products/${params.id}`)
      .then((res) => setProduct(res.data))
      .catch(() => {
        toast.error("Product not found.");
        router.push("/");
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const addToCart = async () => {
    const u = getUser();
    if (!u || u.role !== "User") {
      router.push("/login");
      return;
    }

    setAdding(true);
    try {
      await api.post("/api/cart/items", {
        productId: product!.productId,
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
      <div className="mx-auto max-w-6xl">
        <div className="card grid animate-pulse gap-8 md:grid-cols-2">
          <div className="h-96 rounded-3xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 w-2/3 rounded bg-slate-200" />
            <div className="h-12 w-1/2 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const imageUrl = product.imageUrl || "https://placehold.co/900x700/f1f5f9/0f172a?text=SimpleShop";
  const canBuy = product.stockQuantity > 0;

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/search" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800">
        <ArrowLeft size={16} />
        Back to products
      </Link>

      <div className="glass-panel grid gap-8 p-5 md:grid-cols-[0.95fr_1.05fr] md:p-8">
        <div className="overflow-hidden rounded-[1.75rem] bg-slate-100 ring-1 ring-slate-200">
          <img src={imageUrl} alt={product.productName} className="h-full min-h-[420px] w-full object-cover" />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {product.categoryName && (
              <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-teal-700 ring-1 ring-teal-100">
                {product.categoryName}
              </span>
            )}
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${canBuy ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200"}`}>
              {canBuy ? "Available" : "Out of stock"}
            </span>
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
            {product.productName}
          </h1>

          <p className="mt-5 text-base leading-7 text-slate-600">
            {product.description || "Product detail page with stock validation, protected cart action, and responsive layout."}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Price</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{money(product.price)}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                <Package size={15} />
                Stock
              </p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {canBuy ? `${product.stockQuantity} in stock` : <span className="text-rose-600">Out of stock</span>}
              </p>
            </div>
          </div>

          <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-slate-600 ring-1 ring-slate-200">
            <ShieldCheck size={16} className="text-teal-600" />
            Verified product information
          </p>

          {canBuy && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-slate-600 hover:bg-slate-50" aria-label="Decrease quantity">
                  <Minus size={18} />
                </button>
                <span className="min-w-14 border-x border-slate-200 px-5 py-3 text-center font-black">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))} className="p-3 text-slate-600 hover:bg-slate-50" aria-label="Increase quantity">
                  <Plus size={18} />
                </button>
              </div>

              <button onClick={addToCart} disabled={adding} className="btn-primary flex-1">
                <ShoppingCart size={18} />
                {adding ? "Adding..." : "Add to cart"}
              </button>
            </div>
          )}

          {!getUser() && (
            <p className="mt-4 text-sm text-slate-500">
              <Link href="/login" className="font-black text-teal-700 hover:text-teal-800">Login</Link>{" "}
              to add this item to your cart.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
