const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const themeIcon = themeToggle.querySelector(".theme-icon");

const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") {
  body.classList.add("light-theme");
  themeIcon.textContent = "☀️";
} else {
  body.classList.remove("light-theme");
  themeIcon.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  const isLight = body.classList.contains("light-theme");
  themeIcon.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

const langToggle = document.getElementById("langToggle");
const html = document.documentElement;
const langText = langToggle.querySelector(".lang-text");

const savedLang = localStorage.getItem("language") || "en";
if (savedLang === "ar") {
  html.setAttribute("lang", "ar");
  html.setAttribute("dir", "rtl");
  updateLanguage("ar");
  langText.textContent = "EN";
} else {
  html.setAttribute("lang", "en");
  html.setAttribute("dir", "ltr");
  updateLanguage("en");
  langText.textContent = "ع";
}

langToggle.addEventListener("click", () => {
  const currentLang = html.getAttribute("lang");
  const newLang = currentLang === "en" ? "ar" : "en";

  html.setAttribute("lang", newLang);
  html.setAttribute("dir", newLang === "ar" ? "rtl" : "ltr");
  updateLanguage(newLang);
  langText.textContent = newLang === "ar" ? "EN" : "ع";
  localStorage.setItem("language", newLang);
});

function updateLanguage(lang) {
  const elements = document.querySelectorAll("[data-en][data-ar]");
  elements.forEach((element) => {
    if (element.hasAttribute("data-en") && element.hasAttribute("data-ar")) {
      element.textContent =
        lang === "ar"
          ? element.getAttribute("data-ar")
          : element.getAttribute("data-en");
    }
  });

  const textElements = document.querySelectorAll(
    ".btn-text, .nav-link, .title-text, .name-text, .nickname-text, .contact-btn-text, .footer-text-content"
  );
  textElements.forEach((element) => {
    if (element.hasAttribute("data-en") && element.hasAttribute("data-ar")) {
      element.textContent =
        lang === "ar"
          ? element.getAttribute("data-ar")
          : element.getAttribute("data-en");
    }
  });
}

function initEyeTracking() {
  const floatingEyes = document.getElementById("floatingEyes");
  if (!floatingEyes) return;

  const eyes = floatingEyes.querySelectorAll(".eye");
  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  function animateEyes() {
    const lerp = 0.08;
    currentX += (targetX - currentX) * lerp;
    currentY += (targetY - currentY) * lerp;

    floatingEyes.style.left = currentX + "px";
    floatingEyes.style.top = currentY + "px";

    requestAnimationFrame(animateEyes);
  }
  animateEyes();

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    eyes.forEach((eye, index) => {
      const pupil = eye.querySelector(".pupil");
      const eyeRect = eye.getBoundingClientRect();
      const eyeX = eyeRect.left + eyeRect.width / 2;
      const eyeY = eyeRect.top + eyeRect.height / 2;

      const deltaX = e.clientX - eyeX;
      const deltaY = e.clientY - eyeY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY));

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
      pupil.style.transition =
        "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    });
  });

  document.addEventListener("mouseleave", () => {
    eyes.forEach((eye) => {
      const pupil = eye.querySelector(".pupil");
      pupil.style.transform = "translate(-50%, -50%)";
    });
  });

  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    floatingEyes.style.display = "none";
  }
}

function initProfileImageTracking() {
  const profileImage = document.getElementById("profileImage");
  if (!profileImage) return;

  profileImage.addEventListener("mousemove", (e) => {
    const rect = profileImage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / rect.height) * 10;
    const rotateY = (mouseX / rect.width) * -10;

    profileImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  profileImage.addEventListener("mouseleave", () => {
    profileImage.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    observer.observe(section);
  });

  const skillCards = document.querySelectorAll(".skill-card");
  skillCards.forEach((card, index) => {
    observer.observe(card);
    card.addEventListener("mouseenter", () => {
      const progressBar = card.querySelector(".skill-progress");
      if (progressBar) {
        const progress = progressBar.getAttribute("data-progress");
        progressBar.style.width = progress + "%";
      }
    });
  });

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector(".skill-progress");
          if (progressBar) {
            const progress = progressBar.getAttribute("data-progress");
            setTimeout(() => {
              progressBar.style.width = progress + "%";
            }, 200);
          }
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillCards.forEach((card) => {
    skillObserver.observe(card);
  });
}

function initMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");

    const spans = navToggle.querySelectorAll("span");
    if (navMenu.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translateY(8px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translateY(-8px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      const spans = navToggle.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    });
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#" || href === "#!") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

function initNavbarScroll() {
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    const isLight = document.body.classList.contains("light-theme");
    const goldColor = isLight
      ? "rgba(212, 175, 55, 0.3)"
      : "rgba(255, 215, 0, 0.4)";
    const goldBorder = isLight
      ? "rgba(212, 175, 55, 0.15)"
      : "rgba(255, 215, 0, 0.2)";

    if (currentScroll > 100) {
      navbar.style.boxShadow = `0 4px 30px ${goldColor}, 0 0 0 1px ${goldBorder}`;
      navbar.style.backdropFilter = "blur(20px) saturate(180%)";
    } else {
      navbar.style.boxShadow = "none";
      navbar.style.backdropFilter = "blur(10px)";
    }

    lastScroll = currentScroll;
  });
}

function initCatInteractions() {
  const interactiveElements = document.querySelectorAll(
    ".skill-card, .project-card, .contact-btn"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mousemove", (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const moveX = (x - centerX) / 10;
      const moveY = (y - centerY) / 10;

      element.style.transform = `translateY(-5px) perspective(1000px) rotateX(${
        -moveY * 0.5
      }deg) rotateY(${moveX * 0.5}deg)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });
}

function initButtonInteractions() {
  const buttons = document.querySelectorAll(".btn-secondary, .project-link");

  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });

    button.addEventListener("mousedown", function () {
      this.style.transform = "translateY(0) scale(0.98)";
    });

    button.addEventListener("mouseup", function () {
      this.style.transform = "translateY(-2px) scale(1.02)";
    });
  });
}

function initScrollProgress() {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (!scrollIndicator) return;

  window.addEventListener("scroll", () => {
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.pageYOffset;

    if (scrolled > 100) {
      scrollIndicator.style.opacity = "0";
      scrollIndicator.style.pointerEvents = "none";
    } else {
      scrollIndicator.style.opacity = "1";
      scrollIndicator.style.pointerEvents = "auto";
    }
  });
}

function initParallax() {
  const landingSection = document.querySelector(".landing-section");
  if (!landingSection) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;

    if (scrolled < window.innerHeight) {
      landingSection.style.transform = `translateY(${parallax}px)`;
    }
  });
}

function initPageLoad() {
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");

    // Animate landing section
    const landingContent = document.querySelector(".landing-content");
    if (landingContent) {
      landingContent.style.opacity = "0";
      landingContent.style.transform = "translateY(30px)";

      setTimeout(() => {
        landingContent.style.transition =
          "opacity 1s ease-out, transform 1s ease-out";
        landingContent.style.opacity = "1";
        landingContent.style.transform = "translateY(0)";
      }, 100);
    }
  });
}

function initCustomCursor() {
  const cursor = document.getElementById("customCursor");
  const cursorDot = document.getElementById("customCursorDot");

  if (!cursor || !cursorDot) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;

  if (window.matchMedia("(pointer: fine)").matches) {
    document.body.style.cursor = "none";

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;

      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;

      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";

      cursorDot.style.left = dotX + "px";
      cursorDot.style.top = dotY + "px";

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const hoverElements = document.querySelectorAll(
      "a, button, .btn-eyes, .btn-secondary, .nav-link, .contact-btn, .project-link, .skill-card, .project-card"
    );

    hoverElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.classList.add("hover");
        cursorDot.classList.add("hover");
      });

      element.addEventListener("mouseleave", () => {
        cursor.classList.remove("hover");
        cursorDot.classList.remove("hover");
      });
    });

    document.addEventListener("mousedown", () => {
      cursor.classList.add("click");
    });

    document.addEventListener("mouseup", () => {
      cursor.classList.remove("click");
    });

    document.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
      cursorDot.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
      cursorDot.style.opacity = "1";
    });
  } else {
    cursor.style.display = "none";
    cursorDot.style.display = "none";
    document.body.style.cursor = "auto";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initEyeTracking();
  initProfileImageTracking();
  initScrollAnimations();
  initMobileNav();
  initSmoothScroll();
  initNavbarScroll();
  initCustomCursor();

  initCatInteractions();
  initButtonInteractions();
  initScrollProgress();
  initParallax();
  initPageLoad();

  const currentLang = document.documentElement.getAttribute("lang") || "en";
  updateLanguage(currentLang);

  console.log("✨ Premium Portfolio Website Loaded Successfully!");
});

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const optimizedScrollHandler = throttle(() => {}, 16);

window.addEventListener("error", (e) => {
  console.error("An error occurred:", e.error);
});

if (!window.IntersectionObserver) {
  console.warn(
    "IntersectionObserver not supported. Some animations may not work."
  );
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("visible");
  });
}
