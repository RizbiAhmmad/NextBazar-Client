import MyProfileContent from "@/components/modules/Dashboard/Profile/MyProfileContent";
import { getUserInfo } from "@/services/auth.services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | Seller Dashboard",
  description: "Manage your seller profile and account information.",
};

export default async function SellerMyProfilePage() {
  const user = await getUserInfo();

  if (!user) {
    return null;
  }

  return <MyProfileContent user={user} />;
}
