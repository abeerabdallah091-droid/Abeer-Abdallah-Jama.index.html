import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Contact() {
  const sectionRef = useRef(null)
  const btnRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([headingRef.current, '.contact-sub'], {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    // Magnetic button
    const btn = btnRef.current
    if (!btn) return

    const onMouseMove = (e) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' })
    }
    const onMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
    }

    btn.addEventListener('mousemove', onMouseMove)
    btn.addEventListener('mouseleave', onMouseLeave)

    return () => {
      ctx.revert()
      btn.removeEventListener('mousemove', onMouseMove)
      btn.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="py-32 md:py-48 px-6 md:px-16 bg-primary text-center">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="font-drama italic text-white leading-tight mb-8"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          Ready to build something extraordinary?
        </h2>

        {/* Email */}
        <p className="contact-sub font-mono text-[15px] text-accent/80 tracking-wider mb-10">
          abeerabdallah091@gmail.com
        </p>

        {/* CTA Button - true magnetic */}
        <div className="contact-sub flex justify-center">
          <a
            ref={btnRef}
            href="mailto:abeerabdallah091@gmail.com"
            className="btn-magnetic inline-flex items-center gap-3 bg-accent text-primary font-sans font-bold px-10 py-4 rounded-full text-base"
          >
            <span className="btn-fill bg-white/25 rounded-full" />
            <span className="relative z-10">Send a Message</span>
            <svg className="relative z-10 w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* Secondary */}
        <p className="contact-sub font-sans font-light text-white/30 text-sm mt-8">
          Based in Kuwait, working globally.
        </p>
      </div>
    </section>
  )
}
