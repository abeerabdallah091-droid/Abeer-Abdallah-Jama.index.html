import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* ── SVG: Rotating concentric circles ── */
function ConcentricCircles() {
  const g1 = useRef(null)
  const g2 = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(g1.current, { rotation: 360, duration: 12, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
      gsap.to(g2.current, { rotation: -360, duration: 20, repeat: -1, ease: 'none', transformOrigin: '50% 50%' })
    })
    return () => ctx.revert()
  }, [])

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="opacity-40">
      <g ref={g1}>
        <circle cx="100" cy="100" r="30" stroke="#C9A84C" strokeWidth="1" strokeDasharray="8 6" />
        <circle cx="100" cy="100" r="55" stroke="#C9A84C" strokeWidth="0.75" strokeDasharray="12 8" />
      </g>
      <g ref={g2}>
        <circle cx="100" cy="100" r="75" stroke="#C9A84C" strokeWidth="0.5" strokeDasharray="20 10" />
        <circle cx="100" cy="100" r="92" stroke="#C9A84C" strokeWidth="0.4" strokeDasharray="6 14" />
      </g>
      <circle cx="100" cy="100" r="6" fill="#C9A84C" opacity="0.8" />
    </svg>
  )
}

/* ── SVG: Laser scanner over dot grid ── */
function LaserScanner() {
  const laserRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(laserRef.current, {
        x: 160,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })
    })
    return () => ctx.revert()
  }, [])

  const dots = []
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 8; col++) {
      dots.push({ cx: 20 + col * 24, cy: 20 + row * 28 })
    }
  }

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="opacity-40">
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="2" fill="#C9A84C" opacity="0.4" />
      ))}
      <g ref={laserRef}>
        <line x1="0" y1="0" x2="0" y2="200" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
        <line x1="-2" y1="0" x2="-2" y2="200" stroke="#C9A84C" strokeWidth="4" opacity="0.15" />
      </g>
    </svg>
  )
}

/* ── SVG: EKG Waveform ── */
function EKGWaveform() {
  const pathRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!pathRef.current) return
      const len = pathRef.current.getTotalLength()
      gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'none',
        repeat: -1,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <svg width="200" height="80" viewBox="0 0 200 80" fill="none" className="opacity-50">
      <path
        ref={pathRef}
        d="M0 40 L30 40 L40 10 L50 70 L60 40 L90 40 L100 10 L110 70 L120 40 L150 40 L160 10 L170 70 L180 40 L200 40"
        stroke="#C9A84C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'We excavate your brand\'s true signal before writing a single line of code.',
    Visual: ConcentricCircles,
  },
  {
    num: '02',
    title: 'Architect',
    desc: 'Every scroll, hover, and transition is designed before it is built.',
    Visual: LaserScanner,
  },
  {
    num: '03',
    title: 'Deliver',
    desc: 'Cinematic, performant, and pixel-perfect - shipped on schedule.',
    Visual: EKGWaveform,
  },
]

export default function Process() {
  const wrapRef = useRef(null)

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true })

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.stack-card')

      cards.forEach((card, i) => {
        if (i === cards.length - 1) return

        // Pin each card except the last
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          endTrigger: cards[cards.length - 1],
          end: 'top top',
          pin: true,
          pinSpacing: false,
        })

        // Scale + blur + fade as next card arrives
        gsap.to(card, {
          scale: 0.92,
          filter: 'blur(8px)',
          opacity: 0.45,
          ease: 'none',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        })
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="process" ref={wrapRef} className="relative bg-primary">
      {STEPS.map((step, i) => (
        <div
          key={step.num}
          className="stack-card min-h-[100dvh] flex items-center justify-center bg-dark"
          style={{ borderRadius: i === 0 ? '2rem 2rem 0 0' : 0 }}
        >
          <div className="max-w-4xl w-full mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Text */}
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent/50 mb-4 block">
                {step.num}
              </span>
              <h3
                className="font-sans font-black text-white leading-tight mb-5"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                {step.title}
              </h3>
              <p className="font-sans font-light text-white/50 text-lg leading-relaxed max-w-sm">
                {step.desc}
              </p>
            </div>

            {/* Visual */}
            <div className="flex items-center justify-center">
              <div className="rounded-4xl bg-primary/50 border border-white/10 p-10 flex items-center justify-center">
                <step.Visual />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
