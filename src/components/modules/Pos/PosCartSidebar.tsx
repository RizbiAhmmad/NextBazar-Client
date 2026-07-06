"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { updatePosCartItemQuantity, removePosCartItem, clearPosCart } from "@/services/pos.services";
import { toast } from "sonner";
import PosCheckoutModal from "./PosCheckoutModal";

export default function PosCartSidebar({ cartItems, refreshCart }: { cartItems: any[], refreshCart: () => void }) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleUpdateQuantity = async (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    setIsUpdating(id);
    const res = await updatePosCartItemQuantity(id, newQty);
    if (res?.success) {
      refreshCart();
    } else {
      toast.error(res?.message || "Failed to update quantity");
    }
    setIsUpdating(null);
  };

  const handleRemove = async (id: string) => {
    setIsUpdating(id);
    const res = await removePosCartItem(id);
    if (res?.success) {
      refreshCart();
    } else {
      toast.error(res?.message || "Failed to remove item");
    }
    setIsUpdating(null);
  };

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear the cart?")) return;
    const res = await clearPosCart();
    if (res?.success) {
      refreshCart();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          Current Order
        </h2>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-xs text-red-500 hover:text-red-700 hover:underline font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-medium">Cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition-colors relative group">
              {/* Image */}
              <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative">
                {item.productImage ? (
                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 pr-6">{item.productName}</h4>
                  {item.combination && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.combination}</p>
                  )}
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-100">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      disabled={item.quantity <= 1 || isUpdating === item.id}
                      className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-gray-600 hover:text-primary hover:shadow-sm disabled:opacity-50 transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      disabled={isUpdating === item.id}
                      className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-gray-600 hover:text-primary hover:shadow-sm transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove btn */}
              <button
                onClick={() => handleRemove(item.id)}
                disabled={isUpdating === item.id}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax</span>
          <span className="font-medium text-gray-900">$0.00</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Discount</span>
          <span className="font-medium text-green-600">-$0.00</span>
        </div>
        <div className="pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
          <span className="font-bold text-gray-800">Total</span>
          <span className="text-2xl font-black text-primary">${subtotal.toFixed(2)}</span>
        </div>

        <button
          onClick={() => setIsCheckoutOpen(true)}
          disabled={cartItems.length === 0}
          className="w-full py-3.5 mt-2 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          Proceed to Pay
        </button>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <PosCheckoutModal
          subtotal={subtotal}
          cartItems={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={() => {
            setIsCheckoutOpen(false);
            refreshCart();
          }}
        />
      )}
    </>
  );
}
