import { disiplineCategories } from "@/public/data/data";
import Image from "next/image";

import { Epilogue } from "next/font/google";
import Link from "next/link";
const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});

const Category = () => {
  return (
    <section className="p-14 flex justify-center items-center gap-6 flex-col border border-red-900">
      <h3 className="uppercase text-[#704fe6] py-2 px-6 border bg-[#E9E2FF] w-fit rounded-sm">
        Categories
      </h3>
      <div className={` ${epilogue.className} text-4xl  font-bold `}>
        {" "}
        Browse By Categories
      </div>
      {/* category container */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-12 gap-y-4 lg:grid-cols-3 lg:gap-x-28 lg:gap-y-8 p-24 ">
        {disiplineCategories.map((category, index) => (
          <Link href={`/categories/?category=${category.name}`} key={index}>
            <div
              key={index}
              className={`flex items-center min-w-72 p-2 lg:p-6 lg:gap-4 rounded-lg gap-2 ${category.color} bg-opacity-50 bg `}
            >
              <div className="relative p-2 rounded-full">
                <Image src={category.icon} width={40} height={40} alt="icon" />
              </div>
              <span className="font-semibold">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Category;
