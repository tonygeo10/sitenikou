(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');

  var header = document.getElementById('site-header');
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('primary-nav');
  var scrim = document.getElementById('scrim');
  var mq = window.matchMedia('(max-width: 860px)');

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (open) {
      scrim.hidden = false;
      requestAnimationFrame(function () { scrim.classList.add('is-visible'); });
    } else {
      scrim.classList.remove('is-visible');
      setTimeout(function () { if (!nav.classList.contains('is-open')) scrim.hidden = true; }, 300);
    }
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  scrim.addEventListener('click', function () { setMenu(false); });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () {
    if (!mq.matches) setMenu(false);
  });

  /* ---------- Header shadow on scroll ---------- */
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active link while scrolling ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[data-section]'));
  var map = {};
  links.forEach(function (a) { map[a.dataset.section] = a; });
  // The menu mirrors demiacc.gr (Αρχική / Υπηρεσίες / Επικοινωνία); other sections keep the previous highlight.
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
          map[en.target.id].classList.add('is-active');
          map[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });

    /* ---------- Reveal on scroll (subtle, once) ---------- */
    var items = document.querySelectorAll('.reveal');
    var seen = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el, i) {
      el.style.setProperty('--d', ((i % 3) * 0.07) + 's');
      seen.observe(el);
    });

    /* ---------- Load TikTok/Instagram embed scripts only when near ---------- */
    var embeds = document.getElementById('embeds');
    if (embeds) {
      var loader = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) {
          obs.disconnect();
          ['https://www.tiktok.com/embed.js', 'https://www.instagram.com/embed.js'].forEach(function (src) {
            var s = document.createElement('script');
            s.async = true; s.src = src; document.body.appendChild(s);
          });
        }
      }, { rootMargin: '400px 0px' });
      loader.observe(embeds);
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    ['https://www.tiktok.com/embed.js', 'https://www.instagram.com/embed.js'].forEach(function (src) {
      var s = document.createElement('script'); s.async = true; s.src = src; document.body.appendChild(s);
    });
  }
})();