import emailjs from '@emailjs/browser';

/**
 * Muhammad Hasil Portfolio - SPA Page Router & Frame Animation Engine
 * Preloads 192 frames, handles page switching, and drives background canvas animation
 */

const TOTAL_FRAMES = 192;
const FRAME_DIRECTORY = '/frames';

// Canvas & Context Setup
const canvas = document.getElementById('animation-canvas');
const ctx = canvas ? canvas.getContext('2d', { alpha: false }) : null;

const images = [];
let loadedCount = 0;
let currentFrame = 1;
let targetFrame = 1;

// Target Keyframe Mapping for Each Page View
const pageFrameTargets = {
  home: 1,
  about: 45,
  projects: 95,
  services: 135,
  contact: 180
};

let activePageId = 'home';

/**
 * Format frame index with 4-digit zero padding (e.g. frame_0001.png)
 */
function getFramePath(index) {
  const paddedIndex = String(index).padStart(4, '0');
  return `${FRAME_DIRECTORY}/frame_${paddedIndex}.png`;
}

/**
 * Preload all 192 frames into memory
 */
function preloadFrames() {
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFramePath(i);

    img.onload = () => {
      loadedCount++;
      if (i === 1 || loadedCount === 1) {
        renderFrame(1);
      }
    };

    images.push(img);
  }
}

/**
 * Handle high-DPI canvas resizing
 */
function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;

  ctx.scale(dpr, dpr);
  renderFrame(Math.round(currentFrame));
}

/**
 * Render target frame on canvas with aspect cover scaling
 */
function renderFrame(frameIndex) {
  if (!ctx) return;
  const index = Math.max(1, Math.min(TOTAL_FRAMES, frameIndex)) - 1;
  const img = images[index];

  if (!img || !img.complete || img.naturalWidth === 0) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const imgW = img.naturalWidth || 1280;
  const imgH = img.naturalHeight || 720;

  const imgRatio = imgW / imgH;
  const viewportRatio = vw / vh;

  let drawW, drawH;

  if (viewportRatio > imgRatio) {
    drawW = vw;
    drawH = vw / imgRatio;
  } else {
    drawH = vh;
    drawW = vh * imgRatio;
  }

  const offsetPx = (vw - drawW) / 2;
  const offsetPy = (vh - drawH) / 2;

  ctx.fillStyle = '#070605';
  ctx.fillRect(0, 0, vw, vh);
  ctx.drawImage(img, offsetPx, offsetPy, drawW, drawH);
}

/**
 * Switch Active Page View
 */
function navigateToPage(pageId) {
  const cleanId = pageId.replace('#', '').replace('page-', '');

  // Handle reviews navigation (scrolls to reviews section on home page)
  if (cleanId === 'reviews') {
    navigateToPage('home');
    const reviewsEl = document.getElementById('reviews');
    if (reviewsEl) {
      setTimeout(() => {
        reviewsEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === '#reviews') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    return;
  }

  const targetPageEl = document.getElementById(`page-${cleanId}`);
  if (!targetPageEl) return;

  activePageId = cleanId;

  // Update navbar links active state
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href').replace('#', '');
    if (linkHref === cleanId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Hide all pages, show target page
  const pageViews = document.querySelectorAll('.page-view');
  pageViews.forEach(page => {
    if (page.id === `page-${cleanId}`) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  // Smoothly update background frame target
  if (pageFrameTargets[cleanId] !== undefined) {
    targetFrame = pageFrameTargets[cleanId];
  }

  // Scroll to top of view
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Map document scroll offset to micro frame changes within active page
 */
function updateScrollTarget() {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  if (maxScroll > 0) {
    const scrollRatio = Math.max(0, Math.min(1, scrollY / maxScroll));
    const baseFrame = pageFrameTargets[activePageId] || 1;
    // Scrub within a range of 20 frames per page on scroll
    targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, baseFrame + scrollRatio * 20));
  }
}

/**
 * Setup Click Router for links
 */
function setupNavigationRouter() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        navigateToPage(href);
      }
    }
  });
}

/**
 * Render animation loop with LERP physics
 */
function animate() {
  const ease = 0.12;
  currentFrame += (targetFrame - currentFrame) * ease;

  renderFrame(Math.round(currentFrame));
  requestAnimationFrame(animate);
}

/**
 * Setup Interactive Reviews Slider Carousel
 */
function setupReviewsSlider() {
  const track = document.getElementById('reviews-slider-track');
  const prevBtn = document.getElementById('reviews-prev-btn');
  const nextBtn = document.getElementById('reviews-next-btn');
  const dotsContainer = document.getElementById('reviews-dots-container');

  if (!track) return;

  const slides = track.querySelectorAll('.review-slide');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayTimer = null;

  const getSlidesPerView = () => (window.innerWidth <= 992 ? 1 : 3);

  const createDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIndex = Math.max(1, totalSlides - getSlidesPerView() + 1);

    for (let i = 0; i < maxIndex; i++) {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to review slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const goToSlide = (index) => {
    const slidesPerView = getSlidesPerView();
    const maxIndex = Math.max(0, totalSlides - slidesPerView);
    currentIndex = Math.max(0, Math.min(index, maxIndex));

    const slideWidthPercentage = 100 / slidesPerView;
    const gapOffset = (24 * currentIndex) / slidesPerView;
    track.style.transform = `translateX(calc(-${currentIndex * slideWidthPercentage}% - ${gapOffset}px))`;

    updateDots();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, totalSlides - getSlidesPerView());
      const target = currentIndex === 0 ? maxIndex : currentIndex - 1;
      goToSlide(target);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const maxIndex = Math.max(0, totalSlides - getSlidesPerView());
      const target = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      goToSlide(target);
    });
  }

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      const maxIndex = Math.max(0, totalSlides - getSlidesPerView());
      const target = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      goToSlide(target);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  };

  const wrapper = document.querySelector('.reviews-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
  }

  createDots();
  goToSlide(0);
  startAutoPlay();
  window.addEventListener('resize', () => {
    createDots();
    goToSlide(currentIndex);
  });
}

/**
 * Setup Technology Filter Tabs for Projects
 */
function setupProjectTabs() {
  const tabsContainer = document.getElementById('projects-tabs');
  if (!tabsContainer) return;

  const tabBtns = tabsContainer.querySelectorAll('.project-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Setup Scroll Reveal Animations with IntersectionObserver
 */
function setupScrollRevealAnimations() {
  const elementsToAnimate = document.querySelectorAll(
    '.service-card, .project-card, .info-card, .skill-card, .hero-card, .feature-card, .review-card-pro, .section-title, .about-headline, .closing-quote'
  );

  elementsToAnimate.forEach((el, index) => {
    if (!el.classList.contains('scroll-reveal') &&
        !el.classList.contains('scroll-reveal-left') &&
        !el.classList.contains('scroll-reveal-right') &&
        !el.classList.contains('scroll-reveal-scale')) {
      
      const mod = index % 3;
      if (mod === 0) el.classList.add('scroll-reveal');
      else if (mod === 1) el.classList.add('scroll-reveal-scale');
      else el.classList.add('scroll-reveal');
      
      if (index % 4 === 1) el.classList.add('delay-1');
      if (index % 4 === 2) el.classList.add('delay-2');
      if (index % 4 === 3) el.classList.add('delay-3');
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );
  elementsToAnimate.forEach(el => observer.observe(el));
}

/**
 * Setup EmailJS Contact Form Handler
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-submit-text') : null;
  const statusMsg = document.getElementById('contact-status-msg');

  // Environment variables from Vite (.env / Vercel Environment Variables)
  const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const setStatus = (type, message) => {
    if (!statusMsg) return;
    statusMsg.className = `contact-status-msg ${type}`;
    statusMsg.textContent = message;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('from_name');
    const emailInput = document.getElementById('from_email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    // Field validation
    if (!nameInput?.value.trim() || !emailInput?.value.trim() || !subjectInput?.value.trim() || !messageInput?.value.trim()) {
      setStatus('error', 'Please fill out all required fields before sending.');
      return;
    }

    // Check placeholder / missing variables
    if (!serviceID || serviceID.includes('your_') || !templateID || templateID.includes('your_') || !publicKey || publicKey.includes('your_')) {
      console.warn('EmailJS credentials are missing or set to placeholders in .env.');
      setStatus('info', 'Thank you for reaching out! (Note: Live email delivery requires your EmailJS keys in .env).');
      form.reset();
      return;
    }

    // Disable button & show loading state
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending...';
    setStatus('info', 'Sending your message to Muhammad Hasil...');

    try {
      await emailjs.sendForm(serviceID, templateID, form, publicKey);

      setStatus('success', '✓ Thank you! Your message has been sent successfully to my inbox.');
      form.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('error', '❌ Unable to send message right now. Please try again or reach out directly.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
    }
  });
}

// Initialize Router, Slider, Tabs, Contact Form & Animation Engine
setupNavigationRouter();
setupReviewsSlider();
setupProjectTabs();
setupScrollRevealAnimations();
setupContactForm();
preloadFrames();
resizeCanvas();
updateScrollTarget();
window.addEventListener('scroll', updateScrollTarget, { passive: true });
window.addEventListener('resize', resizeCanvas);
requestAnimationFrame(animate);
