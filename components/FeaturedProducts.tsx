import ProductCard from './ProductCard'

interface Product {
  _id: string
  name: string
  brand: string
  slug: { current: string }
  images: any[]
  currentPrice: number
  retailPrice: number
  lowestAsk: number
  highestBid: number
  category: string
}

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <a href="/products" className="text-green-600 hover:text-green-700 font-semibold">
            View All →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
