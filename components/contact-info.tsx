import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import { contactInfo } from "@/data/contact-data"

export function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Map */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="h-64 bg-gray-200 relative">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.6176!2d${contactInfo.coordinates.lng}!3d${contactInfo.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDEnMDcuMSJOIDM4wrA0NScwOS4wIkU!5e0!3m2!1sen!2set!4v1234567890`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="CommonApply Location"
          />
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-semibold text-gray-800">{contactInfo.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold text-gray-800">{contactInfo.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">{contactInfo.email}</p>
          </div>
        </div>

        {/* Social Media */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Follow Us</p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
              <Facebook className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
              <Twitter className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
              <Youtube className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
