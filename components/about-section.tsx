import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Target, Eye, Heart, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function AboutSection() {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in everything we do, ensuring the highest quality service for our users.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description:
        "We believe in complete transparency throughout the application process, keeping students informed at every step.",
    },
    {
      icon: Heart,
      title: "Accessibility",
      description:
        "Making higher education accessible to all Ethiopian students, regardless of their background or location.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Continuously innovating to improve the university application experience through technology.",
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary px-6 py-3 rounded-full text-sm font-semibold shadow-sm border border-primary/10">
                <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
                ABOUT COMMONAPPLY
              </div>

              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Democratizing Access to Higher Education in Ethiopia
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed">
                CommonApply is revolutionizing how Ethiopian students access higher education opportunities. Our
                comprehensive digital platform streamlines the university application process, making it easier, faster,
                and more transparent for students across the country.
              </p>

              <p className="text-base text-gray-600 leading-relaxed">
                Founded with the vision of bridging the gap between talented students and quality education, we've
                helped thousands of students navigate their path to university admission. Our platform connects students
                with over 200 universities and educational institutions across Ethiopia.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-sm text-gray-600 font-medium">Students Served</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-gray-600 font-medium">Partner Universities</div>
              </div>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/about">
                Learn More About Us
                <ArrowRight className="ml-3 w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://i.pinimg.com/736x/60/47/9d/60479d0bb52baeac1c59dc4c4bfdbbe2.jpg"
                alt="Ethiopian university campus"
                width={600}
                height={500}
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800">Our Core Values</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These fundamental principles guide everything we do and shape our commitment to Ethiopian students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-500 transform hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
