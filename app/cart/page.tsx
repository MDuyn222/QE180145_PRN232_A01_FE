"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    if (!u || u.role !== "User") { router.push("/login"); return; }
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

  if (loading) return <div className="py-16 text-center">Loading cart...</div>;
  if (!cart || cart.items.length === 0)
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link href="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {cart.items.map(item => (
          <div key={item.cartItemId} className="flex items-center gap-4 border rounded-lg p-4">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{item.productName}</p>
              <p className="text-blue-600">{money(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.cartItemId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 border rounded text-center disabled:opacity-30">−</button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button onClick={() => updateQty(item.cartItemId, item.quantity + 1)}
                className="w-8 h-8 border rounded text-center">+</button>
            </div>
            <p className="font-semibold w-28 text-right">{money(item.subtotal)}</p>
            <button onClick={() => remove(item.cartItemId)}
              className="text-red-500 hover:text-red-700 ml-2">✕</button>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t pt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">Total: {money(cart.total)}</p>
        </div>
        <button onClick={checkout} disabled={checkingOut}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {checkingOut ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
