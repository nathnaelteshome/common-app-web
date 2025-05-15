"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { RxHamburgerMenu } from "react-icons/rx"
import Link from "next/link"

import { Epilogue } from "next/font/google"
import { useState, useRef, useEffect } from "react"
import { IoClose } from "react-icons/io5"

const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
})

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // function to close menu - fixed the unnecessary return
  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <div ref={navRef} className="relative">
      <nav className="flex justify-between items-center px-6 py-3 shadow-md bg-white">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative z-50"
          >
            {menuOpen ? (
              <IoClose className="text-white bg-primary p-1 rounded-full text-3xl z-50" />
            ) : (
              <RxHamburgerMenu className="text-3xl" />
            )}
          </button>
        </div>

        {/* Logo */}
        <Link href={"/#"} className={`${epilogue.className} font-bold text-2xl text-primary`}>
          CommonApply
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex gap-6 font-mono justify-center items-center text-blue-900">
          <Link href="/" className="text-sm font-medium hover:text-blue-300">
            Home
          </Link>
          <Link href="/search" className="text-sm font-medium hover:text-blue-300">
            College
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-blue-300">
            AboutUs
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-blue-300">
            Blog
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-blue-300">
            Contact
          </Link>
        </div>

        {/* Create Account Button */}
        <div className="flex items-center">
          <div className="bg-primary flex justify-between items-center sm:w-40 lg:w-48 rounded-full">
            <span className="text-white hidden sm:block text-sm flex-1 text-center">Create Account</span>
            <Button className="bg-white rounded-full aspect-square hover:bg-gray-300" variant="outline" size="icon">
              <Link href="/auth">
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Changed to absolute positioning */}
      <div
        className={`absolute top-16 left-0 w-full bg-white shadow-lg p-4 flex flex-col space-y-4 lg:hidden z-50 transition-all duration-300 ease-in-out ${
          menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        <Link href="/" className="text-blue-900 text-lg hover:text-primary transition" onClick={closeMenu}>
          Home
        </Link>
        <Link href="/search" className="text-blue-900 text-lg hover:text-primary transition" onClick={closeMenu}>
          College
        </Link>
        <Link href="#" className="text-blue-900 text-lg hover:text-primary transition" onClick={closeMenu}>
          AboutUs
        </Link>
        <Link href="#" className="text-blue-900 text-lg hover:text-primary transition" onClick={closeMenu}>
          Blog
        </Link>
        <Link href="#" className="text-blue-900 text-lg hover:text-primary transition" onClick={closeMenu}>
          Contact
        </Link>
      </div>
    </div>
  )
}

export default Navbar
