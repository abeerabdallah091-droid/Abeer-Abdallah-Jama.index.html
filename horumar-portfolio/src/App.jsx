import Navbar from './components/Navbar'
import Hero from './components/Hero'
import WorkGrid from './components/WorkGrid'
import About from './components/About'
import Philosophy from './components/Philosophy'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="bg-primary min-h-[100dvh]">
      <Navbar />
      <Hero />
      <WorkGrid />
      <About />
      <Philosophy />
      <Process />
      <Contact />
      <Footer />
    </div>
  )
}
