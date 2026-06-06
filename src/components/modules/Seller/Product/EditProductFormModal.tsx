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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllCategories } from "@/services/category.services";
import { getAllAttributes } from "@/services/attribute.services";
import { createProductSchema } from "@/zod/product.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { IProduct } from "./productColumns";

// cartesian product helper
const cartesian = (...a: any[]): any[] => a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));

interface EditProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IProduct | null;
}

const getInitialValues = (product: IProduct | null) => {
  const p = product as any;
  return {
    name: p?.name || "",
    shortDescription: p?.shortDescription || "",
    description: p?.description || "",
    stock: p?.stock || 0,
    purchasePrice: p?.purchasePrice || 0,
    regularPrice: p?.regularPrice || 0,
    sellPrice: p?.sellPrice || 0,
    categoryId: p?.category?.id || "",
    tags: p?.tags ? p.tags.join(", ") : "",
    type: p?.type || "SIMPLE",
    vatType: p?.vatType || "INCLUDED",
    vatPercentage: p?.vatPercentage || 0,
    freeShipping: p?.freeShipping || false,
    isFeatured: p?.isFeatured || false,
  };
};

export default function EditProductFormModal({
  open,
  onOpenChange,
  product,
}: EditProductFormModalProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Category State
  const [parentCategoryId, setParentCategoryId] = useState<string>("");

  // Variant States
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [generatedVariants, setGeneratedVariants] = useState<any[]>([]);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: categoryResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });
  const allCategories = categoryResponse?.data || [];
  const parentCategories = allCategories.filter((c: any) => !c.parentId);
  const childCategories = parentCategoryId
    ? allCategories.filter((c: any) => c.parentId === parentCategoryId)
    : [];

  const { data: attrResponse } = useQuery({
    queryKey: ["attributes"],
    queryFn: () => getAllAttributes(),
  });
  const dbAttributes = attrResponse?.data || [];

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
      if (existingImages.length === 0 && images.length === 0) {
        toast.error("Please provide at least one product image.");
        return;
      }

      const formData = new FormData();

      const tagsArray = value.tags
        ? value.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
        : [];

      let payloadData: any = {
        ...value,
        tags: tagsArray,
        categoryId: value.categoryId || parentCategoryId,
        vatPercentage: Number(value.vatPercentage),
        existingImages,
      };

      if (value.type === "VARIABLE") {
        if (generatedVariants.length === 0) {
          toast.error("Please generate at least one variant.");
          return;
        }
        payloadData.stock = generatedVariants.reduce((sum, v) => sum + Number(v.quantity), 0);
        payloadData.purchasePrice = Number(generatedVariants[0].purchasePrice);
        payloadData.regularPrice = Number(generatedVariants[0].regularPrice);
        payloadData.sellPrice = Number(generatedVariants[0].sellPrice);

        payloadData.attributes = Object.entries(selectedAttributes).map(([name, values]) => ({
          name,
          values
        }));
        payloadData.variants = generatedVariants.map(v => ({
          combination: v.combination,
          quantity: Number(v.quantity),
          purchasePrice: Number(v.purchasePrice),
          regularPrice: Number(v.regularPrice),
          sellPrice: Number(v.sellPrice),
        }));
      } else {
        payloadData.stock = Number(value.stock);
        payloadData.purchasePrice = Number(value.purchasePrice);
        payloadData.regularPrice = Number(value.regularPrice);
        payloadData.sellPrice = Number(value.sellPrice);
      }

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
      const p = product as any;
      form.reset(getInitialValues(product));
      
      const pCatId = p.category?.parentId || p.category?.id || "";
      setParentCategoryId(pCatId);
      if (p.category?.parentId) {
        form.setFieldValue("categoryId", p.category.id);
      } else {
        form.setFieldValue("categoryId", "");
      }

      if (p.type === "VARIABLE" && p.attributes && p.variants) {
         const initialAttrs = p.attributes.reduce((acc: any, attr: any) => {
            acc[attr.name] = attr.values;
            return acc;
         }, {});
         setSelectedAttributes(initialAttrs);

         const initialVars = p.variants.map((v: any) => ({
            ...v,
            quantity: v.quantity || v.stock || 0
         }));
         setGeneratedVariants(initialVars);
      } else {
         setSelectedAttributes({});
         setGeneratedVariants([]);
      }

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
  
  const toggleAttributeValue = (attrName: string, value: string) => {
    setSelectedAttributes(prev => {
      const current = prev[attrName] || [];
      if (current.includes(value)) {
        const next = current.filter(v => v !== value);
        if (next.length === 0) {
          const copy = { ...prev };
          delete copy[attrName];
          return copy;
        }
        return { ...prev, [attrName]: next };
      } else {
        return { ...prev, [attrName]: [...current, value] };
      }
    });
  };

  const generateVariants = () => {
    const keys = Object.keys(selectedAttributes);
    if (keys.length === 0) {
      toast.error("Please select at least one attribute value to generate variations.");
      return;
    }

    const attrArrays = keys.map(k => selectedAttributes[k]);
    const combos = attrArrays.length === 1 ? attrArrays[0].map(v => [v]) : cartesian(...attrArrays);
    
    const newVariants = combos.map((combo: any) => {
      const comboName = Array.isArray(combo) ? combo.join('-') : combo;
      const existing = generatedVariants.find(v => v.combination === comboName);
      if (existing) return existing;
      
      return {
        combination: comboName,
        quantity: 0,
        purchasePrice: form.getFieldValue("purchasePrice") || 0,
        regularPrice: form.getFieldValue("regularPrice") || 0,
        sellPrice: form.getFieldValue("sellPrice") || 0,
      };
    });

    setGeneratedVariants(newVariants);
    toast.success(`Generated ${newVariants.length} variants!`);
  };

  const updateVariant = (index: number, key: string, value: any) => {
    const updated = [...generatedVariants];
    updated[index][key] = value;
    setGeneratedVariants(updated);
  };

  const applyBasePricesToAll = () => {
    const pPrice = form.getFieldValue("purchasePrice");
    const rPrice = form.getFieldValue("regularPrice");
    const sPrice = form.getFieldValue("sellPrice");

    if (generatedVariants.length === 0) return;

    setGeneratedVariants(prev => prev.map(v => ({
      ...v,
      purchasePrice: pPrice,
      regularPrice: rPrice,
      sellPrice: sPrice,
    })));
    toast.success("Applied base prices to all variations!");
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[95vh] w-[calc(100vw-1.5rem)] sm:max-w-6xl gap-0 overflow-hidden p-0"
        data-lenis-prevent
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
                <div className="md:col-span-2">
                  <form.Field name="name">
                    {(field) => (
                      <AppField field={field} label="Product Name *" placeholder="Enter product name" />
                    )}
                  </form.Field>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={parentCategoryId} onValueChange={setParentCategoryId}>
                    <SelectTrigger className="bg-background/50 focus-visible:ring-primary/20">
                      <SelectValue placeholder="Select Parent Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <form.Field name="categoryId">
                  {(field) => (
                    <div className="space-y-2">
                      <Label>Sub Category {childCategories.length > 0 ? "*" : "(Optional)"}</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        disabled={childCategories.length === 0}
                      >
                        <SelectTrigger className="bg-background/50 focus-visible:ring-primary/20">
                          <SelectValue placeholder={childCategories.length > 0 ? "Select Sub Category" : "No Sub Categories"} />
                        </SelectTrigger>
                        <SelectContent>
                          {childCategories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>

                <div className="md:col-span-2">
                  <form.Field name="shortDescription">
                    {(field) => (
                      <AppField field={field} label="Short Description *" placeholder="Brief summary of the product" />
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
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="md:col-span-2">
                  <form.Field name="tags">
                    {(field) => (
                      <AppField field={field} label="Tags (Optional)" placeholder="Comma separated tags e.g. electronics, laptop, new" />
                    )}
                  </form.Field>
                </div>

                {/* Product Data Section */}
                <div className="md:col-span-2 border rounded-md bg-card">
                  <form.Field name="type">
                    {(field) => (
                      <div className="border-b px-4 py-3 flex items-center gap-2 bg-muted/20">
                        <Label className="text-base font-semibold whitespace-nowrap">Product data —</Label>
                        <Select value={field.state.value} onValueChange={field.handleChange} disabled>
                          <SelectTrigger className="w-[180px] h-8 bg-background opacity-70">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SIMPLE">Simple product</SelectItem>
                            <SelectItem value="VARIABLE">Variable product</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground ml-2">(Cannot be changed)</p>
                      </div>
                    )}
                  </form.Field>

                  <div className="p-4 space-y-6">
                    {/* Pricing Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <form.Field name="purchasePrice">
                        {(field) => <AppField field={field} type="number" label="Purchase price (BDT)" placeholder="0.00" />}
                      </form.Field>
                      <form.Field name="regularPrice">
                        {(field) => <AppField field={field} type="number" label="Regular price (BDT)" placeholder="0.00" />}
                      </form.Field>
                      <form.Field name="sellPrice">
                        {(field) => <AppField field={field} type="number" label="Sale price (BDT)" placeholder="0.00" />}
                      </form.Field>
                    </div>

                    {/* Extras Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                      <div className="space-y-2">
                        <Label>Size Chart</Label>
                        <Select defaultValue="none">
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Select</SelectItem>
                            {/* Placeholder for size charts */}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 flex flex-col justify-end">
                        <Label>Vat (%)</Label>
                        <div className="flex">
                          <form.Field name="vatType">
                            {(field) => (
                              <Select value={field.state.value} onValueChange={field.handleChange}>
                                <SelectTrigger className="bg-background rounded-r-none w-28">
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="INCLUDED">Included</SelectItem>
                                  <SelectItem value="EXCLUDED">Excluded</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </form.Field>
                          <form.Field name="vatPercentage">
                            {(field) => (
                              <Input
                                type="number"
                                className="rounded-l-none border-l-0"
                                placeholder="0"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                              />
                            )}
                          </form.Field>
                        </div>
                      </div>

                      <form.Field name="freeShipping">
                        {(field) => (
                          <div className="space-y-2">
                            <Label>Free Shipping</Label>
                            <Select value={field.state.value ? "enabled" : "disabled"} onValueChange={(v) => field.handleChange(v === "enabled")}>
                              <SelectTrigger className="bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="disabled">Disabled</SelectItem>
                                <SelectItem value="enabled">Enabled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="isFeatured">
                        {(field) => (
                          <div className="space-y-2">
                            <Label>Featured</Label>
                            <Select value={field.state.value ? "enabled" : "disabled"} onValueChange={(v) => field.handleChange(v === "enabled")}>
                              <SelectTrigger className="bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="disabled">Disabled</SelectItem>
                                <SelectItem value="enabled">Enabled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </form.Field>
                    </div>

                    <form.Subscribe selector={(state) => state.values.type}>
                      {(type) => type === "SIMPLE" ? (
                        /* Simple Product - Quantity Only */
                        <div className="max-w-[200px]">
                          <form.Field name="stock">
                            {(field) => <AppField field={field} type="number" label="Quantity" placeholder="0" />}
                          </form.Field>
                        </div>
                      ) : (
                        /* Variable Product - Attributes & Variations */
                        <div className="mt-8 border rounded bg-background">
                          <div className="px-4 py-2 bg-muted/50 font-semibold border-b text-sm">
                            Attributes & Variations
                          </div>
                          
                          <div className="p-4 space-y-6">
                            <div className="space-y-4">
                              <Label className="text-muted-foreground text-sm">Select Attributes:</Label>
                              {dbAttributes.map((attr: any) => (
                                <div key={attr.id} className="grid grid-cols-[100px_1fr] items-start gap-4">
                                  <span className="text-sm font-semibold pt-1">{attr.name}</span>
                                  <div className="flex flex-wrap gap-2">
                                    {attr.values.map((val: any) => {
                                      const isSelected = selectedAttributes[attr.name]?.includes(val.value);
                                      return (
                                        <Badge
                                          key={val.id}
                                          variant={isSelected ? "default" : "outline"}
                                          className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white border-0 transition-colors"
                                          onClick={() => toggleAttributeValue(attr.name, val.value)}
                                        >
                                          {val.value}
                                          {isSelected && <X className="size-3 ml-1" />}
                                        </Badge>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="bg-[#17a2b8] text-white p-3 rounded-sm text-sm font-medium">
                              Preview: {
                                Object.values(selectedAttributes).length > 0 
                                  ? Object.values(selectedAttributes).reduce((acc: number, curr) => acc * curr.length, 1)
                                  : 0
                              } variations will be generated
                            </div>

                            <Button type="button" onClick={generateVariants} className="bg-emerald-500 hover:bg-emerald-600">
                              Generate Variations
                            </Button>
                          </div>

                          {generatedVariants.length > 0 && (
                            <div className="p-4 border-t space-y-4 bg-muted/10">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Manage Variations:</span>
                                <Button type="button" variant="secondary" size="sm" onClick={applyBasePricesToAll} className="text-xs bg-slate-600 text-white hover:bg-slate-700">
                                  Apply Base Prices to All
                                </Button>
                              </div>

                              <div className="border rounded-sm bg-background overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-muted/50 border-b">
                                    <tr>
                                      <th className="text-left p-2 font-medium">Variation</th>
                                      <th className="text-left p-2 font-medium w-24">Quantity</th>
                                      <th className="text-left p-2 font-medium w-32">Purchase Price</th>
                                      <th className="text-left p-2 font-medium w-32">Regular Price</th>
                                      <th className="text-left p-2 font-medium w-32">Sale Price</th>
                                      <th className="text-left p-2 font-medium">Image</th>
                                      <th className="text-left p-2 font-medium w-20">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    {generatedVariants.map((variant, index) => (
                                      <tr key={index} className="group hover:bg-muted/30">
                                        <td className="p-2 font-medium">{variant.combination}</td>
                                        <td className="p-2">
                                          <Input type="number" className="h-8" value={variant.quantity} onChange={(e) => updateVariant(index, 'quantity', e.target.value)} />
                                        </td>
                                        <td className="p-2">
                                          <Input type="number" className="h-8" value={variant.purchasePrice} onChange={(e) => updateVariant(index, 'purchasePrice', e.target.value)} />
                                        </td>
                                        <td className="p-2">
                                          <Input type="number" className="h-8" value={variant.regularPrice} onChange={(e) => updateVariant(index, 'regularPrice', e.target.value)} />
                                        </td>
                                        <td className="p-2">
                                          <Input type="number" className="h-8" value={variant.sellPrice} onChange={(e) => updateVariant(index, 'sellPrice', e.target.value)} />
                                        </td>
                                        <td className="p-2">
                                          <div className="flex items-center border rounded h-8 overflow-hidden bg-background">
                                            <label className="bg-muted px-2 py-1 h-full flex items-center border-r cursor-pointer text-xs font-medium hover:bg-muted/80 whitespace-nowrap">
                                              Choose File
                                              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) updateVariant(index, 'image', file);
                                              }} />
                                            </label>
                                            <span className="px-2 text-xs text-muted-foreground truncate w-24">
                                              {variant.image ? variant.image.name : "No file chosen"}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="p-2">
                                          <Button 
                                            type="button" 
                                            variant="destructive" 
                                            size="sm" 
                                            className="h-8 w-full bg-red-500 hover:bg-red-600"
                                            onClick={() => {
                                              const copy = [...generatedVariants];
                                              copy.splice(index, 1);
                                              setGeneratedVariants(copy);
                                            }}
                                          >
                                            Remove
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </form.Subscribe>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4 pt-4 border-t">
                  <div>
                    <Label className="text-base font-semibold">Product Images *</Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select multiple images at once. The first image will automatically act as the primary thumbnail.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {/* Existing Images */}
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
                        <Image src={url} alt={`Existing ${index + 1}`} fill className="object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-1 top-1 size-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                      <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group">
                        <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-1 top-1 size-6 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                      <label className="relative aspect-square rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 transition-all group">
                        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Select Images</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
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
                <AppSubmitButton isPending={isPending} pendingLabel="Saving..." className="w-auto">
                  Save Changes
                </AppSubmitButton>
              </DialogFooter>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
