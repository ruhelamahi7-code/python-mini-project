// ── 1. Project cards: populate grid from <template> if still empty ─────
(function () {
  const grid = document.getElementById('projectsGrid');
  if (!grid || grid.children.length > 0) return;
  const tmpl = document.getElementById('projectsTemplate');
  if (!tmpl) return;
  const tmplGrid = tmpl.content.querySelector('.projects-grid');
  if (tmplGrid) grid.innerHTML = tmplGrid.innerHTML;
})();

// ── 2. Timeline items: reveal on scroll ───────────────────────────────
(function () {
  const items = document.querySelectorAll('.timeline-item[data-reveal]');
  if (!items.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();

// ── 3. Track-Route badge: hidden until timeline scrolls into view ──────
(function () {
  const badge   = document.querySelector('.timeline-route-badge');
  const section = document.getElementById('timelineSection');
  if (!badge || !section) return;
  Object.assign(badge.style, {
    opacity: '0', transform: 'translateY(-16px)',
    transition: 'opacity .55s cubic-bezier(.22,1,.36,1), transform .55s cubic-bezier(.22,1,.36,1)'
  });
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      badge.style.opacity = '1'; badge.style.transform = 'translateY(0)';
      io.disconnect();
    }
  }, { threshold: 0.05 });
  io.observe(section);
})();

// ── 4. Hero content: guarantee visibility if animations stall ──────────
(function () {
  const shell = document.querySelector('.hero-shell');
  if (!shell) return;
  setTimeout(() => {
    shell.querySelectorAll('.hero-logo-header,.hero-badge-row,.hero-title-wrapper,.hero-subtitle,.hero-cta-row,.hero-meta')
      .forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  }, 800);
})();

// ── 5. Sidebar: hidden during hero+timeline, appears at projects section
(function () {
  const projectsSection = document.getElementById('projectsSection');

  // Not the index page (sub-pages have sidebar-active on <body> already)
  if (!projectsSection) {
    document.body.classList.add('sidebar-active');
    return;
  }

  // Index page: start with sidebar hidden
  document.body.classList.remove('sidebar-active');

  const THRESHOLD = 0.05;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Projects section in view → show sidebar
        document.body.classList.add('sidebar-active');
      } else {
        // Scrolled back above projects → hide sidebar
        const rect = projectsSection.getBoundingClientRect();
        if (rect.top > 0) document.body.classList.remove('sidebar-active');
      }
    });
  }, { threshold: THRESHOLD });

  io.observe(projectsSection);
})();