"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Search, Users, GraduationCap, Award, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/colleges?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

        {/* Floating Elements */}
        <div className="absolute top-32 right-20 animate-float">
          <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-32 left-20 animate-float delay-500">
          <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
            <Award className="w-10 h-10 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary px-6 py-3 rounded-full text-sm font-semibold shadow-sm border border-primary/10">
              <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
              #1 University Application Platform in Ethiopia
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Your Gateway to
                </span>
                <br />
                <span className="text-gray-800">Ethiopian Universities</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Streamline your university application process with our comprehensive platform. Apply to multiple
                universities, track your progress, and secure your future in higher education.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search universities, programs, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-base rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-0 bg-white/80 backdrop-blur-sm"
                />
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Search
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/auth/create-account">
                  Start Your Application
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/colleges">Browse Universities</Link>
              </Button>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-gray-600">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">200+</div>
                <div className="text-sm text-gray-600">Partner Universities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">92%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Ethiopian students celebrating graduation"
                width={600}
                height={600}
                className="w-full h-auto rounded-3xl shadow-2xl"
                priority
              />

              {/* Floating Success Cards */}
              <div className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="font-semibold text-gray-800">Application Approved!</div>
                    <div className="text-sm text-gray-600">Addis Ababa University</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float delay-700">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="font-semibold text-gray-800">1,247 Students</div>
                    <div className="text-sm text-gray-600">Applied This Month</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
