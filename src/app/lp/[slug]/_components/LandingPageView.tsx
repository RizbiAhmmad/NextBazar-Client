"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  ShoppingBag,
  Loader2,
  Minus,
  Plus,
  Package,
} from "lucide-react";
import { ILandingPage } from "@/types/landingPage.types";
import { ISiteSetting } from "@/types/siteSetting.types";
import { placeLandingPageOrder } from "@/services/landingPage.services";
import { getShippingSettings } from "@/services/shippingSetting.services";
import { DHAKA_DISTRICTS, BANGLADESH_DISTRICTS } from "@/lib/districts";
import ImageSlider from "./ImageSlider";
import PriceHighlight from "./PriceHighlight";

const proseClass =
  "[&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>strong]:font-bold [&>a]:text-primary [&>a]:underline [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>blockquote]:border-l-2 [&>blockquote]:pl-3 [&>blockquote]:italic";

interface LandingPageViewProps {
  landingPage: ILandingPage;
  siteSettings: ISiteSetting | null;
}

const getEmbedUrl = (url?: string | null) => {
  if (!url) return "";

  if (url.includes("youtube.com/shorts/")) {
    const id = url.split("youtube.com/shorts/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("youtube.com/watch")) {
    try {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    } catch {
      return url;
    }
  }
  if (url.includes("facebook.com")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
  }
  return url;
};

export default function LandingPageView({ landingPage, siteSettings }: LandingPageViewProps) {
  const product = landingPage.product as any;

  const siteName = siteSettings?.siteName || "NextBazar";
  const logo = siteSettings?.logo;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [currentVariant, setCurrentVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingRates, setShippingRates] = useState({ inside: 70, outside: 130 });

  useEffect(() => {
    getShippingSettings()
      .then((res) => {
        if (res.data) {
          setShippingRates({
            inside: res.data.insideDhakaShippingFee,
            outside: res.data.outsideDhakaShippingFee,
          });
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (product?.type !== "VARIABLE" || !product?.attributes?.length || !product?.variants) {
      return;
    }
    const comboArray = product.attributes.map((attr: any) => selectedOptions[attr.name]);
    const allSelected = comboArray.every((v: string) => v !== undefined && v !== "");
    if (!allSelected) {
      setCurrentVariant(null);
      return;
    }
    const comboString = comboArray.join("-");
    const matched = product.variants.find(
      (v: any) => v.combination.toLowerCase().trim() === comboString.toLowerCase().trim(),
    );
    setCurrentVariant(matched || null);
  }, [selectedOptions, product]);

  const isVariable = product?.type === "VARIABLE";
  const sellPrice = currentVariant ? currentVariant.sellPrice : product?.sellPrice ?? 0;
  const regularPrice = currentVariant ? currentVariant.regularPrice : product?.regularPrice ?? 0;
  const stock = currentVariant ? currentVariant.quantity ?? 0 : product?.stock ?? 0;

  const isDhaka = DHAKA_DISTRICTS.includes(district);
  const shippingFee = product?.freeShipping ? 0 : isDhaka ? shippingRates.inside : shippingRates.outside;
  const subtotal = sellPrice * quantity;
  const total = subtotal + shippingFee;

  const canOrder = isVariable ? !!currentVariant : true;
  const outOfStock = stock <= 0;

  const images = useMemo(() => {
    const list = [...(product?.images || [])];
    if (currentVariant?.image) list.unshift(currentVariant.image);
    return list.filter(Boolean);
  }, [product, currentVariant]);

  const scrollToOrder = () => {
    document.getElementById("order-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!fullName.trim() || !phone.trim() || !address.trim() || !district) {
      toast.error("Please fill in your name, phone, address and district");
      return;
    }
    if (!/^01\d{9}$/.test(phone.trim())) {
      toast.error("Please enter a valid 11-digit BD phone number starting with 01");
      return;
    }
    if (isVariable && !currentVariant) {
      toast.error("Please select all product options");
      return;
    }
    if (outOfStock) {
      toast.error("This item is currently out of stock");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await placeLandingPageOrder(landingPage.slug, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        district,
        productVariantId: currentVariant?.id || null,
        quantity,
        shippingFee,
      });

      if (res.success) {
        setOrderPlaced(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        toast.error(res.message || "Failed to place order");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-muted/20">
        <div className="max-w-md w-full bg-card border rounded-3xl shadow-xl p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-black">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h1>
          <p className="text-muted-foreground">
            ধন্যবাদ, {fullName}! আপনার অর্ডারটি আমরা পেয়েছি এবং শীঘ্রই যোগাযোগ করা হবে।
          </p>
          <div className="bg-muted rounded-xl p-4 text-sm text-left space-y-1">
            <p><span className="text-muted-foreground">Product:</span> {product?.name}</p>
            <p><span className="text-muted-foreground">Quantity:</span> {quantity}</p>
            <p><span className="text-muted-foreground">Total:</span> ৳{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      {/* Minimal header — no site nav, keeps focus on the offer */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
              {logo ? (
                <Image src={logo} alt={siteName} fill className="object-cover" />
              ) : (
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              )}
            </div>
            <span className="font-black text-lg tracking-tight">{siteName}</span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-14">
        {/* Title */}
        <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            {landingPage.campaignTitle}
          </h1>
          {landingPage.campaignShortDescription && (
            <div
              className={`text-muted-foreground text-lg max-w-2xl mx-auto ${proseClass}`}
              dangerouslySetInnerHTML={{ __html: landingPage.campaignShortDescription }}
            />
          )}
        </div>

        {/* Price highlight — shown immediately so the offer is the first thing visitors see */}
        <PriceHighlight
          sellPrice={sellPrice}
          regularPrice={regularPrice}
          buttonText={landingPage.orderButtonText}
          onOrderClick={scrollToOrder}
          regularPriceLabel={landingPage.regularPriceLabel}
          offerPriceLabel={landingPage.offerPriceLabel}
        />

        {/* Banner */}
        {landingPage.bannerImage && (
          <div className="rounded-2xl overflow-hidden shadow-xl relative aspect-video w-full">
            <Image
              src={landingPage.bannerImage}
              alt={landingPage.campaignTitle}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 960px"
              className="object-cover"
            />
          </div>
        )}

        {/* Gallery */}
        {landingPage.galleryImages.length > 0 && (
          <div className="space-y-4">
            {(landingPage.galleryHeading || landingPage.galleryDescription) && (
              <div className="text-center space-y-1">
                {landingPage.galleryHeading && (
                  <h2 className="text-2xl md:text-3xl font-black">{landingPage.galleryHeading}</h2>
                )}
                {landingPage.galleryDescription && (
                  <div
                    className={`text-muted-foreground ${proseClass}`}
                    dangerouslySetInnerHTML={{ __html: landingPage.galleryDescription }}
                  />
                )}
              </div>
            )}
            <ImageSlider images={landingPage.galleryImages} alt="Gallery" />
          </div>
        )}

        {/* Mid-page CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={scrollToOrder}
            className="h-12 px-8 rounded-full font-bold shadow-md"
          >
            {landingPage.orderButtonText}
          </Button>
        </div>

        {/* About + Video */}
        {(landingPage.aboutHeading || landingPage.aboutDescription || landingPage.videoUrl) && (
          <div className="space-y-6">
            {landingPage.aboutHeading && (
              <h2 className="text-2xl md:text-3xl font-black text-center">
                {landingPage.aboutHeading}
              </h2>
            )}
            <div className="flex flex-col md:flex-row items-center gap-8">
              {landingPage.aboutDescription && (
                <div
                  className={`${landingPage.videoUrl ? "md:w-1/2" : "w-full text-center"} text-muted-foreground text-lg leading-relaxed ${proseClass}`}
                  dangerouslySetInnerHTML={{ __html: landingPage.aboutDescription }}
                />
              )}
              {landingPage.videoUrl && (
                <div className="md:w-1/2 w-full aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src={getEmbedUrl(landingPage.videoUrl)}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description block */}
        {(landingPage.descriptionTitle || landingPage.description) && (
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {landingPage.descriptionTitle && (
              <h2 className="text-2xl md:text-3xl font-black relative inline-block">
                {landingPage.descriptionTitle}
                <span className="block w-16 h-1 bg-primary mx-auto mt-2 rounded-full" />
              </h2>
            )}
            {landingPage.description && (
              <div
                className={`bg-card border shadow-sm rounded-2xl p-6 md:p-8 text-left text-muted-foreground leading-relaxed ${proseClass}`}
                dangerouslySetInnerHTML={{ __html: landingPage.description }}
              />
            )}
          </div>
        )}

        {/* Reviews */}
        {landingPage.reviewImages.length > 0 && (
          <div className="space-y-4">
            {landingPage.reviewHeading && (
              <h2 className="text-2xl md:text-3xl font-black text-center">
                {landingPage.reviewHeading}
              </h2>
            )}
            <ImageSlider images={landingPage.reviewImages} alt="Review" />
          </div>
        )}

        {/* Order form */}
        <div
          id="order-form"
          className="scroll-mt-20 bg-card border rounded-3xl shadow-xl p-6 md:p-8 space-y-8"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-black">
              {landingPage.orderFormHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product + options + summary */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 rounded-xl overflow-hidden border bg-muted">
                  {images[0] ? (
                    <Image src={images[0]} alt={product?.name || ""} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-tight">{product?.name}</h3>
                  <p className="font-semibold text-muted-foreground">
                    ৳{sellPrice.toFixed(2)}
                    {regularPrice > sellPrice && (
                      <span className="ml-2 text-sm line-through opacity-60">
                        ৳{regularPrice.toFixed(2)}
                      </span>
                    )}
                  </p>
                  {outOfStock && (
                    <span className="inline-block text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {isVariable &&
                product?.attributes?.map((attr: any) => (
                  <div key={attr.name} className="space-y-2">
                    <span className="text-sm font-semibold block">{attr.name}</span>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((val: string) => {
                        const isSelected = selectedOptions[attr.name] === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() =>
                              setSelectedOptions((prev) => ({ ...prev, [attr.name]: val }))
                            }
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background hover:border-primary/50"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              <div className="space-y-2">
                <span className="text-sm font-semibold block">Quantity</span>
                <div className="flex items-center border rounded-full overflow-hidden w-fit">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-muted"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-12 text-center font-bold text-sm">{quantity}</div>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stock || 99, q + 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-muted"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>৳{shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span className="text-primary">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer info */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-lg">Your Information</h3>
              <Input
                placeholder="Full Name *"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
              <Input
                type="tel"
                placeholder="Phone Number * (01XXXXXXXXX)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 rounded-xl"
                required
              />
              <Textarea
                placeholder="Full Address *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="rounded-xl min-h-[80px] resize-none"
                required
              />
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select District *" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Order notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-xl min-h-[60px] resize-none"
              />

              <div className="bg-muted rounded-xl p-3 text-center text-sm font-medium">
                Payment: Cash on Delivery
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !canOrder || outOfStock}
                className="w-full h-14 rounded-full text-lg font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  landingPage.orderButtonText
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-card border-t p-3 shadow-2xl flex items-center gap-3">
        <div className="flex-1">
          <p className="text-lg font-black text-primary">৳{sellPrice.toFixed(0)}</p>
        </div>
        <Button onClick={scrollToOrder} className="h-12 px-6 rounded-full font-bold flex-1">
          {landingPage.orderButtonText}
        </Button>
      </div>
    </div>
  );
}
