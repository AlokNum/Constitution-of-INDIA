/**
 * Samvidhan Website - Core Interactions & Polish
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Styling on Scroll ---
  const header = document.getElementById('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // --- Mobile Navigation Menu ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- Showcase Screenshot Slider ---
  const controlTabs = document.querySelectorAll('.control-tab');
  const slides = document.querySelectorAll('.screenshot-slide');
  let currentSlideIndex = 0;
  let autoRotationTimer = null;
  const rotationDelay = 5000; // 5 seconds per slide

  const showSlide = (index) => {
    // Boundary check
    if (index < 0 || index >= slides.length) return;

    // Reset current active states
    controlTabs.forEach(tab => tab.classList.remove('active'));
    slides.forEach(slide => slide.classList.remove('active'));

    // Set new active states
    controlTabs[index].classList.add('active');
    slides[index].classList.add('active');
    currentSlideIndex = index;
  };

  const startAutoRotation = () => {
    autoRotationTimer = setInterval(() => {
      let nextIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(nextIndex);
    }, rotationDelay);
  };

  const stopAutoRotation = () => {
    if (autoRotationTimer) {
      clearInterval(autoRotationTimer);
    }
  };

  // Add click listeners to tabs
  controlTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const slideIndex = parseInt(tab.getAttribute('data-slide'), 10);
      showSlide(slideIndex);
      
      // Stop automatic rotation once the user manually interacts
      stopAutoRotation();
      startAutoRotation(); // Reset timer so it stays on user selection for another 5s
    });
  });

  // Initialize Showcase Slider
  if (slides.length > 0) {
    showSlide(0);
    startAutoRotation();
  }
});
