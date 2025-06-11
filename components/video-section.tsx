import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

export function VideoSection() {
  return (
    <section className="py-16 px-4 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-black/50"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/placeholder.svg?height=600&width=1200&query=group of diverse students smiling together')",
        }}
      ></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center text-white space-y-8">
          <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
            Join Our How To Videos
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold font-sora">How To Enroll?</h2>

          <p className="text-xl text-blue-100">watch the video</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-primary">
              Watch The Video
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <div className="flex items-center gap-4">
              <Button size="icon" className="w-16 h-16 rounded-full bg-primary text-white hover:bg-primary/90">
                <Play className="w-6 h-6" />
              </Button>
              <span className="text-white">watch now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-20 h-20 border-2 border-white/20 rounded-full"></div>
      <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/20 rounded-full"></div>
    </section>
  )
}
