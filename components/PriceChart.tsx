'use client'

export default function PriceChart({ productId }: { productId: string }) {
  // Mock price data - in real app, fetch from API
  const priceData = [
    { date: '2024-01', price: 1200 },
    { date: '2024-02', price: 1180 },
    { date: '2024-03', price: 1220 },
    { date: '2024-04', price: 1250 },
    { date: '2024-05', price: 1230 },
    { date: '2024-06', price: 1280 }
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6">Price History</h3>
      
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">📈</div>
          <div>Price chart would go here</div>
          <div className="text-sm mt-1">Integration with charting library needed</div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center space-x-4 text-sm">
        <button className="px-3 py-1 bg-green-600 text-white rounded">1M</button>
        <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">3M</button>
        <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">6M</button>
        <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">1Y</button>
        <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">ALL</button>
      </div>
    </div>
  )
}
