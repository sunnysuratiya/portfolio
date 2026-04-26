/* ═══════════════════════════════════════════════
   SUNNY SURATIYA — PORTFOLIO SCRIPT
   Animations · Scroll · Typing · Contact Form
═══════════════════════════════════════════════ */

'use strict';

/* ── NAVBAR SCROLL ────────────────────────────── */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  backToTop.classList.toggle('show', y > 400);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── HAMBURGER MENU ───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── TYPING EFFECT ────────────────────────────── */
const phrases = [
  'Java Backend Engineer',
  'Student Developer 🎓',
  'Backend Systems Enthusiast',
  'Building Scalable Software',
  'Consistent. Disciplined. Growing.',
];
let pIdx = 0, cIdx = 0, isDeleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const current = phrases[pIdx];
  if (isDeleting) {
    typingEl.textContent = current.slice(0, --cIdx);
  } else {
    typingEl.textContent = current.slice(0, ++cIdx);
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && cIdx === current.length) {
    speed = 2200;
    isDeleting = true;
  } else if (isDeleting && cIdx === 0) {
    isDeleting = false;
    pIdx = (pIdx + 1) % phrases.length;
    speed = 400;
  }
  setTimeout(type, speed);
}
type();

/* ── SCROLL REVEAL ────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── SKILL BAR ANIMATION ──────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          setTimeout(() => fill.classList.add('animated'), 200);
        }
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll('.skill-bar').forEach(el => skillObserver.observe(el));

/* ── ACTIVE NAV LINK ON SCROLL ────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--accent)' : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

/* ── SMOOTH ANCHOR SCROLLING ──────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── RESUME BUTTON ────────────────────────────── */
// Replace '#' with your resume PDF path when ready, e.g., './resume.pdf'
document.getElementById('resumeBtn').setAttribute('href', '#');
document.getElementById('resumeBtn').addEventListener('click', (e) => {
  // Remove this listener once you add a real resume file
  e.preventDefault();
  showToast('📄 Resume coming soon! Check back later.');
});

/* ── TOAST NOTIFICATION ───────────────────────── */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 28px;
    background: var(--surface);
    border: 1px solid ${type === 'success' ? 'var(--accent)' : 'var(--border)'};
    color: var(--text);
    padding: 14px 20px;
    border-radius: 10px;
    font-size: 0.88rem;
    font-family: var(--font-body);
    z-index: 9999;
    animation: toastIn 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    max-width: 300px;
    line-height: 1.5;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Inject toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(12px); }
  }
`;
document.head.appendChild(style);

/* ══════════════════════════════════════════════════
   CONTACT FORM — EmailJS Integration
   ──────────────────────────────────────────────────
   HOW TO SET UP:
   1. Go to https://www.emailjs.com and create a free account
   2. Create a new Email Service (Gmail recommended)
   3. Create an Email Template with these variables:
      {{from_name}}, {{from_email}}, {{subject}}, {{message}}
   4. Copy your Public Key, Service ID, and Template ID
   5. Replace the values below ↓
══════════════════════════════════════════════════ */

// ── CONFIG (fill these in) ──
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // e.g., 'user_abc123...'
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // e.g., 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // e.g., 'template_abc123'
const EMAILJS_ENABLED     = false; // Set to TRUE once you add real keys above

// ── Load EmailJS SDK ──
if (EMAILJS_ENABLED) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  script.onload = () => emailjs.init(EMAILJS_PUBLIC_KEY);
  document.head.appendChild(script);
}

// ── Form Handler ──
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formStatus  = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = document.getElementById('formName').value.trim();
  const email   = document.getElementById('formEmail').value.trim();
  const subject = document.getElementById('formSubject').value.trim();
  const message = document.getElementById('formMessage').value.trim();

  if (!name || !email || !message) {
    formStatus.style.color = '#ff6b6b';
    formStatus.textContent = '⚠️ Please fill in all required fields.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  formStatus.style.color = 'var(--text-dim)';
  formStatus.textContent = 'Sending your message...';

  if (!EMAILJS_ENABLED) {
    // Simulate for demo
    await new Promise(r => setTimeout(r, 1400));
    formStatus.style.color = 'var(--accent)';
    formStatus.textContent = '✅ Message received! (Demo mode — connect EmailJS to activate)';
    submitBtn.textContent = 'Send Message ✉️';
    submitBtn.disabled = false;
    contactForm.reset();
    showToast('✅ Message sent! (Demo mode)', 'success');
    return;
  }

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name:  name,
      from_email: email,
      subject:    subject || 'Portfolio Contact',
      message:    message,
      to_email:   'sunnysuratiya999@gmail.com',
    });
    formStatus.style.color = 'var(--accent)';
    formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.';
    contactForm.reset();
    showToast('✅ Message sent successfully!', 'success');
  } catch (err) {
    console.error('EmailJS error:', err);
    formStatus.style.color = '#ff6b6b';
    formStatus.textContent = '❌ Failed to send. Please email me directly.';
  } finally {
    submitBtn.textContent = 'Send Message ✉️';
    submitBtn.disabled = false;
  }
});

/* ── CARD HOVER TILT EFFECT ───────────────────── */
document.querySelectorAll('.project-card, .blog-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── CONSOLE EASTER EGG ───────────────────────── */
console.log(`
%c ☕ Hey, you found the console!
%c I'm Sunny Suratiya — Java Backend Engineer in progress.
%c Let's connect: sunnysuratiya999@gmail.com
`,
  'font-size:18px; font-weight:bold; color:#00d4aa;',
  'font-size:13px; color:#8a9ab0;',
  'font-size:13px; color:#8a9ab0;'
);
