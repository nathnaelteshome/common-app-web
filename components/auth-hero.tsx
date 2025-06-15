interface AuthHeroProps {
  title: string
  breadcrumb: string
}

export function AuthHero({ title, breadcrumb }: AuthHeroProps) {
  return (
    <div className="bg-primary text-white py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-4 left-8">
        <div className="w-8 h-8 grid grid-cols-2 gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-8 right-8">
        <div className="w-12 h-12 border-4 border-purple-400 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
        </div>
      </div>

      <div className="absolute bottom-8 left-16">
        <svg width="60" height="20" viewBox="0 0 60 20" className="text-blue-400">
          <path d="M0 10 Q15 0 30 10 T60 10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M0 15 Q15 5 30 15 T60 15" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="absolute bottom-4 right-16">
        <div className="w-8 h-8 border-2 border-orange-500 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="text-lg opacity-90">{breadcrumb}</p>
      </div>
    </div>
  )
}
