"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ScrollArea } from "./ui/scroll-area";
import { useDropzone } from "react-dropzone";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  price: z.coerce
    .number()
    .min(0.01, { message: "Price must be a positive number." }),
  brand: z.string().min(1, { message: "Brand is required." }),
  stock: z.coerce.number().min(1, { message: "Stock must be at least 1." }),
  serialNumber: z.string().min(1, { message: "Serial number is required." }),
  condition: z.enum(["Like New", "New", "Good", "Used"], {
    message: "Please select a condition.",
  }),
  badge: z.enum(["NEW", "HOT", "SALE", "Deals"], {
    message: "Please select a badge.",
  }),
  imageUrls: z.array(z.string()).optional(),
});

const SellForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 0,
      brand: "",
      stock: 1,
      serialNumber: "",
      condition: "New",
      badge: "NEW",
      imageUrls: [],
    },
  });

  // Image handling
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles((prev) => [...prev, ...acceptedFiles]);

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string;
          setImagePreviews((prev) => [...prev, preview]);
        };
        reader.readAsDataURL(file);
      });

      // Update form with file names for validation
      const currentFiles = form.getValues("imageUrls") || [];
      const newFileNames = acceptedFiles.map((file) => file.name);
      form.setValue("imageUrls", [...currentFiles, ...newFileNames]);
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"],
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImageNames = newFiles.map((file) => file.name);

    setUploadedFiles(newFiles);
    setImagePreviews(newPreviews);
    form.setValue("imageUrls", newImageNames);
  };

  const createProduct = useMutation(api.selledProduct.createProduct);
  const generateUploadUrl = useMutation(api.selledProduct.generateUploadUrl);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (uploadedFiles.length === 0) {
        toast.error("Please upload at least one product image", {
          richColors: true,
        });
        return;
      }

      const imageUrls: Id<"_storage">[] = [];

      for (const file of uploadedFiles) {
        try {
          const uploadUrl = await generateUploadUrl();

          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!result.ok) {
            console.error("Image upload failed:", await result.text());
            continue;
          }

          const { storageId } = await result.json();
          imageUrls.push(storageId);
        } catch (err) {
          console.error("Image upload failed for file:", file.name, err);
        }
      }

      if (imageUrls.length === 0) {
        toast.error("Failed to upload images", { richColors: true });
        return;
      }
      // 3. Save the storageId to the Convex database
      await createProduct({
        name: values.name,
        description: values.description,
        category: values.category,
        price: values.price,
        brand: values.brand,
        stock: values.stock,
        serialNumber: values.serialNumber,
        condition: values.condition,
        badge: values.badge,
        images: imageUrls,
        status: "draft",
        updatedAt: new Date().toISOString(),
        
      });
      form.reset();
      setUploadedFiles([]);
      setImagePreviews([]);
      toast.success("Product submitted successfully!",{richColors:true});
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to submit product. Please try again.",{richColors:true});
    }
  };
  return (
    <ScrollArea className="h-[80vh] w-full max-w-4xl mx-auto p-6">
      {/* <h1 className="text-4xl text-center font-extrabold mb-8 text-gray-900 dark:text-white">
        Sell Your Electronic Device
      </h1> */}
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Start by filling out the details of your device below.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., iPhone 13 Pro Max" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your product in detail..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between gap-4 flex-col w-full md:flex-row">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="smartphones">Smartphones</SelectItem>
                      <SelectItem value="laptops">Laptops</SelectItem>
                      <SelectItem value="tablets">Tablets</SelectItem>
                      <SelectItem value="wearables">Wearables</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Apple, Samsung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-col w-full md:flex-row">
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SN123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Condition</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Like New">Like New</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Used">Used</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-col w-full md:flex-row">
            <FormField
              control={form.control}
              name="badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select badge" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NEW">NEW</SelectItem>
                      <SelectItem value="HOT">HOT</SelectItem>
                      <SelectItem value="SALE">SALE</SelectItem>
                      <SelectItem value="Deals">Deals</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Price (RWF)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 500000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div className="space-y-3">
            <FormLabel>Product Images *</FormLabel>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 text-center cursor-pointer rounded-lg transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the images here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop product images here, or click to select files
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 5MB each
                  </p>
                </div>
              )}
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                      {uploadedFiles[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {form.formState.errors.imageUrls && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.imageUrls.message}
              </p>
            )}
          </div>
          <Button type="submit">Submit Device for Sale</Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default SellForm;
