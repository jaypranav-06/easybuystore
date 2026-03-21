import Link from 'next/link';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How do I track my order?',
          answer:
            'Once your order is shipped, you will receive an email with a tracking number. You can also track your order by visiting your account orders page and clicking on the specific order.',
        },
        {
          question: 'How long does shipping take?',
          answer:
            'Standard shipping typically takes 3-7 business days within Sri Lanka. Express shipping is available for 1-2 business days delivery. International orders may take 7-14 business days.',
        },
        {
          question: 'Do you ship internationally?',
          answer:
            'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. International shipping rates will be calculated at checkout.',
        },
        {
          question: 'Can I change my shipping address after placing an order?',
          answer:
            'If your order has not been shipped yet, you can contact us to update the shipping address. Once shipped, address changes are not possible.',
        },
      ],
    },
    {
      category: 'Payments',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer:
            'We accept PayPal, credit cards (Visa, Mastercard, American Express), and debit cards. All payments are processed securely through encrypted connections.',
        },
        {
          question: 'Is it safe to use my credit card on your site?',
          answer:
            'Yes, absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details on our servers.',
        },
        {
          question: 'Can I pay cash on delivery?',
          answer:
            'Currently, cash on delivery is not available. We accept online payments through PayPal and credit/debit cards.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          question: 'What is your return policy?',
          answer:
            'We offer a 30-day return policy for most items in unused condition with original packaging. Some exclusions apply for hygiene reasons (cosmetics, underwear, etc.).',
        },
        {
          question: 'How do I return an item?',
          answer:
            'Contact our customer service team to initiate a return. We will provide you with return instructions and a return shipping label if applicable.',
        },
        {
          question: 'When will I receive my refund?',
          answer:
            'Refunds are processed within 5-7 business days after we receive and inspect your return. The refund will be issued to your original payment method.',
        },
        {
          question: 'Who pays for return shipping?',
          answer:
            'For defective items or our mistakes, we cover return shipping. For other returns, customers are responsible for return shipping costs.',
        },
      ],
    },
    {
      category: 'Account & Orders',
      questions: [
        {
          question: 'Do I need an account to place an order?',
          answer:
            'Yes, you need to create an account to place an order. This allows you to track your orders, save addresses, and manage your account information.',
        },
        {
          question: 'Can I cancel my order?',
          answer:
            'You can cancel your order within 24 hours of placing it if it has not been shipped. After 24 hours or once shipped, cancellations are not possible, but you can return the item.',
        },
        {
          question: 'How do I change my password?',
          answer:
            'Go to your account settings page and use the "Change Password" section. You will need to enter your current password to set a new one.',
        },
        {
          question: 'I forgot my password. What should I do?',
          answer:
            'Click on "Forgot Password" on the sign-in page. Follow the instructions to reset your password. If you continue to have issues, contact our support team.',
        },
      ],
    },
    {
      category: 'Products',
      questions: [
        {
          question: 'How do I know what size to order?',
          answer:
            'Each product page includes a size guide. We recommend measuring yourself and comparing with our size chart for the best fit.',
        },
        {
          question: 'Are your products authentic?',
          answer:
            'Yes, all products sold on EasyBuyStore are 100% authentic. We work directly with authorized distributors and brands.',
        },
        {
          question: 'Do you restock sold-out items?',
          answer:
            'We try to restock popular items, but availability depends on the manufacturer. You can contact us to inquire about specific products.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary-light mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Find answers to commonly asked questions about our products, shipping, returns, and
            more.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b">
                {category.category}
              </h2>

              <div className="space-y-6">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-2">
                      <ChevronDown className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed pl-7">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg shadow-lg p-8 mt-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="mb-6 text-white/90">
            Can't find what you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Contact Support
            </Link>
            <Link
              href="/help"
              className="bg-white/10 text-white border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
