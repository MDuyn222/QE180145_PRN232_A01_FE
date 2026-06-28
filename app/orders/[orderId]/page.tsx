"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";
import { api, OrderDto, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const u = getUser();

    if (!u || u.role !== "User") {
      router.push("/login");
      return;
    }

    api
      .get(`/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => {
        toast.error("Order not found.");
        router.push("/orders");
      })
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card animate-pulse">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="mt-6 h-72 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/orders"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
      >
        <ArrowLeft size={16} />
        Back to orders
      </Link>

      <div className="card mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
            <ReceiptText size={26} />
          </span>

          <div>
            <p className="eyebrow">Order detail</p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">
              Order #{order.orderId}
            </h1>
            <p className="muted mt-1">
              {new Date(order.orderDate).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="status-badge bg-amber-100 text-amber-700">
            {order.status}
          </span>
          <p className="mt-2 text-2xl font-black text-teal-700">
            {money(order.totalAmount)}
          </p>
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
                <td className="font-semibold text-slate-950">
                  {item.productName}
                </td>
                <td className="text-right">{money(item.unitPrice)}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right font-bold text-slate-950">
                  {money(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-slate-50">
            <tr>
              <td colSpan={3} className="px-4 py-4 text-right font-black">
                Total
              </td>
              <td className="px-4 py-4 text-right text-lg font-black text-teal-700">
                {money(order.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}