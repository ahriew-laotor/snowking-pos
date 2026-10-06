"use client";

import { supabase } from "@/lib/supabase";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Product, Category } from "@/types/product";
import { useAuth, ADMIN_PIN } from "@/lib/auth-context";
import { mapProductRow, ProductRow } from "@/lib/product-mapping";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  Sparkles,
  X,
  Filter,
  RefreshCw,
  Lock,
  ShieldAlert,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES: Category[] = [
  { id: "all", name: "ທັງໝົດ" },
  { id: "snacks", name: "ເຄື່ອງກິນຫຼີ້ນ" },
  { id: "coffee", name: "ກາເຟ" },
  { id: "ice-cream", name: "ໄອສຄຣີມ" },
  { id: "fruit-tea", name: "ຊາໝາກໄມ້" },
  { id: "milk-tea", name: "ຊານົມ" },
];

export default function ProductsPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsMounted(true), 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const router = useRouter();
  const { user, isAdmin, elevateToAdmin } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);
  const [productsError, setProductsError] = useState("");
  const [productsLoadError, setProductsLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "unavailable">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Admin PIN Unlock state if accessed by staff/non-admin
  const [unlockPin, setUnlockPin] = useState("");
  const [unlockError, setUnlockError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State for Add/Edit
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState<string>("");
  const [formCategoryId, setFormCategoryId] = useState("milk-tea");
  const [formAvailable, setFormAvailable] = useState(true);

  // Delete Confirmation State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setProductsError("");
    setProductsLoadError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;

      setProducts((data ?? []).map((row) => mapProductRow(row as ProductRow)));
    } catch (error) {
      setProducts([]);
      setProductsLoadError(
        error instanceof Error ? error.message : "Could not read products from Supabase."
      );
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const timeoutId = window.setTimeout(() => void loadProducts(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [isAdmin, loadProducts]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === "all" || item.categoryId === selectedCategory;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "available"
          ? item.available !== false
          : item.available === false;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, statusFilter]);

  // Stats
  const totalCount = products.length;
  const availableCount = products.filter((p) => p.available !== false).length;
  const unavailableCount = totalCount - availableCount;

  // Toggle Availability
  const handleToggleAvailable = async (product: Product) => {
    setProductsError("");
    setUpdatingProductId(product.id);

    try {
      const { data, error } = await supabase
        .from("products")
        .update({ available: product.available === false })
        .eq("id", product.id)
        .select("*")
        .single();
      if (error) throw error;

      const updatedProduct = mapProductRow(data as ProductRow);
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? updatedProduct : item))
      );
    } catch (error) {
      setProductsError(
        error instanceof Error ? error.message : "Could not read the updated product."
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setProductsError("");
    setEditingProduct(null);
    setFormName("");
    setFormPrice("");
    setFormCategoryId("milk-tea");
    setFormAvailable(true);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (product: Product) => {
    setProductsError("");
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormCategoryId(product.categoryId);
    setFormAvailable(product.available ?? true);
    setIsModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice);
    if (!formName.trim() || !Number.isFinite(priceNum) || priceNum < 0) {
      setProductsError("ກະລຸນາກວດຊື່ສິນຄ້າ ແລະ ລາຄາກ່ອນບັນທຶກ");
      return;
    }

    setProductsError("");
    setIsSavingProduct(true);
    const productData = {
      name: formName.trim(),
      price: priceNum,
      category_id: formCategoryId,
      available: formAvailable,
    };

    try {
      const result = editingProduct
        ? await supabase
            .from("products")
            .update(productData)
            .eq("id", editingProduct.id)
            .select("*")
            .single()
        : await supabase.from("products").insert(productData).select("*").single();
      if (result.error) throw result.error;

      const savedProduct = mapProductRow(result.data as ProductRow);
      setProducts((prev) =>
        editingProduct
          ? prev.map((item) =>
              item.id === editingProduct.id ? savedProduct : item
            )
          : [savedProduct, ...prev]
      );
      setIsModalOpen(false);
    } catch (error) {
      setProductsError(
        error instanceof Error ? error.message : "Could not read the saved product."
      );
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;

    setProductsError("");
    setIsDeletingProduct(true);

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deletingProduct.id)
        .select("id")
        .single();
      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (error) {
      setProductsError(
        error instanceof Error ? error.message : "Could not delete the product."
      );
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const getCategoryName = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.name : catId;
  };

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPin === ADMIN_PIN) {
      elevateToAdmin(unlockPin);
      setUnlockError("");
      setUnlockPin("");
    } else if (unlockPin === "888888") {
      setUnlockError("ລະຫັດ 888888 ແມ່ນສຳລັບພະນັກງານ! ບໍ່ມີສິດເຂົ້າໜ້າຈັດການສິນຄ້າ");
    } else {
      setUnlockError("ລະຫັດຜ່ານ Admin ບໍ່ຖືກຕ້ອງ!");
    }
  };

   if (!isMounted) {
     return (
       <div className="flex flex-col h-full w-full bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-200">
         {/* Header Skeleton */}
         <div className="flex justify-between items-center pb-4 border-b border-gray-200">
           <div className="flex items-center gap-2">
             <Skeleton className="w-9 h-9 rounded-xl bg-gray-200" />
             <div className="space-y-2">
               <Skeleton className="h-5 w-48 bg-gray-200" />
               <Skeleton className="h-3 w-64 bg-gray-200" />
             </div>
           </div>
           <Skeleton className="h-10 w-32 rounded-xl bg-gray-200" />
         </div>

         {/* KPI Cards Skeleton */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
           {[...Array(3)].map((_, i) => (
             <div
               key={i}
               className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center"
             >
               <div className="space-y-2 w-2/3">
                 <Skeleton className="h-3 w-16 bg-gray-200" />
                 <Skeleton className="h-7 w-24 bg-gray-200" />
               </div>
               <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
             </div>
           ))}
         </div>

         {/* Table/List Grid Skeleton */}
         <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 space-y-3">
           <div className="flex justify-between items-center mb-4">
             <Skeleton className="h-8 w-64 bg-gray-200" />
             <Skeleton className="h-8 w-32 bg-gray-200" />
           </div>
           {[...Array(5)].map((_, i) => (
             <div
               key={i}
               className="flex justify-between items-center py-2 border-b border-gray-100"
             >
               <div className="flex items-center gap-3 w-1/3">
                 <Skeleton className="w-9 h-9 rounded-lg bg-gray-200" />
                 <div className="space-y-1 w-full">
                   <Skeleton className="h-4 w-3/4 bg-gray-200" />
                   <Skeleton className="h-3 w-1/2 bg-gray-200" />
                 </div>
               </div>
               <Skeleton className="h-5 w-20 rounded-full bg-gray-200" />
               <Skeleton className="h-5 w-16 bg-gray-200" />
               <Skeleton className="h-8 w-16 rounded-lg bg-gray-200" />
             </div>
           ))}
         </div>
       </div>
     );
   }

  // Staff Restriction Guard
  if (!isAdmin) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden text-center animate-in zoom-in-95 duration-200">
          <div className="bg-rose-600 text-white p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
              <ShieldAlert className="w-9 h-9 text-rose-100" />
            </div>
            <h2 className="text-xl font-black tracking-tight">
              ຈຳກັດສິດທິການເຂົ້າເຖິງ (Admin Only)
            </h2>
            <p className="text-xs text-rose-100 mt-1 max-w-xs">
              ໜ້າຈັດການສິນຄ້າສະເພາະຜູ້ດູແລລະບົບເທົ່ານັ້ນ
            </p>
          </div>

          <div className="p-6">
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 mb-5 text-left flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">ສະຖານະປະຈຸບັນ: </span>
                {user ? user.name : "ພະນັກງານ (Staff - 888888)"}
                <br />
                <span className="text-[11px] text-amber-700">
                  ລະຫັດ 888888 ບໍ່ສາມາດເພີ່ມ, ແກ້ໄຂ ຫຼື ລົບສິນຄ້າໄດ້
                </span>
              </div>
            </div>

            <form onSubmit={handleUnlockAdmin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5 text-left">
                  ປົດລັອກດ້ວຍລະຫັດແອດມິນ (Admin PIN):
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={unlockPin}
                    onChange={(e) => {
                      setUnlockPin(e.target.value);
                      setUnlockError("");
                    }}
                    placeholder="ປ້ອນລະຫັດ"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 font-bold text-center tracking-widest text-base focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {unlockError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-left">
                  {unlockError}
                </div>
              )}

              <button
                type="submit"
                disabled={unlockPin.length !== 6}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                ປົດລັອກເຂົ້າສູ່ໜ້າສິນຄ້າ
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push("/pos")}
                className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ກັບໄປໜ້າຂາຍ (POS Terminal)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 rounded-xl p-2.5 sm:p-4 overflow-hidden border border-gray-200">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-gray-800 tracking-tight">
                  ຈັດການລາຍການສິນຄ້າ (Products)
                </h1>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-300">
                  Admin
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                ເພີ່ມ, ແກ້ໄຂ, ແລະ ປັບສະຖານະສິນຄ້າໜ້າຮ້ານ Snowking POS
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ເພີ່ມສິນຄ້າໃໝ່</span>
        </button>
      </div>

      {productsError && !isModalOpen && !deletingProduct && (
        <div
          role="alert"
          className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
        >
          {productsError}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-3 sm:mb-4 shrink-0">
        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider block">
              ສິນຄ້າທັງໝົດ
            </span>
            <span className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">
              {totalCount}{" "}
              <span className="text-xs font-bold text-gray-400">ລາຍການ</span>
            </span>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
              ພ້ອມຂາຍ (Available)
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
              {availableCount}{" "}
              <span className="text-xs font-bold text-emerald-400">ລາຍການ</span>
            </span>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-rose-500 uppercase tracking-wider block">
              ໝົດ / ປິດຂາຍ (Out of Stock)
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
              {unavailableCount}{" "}
              <span className="text-xs font-bold text-rose-400">ລາຍການ</span>
            </span>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-200 shadow-2xs mb-3 flex flex-col md:flex-row gap-2.5 sm:gap-3 justify-between items-stretch md:items-center shrink-0">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ຄົ້ນຫາຕາມຊື່ສິນຄ້າ..."
            className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Tabs & Status Filter */}
        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full no-scrollbar">
            <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1 hidden sm:block" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-gray-200 hidden md:block" />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "all" | "available" | "unavailable"
              )
            }
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">ສະຖານະ: ທັງໝົດ</option>
            <option value="available">ສະຖານະ: ພ້ອມຂາຍ</option>
            <option value="unavailable">ສະຖານະ: ປິດຂາຍ</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-amber-600 shadow-2xs"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-amber-600 shadow-2xs"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden flex flex-col min-h-0">
        {isLoadingProducts ? (
          <div className="flex-1 flex items-center justify-center text-sm font-semibold text-gray-500">
            ກຳລັງໂຫຼດສິນຄ້າຈາກ Supabase...
          </div>
        ) : productsLoadError ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm font-semibold text-rose-600">
              ໂຫຼດສິນຄ້າຈາກ Supabase ບໍ່ສຳເລັດ
            </p>
            <p className="text-xs text-gray-500">{productsLoadError}</p>
            <button
              type="button"
              onClick={() => void loadProducts()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              ລອງໂຫຼດອີກຄັ້ງ
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <Package className="w-12 h-12 text-gray-300 mb-2 stroke-1" />
            <p className="text-sm font-bold text-gray-600">ບໍ່ພົບລາຍການສິນຄ້າ</p>
            <p className="text-xs text-gray-400 mt-1">
              ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ໝວດໝູ່ທີ່ເຈົ້າເລືອກ
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setStatusFilter("all");
              }}
              className="mt-4 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ຣີເຊັດການຄົ້ນຫາ</span>
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* Table View — Responsive with horizontal scroll wrapper */
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="min-w-155 w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[11px] uppercase tracking-wider font-bold sticky top-0 z-10">
                  <th className="py-3 px-4">ສິນຄ້າ (Product)</th>
                  <th className="py-3 px-4">ໝວດໝູ່ (Category)</th>
                  <th className="py-3 px-4 text-right">ລາຄາ (Price LAK)</th>
                  <th className="py-3 px-4 text-center">ສະຖານະ (Availability)</th>
                  <th className="py-3 px-4 text-center">ຈັດການ (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredProducts.map((product) => {
                  const isAvailable = product.available !== false;
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      <td className="py-3 px-4 font-bold text-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-200 text-amber-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <span className="block leading-snug">{product.name}</span>
                          <span className="text-[10px] font-mono font-medium text-gray-400">
                            ID: {product.id}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {getCategoryName(product.categoryId)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-amber-600">
                        {product.price.toLocaleString()}{" "}
                        <span className="text-xs font-bold text-gray-400">LAK</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => void handleToggleAvailable(product)}
                          disabled={updatingProductId === product.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            isAvailable
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isAvailable ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                            }`}
                          />
                          <span>{isAvailable ? "ພ້ອມຂາຍ" : "ປິດຂາຍ"}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-100/60 rounded-lg transition-all cursor-pointer"
                            title="ແກ້ໄຂ"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="ລົບ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View — Fully Responsive */
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const isAvailable = product.available !== false;
              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl border p-3.5 flex flex-col justify-between transition-all shadow-2xs relative group ${
                    isAvailable
                      ? "border-gray-200 hover:border-amber-400 hover:shadow-md"
                      : "border-gray-200 bg-gray-50/60 opacity-75"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                        {getCategoryName(product.categoryId)}
                      </span>
                      <button
                        type="button"
                        onClick={() => void handleToggleAvailable(product)}
                        disabled={updatingProductId === product.id}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                          isAvailable
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-600 border-rose-200"
                        }`}
                      >
                        {isAvailable ? "ພ້ອມຂາຍ" : "ປິດຂາຍ"}
                      </button>
                    </div>

                    <h4 className="font-bold text-gray-800 text-sm sm:text-base leading-snug mb-1">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">
                        Price
                      </span>
                      <span className="text-sm sm:text-base font-black text-amber-600">
                        {product.price.toLocaleString()}{" "}
                        <span className="text-xs font-bold text-gray-400">LAK</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-100/60 rounded-lg transition-all cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info bar */}
        <div className="bg-gray-50 px-3 sm:px-4 py-2 border-t border-gray-200 flex justify-between items-center text-[11px] sm:text-xs text-gray-500 font-medium shrink-0">
          <span>
            ສະແດງ {filteredProducts.length} ຈາກ {totalCount} ລາຍການ
          </span>
          <span className="hidden sm:inline">Snowking POS • Product Management</span>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-amber-500 text-white px-4 sm:px-5 py-3.5 flex justify-between items-center shrink-0">
              <h3 className="text-base sm:text-lg font-bold">
                {editingProduct ? "ແກ້ໄຂສິນຄ້າ (Edit Product)" : "ເພີ່ມສິນຄ້າໃໝ່ (Add Product)"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1">
              {productsError && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                >
                  {productsError}
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  ຊື່ສິນຄ້າ (Product Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="ເຊັ່ນ: ຊານົມມຸກ, ໄອສຄຣີມ..."
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg font-bold text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  ໝວດໝູ່ (Category) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg font-bold text-sm focus:border-amber-500 focus:outline-none bg-white cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  ລາຄາ (Price in LAK) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="ເຊັ່ນ: 16000"
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg font-bold text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs font-bold text-gray-700">
                  ສະຖານະພ້ອມຂາຍ (Available for Sale)
                </span>
                <button
                  type="button"
                  onClick={() => setFormAvailable(!formAvailable)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    formAvailable ? "bg-amber-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      formAvailable ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer transition-all"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="w-2/3 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold text-xs shadow-md cursor-pointer disabled:cursor-wait transition-all"
                >
                  {isSavingProduct
                    ? "ກຳລັງບັນທຶກ..."
                    : editingProduct
                    ? "ບັນທຶກການແກ້ໄຂ"
                    : "ຢືນຢັນເພີ່ມສິນຄ້າ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-gray-800 text-base mb-1">
              ຢືນຢັນການລົບສິນຄ້າ?
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              ທ່ານຕ້ອງການລົບລາຍການ &quot;{deletingProduct.name}&quot; ອອກຈາກລະບົບແທ້ບໍ່?
            </p>
            {productsError && (
              <p role="alert" className="text-xs font-semibold text-rose-600 mb-3">
                {productsError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="w-1/2 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 cursor-pointer"
              >
                ຍົກເລີກ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeletingProduct}
                className="w-1/2 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-bold text-xs shadow-md cursor-pointer disabled:cursor-wait"
              >
                {isDeletingProduct ? "ກຳລັງລົບ..." : "ລົບສິນຄ້າ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}