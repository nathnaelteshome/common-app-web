import { Header } from "@/components/header"
import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { ContactFAQ } from "@/components/contact-faq"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <ContactHero />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-sora">
              Let's Build Your Streaming Empire.
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <ContactForm />
            <ContactInfo />
          </div>
          <ContactFAQ />
        </div>
      </div>
      <Footer />
    </div>
  )
}
