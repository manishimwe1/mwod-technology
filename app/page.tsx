// import { client } from '@/sanity/lib/client'
import CategoryGrid from '@/components/CategoryGrid'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import TrendingProducts from '@/components/TrendingProducts'
// import { client } from '@/sanity/lib/client'

// async function getFeaturedProducts() {
//   return await client.fetch(`
//     *[_type == "product" && featured == true][0...8] {
//       _id,
//       name,
//       brand,
//       slug,
//       images,
//       currentPrice,
//       retailPrice,
//       lowestAsk,
//       highestBid,
//       category
//     }
//   `)
// }

// async function getTrendingProducts() {
//   return await client.fetch(`
//     *[_type == "product"] | order(salesCount desc)[0...12] {
//       _id,
//       name,
//       brand,
//       slug,
//       images,
//       currentPrice,
//       retailPrice,
//       lowestAsk,
//       highestBid,
//       salesCount,
//       category
//     }
//   `)
// }

export default async function Home() {
  // const [ trendingProducts] = await Promise.all([
  //   getFeaturedProducts(),
  //   getTrendingProducts()
  // ])

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      {/* <FeaturedProducts products={[]} /> */}
      <CategoryGrid/>
      <TrendingProducts  />
      <Footer />
    </main>
  )
}
