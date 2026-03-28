import Link from 'next/link';
import { ArrowLeft, Package, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnsPage() {
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
            <Package className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Returns & Refunds</h1>
          </div>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Return Policy</h2>
              <p className="text-gray-600 mb-4">
                We want you to be completely satisfied with your purchase. If you're not happy with your order,
                we offer a 30-day return policy for most items.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Eligible Items</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Items that can be returned:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Unopened items in original packaging</li>
                      <li>• Items with all tags and labels attached</li>
                      <li>• Items in unused and resalable condition</li>
                      <li>• Items purchased within the last 30 days</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Items that cannot be returned:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Opened or used personal care items</li>
                      <li>• Custom or personalized items</li>
                      <li>• Final sale or clearance items</li>
                      <li>• Perishable goods</li>
                      <li>• Digital products or gift cards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Return an Item</h2>
              <ol className="space-y-4 text-gray-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <div>
                    <strong className="text-gray-900">Contact Us:</strong> Email us at contact@easybuystore.com or call +94 75 907 3302 to initiate a return.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <div>
                    <strong className="text-gray-900">Get Authorization:</strong> We'll provide you with a Return Authorization Number and return instructions.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <div>
                    <strong className="text-gray-900">Pack the Item:</strong> Securely package the item with all original packaging, tags, and accessories.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <div>
                    <strong className="text-gray-900">Ship the Item:</strong> Send the package to the address provided. We recommend using a trackable shipping method.
                  </div>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Process</h2>
              <p className="text-gray-600 mb-4">
                Once we receive your return and verify its condition, we'll process your refund within 5-7 business days.
                The refund will be issued to your original payment method.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Original shipping costs are non-refundable. Return shipping costs are the responsibility
                  of the customer unless the return is due to our error or a defective product.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-600">
                If you have any questions about our return policy, please <Link href="/contact" className="text-primary hover:underline">contact us</Link> or
                visit our <Link href="/help" className="text-primary hover:underline">Help Center</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
