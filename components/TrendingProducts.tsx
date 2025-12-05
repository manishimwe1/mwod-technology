"use client";

import { useQuery } from "convex/react";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import { api } from "@/convex/_generated/api";
import Loading from "./Loading";
import { useProductStore } from "@/lib/store";
import { useEffect } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { ChevronRightIcon, FlameIcon } from "lucide-react";

const TrendingProducts = () => {
  const productsInDB = useQuery(api.product.getProductsWithImage);

  const { setProducts, products } = useProductStore();

  useEffect(() => {
    if (products.length === 0 && productsInDB) setProducts(productsInDB as Doc<"products">[]);
  }, [productsInDB, setProducts]);

  if (!productsInDB) {
    return <Loading title="Please wait, we are loading the products" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            <FlameIcon className="w-8 h-8 inline text-orange-500 mr-2" />
            Trending This Week
          </h2>
          <p className="text-gray-600">Hot deals everyone's talking about</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
          View All
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 space-x-4 space-y-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default TrendingProducts;
