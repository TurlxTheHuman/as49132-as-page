"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#" },
  { label: "Peering Policy", href: "#peering-policy" },
  { label: "Locations", href: "#locations" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / AS Number */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-foreground">
              AS49132
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/50"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://www.peeringdb.com/asn/49132"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              PeeringDB
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="https://www.peeringdb.com/asn/49132"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 mx-4 px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-center"
              >
                PeeringDB
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
