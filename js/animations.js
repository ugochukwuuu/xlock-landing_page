document.addEventListener('DOMContentLoaded', () => {
  // Initialize animation observers
  initScrollAnimations();
  
  // Initialize any other animations
  initMiscAnimations();
});

// Initialize scroll-based animations
function initScrollAnimations() {
  // Set up the Intersection Observer
  const observerOptions = {
    root: null, // Use viewport as the root
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
  };
  
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the 'visible' class to trigger the animation
        entry.target.classList.add('visible');
        
        // Stop observing after animation is triggered
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Start observing all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    animationObserver.observe(element);
  });
  
  // Special handling for sequential animations in lists
  document.querySelectorAll('.sequential-animation').forEach(container => {
    const items = container.querySelectorAll('.animate-item');
    
    const sequentialObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Animate each item with increasing delay
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('visible');
          }, 150 * index);
        });
        
        // Stop observing after animation is triggered
        sequentialObserver.unobserve(container);
      }
    }, observerOptions);
    
    sequentialObserver.observe(container);
  });
}

// Initialize miscellaneous animations
function initMiscAnimations() {
  // Parallax effect for hero section
  const heroSection = document.getElementById('hero');
  
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      
      if (scrollPosition <= window.innerHeight) {
        // Move the background at a different rate than the scroll
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    });
  }
  
  // Add subtle hover animations to service items
  document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      const image = item.querySelector('.service-image img');
      if (image) {
        image.style.transform = 'scale(1.05)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const image = item.querySelector('.service-image img');
      if (image) {
        image.style.transform = 'scale(1)';
      }
    });
  });
  
  // Animate stats on hover
  document.querySelectorAll('.stat-item').forEach(stat => {
    stat.addEventListener('mouseenter', () => {
      stat.classList.add('pulse');
    });
    
    stat.addEventListener('mouseleave', () => {
      stat.classList.remove('pulse');
    });
  });
  
  // Add floating animation to specific elements
  document.querySelectorAll('.float-animation').forEach(element => {
    element.classList.add('float');
  });
  
  // Add typewriter effect if needed
  initTypewriterEffect();
}

// Typewriter effect for hero headline (uncomment to use)
function initTypewriterEffect() {
  const heroHeadline = document.querySelector('#hero h1');
  
  if (heroHeadline && false) { // Set to true to enable
    const text = heroHeadline.textContent;
    heroHeadline.textContent = '';
    heroHeadline.style.borderRight = '0.1em solid var(--color-gold)';
    
    let charIndex = 0;
    const typeSpeed = 100; // ms per character
    
    function typeWriter() {
      if (charIndex < text.length) {
        heroHeadline.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, typeSpeed);
      } else {
        heroHeadline.style.borderRight = 'none';
      }
    }
    
    // Start the typewriter effect after a brief delay
    setTimeout(typeWriter, 500);
  }
}

// Helper function to add random floating movement to elements
function addRandomFloat(element) {
  const randomDelay = Math.random() * 2;
  const randomDuration = 3 + Math.random() * 2;
  
  element.style.animation = `float ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
}