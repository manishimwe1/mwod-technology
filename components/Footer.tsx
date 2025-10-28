// components/Footer.jsx
import { NavLinks } from "@/constants";
import Link from "next/link";
import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center md:text-left">
        <div className="col-span-1">
          <h3 className="text-xl font-bold text-white mb-4">ElectroX</h3>
          <p className="text-sm leading-relaxed">Your ultimate destination for high-quality electronics and unbeatable deals. Discover innovation, reliability, and exceptional customer service.</p>
        </div>
        <div className="col-span-1">
          <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {NavLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.link}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              <Facebook size={24} />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              <Twitter size={24} />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">
              <Instagram size={24} />
            </a>
          </div>
        </div>
        <div className="col-span-1">
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <p className="text-sm">Email: info@electrox.com</p>
          <p className="text-sm">Phone: +1 (555) 123-4567</p>
          <p className="text-sm">Address: 123 Tech Lane, Innovation City, TX 78701</p>
        </div>
      </div>
      <div className="text-center border-t border-gray-700 pt-6 mt-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
}
