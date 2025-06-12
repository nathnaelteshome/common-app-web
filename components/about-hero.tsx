export function AboutHero() {
  return (
    <section className="bg-primary py-16 px-4 relative overflow-hidden">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white font-sora">ABOUT US</h1>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-16 h-16 opacity-20">
        <div className="grid grid-cols-2 gap-1">
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-32 right-32 w-20 h-20 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-300">
          <path d="M10 50 Q 50 10, 90 50 Q 50 90, 10 50" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-20 w-12 h-12 bg-orange-400 rounded-full opacity-20"></div>

      <div className="absolute top-16 right-16 text-purple-300 opacity-30">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
          <path d="M20 4l4 12h12l-10 8 4 12-10-8-10 8 4-12-10-8h12z" />
        </svg>
      </div>
    </section>
  )
}
