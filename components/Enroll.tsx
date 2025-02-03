import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Epilogue } from "next/font/google";

const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});

const Enroll = () => {
  return (
    <section className="flex flex-col sm:flex-row justify-center items-center text-white relative h-[400px]">
      <Image
        alt="enroll"
        src="/assets/landing-page/enroll-bg.png"
        className="object-cover -z-10"
        fill
      />
      {/* left section */}
      <div
        className={` ${epilogue.className} sm:flex-1 p-10 flex-col flex gap-2`}
      >
        <h4 className="font-semibold tracking-wider">Join Our How To Videos</h4>
        <h1 className="text-4xl font-bold tracking-[0.2rem]">How To Enroll?</h1>
        <h2 className="hidden sm:block">watch the video</h2>
        {/* button */}
        <div className="bg-white hidden sm:flex justify-between items-center sm:w-40  rounded-full">
          <span className="text-black hidden sm:block text-xs flex-1 font-semibold text-center">
            Watch The Video!
          </span>
          <Button
            className="bg-blue-950  rounded-full aspect-square hover:bg-gray-300"
            variant="outline"
            size="icon"
          >
            <Link href="/video">
              <ChevronRight className="text-white" />
            </Link>
          </Button>
        </div>
      </div>
      {/* right section */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <Image
          className="object-cover max-h-full bottom-0 "
          src="/assets/landing-page/play-button.png"
          width={60}
          height={60}
          alt="hero"
        />
        <div className="underline">Watch Now!</div>
      </div>
    </section>
  );
};

export default Enroll;
