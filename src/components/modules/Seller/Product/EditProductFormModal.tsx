/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { updateProductAction } from "@/app/(dashboardLayout)/seller/dashboard/products/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllCategories } from "@/services/category.services";
import { createProductSchema } from "@/zod/product.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { IProduct } from "./productColumns";

interface EditProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IProduct | null;
}

const getInitialValues = (product: IProduct | null) => ({
  name: product?.name || "",
  shortDescription: product?.shortDescription || "",
  description: (product as any)?.description || "", // Using any because description might not be in the table columns type
  stock: product?.stock || 0,
  purchasePrice: product?.purchasePrice || 0,
  regularPrice: product?.regularPrice || 0,
  sellPrice: product?.sellPrice || 0,
  categoryId: product?.category?.id || "",
  tags: (product as any)?.tags
    ? ((product as any).tags as string[]).join(", ")
    : "",
});

const EditProductFormModal = ({
  open,
  onOpenChange,
  product,
}: EditProductFormModalProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // To track images that already exist

  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch categories
  const { data: categoryResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });
  const categories = categoryResponse?.data || [];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateProductAction(id, formData),
  });

  const form = useForm({
    defaultValues: getInitialValues(product),
    validators: {
      onChange: createProductSchema as any,
    },
    onSubmit: async ({ value }) => {
      if (!product) return;

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
        tags: tagsArray,
        existingImages, // pass the remaining existing images to backend
      };

      formData.append("data", JSON.stringify(payloadData));

      images.forEach((file) => {
        formData.append("images", file);
      });

      const result = await mutateAsync({ id: product.id, formData });

      if (!result.success) {
        toast.error(result.message || "Failed to update product");
        return;
      }

      toast.success(result.message || "Product updated successfully");
      onOpenChange(false);

      void queryClient.invalidateQueries({ queryKey: ["products"] });
      router.refresh();
    },
  });

  useEffect(() => {
    if (open && product) {
      form.reset(getInitialValues(product));
      const timeoutId = setTimeout(() => {
        setExistingImages(product.images || []);
        setPreviews([]);
        setImages([]);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [open, product, form]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const totalImages = existingImages.length + images.length + files.length;
      if (totalImages > 5) {
        toast.error("You can have a maximum of 5 images.");
        return;
      }

      setImages((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    },
    [existingImages, images],
  );

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return updated;
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[95vh] w-[calc(100vw-1.5rem)] max-w-4xl gap-0 overflow-hidden p-0"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader className="border-b px-6 py-5 pr-14">
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update your product details and images.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-5.5rem)]">
          <div className="px-6 py-5">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
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
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.state.meta.errors &&
                        field.state.meta.isTouched && (
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
                        {field.state.meta.errors &&
                          field.state.meta.isTouched && (
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
                      Product Images
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload up to 5 images. First image will be the thumbnail.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative aspect-square rounded-xl overflow-hidden border bg-muted"
                      >
                        <Image
                          src={url}
                          alt={`Existing ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-1 top-1 size-6 rounded-full shadow-lg"
                          onClick={() => removeExistingImage(index)}
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

                    {/* New Images */}
                    {previews.map((preview, index) => (
                      <div
                        key={`new-${index}`}
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
                          onClick={() => removeNewImage(index)}
                        >
                          <X className="size-3" />
                        </Button>
                        {existingImages.length === 0 && index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] py-0.5 px-2 text-center font-medium backdrop-blur-md">
                            Thumbnail
                          </div>
                        )}
                      </div>
                    ))}

                    {existingImages.length + images.length < 5 && (
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

              <DialogFooter className="border-t pt-5 mt-6">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isPending}>
                    Cancel
                  </Button>
                </DialogClose>
                <AppSubmitButton
                  isPending={isPending}
                  pendingLabel="Saving..."
                  className="w-auto"
                >
                  Save Changes
                </AppSubmitButton>
              </DialogFooter>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductFormModal;
