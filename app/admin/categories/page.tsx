"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, Category } from "@/lib/api";
import { toast } from "sonner";
import Modal from "@/components/admin/Modal";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/categories/all");
      setCategories(response.data);
    } catch {
      toast.error("Unable to load categories.");
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

  const openEdit = (category: Category) => {
    setEditing(category);
    setModalOpen(true);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      categoryName: String(form.get("name") ?? "").trim(),
      categoryDescription: String(form.get("description") ?? "").trim(),
      isActive: form.get("active") === "on",
    };

    if (!data.categoryName || !data.categoryDescription) {
      toast.error("Name and description are required.");
      return;
    }

    try {
      setSaving(true);
      if (editing) {
        await api.put(`/api/categories/${editing.categoryId}`, data);
        toast.success("Category updated successfully.");
      } else {
        await api.post("/api/categories", data);
        toast.success("Category created successfully.");
      }
      setModalOpen(false);
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (category: Category) => {
    if (!window.confirm(`Delete category "${category.categoryName}"?`)) return;
    try {
      await api.delete(`/api/categories/${category.categoryId}`);
      toast.success("Category deleted successfully.");
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to delete category.");
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Category management</h1>
        <button onClick={openCreate} className="btn-primary">Create category</button>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="py-8 text-center">Loading categories...</p>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left">
                <th className="pb-3">Name</th>
                <th className="pb-3">Description</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr className="border-t" key={category.categoryId}>
                  <td className="py-3 font-medium">{category.categoryName}</td>
                  <td>{category.categoryDescription}</td>
                  <td>{category.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <button onClick={() => openEdit(category)} className="mr-4 text-blue-600">Edit</button>
                    <button onClick={() => remove(category)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? "Edit category" : "Create category"} onClose={() => setModalOpen(false)}>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="mb-1 block font-medium">Category name</label>
              <input name="name" className="input" maxLength={100} defaultValue={editing?.categoryName ?? ""} required />
            </div>
            <div>
              <label className="mb-1 block font-medium">Description</label>
              <textarea name="description" className="input min-h-28" maxLength={250} defaultValue={editing?.categoryDescription ?? ""} required />
            </div>
            <label className="flex items-center gap-2">
              <input name="active" type="checkbox" defaultChecked={editing?.isActive ?? true} /> Active
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" className="rounded-xl border px-4 py-2" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
