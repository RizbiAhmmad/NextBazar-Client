"use client";

import React, { useState } from "react";
import { X, Loader2, CheckCircle2, User, MapPin, Phone, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { createPosOrder } from "@/services/pos.services";

type PaymentMethod = "cash" | "card" | "mfs" | "other";

const PAYMENT_METHODS: { id: PaymentMethod; emoji: string; label: string }[] = [
  { id: "cash", emoji: "💵", label: "Cash" },
  { id: "card", emoji: "💳", label: "Card" },
  { id: "mfs", emoji: "📱", label: "MFS" },
  { id: "other", emoji: "🧾", label: "Other" },
];

const fmt = (v: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PosCheckoutModal({
  subtotal,
  discount,
  vatAmount,
  total,
  cartItems,
  onClose,
  onSuccess,
}: {
  subtotal: number;
  discount: number;
  vatAmount: number;
  total: number;
  cartItems: any[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"customer" | "payment">("customer");

  // Customer info
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [inputAmount, setInputAmount] = useState("");

  // Change: only for cash
  const paid = parseFloat(inputAmount || "0");
  const change = paymentMethod === "cash" ? Math.max(0, paid - total) : 0;

  // Numpad
  const handleNumpad = (key: string) => {
    if (key === "⌫") {
      setInputAmount((prev) => prev.slice(0, -1));
    } else if (key === "Clear") {
      setInputAmount("");
    } else if (key === "." && inputAmount.includes(".")) {
      return; // prevent double dot
    } else {
      setInputAmount((prev) => prev + key);
    }
  };

  const numpadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", ".", "⌫", "Clear"];

  const handleSubmit = async () => {
    if (paymentMethod === "cash" && paid < total) {
      toast.error("Cash received is less than total amount!");
      return;
    }

    setIsProcessing(true);
    const payload = {
      subtotal,
      discount,
      tax: vatAmount,
      shippingCharge: 0,
      total,
      customer: {
        name: customer.name || "Walk-in Customer",
        phone: customer.phone || null,
        address: customer.address || null,
      },
      payment: {
        method: paymentMethod,
        amount: paid,
        change,
      },
    };

    const res = await createPosOrder(payload);
    setIsProcessing(false);

    if (res?.success) {
      toast.success("Order completed successfully!");
      onSuccess();
    } else {
      toast.error(res?.message || "Failed to create order");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">

        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Complete Payment</h2>
            <p className="text-xs text-gray-400">
              {step === "customer" ? "Step 1 — Customer Details" : "Step 2 — Select Payment"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden divide-x divide-gray-100">

          {/* ─── LEFT PANEL ─── */}
          <div className="flex-1 overflow-y-auto flex flex-col">

            {/* Step 1: Customer Info */}
            <div className="p-5 space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Customer Details <span className="text-gray-400 font-normal text-xs">(Optional)</span>
              </h3>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Walk-in Customer"
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-sm"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-sm"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Address (optional)"
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-sm"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="px-5">
              <hr className="border-gray-100" />
            </div>

            {/* Step 2: Payment Method */}
            <div className="p-5 space-y-3">
              <h3 className="font-semibold text-gray-700">Select Payment Method</h3>
              <div className="grid grid-cols-4 gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setPaymentMethod(m.id); setInputAmount(""); }}
                    className={`py-2.5 px-1 rounded-xl text-sm font-semibold border-2 transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === m.id
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-gray-100 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-xs">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Method-specific input label */}
              <div className="mt-2">
                {paymentMethod === "cash" && <p className="text-xs text-gray-500 mb-1">Enter cash received amount:</p>}
                {paymentMethod === "card" && <p className="text-xs text-gray-500 mb-1">Last 4 digits of card:</p>}
                {paymentMethod === "mfs" && <p className="text-xs text-gray-500 mb-1">Mobile number used:</p>}
                {paymentMethod === "other" && <p className="text-xs text-gray-500 mb-1">Reference / note:</p>}

                {paymentMethod === "other" ? (
                  <textarea
                    rows={2}
                    placeholder="Write reference..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all resize-none"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                  />
                ) : (
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type={paymentMethod === "cash" ? "number" : "text"}
                      maxLength={paymentMethod === "card" ? 4 : undefined}
                      placeholder={
                        paymentMethod === "cash" ? "0.00"
                        : paymentMethod === "card" ? "1234"
                        : "01XXXXXXXXX"
                      }
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Cash numpad */}
              {paymentMethod === "cash" && (
                <div className="grid grid-cols-3 gap-2">
                  {numpadKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleNumpad(key)}
                      className={`py-3 rounded-xl text-base font-semibold border border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                        key === "Clear" ? "col-span-2 text-red-500 hover:bg-red-50" : ""
                      } ${key === "⌫" ? "text-orange-500 hover:bg-orange-50" : ""}`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT PANEL: Order Summary ─── */}
          <div className="w-72 bg-gray-50 flex flex-col p-5 gap-4">
            <h3 className="font-semibold text-gray-700 text-sm">Order Summary</h3>

            {/* Items */}
            <div className="space-y-2 flex-1 overflow-y-auto max-h-48 pr-1">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between text-xs text-gray-600">
                  <span className="truncate pr-2 flex-1">{item.productName} ×{item.quantity}</span>
                  <span className="font-medium flex-shrink-0">৳{fmt(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 space-y-2 pt-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{fmt(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{fmt(discount)}</span>
                </div>
              )}
              {vatAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>VAT</span>
                  <span>+৳{fmt(vatAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary">৳{fmt(total)}</span>
              </div>
            </div>

            {/* Change (cash only) */}
            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <div className={`p-3 rounded-xl text-sm flex justify-between ${paid >= total && paid > 0 ? "bg-green-50 border border-green-100" : "bg-gray-100"}`}>
                  <span className="text-gray-600">Cash Received</span>
                  <span className="font-bold">৳{fmt(paid)}</span>
                </div>
                <div className={`p-3 rounded-xl text-sm flex justify-between ${change > 0 ? "bg-blue-50 border border-blue-100" : "bg-gray-100"}`}>
                  <span className="text-gray-600">Change Due</span>
                  <span className="font-bold text-blue-700">৳{fmt(change)}</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing || (paymentMethod === "cash" && paid < total)}
              className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Complete Sale
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
