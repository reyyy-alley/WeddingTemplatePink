// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const playMusicBtn = document.getElementById('playMusic');
const bgMusic = document.getElementById('bgMusic');
const exploreBtn = document.getElementById('exploreBtn');
const openRsvpBtn = document.getElementById('openRsvp');
const closeRsvpBtn = document.getElementById('closeRsvp');
const rsvpModal = document.getElementById('rsvpModal');
const rsvpForm = document.getElementById('rsvpForm');
const confettiCanvas = document.getElementById('confetti-canvas');
const sliderContainer = document.querySelector('.slider-container');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

// Floating Hearts Background
function createHearts() {
  const heartsContainer = document.querySelector('.hearts-background');
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${Math.random() * 100}vh`;
    heart.style.opacity = Math.random();
    heart.style.width = `${Math.random() * 20 + 10}px`;
    heart.style.height = heart.style.width;
    heart.style.animationDuration = `${Math.random() * 15 + 10}s`;
    heartsContainer.appendChild(heart);
  }
}

// Theme Toggle
function toggleTheme() {
  document.body.setAttribute('data-theme', 
    document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
  themeToggle.innerHTML = document.body.getAttribute('data-theme') === 'dark' 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';
}

// Music Toggle
function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
    playMusicBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    bgMusic.pause();
    playMusicBtn.innerHTML = '<i class="fas fa-music"></i>';
  }
}

// Countdown Timer
function updateCountdown() {
  const weddingDate = new Date('June 15, 2025 15:00:00').getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = days.toString().padStart(2, '0');
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Slider Functionality
let currentSlide = 0;
const slideCount = slides.length;

function goToSlide(index) {
  if (index < 0) index = slideCount - 1;
  if (index >= slideCount) index = 0;
  
  sliderContainer.style.transform = `translateX(-${index * 100}%)`;
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
  currentSlide = index;
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

// RSVP Form Submission
async function submitRSVP(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('guestName').value,
    email: document.getElementById('guestEmail').value,
    guests: document.getElementById('guestCount').value,
    attendance: document.querySelector('input[name="attendance"]:checked').value,
    timestamp: new Date().toISOString()
  };

  // Simpan ke Google Sheets (gunakan Google Apps Script)
  try {
    const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      // Tampilkan confetti
      triggerConfetti();
      
      // Tampilkan notifikasi
      alert('Thank you for your RSVP! We look forward to seeing you.');
      
      // Reset form dan tutup modal
      rsvpForm.reset();
      rsvpModal.style.display = 'none';
    } else {
      throw new Error('Failed to submit RSVP');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('There was an error submitting your RSVP. Please try again later.');
  }
}

// Confetti Effect
function triggerConfetti() {
  confettiCanvas.style.display = 'block';
  const confettiSettings = {
    target: 'confetti-canvas',
    max: 150,
    size: 1.5,
    animate: true,
    props: ['circle', 'square', 'triangle', 'line'],
    colors: [[255, 107, 152], [255, 235, 59], [107, 203, 255], [255, 255, 255]],
    clock: 25,
    rotate: true,
    start_from_edge: true,
    respawn: false
  };
  
  const confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();
  
  setTimeout(() => {
    confetti.clear();
    confettiCanvas.style.display = 'none';
  }, 5000);
}

// GSAP Animations
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  
  // Animate sections on scroll
  gsap.utils.toArray('section').forEach(section => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      duration: 1
    });
  });
  
  // Hero text animation
  gsap.from('.couple-name', {
    duration: 1.5,
    y: -50,
    opacity: 0,
    ease: 'power3.out'
  });
  
  gsap.from('.wedding-date', {
    duration: 1.5,
    y: 50,
    opacity: 0,
    delay: 0.5,
    ease: 'power3.out'
  });
  
  gsap.from('.countdown-box', {
    duration: 1,
    y: 30,
    opacity: 0,
    stagger: 0.2,
    delay: 1,
    ease: 'back.out'
  });
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
playMusicBtn.addEventListener('click', toggleMusic);
exploreBtn.addEventListener('click', () => {
  document.querySelector('.story').scrollIntoView({ behavior: 'smooth' });
});
openRsvpBtn.addEventListener('click', () => {
  rsvpModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
});
closeRsvpBtn.addEventListener('click', () => {
  rsvpModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});
window.addEventListener('click', (e) => {
  if (e.target === rsvpModal) {
    rsvpModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
rsvpForm.addEventListener('submit', submitRSVP);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createHearts();
  initAnimations();
  setInterval(updateCountdown, 1000);
  updateCountdown();
  
  // Auto-slide every 5 seconds
  setInterval(nextSlide, 5000);
});

// Load Confetti library dynamically
const confettiScript = document.createElement('script');
confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
document.head.appendChild(confettiScript);