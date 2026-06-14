import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

export function LocationMap({ location = "Mogadishu, Somalia", coordinates = "2.0469° N, 45.3182° E", branches = [], region = "" }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (rect.left + rect.width / 2))
    mouseY.set(e.clientY - (rect.top + rect.height / 2))
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-pointer select-none w-full"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <motion.div
        className="relative overflow-hidden w-full"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          borderRadius: "2rem",
          background: "#161a1e",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
        animate={{ height: isExpanded ? 300 : 180 }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        {/* Map expand layer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Map bg tint */}
              <div className="absolute inset-0" style={{ background: "#0f1214" }} />

              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                {/* Main roads */}
                {[35, 65].map((y, i) => (
                  <motion.line key={`h${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    stroke="rgba(235,176,18,0.18)" strokeWidth="3"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} />
                ))}
                {[30, 70].map((x, i) => (
                  <motion.line key={`v${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                    stroke="rgba(235,176,18,0.14)" strokeWidth="2.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }} />
                ))}
                {/* Secondary streets */}
                {[20, 50, 80].map((y, i) => (
                  <motion.line key={`sh${i}`} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                    stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }} />
                ))}
                {[15, 45, 55, 85].map((x, i) => (
                  <motion.line key={`sv${i}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                    stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + i * 0.08 }} />
                ))}
              </svg>

              {/* Buildings */}
              {[
                { top: "40%", left: "10%", w: "15%", h: "20%" },
                { top: "15%", left: "35%", w: "12%", h: "15%" },
                { top: "70%", left: "75%", w: "18%", h: "18%" },
                { top: "20%", right: "10%", w: "10%", h: "25%" },
                { top: "8%",  left: "75%", w: "14%", h: "10%" },
              ].map((s, i) => (
                <motion.div key={i} className="absolute rounded-sm"
                  style={{ ...s, background: "rgba(235,176,18,0.12)", border: "1px solid rgba(235,176,18,0.10)" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }} />
              ))}

              {/* Pin */}
              <motion.div className="absolute top-1/2 left-1/2"
                style={{ x: "-50%", y: "-50%" }}
                initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  style={{ filter: "drop-shadow(0 0 10px rgba(235,176,18,0.6))" }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EBB012" />
                  <circle cx="12" cy="9" r="2.5" fill="#111417" />
                </svg>
              </motion.div>

              {/* Bottom fade */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #161a1e 0%, transparent 45%)", opacity: 0.8 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid pattern (collapsed only) */}
        <motion.div className="absolute inset-0" animate={{ opacity: isExpanded ? 0 : 1 }} transition={{ duration: 0.3 }}>
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id={`grid-${location}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${location})`} />
          </svg>
        </motion.div>

        {/* Accent gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(235,176,18,0.07) 0%, transparent 50%)", pointerEvents: "none" }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-7">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="#EBB012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              animate={{ opacity: isExpanded ? 0 : 1 }}
              transition={{ duration: 0.3 }}>
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" />
            </motion.svg>

            <motion.div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ background: "rgba(235,176,18,0.08)" }}
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#EBB012" }} />
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: "rgba(235,176,18,0.7)" }}>
                {isExpanded ? "Tap to close" : "Tap to open"}
              </span>
            </motion.div>
          </div>

          {/* Bottom */}
          <div>
            {region && (
              <span className="font-mono text-[8px] uppercase tracking-[0.28em] block mb-1" style={{ color: "rgba(255,255,255,0.22)" }}>
                {region}
              </span>
            )}
            <motion.h3 className="font-sans font-black text-white leading-none tracking-tight"
              style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)" }}
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              {location}
            </motion.h3>

            <AnimatePresence>
              {isExpanded && branches.length > 0 && (
                <motion.div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                  {branches.map(b => (
                    <div key={b} className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "rgba(235,176,18,0.5)" }} />
                      <span className="font-sans text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{b}</span>
                    </div>
                  ))}
                </motion.div>
              )}
              {isExpanded && (
                <motion.p className="font-mono text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}>
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div className="h-px mt-3 rounded-full"
              style={{ background: "linear-gradient(to right, rgba(235,176,18,0.5), rgba(235,176,18,0.15), transparent)" }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: isHovered || isExpanded ? 1 : 0.3 }}
              transition={{ duration: 0.4, ease: "easeOut" }} />
          </div>
        </div>
      </motion.div>

      {/* Click hint */}
      <motion.p className="absolute -bottom-5 left-1/2 font-mono text-[9px] uppercase tracking-widest whitespace-nowrap"
        style={{ x: "-50%", color: "rgba(235,176,18,0.5)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !isExpanded ? 1 : 0, y: isHovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}>
        Tap to explore
      </motion.p>
    </motion.div>
  )
}
