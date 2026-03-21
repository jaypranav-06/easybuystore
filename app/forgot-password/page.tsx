'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, AlertCircle, Info } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // For now, just show a message
    // TODO: Implement email-based password reset when email service is configured
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-surface flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">
            {submitted
              ? "We've received your request"
              : "Enter your email to reset your password"}
          </p>
        </div>

        {/* Form/Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!submitted ? (
            <>
              {/* Info Message */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Password Reset</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Enter your email address and we'll help you reset your password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition"
                >
                  Request Password Reset
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Request Received</h3>

              {/* Temporary Message (until email is configured) */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-yellow-800">Password Reset Options</p>
                    <p className="text-sm text-yellow-700 mt-2">
                      Currently, password reset via email is not available. Here are your options:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                      <li>Contact support for assistance</li>
                      <li>Create a new account if you can't remember your password</li>
                      <li>Try signing in with Google if you have the same email</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/signin"
                  className="block w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition"
                >
                  Back to Sign In
                </Link>
                <Link
                  href="/contact"
                  className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}

          {/* Sign In Link */}
          {!submitted && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Remember your password?{' '}
                <Link href="/signin" className="text-primary font-semibold hover:text-primary-light">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
