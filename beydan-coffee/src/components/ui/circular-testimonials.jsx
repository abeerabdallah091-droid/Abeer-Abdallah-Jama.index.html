import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function calculateGap(width) {
  const minWidth = 1024, maxWidth = 1456, minGap = 60, maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  colors = {},
  fontSizes = {},
}) {
  const colorName        = colors.name            ?? "#f7f7ff";
  const colorDesignation = colors.designation     ?? "#a0a0a0";
  const colorTestimony   = colors.testimony       ?? "#d1d1d1";
  const colorArrowBg     = colors.arrowBackground ?? "#1e1e1e";
  const colorArrowFg     = colors.arrowForeground ?? "#f1f1f7";
  const colorArrowHover  = colors.arrowHoverBackground ?? "#EBB012";
  const fontSizeName     = fontSizes.name         ?? "1.5rem";
  const fontSizeDesig    = fontSizes.designation  ?? "0.9rem";
  const fontSizeQuote    = fontSizes.quote        ?? "1.05rem";

  const [activeIndex, setActiveIndex]   = useState(0);
  const [hoverPrev, setHoverPrev]       = useState(false);
  const [hoverNext, setHoverNext]       = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef  = useRef(null);
  const autoplayRef        = useRef(null);
  const len = useMemo(() => testimonials.length, [testimonials]);
  const active = useMemo(() => testimonials[activeIndex], [activeIndex, testimonials]);

  useEffect(() => {
    function onResize() {
      if (imageContainerRef.current) setContainerWidth(imageContainerRef.current.offsetWidth);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (autoplay) autoplayRef.current = setInterval(() => setActiveIndex(p => (p + 1) % len), 5000);
    return () => clearInterval(autoplayRef.current);
  }, [autoplay, len]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === "ArrowLeft")  handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, len]);

  const handleNext = useCallback(() => {
    setActiveIndex(p => (p + 1) % len);
    clearInterval(autoplayRef.current);
  }, [len]);

  const handlePrev = useCallback(() => {
    setActiveIndex(p => (p - 1 + len) % len);
    clearInterval(autoplayRef.current);
  }, [len]);

  function getImageStyle(index) {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft   = (activeIndex - 1 + len) % len === index;
    const isRight  = (activeIndex + 1) % len === index;
    if (isActive) return {
      zIndex: 3, opacity: 1, pointerEvents: "auto",
      transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
    if (isLeft) return {
      zIndex: 2, opacity: 1, pointerEvents: "auto",
      transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
    if (isRight) return {
      zIndex: 2, opacity: 1, pointerEvents: "auto",
      transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
    return { zIndex: 1, opacity: 0, pointerEvents: "none", transition: "all 0.8s cubic-bezier(.4,2,.3,1)" };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -20 },
  };

  return (
    <div style={{ width: "100%", maxWidth: "56rem", padding: "2rem" }}>
      <div style={{ display: "grid", gap: "4rem", gridTemplateColumns: "1fr" }} className="md:grid-cols-2-auto">
        {/* grid via tailwind class on wrapper */}
        <div className="ct-grid">
          {/* Images */}
          <div
            ref={imageContainerRef}
            style={{ position: "relative", width: "100%", height: "22rem", perspective: "1000px" }}
          >
            {testimonials.map((t, i) => (
              <img
                key={t.src}
                src={t.src}
                alt={t.name}
                style={{
                  position: "absolute", width: "100%", height: "100%",
                  objectFit: "cover", borderRadius: "1.5rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                  ...getImageStyle(i),
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                variants={quoteVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, marginBottom: "0.25rem", color: colorName, fontSize: fontSizeName }}>
                  {active.name}
                </h3>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: fontSizeDesig, color: colorDesignation, marginBottom: "1.5rem", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  {active.designation}
                </p>
                <motion.p style={{ lineHeight: 1.75, color: colorTestimony, fontSize: fontSizeQuote, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {active.quote.split(" ").map((word, i) => (
                    <motion.span key={i}
                      initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: "easeInOut", delay: 0.025 * i }}
                      style={{ display: "inline-block" }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Arrow buttons */}
            <div style={{ display: "flex", gap: "1rem", paddingTop: "2rem" }}>
              <button
                onClick={handlePrev}
                onMouseEnter={() => setHoverPrev(true)}
                onMouseLeave={() => setHoverPrev(false)}
                aria-label="Previous"
                style={{
                  width: "2.7rem", height: "2.7rem", borderRadius: "50%", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "background-color 0.3s",
                  backgroundColor: hoverPrev ? colorArrowHover : colorArrowBg,
                }}
              >
                <FaArrowLeft size={16} color={colorArrowFg} />
              </button>
              <button
                onClick={handleNext}
                onMouseEnter={() => setHoverNext(true)}
                onMouseLeave={() => setHoverNext(false)}
                aria-label="Next"
                style={{
                  width: "2.7rem", height: "2.7rem", borderRadius: "50%", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "background-color 0.3s",
                  backgroundColor: hoverNext ? colorArrowHover : colorArrowBg,
                }}
              >
                <FaArrowRight size={16} color={colorArrowFg} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ct-grid {
          display: grid;
          gap: 3rem;
        }
        @media (min-width: 768px) {
          .ct-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default CircularTestimonials;
