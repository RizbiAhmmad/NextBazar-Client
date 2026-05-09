import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
      ],
    },
  ];
};

export const userNavItems: NavSection[] = [
  {
    title: "Shopping",
    items: [
      {
        title: "My Orders",
        href: "/dashboard/my-orders",
        icon: "ShoppingBag",
      },
      {
        title: "My Reviews",
        href: "/dashboard/my-reviews",
        icon: "Star",
      },
      // {
      //   title: "Wishlist",
      //   href: "/dashboard/wishlist",
      //   icon: "Heart",
      // },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/dashboard/my-profile",
        icon: "User",
      },
    ],
  },
];

export const sellerNavItems: NavSection[] = [
  {
    title: "Store Management",
    items: [
      {
        title: "My Shop",
        href: "/seller/dashboard/my-shop",
        icon: "Store",
      },
      {
        title: "Products",
        href: "/seller/dashboard/products",
        icon: "Package",
      },
      {
        title: "Orders",
        href: "/seller/dashboard/orders",
        icon: "ShoppingCart",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        href: "/seller/dashboard/my-profile",
        icon: "User",
      },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "Marketplace",
    items: [
      {
        title: "Shops",
        href: "/admin/dashboard/shops",
        icon: "Store",
      },
      {
        title: "Categories",
        href: "/admin/dashboard/categories",
        icon: "Layers",
      },
      {
        title: "Products",
        href: "/admin/dashboard/products",
        icon: "Package",
      },
      {
        title: "Orders",
        href: "/admin/dashboard/orders",
        icon: "ShoppingCart",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Users",
        href: "/admin/dashboard/users",
        icon: "Users",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Analytics",
        href: "/admin/dashboard/analytics",
        icon: "BarChart3",
      },
      {
        title: "Profile",
        href: "/admin/dashboard/my-profile",
        icon: "User",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];

    case "SELLER":
      return [...commonNavItems, ...sellerNavItems];

    case "USER":
      return [...commonNavItems, ...userNavItems];

    default:
      return commonNavItems;
  }
};
