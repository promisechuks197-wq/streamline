import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, MessageSquare } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb'

const faqData = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 5-7 business days. Express shipping delivers in 2-3 business days, and overnight shipping delivers the next business day. All orders over $100 qualify for free standard shipping."
      },
      {
        q: "Can I track my order?",
        a: "Yes! Once your order ships, you'll receive a confirmation email with a tracking number. You can also track your order in your account dashboard under 'My Orders'."
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship to the United States, Canada, United Kingdom, and select European countries. International shipping typically takes 7-14 business days."
      },
      {
        q: "Can I change or cancel my order?",
        a: "We process orders quickly! You can modify or cancel within 1 hour of placing your order. After that, please contact our support team and we'll do our best to help."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer free returns within 30 days of delivery. Items must be unworn, in original packaging, with all tags attached. Sale items can be returned within 14 days."
      },
      {
        q: "How do I start a return?",
        a: "Log into your account, go to 'My Orders', select the order, and click 'Return Item'. You'll receive a prepaid shipping label via email."
      },
      {
        q: "How long do refunds take?",
        a: "Refunds are processed within 3-5 business days after we receive your return. The credit will appear on your statement within 1-2 billing cycles."
      },
      {
        q: "Can I exchange for a different size?",
        a: "Yes! Select 'Exchange' when starting your return and choose your new size. We'll ship the new size as soon as we receive your return."
      }
    ]
  },
  {
    category: "Products & Sizing",
    questions: [
      {
        q: "How do I find my size?",
        a: "Check our Size Guide on each product page. We recommend measuring your foot length and comparing it to our size chart. If you're between sizes, we recommend going half a size up."
      },
      {
        q: "Are your shoes true to size?",
        a: "Most of our shoes run true to size. However, fit can vary by model. Each product page includes specific sizing notes from our team and customer reviews."
      },
      {
        q: "How do I care for my shoes?",
        a: "We include care instructions with each pair. Generally, we recommend spot cleaning with mild soap, air drying away from direct heat, and using a shoe protector spray for leather styles."
      },
      {
        q: "Are your products authentic?",
        a: "Absolutely! All StreamLined products are 100% authentic, designed and manufactured by our team. We stand behind the quality of every pair."
      }
    ]
  },
  {
    category: "Account & Payment",
    questions: [
      {
        q: "Do I need an account to order?",
        a: "No, you can check out as a guest. However, creating an account gives you access to order tracking, wishlist, faster checkout, and exclusive member deals."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted."
      },
      {
        q: "Is my payment information secure?",
        a: "Yes! We use industry-standard SSL encryption and PCI-compliant payment processing. We never store your full credit card number on our servers."
      },
      {
        q: "Do you offer gift cards?",
        a: "Yes! Digital gift cards are available in denominations from $25 to $500. They're delivered via email and never expire."
      }
    ]
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...faqData.map(c => c.category)]

  const filteredFaqs = faqData
    .filter(cat => activeCategory === 'All' || cat.category === activeCategory)
    .map(cat => ({
      ...cat,
      questions: cat.questions.filter(
        q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
             q.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(cat => cat.questions.length > 0)

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'FAQ' }]} />

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-dark-500 text-lg max-w-2xl mx-auto">
          Find answers to common questions about orders, shipping, returns, and more.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="input-field pl-12"
          />
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-gray-100 dark:bg-dark-800 text-dark-600 hover:bg-gray-200 dark:hover:bg-dark-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {filteredFaqs.map((cat, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-xl font-display font-bold mb-4">{cat.category}</h2>
              <div className="space-y-3">
                {cat.questions.map((faq, qIndex) => {
                  const globalIndex = `${catIndex}-${qIndex}`
                  const isOpen = openIndex === globalIndex
                  return (
                    <div
                      key={qIndex}
                      className="bg-white dark:bg-dark-900 rounded-xl border border-dark-100 dark:border-dark-800 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-medium pr-4">{faq.q}</span>
                        <ChevronDown
                          size={18}
                          className={`flex-shrink-0 text-dark-400 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 text-dark-600 dark:text-dark-400 leading-relaxed border-t border-dark-100 dark:border-dark-800 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-gray-50 dark:bg-dark-900 rounded-2xl p-12">
          <MessageSquare size={32} className="mx-auto text-brand-500 mb-4" />
          <h3 className="text-xl font-display font-bold mb-2">Still have questions?</h3>
          <p className="text-dark-500 mb-6">
            Our support team is here to help you with anything you need.
          </p>
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
