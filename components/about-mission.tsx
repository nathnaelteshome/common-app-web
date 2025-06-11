import Image from "next/image"

export function AboutMission() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/placeholder.svg?height=250&width=200&query=young woman student with tablet smiling"
                alt="Student with tablet"
                width={200}
                height={250}
                className="rounded-lg"
              />
              <Image
                src="/placeholder.svg?height=200&width=200&query=group of diverse students standing together"
                alt="Group of students"
                width={200}
                height={200}
                className="rounded-lg mt-8"
              />
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
              ABOUT US
            </div>

            <h2 className="text-4xl font-bold text-primary font-sora">Benefit From Our Online Application Form</h2>

            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary mb-2">OUR MISSION:</h3>
                <p className="text-gray-600 text-sm">
                  Suspendisse ultrice gravida dictum fusce placerat ultricies integer quis auctor elit sed vulputate mi
                  sit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">OUR VISION:</h3>
                <p className="text-gray-600 text-sm">
                  Suspendisse ultrice gravida dictum fusce placerat ultricies integer quis auctor elit sed vulputate mi
                  sit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
