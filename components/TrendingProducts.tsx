import ProductCard from "./ProductCard";
import { Button } from "./ui/button";

// Product Grid Component
const ProductGrid = () => {
  const products = [
    {
      id: 1,
      image: "/laptop.jpg",
      title: "SAMSUNG 990 EVO Plus 1TB m.2 2280 PCIe Internal Solid State Drive MZ-V9ST0B/AM",
      price: 250000,
      originalPrice: 300000,
      rating: 4.5,
      reviewCount: 4,
      isNew: false,
    },
    {
      id: 2,
      image: "/laptop2.jpg",
      title: "Apple AirPods Pro (2nd Generation) with MagSafe Charging Case",
      price: 200000,
      rating: 4.5,
      reviewCount: 8,
      isNew: true
    },
    {
      id: 3,
      image: "/ssd.webp",
      title: "SAMSUNG 990 EVO Plus 1TB m.2 2280 PCIe Internal Solid State Drive MZ-V9S1T0B/AM",
      price: 50000,
      originalPrice: 60000,
      rating: 4,
      reviewCount: 34,
      isNew: false,
    },
    {
      id: 4,
      image: "/computer/window11.png",
      title: "Microsoft Windows 11 Pro 64-Bit USB Flash Drive (HAV-00162)",
      price: 10000,
      rating: 4.5,
      reviewCount: 44,
      isNew: false
    },
    {
      id: 5,
      image: "/computer/keyboard.png",
      title: "Logitech MX Keys Advanced Wireless Illuminated Keyboard",
      price: 20000,
      originalPrice: 25000,
      rating: 4.5,
      reviewCount: 320,
      isNew: true
    },
    {
      id: 6,
      image: "/computer/laptop1.png",
      title: "Microsoft Windows 10 Professional Printable Version for Windows (FQC-08929)",
      price: 180000,
      rating: 4.5,
      reviewCount: 320,
      isNew: false
    },
    {
      id: 8,
      image: "/computer/extender.png",
      title: "TP-Link AC750 WiFi Range Extender (RE220) - Dual Band WiFi Repeater",
      price: 180000,
      rating: 4.5,
      reviewCount: 320,
      isNew: false
    },
    {
      id: 7,
      image: "/computer/foldLaptops.jpg",
      title: "Microsoft Windows 10 Professional Printable Version for Windows (FQC-08929)",
      price: 200000,
      originalPrice: 250000,
      rating: 9,
      reviewCount: 320,
      isNew: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Trending Products</h2>
        <Button variant={'link'} className="text-green-600 hover:text-green-700 font-semibold">View All</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;