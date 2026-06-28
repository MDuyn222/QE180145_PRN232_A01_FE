"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

export default function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/80 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="eyebrow">Manage record</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
