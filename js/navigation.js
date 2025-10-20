// Handle header behavior on scroll
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mainNav = document.querySelector(".main-nav");

  // Add scroll event listener
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Add resize event listener
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mainNav.classList.contains("active")) {
      mainNav.classList.remove("active");
      mobileToggle.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      mainNav.classList.toggle("active");

      // Prevent scrolling when mobile menu is open
      if (mainNav.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }

  // Create and append nav overlay
  const navOverlay = document.createElement("div");
  navOverlay.classList.add("nav-overlay");
  document.body.appendChild(navOverlay);

  // Show/hide overlay when mobile menu is toggled
  mobileToggle.addEventListener("click", () => {
    navOverlay.classList.toggle("active");
  });

  // Close mobile menu when clicking on overlay
  navOverlay.addEventListener("click", () => {
    mainNav.classList.remove("active");
    mobileToggle.classList.remove("active");
    navOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Initialize active state for nav links
  updateActiveNavLink();

  // Update active nav link on scroll
  window.addEventListener("scroll", () => {
    updateActiveNavLink();
  });
});

// Update active nav link based on current scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".main-nav a");

  // Get current scroll position
  const scrollPosition = window.scrollY + 100; // Offset for header

  // Find the current section
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      // Remove active class from all links
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      // Add active class to current section link
      const currentLink = document.querySelector(
        `.main-nav a[href="#${sectionId}"]`,
      );
      if (currentLink) {
        currentLink.classList.add("active");
      }
    }
  });
}

// Add custom active class styling to main-nav links
const style = document.createElement("style");
style.textContent = `
  .main-nav a.active {
    color: var(--color-gold);
  }
  
  .main-nav a.active::after {
    width: 100%;
  }
`;
document.head.appendChild(style);
