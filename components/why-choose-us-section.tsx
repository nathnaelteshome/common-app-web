import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, BookOpen, Star, GraduationCap } from "lucide-react"
import Image from "next/image"

const features = [
  {
    title: "World ClassName Colleges",
    description: "Gravida dictum fusce placerat ultricies integer",
    icon: GraduationCap,
  },
  {
    title: "Easy Learning",
    description: "Gravida dictum fusce placerat ultricies integer",
    icon: BookOpen,
  },
  {
    title: "Flexible",
    description: "Gravida dictum fusce placerat ultricies integer",
    icon: CheckCircle,
  },
  {
    title: "Affordable Price",
    description: "Gravida dictum fusce placerat ultricies integer",
    icon: Star,
  },
]

const stats = [
  { number: "3K+", label: "Successfully Trained", icon: GraduationCap },
  { number: "15K+", label: "Classes Completed", icon: BookOpen },
  { number: "97K+", label: "Satisfaction Rate", icon: Star },
  { number: "102K+", label: "Students Community", icon: Users },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-16 px-4 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                WHY CHOOSE US
              </div>
              <h2 className="text-4xl font-bold text-primary mb-6 font-sora">
                Creating A Community Of Life Long Learners.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-purple-50 border-purple-100">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <Image
              src="/placeholder.svg?height=400&width=600&query=students studying in modern library with computers"
              alt="Students learning"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <Card className="bg-primary text-white">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.number}</div>
                    <div className="text-blue-100 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
    </section>
  )
}
