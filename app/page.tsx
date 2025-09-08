'use client'

import CategoryGrid from '@/components/CategoryGrid'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import TrendingProducts from '@/components/TrendingProducts'
import { useUser } from '@clerk/nextjs';


export default function Home() {
 const { user } = useUser();
  return (
    <main className="min-h-screen bg-white">
      <span>Logged in as {user?.fullName}</span>;
      <Hero />
      {/* <FeaturedProducts products={[]} /> */}
      <CategoryGrid/>
      <TrendingProducts  />
      <Footer />
    </main>
  )
}
