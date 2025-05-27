// Theme Switching
const themeBtn = document.getElementById('themeBtn');
const themeOptions = document.querySelectorAll('.theme-options div');

themeBtn.addEventListener('click', () => {
  document.querySelector('.theme-options').style.display = 
    document.querySelector('.theme-options').style.display === 'block' ? 'none' : 'block';
});

themeOptions.forEach(option => {
  option.addEventListener('click', () => {
    document.body.setAttribute('data-theme', option.dataset.theme);
    document.querySelector('.theme-options').style.display = 'none';
  });
});

// Music Toggle
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

musicBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    bgMusic.pause();
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
  }
});

// Countdown Timer
function updateCountdown() {
  const weddingDate = new Date('December 12, 2024 08:00:00').getTime();
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

setInterval(updateCountdown, 1000);
updateCountdown();

// Gallery Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentSlide = 0;

function goToSlide(n) {
  slider.style.transform = `translateX(-${n * 100}%)`;
  slides.forEach(slide => slide.classList.remove('active'));
  slides[n].classList.add('active');
  currentSlide = n;
}

prevBtn.addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  goToSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  goToSlide(currentSlide);
});

// Auto-slide every 5 seconds
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  goToSlide(currentSlide);
}, 5000);

// RSVP Form Submission
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Here you would typically send the data to a server
  alert('Terima kasih atas konfirmasinya! Kami tidak sabar bertemu dengan Anda.');
  this.reset();
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
  gsap.from('.couple-name', { 
    duration: 1.5, 
    y: -50, 
    opacity: 0, 
    ease: 'back.out(1.7)' 
  });
  
  gsap.from('.wedding-date', { 
    duration: 1.5, 
    y: 50, 
    opacity: 0, 
    delay: 0.5,
    ease: 'back.out(1.7)' 
  });
  
  gsap.from('.countdown div', { 
    duration: 1, 
    y: 30, 
    opacity: 0, 
    stagger: 0.2, 
    delay: 1,
    ease: 'back.out(1.7)' 
  });
});