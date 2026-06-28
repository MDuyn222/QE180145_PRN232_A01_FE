"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, PackageOpen, ReceiptText } from "lucide-react";
import { api, OrderDto, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "User") {
      router.push("/login");
      return;
    }
    api.get("/api/orders")
      .then((res) => setOrders(res.data))
      .catch(() => toast.error("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card animate-pulse">
          <div className="h-8 w-44 rounded bg-slate-200" />
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-28 rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">Purchase history</p>
          <h1 className="section-title mt-2">My orders</h1>
          <p className="muted mt-2">
            Track all orders created from your shopping cart.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="soft-card flex flex-col items-center py-16 text-center">
          <div className="mb-4 rounded-2xl bg-teal-100 p-4 text-teal-700">
            <PackageOpen size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-950">No orders yet</h2>
          <p className="muted mt-2">Your completed checkouts will appear here.</p>
          <Link href="/" className="btn-primary mt-6">
            Start shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.orderId}
              href={`/orders/${order.orderId}`}
              className="card block transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,118,110,0.12)]"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                    <ReceiptText size={22} />
                  </span>
                  <div>
                    <p className="font-bold text-slate-950">
                      Order #{order.orderId}
                    </p>
                    <p className="muted mt-1">
                      {new Date(order.orderDate).toLocaleString("vi-VN")}
                    </p>
                    <p className="text-sm font-semibold text-slate-600">
                      {order.items.length} item(s)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-teal-700">
                    {money(order.totalAmount)}
                  </p>
                  <span className="status-badge bg-amber-100 text-amber-700">
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
