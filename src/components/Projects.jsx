import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, X } from 'lucide-react'

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      id: 2,
      title: 'Developing Efficient Structural Systems for Small Satellites',
      category: 'Aerospace',
      description: 'Designed and optimized lightweight structural systems for small satellites, focusing on strength-to-weight ratio and launch vehicle compatibility.',
      image: '/struct.jpeg',
      technologies: ['FEA Analysis', 'ANSYS', 'Structural Design', 'Material Optimization'],
      features: [
        'Optimized weight reduction',
        'Launch vehicle compatibility',
        'Enhanced structural integrity',
        'Cost-effective design solutions',
      ],
      link: '/3. Developing efficient structural systems for small satellites.pdf',
      isPdf: true,
    },
    {
      id: 7,
      title: 'Feasibility Study of Ground Source Heat Pumps',
      category: 'Renewable Energy',
      description: 'Comprehensive feasibility study of ground source heat pumps for different building types under Indian climate zones. Analyzed system performance, economic viability, and environmental impact.',
      image: '/Fease.jpeg',
      technologies: ['Thermal Analysis', 'Energy Systems', 'Climate Analysis', 'Economic Modeling'],
      features: [
        'Multi-climate zone analysis',
        'Building type optimization',
        'Economic feasibility assessment',
        'Environmental impact evaluation',
      ],
      link: '/2. Feasibility study of ground source heat pumps for different building types under Indian climate zones (2).pdf',
      isPdf: true,
    },
    {
      id: 3,
      title: 'Portfolio V1',
      category: 'Portfolio',
      description: 'Comprehensive portfolio showcasing engineering projects, design work, and technical expertise across multiple domains including aerospace, renewable energy, and structural systems.',
      image: '/image.png',
      technologies: ['Engineering Design', 'Project Management', 'Technical Documentation', 'CAD/CAE'],
      features: [
        'Multi-domain project showcase',
        'Detailed technical documentation',
        'Design process visualization',
        'Professional presentation',
      ],
      link: '/1. Portfolio_V1.pdf',
      isPdf: true,
    },
    {
      id: 4,
      title: '3D Printed Prosthetic Hand',
      category: 'Biomechanics',
      description: 'Developed an affordable, customizable 3D printed prosthetic hand with advanced grip patterns and intuitive control system.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      technologies: ['Fusion 360', '3D Printing', 'Material Science', 'Biomechanics'],
      features: [
        'Customizable design',
        'Multiple grip patterns',
        'Lightweight construction',
        'Cost-effective solution',
      ],
      link: '#',
    },
    {
      id: 5,
      title: 'CNC Machine Optimization',
      category: 'Manufacturing',
      description: 'Optimized CNC machining processes through toolpath optimization and cutting parameter analysis, reducing production time by 40%.',
      image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800',
      technologies: ['CNC Programming', 'Toolpath Optimization', 'Manufacturing Analysis'],
      features: [
        '40% time reduction',
        'Improved surface finish',
        'Extended tool life',
        'Cost optimization',
      ],
      link: '#',
    },
    {
      id: 6,
      title: 'Wind Turbine Blade Design',
      category: 'Renewable Energy',
      description: 'Aerodynamic optimization of wind turbine blades using CFD analysis and material optimization for maximum energy efficiency.',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
      technologies: ['CFD Analysis', 'Aerodynamics', 'Composite Materials', 'ANSYS'],
      features: [
        'Improved energy capture',
        'Reduced noise levels',
        'Material optimization',
        'Manufacturing feasibility',
      ],
      link: '#',
    },
  ]

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-screen py-8 sm:py-12 md:py-20 px-4 sm:px-6 relative bg-black/40 backdrop-blur-sm"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent px-4">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-4">
            Showcasing innovative engineering solutions and design excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 cursor-pointer group w-full"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <span className="px-2 sm:px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-semibold text-white">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-800 text-[10px] sm:text-xs text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <motion.a
                    href={project.link}
                    target={project.isPdf ? "_blank" : undefined}
                    rel={project.isPdf ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    onClick={(e) => project.isPdf && e.stopPropagation()}
                  >
                    <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-800 m-2 sm:m-0"
            >
              <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X size={18} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <span className="px-2 sm:px-3 py-1 bg-blue-500 rounded-full text-xs sm:text-sm font-semibold text-white">
                    {selectedProject.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">{selectedProject.title}</h2>
                <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">{selectedProject.description}</p>
                
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Key Features</h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {selectedProject.features.map((feature, index) => (
                      <li key={index} className="text-gray-300 text-sm sm:text-base flex items-start">
                        <span className="text-blue-500 mr-2 flex-shrink-0">▸</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-gray-800 text-xs sm:text-sm text-gray-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.a
                    href={selectedProject.link}
                    target={selectedProject.isPdf ? "_blank" : undefined}
                    rel={selectedProject.isPdf ? "noopener noreferrer" : undefined}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm sm:text-base font-semibold text-white flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                    {selectedProject.isPdf ? 'View PDF' : 'View Project'}
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
