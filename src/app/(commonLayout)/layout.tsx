import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { getUserInfo } from "@/services/auth.services";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getUserInfo();

  return (
    <>
      <Navbar userInfo={userInfo} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

