import Link from "next/link";
import { ShieldCheck, Store } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/70 bg-white/65 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white">
            <Store size={19} />
          </span>
          <div>
            <p className="font-black text-slate-950">SimpleShop</p>
            <p className="text-sm text-slate-500">
              Modern storefront for PRN232 Final Practical Exam.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-teal-700">
            <ShieldCheck size={16} />
            Secure account flow
          </span>
          <Link href="/search" className="hover:text-teal-700">
            Search
          </Link>
          <Link href="/login" className="hover:text-teal-700">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
