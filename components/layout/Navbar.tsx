"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/useCartStore";
import { useTheme } from "next-themes";
import { CartDrawer } from "@/components/home/CartDrawer";
import { useQuery } from "@tanstack/react-query";
import { listRatesQueryOptions, getRateByIdQueryOptions } from "@/lib/api";
import { useUserPrefs } from "@/stores/useUserPrefs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser, useClerk, SignInButton } from "@clerk/nextjs";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { rateId, setRateId } = useUserPrefs();
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();

  const { data: rates } = useQuery(listRatesQueryOptions);
  const effectiveRateId = rateId || rates?.[0]?.id || "";
  const { data: rateDetails } = useQuery(
    getRateByIdQueryOptions(effectiveRateId),
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/store", label: "Store" },
    { href: "/featured", label: "Featured" },
  ];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
          scrolled
            ? "bg-background/95 backdrop-blur-sm shadow-sm"
            : "bg-background"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-black text-xl tracking-tight shrink-0"
              aria-label="FORGE Home"
            >
              <span className="text-amber-500 text-2xl">⬡</span>
              <span>FORGE</span>
            </Link>

            {/* Desktop nav links */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Site sections"
            >
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive(href)
                      ? "bg-amber-500 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-1.5">
              {/* Currency selector */}
              {rates && rates.length > 0 && (
                <Select value={effectiveRateId} onValueChange={setRateId}>
                  <SelectTrigger className="w-24 h-8 text-xs border-none shadow-none bg-transparent font-semibold">
                    <SelectValue placeholder={rateDetails?.currency ?? "NGN"} />
                  </SelectTrigger>
                  <SelectContent>
                    {rates.map(
                      (r) =>
                        r.id && (
                          <SelectItem
                            key={r.id}
                            value={r.id}
                            className="text-xs"
                          >
                            {r.currency} — {r.country}
                          </SelectItem>
                        ),
                    )}
                  </SelectContent>
                </Select>
              )}

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                aria-label="Toggle colour theme"
                className="relative h-8 w-8"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* User menu */}
              {isSignedIn ? (
                <div className="relative hidden md:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="gap-1.5 h-8 px-2"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-xs font-semibold max-w-20 truncate">
                      {user.firstName}
                    </span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </Button>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-52 bg-background border rounded-xl shadow-xl z-20 py-1.5 overflow-hidden">
                        <div className="px-3 py-2 border-b mb-1">
                          <p className="text-xs font-semibold truncate">
                            {user.fullName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="h-4 w-4 text-amber-500" />{" "}
                          Dashboard
                        </Link>
                        <Link
                          href="/order-tracking"
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShoppingBag className="h-4 w-4 text-amber-500" /> My
                          Orders
                        </Link>
                        <div className="border-t mt-1 pt-1">
                          <button
                            onClick={() => {
                              signOut();
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors text-destructive"
                          >
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex h-8 text-xs font-semibold"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCartOpen(true)}
                className="relative h-8 w-8"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-4 w-4" />
                {mounted && cartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {cartCount() > 9 ? "9+" : cartCount()}
                  </span>
                )}
              </Button>

              {/* Mobile hamburger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-50 bg-background transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"} md:hidden flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link
            href="/"
            className="font-black text-xl flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-amber-500">⬡</span> FORGE
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-3 text-base font-semibold rounded-xl transition-colors ${isActive(href) ? "bg-amber-500 text-white" : "hover:bg-accent"}`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          {isSignedIn && (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-3 text-base font-semibold rounded-xl hover:bg-accent transition-colors flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 text-amber-500" /> Dashboard
              </Link>
              <Link
                href="/order-tracking"
                className="px-4 py-3 text-base font-semibold rounded-xl hover:bg-accent transition-colors flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <ShoppingBag className="h-4 w-4 text-amber-500" /> My Orders
              </Link>
            </>
          )}
        </nav>
        <div className="p-4 border-t">
          {isSignedIn ? (
            <Button
              variant="outline"
              className="w-full gap-2 text-destructive border-destructive"
              onClick={() => {
                signOut();
                setMobileOpen(false);
              }}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
