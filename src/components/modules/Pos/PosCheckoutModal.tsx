"use client";

import React, { useState } from "react";
import { X, Loader2, CheckCircle2, DollarSign, User, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { createPosOrder } from "@/services/pos.services";

export default function PosCheckoutModal({ 
  subtotal, 
  cartItems,
  onClose, 
  onSuccess 
}: { 
  subtotal: number, 
  cartItems: any[],
  onClose: () => void, 
  onSuccess: () => void 
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  
  const [payment, setPayment] = useState({
    method: "Cash",
    received: subtotal
  });

  const change = Math.max(0, payment.received - subtotal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payment.received < subtotal) {
      return toast.error("Received amount is less than total!");
    }

    setIsProcessing(true);
    
    const payload = {
      subtotal,
      discount: 0,
      tax: 0,
      shippingCharge: 0,
      total: subtotal,
      customer: {
        name: customer.name || "Walk-in Customer",
        phone: customer.phone,
        address: customer.address,
      },
      payment: {
        method: payment.method,
        amount: payment.received,
        change: change,
      }
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <h2 className="text-xl font-bold text-gray-800">Complete Payment</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Left Column: Customer Details */}
          <div className="flex-1 p-6 space-y-5 bg-white">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-primary" />
              Customer Details (Optional)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Walk-in Customer"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-sm"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="tel" 
                    placeholder="Optional"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-sm"
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Optional"
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all text-sm"
                    value={customer.address}
                    onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-4 mt-6 border-t border-gray-100">
               <h3 className="font-semibold text-gray-700 mb-3">Payment Method</h3>
               <div className="grid grid-cols-3 gap-2">
                 {["Cash", "Card", "MFS"].map(method => (
                   <button
                    key={method}
                    type="button"
                    onClick={() => setPayment({...payment, method})}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                      payment.method === method 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-gray-100 text-gray-500 hover:border-gray-200"
                    }`}
                   >
                     {method}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Column: Payment Details */}
          <div className="w-full md:w-[320px] bg-gray-50 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-3xl font-black text-gray-900">${subtotal.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount Received</label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    type="number" 
                    step="0.01"
                    min={subtotal}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary text-xl font-bold text-gray-800 transition-all"
                    value={payment.received || ""}
                    onChange={(e) => setPayment({...payment, received: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border border-green-100 flex justify-between items-center">
                <span className="font-medium text-green-800">Change Due</span>
                <span className="text-xl font-bold text-green-700">${change.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || payment.received < subtotal}
              className="w-full py-4 mt-8 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:bg-primary-dark hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Complete Sale
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
