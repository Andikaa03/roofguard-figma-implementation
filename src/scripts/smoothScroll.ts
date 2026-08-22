import Lenis from 'lenis';

export function initSmoothExperience() {
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.8,
    infinite: false,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Smooth Anchor Navigation
  document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href) return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const targetHash = href.substring(hashIndex);

      const isCurrentPage =
        href.startsWith('#') ||
        href.startsWith('/#') ||
        window.location.pathname === '/' ||
        window.location.pathname === href.substring(0, hashIndex);

      if (isCurrentPage && targetHash && targetHash !== '#') {
        if (targetHash === '#top') {
          e.preventDefault();
          lenis.scrollTo(0, { duration: 1.2 });
          return;
        }
        const targetEl = document.querySelector(targetHash);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -headerOffset,
            duration: 1.2,
          });
        }
      }
    });
  });

  // 2. Framer-Style Scroll Reveal Observer
  const revealElements = document.querySelectorAll(
    '[data-reveal], [data-reveal-stagger]'
  );
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    // Immediately reveal elements in the viewport on initial page load
    setTimeout(() => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('is-revealed');
        }
      });
    }, 60);
  }

  // 3. Stats Animated Counters
  const statsSection = document.getElementById('aboutStatsGrid');
  if (statsSection) {
    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            startCounting();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(statsSection);

    function startCounting() {
      const counterElements = statsSection!.querySelectorAll('[data-counter]');
      const duration = 1800;
      const startTime = performance.now();

      counterElements.forEach((el) => {
        const target = parseInt(el.getAttribute('data-counter') || '0', 10);
        const numSpan = el.querySelector('.counter-num');
        if (!numSpan) return;

        function updateCount(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * target);
          numSpan!.textContent = current.toString();

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            numSpan!.textContent = target.toString();
          }
        }
        requestAnimationFrame(updateCount);
      });
    }
  }

  // 4. Contact Text Progressive Illumination
  const contactSection = document.getElementById('contact');
  const items = document.querySelectorAll(
    '#contactScrollTrack .scroll-word, #contactScrollTrack .scroll-sep'
  );
  if (contactSection && items.length) {
    function checkProgress() {
      const rect = contactSection!.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const enterPoint = windowHeight * 0.9;
      const fullPoint = windowHeight * 0.2;
      const progress = Math.min(
        Math.max((enterPoint - rect.top) / (enterPoint - fullPoint), 0),
        1
      );

      const count = items.length;
      items.forEach((el, index) => {
        const threshold = index / count;
        if (progress >= threshold && progress > 0.02) {
          el.classList.add('is-lit');
        } else {
          el.classList.remove('is-lit');
        }
      });
    }

    window.addEventListener('scroll', () => requestAnimationFrame(checkProgress), {
      passive: true,
    });
    window.addEventListener('resize', checkProgress, { passive: true });
    checkProgress();
  }

  // 5. Sticky Header Scroll Detection
  const header = document.querySelector('.site-header');
  if (header) {
    function updateHeader() {
      if (window.scrollY > 20) {
        header!.classList.add('is-scrolled');
      } else {
        header!.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }
}
