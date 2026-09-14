/**
 * James Ononiwu Portfolio - Interactive Scripts
 * Theme Toggle, Scrollspy, Interactive Filtering, Copy-to-Clipboard & Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initScrollSpy();
  initSkillFilters();
  initCopyActions();
  initContactForm();
});

/* --- Theme Management --- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('jo-portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set default theme: stored preference or dark by default
  const activeTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark');
  document.documentElement.setAttribute('data-theme', activeTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('jo-portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* --- Mobile Navigation & Navbar Scroll Effect --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  // Sticky Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* --- ScrollSpy for Active Navigation Link --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* --- Skills Matrix Filter Tabs --- */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- Copy-To-Clipboard Actions --- */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('.copy-action-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Text';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback method
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast(`Copied ${label} to clipboard!`);
      } catch (err) {
        console.error('Failed to copy: ', err);
        showToast(`Could not copy automatically`);
      }
    });
  });
}

/* --- Interactive Contact Form --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyDraftBtn = document.getElementById('copy-draft-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      const bodyText = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
      const mailtoUrl = `mailto:jamesononiwu@gmail.com?subject=${encodeURIComponent(subject)}&body=${bodyText}`;

      // Trigger mail client
      window.location.href = mailtoUrl;
      showToast('Opening your email client...');
    });
  }

  if (copyDraftBtn) {
    copyDraftBtn.addEventListener('click', async () => {
      const name = document.getElementById('form-name')?.value.trim() || 'Client / Partner';
      const email = document.getElementById('form-email')?.value.trim() || 'Not specified';
      const subject = document.getElementById('form-subject')?.value.trim() || 'Inquiry regarding Engineering / Advisory';
      const message = document.getElementById('form-message')?.value.trim() || 'Hi James, I would like to connect with you regarding...';

      const draftText = `To: jamesononiwu@gmail.com\nSubject: ${subject}\nFrom: ${name} (${email})\n\n${message}`;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(draftText);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = draftText;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast('Message draft copied to clipboard!');
      } catch (err) {
        showToast('Unable to copy draft automatically');
      }
    });
  }
}

/* --- Toast Notification Helper --- */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span class="toast-text"></span>
    `;
    document.body.appendChild(toast);
  }

  const toastText = toast.querySelector('.toast-text');
  toastText.textContent = message;

  clearTimeout(toastTimeout);
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
