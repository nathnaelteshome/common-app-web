"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
const NotFoundPage = () => {
  return (
    <>
      {/* Main Content */}
      <main className="flex-grow">
        {/* 404 Content */}
        <div className="container mx-auto py-20 px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111d42] mb-4">
                SORRY, PAGE NOT FOUND!
              </h2>
              <p className="text-gray-600 mb-6">
                It looks like the page you&apos;re looking for doesn&apos;t
                exist. Please check the URL or return to the homepage.
              </p>
              <Link
                href={"/#"}
                className="inline-flex items-center bg-[#111d42] text-white px-6 py-3 rounded-md hover:bg-[#1a2a5e] transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back To Home
              </Link>
            </div>
            <div className="flex justify-center">
              <Image
                src="/assets/notfound-page/not-found.png"
                alt="404 Error Illustration"
                width={500}
                height={400}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
