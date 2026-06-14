import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from './ProjectCard'
import { PROJECTS } from '../data/projects'

function FeaturedCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      className="group relative w-full rounded-4xl overflow-hidden bg-dark cursor-pointer mb-6"
      style={{
        aspectRatio: '21/9',
        boxShadow: hovered
          ? `0 0 60px ${project.accentGlow}40, 0 24px 80px rgba(0,0,0,0.6)`
          : '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      <img
        src={project.thumb}
        alt={project.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Web Design badge — top right */}
      <div className="absolute top-5 right-5 z-10">
        <span
          className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border"
          style={{ borderColor: `${project.accentGlow}80`, color: project.accentGlow, backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          {project.category}
        </span>
      </div>

      {/* Content — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: project.accentGlow }}>
              {project.subtitle}
            </p>
            <h3
              className="font-sans font-black text-white leading-none"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              {project.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 justify-end max-w-xs hidden md:flex">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border"
                style={{ borderColor: `${project.accentGlow}60`, color: project.accentGlow }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="font-sans font-light text-white/60 text-sm leading-relaxed mt-3 max-w-2xl">
          {project.description}
        </p>
      </div>

      {/* Hover CTA */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <button
          className="btn-magnetic font-sans font-semibold text-sm px-8 py-3 rounded-full border-2 text-white backdrop-blur-sm"
          style={{ borderColor: project.accentGlow, backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <span className="btn-fill rounded-full" style={{ backgroundColor: project.accentGlow }} />
          <span className="relative z-10">View Project</span>
        </button>
      </div>
    </article>
  )
}

export default function WorkGrid() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)

  const featured = PROJECTS.find((p) => p.featured)
  const rest = PROJECTS.filter((p) => !p.featured)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
        },
      })

      gsap.from('.featured-card', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.featured-card',
          start: 'top 82%',
        },
      })

      gsap.from('.project-card', {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.work-grid',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={sectionRef} className="py-24 md:py-32 px-6 md:px-16 bg-primary">
      {/* Section header */}
      <div ref={headingRef} className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <h2 className="font-sans font-black text-white leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Selected Work
          </h2>
        </div>
        <span className="font-mono text-[11px] tracking-widest uppercase text-white/30 pb-2 hidden md:block">
          2024 – 2025
        </span>
      </div>

      {/* Featured full-width card */}
      {featured && (
        <div className="featured-card">
          <FeaturedCard project={featured} />
        </div>
      )}

      {/* 2-col grid */}
      <div className="work-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        {rest.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
