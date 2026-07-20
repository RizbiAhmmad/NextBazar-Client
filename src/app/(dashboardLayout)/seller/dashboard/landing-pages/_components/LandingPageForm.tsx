"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Save,
  Upload,
  X,
  Rocket,
  Images,
  Video,
  FileText,
  Star,
  ShoppingBag,
} from "lucide-react";
import { getAllProducts } from "@/services/product.services";
import { getMyShop } from "@/services/shop.services";
import {
  createLandingPage,
  updateLandingPage,
} from "@/services/landingPage.services";
import { ILandingPage, LandingPageFormValues } from "@/types/landingPage.types";

const getInitialValues = (landingPage?: ILandingPage | null): LandingPageFormValues => ({
  productId: landingPage?.productId || "",
  campaignTitle: landingPage?.campaignTitle || "",
  campaignShortDescription: landingPage?.campaignShortDescription || "",
  galleryHeading: landingPage?.galleryHeading || "",
  galleryDescription: landingPage?.galleryDescription || "",
  aboutHeading: landingPage?.aboutHeading || "",
  aboutDescription: landingPage?.aboutDescription || "",
  videoUrl: landingPage?.videoUrl || "",
  descriptionTitle: landingPage?.descriptionTitle || "",
  description: landingPage?.description || "",
  reviewHeading: landingPage?.reviewHeading || "",
  orderFormHeading: landingPage?.orderFormHeading || "Order Now",
  orderButtonText: landingPage?.orderButtonText || "অর্ডার করুন",
  isActive: landingPage?.isActive ?? true,
});

interface LandingPageFormProps {
  mode: "create" | "edit";
  landingPage?: ILandingPage | null;
}

export default function LandingPageForm({ mode, landingPage }: LandingPageFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<LandingPageFormValues>(
    getInitialValues(landingPage),
  );
  const [isSaving, setIsSaving] = useState(false);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    landingPage?.bannerImage || null,
  );

  const [galleryExisting, setGalleryExisting] = useState<string[]>(
    landingPage?.galleryImages || [],
  );
  const [galleryNewFiles, setGalleryNewFiles] = useState<File[]>([]);

  const [reviewExisting, setReviewExisting] = useState<string[]>(
    landingPage?.reviewImages || [],
  );
  const [reviewNewFiles, setReviewNewFiles] = useState<File[]>([]);

  const { data: myShop } = useQuery({ queryKey: ["myShop"], queryFn: getMyShop });

  const { data: productResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["myShopProducts", myShop?.id],
    queryFn: () => getAllProducts({ shopId: myShop.id, limit: "200" }),
    enabled: !!myShop?.id,
  });
  const products = productResponse?.data ?? [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setGalleryNewFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleReviewAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setReviewNewFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!values.productId) {
      toast.error("Please select a product");
      return;
    }
    if (!bannerFile && !bannerPreview) {
      toast.error("Please upload a banner image");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      const data = {
        ...values,
        galleryImages: galleryExisting,
        reviewImages: reviewExisting,
      };
      formData.append("data", JSON.stringify(data));
      if (bannerFile) formData.append("bannerImage", bannerFile);
      galleryNewFiles.forEach((file) => formData.append("galleryImages", file));
      reviewNewFiles.forEach((file) => formData.append("reviewImages", file));

      const result =
        mode === "create"
          ? await createLandingPage(formData)
          : await updateLandingPage(landingPage!.id, formData);

      if (!result.success) {
        toast.error(result.message || "Failed to save landing page");
        return;
      }

      toast.success(
        mode === "create"
          ? "Landing page created successfully"
          : "Landing page updated successfully",
      );
      router.push("/seller/dashboard/landing-pages");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      {/* Product + Campaign */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Campaign</h4>
        </div>

        <div className="space-y-2">
          <Label>Product</Label>
          <Select
            value={values.productId}
            onValueChange={(val) => setValues((prev) => ({ ...prev, productId: val }))}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue
                placeholder={
                  isLoadingProducts ? "Loading products..." : "Select a product"
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {products.map((product: any) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
              {!isLoadingProducts && products.length === 0 && (
                <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                  No products found. Add a product first.
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="campaignTitle">Campaign Title</Label>
            <Input
              id="campaignTitle"
              name="campaignTitle"
              value={values.campaignTitle}
              onChange={handleChange}
              placeholder="Limited Time Offer!"
              className="h-12 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={values.isActive ? "true" : "false"}
              onValueChange={(val) =>
                setValues((prev) => ({ ...prev, isActive: val === "true" }))
              }
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active (publicly visible)</SelectItem>
                <SelectItem value="false">Inactive (hidden)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaignShortDescription">Short Description</Label>
          <Textarea
            id="campaignShortDescription"
            name="campaignShortDescription"
            value={values.campaignShortDescription}
            onChange={handleChange}
            placeholder="A short hook shown right under the campaign title"
            rows={2}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Banner Image</Label>
          <div className="flex items-center gap-4">
            <div className="relative h-28 w-full max-w-sm overflow-hidden rounded-xl border bg-muted">
              {bannerPreview ? (
                bannerFile ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={bannerPreview}
                    alt="Banner"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <Image
                    src={bannerPreview}
                    alt="Banner"
                    fill
                    className="object-cover"
                  />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ShoppingBag className="size-8 opacity-40" />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="size-6 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleBannerChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Images className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Gallery (Optional)</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="galleryHeading">Gallery Heading</Label>
            <Input
              id="galleryHeading"
              name="galleryHeading"
              value={values.galleryHeading}
              onChange={handleChange}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="galleryDescription">Gallery Description</Label>
            <Input
              id="galleryDescription"
              name="galleryDescription"
              value={values.galleryDescription}
              onChange={handleChange}
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        <ImageBucket
          existing={galleryExisting}
          newFiles={galleryNewFiles}
          onRemoveExisting={(url) =>
            setGalleryExisting((prev) => prev.filter((u) => u !== url))
          }
          onRemoveNew={(idx) =>
            setGalleryNewFiles((prev) => prev.filter((_, i) => i !== idx))
          }
          onAdd={handleGalleryAdd}
          inputId="gallery-images"
        />
      </div>

      {/* About + Video */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">About & Video (Optional)</h4>
        </div>
        <div className="space-y-2">
          <Label htmlFor="aboutHeading">About Heading</Label>
          <Input
            id="aboutHeading"
            name="aboutHeading"
            value={values.aboutHeading}
            onChange={handleChange}
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="aboutDescription">About Description</Label>
          <Textarea
            id="aboutDescription"
            name="aboutDescription"
            value={values.aboutDescription}
            onChange={handleChange}
            rows={3}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Video URL (YouTube or Facebook)</Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            value={values.videoUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Long description */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Description Block (Optional)</h4>
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionTitle">Description Title</Label>
          <Input
            id="descriptionTitle"
            name="descriptionTitle"
            value={values.descriptionTitle}
            onChange={handleChange}
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={4}
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Customer Reviews (Optional)</h4>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewHeading">Review Section Heading</Label>
          <Input
            id="reviewHeading"
            name="reviewHeading"
            value={values.reviewHeading}
            onChange={handleChange}
            className="h-12 rounded-xl"
          />
        </div>

        <ImageBucket
          existing={reviewExisting}
          newFiles={reviewNewFiles}
          onRemoveExisting={(url) =>
            setReviewExisting((prev) => prev.filter((u) => u !== url))
          }
          onRemoveNew={(idx) =>
            setReviewNewFiles((prev) => prev.filter((_, i) => i !== idx))
          }
          onAdd={handleReviewAdd}
          inputId="review-images"
        />
      </div>

      {/* Order form */}
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <h4 className="font-semibold">Order Form</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="orderFormHeading">Order Form Heading</Label>
            <Input
              id="orderFormHeading"
              name="orderFormHeading"
              value={values.orderFormHeading}
              onChange={handleChange}
              className="h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderButtonText">Order Button Text</Label>
            <Input
              id="orderButtonText"
              name="orderButtonText"
              value={values.orderButtonText}
              onChange={handleChange}
              className="h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSaving}
          className="h-12 px-8 rounded-full font-bold"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === "create" ? "Create Landing Page" : "Save Changes"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 px-8 rounded-full font-bold"
          onClick={() => router.push("/seller/dashboard/landing-pages")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function ImageBucket({
  existing,
  newFiles,
  onRemoveExisting,
  onRemoveNew,
  onAdd,
  inputId,
}: {
  existing: string[];
  newFiles: File[];
  onRemoveExisting: (url: string) => void;
  onRemoveNew: (index: number) => void;
  onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputId: string;
}) {
  return (
    <div className="space-y-3">
      <label
        htmlFor={inputId}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl shadow cursor-pointer hover:opacity-90 transition w-fit"
      >
        <Upload className="size-4" /> Add Images
      </label>
      <input
        id={inputId}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={onAdd}
      />

      {(existing.length > 0 || newFiles.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {existing.map((url) => (
            <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => onRemoveExisting(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          {newFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemoveNew(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
