import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5080",
});

api.interceptors.request.use((c) => {
  if (typeof window !== "undefined") {
    const t = localStorage.getItem("token");
    if (t) c.headers.Authorization = `Bearer ${t}`;
  }
  return c;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error?.response?.status;
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register" ||
        window.location.pathname === "/admin/login";

      if (status === 401 && !isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("storage"));
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export type Category = {
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  isActive: boolean;
};

export type Product = {
  productId: number;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId: number;
  categoryName?: string;
  accountId?: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
};

export type CartItemDto = {
  cartItemId: number;
  productId: number;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type CartDto = {
  cartId: number;
  items: CartItemDto[];
  total: number;
};

export type OrderItemDto = {
  orderItemId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type OrderDto = {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItemDto[];
};

export type UserInfo = {
  token: string;
  role: string;
  email: string;
  fullName: string;
  accountId?: number;
};

export const money = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

// Auth helpers
export const getUser = (): UserInfo | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    clearUser();
    return null;
  }
};

export const setUser = (u: UserInfo) => {
  localStorage.setItem("token", u.token);
  localStorage.setItem("user", JSON.stringify(u));
};

export const clearUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
