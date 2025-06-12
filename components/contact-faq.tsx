"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { getFAQCategories, getFAQsByCategory } from "@/data/contact-data"

export function ContactFAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string>("General")
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  const categories = getFAQCategories()
  const filteredFAQs = getFAQsByCategory(selectedCategory)

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId)
  }

  return (
    <section className="mt-16">
      <div className="text-center mb-12">
        <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          FAQ
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-primary font-sora">Frequently Asked Questions</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Find answers to common questions about contacting CommonApply and our services.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-primary hover:bg-primary/90 text-white"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} className="overflow-hidden">
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleFAQ(faq.id)}>
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="text-gray-800">{faq.question}</span>
                {openFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-primary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary" />
                )}
              </CardTitle>
            </CardHeader>
            {openFAQ === faq.id && (
              <CardContent className="pt-0">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="text-center mt-12">
        <Card className="bg-primary text-white max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-blue-100 mb-6">
              Can't find the answer you're looking for? Our team is here to help you with any questions or concerns.
            </p>
            <Button className="bg-white text-primary hover:bg-gray-100">Contact Us Directly</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
