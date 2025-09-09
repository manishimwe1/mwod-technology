// store/productStore.ts
import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

type ProductStore = {
  products: Doc<'products'>[];
  setProducts: (products: Doc<'products'>[]) => void;
};

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));
