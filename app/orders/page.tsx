"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, OrderDto, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "User") { router.push("/login"); return; }
    api.get("/api/orders")
      .then(res => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-16 text-center">Loading orders...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No orders yet.</p>
          <Link href="/" className="text-blue-600 hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.orderId} href={`/orders/${order.orderId}`}
              className="block border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString("vi-VN")}</p>
                  <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{money(order.totalAmount)}</p>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{order.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
