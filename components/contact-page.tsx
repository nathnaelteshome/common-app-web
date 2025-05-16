'use client';

import type React from 'react';

import { useState } from 'react';
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    newsletter: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-center text-3xl font-bold text-blue-600 mb-16">
        Lets Build Your Streaming Empire.
      </h1>

      <div className="relative flex flex-col md:flex-row overflow-hidden">
        {/* Left side - Contact Form */}
        <div className="bg-[#121d42] text-white p-8 md:p-12 w-full md:w-[55%] z-10">
          <h2 className="text-4xl font-bold mb-10">
            Contact <span className="text-blue-500">us</span>
          </h2>

          <form className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.newsletter}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    newsletter: e.target.checked,
                  }))
                }
                className="h-4 w-4 border border-gray-500 bg-transparent appearance-none checked:bg-blue-500 checked:border-blue-500 focus:outline-none focus:ring-0 transition-colors cursor-pointer"
              />
              <label
                htmlFor="newsletter"
                className="text-sm text-gray-300 cursor-pointer"
              >
                I would like to receive the newsletter
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="bg-white text-[#121d42] px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-100 transition-colors"
              >
                <span>Read More</span>
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </form>
        </div>

        {/* Right side - Contact Info */}
        <div className="bg-white w-full md:w-[45%] relative">
          {/* Blue diagonal section */}
          <div className="absolute top-0 left-0 h-full w-full bg-[#0066cc] skew-x-[-12deg] origin-top-right transform translate-x-[-35%] z-0"></div>

          <div className="relative z-10 p-8 md:p-12 h-full">
            {/* "or" divider */}
            <div className="absolute left-0 top-12 transform -translate-x-1/2">
              <div className="bg-black text-white px-4 py-1 rounded-md text-sm">
                or
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <p className="text-sm text-white md:max-w-xs">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                vulputate libero et velit interdum, ac aliquet odio mattis.
              </p>

              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-[150px] relative">
                  <Image
                    src="/assets/contact-page/map.png"
                    alt="Map location"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 text-xs text-gray-700">
                  <p className="font-semibold">Company name</p>
                  <p>123 Main St</p>
                  <p>NY 10001</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[#121d42]">
                  <MapPin size={18} className="text-[#0066cc]" />
                  <span>A.A. Ethiopia</span>
                </div>

                <div className="flex items-center space-x-3 text-[#121d42]">
                  <Phone size={18} className="text-[#0066cc]" />
                  <span>+251931102110</span>
                </div>

                <div className="flex items-center space-x-3 text-[#121d42]">
                  <Mail size={18} className="text-[#0066cc]" />
                  <span>somebody@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="mt-12 flex space-x-4 justify-end">
              <Link href="https://www.facebook.com">
                <FaFacebookF style={{ color: '#17254E' }} />
              </Link>

              <Link href="https://www.instagram.com/">
                <FaInstagram style={{ color: '#17254E' }} />
              </Link>

              <Link href="https://www.linkedin.com">
                <FaLinkedin style={{ color: '#17254E' }} />
              </Link>

              <Link href="https://www.youtube.com">
                <FaYoutube style={{ color: '#17254E' }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
