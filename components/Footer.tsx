// components/Footer.jsx
import { NavLinks } from "@/constants";
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto grid md:grid-cols-3 gap-6 text-center md:text-left justify-center">
        <div>
          <h3 className="font-semibold mb-2">ElectroX</h3>
          <p className="text-sm">High-quality electronics & great deals.</p>
        </div>
        <div>
          <ul className="space-y-1 flex flex-col items-center justify-center gap-2">
            {NavLinks.map((link)=>(
              <Link key={link.label} href={link.link}>{link.label}</Link>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-3">
            <a href="#"><span>🔗</span></a>
            <a href="#"><span>🔗</span></a>
            <a href="#"><span>🔗</span></a>
          </div>
        </div>
      </div>
      <div className="text-center mt-4 text-sm text-blue-200">
        &copy; {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
}
