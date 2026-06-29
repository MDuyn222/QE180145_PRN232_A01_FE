"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarDays, PackageOpen, ReceiptText } from "lucide-react";
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
      <div className="mx-auto max-w-5xl">
        <div className="card animate-pulse">
          <div className="h-8 w-44 rounded bg-slate-200" />
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-28 rounded-3xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="page-header">
        <div>
          <p className="eyebrow">Purchase history</p>
          <h1 className="section-title mt-2">My orders</h1>
          <p className="muted mt-2">Track completed checkouts and open order details.</p>
        </div>
        <Link href="/search" className="btn-secondary">
          Browse products
          <ArrowRight size={17} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state py-16">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <PackageOpen size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-950">No orders yet</h2>
          <p className="muted mt-2">Your completed checkouts will appear here.</p>
          <Link href="/search" className="btn-primary mt-6">
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
              className="card block hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                    <ReceiptText size={22} />
                  </span>
                  <div>
                    <p className="text-lg font-black tracking-tight text-slate-950">Order #{order.orderId}</p>
                    <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                      <CalendarDays size={15} />
                      {new Date(order.orderDate).toLocaleString("vi-VN")}
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-600">{order.items.length} item(s)</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-xl font-black text-slate-950">{money(order.totalAmount)}</p>
                  <span className="status-badge mt-2 bg-amber-50 text-amber-700 ring-1 ring-amber-200">
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
