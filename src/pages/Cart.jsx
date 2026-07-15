import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  Tag,
  Truck,
  Shield,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import Breadcrumb from "../components/Breadcrumb";

const FREE_SHIPPING_THRESHOLD = 100;

export default function Cart() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = useState(null);
  const [discount, setDiscount] = useState(0);

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const amountToAdd = FREE_SHIPPING_THRESHOLD - total;
  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const discountedTotal = total - (total * discount) / 100;
  const grandTotal = discountedTotal + shipping;

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "SAVE10") {
      setCouponStatus("valid");
      setDiscount(10);
    } else {
      setCouponStatus("invalid");
      setDiscount(0);
    }
  };

  const breadcrumbs = [
    { label: "Home", path: "/" },
    { label: "Shopping Cart", path: "/cart" },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbs} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#8B5CF6] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#7C3AED] transition-colors"
            >
              Continue Shopping
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbs} />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart{" "}
            <span className="text-gray-400 font-normal text-xl">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {amountToAdd > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Add <span className="font-semibold">${amountToAdd.toFixed(2)}</span> more
                    for free shipping!
                  </p>
                </div>
                <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {total >= FREE_SHIPPING_THRESHOLD && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    You've unlocked free shipping!
                  </p>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.cartId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60, height: 0, marginBottom: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-gray-100"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div className="min-w-0">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                              {item.brand}
                            </p>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>
                            {item.colorName && (
                              <p className="text-sm text-gray-500 mt-1">
                                Color: {item.colorName}
                              </p>
                            )}
                            {item.size && (
                              <p className="text-sm text-gray-500">
                                Size: {item.size}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => removeItem(item.cartId)}
                            className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="px-3 py-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity + 1)
                              }
                              className="px-3 py-2 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                            <p className="text-lg font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8B5CF6] font-medium mt-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="pt-2">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            if (couponStatus) setCouponStatus(null);
                          }}
                          placeholder="Enter code"
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {couponStatus === "valid" && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600 mt-2 flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        10% discount applied!
                      </motion.p>
                    )}
                    {couponStatus === "invalid" && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500 mt-2"
                      >
                        Invalid coupon code
                      </motion.p>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${(total * discount / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 mt-6 pt-6">
                  <div className="flex justify-between text-gray-900">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full mt-6 bg-[#8B5CF6] text-white py-3.5 rounded-xl font-semibold hover:bg-[#7C3AED] transition-colors flex items-center justify-center gap-2"
                >
                  Checkout
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Free Returns</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-3 text-center">
                    Accepted Payment Methods
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">VISA</span>
                    </div>
                    <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-red-500">MC</span>
                    </div>
                    <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-500">AMEX</span>
                    </div>
                    <div className="w-10 h-7 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-700">PP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
