"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, ReceiptText } from "lucide-react";
import { api, OrderDto, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "User") {
      router.push("/login");
      return;
    }

    api.get(`/api/orders/${params.orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => {
        toast.error("Order not found.");
        router.push("/orders");
      })
      .finally(() => setLoading(false));
  }, [params.orderId, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="card animate-pulse">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="mt-6 h-72 rounded-3xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/orders" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800">
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <div className="card mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <ReceiptText size={26} />
          </span>
          <div>
            <p className="eyebrow">Order detail</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">Order #{order.orderId}</h1>
            <p className="muted mt-1 inline-flex items-center gap-2">
              <CalendarDays size={15} />
              {new Date(order.orderDate).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <span className="status-badge bg-amber-50 text-amber-700 ring-1 ring-amber-200">{order.status}</span>
          <p className="mt-2 text-2xl font-black text-slate-950">{money(order.totalAmount)}</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table min-w-[640px]">
          <thead>
            <tr>
              <th>Product</th>
              <th className="text-right">Unit Price</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.orderItemId}>
                <td className="font-bold text-slate-950">{item.productName}</td>
                <td className="text-right">{money(item.unitPrice)}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right font-black text-slate-950">{money(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50">
            <tr>
              <td colSpan={3} className="px-5 py-5 text-right font-black text-slate-700">Total</td>
              <td className="px-5 py-5 text-right text-lg font-black text-slate-950">{money(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
