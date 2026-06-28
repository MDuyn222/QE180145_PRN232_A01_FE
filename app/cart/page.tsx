"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Minus, PackageOpen, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { api, CartDto, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      setCart(res.data);
    } catch {
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "User") {
      router.push("/login");
      return;
    }
    load();
  }, []);

  const updateQty = async (cartItemId: number, quantity: number) => {
    try {
      await api.put(`/api/cart/items/${cartItemId}`, { quantity });
      await load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update.");
    }
  };

  const remove = async (cartItemId: number) => {
    if (!confirm("Remove this item from cart?")) return;
    try {
      await api.delete(`/api/cart/items/${cartItemId}`);
      toast.success("Item removed.");
      await load();
    } catch {
      toast.error("Failed to remove item.");
    }
  };

  const checkout = async () => {
    if (!confirm("Place order with current cart contents?")) return;
    setCheckingOut(true);
    try {
      await api.post("/api/orders/checkout");
      toast.success("Order placed successfully!");
      router.push("/orders");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Checkout failed.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card animate-pulse">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0)
    return (
      <div className="soft-card mx-auto flex max-w-2xl flex-col items-center py-16 text-center">
        <div className="mb-4 rounded-2xl bg-teal-100 p-4 text-teal-700">
          <PackageOpen size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-950">
          Your cart is empty
        </h1>
        <p className="muted mt-2">
          Add products to your cart and they will appear here.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Continue shopping
          <ArrowRight size={18} />
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="section-title mt-2">Shopping cart</h1>
          <p className="muted mt-2">
            Review quantities before placing your order.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.cartItemId}
            className="card grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="h-24 w-24 rounded-2xl object-cover"
              />
            )}

            <div className="flex-1">
              <p className="text-lg font-bold text-slate-950">
                {item.productName}
              </p>
              <p className="mt-1 font-semibold text-teal-700">
                {money(item.price)}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
              <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                <button
                  onClick={() => updateQty(item.cartItemId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="p-2.5 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-12 border-x border-slate-200 px-4 py-2 text-center font-bold">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                  className="p-2.5 text-slate-600 hover:bg-slate-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <p className="min-w-28 text-right text-lg font-black text-slate-950">
                {money(item.subtotal)}
              </p>

              <button
                onClick={() => remove(item.cartItemId)}
                className="rounded-xl p-2.5 text-rose-600 hover:bg-rose-50"
                aria-label="Remove item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Cart total</p>
          <p className="mt-1 text-3xl font-black text-teal-700">
            {money(cart.total)}
          </p>
        </div>

        <button onClick={checkout} disabled={checkingOut} className="btn-primary">
          <ShoppingBag size={18} />
          {checkingOut ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
