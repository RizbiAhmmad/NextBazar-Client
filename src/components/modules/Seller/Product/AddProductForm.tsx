/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { createProduct } from "@/services/product.services";
import { getAllCategories } from "@/services/category.services";
import { getMyShop } from "@/services/shop.services";
import { createProductSchema } from "@/zod/product.validation";
import AppField from "@/components/shared/form/AppField";

export default function AddProductForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Fetch shop details to get shopId
  const { data: myShop } = useQuery({
    queryKey: ["myShop"],
    queryFn: getMyShop,
  });

  // Fetch categories
  const { data: categoryResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });
  const categories = categoryResponse?.data || [];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createProduct,
  });

  const form = useForm({
    defaultValues: {
      name: "",
      shortDescription: "",
      description: "",
      stock: 0,
      purchasePrice: 0,
      regularPrice: 0,
      sellPrice: 0,
      categoryId: "",
      tags: "",
    },
    validators: {
      onChange: createProductSchema as any,
    },
    onSubmit: async ({ value }) => {
      if (!myShop?.id) {
        toast.error("Shop not found. You must have a shop to add products.");
        return;
      }

      if (images.length === 0) {
        toast.error("Please upload at least one product image.");
        return;
      }

      const formData = new FormData();

      const tagsArray = value.tags
        ? value.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const payloadData = {
        ...value,
        stock: Number(value.stock),
        purchasePrice: Number(value.purchasePrice),
        regularPrice: Number(value.regularPrice),
        sellPrice: Number(value.sellPrice),
        shopId: myShop.id,
        tags: tagsArray,
      };

      formData.append("data", JSON.stringify(payloadData));

      images.forEach((file) => {
        formData.append("images", file);
      });

      const result = await mutateAsync(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to create product");
        return;
      }

      toast.success("Product created successfully!");
      router.push("/seller/dashboard/products");
      router.refresh();
    },
  });

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      if (images.length + files.length > 5) {
        toast.error("You can upload a maximum of 5 images.");
        return;
      }

      setImages((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [images],
  );

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return updated;
    });
  };

  return (
    <Card className="max-w-4xl mx-auto border-none shadow-xl bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add New Product</CardTitle>
        <CardDescription>
          Fill in the details below to add a new product to your shop.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field name="name">
              {(field) => (
                <AppField
                  field={field}
                  label="Product Name *"
                  placeholder="Enter product name"
                />
              )}
            </form.Field>

            <form.Field name="categoryId">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Category *</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger className="bg-background/50 focus-visible:ring-primary/20">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors && field.state.meta.isTouched && (
                    <p className="text-sm text-destructive mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="md:col-span-2">
              <form.Field name="shortDescription">
                {(field) => (
                  <AppField
                    field={field}
                    label="Short Description *"
                    placeholder="Brief summary of the product"
                  />
                )}
              </form.Field>
            </div>

            <div className="md:col-span-2 space-y-2">
              <form.Field name="description">
                {(field) => (
                  <>
                    <Label htmlFor={field.name}>Full Description *</Label>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Detailed description of your product..."
                      className="min-h-[120px] bg-background/50 focus-visible:ring-primary/20"
                    />
                    {field.state.meta.errors && field.state.meta.isTouched && (
                      <p className="text-sm text-destructive mt-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </>
                )}
              </form.Field>
            </div>

            <form.Field name="purchasePrice">
              {(field) => (
                <AppField
                  field={field}
                  type="number"
                  label="Purchase Price *"
                  placeholder="0.00"
                />
              )}
            </form.Field>
            <form.Field name="regularPrice">
              {(field) => (
                <AppField
                  field={field}
                  type="number"
                  label="Regular Price *"
                  placeholder="0.00"
                />
              )}
            </form.Field>
            <form.Field name="sellPrice">
              {(field) => (
                <AppField
                  field={field}
                  type="number"
                  label="Sell Price (Discounted) *"
                  placeholder="0.00"
                />
              )}
            </form.Field>
            <form.Field name="stock">
              {(field) => (
                <AppField
                  field={field}
                  type="number"
                  label="Stock Quantity *"
                  placeholder="0"
                />
              )}
            </form.Field>

            <div className="md:col-span-2">
              <form.Field name="tags">
                {(field) => (
                  <AppField
                    field={field}
                    label="Tags (Optional)"
                    placeholder="Comma separated tags e.g. electronics, laptop, new"
                  />
                )}
              </form.Field>
            </div>

            <div className="md:col-span-2 space-y-4 pt-4 border-t">
              <div>
                <Label className="text-base font-semibold">
                  Product Images *
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload up to 5 images. First image will be the thumbnail.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border bg-muted"
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-1 top-1 size-6 rounded-full shadow-lg"
                      onClick={() => removeImage(index)}
                    >
                      <X className="size-3" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] py-0.5 px-2 text-center font-medium backdrop-blur-md">
                        Thumbnail
                      </div>
                    )}
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors group">
                    <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isPending || isSubmitting}
                  className="min-w-[120px]"
                >
                  {isPending || isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
