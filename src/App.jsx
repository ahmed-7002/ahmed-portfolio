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
        to_name: 'Ahmed Hassan',
        reply_to: email.trim(),
        timestamp: new Date().toLocaleString(),
        subject: `New Portfolio Message from ${name.trim()}`,
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
        showNotification("Message sent successfully! I'll get back to you soon.", 'success');
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(`EmailJS returned status: ${result.status}`);
      }
    } catch (error) {
      console.error('EmailJS Error:', error);

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
      description: "Find the perfect recipe and follow along with built-in YouTube tutorials, instructions and videos, all in one place.",
      link: "https://recipe-finder-psi-swart.vercel.app",
      linkText: "View Project"
    },
    {
      title: "🌍 Country Explorer",
      description: "Explore countries with ease — discover cuisines, tourist spots, maps, postal codes, and more in one app.",
      link: "https://country-explorer-iota-nine.vercel.app",
      linkText: "View Project"
    },
    {
      title: "📖 Quran Reader",
      description: "A beautiful, respectful digital companion for reading and exploring the Holy Quran. Experience the sacred text with multiple translations, and an interface designed for contemplation and study.",
      link: "https://recite-web.vercel.app",
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
    <div className="min-h-screen text-stone-800" style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#FAFAF7' }}>

      {/* ─── NAVIGATION ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 border-b border-stone-200/60"
        style={{ backgroundColor: 'rgba(250,250,247,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="text-xl font-bold text-stone-800 tracking-tight select-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ahmed Hassan
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {['home', 'projects', 'about', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeSection === item
                      ? 'bg-stone-800 text-white shadow-md'
                      : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 border-b border-stone-100"
            style={{ backgroundColor: 'rgba(250,250,247,0.98)' }}>
            {['home', 'projects', 'about', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`block px-4 py-3 rounded-xl text-base font-medium w-full text-left transition-all duration-300 ${
                  activeSection === item
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ────────────────────────────────────────────── */}
      <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-12 overflow-hidden"
        style={{ backgroundColor: '#FAFAF7' }}>

        {/* Ambient floating blobs */}
        <div className="absolute top-1/4 left-1/6 w-80 h-80 rounded-full blur-3xl animate-blob-drift-a"
          style={{ backgroundColor: 'rgba(251,191,36,0.12)' }} />
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full blur-3xl animate-blob-drift-b"
          style={{ backgroundColor: 'rgba(253,186,116,0.10)' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl animate-blob-drift-c"
          style={{ backgroundColor: 'rgba(214,211,209,0.25)' }} />

        {/* Decorative geometric outlines */}
        <div className="absolute top-24 right-16 w-20 h-20 rounded-full border border-stone-200/60 animate-spin-glacial hidden lg:block" />
        <div className="absolute bottom-28 left-14 w-12 h-12 border border-amber-200/50 rotate-45 animate-float-gentle hidden lg:block" />
        <div className="absolute top-40 left-24 w-6 h-6 rounded-full bg-amber-200/40 animate-pulse hidden lg:block" />

        {/* Content */}
        <div className="text-center animate-fade-in delay-100 relative z-10 max-w-3xl mx-auto px-4 w-full">

          {/* Avatar */}
          <div className="mb-10 flex justify-center">
            <div className="relative">
              {/* Spinning dashed ring */}
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-stone-200/70 animate-spin-glacial" />
              {/* Solid outer ring */}
              <div className="absolute -inset-2 rounded-full border border-stone-200/50" />
              {/* Photo frame */}
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.10)] ring-4 ring-white">
                <picture>
                  <img
                    src="/pic 1.jpg"
                    alt="Ahmed Hassan"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              {/* Online badge */}
              <span className="absolute bottom-1 right-1 md:bottom-2 md:right-2 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>
          </div>

          {/* Role chip */}
          <div className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <span className="text-stone-400 text-xs font-semibold tracking-widest uppercase">Frontend Developer</span>
          </div>

          {/* Name */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-stone-800 leading-tight tracking-tight mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ahmed Hassan
          </h1>

          {/* Tagline */}
          <p className="text-base md:text-lg text-stone-500 max-w-xl mx-auto leading-relaxed mb-10">
            An enthusiastic frontend developer looking to learn new technology to implement and improve modern UI/UX experiences.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="p-3.5 rounded-2xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="inline-flex items-center gap-2 bg-stone-800 text-white px-6 py-3.5 rounded-2xl hover:bg-stone-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 font-medium text-sm shadow-md"
            >
              View My Work
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce-subtle hidden sm:flex">
          <span className="text-stone-400 text-xs tracking-widest uppercase font-medium">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-stone-300 to-transparent" />
        </div>
      </section>

      {/* ─── PROJECTS SECTION ────────────────────────────────────────── */}
      <section id="projects" className="py-24 px-4 relative overflow-hidden"
        style={{ backgroundColor: '#F4EDE0' }}>

        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(circle, #B8A99A 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Warm blob accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(251,191,36,0.08)' }} />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in delay-200">
          {/* Section header */}
          <div className="text-center mb-14">
            <span className="inline-block text-amber-700/70 text-xs font-bold tracking-widest uppercase mb-3">
              My Work
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Featured Projects
            </h2>
            <div className="mt-5 mx-auto w-14 h-0.5 rounded-full" style={{ backgroundColor: '#D4A96A' }} />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-7 border border-stone-100 hover:-translate-y-2 transition-all duration-500"
                style={{
                  boxShadow: '0 2px 16px rgba(0,0,0,0.055)',
                  transition: 'box-shadow 0.4s ease, transform 0.4s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.11)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.055)'}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm"
                  style={{ backgroundColor: '#292524' }}>
                  <Code className="w-5 h-5 text-white" />
                </div>

                {/* Card number accent */}
                <div className="text-xs font-bold tracking-widest text-stone-300 mb-2 uppercase">
                  Project {String(index + 1).padStart(2, '0')}
                </div>

                <h3
                  className="text-lg font-bold mb-3 text-stone-800 group-hover:text-amber-800 transition-colors duration-300 leading-snug"
                >
                  {project.title}
                </h3>
                <p className="text-stone-500 mb-6 leading-relaxed text-sm flex-grow">
                  {project.description}
                </p>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 hover:text-amber-700 transition-all duration-300 group-hover:translate-x-1 border-b border-stone-200 hover:border-amber-400 pb-0.5"
                >
                  {project.linkText}
                  <ExternalLink className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ───────────────────────────────────────────── */}
      <section id="about" className="py-24 px-4 relative overflow-hidden bg-white">

        {/* Corner shape accents */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-bl-full opacity-50"
          style={{ backgroundColor: '#FEF3C7' }} />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-tr-full opacity-60"
          style={{ backgroundColor: '#FAFAF7' }} />

        <div className="max-w-5xl mx-auto relative z-10 animate-fade-in delay-200">
          {/* Section header */}
          <div className="text-center mb-14">
            <span className="inline-block text-amber-700/70 text-xs font-bold tracking-widest uppercase mb-3">
              Who I Am
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              About Me
            </h2>
            <div className="mt-5 mx-auto w-14 h-0.5 rounded-full" style={{ backgroundColor: '#D4A96A' }} />
          </div>

          {/* Bio card */}
          <div className="mb-14">
            <div
              className="rounded-3xl p-8 md:p-12 border border-stone-100"
              style={{ backgroundColor: '#FAFAF7', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
            >
              <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-3xl mx-auto text-center">
                I'm Ahmed Hassan, a passionate frontend developer focused on building responsive and elegant web apps.
                With a strong interest in design systems and UI/UX, I enjoy solving real-world problems through clean,
                maintainable code. I am always excited to learn new technologies and continuously improve as a developer.
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-14">
            <h3
              className="text-2xl font-bold text-center mb-10 text-stone-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Technical Skills
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2.5 bg-white border border-stone-200 text-stone-700 px-6 py-3.5 rounded-2xl hover:bg-stone-800 hover:text-white hover:border-stone-800 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-default select-none"
                  style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
                >
                  <span className="text-amber-600 group-hover:text-amber-300 transition-colors duration-300 group-hover:scale-110 transition-transform">
                    {skill.icon}
                  </span>
                  <span className="font-semibold">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div className="text-center">
            <a
              href="/resume.pdf"
              // href="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" // Option 2: Google Drive
              // href="https://your-website.com/path/to/resume.pdf"                  // Option 3: External URL
              download="Ahmed_Hassan_Resume.pdf"
              // target="_blank" // Add this for external URLs that open in new tab
              className="group inline-flex items-center bg-stone-800 text-white px-8 py-4 rounded-2xl hover:bg-stone-700 hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg text-base font-semibold"
            >
              <Download className="w-5 h-5 mr-3 group-hover:animate-bounce" />
              Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-4 relative overflow-hidden"
        style={{ backgroundColor: '#F4EDE0' }}>

        {/* Ambient blobs */}
        <div className="absolute top-12 left-12 w-56 h-56 rounded-full blur-3xl animate-blob-drift-a"
          style={{ backgroundColor: 'rgba(251,191,36,0.10)' }} />
        <div className="absolute bottom-12 right-12 w-64 h-64 rounded-full blur-3xl animate-blob-drift-b"
          style={{ backgroundColor: 'rgba(253,186,116,0.08)' }} />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #B8A99A 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        <div className="max-w-xl mx-auto relative z-10 animate-fade-in delay-200">
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="inline-block text-amber-700/70 text-xs font-bold tracking-widest uppercase mb-3">
              Let's Talk
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Get In Touch
            </h2>
            <div className="mt-5 mx-auto w-14 h-0.5 rounded-full" style={{ backgroundColor: '#D4A96A' }} />
            <p className="text-stone-500 mt-6 text-base md:text-lg max-w-md mx-auto leading-relaxed">
              Ready to bring your ideas to life? Let's collaborate and create something amazing together.
            </p>
          </div>

          {/* Form card */}
          <div
            ref={formRef}
            className="bg-white rounded-3xl p-7 md:p-10 border border-stone-100"
            style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.07)' }}
          >
            <div className="space-y-5" onKeyPress={handleKeyPress}>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-2 tracking-wide">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3.5 border rounded-xl text-stone-800 placeholder-stone-400 text-base transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.name && !validateName(formData.name)
                      ? 'border-red-300 bg-red-50/40 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                      : 'border-stone-200 bg-stone-50 hover:border-stone-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white'
                  }`}
                  placeholder="Enter your full name"
                />
                {formData.name && !validateName(formData.name) && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">Name can only contain letters and spaces</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2 tracking-wide">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3.5 border rounded-xl text-stone-800 placeholder-stone-400 text-base transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.email && !validateEmail(formData.email)
                      ? 'border-red-300 bg-red-50/40 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                      : 'border-stone-200 bg-stone-50 hover:border-stone-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white'
                  }`}
                  placeholder="your.email@example.com"
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium">Please enter a valid email address</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-stone-700 mb-2 tracking-wide">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className={`w-full px-5 py-3.5 border rounded-xl text-stone-800 placeholder-stone-400 resize-none text-base transition-all duration-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.message.trim() === '' && formData.message !== ''
                      ? 'border-red-300 bg-red-50/40 focus:ring-2 focus:ring-red-200 focus:border-red-400'
                      : 'border-stone-200 bg-stone-50 hover:border-stone-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 focus:bg-white'
                  }`}
                  placeholder="Tell me about your project or just say hello..."
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group w-full bg-stone-800 text-white py-4 px-8 rounded-xl font-semibold text-base hover:bg-stone-700 hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
              >
                <span className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <Mail className="w-4 h-4 ml-2.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>

            
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-stone-800 text-stone-400 py-8 px-4 text-center">
        <p className="text-sm">
          Crafted with care by{' '}
          <span className="text-amber-300 font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ahmed Hassan
          </span>
          {' '}· {new Date().getFullYear()}
        </p>
      </footer>

      {/* ─── BACK TO TOP ─────────────────────────────────────────────── */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-6 sm:right-8 bg-stone-800 text-white p-3 rounded-full hover:bg-stone-700 hover:-translate-y-1 hover:scale-110 transition-all duration-300 shadow-lg z-40"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* ─── NOTIFICATION TOAST ──────────────────────────────────────── */}
      {notification.show && (
        <div
          className={`fixed top-20 right-4 p-4 rounded-2xl shadow-xl z-50 max-w-xs sm:max-w-sm border transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {notification.message}
            </div>
            <button
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              className="text-current opacity-60 hover:opacity-100 transition-opacity shrink-0 mt-0.5"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── GLOBAL STYLES & FONTS ───────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        /* ── Fade-in ── */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-fade-in {
          animation: fade-in 0.9s cubic-bezier(0.22,1,0.36,1) both;
          will-change: opacity, transform;
        }

        /* ── Animation delay utilities ── */
        .delay-100 { animation-delay: 0.10s; }
        .delay-200 { animation-delay: 0.20s; }
        .delay-300 { animation-delay: 0.30s; }
        .delay-400 { animation-delay: 0.40s; }

        /* ── Blob drifts ── */
        @keyframes blob-drift-a {
          0%,100% { transform: translate(0px, 0px) scale(1);    }
          33%      { transform: translate(28px,-18px) scale(1.04); }
          66%      { transform: translate(-16px,14px) scale(0.97); }
        }
        @keyframes blob-drift-b {
          0%,100% { transform: translate(0px, 0px) scale(1);     }
          33%      { transform: translate(-22px,18px) scale(1.03); }
          66%      { transform: translate(18px,-14px) scale(0.98); }
        }
        @keyframes blob-drift-c {
          0%,100% { transform: scale(1);    }
          50%      { transform: scale(1.07); }
        }
        .animate-blob-drift-a { animation: blob-drift-a 14s ease-in-out infinite; }
        .animate-blob-drift-b { animation: blob-drift-b 17s ease-in-out infinite; }
        .animate-blob-drift-c { animation: blob-drift-c 11s ease-in-out infinite; }

        /* ── Decorative spins ── */
        @keyframes spin-glacial {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        .animate-spin-glacial { animation: spin-glacial 28s linear infinite; }

        /* ── Gentle float ── */
        @keyframes float-gentle {
          0%,100% { transform: rotate(45deg) translateY(0);     }
          50%      { transform: rotate(45deg) translateY(-10px); }
        }
        .animate-float-gentle { animation: float-gentle 7s ease-in-out infinite; }

        /* ── Scroll hint bounce ── */
        @keyframes bounce-subtle {
          0%,100% { transform: translateX(-50%) translateY(0);   }
          50%      { transform: translateX(-50%) translateY(5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 2.4s ease-in-out infinite; }

        /* ── Smooth card hover via JS fallback ── */
        .group:hover { will-change: transform; }

        /* ── Perf: promote blobs to their own layer to avoid layout thrash ── */
        .animate-blob-drift-a,
        .animate-blob-drift-b,
        .animate-blob-drift-c { will-change: transform; }

        /* ── Lazy-loaded images: prevent layout shift with a soft fade-in ── */
        img[loading="lazy"] {
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        img[loading="lazy"].loaded,
        img[loading="lazy"]:not([src=""]) {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;