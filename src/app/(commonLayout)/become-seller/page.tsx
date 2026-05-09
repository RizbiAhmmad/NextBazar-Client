import BecomeSellerForm from "@/components/modules/Seller/BecomeSellerForm";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { getUserInfo } from "@/services/auth.services";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Become a Seller | NextBazar",
  description: "Join NextBazar as a seller and grow your business with us.",
};

const BecomeSellerPage = async () => {
  const userInfo = await getUserInfo();

  // Already a seller or admin — redirect to their dashboard
  if (userInfo && userInfo.role !== "USER") {
    redirect(getDefaultDashboardRoute(userInfo.role));
  }

  // Not logged in — redirect to login with a callback
  if (!userInfo) {
    redirect("/login?redirect=/become-seller");
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-muted/20 py-12 px-4 md:py-20">
      <div className="container mx-auto">
        <BecomeSellerForm />
      </div>
    </div>
  );
};

export default BecomeSellerPage;

