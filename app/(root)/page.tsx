'use client'

import CategoryGrid from "@/components/CategoryGrid";
import Footer from "@/components/Footer";
import TrendingProducts from "@/components/TrendingProducts";

export default function Home() {

  //TODO:Implement this 


  // let visitorId = localStorage.getItem("visitorId");
  // if (!visitorId) {
  //   visitorId = uuidv4();
  //   localStorage.setItem("visitorId", visitorId);
  // }
  // console.log(visitorId);
  // return visitorId;

  return (
    <main className="min-h-screen bg-white">
      {/* <span>Logged in as {user?.fullName}</span>; */}
      {/* <Hero /> */}
      {/* <FeaturedProducts products={[]} /> */}
      <CategoryGrid />
      <TrendingProducts />
    </main>
  );
}
