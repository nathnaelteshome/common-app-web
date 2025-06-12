import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/placeholder.svg?height=200&width=200&query=graduation ceremony with students throwing caps"
                alt="Graduation"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <Image
                src="/placeholder.svg?height=200&width=200&query=historic university building with tower"
                alt="University building"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <Image
                src="/placeholder.svg?height=200&width=200&query=students walking on university campus"
                alt="Campus life"
                width={200}
                height={200}
                className="rounded-lg"
              />
              <Image
                src="/placeholder.svg?height=200&width=200&query=university laboratory with students"
                alt="Laboratory"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white font-bold text-center">
                <div>
                  <div className="text-2xl">8+</div>
                  <div className="text-xs">
                    Years Of
                    <br />
                    Experiences
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
              OUR ABOUT US
            </div>

            <h2 className="text-4xl font-bold text-primary font-sora">
              Learn & Grow Your{" "}
              <span className="relative">
                Skills<span className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-200 -z-10"></span>
              </span>{" "}
              With The Amazing Colleges
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">FLEXIBLE ENVIRONMENT</h3>
                <p className="text-gray-600 text-sm">
                  Suspendisse ultrice gravida dictum fusce placerat ultricies integer quis auctor elit sed vulputate mi
                  sit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">EXCELLENT INSTRUCTORS</h3>
                <p className="text-gray-600 text-sm">
                  Suspendisse ultrice gravida dictum fusce placerat ultricies integer quis auctor elit sed vulputate mi
                  sit.
                </p>
              </div>
            </div>

            <Button className="bg-primary hover:bg-primary/90">
              Load More
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
