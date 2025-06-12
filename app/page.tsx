import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { CollegesSection } from "@/components/colleges-section"
import { AboutSection } from "@/components/about-section"
import { VideoSection } from "@/components/video-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TeamSection } from "@/components/team-section"
import { BlogSection } from "@/components/blog-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoriesSection />
      <CollegesSection />
      <AboutSection />
      <VideoSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <TeamSection />
      <BlogSection />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
