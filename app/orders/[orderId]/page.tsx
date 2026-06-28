"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, OrderDto, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "User") { router.push("/login"); return; }
    api.get(`/api/orders/${params.orderId}`)
      .then(res => setOrder(res.data))
      .catch(() => { toast.error("Order not found."); router.push("/orders"); })
      .finally(() => setLoading(false));
  }, [params.orderId]);

  if (loading) return <div className="py-16 text-center">Loading...</div>;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <Link href="/orders" className="text-blue-600 hover:underline text-sm">← Back to Orders</Link>
      </div>
      <h1 className="text-2xl font-bold mb-2">Order #{order.orderId}</h1>
      <div className="text-sm text-gray-500 mb-6">
        <p>Date: {new Date(order.orderDate).toLocaleString("vi-VN")}</p>
        <p>Status: <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{order.status}</span></p>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-right">Unit Price</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.orderItemId} className="border-t">
                <td className="p-3">{item.productName}</td>
                <td className="p-3 text-right">{money(item.unitPrice)}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-right">{money(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t bg-gray-50">
            <tr>
              <td colSpan={3} className="p-3 font-bold text-right">Total</td>
              <td className="p-3 font-bold text-right text-blue-600">{money(order.totalAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
