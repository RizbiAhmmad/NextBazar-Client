"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Bell, ShoppingCart, Tag, UserCheck, Star } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "promotion" | "system" | "review";
  timestamp: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message:
      "You have received a new order #ORD-7721 from John Doe. Process it now!",
    type: "order",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
  },

  {
    id: "2",
    title: "Price Drop Alert!",
    message:
      "The 'Wireless Noise Cancelling Headphones' in your wishlist is now 20% off.",
    type: "promotion",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },

  {
    id: "3",
    title: "New Review Received",
    message:
      "A customer just left a 5-star review for your 'Organic Honey' product.",
    type: "review",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
  },

  {
    id: "4",
    title: "Security Update",
    message: "A new login was detected from a new device in Dhaka, Bangladesh.",
    type: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return <ShoppingCart className="h-4 w-4 text-blue-600" />;
    case "promotion":
      return <Tag className="h-4 w-4 text-emerald-500" />;
    case "review":
      return <Star className="h-4 w-4 text-amber-500" />;
    case "system":
      return <UserCheck className="h-4 w-4 text-purple-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
  }
};

const NotificationDropdown = () => {
  const unreadCount = MOCK_NOTIFICATIONS.filter(
    (notification) => !notification.read,
  ).length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="relative rounded-xl border-slate-200 hover:bg-slate-50 transition-all"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-rose-500 hover:bg-rose-600 border-2 border-white"
              variant={"destructive"}
            >
              <span className="text-[10px] font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={"end"}
        className="w-80 rounded-3xl border-slate-100 shadow-2xl shadow-slate-200/50 p-2"
      >
        <DropdownMenuLabel className="flex items-center justify-between p-4">
          <span className="text-base font-black text-slate-900 tracking-tight">
            Notifications
          </span>
          {unreadCount > 0 && (
            <Badge
              variant={"secondary"}
              className="bg-blue-50 text-blue-600 font-bold border-none px-3"
            >
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-50 mx-2" />

        <ScrollArea className="h-80 my-2">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-2 p-4 cursor-pointer rounded-2xl mx-1 focus:bg-slate-50 transition-colors"
              >
                <div className="flex gap-4 w-full">
                  <div className="mt-0.5 h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-slate-800 leading-tight">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 ml-2 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>

                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-1">
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-10 text-center flex flex-col items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                <Bell className="h-6 w-6 text-slate-300" />
              </div>
              <p className="text-sm text-slate-400 font-medium">
                All caught up!
              </p>
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator className="bg-slate-50 mx-2" />

        <DropdownMenuItem className="text-center justify-center cursor-pointer font-black text-[10px] uppercase tracking-[0.2em] p-4 text-primary hover:bg-primary/5 rounded-2xl transition-all">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
