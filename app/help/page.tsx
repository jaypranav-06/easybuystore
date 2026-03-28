import Link from 'next/link';
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary-light mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>

              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I track my order?</h3>
                  <p className="text-gray-600">
                    Once your order is shipped, you'll receive an email with tracking information.
                    You can also track your order by going to your <Link href="/account/orders" className="text-primary hover:underline">account orders page</Link>.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                  <p className="text-gray-600">
                    We accept PayPal, credit cards (Visa, Mastercard, American Express), and debit cards.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How long does shipping take?</h3>
                  <p className="text-gray-600">
                    Standard shipping typically takes 3-7 business days within Sri Lanka. Express shipping is available for 1-2 business days delivery.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel my order?</h3>
                  <p className="text-gray-600">
                    You can cancel your order within 24 hours of placing it. After that, please contact our customer service team for assistance.
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What is your return policy?</h3>
                  <p className="text-gray-600">
                    We offer a 30-day return policy for most items. Please see our <Link href="/returns" className="text-primary hover:underline">returns page</Link> for detailed information.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Still need help?</h2>
              <p className="text-gray-600 mb-6">
                Our customer service team is here to help you with any questions or concerns.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/contact" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Contact Form</h3>
                    <p className="text-sm text-gray-600">Send us a message</p>
                  </div>
                </Link>

                <a href="mailto:contact@easybuystore.com" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition">
                  <Mail className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                    <p className="text-sm text-gray-600">contact@easybuystore.com</p>
                  </div>
                </a>

                <a href="tel:+94112345678" className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition">
                  <Phone className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                    <p className="text-sm text-gray-600">+94 75 907 3302</p>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
