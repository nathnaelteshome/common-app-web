import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-8 md:py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium">
              WELCOME TO COMMON APPLY
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-primary leading-tight font-sora">
              Achieving Your Dreams Through Education
            </h1>

            <p className="text-gray-600 text-base md:text-lg">
              You are at the right place
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 text-base md:text-lg w-full sm:w-auto">
                Start Your Application Now!
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
              </Button>

              {/* Decorative arrow - hidden on mobile */}
              <div className="hidden xl:block">
                <svg
                  width="120"
                  height="60"
                  viewBox="0 0 120 60"
                  className="text-blue-400"
                >
                  <path
                    d="M10 30 Q 60 10, 110 30"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                  <path
                    d="M105 25 L110 30 L105 35"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 md:pt-8 justify-center lg:justify-start">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-400 border-2 border-white"></div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-400 border-2 border-white"></div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-400 border-2 border-white"></div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-white text-xs md:text-sm font-bold">
                    +
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm md:text-base">
                  200+ Students
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <Image
              src="/assets/hero-sec.jpg"
              alt="Graduation ceremony"
              width={500}
              height={400}
              className="rounded-lg shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-10 md:top-20 right-10 md:right-20 w-16 h-16 md:w-20 md:h-20 bg-blue-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-12 h-12 md:w-16 md:h-16 bg-purple-200 rounded-full opacity-20"></div>
    </section>
  );
}
