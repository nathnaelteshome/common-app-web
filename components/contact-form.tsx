"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, User, Mail, MessageSquare, HelpCircle } from "lucide-react"

const inquiryTypes = [
  { value: "application", label: "Application Support" },
  { value: "technical", label: "Technical Issues" },
  { value: "university", label: "University Information" },
  { value: "scholarship", label: "Scholarship Inquiries" },
  { value: "general", label: "General Questions" },
  { value: "partnership", label: "University Partnership" },
]

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        inquiryType: "",
        subject: "",
        message: "",
      })
    }, 3000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
          <p className="text-green-700 mb-4">
            Thank you for contacting CommonApply. Our team will review your message and respond within 24 hours.
          </p>
          <p className="text-sm text-green-600">For urgent matters, please call us at +251-11-123-4567</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="w-6 h-6" />
          Send Us a Message
        </CardTitle>
        <p className="text-blue-100">Have questions? We're here to help you succeed in your educational journey.</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="border-2 border-gray-200 focus:border-primary transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="border-2 border-gray-200 focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+251-9XX-XXX-XXX"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="border-2 border-gray-200 focus:border-primary transition-colors duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquiryType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Inquiry Type *
              </Label>
              <Select value={formData.inquiryType} onValueChange={(value) => handleChange("inquiryType", value)}>
                <SelectTrigger className="border-2 border-gray-200 focus:border-primary">
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  {inquiryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">
              Subject *
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="Brief description of your inquiry"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              required
              className="border-2 border-gray-200 focus:border-primary transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
              Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Please provide detailed information about your inquiry. Include any relevant details such as university preferences, program interests, or specific issues you're experiencing."
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              required
              rows={6}
              className="border-2 border-gray-200 focus:border-primary transition-colors duration-200 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                Sending Message...
              </>
            ) : (
              <>
                Send Message
                <Send className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </Button>

          <p className="text-sm text-gray-500 text-center">
            By submitting this form, you agree to our{" "}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
