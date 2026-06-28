"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, Category } from "@/lib/api";
import { toast } from "sonner";
import Modal from "@/components/admin/Modal";
import { Edit3, FolderPlus, Trash2 } from "lucide-react";

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
      <div className="page-header">
        <div>
          <p className="eyebrow">Catalog setup</p>
          <h1 className="section-title mt-2">Category management</h1>
          <p className="muted mt-2">
            Organize product groups and control category visibility.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <FolderPlus size={18} />
          Create category
        </button>
      </div>

      <div className="table-wrap">
        {loading ? (
          <p className="py-8 text-center">Loading categories...</p>
        ) : (
          <table className="data-table min-w-[700px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.categoryId}>
                  <td className="font-bold text-slate-950">
                    {category.categoryName}
                  </td>
                  <td>{category.categoryDescription}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        category.isActive ? "status-active" : "status-muted"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => openEdit(category)}
                        className="btn-secondary px-3 py-2"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>
                      <button
                        onClick={() => remove(category)}
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
        <Modal title={editing ? "Edit category" : "Create category"} onClose={() => setModalOpen(false)}>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="label">Category name</label>
              <input name="name" className="input" maxLength={100} defaultValue={editing?.categoryName ?? ""} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea name="description" className="input min-h-28" maxLength={250} defaultValue={editing?.categoryDescription ?? ""} required />
            </div>
            <label className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700">
              <input name="active" type="checkbox" defaultChecked={editing?.isActive ?? true} className="h-4 w-4 accent-teal-600" /> Active
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="btn-primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
