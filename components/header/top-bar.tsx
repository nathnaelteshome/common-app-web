import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

/**
 * TopBar component displays contact information and social media links
 * Only shown for students and non-authenticated users
 */
export function TopBar() {
  return (
    <div className="bg-[#17254e] text-white py-2 px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between text-sm">
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          {/* Contact Information */}
          <div className="flex items-center gap-1 md:gap-2">
            <Phone className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm">(+251) 911221122</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Mail className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm hidden sm:inline">commonapply@gmail.com</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <MapPin className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm hidden md:inline">Addis Ababa, Ethiopia</span>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex items-center gap-2">
          <Facebook className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:opacity-80" />
          <Instagram className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:opacity-80" />
          <Linkedin className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:opacity-80" />
          <Youtube className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:opacity-80" />
        </div>
      </div>
    </div>
  )
}
