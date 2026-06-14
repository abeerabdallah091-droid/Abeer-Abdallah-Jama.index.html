import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function WordReveal({ text, className }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const inners = containerRef.current?.querySelectorAll('.word-inner')
      if (!inners?.length) return

      gsap.from(inners, {
        y: '100%',
        opacity: 0,
        stagger: 0.04,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <p ref={containerRef} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="word-clip mr-[0.25em]">
          <span className="word-inner">{word}</span>
        </span>
      ))}
    </p>
  )
}

export default function Philosophy() {
  const sectionRef = useRef(null)
  const textureRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax texture
      gsap.to(textureRef.current, {
        y: '-15%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 px-6 md:px-16 bg-primary overflow-hidden">
      {/* Parallax texture */}
      <img
        ref={textureRef}
        src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 w-full h-[120%] object-cover opacity-[0.07] pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Statement 1 - small, neutral */}
        <WordReveal
          text="Most designers focus on: trends, templates, and turnover."
          className="font-sans font-light text-white/30 leading-relaxed mb-6 md:mb-8 max-w-2xl"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.375rem)' }}
        />

        {/* Statement 2 - massive, accent */}
        <div>
          <WordReveal
            text="We focus on:"
            className="font-sans font-light text-white/50 leading-none"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
          />
          <CraftReveal />
        </div>
      </div>
    </section>
  )
}

function CraftReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: '100%',
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <div className="overflow-hidden pb-2">
      <h2
        ref={ref}
        className="font-drama italic text-accent leading-[1.05]"
        style={{ fontSize: 'clamp(5rem, 14vw, 12rem)' }}
      >
        Craft.
      </h2>
    </div>
  )
}
