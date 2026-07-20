import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { getUserInfo } from "@/services/auth.services";
import { getSiteSettings } from "@/services/siteSetting.services";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getUserInfo();
  const siteSettingsRes = await getSiteSettings();
  const siteSettings = siteSettingsRes.data;

  return (
    <>
      <Navbar userInfo={userInfo} siteSettings={siteSettings} />
      <main className="min-h-screen">{children}</main>
      <Footer siteSettings={siteSettings} />
    </>
  );
}

