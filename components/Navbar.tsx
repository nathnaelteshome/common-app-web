import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { navLinks } from "@/public/data/data";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";

import { Epilogue } from "next/font/google";

const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});

const Navbar = () => {
  return (
    // the margin on top is 2 moves the navbar down a bit added to make it work with shadcn button needs minor improvment
    <nav className="flex justify-around mt-2">
      <div className="lg:hidden flex items-center">
        <RxHamburgerMenu className="text-3xl" />
      </div>
      <div
        className={` ${epilogue.className} font-bold text-3xl text-primary `}
      >
        CommonApply
      </div>
      <div className="hidden lg:flex gap-6 font-mono justify-center items-center text-blue-900 ">
        {Object.values(navLinks).map((link, index) => (
          <Link key={index} href={link.href}>
            <div>{link.label}</div>
          </Link>
        ))}
      </div>
      <div className="flex items-center  ">
        {/* button */}
        <div className="bg-primary flex  justify-between items-center sm:w-40 lg:w-48 rounded-full">
          <span className="text-white hidden sm:block text-sm flex-1 text-center">
            Create Account
          </span>
          <Button
            className="bg-white  rounded-full aspect-square hover:bg-gray-300"
            variant="outline"
            size="icon"
          >
            <Link href="/auth">
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
