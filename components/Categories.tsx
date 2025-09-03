import { Smartphone, Laptop, Gamepad2, Headphones, Watch, Cable } from 'lucide-react'

const categories = [
  { name: 'Smartphones', icon: Smartphone, href: '/category/smartphones' },
  { name: 'Laptops', icon: Laptop, href: '/category/laptops' },
  { name: 'Gaming', icon: Gamepad2, href: '/category/gaming' },
  { name: 'Audio', icon: Headphones, href: '/category/audio' },
  { name: 'Wearables', icon: Watch, href: '/category/wearables' },
  { name: 'Accessories', icon: Cable, href: '/category/accessories' }
]

export default function Categories() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <a
                key={category.name}
                href={category.href}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-gray-600 group-hover:text-green-600 transition-colors" />
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
