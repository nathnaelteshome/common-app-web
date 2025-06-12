import { Header } from "@/components/header"
import { AboutHero } from "@/components/about-hero"
import { AboutMission } from "@/components/about-mission"
import { AboutTeam } from "@/components/about-team"
import { AboutBlog } from "@/components/about-blog"
import { AboutBenefits } from "@/components/about-benefits"
import { AboutTestimonials } from "@/components/about-testimonials"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AboutHero />
      <AboutMission />
      <AboutTeam />
      <AboutBlog />
      <AboutBenefits />
      <AboutTestimonials />
      <Footer />
    </div>
  )
}
