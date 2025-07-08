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
  } else {
    scrollBtn.classList.remove('show');
  }
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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

// Formspree form handling
const form = document.querySelector('form[action*="formspree.io"]');
if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (response.ok) {
                form.dispatchEvent(new Event('formspree:success'));
            } else {
                form.dispatchEvent(new Event('formspree:error'));
            }
        } catch (error) {
            form.dispatchEvent(new Event('formspree:error'));
        } finally {
            form.dispatchEvent(new Event('formspree:end'));
        }
    });
    form.addEventListener('formspree:success', () => {
        const successMessage = document.createElement('div');
        successMessage.style.position = 'fixed';
        successMessage.style.bottom = '30px';
        successMessage.style.left = '50%';
        successMessage.style.transform = 'translateX(-50%)';
        successMessage.style.backgroundColor = '#4CAF50';
        successMessage.style.color = 'white';
        successMessage.style.padding = '15px 30px';
        successMessage.style.borderRadius = '50px';
        successMessage.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        successMessage.style.zIndex = '1000';
        successMessage.style.animation = 'fadeInUp 0.5s ease-out';
        successMessage.innerHTML = '<i class="fas fa-check-circle"></i> ¡Mensaje enviado con éxito!';
        document.body.appendChild(successMessage);
        setTimeout(() => {
            successMessage.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => successMessage.remove(), 500);
        }, 3000);
        form.reset();
    });
    form.addEventListener('formspree:error', () => {
        const errorMessage = document.createElement('div');
        errorMessage.style.position = 'fixed';
        errorMessage.style.bottom = '30px';
        errorMessage.style.left = '50%';
        errorMessage.style.transform = 'translateX(-50%)';
        errorMessage.style.backgroundColor = '#f44336';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '15px 30px';
        errorMessage.style.borderRadius = '50px';
        errorMessage.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        errorMessage.style.zIndex = '1000';
        errorMessage.style.animation = 'fadeInUp 0.5s ease-out';
        errorMessage.innerHTML = '<i class="fas fa-times-circle"></i> Hubo un error al enviar tu mensaje.';
        document.body.appendChild(errorMessage);
        setTimeout(() => {
            errorMessage.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => errorMessage.remove(), 500);
        }, 3000);
    });
    form.addEventListener('formspree:end', () => {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Enviar Mensaje';
    });
}

// Loading screen functionality for purchase buttons
function showLoadingScreen(whatsappUrl, productName) {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingTitle = loadingScreen.querySelector('h2');
  const loadingMessage = loadingScreen.querySelector('p');
  
  // Personalizar el mensaje según el producto
  if (productName) {
    loadingTitle.textContent = `¡Gracias por elegir ${productName}!`;
    loadingMessage.textContent = `Estamos preparando tu ${productName} con mucho amor...`;
  } else {
    loadingTitle.textContent = '¡Gracias por tu compra!';
    loadingMessage.textContent = 'Estamos preparando tu pedido con mucho amor...';
  }
  
  loadingScreen.classList.add('show');
  
  // Redirect to WhatsApp after 3 seconds
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
    loadingScreen.classList.remove('show');
  }, 3000);
}

// Function to create personalized WhatsApp message
function createWhatsAppMessage(productName, productType = 'producto') {
  const baseMessage = `Hola! 👋 Me interesa comprar ${productType === 'plan' ? 'el' : 'un'} ${productName} de Delicias Dulces. ¿Podrías darme más información sobre precios y disponibilidad? 🍰✨`;
  return encodeURIComponent(baseMessage);
}

// Add event listeners to all purchase buttons
document.addEventListener('DOMContentLoaded', function() {
  const purchaseButtons = document.querySelectorAll('.buy-whatsapp');
  
  purchaseButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Buscar el nombre del producto/plan en la tarjeta
      const productCard = this.closest('.product-card, .plan-card');
      let productName = '';
      let productType = 'producto';
      
      if (productCard) {
        const titleElement = productCard.querySelector('h3');
        if (titleElement) {
          // Extraer solo el texto del título (sin el icono)
          productName = titleElement.textContent.trim();
          // Determinar si es un plan o producto
          productType = productCard.classList.contains('plan-card') ? 'plan' : 'producto';
        }
      }
      
      // Crear mensaje personalizado
      const personalizedMessage = createWhatsAppMessage(productName, productType);
      const whatsappUrl = `https://wa.me/1234567890?text=${personalizedMessage}`;
      
      showLoadingScreen(whatsappUrl, productName);
    });
  });
});

// Product data for modal
const productData = {
  'Cheesecake': {
    title: 'Cheesecake Artesanal',
    description: 'Nuestro cheesecake es una obra maestra de la repostería. Preparado con queso crema premium, huevos frescos y una base de galletas caseras. La textura es suave y cremosa, con un sabor equilibrado que no es demasiado dulce. Perfecto para cualquier ocasión especial.',
    prepTime: '24 horas',
    servings: '8-10 personas',
    ingredients: 'Queso crema, huevos, azúcar, galletas, mantequilla, vainilla',
    price: '$18.99',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
  },
  'Brownie': {
    title: 'Brownie de Chocolate Intenso',
    description: 'Un brownie que te transportará al paraíso del chocolate. Preparado con chocolate negro de alta calidad, mantequilla y huevos frescos. La textura es perfecta: crujiente por fuera y suave por dentro, con trozos de chocolate que se derriten en tu boca.',
    prepTime: '2 horas',
    servings: '6-8 personas',
    ingredients: 'Chocolate negro, mantequilla, huevos, azúcar, harina, nueces',
    price: '$12.99',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
  },
  'Tarta de Frutas': {
    title: 'Tarta de Frutas Frescas',
    description: 'Una tarta colorida y refrescante con las mejores frutas de temporada. La base es una masa quebrada casera, rellena con crema pastelera ligera y decorada con frutas frescas. Cada bocado es una explosión de sabores naturales.',
    prepTime: '4 horas',
    servings: '10-12 personas',
    ingredients: 'Frutas frescas, crema pastelera, masa quebrada, gelatina',
    price: '$22.99',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4'
  },
  'Cupcakes': {
    title: 'Cupcakes Decorados',
    description: 'Mini pastelitos individuales decorados con mucho amor y creatividad. Disponibles en diferentes sabores: vainilla, chocolate, fresa y limón. Cada cupcake viene con un frosting casero y decoraciones únicas.',
    prepTime: '3 horas',
    servings: '12 cupcakes',
    ingredients: 'Harina, azúcar, huevos, mantequilla, leche, frosting',
    price: '$15.99',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_4mb.mp4'
  }
};

// Plan data for modal
const planData = {
  'Plan Cumpleaños': {
    title: 'Plan Cumpleaños Especial',
    description: 'El plan perfecto para celebrar el cumpleaños de tus seres queridos. Incluye 2 tortas decoradas personalmente según tus preferencias y 24 cupcakes con diferentes sabores y decoraciones. Ideal para fiestas de 20-30 personas. Incluye velas y decoraciones adicionales.',
    prepTime: '48 horas',
    servings: '20-30 personas',
    ingredients: '2 tortas + 24 cupcakes + decoraciones',
    price: '$49.99',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4'
  },
  'Plan Verano': {
    title: 'Plan Verano Refrescante',
    description: 'Disfruta del verano con nuestros helados artesanales y tartas refrescantes. El plan incluye 3 helados de diferentes sabores (fresa, chocolate y vainilla) más una tarta de frutas frescas. Perfecto para días calurosos y reuniones familiares.',
    prepTime: '6 horas',
    servings: '8-12 personas',
    ingredients: '3 helados artesanales + 1 tarta de frutas',
    price: '$29.99',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_6mb.mp4'
  },
  'Promoción Semana': {
    title: 'Promoción Semanal - 2x1 en Brownies',
    description: 'Todos los viernes disfruta de nuestra promoción especial: 2x1 en brownies de chocolate. Una oferta imperdible para los amantes del chocolate. Los brownies son frescos, húmedos y con trozos de chocolate. Perfecto para compartir o disfrutar solo.',
    prepTime: '2 horas',
    servings: '2 brownies',
    ingredients: 'Chocolate negro, mantequilla, huevos, azúcar, harina',
    price: '$9.99',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_7mb.mp4'
  },
  'Plan Café y Dulce': {
    title: 'Plan Café y Dulce',
    description: 'La combinación perfecta: café de especialidad con nuestros pasteles caseros. Incluye 2 cafés gourmet (americano, espresso o cappuccino) y 2 porciones generosas de pastel del día. Ideal para reuniones de trabajo o tardes con amigos.',
    prepTime: '1 hora',
    servings: '2 personas',
    ingredients: '2 cafés + 2 porciones de pastel',
    price: '$14.99',
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_8mb.mp4'
  }
};

// Modal functionality
const productModal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalOverlay = document.querySelector('.modal-overlay');
const productVideo = document.getElementById('product-video');
const modalProductTitle = document.getElementById('modal-product-title');
const modalProductDescription = document.getElementById('modal-product-description');
const modalPrepTime = document.getElementById('modal-prep-time');
const modalServings = document.getElementById('modal-servings');
const modalIngredients = document.getElementById('modal-ingredients');
const modalPrice = document.getElementById('modal-price');
const modalBuyBtn = document.getElementById('modal-buy-btn');

let currentProduct = null;

function openProductModal(productName) {
  const product = productData[productName];
  const plan = planData[productName];
  
  if (!product && !plan) return;
  
  currentProduct = productName;
  const isPlan = !!plan;
  const data = product || plan;
  
  // Populate modal with product/plan data
  modalProductTitle.textContent = data.title;
  modalProductDescription.textContent = data.description;
  modalPrepTime.textContent = data.prepTime;
  modalServings.textContent = data.servings;
  modalIngredients.textContent = data.ingredients;
  modalPrice.textContent = data.price;
  
  // Set video source
  productVideo.src = data.video;
  
  // Update buy button text based on type
  modalBuyBtn.innerHTML = `<i class="fab fa-whatsapp"></i> ${isPlan ? 'Lo quiero' : 'Comprar Ahora'}`;
  
  // Show modal
  productModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  productModal.classList.remove('show');
  document.body.style.overflow = '';
  
  // Pause video when closing
  productVideo.pause();
  productVideo.currentTime = 0;
  
  currentProduct = null;
}

// Event listeners for modal
modalClose.addEventListener('click', closeProductModal);
modalOverlay.addEventListener('click', closeProductModal);

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && productModal.classList.contains('show')) {
    closeProductModal();
  }
});

// Modal buy button functionality
modalBuyBtn.addEventListener('click', function() {
  if (currentProduct) {
    const isPlan = !!planData[currentProduct];
    const productType = isPlan ? 'plan' : 'producto';
    const personalizedMessage = createWhatsAppMessage(currentProduct, productType);
    const whatsappUrl = `https://wa.me/1234567890?text=${personalizedMessage}`;
    showLoadingScreen(whatsappUrl, currentProduct);
    closeProductModal();
  }
});

// Add click event listeners to product images
document.addEventListener('DOMContentLoaded', function() {
  const productImageContainers = document.querySelectorAll('.product-image-container');
  
  productImageContainers.forEach(container => {
    container.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const titleElement = productCard.querySelector('h3');
      if (titleElement) {
        const productName = titleElement.textContent.trim();
        openProductModal(productName);
      }
    });
  });
  
  // Add click event listeners to plan images
  const planImageContainers = document.querySelectorAll('.plan-image-container');
  
  planImageContainers.forEach(container => {
    container.addEventListener('click', function() {
      const planCard = this.closest('.plan-card');
      const titleElement = planCard.querySelector('h3');
      if (titleElement) {
        const planName = titleElement.textContent.trim();
        openProductModal(planName);
      }
    });
  });
});

// Animación moderna de scroll para social-cards (celular)
const socialCards = document.querySelectorAll('.scroll-animate');
if (socialCards.length) {
  const socialObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  socialCards.forEach(card => socialObserver.observe(card));
}