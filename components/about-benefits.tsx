import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, BookOpen, Star, GraduationCap, Globe, Award, TrendingUp } from "lucide-react"
import Image from "next/image"

const features = [
  {
    title: "World-Class Universities",
    description:
      "Access to Ethiopia's top-ranked universities and emerging institutions with international recognition and accreditation.",
    icon: GraduationCap,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Streamlined Process",
    description:
      "Apply to multiple universities with a single application, saving time and reducing complexity in your admission journey.",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Expert Guidance",
    description:
      "Get personalized support from education counselors who understand the Ethiopian higher education landscape.",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Scholarship Opportunities",
    description:
      "Discover and apply for scholarships, grants, and financial aid programs to make education more affordable.",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
]

const stats = [
  { number: "50K+", label: "Students Successfully Enrolled", icon: GraduationCap, color: "text-blue-600" },
  { number: "200+", label: "Partner Universities", icon: BookOpen, color: "text-green-600" },
  { number: "92%", label: "Admission Success Rate", icon: TrendingUp, color: "text-purple-600" },
  { number: "15+", label: "Regions Covered", icon: Globe, color: "text-orange-600" },
]

export function AboutBenefits() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                <Award className="w-4 h-4" />
                WHY CHOOSE COMMONAPPLY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-sora leading-tight">
                Building a Community of{" "}
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Lifelong Learners
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're more than just an application platform. CommonApply is a comprehensive ecosystem designed to
                support Ethiopian students throughout their educational journey, from application to graduation and
                beyond.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-primary/20 ${feature.bgColor} hover:-translate-y-1`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 border border-gray-200`}
                      >
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <Image
              src="/placeholder.svg?height=500&width=700"
              alt="Students learning in modern environment"
              width={700}
              height={500}
              className="rounded-2xl shadow-2xl w-full h-auto"
            />

            {/* Floating stats card */}
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">98%</div>
                <div className="text-sm text-gray-600 font-medium">Student Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-4">Our Impact in Numbers</h3>
                <p className="text-blue-100 text-lg">Transforming lives through education across Ethiopia</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-blue-100 text-sm font-medium leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
    </section>
  )
}
