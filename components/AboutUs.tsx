import Image from "next/image";
import Link from "next/link";

import { Epilogue } from "next/font/google";
const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});

const AboutUs = () => {
  return (
    <div className="flex flex-col md:flex-row">
      {/* left section */}
      <div className="flex-1 relative">
        <Image
          src="/assets/landing-page/image-group.png"
          width={1000}
          height={1000}
          className="object-cover p-10"
          alt="group"
        />
      </div>
      {/* right section */}
      <div className="flex justify-center lg:gap-8 gap-5 flex-col p-10 md:gap-2 flex-1">
        <h3 className="uppercase text-[#704fe6]  font-medium py-1 px-4 text-sm border bg-[#E9E2FF] w-fit rounded-sm">
          <Link href="/aboutus"> Our About Us</Link>
        </h3>
        <div
          className={` ${epilogue.className} text-primary text-xl md:text-2xl font-bold  `}
        >
          <h2>Learn & Grow Your Skills</h2>
          <h2>With The Amazing College</h2>
        </div>
        <p>
          We are a team of talented professionals who are always ready to take
          the extra mile to help you achieve your dreams. Our team is dedicated
          to providing you with
        </p>
        <div className="flex gap-4">
          <div className="flex-1">
            <h3 className={`${epilogue.className} uppercase font-semibold`}>
              Flexible Enviroment
            </h3>
            <p className="pr-1 font-extralight">
              Suspendisse ultrice gravida dictum fusce placerat ultricies
              integer quis auctor elit sed vulputate mi sit.
            </p>
          </div>
          <div className="flex-1 ">
            <h3 className={`${epilogue.className} uppercase font-semibold`}>
              Excellent Instuction
            </h3>

            <p className="pr-1 font-extralight">
              Suspendisse ultrice gravida dictum fusce placerat ultricies
              integer quis auctor elit sed vulputate mi sit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
