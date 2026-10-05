"use client";

import CategoryTabs from "@/components/pos/CategoryTabs";
import OrderCart from "@/components/pos/OrderCart";
import PaymentModal from "@/components/pos/PaymentModal";
import ProductGrid from "@/components/pos/ProductGrid";
import ProductModal from "@/components/pos/ProductModal";
import { Category, Product, ProductOption, CartItem } from "@/types/product";
import { useState } from "react";
import SuccessAlertModal from "@/components/pos/SuccessAlertModal";

const MOCK_CATEGORIES: Category[] = [
  { id: "snacks", name: "ເຄື່ອງກິນຫຼີ້ນ" },
  { id: "coffee", name: "ປະເພດກາເຟ" },
  { id: "ice-cream", name: "ໄອສຄຣີມ" },
  { id: "fruit-tea", name: "ຊາໝາກໄມ້" },
  { id: "milk-tea", name: "ຊານົມ" },
];

function POSPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);

  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState<boolean>(false);
  const [lastPaymentInfo, setLastPaymentInfo] = useState<{
    total: number;
    change: number;
  }>({ total: 0, change: 0 });

  const grandTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectProduct = (product: Product) => {
    setEditingItem(null); // เคลียร์สถานะการแก้ไข
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEditCartItem = (item: CartItem) => {
    setEditingItem(item);
    setSelectedProduct(item.product);
    setIsModalOpen(true);
  };

  // ฟังก์ชันรับค่าเมื่อกดยืนยันจาก ProductModal
  const handleConfirmOrder = (
    product: Product,
    options: ProductOption,
    quantity: number,
    itemId?: string,
  ) => {
    // คำนวณราคาท็อปปิ้ง
    const toppingPrice = (options.toppings?.length || 0) * 4000;
    const unitPrice = product.price + toppingPrice;
    const totalPrice = unitPrice * quantity;

    // สร้าง Unique ID โดยอิงจาก id สินค้า + ความหวาน + น้ำแข็ง + ท็อปปิ้ง
    const newOptionKey = `${product.id}-${options.sweetness || ""}-${options.ice || ""}-${(options.toppings || []).sort().join(",")}`;

    setCartItems((prevItems) => {
      let updatedList = [...prevItems];

      // หากเป็นการแก้ไข ให้เอาอันเก่าออกก่อน
      if (itemId) {
        updatedList = updatedList.filter((item) => item.id !== itemId);
      }

      // เช็กว่ามีรายการใหม่ที่ option ตรงกับอันที่มีอยู่เดิมในตะกร้าหรือไม่
      const existingIndex = updatedList.findIndex(
        (item) => item.id === newOptionKey,
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

  // ฟังก์ชันปรับจำนวนในตะกร้า (+ / -)
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty < 1) return null; // ถ้าลดเหลือ 0 ให้เตรียมลบออก

            const unitPrice =
              item.product.price + (item.options.toppings?.length || 0) * 4000;
            return {
              ...item,
              quantity: newQty,
              totalPrice: unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null),
    );
  };

  // ฟังก์ชันลบรายการออกจากตะกร้า
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ฟังก์ชันล้างตะกร้า
  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handlePrintReceipt = (): void => {
    console.log("ອະນາຄົດ: ລະບົບກຳລັງສັ່ງປິ້ນໃບບິນອັດຕະໂນມັດ...");
    // ບ່ອນນີ້ເອົາໄວ້ຂຽນ Logic ຕໍ່ກັບເຄື່ອງປິ້ນ Thermal Slip 58mm/80mm ໃນອະນາຄົດ
  };

  const handleConfirmPayment = (receivedAmount: number, change: number) => {
    setLastPaymentInfo({
      total: grandTotal,
      change: change,
    });

    handlePrintReceipt();

    
    setCartItems([]);
    setIsPaymentOpen(false);
    
    setIsSuccessAlertOpen(true);
  };

  return (
    <div className="flex gap-2 h-full w-full overflow-hidden">
      {/* ฝั่งซ้าย: ตะกร้าสินค้า (รอสร้าง Component ถัดไป) */}
      <div className="w-1/2 flex flex-col overflow-hidden bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <OrderCart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onEditItem={handleEditCartItem}
          onCheckout={() => setIsPaymentOpen(true)}
        />
      </div>

      {/* ฝั่งขวา: เลือกหมวดหมู่ และ รายการสินค้า */}
      <div className="w-1/2 flex flex-row gap-2 h-full overflow-hidden">
        {/* พื้นที่แสดงรายการสินค้าตามหมวดหมู่ (ProductGrid) */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
          {/* ProductGrid component จะอยู่ตรงนี้ */}
          <div className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
            <ProductGrid
              selectedCategory={selectedCategory}
              onSelectProduct={handleSelectProduct}
            />
          </div>
        </div>

        {/* ปุ่มเลือกหมวดหมู่ */}
        <div className="h-full">
          <CategoryTabs
            categories={MOCK_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => setSelectedCategory(id)}
          />
        </div>

        <ProductModal
          key={`${selectedProduct?.id ?? "new"}-${editingItem?.id ?? "draft"}`}
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmOrder}
          initialItem={editingItem}
        />

        {/* Payment Modal */}
        <PaymentModal
          key={isPaymentOpen ? "open" : "closed"}
          isOpen={isPaymentOpen}
          grandTotal={grandTotal}
          totalItems={totalItems}
          onClose={() => setIsPaymentOpen(false)}
          onConfirmPayment={handleConfirmPayment}
        />

        <SuccessAlertModal
          isOpen={isSuccessAlertOpen}
          totalAmount={lastPaymentInfo.total}
          changeAmount={lastPaymentInfo.change}
          onClose={() => setIsSuccessAlertOpen(false)}
        />
      </div>
    </div>
  );
}

export default POSPage;
