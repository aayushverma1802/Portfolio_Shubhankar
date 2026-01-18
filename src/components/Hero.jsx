import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Download, Linkedin, Mail } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const Hero = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const scrollToSection = (id) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      ref={ref}
      className="min-h-screen flex flex-col relative px-6 pt-20 isolate"
      style={{ contain: 'layout style paint' }}
    >
      {/* Centered Heading */}
      <div className="container mx-auto text-center z-20 pt-2 pb-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent" style={{ paddingBottom: '0.5rem' }}>
            Mechanical Engineer
          </h1>
        </motion.div>
      </div>

      {/* Two Column Layout: Left (Text) and Right (Car Area) */}
      <div className="container mx-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start z-10 pt-0">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col pt-0 pb-0 pl-8"
        >
          <div className="space-y-3 max-w-md">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 leading-relaxed"
              style={{ lineHeight: '1.5', paddingTop: '0.25rem' }}
            >
              Designing the Future,<br />One Mechanism at a Time
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg text-gray-400 leading-relaxed"
              style={{ lineHeight: '1.6', paddingTop: '0.25rem' }}
            >
              Specializing in 3D modeling,<br />CAD design, mechanical systems,<br />and innovative engineering solutions.<br />Transforming concepts into reality<br />through precision and creativity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4 -mt-4"
            >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#projects')}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all"
            >
              View Projects
            </motion.button>
            <motion.a
              href="/Resume_Shubhankar.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-lg font-semibold text-white hover:bg-gray-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download size={20} />
              Download Resume
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex gap-6 mt-4"
          >
            <motion.a
              href="https://www.linkedin.com/in/sinha-shubhankar"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: -5 }}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Linkedin size={28} />
            </motion.a>
            <motion.a
              href="mailto:sinha.s.shubhankar@gmail.com?subject=Portfolio Inquiry"
              whileHover={{ scale: 1.2 }}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Send email to sinha.s.shubhankar@gmail.com"
            >
              <Mail size={28} />
            </motion.a>
          </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Car Area (Empty space for 3D car) */}
        <div className="flex items-start justify-center h-full pt-4">
          {/* This space is intentionally left empty for the 3D car to be visible */}
        </div>
      </div>

      {/* Scroll Down Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={() => scrollToSection('#about')}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Scroll to about section"
        >
          <ArrowDown size={32} />
        </motion.button>
      </motion.div>
    </section>
  )
}

export default Hero
