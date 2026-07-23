/* =========================================================
   ALAMIN — PREMIUM PORTFOLIO SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------------------
     1. PRELOADER
  --------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 400);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader && preloader.classList.add('hidden'), 2500);

  /* ---------------------------------------------------------
     2. DARK / LIGHT MODE TOGGLE
  --------------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('portfolio-theme');

  // Respect saved preference, otherwise use system preference
  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const current =
      root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });

  /* ---------------------------------------------------------
     3. STICKY NAVBAR + MOBILE MENU
  --------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const handleScrollState = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  handleScrollState();
  window.addEventListener('scroll', handleScrollState, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu + set active link on nav click
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     4. ACTIVE NAV LINK ON SCROLL (Scrollspy)
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('[data-nav]');

  const scrollSpy = () => {
    let current = 'home';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`,
      );
    });
  };
  window.addEventListener('scroll', scrollSpy, { passive: true });
  scrollSpy();

  /* ---------------------------------------------------------
     5. TYPING TEXT ANIMATION (Hero role)
  --------------------------------------------------------- */
  const typingEl = document.getElementById('typing-text');
  const roles = [
    'WordPress Developer',
    'Frontend Developer',
    'Website Designer',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typingEl.textContent = currentRole.substring(0, charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeLoop, 1600); // pause at full word
        return;
      }
    } else {
      charIndex--;
      typingEl.textContent = currentRole.substring(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    const speed = deleting ? 40 : 90;
    setTimeout(typeLoop, speed);
  };
  typeLoop();

  /* ---------------------------------------------------------
     6. SCROLL REVEAL ANIMATION (IntersectionObserver)
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------
     7. ANIMATED SKILL PROGRESS BARS
  --------------------------------------------------------- */
  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const percent = parseInt(item.getAttribute('data-percent'), 10);
          const fill = item.querySelector('.skill-fill');
          const label = item.querySelector('.skill-percent');

          fill.style.width = percent + '%';

          // Animate the number counting up
          let current = 0;
          const step = Math.max(1, Math.round(percent / 40));
          const counter = setInterval(() => {
            current += step;
            if (current >= percent) {
              current = percent;
              clearInterval(counter);
            }
            label.textContent = current + '%';
          }, 20);

          skillObserver.unobserve(item);
        }
      });
    },
    { threshold: 0.4 },
  );

  skillItems.forEach(item => skillObserver.observe(item));

  /* ---------------------------------------------------------
     8. HERO STAT COUNTERS
  --------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'), 10);
    let current = 0;
    const increment = Math.max(1, target / 40);
    const counter = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(counter);
      }
      stat.textContent = Math.floor(current);
    }, 40);
  });

  /* ---------------------------------------------------------
     9. BACK TO TOP BUTTON
  --------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener(
    'scroll',
    () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    },
    { passive: true },
  );

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     10. CONTACT FORM (client-side handling)
  --------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = 'Please fill in all fields before sending.';
      formStatus.style.color = '#EF4444';
      return;
    }

    // Build a mailto link so the message reaches Alamin's inbox directly
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    const mailtoLink = `mailto:alamimlslam2010@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    window.location.href = mailtoLink;

    formStatus.textContent = 'Opening your email app to send the message...';
    formStatus.style.color = '#2563EB';
    contactForm.reset();
  });

  /* ---------------------------------------------------------
     11. ANIMATED PARTICLE BACKGROUND (Canvas)
  --------------------------------------------------------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  const resizeCanvas = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.querySelector('.hero').offsetHeight;
  };

  const createParticles = () => {
    const count = window.innerWidth < 768 ? 35 : 65;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 0.6,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.15,
    }));
  };

  const isDark = () =>
    document.documentElement.getAttribute('data-theme') === 'dark';

  const drawParticles = () => {
    ctx.clearRect(0, 0, width, height);
    const color = isDark() ? '96, 165, 250' : '37, 99, 235';

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > width) p.dx *= -1;
      if (p.y < 0 || p.y > height) p.dy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      ctx.fill();
    });

    // Connect nearby particles with faint lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  };

  const initParticles = () => {
    resizeCanvas();
    createParticles();
  };

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (canvas && !prefersReducedMotion) {
    initParticles();
    drawParticles();
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
  }
});
