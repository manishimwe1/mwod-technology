"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/lib/store";
import { Doc } from "@/convex/_generated/dataModel";

const ProductPageContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { products: fetchedProducts, setProducts } = useProductStore();
  const productsInDB = useQuery(api.product.getProductsWithImage);

  useEffect(() => {
    if (productsInDB) setProducts(productsInDB as Doc<"products">[]);
  }, [productsInDB, setProducts]);

  console.log({ fetchedProducts });

  if (!fetchedProducts) {
    return (
      <div className="flex items-center justify-center flex-col h-screen w-full">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <span className="mt-2 text-lg text-gray-600">Loading Products...</span>
      </div>
    );
  }

  // Filter products by category if a category is present in the URL
  const filteredProducts = category
    ? fetchedProducts.filter(
        (product) => product.category.toLowerCase().includes(category.toLowerCase())
      )
    : fetchedProducts;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar for Filters */}
        <aside className="w-full lg:w-1/4 p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
            Filters
          </h2>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="available-now" className="text-lg font-medium">
                Available Now
              </Label>
              <Switch id="available-now" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="xpress-ship" className="text-lg font-medium">
                Xpress Ship
              </Label>
              <Switch id="xpress-ship" />
            </div>
          </div>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="category">
              <AccordionTrigger className="text-lg font-medium">
                Category
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Electronics
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Apparel
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Home Goods
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="gender">
              <AccordionTrigger className="text-lg font-medium">
                Gender
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Men
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Women
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Unisex
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="product-line">
              <AccordionTrigger className="text-lg font-medium">
                Product Line
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Line A
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Line B
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="model">
              <AccordionTrigger className="text-lg font-medium">
                Model
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Model X
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Model Y
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="activity">
              <AccordionTrigger className="text-lg font-medium">
                Activity
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Running
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Training
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="color">
              <AccordionTrigger className="text-lg font-medium">
                Color
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Red
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      Blue
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price">
              <AccordionTrigger className="text-lg font-medium">
                Price
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-gray-600">
                  Price range slider coming soon...
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        {/* Main Content for Product Cards */}
        <main className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {category ? `Products in ${category}` : "All Products"}
            </h1>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort-by" className="text-lg font-medium">
                Sort By:
              </Label>
              <select
                id="sort-by"
                className="p-2 border rounded-md bg-white dark:bg-gray-700 dark:text-white"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner dark:bg-gray-700">
              <p className="text-xl text-gray-500 dark:text-gray-300">
                No products found!
              </p>
              <p className="text-md text-gray-400 mt-2 dark:text-gray-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const ProductPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center flex-col h-screen w-full">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
          <span className="mt-2 text-lg text-gray-600">Loading Products...</span>
        </div>
      }
    >
      <ProductPageContent />
    </Suspense>
  );
};

export default ProductPage;