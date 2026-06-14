import { useState } from 'react'

export default function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      className="project-card group relative rounded-4xl overflow-hidden bg-dark cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? `0 0 40px ${project.accentGlow}30, 0 20px 60px rgba(0,0,0,0.5)`
          : '0 4px 24px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {/* Thumbnail */}
      <div className="aspect-video overflow-hidden">
        <img
          src={project.thumb}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Hover Overlay */}
      <div
        className="absolute inset-0 bg-primary/85 backdrop-blur-sm flex flex-col justify-center items-center gap-5 transition-opacity duration-400"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        {/* Tag Pills */}
        <div className="flex flex-wrap gap-2 justify-center px-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{ borderColor: `${project.accentGlow}60`, color: project.accentGlow }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View button */}
        <button
          className="btn-magnetic font-sans font-semibold text-sm px-6 py-2.5 rounded-full border-2 text-white"
          style={{ borderColor: project.accentGlow }}
        >
          <span
            className="btn-fill rounded-full"
            style={{ backgroundColor: project.accentGlow }}
          />
          <span className="relative z-10">View Project</span>
        </button>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-sans font-bold text-white text-base leading-tight mb-1">
              {project.title}
            </h3>
            <p className="font-mono text-[11px] tracking-widest uppercase text-accent/60">
              {project.subtitle}
            </p>
          </div>
          <span className="font-mono text-[11px] text-white/30 mt-0.5 shrink-0">
            {project.year}
          </span>
        </div>
        <p className="font-sans font-light text-white/50 text-sm leading-relaxed mt-3">
          {project.description}
        </p>
      </div>
    </article>
  )
}
