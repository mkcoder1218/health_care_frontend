"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, X, Heart, LogOut, User, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/integration/api";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import io from "socket.io-client";
import { BASE_URL } from "@/integration/config";
import { encodeQuery } from "@/integration/utils";
import { mutate } from "swr";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const router = useRouter();
  const { data: profile } = api.profile.getAll({
    include: [
      { model: "Role", as: "role" },
      { model: "ClientProfile", as: "clientProfile" },
      { model: "ProfessionalProfile", as: "professionalProfile" },
    ],
  });
  const userId = (profile as any)?.user?.id;
  const role = (profile as any)?.user?.role?.name;
  const notificationsQuery = useMemo(
    () => ({
      filters: userId ? { user_id: userId } : undefined,
      order: [["createdAt", "DESC"]],
      limit: 20,
    }),
    [userId],
  );
  const { data: notificationsData } = api.notification.getAll(
    userId ? notificationsQuery : undefined,
  );
  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.length;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  const roleName = (profile as any)?.user?.role?.name?.toLowerCase?.() || "";
  const isProfessional = roleName === "professional";
  const isUser = roleName === "user";

  const profileLink = (profile as any)?.user?.professionalProfile
    ? "/profile/professional"
    : "/profile/client";

  useEffect(() => {
    if (!userId) return;
    const socket = io(BASE_URL);
    socket.emit("register-user", { userId, role });
    socket.on("notification", () => {
      const key = `/api/notification?q=${encodeQuery(notificationsQuery as any)}`;
      mutate(key);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, role, notificationsQuery]);

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${(profile as any)?.user?.name}`}
              alt={(profile as any)?.user?.name}
            />
            <AvatarFallback>
              {(profile as any)?.user?.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {(profile as any)?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {(profile as any)?.user?.role?.name}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={profileLink}
            className="cursor-pointer w-full flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="cursor-pointer w-full flex items-center"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary transition-transform group-hover:scale-105">
              <Heart
                className="h-5 w-5 text-primary-foreground"
                fill="currentColor"
              />
            </div>
            <span className="text-xl font-serif font-bold text-foreground">
              MindCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation
              .filter((item) =>
                isProfessional ? item.href !== "/services" : true,
              )
              .map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            {isProfessional && (
              <Link
                href="/patients"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Patients
              </Link>
            )}
            <div className="flex items-center gap-3">
              {(profile as any)?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 ? (
                        <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-rose-500 text-white text-xs flex items-center justify-center px-1">
                          {unreadCount}
                        </span>
                      ) : null}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end" forceMount>
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((note: any) => (
                        <DropdownMenuItem key={note.id} className="flex flex-col items-start gap-1">
                          <span className="text-sm font-semibold">{note.title}</span>
                          <span className="text-xs text-muted-foreground">{note.message}</span>
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
              {(profile as any)?.user ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button onClick={() => setRegisterOpen(true)}>
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden rounded-md p-2 text-foreground hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navigation
                .filter((item) =>
                  isProfessional ? item.href !== "/services" : true,
                )
                .map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isProfessional && (
                <Link
                  href="/patients"
                  className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Patients
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {(profile as any)?.user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-2 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${(profile as any)?.user?.name}`}
                          alt={(profile as any)?.user?.name}
                        />
                        <AvatarFallback>
                          {(profile as any)?.user?.name
                            ?.substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {(profile as any)?.user?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(profile as any)?.user?.role?.name}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link
                        href={profileLink}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button variant="ghost" asChild className="w-full">
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setRegisterOpen(true);
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select account type</DialogTitle>
            <DialogDescription>
              Choose the type of account you want to create.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-primary" />
                  Client Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Register to book services and manage your care.
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    setRegisterOpen(false);
                    router.push("/register/client");
                  }}
                >
                  Continue as Client
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-primary" />
                  Professional Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Register to provide services as a professional.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setRegisterOpen(false);
                    router.push("/register/professional");
                  }}
                >
                  Continue as Professional
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
