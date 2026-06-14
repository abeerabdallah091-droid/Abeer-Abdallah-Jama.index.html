export default function Footer() {
  const year = new Date().getFullYear()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-primary rounded-t-[3rem] border-t border-accent/10 pt-16 pb-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-14">
          {/* Brand */}
          <div>
            <p className="font-sans font-black text-white text-xl mb-3">Abeer Abdallah Jama</p>
            <p className="font-drama italic text-accent/70 text-base leading-relaxed max-w-xs">
              Building digital instruments for brands that refuse to be ordinary.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-5">Navigation</p>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Work', id: 'work' },
                { label: 'About', id: 'about' },
                { label: 'Process', id: 'process' },
                { label: 'Contact', id: 'contact' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="font-sans text-sm text-white/50 hover:text-white link-lift transition-colors duration-200 text-left w-fit"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-5">Get in Touch</p>
            <a
              href="mailto:abeerabdallah091@gmail.com"
              className="font-sans text-sm text-white/50 hover:text-accent link-lift transition-colors duration-200 block mb-2"
            >
              abeerabdallah091@gmail.com
            </a>
            <a
              href="https://abeerabdallah091-droid.github.io/Abeer-Abdallah-Jama.index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-white/50 hover:text-accent link-lift transition-colors duration-200 block"
            >
              Personal Portfolio
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* System Operational */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest text-green-400/70">
              System Operational
            </span>
          </div>

          {/* Copyright */}
          <p className="font-mono text-[11px] text-white/20 tracking-wide">
            {year} Abeer Abdallah Jama. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
