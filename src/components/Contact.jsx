import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, Linkedin } from 'lucide-react'

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Thank you for your message! I will get back to you soon.')
      setFormData({ name: '', email: '', message: '' })
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'sinha.s.shubhankar@gmail.com',
      link: 'mailto:sinha.s.shubhankar@gmail.com?subject=Portfolio Inquiry',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 7428559975',
      link: 'tel:+917428559975',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Noida, India',
      link: '#',
    },
  ]

  const socialLinks = [
    { icon: Linkedin, link: 'https://www.linkedin.com/in/sinha-shubhankar', label: 'LinkedIn' },
  ]

  return (
    <section
      id="contact"
      ref={ref}
      className="pt-12 pb-6 px-6 relative bg-black/40 backdrop-blur-sm"
      style={{ overflow: 'visible' }}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-2"
          style={{ marginTop: '-60px', overflow: 'visible' }}
        >
          <h2 
            className="text-2xl md:text-3xl font-bold mb-0 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
            style={{ 
              fontFamily: "'Poppins', 'Inter', sans-serif", 
              fontWeight: 800, 
              letterSpacing: '0.05em',
              lineHeight: '1.3',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              overflow: 'visible',
              textOverflow: 'clip',
              whiteSpace: 'normal',
              wordBreak: 'normal'
            }}
          >
            Get In Touch
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto mt-0">
            Let's discuss how we can bring your engineering projects to life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-5">Contact Information</h3>

              <div className="space-y-5">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{info.label}</div>
                      <div className="text-white font-semibold text-base">{info.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-lg font-semibold text-white mb-3">Follow Me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={22} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full flex flex-col"
          >
            <form onSubmit={handleSubmit} className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800 h-full flex flex-col">
              <div className="mb-3">
                <label htmlFor="name" className="block text-gray-300 mb-1 text-xs font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 mb-1 text-xs font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="mb-5 flex-1 mt-2">
                <label htmlFor="message" className="block text-gray-300 mb-1 text-xs font-semibold">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
