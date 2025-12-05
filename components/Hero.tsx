import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ArrowRight, ChevronRight, Phone, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  const dealsProducts = useQuery(api.product.getDealsProducts);
  const hotProducts = useQuery(api.product.getHotProducts);

  if (!dealsProducts || !hotProducts) {
    return null;
  }
  const hotFirstImage = hotProducts?.[0]?.imageUrls?.[0] ?? "";
  const dealFirstImage = dealsProducts?.[0]?.imageUrls?.[0] ?? "";
  return (
    <section className="hidden md:inline-block bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Rwanda's #1 Electronics Marketplace
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Buy & Sell <span className="text-blue-600">Electronics</span> with
              Confidence
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Shop 14,000+ verified phones, laptops & accessories. Secure
              payments, fast delivery in Kigali.
            </p>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">14,861</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.8★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                Browse Products
                <ChevronRight className="w-5 h-5" />
              </button>
              <Link href='/sell' className="border-2 cursor-pointer border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 transition flex items-center justify-center gap-2">
                Sell Your Device
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative hidden lg:block">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                🔥 Hot Deals Today
              </div>
              <div className="grid grid-cols-2 gap-4">
                {hotProducts.length > 0 ? (
                  <div className="bg-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition">
                    <div className="w-full h-32 relative bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                      <Image
                        src={hotFirstImage}
                        alt={hotProducts[0].name}
                        className="w-16 h-16 object-cover "
                        fill
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {hotProducts[0].name}
                    </div>
                    <div className="text-xs text-gray-600 flex w-full justify-end">
                      From {hotProducts[0].price.toLocaleString()} RWF
                    </div>
                  </div>
                ) : null}

                {dealsProducts.length > 0 ? (
                  <div className="bg-white rounded-2xl p-6 shadow-xl transform hover:scale-105 transition mt-8">
                    <div className="w-full relative overflow-hidden h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <Image
                        src={dealFirstImage}
                        alt={dealsProducts[0].name}
                        className="w-16 h-16 object-cover "
                        fill
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {dealsProducts[0].name}
                    </div>
                    <div className="text-xs text-gray-600">
                      From {dealsProducts[0].price.toLocaleString()} RWF
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
