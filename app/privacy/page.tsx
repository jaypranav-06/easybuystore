import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          </div>

          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-600">
                EasyBuyStore ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
              <p className="text-gray-600 mb-4">
                When you create an account or place an order, we collect:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• Name and contact information (email, phone number)</li>
                <li>• Shipping and billing addresses</li>
                <li>• Payment information (processed securely through PayPal)</li>
                <li>• Order history and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-gray-600 mb-4">
                When you visit our website, we automatically collect:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• IP address and device information</li>
                <li>• Browser type and operating system</li>
                <li>• Pages visited and time spent on site</li>
                <li>• Referring website and search terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• Process and fulfill your orders</li>
                <li>• Send order confirmations and shipping updates</li>
                <li>• Respond to customer service requests</li>
                <li>• Improve our website and user experience</li>
                <li>• Send promotional emails (with your consent)</li>
                <li>• Prevent fraud and enhance security</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell or rent your personal information. We may share your information with:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• <strong>Service Providers:</strong> Payment processors, shipping companies, and email services</li>
                <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li>• <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information. However, no method of
                transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee
                absolute security.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> We use HTTPS encryption and secure payment processing through PayPal to protect
                  your financial information.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• Access the personal information we hold about you</li>
                <li>• Request correction of inaccurate information</li>
                <li>• Request deletion of your personal information</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Object to processing of your information</li>
              </ul>
              <p className="text-gray-600 mt-4">
                To exercise these rights, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic,
                and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-600">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> contact@easybuystore.com</p>
                <p className="text-gray-700 mb-2"><strong>Phone:</strong> +94 75 907 3302</p>
                <p className="text-gray-700"><strong>Address:</strong> 245, 3 De Fonseka Pl, Colombo 00400, Sri Lanka</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
