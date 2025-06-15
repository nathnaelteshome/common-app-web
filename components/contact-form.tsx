"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowRight, Send } from "lucide-react"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
  newsletter: boolean
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    newsletter: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after successful submission
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        newsletter: false,
      })
      setIsSubmitted(false)
    }, 3000)
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-primary rounded-lg p-8 text-white text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Message Sent Successfully!</h3>
        <p className="text-blue-100">Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
      </div>
    )
  }

  return (
    <div className="bg-primary rounded-lg p-8">
      <h3 className="text-2xl font-bold text-white mb-6">
        Contact <span className="text-blue-300">Us</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="bg-transparent border-b border-white/30 border-t-0 border-l-0 border-r-0 rounded-none text-white placeholder:text-white/70 focus:border-white"
          />
          {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="bg-transparent border-b border-white/30 border-t-0 border-l-0 border-r-0 rounded-none text-white placeholder:text-white/70 focus:border-white"
          />
          {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            className="bg-transparent border-b border-white/30 border-t-0 border-l-0 border-r-0 rounded-none text-white placeholder:text-white/70 focus:border-white"
          />
          {errors.subject && <p className="text-red-300 text-sm mt-1">{errors.subject}</p>}
        </div>

        <div>
          <Textarea
            placeholder="Message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            rows={4}
            className="bg-transparent border-b border-white/30 border-t-0 border-l-0 border-r-0 rounded-none text-white placeholder:text-white/70 focus:border-white resize-none"
          />
          {errors.message && <p className="text-red-300 text-sm mt-1">{errors.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletter"
            checked={formData.newsletter}
            onCheckedChange={(checked) => handleInputChange("newsletter", checked as boolean)}
            className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-primary"
          />
          <Label htmlFor="newsletter" className="text-white/90 text-sm">
            I would like to receive the newsletter.
          </Label>
        </div>

        <Button type="submit" disabled={isSubmitting} className="bg-white text-primary hover:bg-gray-100 font-semibold">
          {isSubmitting ? "Sending..." : "Send Message"}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}
