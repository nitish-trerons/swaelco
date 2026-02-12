"use client";

import { Menu, PhoneCall } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-md">
      <div className="border-b border-white/10 bg-gradient-to-r from-blue-500/10 via-red-500/10 to-blue-500/10">
        <div className="container flex h-9 items-center justify-between text-xs text-slate-300">
          <p>ISO-focused installation teams · Permit-ready documentation</p>
          <p className="hidden sm:block">Avg. quote turnaround: 1 business day</p>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between">
        <Link href="/" aria-label="SWAELCO home">
          <BrandLogo />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link href={link.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-slate-100 hover:bg-slate-800/70",
                    )}
                  >
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="hidden border-blue-300/40 bg-blue-500/10 text-blue-100 hover:bg-blue-500/20 lg:inline-flex"
          >
            <a href="tel:+15559811200">
              <PhoneCall className="mr-2 h-4 w-4" /> 24/7 Hotline
            </a>
          </Button>

          <Button asChild variant="ghost" className="hidden text-slate-100 hover:bg-slate-800 md:inline-flex">
            <Link href="/login">Portal Login</Link>
          </Button>

          <Button asChild className="hidden bg-red-500 text-white hover:bg-red-400 sm:inline-flex">
            <Link href="/contact">Request a Quote</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-slate-700 bg-transparent text-slate-100 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-slate-800 bg-slate-950 text-slate-100">
              <SheetHeader>
                <SheetTitle className="text-slate-100">Navigate</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-sm text-blue-200 hover:bg-blue-500/10"
                >
                  Portal Login
                </Link>
                <Link
                  href="/contact"
                  className="mt-2 block rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  Request a Quote
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
