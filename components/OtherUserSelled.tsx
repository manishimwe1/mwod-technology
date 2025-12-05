import React from 'react';
import { Doc } from "@/convex/_generated/dataModel";
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

interface OtherUserSelledProps {
  products: (Doc<"products"> & { image: string })[] | null;
}

const OtherUserSelled: React.FC<OtherUserSelledProps> = ({ products }) => {
    if(!products || products.length === 0) return <EmptyState/>;
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">More from this Seller</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default OtherUserSelled;