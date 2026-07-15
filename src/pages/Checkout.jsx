import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, CreditCard, Truck, Check, ChevronRight, MapPin, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { StripeProvider } from '../config/stripe';
import CheckoutForm from '../components/CheckoutForm';
import Breadcrumb from '../components/Breadcrumb';

const STEPS = [
  { id: 1, label: 'Information' },
  { id: 2, label: 'Shipping' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirmation' },
];

const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard Shipping', price: 0, time: '5-7 business days' },
  { id: 'express', label: 'Express Shipping', price: 12.99, time: '2-3 business days' },
  { id: 'overnight', label: 'Overnight Shipping', price: 24.99, time: 'Next business day' },
];

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Japan', 'Brazil', 'India', 'Nigeria',
];

const generateOrderNumber = () => {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [selectedShipping, setSelectedShipping] = useState('standard');

  const [clientSecret, setClientSecret] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    saveInfo: false,
  });

  const shippingCost = SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.price || 0;
  const taxEstimate = total * 0.08;
  const promoDiscount = promoApplied ? total * 0.1 : 0;
  const orderTotal = total + shippingCost + taxEstimate - promoDiscount;

  useEffect(() => {
    if (currentStep === 3 && paymentMethod === 'credit' && !clientSecret) {
      createPaymentIntent();
    }
  }, [currentStep, paymentMethod]);

  const createPaymentIntent = async () => {
    try {
      setPaymentLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(orderTotal * 100),
          currency: 'usd',
          metadata: { items: items.length.toString() },
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setClientSecret(data.clientSecret);
    } catch (err) {
      setPaymentError(err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!form.email.trim()) newErrors.email = 'Email is required';
      if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!form.address1.trim()) newErrors.address1 = 'Address is required';
      if (!form.city.trim()) newErrors.city = 'City is required';
      if (!form.state.trim()) newErrors.state = 'State is required';
      if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
      if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handlePlaceOrder = () => {
    setOrderNumber(generateOrderNumber());
    setOrderPlaced(true);
    setCurrentStep(4);
    clearCart();
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SHOES10') {
      setPromoApplied(true);
      setErrors((prev) => ({ ...prev, promo: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, promo: 'Invalid promo code' }));
    }
  };

  const InputField = ({ label, name, type = 'text', placeholder, colSpan = '' }) => (
    <div className={colSpan}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-green-600" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Order Confirmed!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 mb-6"
            >
              Thank you for your purchase
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 rounded-xl p-6 mb-8"
            >
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="text-lg font-mono font-bold text-brand-500">{orderNumber}</p>
              <div className="border-t border-gray-200 mt-4 pt-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Paid</span>
                  <span className="font-bold text-gray-900">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                to="/"
                className="px-8 py-3 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-600 transition text-center"
              >
                Continue Shopping
              </Link>
              <Link
                to="/account"
                className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition text-center"
              >
                View Orders
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Checkout' },
          ]}
        />

        <div className="flex items-center gap-3 mt-6 mb-8">
          <Lock className="w-6 h-6 text-brand-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="flex items-center justify-between mb-10 max-w-2xl">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={`text-xs mt-1 hidden sm:block ${
                    currentStep >= step.id ? 'text-gray-900 font-medium' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-12 sm:w-20 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Contact & Shipping Information</h2>

                  <div className="space-y-4">
                    <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField label="First Name" name="firstName" placeholder="John" />
                      <InputField label="Last Name" name="lastName" placeholder="Doe" />
                    </div>

                    <InputField label="Address Line 1" name="address1" placeholder="123 Main Street" />
                    <InputField
                      label="Address Line 2 (Optional)"
                      name="address2"
                      placeholder="Apartment, suite, etc."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <InputField label="City" name="city" placeholder="New York" />
                      <InputField label="State" name="state" placeholder="NY" />
                      <InputField label="ZIP Code" name="zip" placeholder="10001" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <InputField
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                    />

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={form.saveInfo}
                        onChange={handleChange}
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                      />
                      <span className="text-sm text-gray-600">Save this information for next time</span>
                    </label>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full mt-8 bg-brand-500 text-white font-semibold py-3 rounded-lg hover:bg-brand-600 transition flex items-center justify-center gap-2"
                  >
                    Continue to Shipping
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Method</h2>

                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition ${
                          selectedShipping === method.id
                            ? 'border-brand-500 bg-brand-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShipping === method.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="w-4 h-4 text-brand-500 focus:ring-brand-500"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{method.label}</p>
                            <p className="text-sm text-gray-500">{method.time}</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">
                          {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 bg-brand-500 text-white font-semibold py-3 rounded-lg hover:bg-brand-600 transition flex items-center justify-center gap-2"
                    >
                      Continue to Payment
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm p-6 md:p-8"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>

                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setPaymentMethod('credit')}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                        paymentMethod === 'credit'
                          ? 'bg-brand-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Credit Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                        paymentMethod === 'paypal'
                          ? 'bg-brand-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      PayPal
                    </button>
                  </div>

                  {paymentMethod === 'credit' ? (
                    <div className="space-y-4">
                      {paymentLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
                          <p className="text-gray-500">Preparing secure payment...</p>
                        </div>
                      ) : paymentError ? (
                        <div className="text-center py-12">
                          <p className="text-red-500 mb-4">{paymentError}</p>
                          <button
                            onClick={createPaymentIntent}
                            className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : clientSecret ? (
                        <StripeProvider clientSecret={clientSecret}>
                          <CheckoutForm onSuccess={handlePlaceOrder} />
                        </StripeProvider>
                      ) : null}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-blue-600">P</span>
                      </div>
                      <p className="text-gray-600 font-medium mb-2">Pay with PayPal</p>
                      <p className="text-sm text-gray-400 mb-4">
                        You will be redirected to PayPal to complete your purchase
                      </p>
                      <button
                        onClick={handlePlaceOrder}
                        className="px-8 py-3 bg-[#0070ba] text-white font-semibold rounded-lg hover:bg-[#005ea6] transition"
                      >
                        Continue with PayPal
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-6 p-3 bg-green-50 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-700">
                      Your payment info is secure and encrypted
                    </span>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax Estimate</span>
                  <span className="font-medium">${taxEstimate.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promo (SHOES10)</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value);
                      if (errors.promo) setErrors((prev) => ({ ...prev, promo: undefined }));
                    }}
                    placeholder="Enter code"
                    disabled={promoApplied}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition disabled:bg-gray-50"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoApplied}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400"
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {errors.promo && <p className="text-red-500 text-xs mt-1">{errors.promo}</p>}
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                <Lock className="w-3 h-3" />
                <span>Secure 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-lg font-bold text-gray-900">${orderTotal.toFixed(2)}</span>
        </div>
        {currentStep === 3 ? null : (
          <button
            onClick={handleNext}
            className="w-full bg-brand-500 text-white font-semibold py-3 rounded-lg hover:bg-brand-600 transition flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
