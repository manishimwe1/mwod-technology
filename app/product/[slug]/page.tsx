import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import BidAskSection from '@/components/BidAskSection'
import PriceChart from '@/components/PriceChart'
import ProductSpecs from '@/components/ProductSpecs'

async function getProduct(slug: string) {
  return await client.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      brand,
      model,
      category,
      condition,
      images,
      description,
      specifications,
      currentPrice,
      retailPrice,
      lowestAsk,
      highestBid,
      lastSale,
      salesCount
    }
  `, { slug })
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)
  
  if (!product) {
    notFound()
  }

  const priceChange = product.currentPrice - product.retailPrice
  const priceChangePercent = ((priceChange / product.retailPrice) * 100).toFixed(1)
  const isPositive = priceChange > 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            {product.images?.[0] && (
              <Image
                src={urlFor(product.images[0]).width(600).height(600).url()}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {product.images?.slice(1, 5).map((image: any, index: number) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={urlFor(image).width(150).height(150).url()}
                  alt={`${product.name} ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">{product.brand}</div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            {product.model && (
              <div className="text-lg text-gray-600 mt-1">{product.model}</div>
            )}
          </div>

          {/* Price Info */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Last Sale</div>
                <div className="text-2xl font-bold">${product.currentPrice?.toLocaleString()}</div>
                <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{priceChangePercent}% vs Retail
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Lowest Ask</span>
                  <span className="font-semibold">${product.lowestAsk?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Highest Bid</span>
                  <span className="font-semibold">${product.highestBid?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Sales</span>
                  <span className="font-semibold">{product.salesCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buy/Sell Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors">
              Buy ${product.lowestAsk?.toLocaleString()}
            </button>
            <button className="border-2 border-green-600 text-green-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors">
              Sell ${product.highestBid?.toLocaleString()}
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Sections */}
      <div className="mt-16 space-y-12">
        <PriceChart productId={product._id} />
        <BidAskSection productId={product._id} />
        <ProductSpecs specifications={product.specifications} />
      </div>
    </div>
  )
}
