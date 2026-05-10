"use client";

import {
  Menu,
  ShoppingBag,
  Info,
  LayoutDashboard,
  LogOut,
  Search,
  ShoppingCart,
  Heart,
  Store,
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/services/auth.services";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { UserInfo } from "@/types/user.types";
import { getDefaultDashboardRoute } from "@/lib/authUtils";

import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useCart } from "@/providers/CartProvider";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  userInfo?: UserInfo | null;
}

const Navbar = ({ userInfo, className }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();

  const menu: MenuItem[] = [
    { title: "Home", url: "/" },
    { title: "Products", url: "/products" },
    { title: "Blogs", url: "/blogs" },
    { title: "About", url: "/about" },
    { title: "Contact", url: "/contact" },
  ];

  const dashboardRoute = userInfo
    ? getDefaultDashboardRoute(userInfo.role)
    : "/dashboard";

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <section
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-8">
        {/* Desktop Menu */}
        <nav className="hidden h-20 items-center justify-between lg:flex">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <ShoppingBag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none text-foreground">
                  Next<span className="text-primary">Bazar</span>
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground">
                  E-commerce
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Menu Items */}
          <div className="flex-1 px-8">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="gap-1">
                {menu.map((item) => renderMenuItem(item, pathname))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border-r pr-4 mr-2 gap-1.5">
              <div className="relative group hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 h-10 w-[200px] xl:w-[300px] rounded-full bg-muted/50 border-none focus-visible:ring-primary transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value;
                      if (val) router.push(`/products?searchTerm=${val}`);
                    }
                  }}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full text-muted-foreground hover:text-primary transition-colors"
              >
                <Heart className="h-5 w-5" />
                <Badge className="absolute -right-1 -top-1 h-4 w-4 justify-center p-0 text-[10px]">
                  0
                </Badge>
              </Button>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full text-muted-foreground hover:text-primary transition-colors"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-4 min-w-4 justify-center p-0 text-[10px]">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {(!userInfo || userInfo.role === "USER") && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hidden xl:flex rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white font-bold transition-all"
                >
                  <Link href="/become-seller">Become a Seller</Link>
                </Button>
              )}
              {userInfo?.role === "SELLER" && (
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="hidden xl:flex rounded-full font-bold shadow-lg shadow-primary/20"
                >
                  <Link href="/seller/dashboard">My Shop</Link>
                </Button>
              )}

              <ThemeToggle />

              {userInfo ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="group relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all hover:ring-primary/40"
                    >
                      {userInfo.image ? (
                        <Image
                          src={userInfo.image}
                          alt={userInfo.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary/60 text-sm font-bold text-primary-foreground">
                          {userInfo.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 mt-2"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3 px-1 py-1.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                          {userInfo.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-semibold leading-none">
                            {userInfo.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground truncate max-w-[150px]">
                            {userInfo.email}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link href={dashboardRoute} className="flex items-center">
                        <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                      <Link href="/my-profile" className="flex items-center">
                        <Info className="mr-3 h-4 w-4 text-primary" />
                        <span className="font-medium">My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="hidden sm:inline-flex font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full px-5 font-bold shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-black tracking-tight">
              Next<span className="text-primary">Bazar</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.push("/products")}
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[400px] border-l-0 p-0"
              >
                <div className="flex flex-col h-full bg-background">
                  <SheetHeader className="p-6 border-b text-left">
                    <div className="flex items-center justify-between">
                      <SheetTitle>
                        <Link href="/" className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <span className="text-xl font-black tracking-tight">
                            Next<span className="text-primary">Bazar</span>
                          </span>
                        </Link>
                      </SheetTitle>
                    </div>
                    <SheetDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground mt-1">
                      Your premium shopping destination
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto py-6">
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full px-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item, pathname))}
                    </Accordion>
                  </div>

                  <div className="p-6 border-t bg-muted/30">
                    {userInfo ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 mb-2 px-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                            {userInfo.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">
                              {userInfo.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {userInfo.email}
                            </span>
                          </div>
                        </div>

                        {userInfo.role === "USER" && (
                          <Button
                            asChild
                            variant="outline"
                            className="justify-start gap-3 h-12 rounded-xl border-primary/20 text-primary"
                          >
                            <Link href="/become-seller">
                              <Store className="size-5" />
                              Become a Seller
                            </Link>
                          </Button>
                        )}

                        <Button
                          asChild
                          variant="outline"
                          className="justify-start gap-3 h-12 rounded-xl"
                        >
                          <Link href={dashboardRoute}>
                            <LayoutDashboard className="size-5 text-primary" />
                            Dashboard
                          </Link>
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="justify-start gap-3 h-12 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"
                        >
                          <LogOut className="size-5" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Button
                          asChild
                          className="h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                        >
                          <Link href="/become-seller">
                            <Store className="size-5" />
                            Become a Seller
                          </Link>
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            asChild
                            variant="outline"
                            className="h-12 rounded-xl font-bold"
                          >
                            <Link href="/login">Login</Link>
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            className="h-12 rounded-xl font-bold"
                          >
                            <Link href="/register">Sign up</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem, currentPath: string) => {
  const isActive = currentPath === item.url;

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger
          className={cn(
            "bg-transparent h-10 px-4 font-semibold transition-colors hover:bg-primary/5 hover:text-primary data-[state=open]:bg-primary/5",
            isActive && "text-primary",
          )}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background border rounded-2xl shadow-2xl">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <SubMenuLink item={subItem} />
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className={cn(
            "relative group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-semibold transition-colors hover:text-primary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
            isActive ? "text-primary" : "text-foreground/70",
          )}
        >
          {item.title}
          {isActive && (
            <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
          )}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem, currentPath: string) => {
  const isActive = currentPath === item.url;

  if (item.items) {
    return (
      <AccordionItem
        key={item.title}
        value={item.title}
        className="border-none"
      >
        <AccordionTrigger
          className={cn(
            "text-base py-4 font-bold hover:no-underline px-4 rounded-xl transition-all",
            isActive ? "bg-primary/5 text-primary" : "hover:bg-muted/50",
          )}
        >
          <span className="flex items-center gap-3">{item.title}</span>
        </AccordionTrigger>
        <AccordionContent className="pb-2 px-2 pt-1">
          <div className="flex flex-col gap-1">
            {item.items.map((subItem) => (
              <Link
                key={subItem.title}
                href={subItem.url}
                className="flex items-center gap-4 rounded-xl p-3 text-sm transition-all hover:bg-primary/5 group"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {subItem.icon}
                </div>
                <div>
                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                    {subItem.title}
                  </div>
                  <div className="text-[11px] font-medium text-muted-foreground line-clamp-1">
                    {subItem.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link
      key={item.title}
      href={item.url}
      className={cn(
        "flex items-center py-4 px-4 text-base font-bold rounded-xl transition-all mb-1",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/80 hover:bg-muted/50 hover:text-primary",
      )}
    >
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="group flex flex-row items-center gap-4 rounded-xl p-3.5 leading-none no-underline transition-all outline-none select-none hover:bg-primary/5"
      href={item.url}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {item.icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
          {item.title}
        </div>
        {item.description && (
          <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default Navbar;
