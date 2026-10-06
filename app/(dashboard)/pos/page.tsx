"use client";

import { useCallback, useEffect, useState } from "react";
import CategoryTabs from "@/components/pos/CategoryTabs";
import OrderCart from "@/components/pos/OrderCart";
import PaymentModal from "@/components/pos/PaymentModal";
import ProductGrid from "@/components/pos/ProductGrid";
import ProductModal from "@/components/pos/ProductModal";
import SuccessAlertModal from "@/components/pos/SuccessAlertModal";
import { Category, Product, ProductOption, CartItem } from "@/types/product";
import { ShoppingCart, Utensils, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { mapProductRow, ProductRow } from "@/lib/product-mapping";
import { supabase } from "@/lib/supabase";

const MOCK_CATEGORIES: Category[] = [
  { id: "snacks", name: "ເຄື່ອງກິນຫຼີ້ນ" },
  { id: "coffee", name: "ກາເຟ" },
  { id: "ice-cream", name: "ໄອສຄຣີມ" },
  { id: "fruit-tea", name: "ຊາໝາກໄມ້" },
  { id: "milk-tea", name: "ຊານົມ" },
];

export default function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    MOCK_CATEGORIES[0].id
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  // Mobile active tab: "menu" | "cart"
  const [mobileTab, setMobileTab] = useState<"menu" | "cart">("menu");

  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState<boolean>(false);
  const [lastPaymentInfo, setLastPaymentInfo] = useState<{
    total: number;
    change: number;
  }>({ total: 0, change: 0 });

  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setProductsError("");

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        throw error;
      }

      setProducts((data ?? []).map((row) => mapProductRow(row as ProductRow)));
    } catch (error) {
      setProducts([]);
      setProductsError(
        error instanceof Error
          ? error.message
          : "Could not load products from Supabase."
      );
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadProducts(), 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadProducts]);

  const grandTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectProduct = (product: Product) => {
    setEditingItem(null);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEditCartItem = (item: CartItem) => {
    setEditingItem(item);
    setSelectedProduct(item.product);
    setIsModalOpen(true);
  };

  const handleConfirmOrder = (
    product: Product,
    options: ProductOption,
    quantity: number,
    itemId?: string
  ) => {
    const toppingPrice = (options.toppings?.length || 0) * 4000;
    const unitPrice = product.price + toppingPrice;
    const totalPrice = unitPrice * quantity;

    const newOptionKey = `${product.id}-${options.sweetness || ""}-${
      options.ice || ""
    }-${(options.toppings || []).sort().join(",")}`;

    setCartItems((prevItems) => {
      let updatedList = [...prevItems];

      if (itemId) {
        updatedList = updatedList.filter((item) => item.id !== itemId);
      }

      const existingIndex = updatedList.findIndex(
        (item) => item.id === newOptionKey
      );

      if (existingIndex > -1) {
        const currentItem = updatedList[existingIndex];
        const newQty = itemId ? quantity : currentItem.quantity + quantity;

        updatedList[existingIndex] = {
          ...currentItem,
          quantity: newQty,
          totalPrice: unitPrice * newQty,
        };
      } else {
        updatedList.push({
          id: newOptionKey,
          product,
          quantity,
          options,
          totalPrice,
        });
      }

      return updatedList;
    });

    setEditingItem(null);
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty < 1) return null;

            const unitPrice =
              item.product.price +
              (item.options.toppings?.length || 0) * 4000;
            return {
              ...item,
              quantity: newQty,
              totalPrice: unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleConfirmPayment = (_receivedAmount: number, change: number) => {
    setLastPaymentInfo({
      total: grandTotal,
      change: change,
    });

    setCartItems([]);
    setIsPaymentOpen(false);
    setMobileTab("menu");
    setIsSuccessAlertOpen(true);
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden relative">
      {/* Mobile/Tablet Tab Switcher (< lg screens) */}
      <div className="lg:hidden flex items-center justify-between bg-white border border-gray-200 rounded-xl p-1 mb-2 shrink-0 shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileTab("menu")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === "menu"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>ເມນູສິນຄ້າ</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("cart")}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
            mobileTab === "cart"
              ? "bg-amber-500 text-white shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>ກະຕ່າ</span>
          {totalItems > 0 && (
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                mobileTab === "cart"
                  ? "bg-white text-amber-600"
                  : "bg-amber-500 text-white"
              }`}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex gap-2 overflow-hidden min-h-0">
        {/* Left Side: OrderCart (Desktop: visible always; Mobile: visible when mobileTab === 'cart') */}
        <div
          className={`
            w-full lg:w-95 xl:w-105 2xl:w-115 h-full overflow-hidden flex flex-col shrink-0
            ${mobileTab === "cart" ? "flex" : "hidden lg:flex"}
          `}
        >
          <OrderCart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onEditItem={handleEditCartItem}
            onCheckout={() => setIsPaymentOpen(true)}
            onBackToMenu={() => setMobileTab("menu")}
          />
        </div>

        {/* Right Side: ProductGrid & CategoryTabs (Desktop: visible always; Mobile: visible when mobileTab === 'menu') */}
        <div
          className={`
            flex-1 h-full overflow-hidden flex flex-col lg:flex-row gap-2 min-w-0
            ${mobileTab === "menu" ? "flex" : "hidden lg:flex"}
          `}
        >
          {/* Mobile Category Tabs on Top (< lg screens) */}
          <div className="lg:hidden shrink-0">
            <CategoryTabs
              categories={MOCK_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={(id) => setSelectedCategory(id)}
              orientation="horizontal"
            />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 bg-white p-2.5 sm:p-3.5 rounded-xl shadow-2xs border border-gray-200 overflow-hidden flex flex-col min-w-0">
            {isLoadingProducts ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-500">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                <span className="text-sm font-semibold">ກຳລັງໂຫຼດສິນຄ້າ...</span>
              </div>
            ) : productsError ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 text-center">
                <p className="text-sm font-semibold text-rose-600">
                  ໂຫຼດລາຍການສິນຄ້າຈາກ Supabase ບໍ່ສຳເລັດ
                </p>
                <p className="text-xs text-gray-500">{productsError}</p>
                <button
                  type="button"
                  onClick={() => void loadProducts()}
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  ລອງອີກຄັ້ງ
                </button>
              </div>
            ) : (
              <ProductGrid
                products={products}
                selectedCategory={selectedCategory}
                onSelectProduct={handleSelectProduct}
              />
            )}
          </div>

          {/* Desktop Category Tabs on Right (>= lg screens) */}
          <div className="hidden lg:flex h-full shrink-0 w-28 xl:w-32">
            <CategoryTabs
              categories={MOCK_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={(id) => setSelectedCategory(id)}
              orientation="vertical"
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Quick-Checkout Bar (< lg screens when in menu tab & cart has items) */}
      {mobileTab === "menu" && totalItems > 0 && (
        <div className="lg:hidden absolute bottom-2 left-2 right-2 z-30 animate-in slide-in-from-bottom-2 duration-150">
          <button
            type="button"
            onClick={() => setMobileTab("cart")}
            className="w-full bg-linear-to-r from-amber-500 to-amber-600 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border border-amber-400 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
                {totalItems}
              </div>
              <div className="text-left">
                <span className="text-[10px] text-amber-100 uppercase tracking-wider block font-bold">
                  ລາຍການໃນກະຕ່າ
                </span>
                <span className="text-sm font-black tracking-tight">
                  {grandTotal.toLocaleString()} LAK
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 font-black text-xs bg-white text-amber-700 px-3 py-1.5 rounded-xl shadow-xs">
              <span>ເບິ່ງກະຕ່າ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>
      )}

      {/* Product Customization Modal */}
      <ProductModal
        key={`${selectedProduct?.id ?? "new"}-${editingItem?.id ?? "draft"}`}
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmOrder}
        initialItem={editingItem}
      />

      {/* Payment Checkout Modal */}
      <PaymentModal
        key={isPaymentOpen ? "open" : "closed"}
        isOpen={isPaymentOpen}
        grandTotal={grandTotal}
        totalItems={totalItems}
        onClose={() => setIsPaymentOpen(false)}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Success Alert Modal */}
      <SuccessAlertModal
        key={isSuccessAlertOpen ? "alert-open" : "alert-closed"}
        isOpen={isSuccessAlertOpen}
        totalAmount={lastPaymentInfo.total}
        changeAmount={lastPaymentInfo.change}
        onClose={() => setIsSuccessAlertOpen(false)}
      />
    </div>
  );
}
