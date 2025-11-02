import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Award, Target, Zap, Users } from 'lucide-react'

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const stats = [
    { icon: Award, value: '50+', label: 'Projects Completed' },
    { icon: Target, value: '10+', label: 'Years Experience' },
    { icon: Zap, value: '100%', label: 'Client Satisfaction' },
    { icon: Users, value: '30+', label: 'Team Collaborations' },
  ]

  const achievements = [
    {
      title: 'Advanced CAD Design',
      description: 'Expert in SolidWorks, AutoCAD, and Fusion 360 with extensive experience in product design and prototyping.',
    },
    {
      title: 'Mechanical Systems',
      description: 'Design and optimization of complex mechanical systems including robotics, automation, and manufacturing equipment.',
    },
    {
      title: '3D Modeling & Visualization',
      description: 'Creating detailed 3D models and renderings for product development and client presentations.',
    },
    {
      title: 'Project Management',
      description: 'Leading cross-functional teams to deliver innovative engineering solutions on time and within budget.',
    },
  ]

  return (
    <section
      id="about"
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
            About Me
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Passionate mechanical engineer with a drive for innovation and excellence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">My Journey</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              With over a decade of experience in mechanical engineering, I've dedicated my career
              to pushing the boundaries of design and innovation. My expertise spans from
              conceptual design to final production, with a focus on creating efficient, sustainable,
              and cutting-edge solutions.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
              I specialize in transforming complex engineering challenges into elegant, functional
              designs. Through meticulous attention to detail and a deep understanding of
              mechanical principles, I've successfully delivered numerous projects across various
              industries including aerospace, automotive, and consumer products.
            </p>
            <p className="text-gray-300 leading-relaxed">
              My approach combines technical excellence with creative problem-solving, ensuring that
              every project not only meets but exceeds expectations. I'm constantly learning and
              adapting to new technologies, keeping my skills at the forefront of the industry.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800 text-center"
              >
                <stat.icon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-center text-white">Key Expertise</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
              >
                <h4 className="text-xl font-semibold text-white mb-3">{achievement.title}</h4>
                <p className="text-gray-300">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
