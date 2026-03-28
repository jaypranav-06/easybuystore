import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>

          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing and using EasyBuyStore ("the Website"), you agree to be bound by these Terms of Service
                and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
                from using this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily access the materials on EasyBuyStore's website for personal,
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
                under this license you may not:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or public display</li>
                <li>• Attempt to reverse engineer any software on the Website</li>
                <li>• Remove any copyright or proprietary notations from the materials</li>
                <li>• Transfer the materials to another person or mirror the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Registration</h2>
              <p className="text-gray-600 mb-4">
                To make purchases on our Website, you must create an account. You agree to:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• Provide accurate, current, and complete information</li>
                <li>• Maintain and promptly update your account information</li>
                <li>• Maintain the security of your password</li>
                <li>• Accept responsibility for all activities under your account</li>
                <li>• Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Information</h2>
              <p className="text-gray-600">
                We strive to provide accurate product descriptions, pricing, and availability information. However, we
                do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable,
                current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to
                change or update information at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pricing and Payment</h2>
              <p className="text-gray-600 mb-4">
                All prices are in Sri Lankan Rupees (LKR) unless otherwise stated. We accept payment through:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• PayPal</li>
                <li>• Credit and Debit Cards</li>
              </ul>
              <p className="text-gray-600 mt-4">
                We reserve the right to refuse or cancel any order for any reason, including errors in product or
                pricing information, suspected fraud, or other reasons at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping and Delivery</h2>
              <p className="text-gray-600">
                Shipping times and costs vary depending on your location and chosen shipping method. Please refer to
                our <Link href="/shipping" className="text-primary hover:underline">Shipping Information</Link> page
                for detailed information. We are not responsible for delays caused by shipping carriers or customs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Returns and Refunds</h2>
              <p className="text-gray-600">
                Our return policy allows returns within 30 days of purchase for most items. Please review our
                {' '}<Link href="/returns" className="text-primary hover:underline">Returns & Refunds</Link> page
                for complete details on eligible items and the return process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
              <p className="text-gray-600 mb-4">
                You may not use our Website:
              </p>
              <ul className="space-y-2 text-gray-600 ml-6">
                <li>• In any way that violates any applicable law or regulation</li>
                <li>• To transmit any harmful code, viruses, or malicious software</li>
                <li>• To harass, abuse, or harm another person</li>
                <li>• To impersonate or attempt to impersonate the Company or another user</li>
                <li>• To engage in any automated use of the system</li>
                <li>• To interfere with or disrupt the Website or servers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-600">
                The Website and its original content, features, and functionality are owned by EasyBuyStore and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property
                laws. Our trademarks may not be used without our prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                In no event shall EasyBuyStore or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on our Website, even if we have been notified of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-600">
                These terms and conditions are governed by and construed in accordance with the laws of Sri Lanka, and
                you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. We will notify users of any material changes
                by posting the new Terms of Service on this page and updating the "Last updated" date. Your continued
                use of the Website following such changes constitutes your acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
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
