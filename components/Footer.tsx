import { footerData } from "@/public/data/data";
import Image from "next/image";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import TimeStamp from "./TimeStamps";

const Footer = () => {
  return (
    <div className="bg-primary flex flex-col">
      {/* top section */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {footerData.map((data, index) => (
          <div key={index} className="flex justify-center items-center p-4">
            <div className="flex justify-center items-center h-12 w-12 rounded-full border-gray-400 ">
              {/* <MdEmail className="h-6 w-6 text-gray-400 " /> */}
              {data.id === "Address" && (
                <FaLocationDot className="h-6 w-6 text-gray-400 " />
              )}
              {data.id === "Email" && (
                <MdEmail className="h-6 w-6 text-gray-400 " />
              )}
              {data.id === "Phone" && (
                <FaPhoneAlt className="h-6 w-6 text-gray-400 " />
              )}
            </div>
            <div className=" text-gray-400 pl-4">
              <h3 className="text-xs">{data.id}</h3>
              <h1 className="text-xl font-bold tracking-widest">
                {data.value}
              </h1>
            </div>
          </div>
        ))}
      </div>
      {/* botton section */}
      <div className="p-32 grid gap-x-2 gap-y-6 grid-cols-1 text-gray-400  md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h1 className="text-3xl font-bold">Common Apply</h1>
          <p className="py-10 pr-10 ">
            We are a team of talented professionals who are always ready to take
            the extra mile to help you achieve your dreams.
          </p>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Our Services</h1>
          <ul className="py-10 list-disc list-inside">
            <li>Home</li>
            <li>About</li>
            <li>Gallery</li>
            <li>Subscribe</li>
          </ul>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <div className="grid py-10 grid-cols-2 pr-12 justify-center items-center gap-4">
            <Image
              src="/assets/landing-page/teaching1.jpg"
              width={100}
              height={100}
              className="object-cover"
              alt="gallery"
            />
            <Image
              src="/assets/landing-page/teaching2.jpeg"
              width={100}
              height={100}
              className="object-cover"
              alt="gallery"
            />
            <Image
              src="/assets/landing-page/teaching3.jpg"
              width={100}
              height={100}
              className="object-cover"
              alt="gallery"
            />
            <Image
              src="/assets/landing-page/teaching4.avif"
              width={100}
              height={100}
              className="object-cover"
              alt="gallery"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Subscribe</h1>
          <div className="flex py-10 items-center mt-2">
            <div className="flex flex-col p-2 bg-white rounded-md w-fit">
              <input
                type="text"
                placeholder="Enter your email:"
                className="focus:outline-none"
              />
              <Link
                href="/subscribe"
                className=" py-3 bg-black px-2 text-center text-white flex w-full justify-center  mt-4 items-center rounded-md "
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-center py-3 text-gray-400">
          &copy; <TimeStamp /> Common Apply. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
