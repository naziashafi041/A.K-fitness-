/**
 * AK FITNESS - OFFICIAL INTERACTIVE JAVASCRIPT
 * Full-featured gym web application logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initScrollSpy();
  initAnimatedCounters();
  initScheduleFilter();
  initPricingToggle();
  initTestimonialsSlider();
  initBmiCalculator();
  initModals();
  initFormsAndToasts();
  initBackToTop();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  const toggleMenu = () => {
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      toggleMenu();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/* ==========================================================================
   3. ANIMATED COUNTER METRICS
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  let hasAnimated = false;

  const animate = () => {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 2000;
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const stepValue = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          counter.textContent = target.toLocaleString();
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString();
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animate();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-bar') || counters[0];
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   4. INTERACTIVE WEEKLY CLASS TIMETABLE FILTER
   ========================================================================== */
function initScheduleFilter() {
  const dayButtons = document.querySelectorAll('.day-btn');
  const catButtons = document.querySelectorAll('.cat-btn');
  const cards = document.querySelectorAll('.schedule-card');

  if (!cards.length) return;

  let currentDay = 'all';
  let currentCat = 'all';

  const applyFilters = () => {
    cards.forEach(card => {
      const cardDays = card.getAttribute('data-day').toLowerCase().split(' ');
      const cardCat = card.getAttribute('data-cat').toLowerCase();

      const matchesDay = (currentDay === 'all') || cardDays.includes(currentDay);
      const matchesCat = (currentCat === 'all') || (cardCat === currentCat);

      if (matchesDay && matchesCat) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });
  };

  dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dayButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDay = btn.getAttribute('data-day').toLowerCase();
      applyFilters();
    });
  });

  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.getAttribute('data-cat').toLowerCase();
      applyFilters();
    });
  });
}

/* ==========================================================================
   5. MEMBERSHIP PRICING BILLING TOGGLE (Monthly vs. Annual 20% Off)
   ========================================================================== */
function initPricingToggle() {
  const toggleSwitch = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('monthly-label');
  const annualLabel = document.getElementById('annual-label');
  const amounts = document.querySelectorAll('.pricing-amount');
  const periods = document.querySelectorAll('.pricing-period');

  if (!toggleSwitch) return;

  let isAnnual = false;

  const updatePricing = () => {
    amounts.forEach(amt => {
      const monthlyPrice = amt.getAttribute('data-monthly');
      const annualPrice = amt.getAttribute('data-annual');
      amt.textContent = isAnnual ? annualPrice : monthlyPrice;
    });

    periods.forEach(prd => {
      prd.textContent = isAnnual ? '/ month (billed yearly)' : '/ month';
    });

    if (isAnnual) {
      toggleSwitch.classList.add('annual');
      monthlyLabel?.classList.remove('active');
      annualLabel?.classList.add('active');
    } else {
      toggleSwitch.classList.remove('annual');
      monthlyLabel?.classList.add('active');
      annualLabel?.classList.remove('active');
    }
  };

  toggleSwitch.addEventListener('click', () => {
    isAnnual = !isAnnual;
    updatePricing();
  });

  monthlyLabel?.addEventListener('click', () => {
    isAnnual = false;
    updatePricing();
  });

  annualLabel?.addEventListener('click', () => {
    isAnnual = true;
    updatePricing();
  });
}

/* ==========================================================================
   6. TESTIMONIALS SLIDER / CAROUSEL
   ========================================================================== */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Build dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  const goToSlide = (index) => {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  const startAutoplay = () => {
    autoplayTimer = setInterval(nextSlide, 5500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Simple Touch Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
      resetAutoplay();
    }
  }, { passive: true });

  startAutoplay();
}

/* ==========================================================================
   7. INTERACTIVE BMI & FITNESS GOAL CALCULATOR
   ========================================================================== */
function initBmiCalculator() {
  const heightInput = document.getElementById('calc-height');
  const weightInput = document.getElementById('calc-weight');
  const calcBtn = document.getElementById('btn-calculate-bmi');
  const resultCircle = document.getElementById('bmi-num-display');
  const statusDisplay = document.getElementById('bmi-status-display');
  const recDisplay = document.getElementById('bmi-rec-display');

  if (!calcBtn || !heightInput || !weightInput) return;

  const calculateBMI = () => {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (isNaN(height) || height <= 0 || isNaN(weight) || weight <= 0) {
      showToast('Please enter valid height and weight values', 'warning');
      return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    resultCircle.textContent = bmi;

    let category = '';
    let recommendation = '';
    let color = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      recommendation = 'Focus on Hypertrophy & Strength Training combined with a caloric surplus meal plan.';
      color = '#fbbf24'; // Gold
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal / Athletic Range';
      recommendation = 'Ideal baseline! Our Crossfit Arena or Strength & Conditioning programs will maximize power & longevity.';
      color = '#00f076'; // Neon Lime
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = 'Overweight';
      recommendation = 'High-Intensity Cardio & HIIT Burn paired with progressive strength training for optimal fat shredding.';
      color = '#f59e0b'; // Amber
    } else {
      category = 'Obesity Zone';
      recommendation = 'Targeted Body Recomposition & 1-on-1 Personal Training with heart-rate monitored workouts.';
      color = '#ef4444'; // Red
    }

    statusDisplay.textContent = category;
    statusDisplay.style.color = color;
    recDisplay.textContent = recommendation;

    const circleEl = document.querySelector('.calc-bmi-circle');
    if (circleEl) {
      circleEl.style.borderColor = color;
      circleEl.style.boxShadow = `0 0 25px ${color}55`;
    }
  };

  calcBtn.addEventListener('click', calculateBMI);
}

/* ==========================================================================
   8. MODALS (Free Trial, Class Details, Bookings)
   ========================================================================== */
const classDetailsData = {
  'strength': {
    title: 'Strength & Hypertrophy',
    intensity: 'High (8.5/10)',
    duration: '60 Minutes',
    calories: '600 - 800 kcal',
    description: 'A scientifically periodized barbell and dumbbell training program focusing on progressive overload, mechanical tension, and explosive power. Tailored for both raw strength gains and muscle sculpting.',
    highlights: ['Deadlifts, squats, bench press stations', 'Olympic Eleiko barbell sets', 'Post-workout hypertrophy isolations', 'Certified CSCS strength coach guidance']
  },
  'crossfit': {
    title: 'Crossfit & Functional Arena',
    intensity: 'Extreme (9.5/10)',
    duration: '50 Minutes',
    calories: '750 - 950 kcal',
    description: 'Constant variance and functional movements executed at high intensity. Includes gymnastic gymnastics, kettlebell snatches, sled pulls, rowing, and box jumps for unrelenting cardiovascular and muscular stamina.',
    highlights: ['Daily WOD (Workout of the Day)', 'Turf track sprint & sled zones', 'Rogue rig with pull-up & muscle-up bars', 'Scalable to all fitness levels']
  },
  'hiit': {
    title: 'Cardio & HIIT Metabolic Burn',
    intensity: 'High (9/10)',
    duration: '45 Minutes',
    calories: '650 - 900 kcal',
    description: 'High-energy interval training with heart-rate telemetry. Cycles through Woodway treadmills, assault bikes, plyometrics, and battle ropes to spike EPOC (afterburn effect) for 24+ hours.',
    highlights: ['Heart-rate screen monitoring', 'Woodway non-motorized curves', 'High-energy sound system & strobe accents', 'Maximum calorie burn per minute']
  },
  'personal': {
    title: '1-on-1 Elite Personal Training',
    intensity: 'Customized (1-10)',
    duration: '60 Minutes',
    calories: '500 - 900 kcal',
    description: 'Bespoke coaching tailored strictly to your anatomical structure, movement screen, and unique targets. Includes full biometric 3D body scans and monthly customized nutrition macros.',
    highlights: ['Detailed movement & mobility screening', 'Customized weekly app program', 'In-depth nutritional counseling', 'Guaranteed milestone accountability']
  },
  'yoga': {
    title: 'Mobility & Athletic Yoga',
    intensity: 'Moderate (5.5/10)',
    duration: '60 Minutes',
    calories: '300 - 450 kcal',
    description: 'Designed specifically for athletes and heavy lifters. Focuses on hip decompression, thoracic rotation, active hamstring flexibility, myofascial release, and diaphragmatic breathing.',
    highlights: ['Spinal decompression drills', 'Deep fascia release techniques', 'Breathwork for central nervous system reset', 'Injury prevention protocols']
  },
  'weightloss': {
    title: 'Body Recomposition & Fat Loss',
    intensity: 'High (8/10)',
    duration: '55 Minutes',
    calories: '600 - 850 kcal',
    description: 'A fusion of compound resistance circuits, steady-state zone 2 cardio, and metabolic conditioning engineered to burn visceral fat while preserving lean muscle mass.',
    highlights: ['Metabolic circuit complexes', 'Weekly body fat & muscle caliper scans', 'Calorie deficit diet templates', 'High-energy group motivation']
  }
};

function initModals() {
  const trialBackdrop = document.getElementById('modal-trial');
  const classBackdrop = document.getElementById('modal-class-details');
  const openTrialBtns = document.querySelectorAll('.js-open-trial');
  const openClassBtns = document.querySelectorAll('.js-open-class-modal');
  const closeBtns = document.querySelectorAll('.modal-close-btn');

  // Open Trial Modal
  openTrialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-plan');
      if (planName && document.getElementById('trial-plan-select')) {
        document.getElementById('trial-plan-select').value = planName;
      }
      trialBackdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Open Class Details Modal
  openClassBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const classKey = btn.getAttribute('data-class');
      const data = classDetailsData[classKey];
      if (data && classBackdrop) {
        document.getElementById('modal-class-title').textContent = data.title;
        document.getElementById('modal-class-intensity').textContent = data.intensity;
        document.getElementById('modal-class-duration').textContent = data.duration;
        document.getElementById('modal-class-calories').textContent = data.calories;
        document.getElementById('modal-class-desc').textContent = data.description;

        const highlightsList = document.getElementById('modal-class-highlights');
        if (highlightsList) {
          highlightsList.innerHTML = '';
          data.highlights.forEach(item => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '0.5rem';
            li.style.marginBottom = '0.5rem';
            li.style.color = 'var(--text-light)';
            li.innerHTML = `<span style="color:var(--neon-lime);">✓</span> ${item}`;
            highlightsList.appendChild(li);
          });
        }

        classBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modals
  const closeModal = () => {
    trialBackdrop?.classList.remove('active');
    classBackdrop?.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  [trialBackdrop, classBackdrop].forEach(backdrop => {
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   9. FORM SUBMISSIONS & TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function initFormsAndToasts() {
  const contactForm = document.getElementById('contact-form');
  const trialForm = document.getElementById('trial-form');
  const newsletterForm = document.getElementById('newsletter-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value;
      contactForm.reset();
      showToast(`Thank you, ${name}! Your inquiry has been sent to our coaches. We will contact you within 2 hours.`, 'success');
    });
  }

  if (trialForm) {
    trialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = trialForm.querySelector('[name="name"]').value;
      const trialModal = document.getElementById('modal-trial');
      trialModal?.classList.remove('active');
      document.body.style.overflow = '';
      trialForm.reset();
      showToast(`Boom! Your Free 3-Day Pass is confirmed, ${name}! Check your SMS for digital barcode entry.`, 'success');
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.reset();
      showToast('You are now subscribed to the AK Fitness VIP Newsletter!', 'success');
    });
  }

  // Reservation buttons on schedule cards
  const reserveBtns = document.querySelectorAll('.js-reserve-spot');
  reserveBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const className = btn.getAttribute('data-class-name') || 'Class';
      showToast(`Spot successfully reserved for ${className}! We look forward to seeing you.`, 'success');
    });
  });
}

function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';

  const icon = type === 'success' ? '⚡' : '⚠️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  // Remove after 4.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4500);
}

/* ==========================================================================
   10. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
