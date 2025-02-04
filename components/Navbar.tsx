"use client";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { navLinks } from "@/public/data/data";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";

import { Epilogue } from "next/font/google";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-6 py-3 shadow-md bg-white">
      {/* Mobile Menu Icon */}
      <div className="lg:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <IoClose className="text-black z-10 text-3xl" />
          ) : (
            <RxHamburgerMenu className="text-3xl" />
          )}
        </button>
      </div>

      {/* Logo */}
      <div
        className={` ${epilogue.className} font-bold text-2xl text-primary `}
      >
        CommonApply
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex gap-6 font-mono justify-center items-center text-blue-900">
        {Object.values(navLinks).map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="hover:text-primary transition"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Create Account Button */}
      <div className="flex items-center">
        <div className="bg-primary flex justify-between items-center sm:w-40 lg:w-48 rounded-full">
          <span className="text-white hidden sm:block text-sm flex-1 text-center">
            Create Account
          </span>
          <Button
            className="bg-white rounded-full aspect-square hover:bg-gray-300"
            variant="outline"
            size="icon"
          >
            <Link href="/auth">
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[100px] left-0 w-full bg-white shadow-lg p-4 flex flex-col space-y-4 lg:hidden">
          {Object.values(navLinks).map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-blue-900 text-lg hover:text-primary transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
