import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Shield, Users, ArrowRight, Zap, Heart, Target } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Applications",
    description:
      "Complete your university applications in minutes, not hours. Our streamlined process eliminates paperwork and reduces application time by 85%.",
    color: "text-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
    borderColor: "border-yellow-200",
  },
  // {
  //   icon: Target,
  //   title: "Smart Matching System",
  //   description:
  //     "Our AI-powered algorithm matches you with universities that align with your academic profile, interests, and career goals for better admission chances.",
  //   color: "text-blue-600",
  //   bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
  //   borderColor: "border-blue-200",
  // },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description:
      "Your personal and academic data is protected with enterprise-grade encryption and security measures trusted by leading financial institutions.",
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
  },
  {
    icon: Heart,
    title: "Dedicated Support Team",
    description:
      "Get personalized guidance from our team of education counselors and admission experts who understand the Ethiopian education system.",
    color: "text-red-600",
    bgColor: "bg-gradient-to-br from-red-50 to-pink-50",
    borderColor: "border-red-200",
  },
]

const benefits = [
  "Apply to multiple universities with one application",
  "Real-time application status tracking",
  "Scholarship and financial aid matching",
  "24/7 customer support in Amharic and English",
  "Mobile-friendly platform for applications on-the-go",
  "Direct communication with university admission offices",
]

export function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Users className="w-4 h-4" />
            WHY STUDENTS CHOOSE US
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sora">
            Your Gateway to{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of Ethiopian students who have successfully secured admission to their dream universities
            through our innovative platform.
          </p>
        </div>

        <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group hover:shadow-2xl transition-all duration-500 border-2 ${feature.borderColor} ${feature.bgColor} hover:-translate-y-2`}
            >
              <CardContent className="p-8 text-center h-full flex flex-col">
                <div className="mb-6">
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed flex-grow">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Everything You Need for University Success</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">15,000+</div>
                  <div className="text-gray-600 mb-4">Successful Applications</div>
                  <div className="text-2xl font-bold text-green-600 mb-2">92%</div>
                  <div className="text-gray-600 mb-4">Admission Success Rate</div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">48hrs</div>
                  <div className="text-gray-600">Average Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-12 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
            asChild
          >
            <Link href="/auth/create-account">
              Start Your Journey Today
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
          <p className="text-gray-500 mt-4">Join 50,000+ students who trust CommonApply</p>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
    </section>
  )
}
