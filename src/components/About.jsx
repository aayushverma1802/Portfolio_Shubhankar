import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(3)
  const intervalRef = useRef(null)
  const pauseTimeoutRef = useRef(null)
  const carouselRef = useRef(null)
  const isTransitioningRef = useRef(false)

  // Update cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1) // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2) // Tablet: 2 cards
      } else {
        setCardsPerView(3) // Desktop: 3 cards
      }
    }
    
    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  const achievements = [
    {
      title: 'CAD Design',
      description: 'Expert in computer-aided design with extensive experience in product design and engineering.',
    },
    {
      title: 'FEA Analysis',
      description: 'Finite Element Analysis for structural and mechanical system optimization.',
    },
    {
      title: 'Computational Fluid Dynamics',
      description: 'Advanced CFD analysis for fluid flow, heat transfer, and aerodynamics.',
    },
    {
      title: 'Additive Manufacturing',
      description: 'Expertise in 3D printing and rapid prototyping technologies.',
    },
    {
      title: 'Patent Drafting',
      description: 'Professional patent application drafting and technical documentation.',
    },
    {
      title: 'Patent Prosecution',
      description: 'Managing patent applications through the examination and approval process.',
    },
  ]

  // Calculate total slides based on cards per view
  const totalSlides = Math.ceil(achievements.length / cardsPerView)

  // Duplicate achievements for infinite loop
  const duplicatedAchievements = [...achievements, ...achievements]

  // Function to resume auto-rotation after a delay
  const resumeAutoRotate = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
    }
    setIsPaused(true)
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 3000) // Resume after 3 seconds
  }

  // Navigation functions - move by slides (cardsPerView cards at a time)
  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + cardsPerView
      return nextIndex >= achievements.length ? 0 : nextIndex
    })
    resumeAutoRotate()
  }

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexNew = prevIndex - cardsPerView
      return prevIndexNew < 0 ? achievements.length - cardsPerView : prevIndexNew
    })
    resumeAutoRotate()
  }

  const goToSlide = (slideIndex) => {
    const newIndex = slideIndex * cardsPerView
    setCurrentIndex(newIndex)
    resumeAutoRotate()
  }

  // Handle seamless reset when reaching end
  useEffect(() => {
    if (currentIndex >= achievements.length && carouselRef.current && !isTransitioningRef.current) {
      isTransitioningRef.current = true
      // Wait for current transition to finish, then reset seamlessly
      const resetTimer = setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none'
          setCurrentIndex(0)
          // Re-enable transition after a brief moment
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = 'transform 0.5s ease-in-out'
              isTransitioningRef.current = false
            }
          }, 50)
        }
      }, 500)
      return () => clearTimeout(resetTimer)
    }
  }, [currentIndex, achievements.length])

  // Auto-rotate carousel - move by slides (3 cards at a time)
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // Start auto-rotation if not paused and section is in view
    if (!isPaused && inView) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + cardsPerView
          // Move forward, reset will be handled by useEffect above
          return nextIndex >= achievements.length ? achievements.length : nextIndex
        })
      }, 2000)
    }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        if (pauseTimeoutRef.current) {
          clearTimeout(pauseTimeoutRef.current)
          pauseTimeoutRef.current = null
        }
      }
    }, [isPaused, inView, achievements.length, cardsPerView])

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen py-8 sm:py-12 md:py-20 px-4 sm:px-6 relative bg-black/40 backdrop-blur-sm"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Passionate mechanical engineer with a drive for innovation and excellence
          </p>
        </motion.div>

        <div className="mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-4xl mx-auto px-4"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">My Journey</h3>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
              With over a decade of experience in mechanical engineering, I've dedicated my career
              to pushing the boundaries of design and innovation. My expertise spans from
              conceptual design to final production, with a focus on creating efficient, sustainable,
              and cutting-edge solutions.
            </p>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
              I specialize in transforming complex engineering challenges into elegant, functional
              designs. Through meticulous attention to detail and a deep understanding of
              mechanical principles, I've successfully delivered numerous projects across various
              industries including aerospace, automotive, and consumer products.
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              My approach combines technical excellence with creative problem-solving, ensuring that
              every project not only meets but exceeds expectations. I'm constantly learning and
              adapting to new technologies, keeping my skills at the forefront of the industry.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center text-white px-4">Key Expertise</h3>
          <div 
            className="relative overflow-hidden w-full"
            style={{ 
              width: '100%',
              maxWidth: '100%'
            }}
            onMouseEnter={() => {
              setIsPaused(true)
              if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current)
              }
            }}
            onMouseLeave={() => {
              setIsPaused(false)
              if (pauseTimeoutRef.current) {
                clearTimeout(pauseTimeoutRef.current)
              }
            }}
          >
            {/* Left Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              className="absolute left-1 sm:left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800 rounded-full p-1.5 sm:p-2 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-1 sm:right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900/80 hover:bg-gray-800 rounded-full p-1.5 sm:p-2 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </button>

            <div className="px-8 sm:px-10 md:px-12">
              <div 
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6"
                style={{ 
                  transform: `translateX(calc(-${currentIndex} * ((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView} + 1.5rem)))`,
                  willChange: 'transform',
                  gap: cardsPerView === 1 ? '1rem' : cardsPerView === 2 ? '1.5rem' : '1.5rem'
                }}
                onClick={() => {
                  if (pauseTimeoutRef.current) {
                    clearTimeout(pauseTimeoutRef.current)
                  }
                  setIsPaused(true)
                  pauseTimeoutRef.current = setTimeout(() => {
                    setIsPaused(false)
                  }, 3000)
                }}
              >
                {duplicatedAchievements.map((achievement, index) => {
                  const cardNumber = (index % achievements.length) + 1
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.8 + (index % achievements.length) * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-900/50 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg border border-gray-800 flex-shrink-0 cursor-pointer"
                      style={{ 
                        width: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`,
                        flexShrink: 0,
                        minWidth: 0
                      }}
                    >
                      <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{cardNumber}. {achievement.title}</h4>
                      <p className="text-gray-300 text-sm sm:text-base">{achievement.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Dots Indicator with Numbers */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              {Array.from({ length: totalSlides }).map((_, index) => {
                const slideStartIndex = index * cardsPerView
                const isActive = currentIndex === slideStartIndex
                return (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      goToSlide(index)
                    }}
                    className={`transition-all duration-300 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                      isActive
                        ? 'bg-blue-500 w-8 h-8 sm:w-10 sm:h-10 text-white'
                        : 'bg-gray-600 w-8 h-8 sm:w-10 sm:h-10 text-gray-300 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
