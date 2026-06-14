import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Use IntersectionObserver on the hero section instead of scroll listener
    const hero = document.getElementById('hero')
    if (!hero) return
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const navLinks = ['Work', 'About', 'Process', 'Contact']

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-8 px-6 py-3 rounded-full transition-all duration-500 ${
          scrolled
            ? 'bg-primary/70 backdrop-blur-xl border border-accent/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-black/5 backdrop-blur-sm border border-black/10'
        }`}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-sans font-bold text-accent text-sm tracking-tight whitespace-nowrap link-lift"
        >
          Abeer
        </button>

        {/* Links */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className={`font-sans text-sm link-lift transition-colors duration-200 ${
                scrolled ? 'text-white/70 hover:text-white' : 'text-black/60 hover:text-black'
              }`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => scrollTo('Contact')}
          className="btn-magnetic bg-accent text-primary font-sans font-700 text-sm px-5 py-2 rounded-full font-semibold"
        >
          <span className="btn-fill bg-white/20 rounded-full" />
          <span className="relative z-10">Start a Project</span>
        </button>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 flex md:hidden items-center justify-between px-5 py-3 rounded-full bg-primary/80 backdrop-blur-xl border border-white/10">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-sans font-bold text-accent text-sm"
        >
          Abeer
        </button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-[5px] p-1"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-primary/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <button
            key={link}
            onClick={() => scrollTo(link)}
            className="font-sans font-bold text-3xl text-white hover:text-accent transition-colors duration-200"
          >
            {link}
          </button>
        ))}
        <button
          onClick={() => scrollTo('Contact')}
          className="mt-4 bg-accent text-primary font-sans font-semibold text-base px-8 py-3 rounded-full"
        >
          Start a Project
        </button>
      </div>
    </>
  )
}
