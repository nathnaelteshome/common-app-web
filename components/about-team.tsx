import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ArrowRight } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "ZUFAN ELIAS",
    role: "UI/UX Designer",
    image:
      "/placeholder.svg?height=300&width=300&query=professional woman with dark hair smiling",
  },
  {
    name: "NEBIYU DANIEL",
    role: "CEO And Fullstack Developer",
    image:
      "/placeholder.svg?height=300&width=300&query=professional man with beard smiling",
  },
  {
    name: "TAMERAT MISBA",
    role: "CTO And Back-End Developer",
    image:
      "/placeholder.svg?height=300&width=300&query=professional man in green shirt smiling",
  },
  {
    name: "NATNEAL TESHOME",
    role: "Fullstack Developer",
    image:
      "/placeholder.svg?height=300&width=300&query=professional man with glasses smiling",
  },
  {
    name: "ABEL MULUBIRHAN",
    role: "Front-End Developer",
    image:
      "/placeholder.svg?height=300&width=300&query=professional man in suit smiling",
  },
  {
    name: "HAILEYESUS ABRHAM",
    role: "Back-End Developer",
    image:
      "/placeholder.svg?height=300&width=300&query=professional man with curly hair smiling",
  },
];

export function AboutTeam() {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
              OUR TEAM
            </div>

            <h2 className="text-4xl font-bold text-primary font-sora">
              Meet Our Expert Team
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <Button className="bg-primary hover:bg-primary/90 text-white">
              Contact Us
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  <Button
                    size="icon"
                    className="absolute top-4 right-4 bg-primary hover:bg-primary/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-4 bg-white">
                  <h3 className="font-bold text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{member.role}</p>
                  <ArrowRight className="w-4 h-4 text-primary mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
