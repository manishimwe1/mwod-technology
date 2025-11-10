// 'use client'

// import CategoryGrid from "@/components/CategoryGrid";
// import TrendingProducts from "@/components/TrendingProducts";

// export default function Home() {

//   return (
//     <main className="min-h-screen bg-white">
//       {/* <Hero /> */}
//       {/* <FeaturedProducts products={[]} /> */}
//       <CategoryGrid />
//       <TrendingProducts />
//     </main>
//   );
// }

'use client'

import HeroSection from '@/components/Hero';
import SocialProof from '@/components/SocialProof';
import TrendingProducts from '@/components/TrendingProducts';
import TrustBadges from '@/components/TrustBadges';
import { Button } from '@/components/ui/button';
import { Lock, MessageCircle, Phone, RotateCcw, ShieldCheck, Sparkles, Truck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function EnhancedHomePage() {
  
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [email, setEmail] = useState('');

  // Scroll detection for sticky header
 

  // Exit intent detection
  useEffect(() => {
    let hasShownPopup = false;
    const handleMouseLeave = (e) => {
      if (e.clientY < 10 && !hasShownPopup) {
        hasShownPopup = true;
        setShowExitIntent(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    alert(`Welcome discount sent to ${email}!`);
    setShowExitIntent(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO - Hidden H1 */}
      <h1 className="sr-only">ElectroX - Buy and Sell Electronics in Rwanda - Phones, Laptops & More</h1>
      {/* Hero Section */}
      <HeroSection/>

      {/* Trust Badges */}
      <div className='hidden md:block'>
        <TrustBadges/>
      </div>


      {/* Trending Products */}
      <section className="py-8 lg:py-20 px-4 bg-gray-50">
        <TrendingProducts/>
        <div className="max-w-7xl mx-auto">
          
        </div>
      </section>

      <SocialProof/>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Buy or Sell?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers on Rwanda's most trusted electronics marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-500 text-white px-4 py-6 shadow rounded-lg font-bold text-lg hover:bg-blue-700 cursor-pointer transition shadow-xl">
              Start Shopping Now
            </Button>
            <Button variant={'secondary'} className="text-blue-500 px-4 py-5.5 rounded-lg font-bold text-lg hover:bg-blue-100 cursor-pointer transition border-2 border-blue-500">
              List Your Product
            </Button>
          </div>
        </div>
      </section>

       <div className='inline-block md:hidden w-full justify-center items-center'>
        <TrustBadges/>
      </div>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Wait! Get 10% Off Your First Purchase
              </h3>
              <p className="text-gray-600">
                Subscribe to our newsletter and receive an exclusive discount code
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get My 10% Discount Code
              </button>
              <p className="text-xs text-gray-500 text-center">
                No spam, unsubscribe anytime. Terms apply.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Contact Buttons */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-2 z-40 shadow-lg">
        <a
          href="tel:+250788123456"
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4" />
          Call Us
        </a>
        <a
          href="https://wa.me/250788123456"
          className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}