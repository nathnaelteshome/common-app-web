import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Linkedin, Github, Twitter } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "ZUFAN ELIAS",
    role: "UI/UX Designer",
    image: "/images/zufe.jpg?height=400&width=400",
    bio: "Creative designer with 5+ years of experience in user-centered design and digital innovation.",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "NEBIYU DANIEL",
    role: "CEO And Fullstack Developer",
    image: "/images/neba.jpg?height=400&width=400",
    bio: "Visionary leader driving educational technology transformation across Ethiopia.",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "TAMERAT MISBA",
    role: "CEO And Back-End Developer",
    image: "/images/tame.jpg?height=400&width=400",
    bio: "Technical architect specializing in scalable systems and cloud infrastructure.",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "NATNAEL TESHOME",
    role: "Fullstack Developer",
    image: "/images/nati.jpg?height=400&width=400",
    bio: "Full-stack engineer passionate about creating seamless user experiences.",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "ABEL MULUBIRHAN",
    role: "Front-End Developer",
    image: "/images/abela.jpg?height=400&width=400",
    bio: "Frontend specialist crafting beautiful and responsive web applications.",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
  {
    name: "HAILEYESUS ABRHAM",
    role: "Back-End Developer",
    image: "/images/haile.jpg?height=400&width=400",
    bio: "Backend developer focused on robust APIs and database optimization.",
    social: { linkedin: "#", twitter: "#", github: "#" },
  },
];

export function TeamSection() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-32 left-16 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary px-6 py-3 rounded-full text-sm font-semibold shadow-sm border border-primary/10 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
            OUR AMAZING TEAM
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight mb-6">
            Meet Our Expert Team
          </h2>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Our diverse team of passionate professionals is dedicated to
            revolutionizing education access in Ethiopia. With combined
            expertise in technology, design, and education, we're building the
            future of university applications.
          </p>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                50+
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                Years Combined Experience
              </div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                15+
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                Projects Delivered
              </div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                24/7
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                Support Available
              </div>
            </div>
          </div>
        </div>

        {/* Team Grid - Fixed Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden h-full"
            >
              <div className="relative overflow-hidden">
                {/* Team member image */}
                <div className="relative w-full h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Social media buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <Button
                    size="icon"
                    className="bg-white/90 hover:bg-primary text-primary hover:text-white shadow-lg w-9 h-9 rounded-full backdrop-blur-sm transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-white/90 hover:bg-primary text-primary hover:text-white shadow-lg w-9 h-9 rounded-full backdrop-blur-sm transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="bg-white/90 hover:bg-primary text-primary hover:text-white shadow-lg w-9 h-9 rounded-full backdrop-blur-sm transition-all duration-300"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50/50 flex-1">
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800 group-hover:text-primary transition-colors duration-300 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-3 bg-primary/10 px-3 py-1 rounded-full inline-block">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 font-medium">
                        Available
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Contact Our Team
            <ArrowRight className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
