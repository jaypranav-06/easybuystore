import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <img src="/logo.svg" alt="EasyBuyStore" className="h-12 invert brightness-0" />
            <p className="text-sm leading-relaxed text-gray-400">
              Your destination for easy online shopping. Discover great products at amazing prices with fast delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-lg font-semibold font-['Playfair_Display']">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-white text-lg font-semibold font-['Playfair_Display']">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-accent transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-white text-lg font-semibold font-['Playfair_Display']">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-accent" />
                <span className="text-sm text-gray-400">245, 3 De Fonseka Pl, Colombo 00400, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 flex-shrink-0 text-accent" />
                <span className="text-sm text-gray-400">+94 75 907 3302</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 flex-shrink-0 text-accent" />
                <span className="text-sm text-gray-400">contact@easybuystore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EasyBuyStore. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
