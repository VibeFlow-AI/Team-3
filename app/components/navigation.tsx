"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";
import Link from "next/link";

/**
 * Navigation items for the navbar
 */
const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Sessions", href: "/sessions" },
  { name: "About", href: "/about" },
];

/**
 * Navigation component featuring a responsive navbar with mobile menu
 * Positioned absolutely within the hero section with rounded bottom corners
 * @returns {JSX.Element} The navigation bar with logo, menu items, and CTA button
 */
export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Toggle mobile menu visibility
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="absolute top-0 left-1/2 transform -translate-x-1/2 z-[100] w-4/5 max-w-7xl">
      <div className="bg-white rounded-bl-3xl rounded-br-3xl px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo Icon Only */}
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-black" />
          </div>

          {/* Middle - Navigation Menu (Desktop) - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-black font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right Side - Get Started Button */}
          <div className="hidden md:flex">
            <Link href="/login">
              <Button
                className="bg-black hover:bg-gray-800 text-white px-6 py-2"
                size="sm"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-black p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-black font-medium py-2 px-3 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2">
                <Link href="/login">
                  <Button
                    className="bg-black hover:bg-gray-800 text-white w-full"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
