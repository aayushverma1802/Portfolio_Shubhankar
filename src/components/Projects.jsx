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
      id: 1,
      title: 'Advanced Robotic Arm System',
      category: 'Robotics',
      description: 'Designed and developed a 6-axis robotic arm with precision control system for industrial automation. Features advanced kinematics and real-time feedback control.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
      technologies: ['SolidWorks', 'ANSYS', 'MATLAB', 'C++', 'Arduino'],
      features: [
        '6-DOF precision control',
        'Real-time feedback system',
        'Payload capacity: 10kg',
        'Repeatability: ±0.1mm',
      ],
      link: '#',
    },
    {
      id: 2,
      title: 'Efficient Heat Exchange System',
      category: 'Thermodynamics',
      description: 'Optimized heat exchanger design for industrial applications, improving efficiency by 35% while reducing material costs through innovative fin geometry.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      technologies: ['CFD Analysis', 'SolidWorks', 'ANSYS Fluent', 'Thermal Simulation'],
      features: [
        '35% efficiency improvement',
        'Cost reduction of 20%',
        'Compact design',
        'Enhanced heat transfer',
      ],
      link: '#',
    },
    {
      id: 3,
      title: 'Automotive Suspension System',
      category: 'Automotive',
      description: 'Complete redesign of automotive suspension system with focus on performance and comfort. Utilized FEA for stress analysis and optimization.',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
      technologies: ['CATIA', 'ANSYS', 'FEA Analysis', 'Motion Simulation'],
      features: [
        'Improved ride comfort',
        'Enhanced stability',
        'Weight reduction: 15%',
        'Durability testing completed',
      ],
      link: '#',
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
      className="min-h-screen py-20 px-6 relative bg-black/40 backdrop-blur-sm"
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Showcasing innovative engineering solutions and design excellence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 cursor-pointer group"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <motion.a
                    href={project.link}
                    whileHover={{ scale: 1.1 }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <ExternalLink size={20} />
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-semibold text-white">
                    {selectedProject.category}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">{selectedProject.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {selectedProject.features.map((feature, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-blue-500 mr-2">▸</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-800 text-sm text-gray-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.a
                    href={selectedProject.link}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white flex items-center gap-2"
                  >
                    <ExternalLink size={20} />
                    View Project
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
