/* =========================================
   BHUJIA BITE — Interactivity
   ========================================= */

(() => {
  'use strict';

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('bbLoader');
    if (loader) setTimeout(() => loader.classList.add('hide'), 600);
  });

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });
  }

  /* ---------- Navbar scroll effect ---------- */
  const nav = document.getElementById('bbNav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.bb-navbar .nav-link');
  const setActive = () => {
    let cur = '';
    const y = window.scrollY + 140;
    sections.forEach(s => {
      if (y >= s.offsetTop) cur = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });

  /* ---------- Spice particle field (banner) ---------- */
  const field = document.getElementById('spiceField');
  if (field) {
    const colors = ['#D62828', '#F77F00', '#FCA311', '#FFD60A', '#9D0208'];
    const count = window.innerWidth < 768 ? 16 : 32;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'spice';
      const size = 4 + Math.random() * 10;
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = '0';
      s.style.background = colors[Math.floor(Math.random() * colors.length)];
      s.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
      s.style.animationDuration = (10 + Math.random() * 18) + 's';
      s.style.animationDelay = (-Math.random() * 20) + 's';
      s.style.opacity = (.3 + Math.random() * .5).toFixed(2);
      field.appendChild(s);
    }
  }

  /* ---------- Parallax on hero stage ---------- */
  const stage = document.getElementById('heroStage');
  const pack = document.getElementById('heroPack');
  if (stage && pack) {
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - .5) * 2;  // -1..1
      const y = ((e.clientY - r.top) / r.height - .5) * 2;
      pack.style.transform =
        `rotateY(${x * 14 - 10}deg) rotateX(${-y * 10 + 4}deg)`;
      const chips = stage.querySelectorAll('.hero-chip');
      chips.forEach((c, i) => {
        const f = (i + 1) * 7;
        c.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
      const sparkles = stage.querySelectorAll('.sparkle');
      sparkles.forEach((s, i) => {
        const f = (i + 1) * 4;
        s.style.translate = `${-x * f}px ${-y * f}px`;
      });
    });
    stage.addEventListener('mouseleave', () => {
      pack.style.transform = '';
      stage.querySelectorAll('.hero-chip, .sparkle').forEach(el => {
        el.style.transform = '';
        el.style.translate = '';
      });
    });
  }

  /* ---------- Number counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: .5 });
    counters.forEach(c => io.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- 3D Product Slider (Swiper Coverflow) ---------- */
  if (window.Swiper) {
    new Swiper('.bb-swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      loop: true,
      speed: 800,
      coverflowEffect: {
        rotate: 28,
        stretch: 0,
        depth: 220,
        modifier: 1.2,
        slideShadows: false
      },
      autoplay: {
        delay: 4500,
        disableOnInteraction: false
      },
      pagination: {
        el: '.bb-swiper .swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-next',
        prevEl: '.swiper-prev'
      },
      breakpoints: {
        320: { coverflowEffect: { depth: 120, rotate: 22 } },
        768: { coverflowEffect: { depth: 180, rotate: 26 } },
        1200: { coverflowEffect: { depth: 240, rotate: 30 } }
      }
    });
  }

  /* ---------- Shop by Flavour filter ---------- */
  const filterPills = document.querySelectorAll('.filter-pill');
  const shopGrid = document.querySelector('.shop-grid');
  if (filterPills.length && shopGrid) {
    const items = shopGrid.querySelectorAll('[data-cat]');
    filterPills.forEach(p => {
      p.addEventListener('click', () => {
        filterPills.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        const f = p.dataset.filter;
        items.forEach(it => {
          const show = f === 'all' || it.dataset.cat === f;
          if (show) {
            it.classList.remove('is-hidden');
            it.style.display = '';
          } else {
            it.classList.add('is-hidden');
            setTimeout(() => { if (it.classList.contains('is-hidden')) it.style.display = 'none'; }, 350);
          }
        });
      });
    });
  }

  /* ---------- Offer popup (10s) ---------- */
  const popup = document.getElementById('bbPopup');
  if (popup && !sessionStorage.getItem('bbPopupShown')) {
    setTimeout(() => {
      popup.classList.add('show');
      popup.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      sessionStorage.setItem('bbPopupShown', '1');
    }, 10000);

    const closePopup = () => {
      popup.classList.remove('show');
      popup.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    popup.querySelectorAll('[data-popup-close]').forEach(el => {
      el.addEventListener('click', closePopup);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && popup.classList.contains('show')) closePopup();
    });

    const popForm = document.getElementById('popForm');
    if (popForm) {
      popForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = popForm.querySelector('button');
        btn.innerHTML = '<i class="bi bi-check2-circle"></i> Code Sent! Check your email.';
        btn.disabled = true;
        setTimeout(closePopup, 1800);
      });
    }
  }

  /* ---------- Contact: Enquiry form ---------- */
  const enqForm = document.getElementById('enqForm');
  if (enqForm) {
    const successBox = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('enqBtn');

    // live remove invalid state on input
    enqForm.querySelectorAll('input, textarea, select').forEach(el => {
      el.addEventListener('input', () => el.closest('.ff')?.classList.remove('is-invalid'));
      el.addEventListener('change', () => el.closest('.ff')?.classList.remove('is-invalid'));
    });

    enqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      enqForm.querySelectorAll('[required]').forEach(el => {
        const wrap = el.closest('.ff');
        const val = (el.value || '').trim();
        let bad = !val;
        if (el.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) bad = true;
        if (bad) { wrap?.classList.add('is-invalid'); valid = false; }
      });

      if (!valid) {
        const firstBad = enqForm.querySelector('.ff.is-invalid');
        if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;

      // Simulate submission
      setTimeout(() => {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
        successBox?.classList.add('show');
        enqForm.reset();
        successBox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => successBox?.classList.remove('show'), 6000);
      }, 1400);
    });
  }

  /* ---------- Contact: FAQ — only one open at a time ---------- */
  const faqList = document.getElementById('faqList');
  if (faqList) {
    const items = faqList.querySelectorAll('.faq-item');
    items.forEach(d => {
      d.addEventListener('toggle', () => {
        if (d.open) items.forEach(o => { if (o !== d) o.removeAttribute('open'); });
      });
    });
  }

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          const top = t.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: 'smooth' });
          const collapse = document.getElementById('mainNav');
          if (collapse && collapse.classList.contains('show') && window.bootstrap) {
            const bs = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse);
            bs.hide();
          }
        }
      }
    });
  });

})();
