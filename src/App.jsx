import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, Download, ChevronUp, Code, Palette, Globe, Database } from 'lucide-react';
import emailjs from '@emailjs/browser';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef();

  // EmailJS Configuration - Replace with your actual values
  const EMAILJS_SERVICE_ID = 'service_roj5d4k';
  const EMAILJS_TEMPLATE_ID = 'template_5puj027';
  const EMAILJS_PUBLIC_KEY = '-czBpf2z7mlwhzq6U';

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  // Handle scroll for active section and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = ['home', 'projects', 'about', 'contact'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
      
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name.trim()) && name.trim().length > 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    
    const { name, email, message } = formData;
    
    // Validation checks
    if (!name.trim()) {
      showNotification('Name is required!');
      return;
    }
    
    if (!validateName(name)) {
      showNotification('Name can only contain letters and spaces!');
      return;
    }
    
    if (!email.trim()) {
      showNotification('Email is required!');
      return;
    }
    
    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address!');
      return;
    }
    
    if (!message.trim()) {
      showNotification('Message cannot be empty!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare template parameters
      const templateParams = {
        from_name: name.trim(),
        from_email: email.trim(),
        message: message.trim(),
        to_name: 'Ahmed Hassan', // Your name for the template
        reply_to: email.trim(), // This ensures replies go to the user
        // Additional useful info
        timestamp: new Date().toLocaleString(),
        subject: `New Portfolio Message from ${name.trim()}`,
        // Explicitly set reply-to for better compatibility
        'reply-to': email.trim()
      };

      console.log('Sending email with params:', templateParams);

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('EmailJS result:', result);

      if (result.status === 200) {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`);
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      
      // More specific error messages
      if (error.text) {
        showNotification(`Failed to send message: ${error.text}`, 'error');
      } else if (error.status) {
        showNotification(`Failed to send message. Error code: ${error.status}`, 'error');
      } else {
        showNotification('Failed to send message. Please check your internet connection and try again.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission via Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const projects = [
    {
      title: "🌤️ Weather App", 
      description: "A dynamic weather application with real-time data fetching, geolocation support, and beautiful UI components showing current conditions and forecasts.",
      link: "https://new-weather-rosy.vercel.app",
      linkText: "View Project"
    },
    {
      title: "🎥 Cinematic Studio",
      description: "A comprehensive movie details web app featuring film information, ratings, trailers, and cast details with an elegant cinematic user interface.", 
      link: "https://cinematic-studio.vercel.app",
      linkText: "View Project"
    },
     {
      title: "🍽️ Recipe Finder",
      description: " Find the perfect recipe and follow along with built-in YouTube tutorials,Instructions and videos, all in one place.", 
      link: "https://recipe-finder-psi-swart.vercel.app",
      linkText: "View Project"
    },
     {
      title: "🌍 Country Explorer",
      description: " Explore countries with ease — discover cuisines, tourist spots, maps, postal codes, and more in one app.", 
      link: "https://country-explorer-iota-nine.vercel.app",
      linkText: "View Project"
    },
     {
      title: "📖 Quran Reader",
      description: " A beautiful, respectful digital companion for reading and exploring the Holy Quran. Experience the sacred text with multiple translations, and an interface designed for contemplation and study.", 
      link: "https://recite-web.vercel.app/chapter/36",
      linkText: "View Project"
    }
  ];

  const skills = [
    { name: 'React', icon: <Code className="w-5 h-5" /> },
    { name: 'JavaScript', icon: <Globe className="w-5 h-5" /> },
    { name: 'Tailwind CSS', icon: <Palette className="w-5 h-5" /> },
    { name: 'Git', icon: <Database className="w-5 h-5" /> }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50 border-b border-blue-400/30 shadow-lg shadow-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Ahmed Hassan
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {['home', 'projects', 'about', 'contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                      activeSection === item
                        ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/30'
                        : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20 hover:shadow-md hover:shadow-blue-600/20'
                    }`}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-b from-black/98 to-gray-900/98 backdrop-blur-md border-b border-blue-400/20">
            {['home', 'projects', 'about', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all duration-300 ${
                  activeSection === item
                    ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/30'
                    : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-600/20'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-cyan-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="text-center animate-fade-in relative z-10">
          <div className="mb-8">
            <div className="w-40 h-40 rounded-full mx-auto mb-6 border-4 border-transparent bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-600 p-1 shadow-2xl shadow-blue-400/30 hover:shadow-blue-400/50 transition-all duration-500 hover:scale-105">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white">
                 <picture>
                 <img 
                src="/pic 1.jpg" 
                alt="Ahmed Hassan"
                className="w-full h-full rounded-full object-cover"
                />
                </picture>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent leading-tight">
            Ahmed Hassan
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 opacity-90">
            An enthusiastic frontend developer looking to learn new technology to implement and improve modern UI/UX experiences
          </p>
          <div className="mt-10 flex justify-center space-x-8">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 text-blue-400 hover:from-blue-600/40 hover:to-cyan-600/40 hover:border-blue-400/60 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/30 transition-all duration-300"
            >
              <Github className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 text-blue-400 hover:from-blue-600/40 hover:to-cyan-600/40 hover:border-blue-400/60 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/30 transition-all duration-300"
            >
              <Linkedin className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="group p-4 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 text-blue-400 hover:from-blue-600/40 hover:to-cyan-600/40 hover:border-blue-400/60 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/30 transition-all duration-300"
            >
              <Mail className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-2xl p-8 border border-gray-700/50 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-400/20 hover:scale-105 transition-all duration-500 backdrop-blur-sm"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">{project.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">{project.description}</p>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-cyan-300 font-medium transition-all duration-300 group-hover:translate-x-2"
                >
                  {project.linkText}
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:rotate-45 transition-transform duration-300" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-gradient-to-br from-gray-900/50 via-black to-blue-950/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="text-center mb-16">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-3xl p-10 border border-gray-700/30 backdrop-blur-sm">
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                I'm Ahmed Hassan, a passionate frontend developer focused on building responsive and elegant web apps. 
                With a strong interest in design systems and UI/UX, I enjoy solving real-world problems through clean, 
                maintainable code. I am always excited to learn new technologies and continuously improve as a developer.
              </p>
            </div>
          </div>
          
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-white">Technical Skills</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 text-blue-400 px-6 py-4 rounded-2xl hover:from-blue-600/40 hover:to-cyan-600/40 hover:border-blue-400/60 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                    {skill.icon}
                  </div>
                  <span className="font-semibold text-lg">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <a 
              href="/resume.pdf" // Option 1: Local file in public folder
              // href="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" // Option 2: Google Drive
              // href="https://your-website.com/path/to/resume.pdf" // Option 3: External URL  
              download="Ahmed_Hassan_Resume.pdf" // Remove this line for external URLs
              // target="_blank" // Add this for external URLs that open in new tab
              className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 text-lg font-semibold"
            >
              <Download className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's collaborate and create something amazing together.
          </p>
          
          <div ref={formRef} className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-3xl p-10 border border-gray-700/30 backdrop-blur-sm shadow-2xl">
            <div className="space-y-8" onKeyPress={handleKeyPress}>
              <div>
                <label htmlFor="name" className="block text-lg font-semibold text-gray-300 mb-3">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-6 py-4 bg-gray-800/50 border rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-white placeholder-gray-500 text-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.name && !validateName(formData.name) ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  placeholder="Enter your full name"
                />
                {formData.name && !validateName(formData.name) && (
                  <p className="text-red-400 text-sm mt-2 ml-2">Name can only contain letters and spaces</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-gray-300 mb-3">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-6 py-4 bg-gray-800/50 border rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-white placeholder-gray-500 text-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.email && !validateEmail(formData.email) ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  placeholder="your.email@example.com"
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-red-400 text-sm mt-2 ml-2">Please enter a valid email address</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-lg font-semibold text-gray-300 mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-6 py-4 bg-gray-800/50 border rounded-2xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300 text-white placeholder-gray-500 resize-none text-lg backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.message.trim() === '' && formData.message !== '' ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                  }`}
                  placeholder="Tell me about your project or just say hello..."
                ></textarea>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-5 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Mail className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
              <p className="text-gray-500 text-sm text-center">
                💡 Tip: Press Ctrl+Enter (or Cmd+Enter on Mac) to send quickly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-lg z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-24 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 max-w-sm ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          <div className="flex items-start">
            <div className="flex-1">
              {notification.message}
            </div>
            <button
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="ml-3 text-white hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;