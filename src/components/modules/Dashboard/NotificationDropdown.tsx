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
import { Bell, Film, Star, Info, CreditCard } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "new_release" | "review" | "system" | "subscription";
  timestamp: Date;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "New Movie Released",
    message:
      "Inception is now available to stream in 4K. Grab your popcorn and watch it now!",
    type: "new_release",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },

  {
    id: "2",
    title: "Review Approved",
    message:
      "Your review for 'The Dark Knight' has been approved by our moderators and is now public.",
    type: "review",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
  },

  {
    id: "3",
    title: "System Update",
    message:
      "We've added new streaming features to your dashboard. Check out the new 1080p stream quality options!",
    type: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
  },

  {
    id: "4",
    title: "Subscription Expiring Soon",
    message:
      "Your premium subscription will expire in 3 days. Renew now to avoid streaming interruptions.",
    type: "subscription",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "new_release":
      return <Film className="h-4 w-4 text-blue-600" />;
    case "review":
      return <Star className="h-4 w-4 text-amber-500" />;
    case "system":
      return <Info className="h-4 w-4 text-purple-600" />;
    case "subscription":
      return <CreditCard className="h-4 w-4 text-red-600" />;
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
        <Button variant={"outline"} size={"icon"} className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 rounded full p-0 flex items-center justify-center"
              variant={"destructive"}
            >
              <span className="text-[10px]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"end"} className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant={"secondary"} className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ScrollArea className="h-75">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-2 p-3 cursor-pointer"
              >
                <div className="flex gap-2 w-full">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-center justify-center cursor-pointer font-medium p-3">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
