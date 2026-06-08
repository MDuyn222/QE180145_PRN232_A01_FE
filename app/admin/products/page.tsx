"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, Category, Product, money } from "@/lib/api";
import { toast } from "sonner";
import Modal from "@/components/admin/Modal";

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [productResponse, categoryResponse] = await Promise.all([
        api.get("/api/products/all"),
        api.get("/api/categories/all"),
      ]);
      setProducts(productResponse.data);
      setCategories(categoryResponse.data);
    } catch {
      toast.error("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      productName: String(form.get("name") ?? "").trim(),
      description: String(form.get("description") ?? "").trim() || null,
      price: Number(form.get("price")),
      stockQuantity: Number(form.get("stock")),
      imageUrl: String(form.get("image") ?? "").trim() || null,
      categoryId: Number(form.get("category")),
      isActive: form.get("active") === "on",
    };

    if (!data.productName || data.price < 0 || data.stockQuantity < 0 || !data.categoryId) {
      toast.error("Please enter valid product information.");
      return;
    }

    try {
      setSaving(true);
      if (editing) {
        await api.put(`/api/products/${editing.productId}`, data);
        toast.success("Product updated successfully.");
      } else {
        await api.post("/api/products", data);
        toast.success("Product created successfully.");
      }
      setModalOpen(false);
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Soft-delete product "${product.productName}"?`)) return;
    try {
      await api.delete(`/api/products/${product.productId}`);
      toast.success("Product was deactivated successfully.");
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to delete product.");
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Product management</h1>
        <button onClick={openCreate} className="btn-primary">Create product</button>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="py-8 text-center">Loading products...</p>
        ) : (
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="text-left">
                <th className="pb-3">Name</th><th className="pb-3">Category</th><th className="pb-3">Price</th>
                <th className="pb-3">Stock</th><th className="pb-3">Status</th><th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className="border-t" key={product.productId}>
                  <td className="py-3 font-medium">{product.productName}</td>
                  <td>{product.categoryName}</td><td>{money(product.price)}</td><td>{product.stockQuantity}</td>
                  <td>{product.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <button onClick={() => openEdit(product)} className="mr-4 text-blue-600">Edit</button>
                    <button onClick={() => remove(product)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit product" : "Create product"} onClose={() => setModalOpen(false)}>
          <form onSubmit={save} className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block font-medium">Product name</label><input name="name" className="input" maxLength={200} defaultValue={editing?.productName ?? ""} required /></div>
            <div><label className="mb-1 block font-medium">Category</label><select name="category" className="input" defaultValue={editing?.categoryId ?? ""} required><option value="">Select category</option>{categories.map((category) => <option key={category.categoryId} value={category.categoryId}>{category.categoryName}</option>)}</select></div>
            <div><label className="mb-1 block font-medium">Price</label><input name="price" type="number" min="0" step="0.01" className="input" defaultValue={editing?.price ?? 0} required /></div>
            <div><label className="mb-1 block font-medium">Stock quantity</label><input name="stock" type="number" min="0" className="input" defaultValue={editing?.stockQuantity ?? 0} required /></div>
            <div className="md:col-span-2"><label className="mb-1 block font-medium">Image URL</label><input name="image" type="url" maxLength={500} className="input" defaultValue={editing?.imageUrl ?? ""} /></div>
            <div className="md:col-span-2"><label className="mb-1 block font-medium">Description</label><textarea name="description" className="input min-h-28" defaultValue={editing?.description ?? ""} /></div>
            <label className="flex items-center gap-2"><input name="active" type="checkbox" defaultChecked={editing?.isActive ?? true} /> Active</label>
            <div className="flex justify-end gap-3 md:col-span-2"><button type="button" className="rounded-xl border px-4 py-2" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
