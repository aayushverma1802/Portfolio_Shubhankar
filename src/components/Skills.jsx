import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Cpu, Wrench, Layers, Settings, Box, Zap } from 'lucide-react'

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const skillCategories = [
    {
      icon: Layers,
      title: 'CAD Software',
      skills: [
        { name: 'SolidWorks', level: 95 },
        { name: 'AutoCAD', level: 90 },
        { name: 'Fusion 360', level: 88 },
        { name: 'CATIA', level: 85 },
        { name: 'Inventor', level: 82 },
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Cpu,
      title: 'CAE & Simulation',
      skills: [
        { name: 'ANSYS', level: 92 },
        { name: 'Finite Element Analysis', level: 90 },
        { name: 'CFD Analysis', level: 85 },
        { name: 'MATLAB', level: 88 },
        { name: 'Simulink', level: 80 },
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Wrench,
      title: 'Manufacturing',
      skills: [
        { name: 'CNC Programming', level: 87 },
        { name: '3D Printing', level: 90 },
        { name: 'Rapid Prototyping', level: 88 },
        { name: 'Quality Control', level: 85 },
        { name: 'Lean Manufacturing', level: 82 },
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Settings,
      title: 'Mechanical Systems',
      skills: [
        { name: 'Mechanism Design', level: 93 },
        { name: 'Thermodynamics', level: 88 },
        { name: 'Fluid Mechanics', level: 85 },
        { name: 'Materials Science', level: 90 },
        { name: 'Robotics', level: 80 },
      ],
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Box,
      title: '3D Modeling',
      skills: [
        { name: 'Blender', level: 85 },
        { name: 'Rendering', level: 88 },
        { name: 'Animation', level: 80 },
        { name: 'Texturing', level: 82 },
        { name: 'Visualization', level: 90 },
      ],
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Zap,
      title: 'Project Management',
      skills: [
        { name: 'Agile Methodology', level: 85 },
        { name: 'Risk Management', level: 88 },
        { name: 'Budget Planning', level: 90 },
        { name: 'Team Leadership', level: 87 },
        { name: 'Documentation', level: 92 },
      ],
      color: 'from-indigo-500 to-blue-500',
    },
  ]

  return (
    <section
      id="skills"
      ref={ref}
      className="min-h-screen py-20 px-6 relative bg-black/40 backdrop-blur-sm"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive technical skills spanning design, analysis, and manufacturing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm">{skill.name}</span>
                      <span className="text-gray-400 text-xs">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : {}}
                        transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 + 0.3, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
