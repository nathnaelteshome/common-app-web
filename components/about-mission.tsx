import Image from "next/image"
import { Target, Eye, Heart, Users } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To democratize access to higher education in Ethiopia by providing a seamless, transparent, and efficient university application platform that connects every student with their ideal academic opportunity.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become the leading educational technology platform in East Africa, empowering millions of students to achieve their academic dreams and contribute to their communities' development.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "We believe in equality, innovation, transparency, and excellence. Every student deserves access to quality education regardless of their background, location, or economic status.",
  },
  {
    icon: Users,
    title: "Our Impact",
    description:
      "Since 2025, we've helped over 50,000 Ethiopian students secure admission to universities, with 92% of our users successfully enrolling in their preferred programs.",
  },
]

export function AboutMission() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <Image
                  src="https://i.pinimg.com/736x/94/29/c5/9429c5627be4896999132398e29f001e.jpg"
                  alt="Student with tablet"
                  width={240}
                  height={280}
                  className="rounded-2xl shadow-lg w-full"
                />
                <Image
                  src="https://i.pinimg.com/736x/e6/02/e2/e602e2f5d241030f33f8e34bb075f176.jpg"
                  alt="Graduation ceremony"
                  width={240}
                  height={200}
                  className="rounded-2xl shadow-lg w-full"
                />
              </div>
              <div className="space-y-6 mt-8">
                <Image
                  src="https://i.pinimg.com/736x/75/b6/02/75b60209d12ba9453cb3e5b548fb9d30.jpg"
                  alt="Group of students"
                  width={240}
                  height={200}
                  className="rounded-2xl shadow-lg w-full"
                />
                <Image
                  src="https://i.pinimg.com/736x/a6/c1/58/a6c158f11a8a242af2cc370c460967d4.jpg"
                  alt="University building"
                  width={240}
                  height={280}
                  className="rounded-2xl shadow-lg w-full"
                />
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-center shadow-2xl">
                <div>
                  <div className="text-2xl font-bold">8+</div>
                  <div className="text-xs leading-tight">
                    Years of
                    <br />
                    Excellence
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                <Heart className="w-4 h-4" />
                OUR STORY
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-sora leading-tight">
                Empowering Ethiopian Students Through{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Innovation
                </span>
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2025 by a team of Ethiopian educators and technology experts, CommonApply was born from a
                simple yet powerful vision: every Ethiopian student should have equal access to quality higher education
                opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="group">
                  <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
