import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Contact Info Bar */}
      <div className="border-b border-blue-600">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Address:</p>
                <p className="font-semibold">Addis Ababa</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Phone:</p>
                <p className="font-semibold">(+251) 911221122</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Email:</p>
                <p className="font-semibold">commonapply@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-sora">CommonApply</h3>
            <p className="text-blue-200 leading-relaxed">
              Interdum velit laoreet id donec ultrices tincidunt arcu. Tincidunt tortor aliqua mfacilisi cras fermentum
              odio eu.
            </p>
            <div className="flex items-center gap-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-300" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-blue-300" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-blue-300" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-blue-300" />
            </div>
          </div>

          {/* Our Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services:</h4>
            <ul className="space-y-2 text-blue-200">
              <li className="hover:text-white cursor-pointer">Student Registration</li>
              <li className="hover:text-white cursor-pointer">University Registration</li>
              <li className="hover:text-white cursor-pointer">Provide ID</li>
              <li className="hover:text-white cursor-pointer">Manage Student Information</li>
              <li className="hover:text-white cursor-pointer">News</li>
            </ul>
          </div>

          {/* Gallery */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Gallery</h4>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <Image
                  key={i}
                  src={`/placeholder.svg?height=60&width=60&query=university campus photo ${i + 1}`}
                  alt={`Gallery ${i + 1}`}
                  width={60}
                  height={60}
                  className="rounded object-cover"
                />
              ))}
            </div>
          </div>

          {/* Subscribe */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Subscribe</h4>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email:"
                className="bg-blue-800 border-blue-600 text-white placeholder:text-blue-300"
              />
              <Button className="w-full bg-primary hover:bg-primary/90">SUBSCRIBE NOW</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-blue-600 py-6">
        <div className="container mx-auto px-4 text-center text-blue-200">
          <p>
            Copyright © 2024 <span className="text-white font-semibold">CommApply</span> || All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
