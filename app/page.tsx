// App.jsx
// import BrandsCarousel from "@/components/BrandsCarousel";
// import DealsOfTheDay from "@/components/DealsOfTheDay";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
// import NewsSection from "@/components/NewsSection";
// import ProductCategories from "@/components/ProductCategories";
// import TrendingTags from "@/components/TrendingTags";
import { getHeroSection } from "@/sanity/getData";
import React from "react";


export default async function App() {
  const heroSection = await getHeroSection();

  return (
    <div className="font-sans text-gray-900">
      <HeroSection heroSection={heroSection} />
      {/* <ProductCategories /> */}
      
      <section id="products" className="w-full h-full">
      <FeaturedProducts />
      </section>
      {/* <BestSellers /> */}
      {/* <DealsOfTheDay />
      <BrandsCarousel />
      <TrendingTags />
      <NewsSection /> */}
      <Footer />
    </div>
  );
}
