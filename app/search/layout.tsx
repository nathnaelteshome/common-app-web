"use client";
import FilterSidebar from "@/components/FilterSidebar";
import UniversitySearch from "@/components/Search";
import { Poppins } from "next/font/google";
import { useState } from "react";
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});
export default function Layout({}: Readonly<{
  children: React.ReactNode;
}>) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className={` antialiased ${poppins.className} flex`}>
      <FilterSidebar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <UniversitySearch searchTerm={searchTerm} />
    </div>
  );
}
