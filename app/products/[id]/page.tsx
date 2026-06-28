"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, Product, getUser, money } from "@/lib/api";
import { toast } from "sonner";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const user = typeof window !== "undefined" ? getUser() : null;

  useEffect(() => {
    api.get(`/api/products/${params.id}`)
      .then(res => setProduct(res.data))
      .catch(() => { toast.error("Product not found."); router.push("/"); })
      .finally(() => setLoading(false));
  }, [params.id]);

  const addToCart = async () => {
    const u = getUser();
    if (!u || u.role !== "User") { router.push("/login"); return; }
    setAdding(true);
    try {
      await api.post("/api/cart/items", { productId: product!.productId, quantity: qty });
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="py-16 text-center">Loading...</div>;
  if (!product) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Back</Link>
      <div className="mt-4 grid md:grid-cols-2 gap-8">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.productName}
            className="w-full h-64 object-cover rounded-lg" />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{product.productName}</h1>
          {product.categoryName && (
            <p className="text-sm text-blue-600 mt-1">{product.categoryName}</p>
          )}
          {product.description && <p className="text-gray-600 mt-3">{product.description}</p>}
          <p className="text-3xl font-bold text-blue-600 mt-4">{money(product.price)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : <span className="text-red-500">Out of stock</span>}
          </p>
          {product.stockQuantity > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center border rounded">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1 text-lg">−</button>
                <span className="px-4 py-1 border-x">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))} className="px-3 py-1 text-lg">+</button>
              </div>
              <button onClick={addToCart} disabled={adding}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
                {adding ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          )}
          {!getUser() && (
            <p className="mt-3 text-sm text-gray-500">
              <Link href="/login" className="text-blue-600 hover:underline">Login</Link> to add to cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
