import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
// import heroImage from "../public/assets/landing-page/ForegroundHero.png";
import { Epilogue } from "next/font/google";

const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});

const HeroSection = () => {
  return (
    <section
      className={` " ${epilogue.className} flex bg-[url('/assets/landing-page/Background.png')] bg-cover 2xl:h-[720px] max-h-[80svh] h-[500px] md:h-[600px] " `}
    >
      {/* left section */}
      <div className="flex-1">
        <div className="flex flex-col justify-center h-full p-5 md:p-10">
          <span className="text-primary font-mono uppercase lg:text-2xl">
            Welcome to Common Apply
          </span>
          <h1 className="text-4xl md:text-4xl font-bold lg:text-6xl py-5   text-primarty">
            Achieving Your Dreams Through Educations
          </h1>
          <p className="text-xs md:text-sm tracking-tight font-medium py-2 text-gray-800 font-mono">
            You are at the right place
          </p>
          {/* button */}
          <div className=" bg-primary flex justify-between items-center md:w-40 w-fit rounded-full">
            <span className="sm:block hidden text-white text-xs flex-1 text-center">
              Apply Now!
            </span>
            <Button
              className="bg-blue-950  rounded-full aspect-square hover:bg-gray-300"
              variant="outline"
              size="icon"
            >
              <Link href="/apply">
                <ChevronRight className="text-white" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {/* right section */}
      <div className="h-full flex items-center  justify-center w-full flex-1 ">
        <div className="h-2/3 w-full  relative  ">
          <Image
            className="object-cover max-h-full bottom-0 "
            src="/assets/landing-page/HeroForeground.png "
            width={1920}
            height={1080}
            // fill={true}
            // src={heroImage} // fill
            alt="hero"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
