import Navbar from "@/components/shared/Navbar";
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
      <main>{children}</main>
    </>
  );
}

