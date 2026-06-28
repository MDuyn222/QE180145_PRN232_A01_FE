"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, Category, Product, money } from "@/lib/api";
import { toast } from "sonner";
import Modal from "@/components/admin/Modal";
import { Edit3, PackagePlus, Trash2 } from "lucide-react";

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
      <div className="page-header">
        <div>
          <p className="eyebrow">Store inventory</p>
          <h1 className="section-title mt-2">Product management</h1>
          <p className="muted mt-2">
            Create products, assign categories, and control active listings.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <PackagePlus size={18} />
          Create product
        </button>
      </div>

      <div className="table-wrap">
        {loading ? (
          <p className="py-8 text-center">Loading products...</p>
        ) : (
          <table className="data-table min-w-[900px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.productId}>
                  <td className="font-bold text-slate-950">
                    {product.productName}
                  </td>
                  <td>{product.categoryName}</td>
                  <td className="font-bold text-teal-700">{money(product.price)}</td>
                  <td>{product.stockQuantity}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        product.isActive ? "status-active" : "status-muted"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="btn-secondary px-3 py-2"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>
                      <button
                        onClick={() => remove(product)}
                        className="rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={15} className="inline" />
                        Delete
                      </button>
                    </div>
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
            <div>
              <label className="label">Product name</label>
              <input name="name" className="input" maxLength={200} defaultValue={editing?.productName ?? ""} required />
            </div>
            <div>
              <label className="label">Category</label>
              <select name="category" className="input" defaultValue={editing?.categoryId ?? ""} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Price</label>
              <input name="price" type="number" min="0" step="0.01" className="input" defaultValue={editing?.price ?? 0} required />
            </div>
            <div>
              <label className="label">Stock quantity</label>
              <input name="stock" type="number" min="0" className="input" defaultValue={editing?.stockQuantity ?? 0} required />
            </div>
            <div className="md:col-span-2">
              <label className="label">Image URL</label>
              <input name="image" type="url" maxLength={500} className="input" defaultValue={editing?.imageUrl ?? ""} />
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea name="description" className="input min-h-28" defaultValue={editing?.description ?? ""} />
            </div>
            <label className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              <input name="active" type="checkbox" defaultChecked={editing?.isActive ?? true} className="h-4 w-4 accent-teal-600" /> Active
            </label>
            <div className="flex justify-end gap-3 md:col-span-2">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
