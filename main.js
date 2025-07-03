document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  document.getElementById('form-message').textContent = '¡Gracias por contactarnos!';
  this.reset();
});

// Animación de entrada para secciones
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.animationDelay = '0.1s';
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-animate').forEach(section => {
  observer.observe(section);
});

// Carrusel de productos tipo cinta transportadora
(function() {
  const track = document.querySelector('.carousel-track');
  const cards = Array.from(track.children);
  const btnLeft = document.querySelector('.carousel-btn.left');
  const btnRight = document.querySelector('.carousel-btn.right');
  let position = 0;
  let cardWidth = cards[0].offsetWidth + 32; // 32px gap
  let visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
  let autoScroll;

  // Duplicar productos para efecto infinito si hay pocos
  if (cards.length < 6) {
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });
  }

  function updateCardWidth() {
    cardWidth = cards[0].offsetWidth + 32;
    visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
  }

  function moveCarousel(dir = 1) {
    position += dir;
    const total = track.children.length;
    if (position < 0) {
      position = total - visibleCards;
    } else if (position > total - visibleCards) {
      position = 0;
    }
    track.style.transform = `translateX(-${position * cardWidth}px)`;
  }

  btnLeft.addEventListener('click', () => moveCarousel(-1));
  btnRight.addEventListener('click', () => moveCarousel(1));

  function startAutoScroll() {
    autoScroll = setInterval(() => moveCarousel(1), 2500);
  }
  function stopAutoScroll() {
    clearInterval(autoScroll);
  }
  track.addEventListener('mouseenter', stopAutoScroll);
  track.addEventListener('mouseleave', startAutoScroll);
  btnLeft.addEventListener('mouseenter', stopAutoScroll);
  btnRight.addEventListener('mouseenter', stopAutoScroll);
  btnLeft.addEventListener('mouseleave', startAutoScroll);
  btnRight.addEventListener('mouseleave', startAutoScroll);

  window.addEventListener('resize', () => {
    updateCardWidth();
    moveCarousel(0);
  });

  updateCardWidth();
  moveCarousel(0);
  startAutoScroll();
})();

// Scroll to top button
const scrollBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add('show');
    document.querySelector('.main-nav').classList.add('scrolled');
  } else {
    scrollBtn.classList.remove('show');
    document.querySelector('.main-nav').classList.remove('scrolled');
  }
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Menú hamburguesa responsivo
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.querySelector('.main-nav');
const menuOverlay = document.getElementById('menu-overlay');
const navLinks = document.querySelectorAll('.main-nav a');

function openMenu() {
  mainNav.classList.add('open');
  menuOverlay.classList.remove('hide');
  document.body.classList.add('menu-open');
}
function closeMenu() {
  mainNav.classList.remove('open');
  menuOverlay.classList.add('hide');
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click', () => {
  if (mainNav.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});
menuOverlay.addEventListener('click', closeMenu);
navLinks.forEach(link => link.addEventListener('click', closeMenu));

// Partículas animadas sutiles en el fondo
(function() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth;
  let h = window.innerHeight;
  let particles = [];
  const num = Math.floor((w * h) / 7000) + 18;
  const colors = ['#fda08555', '#f6d36555', '#fffbe655', '#f8f6f455'];

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
  }
  window.addEventListener('resize', resize);
  resize();

  function Particle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.r = 1.7 + Math.random() * 2.3;
    this.c = colors[Math.floor(Math.random() * colors.length)];
    this.dx = (Math.random() - 0.5) * 0.3;
    this.dy = (Math.random() - 0.5) * 0.3;
  }
  Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = this.c;
    ctx.shadowColor = this.c;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  };
  Particle.prototype.update = function() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 0 || this.x > w) this.dx *= -1;
    if (this.y < 0 || this.y > h) this.dy *= -1;
  };

  function connect(p1, p2) {
    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
    if (dist < 90) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = '#fda08522';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      for (let j = i + 1; j < particles.length; j++) {
        connect(particles[i], particles[j]);
      }
    }
    requestAnimationFrame(animate);
  }

  particles = Array.from({length: num}, () => new Particle());
  animate();
})();

// Ballpit de iconos de postres en el hero
(function() {
  const canvas = document.getElementById('hero-ballpit');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const icons = ['🍰','🧁','🍩','🍪','🍫','🍦','🥧','🍬','🍮','🍯'];
  let w = 0, h = 0;
  let balls = [];
  const count = 18;
  let mouse = { x: null, y: null, active: false };

  function resize() {
    const parent = canvas.closest('.hero') || canvas.parentElement;
    w = parent.offsetWidth;
    h = parent.offsetHeight;
    canvas.width = w;
    canvas.height = h;
  }
  window.addEventListener('resize', resize);
  resize();

  function Ball() {
    this.r = 22 + Math.random() * 18;
    this.x = Math.random() * (w - 2*this.r) + this.r;
    this.y = Math.random() * (h - 2*this.r) + this.r;
    this.dx = (Math.random() - 0.5) * 1.2;
    this.dy = (Math.random() - 0.5) * 1.2;
    this.icon = icons[Math.floor(Math.random() * icons.length)];
    this.ang = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.01;
  }
  Ball.prototype.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.ang);
    ctx.font = `${this.r}px serif`;
    ctx.globalAlpha = 0.85;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#fffbe6';
    ctx.shadowBlur = 8;
    ctx.fillText(this.icon, 0, 0);
    ctx.restore();
  };
  Ball.prototype.update = function() {
    this.x += this.dx;
    this.y += this.dy;
    this.ang += this.spin;
    if (this.x < this.r || this.x > w - this.r) this.dx *= -1;
    if (this.y < this.r || this.y > h - this.r) this.dy *= -1;
  };
  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (let b of balls) {
      b.update();
      b.draw();
    }
    requestAnimationFrame(animate);
  }
  balls = Array.from({length: count}, () => new Ball());
  animate();
})();