import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SKILLS = [
  'React', 'Vite', 'GSAP', 'Tailwind CSS',
  'Framer Motion', 'Figma', 'Adobe Illustrator',
  'Photoshop', 'InDesign', 'Canva',
]

export default function About() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-col', {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      gsap.from('.skill-pill', {
        scale: 0.85,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.skill-pill',
          start: 'top 85%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 px-6 md:px-16 bg-dark">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">

        {/* Left: Studio copy */}
        <div className="about-col">
          <h2
            className="font-sans font-black text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            About<br />
            <span className="text-accent">Abeer</span>
          </h2>
          <p className="font-sans font-light text-white/60 leading-relaxed mb-5 text-base max-w-md">
            Abeer Abdallah Jama is a self-taught graphic designer and creative developer focused on
            building cinematic digital experiences. Every project is approached as a complete
            instrument — not just a website, but a brand presence that moves.
          </p>
          <p className="font-sans font-light text-white/60 leading-relaxed text-base max-w-md">
            From e-commerce to editorial portfolios, motion design, front-end engineering, and
            visual storytelling combine to create work that stands apart.
          </p>

          {/* Stats */}
          <div className="flex gap-10 mt-10">
            {[
              { num: '4+', label: 'Projects Shipped' },
              { num: '3', label: 'Industries' },
              { num: '2+', label: 'Years Experience' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="font-sans font-black text-accent text-3xl leading-none mb-1">{num}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Abeer profile */}
        <div className="about-col">
          <div className="rounded-4xl overflow-hidden mb-6 aspect-square max-w-xs bg-primary/60 flex items-center justify-center border border-white/10">
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-sans font-black text-accent text-2xl">AJ</span>
              </div>
              <p className="font-drama italic text-white text-xl leading-snug mb-1">Abeer Abdallah Jama</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent/60">
                Jr. Graphic Designer & Developer
              </p>
            </div>
          </div>

          <p className="font-sans font-light text-white/50 text-sm leading-relaxed mb-6">
            Self-taught designer with 2 years of experience across brand identity, automotive
            compositing, product visualization, and full-stack web development.
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="skill-pill font-mono text-[10px] uppercase tracking-widest text-white/60 px-3 py-1.5 rounded-full border border-white/10 hover:border-accent/40 hover:text-accent transition-colors duration-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
