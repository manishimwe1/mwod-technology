"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

// Item schema
const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
});

// Main form schema
const formSchema = z.object({
  clientName: z.string().min(2, "Client name is required"),
  clientPhone: z.string().optional().or(z.literal("")),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  status: z.enum(["draft", "sent", "paid"]).default("draft"),
  notes: z.string().optional(),
});

export function ProformaInvoiceForm() {
  const [isSaving, setIsSaving] = useState(false);

  const createInvoice = useMutation(api.invoice.createInvoice);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur", // triggers validation on blur
    defaultValues: {
      clientName: "",
      clientPhone: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      status: "draft",
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  const calculateItemTotal = (quantity: number, unitPrice: number) =>
    quantity * unitPrice;

  const calculateGrandTotal = () =>
    watchedItems.reduce(
      (total, item) =>
        total + calculateItemTotal(item.quantity || 0, item.unitPrice || 0),
      0
    );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      const invoiceData = {
        ...values,
        totalAmount: calculateGrandTotal(),
        updatedAt: Date.now(),
      };
      // Call Convex mutation
      await createInvoice(invoiceData);
      toast.success("Proforma invoice saved successfully!");
      form.reset(); // optional: reset form after save
    } catch (error) {
      console.error(error);
      toast.error("Error saving proforma invoice.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollArea className="h-[80vh] w-full max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ben Investment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="078..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Items */}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="HP Motherboard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          {...field}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-4 flex justify-between items-center">
                  <div className="font-medium">
                    Total: Rwf{" "}
                    {calculateItemTotal(
                      watchedItems[index]?.quantity || 0,
                      watchedItems[index]?.unitPrice || 0
                    ).toLocaleString()}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ description: "", quantity: 1, unitPrice: 0 })
              }
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>

          {/* Grand Total */}
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-md">
            <div>Total Items: {watchedItems.length}</div>
            <div className="text-xl font-bold">
              Total Amount: Rwf {calculateGrandTotal().toLocaleString()}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSaving}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Proforma Invoice
              </>
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
