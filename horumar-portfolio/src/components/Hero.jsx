import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero() {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })

      tl.from('.hero-topbar', {
        y: -12,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        .from(
          '.hero-wordmark',
          {
            y: 32,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .from(
          '.hero-script',
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          '.hero-bottombar span',
          {
            y: 8,
            opacity: 0,
            stagger: 0.07,
            duration: 0.5,
            ease: 'power3.out',
          },
          '-=0.4'
        )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const today = new Date()
  const dateLabel = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: '#EBEBEB' }}
    >
      {/* Top bar */}
      <div className="hero-topbar absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 pt-6 z-10">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">
          Creative Portfolio
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">
          <span>{dateLabel}</span>
          <span className="text-base leading-none">→</span>
        </div>
      </div>

      {/* Center: giant PORTFOLIO wordmark */}
      <div className="relative px-4 md:px-8 select-none">
        <h1
          className="hero-wordmark font-sans font-black text-black leading-none uppercase w-full text-center tracking-tighter"
          style={{ fontSize: 'clamp(13vw, 16vw, 18vw)', letterSpacing: '-0.03em' }}
        >
          portfolio
        </h1>

        {/* Cursive name overlay — centered over the word */}
        <div
          className="hero-script absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <span
            className="font-script text-accent leading-none"
            style={{
              fontSize: 'clamp(3rem, 7vw, 8rem)',
              marginTop: '0.15em',
              textShadow: '0 2px 24px rgba(201,168,76,0.18)',
            }}
          >
            Abeer Abdallah Jama
          </span>
        </div>
      </div>

      {/* Bottom contact bar */}
      <div className="hero-bottombar absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 pb-6 z-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35">
          @abeerabdallah091
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35 hidden sm:block">
          abeerabdallah091@gmail.com
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/35">
          Graphic Designer
        </span>
      </div>

      {/* Subtle divider line at bottom */}
      <div className="absolute bottom-[3.5rem] left-6 right-6 md:left-12 md:right-12 h-px bg-black/10" />
    </section>
  )
}
