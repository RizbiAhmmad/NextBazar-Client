import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Store } from "lucide-react";
import Link from "next/link";

export default function BecomeSellerSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-green-500/10 border-2 border-green-500/30">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight">
            Application Submitted!
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            তোমার seller application আমরা পেয়েছি। Admin review করে approve করলে
            তুমি seller dashboard access পাবে।
          </p>
        </div>

        {/* Status card */}
        <div className="rounded-2xl border bg-muted/30 p-6 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10">
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-left">
              <p className="font-bold">Under Review</p>
              <p className="text-xs text-muted-foreground">
                সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে সিদ্ধান্ত জানানো হয়
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-bold">Approval-এর পরে</p>
              <p className="text-xs text-muted-foreground">
                তোমার role SELLER হবে এবং shop dashboard unlock হবে
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" className="flex-1 rounded-xl h-12">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild className="flex-1 rounded-xl h-12 shadow-lg shadow-primary/20">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
