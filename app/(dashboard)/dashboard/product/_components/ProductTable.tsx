import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import Image from "next/image";
import React from "react";
import ProductAction from "./ProductAction";


interface ProductTableProps {
  products: Doc<"products">[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  console.log(products);
  return (
    <Table>
      <TableCaption>A list of your products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products?.map((product) => (
          <TableRow key={product._id}>
            <TableCell>
              
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <Image
                  src={product.imageUrls[0]}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
              ) : (
                <div className="w-[60px] h-[60px] bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
                  No Image
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium text-ellipsis whitespace-nowrap overflow-hidden max-w-[200px]">
              {product.name}
            </TableCell>
            <TableCell className="text-ellipsis whitespace-nowrap overflow-hidden max-w-[200px]">
              {product.category}
            </TableCell>
            <TableCell>${product.price.toFixed(2)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <Badge
                variant={product.status === "active" ? "default" : "secondary"}
              >
                {product.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              
                <ProductAction product={product} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
