"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createShop } from "@/services/shop.services";
import { shopZodSchema } from "@/zod/shop.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Upload, X, Store } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const BecomeSellerForm = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createShop,
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      const data = {
        name: value.name,
        description: value.description,
      };

      formData.append("data", JSON.stringify(data));
      if (logoFile) formData.append("logo", logoFile);
      if (bannerFile) formData.append("banner", bannerFile);

      const result = await mutateAsync(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to create shop");
        return;
      }

      toast.success("Shop application submitted! Admin will review and approve shortly.");
      router.push("/become-seller/success");
    },
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "banner") => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (type === "logo") {
            setLogoFile(selectedFile);
            setLogoPreview(reader.result as string);
          } else {
            setBannerFile(selectedFile);
            setBannerPreview(reader.result as string);
          }
        };
        reader.readAsDataURL(selectedFile);
      }
    },
    [],
  );

  return (
    <Card className="max-w-2xl mx-auto border-none shadow-2xl bg-background/50 backdrop-blur-sm">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
          <Store className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-black tracking-tight">Become a Seller</CardTitle>
        <CardDescription className="text-base font-medium">
          Start your journey with NextBazar and reach thousands of customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <div className="space-y-6">
            <form.Field
              name="name"
              validators={{ onChange: shopZodSchema.shape.name }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Shop Name"
                  placeholder="Enter your unique shop name"
                  className="h-12 text-base"
                />
              )}
            </form.Field>

            <form.Field
              name="description"
              validators={{ onChange: shopZodSchema.shape.description }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                  <textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Tell us about your shop and what you sell..."
                    className="flex min-h-[120px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  />
                  {field.state.meta.errors && (
                    <p className="text-xs font-medium text-destructive mt-1">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Shop Logo</Label>
                {!logoPreview ? (
                  <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 transition-all hover:bg-primary/10 hover:border-primary/40">
                    <Upload className="mb-3 size-8 text-primary/60" />
                    <span className="text-sm font-bold text-primary/80">Upload Logo</span>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "logo")}
                    />
                  </label>
                ) : (
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border-2 border-primary/20 shadow-inner">
                    <Image
                      src={logoPreview}
                      alt="Logo Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 size-8 rounded-full shadow-lg"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Banner Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Shop Banner</Label>
                {!bannerPreview ? (
                  <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 transition-all hover:bg-primary/10 hover:border-primary/40">
                    <Upload className="mb-3 size-8 text-primary/60" />
                    <span className="text-sm font-bold text-primary/80">Upload Banner</span>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "banner")}
                    />
                  </label>
                ) : (
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border-2 border-primary/20 shadow-inner">
                    <Image
                      src={bannerPreview}
                      alt="Banner Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 size-8 rounded-full shadow-lg"
                      onClick={() => {
                        setBannerFile(null);
                        setBannerPreview(null);
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <AppSubmitButton
              isPending={isPending}
              pendingLabel="Registering Shop..."
              className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20"
            >
              Launch My Shop
            </AppSubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BecomeSellerForm;
