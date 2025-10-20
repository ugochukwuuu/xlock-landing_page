import "./navigation.js";
import "./animations.js";
import { createClient } from "@supabase/supabase-js";
// Load the JavaScript and Vite logos (already in the main.js file)
import javascriptLogo from "../javascript.svg";
import viteLogo from "/vite.svg";

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("Xlock Wealth Management - Application Initialized");

  // Handle form submissions
  setupFormHandlers();

  // Initialize any other functionality
  initializeFeatures();
});

// js/register.js

// Initialize Supabase client (replace with your Project URL and anon key)
const supabaseUrl = "https://kinpzbobmsmgabfqmltk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpbnB6Ym9ibXNtZ2FiZnFtbHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzQyMzUsImV4cCI6MjA2NjU1MDIzNX0.ks5HgpK9OBeWWq7jY8dbwS93CT16gcYbxUKmIVteZcA";
const supabase = createClient(supabaseUrl, supabaseKey);

const registerForm = document.getElementById("registerForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const registerButton = document.getElementById("registerButton");
const errorElements = {
  fullName: document.getElementById("fullNameError"),
  email: document.getElementById("emailError"),
  password: document.getElementById("passwordError"),
  confirmPassword: document.getElementById("confirmPasswordError"),
  submit: document.getElementById("submitError"),
};

// Handle form submissions
function setupFormHandlers() {
  // This would handle actual form submissions when forms are added
  document.addEventListener("submit", (e) => {
    const form = e.target;

    if (form.classList.contains("contact-form")) {
      e.preventDefault();

      // Simulate form submission
      const submitButton = form.querySelector('button[type="submit"]');

      if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        // Simulate API call
        setTimeout(() => {
          submitButton.textContent = "Message Sent!";
          form.reset();

          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
          }, 2000);
        }, 1500);
      }
    }
  });
}

// Initialize additional features
function initializeFeatures() {
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Close mobile menu if open
        const mobileNav = document.querySelector(".main-nav");
        const mobileToggle = document.querySelector(".mobile-toggle");

        if (mobileNav.classList.contains("active")) {
          mobileNav.classList.remove("active");
          mobileToggle.classList.remove("active");
          document.body.style.overflow = "";
        }

        // Scroll to the element
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for fixed header
          behavior: "smooth",
        });
      }
    });
  });

  // Initialize counters for statistics
  initializeCounters();
}

// Animate statistics counters
function initializeCounters() {
  const stats = document.querySelectorAll(".stat-number");

  stats.forEach((stat) => {
    const targetValue = parseFloat(stat.textContent);
    const suffix = stat.textContent.replace(/[0-9.+]/g, "");
    let startValue = 0;
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const easedProgress = easeOutQuart(progress);
        const currentValue =
          startValue + (targetValue - startValue) * easedProgress;

        // Format the number appropriately
        let formattedValue;
        if (suffix.includes("M")) {
          formattedValue = currentValue.toFixed(1) + suffix;
        } else if (suffix.includes("%")) {
          formattedValue = Math.round(currentValue) + suffix;
        } else if (suffix.includes("+")) {
          formattedValue = Math.round(currentValue) + suffix;
        } else {
          formattedValue = Math.round(currentValue).toString() + suffix;
        }

        stat.textContent = formattedValue;
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = targetValue + suffix;
      }
    }

    // Easing function for smooth animation
    function easeOutQuart(x) {
      return 1 - Math.pow(1 - x, 4);
    }

    // Start the counter animation when element becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(updateCounter);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(stat);
  });
}
