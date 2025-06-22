import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useIntersectionObserver } from 'react-intersection-observer';
import { 
  FiActivity, 
  FiTarget, 
  FiTrendingUp, 
  FiUsers, 
  FiAward, 
  FiStar,
  FiPlay,
  FiCheck,
  FiArrowRight,
  FiMenu,
  FiX
} from 'react-icons/fi';
import './LandingPage.css';

const LandingPage = () => {
  console.log('🔧 LandingPage: Component initializing...');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Features data
  const features = [
    {
      icon: <FiActivity />,
      title: "AI-Powered Workouts",
      description: "Get personalized workout plans designed by AI based on your goals, fitness level, and equipment."
    },
    {
      icon: <FiTarget />,
      title: "Smart Nutrition",
      description: "Track macros, discover healthy recipes, and get meal plans tailored to your dietary preferences."
    },
    {
      icon: <FiTrendingUp />,
      title: "Progress Analytics",
      description: "Detailed insights into your fitness journey with charts, trends, and performance metrics."
    },
    {
      icon: <FiUsers />,
      title: "Social Community",
      description: "Connect with like-minded fitness enthusiasts, share achievements, and stay motivated."
    },
    {
      icon: <FiAward />,
      title: "Achievement System",
      description: "Unlock badges, complete challenges, and climb leaderboards as you reach your goals."
    },
    {
      icon: <FiStar />,
      title: "Expert Guidance",
      description: "Access to certified trainers and nutritionists for professional advice and support."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      image: "/images/testimonial1.jpg",
      content: "FitGenius transformed my fitness journey! The AI-powered plans are incredibly effective and the community support is amazing.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Personal Trainer",
      image: "/images/testimonial2.jpg", 
      content: "As a trainer, I recommend FitGenius to all my clients. The analytics and progress tracking are game-changing.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Busy Professional",
      image: "/images/testimonial3.jpg",
      content: "Finally found an app that adapts to my crazy schedule. The meal planning feature saves me hours every week!",
      rating: 5
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <a href="#" className="nav-logo">
            <span className="logo-icon">🏋️</span>
            <span className="logo-text">FitGenius</span>
          </a>

          {/* Desktop Navigation */}
          <div className="nav-links desktop-nav">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#testimonials">Reviews</a>
            <a href="#pricing">Pricing</a>
          </div>

          {/* Auth Buttons */}
          <div className="nav-auth desktop-nav">
            <a href="#login" className="btn-secondary">Login</a>
            <a href="#register" className="btn-primary">Sign Up Free</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            className="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#testimonials" onClick={() => setIsMenuOpen(false)}>Reviews</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a href="#login" onClick={() => setIsMenuOpen(false)}>Login</a>
            <a href="#register" className="btn-primary" onClick={() => setIsMenuOpen(false)}>
              Sign Up Free
            </a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className="hero-title">
              Transform Your Body,
              <span className="gradient-text"> Elevate Your Life</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="hero-subtitle">
              Join thousands of fitness enthusiasts using AI-powered workouts, 
              smart nutrition tracking, and a supportive community to achieve their goals.
            </motion.p>

            <motion.div variants={fadeInUp} className="hero-stats">
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Workouts Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">User Rating</span>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="hero-actions">
              <a href="#register" className="btn-primary large">
                Start Your Journey Free
                <FiArrowRight />
              </a>
              <button className="btn-play">
                <FiPlay />
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="phone-mockup">
              <div className="app-mockup-visual">
                <div className="mockup-screen">
                  <div className="mockup-header">
                    <div className="mockup-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="mockup-title">FitGenius</div>
                  </div>
                  <div className="mockup-content">
                    <div className="mockup-chart">
                      <div className="chart-bar" style={{height: '60%'}}></div>
                      <div className="chart-bar" style={{height: '80%'}}></div>
                      <div className="chart-bar" style={{height: '45%'}}></div>
                      <div className="chart-bar" style={{height: '90%'}}></div>
                      <div className="chart-bar" style={{height: '70%'}}></div>
                    </div>
                    <div className="mockup-stats">
                      <div className="stat-item">
                        <FiActivity size={16} />
                        <span>2,450 cal</span>
                      </div>
                      <div className="stat-item">
                        <FiTarget size={16} />
                        <span>8/10 goals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-elements">
              <div className="floating-card card-1">
                <FiActivity className="card-icon" />
                <span>💪 Workout Complete!</span>
              </div>
              <div className="floating-card card-2">
                <FiAward className="card-icon" />
                <span>🏆 New Achievement!</span>
              </div>
              <div className="floating-card card-3">
                <FiTrendingUp className="card-icon" />
                <span>📈 Strength +25%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Everything You Need to Succeed</h2>
            <p>Comprehensive tools and features designed to make fitness fun, effective, and sustainable.</p>
          </motion.div>

          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div key={index} className="feature-card" variants={fadeInUp}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <motion.div 
              className="about-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2>Why Choose FitGenius?</h2>
              <p>
                We combine cutting-edge AI technology with proven fitness science to create 
                personalized experiences that adapt to your unique needs and goals.
              </p>
              
              <div className="about-features">
                <div className="about-feature">
                  <FiCheck className="check-icon" />
                  <span>Personalized AI recommendations</span>
                </div>
                <div className="about-feature">
                  <FiCheck className="check-icon" />
                  <span>Expert-designed workout programs</span>
                </div>
                <div className="about-feature">
                  <FiCheck className="check-icon" />
                  <span>Comprehensive nutrition tracking</span>
                </div>
                <div className="about-feature">
                  <FiCheck className="check-icon" />
                  <span>Supportive community platform</span>
                </div>
              </div>

              <a href="#register" className="btn-primary">
                Get Started Today
                <FiArrowRight />
              </a>
            </motion.div>

            <motion.div 
              className="about-visual"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ ...fadeInUp, transition: { duration: 0.6, delay: 0.2 } }}
            >
              <img src="/images/about-illustration.svg" alt="About FitGenius" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied users who've transformed their lives with FitGenius.</p>
          </motion.div>

          <div className="testimonials-container">
            <motion.div 
              key={currentTestimonial}
              className="testimonial-card"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <FiStar key={i} className="star-filled" />
                  ))}
                </div>
                <p>"{testimonials[currentTestimonial].content}"</p>
                <div className="testimonial-author">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${testimonials[currentTestimonial].name}&background=667eea&color=fff`;
                    }}
                  />
                  <div>
                    <h4>{testimonials[currentTestimonial].name}</h4>
                    <span>{testimonials[currentTestimonial].role}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Choose Your Plan</h2>
            <p>Start free and upgrade when you're ready for more features.</p>
          </motion.div>

          <motion.div 
            className="pricing-cards"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="pricing-card" variants={fadeInUp}>
              <h3>Free</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">0</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                <li><FiCheck /> Basic workout plans</li>
                <li><FiCheck /> Exercise library access</li>
                <li><FiCheck /> Progress tracking</li>
                <li><FiCheck /> Community access</li>
              </ul>
              <a href="#register" className="btn-secondary full-width">
                Get Started Free
              </a>
            </motion.div>

            <motion.div className="pricing-card featured" variants={fadeInUp}>
              <div className="popular-badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">9.99</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                <li><FiCheck /> Everything in Free</li>
                <li><FiCheck /> AI-powered personalization</li>
                <li><FiCheck /> Advanced analytics</li>
                <li><FiCheck /> Nutrition tracking</li>
                <li><FiCheck /> Premium support</li>
              </ul>
              <a href="#register" className="btn-primary full-width">
                Start Pro Trial
              </a>
            </motion.div>

            <motion.div className="pricing-card" variants={fadeInUp}>
              <h3>Premium</h3>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">19.99</span>
                <span className="period">/month</span>
              </div>
              <ul className="features-list">
                <li><FiCheck /> Everything in Pro</li>
                <li><FiCheck /> 1-on-1 coaching</li>
                <li><FiCheck /> Custom meal plans</li>
                <li><FiCheck /> Priority support</li>
                <li><FiCheck /> Advanced integrations</li>
              </ul>
              <a href="#register" className="btn-secondary full-width">
                Go Premium
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2>Ready to Transform Your Life?</h2>
            <p>
              Join thousands of users who've already started their fitness journey with FitGenius. 
              Start free today and see the difference AI-powered fitness can make.
            </p>
            <div className="cta-actions">
              <a href="#register" className="btn-primary large">
                Start Your Free Journey
                <FiArrowRight />
              </a>
              <span className="cta-note">No credit card required • Free forever plan available</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <a href="#" className="footer-logo">
                <span className="logo-icon">🏋️</span>
                <span className="logo-text">FitGenius</span>
              </a>
              <p>Your AI-powered fitness companion for a healthier, stronger you.</p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="/docs">API Docs</a>
                <a href="/changelog">Changelog</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="/help">Help Center</a>
                <a href="/contact">Contact Us</a>
                <a href="/status">Status</a>
                <a href="/community">Community</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Service</a>
                <a href="/cookies">Cookie Policy</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 FitGenius. All rights reserved.</p>
            <div className="footer-social">
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="YouTube">📺</a>
              <a href="#" aria-label="Discord">💬</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 