import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, ArrowRight } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary via-primary to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;7&quot; cy=&quot;7&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Contact Info Bar */}
      <div className="border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Our Location</p>
                <p className="font-semibold text-lg">Addis Ababa, Ethiopia</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Call Us</p>
                <p className="font-semibold text-lg">(+251) 911-221-122</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Email Us</p>
                <p className="font-semibold text-lg">hello@commonapply.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-1">
            <div>
              <h3 className="text-3xl font-bold font-sora mb-4">CommonApply</h3>
              <p className="text-blue-200 leading-relaxed text-base">
                Empowering Ethiopian students to access higher education opportunities through our innovative digital
                platform. Connecting dreams with universities across Ethiopia.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-white/10 text-white hover:text-white rounded-full w-10 h-10"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-white/10 text-white hover:text-white rounded-full w-10 h-10"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-white/10 text-white hover:text-white rounded-full w-10 h-10"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-white/10 text-white hover:text-white rounded-full w-10 h-10"
              >
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Find Universities", href: "/colleges" },
                { name: "About Us", href: "/about" },
                { name: "How It Works", href: "/about#how-it-works" },
                { name: "Success Stories", href: "/blog" },
                { name: "Contact Support", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Our Services</h4>
            <ul className="space-y-3">
              {[
                "University Application Management",
                "Document Verification",
                "Application Status Tracking",
                "Payment Processing",
                "Academic Counseling",
              ].map((service) => (
                <li
                  key={service}
                  className="text-blue-200 hover:text-white cursor-pointer transition-colors duration-300 flex items-center group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">Stay Updated</h4>
            <p className="text-blue-200 text-sm">
              Subscribe to our newsletter for the latest updates on university admissions and educational opportunities.
            </p>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-white/40 focus:bg-white/15 rounded-xl"
              />
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold rounded-xl py-3 transition-all duration-300 transform hover:scale-105">
                Subscribe Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-blue-200 text-sm text-center md:text-left">
              Copyright © 2025 <span className="text-white font-semibold">CommonApply</span>. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-blue-200 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-blue-200 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-blue-200 hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
