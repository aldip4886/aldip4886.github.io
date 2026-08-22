import { storage } from './storage.js';

export class WalkthroughBeacons {
  constructor(app) {
    this.app = app;
    this.currentStep = 0;
    this.overlay = null;
    this.popover = null;
    this.beacon = null;
    this.currentTarget = null;
    this.activeTourType = 'explorer';
    this.storageKey = 'djbc_explorer_onboarding_completed';

    this.explorerSteps = [
      {
        targetSelector: '#tree-container',
        preferredSelector: '.tree-svg-canvas, #tree-container',
        title: 'Diagram Struktur Organisasi Interaktif',
        description: 'Ini adalah kanvas pohon organisasi DJBC. Klik pada kartu unit organisasi untuk memperluas cabang bawahan atau melihat rincian tugas dan fungsinya.',
        placement: 'center'
      },
      {
        targetSelector: '#breadcrumb-container',
        preferredSelector: '#breadcrumb-container',
        title: 'Navigasi Hirarki (Breadcrumbs)',
        description: 'Pantau posisi level eselon dan unit kerja yang sedang aktif. Anda dapat mengklik level sebelumnya untuk kembali ke tingkat atas dengan cepat.',
        placement: 'bottom'
      },
      {
        targetSelector: '.tree-toolbar',
        preferredSelector: '.tree-toolbar',
        fallbackSelector: '#tree-container',
        title: 'Kontrol Kanvas & Perbesaran',
        description: 'Gunakan tombol Zoom In (+), Zoom Out (−), dan Reset Tampilan untuk menyesuaikan sudut pandang kanvas bagan organisasi.',
        placement: 'right'
      },
      {
        targetSelector: '.search-box',
        preferredSelector: '#global-search-input, .search-box',
        title: 'Pencarian Cerdas Instan',
        description: 'Ketik nama direktorat, kantor vertikal, komoditas, atau nomor PMK untuk langsung menemukan dan menyorot unit kerja terkait.',
        placement: 'bottom'
      },
      {
        targetSelector: '#unit-detail-drawer',
        preferredSelector: '#unit-detail-drawer',
        fallbackSelector: '.header-right',
        title: 'Drawer Rincian Tugas & Fungsi',
        description: 'Saat unit kerja dipilih, lembar samping kanan akan menampilkan pimpinan, dasar hukum PMK, tugas pokok, fungsi, dan daftar seksi bawahan.',
        placement: 'left'
      }
    ];

    this.learningSteps = [
      {
        targetSelector: '#learning-module-tabs',
        preferredSelector: '#learning-module-tabs',
        title: 'Pilihan Modul Pembelajaran (MP 1 s.d. MP 5)',
        description: 'Pilih modul pembelajaran kurikulum Pusdiklat Bea Cukai mulai dari Kedudukan DJBC, Struktur Kantor Pusat, Instansi Vertikal, UPT, hingga Keterkaitan Antar Unit.',
        placement: 'bottom'
      },
      {
        targetSelector: '#learning-stepper-sidebar',
        preferredSelector: '#learning-stepper-sidebar',
        title: 'Daftar Sub-Topik & Status Belajar',
        description: 'Ikuti alur materi secara bertahap melalui daftar sub-topik terstruktur. Anda dapat mengklik sub-topik untuk berpindah materi pembelajaran.',
        placement: 'right'
      },
      {
        targetSelector: '#learning-lesson-content',
        preferredSelector: '#learning-lesson-content',
        title: 'Materi Pelajaran & Dasar Regulasi PMK',
        description: 'Pelajari uraian tugas pokok, fungsi eselon, dan regulasi PMK 124/2024 serta PMK 132/2024 yang disusun ringkas, padat, dan mudah dipahami.',
        placement: 'left'
      },
      {
        targetSelector: '.unit-interactive-card',
        preferredSelector: '#view-learning .unit-interactive-card, .unit-interactive-card',
        fallbackSelector: '#learning-lesson-content',
        title: 'Kartu Unit Interaktif (Drawer Side Panel)',
        description: 'Klik pada kartu unit kerja di dalam materi untuk langsung membuka Drawer Profil Detail Unit (pimpinan, tugas, fungsi, dan eselonisasi).',
        placement: 'top'
      }
    ];

    this.steps = this.explorerSteps;

    this.init();
  }

  init() {
    if (typeof window !== 'undefined') {
      window.walkthroughBeacons = this;
    }
  }

  isCompleted(tourType = this.activeTourType) {
    try {
      const key = tourType === 'learning' ? 'djbc_learning_onboarding_completed' : 'djbc_explorer_onboarding_completed';
      if (typeof localStorage !== 'undefined' && localStorage) {
        return localStorage.getItem(key) === 'true';
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  markCompleted(tourType = this.activeTourType) {
    try {
      const key = tourType === 'learning' ? 'djbc_learning_onboarding_completed' : 'djbc_explorer_onboarding_completed';
      if (typeof localStorage !== 'undefined' && localStorage) {
        localStorage.setItem(key, 'true');
      }
    } catch (e) {}
  }

  start(force = false) {
    this.startExplorerTour(force);
  }

  startExplorerTour(force = false) {
    this.activeTourType = 'explorer';
    this.storageKey = 'djbc_explorer_onboarding_completed';
    this.steps = this.explorerSteps;

    if (!force && this.isCompleted('explorer')) {
      return;
    }

    this.currentStep = 0;
    this.createOverlay();
    this.renderStep(0);
  }

  startLearningTour(force = false) {
    this.activeTourType = 'learning';
    this.storageKey = 'djbc_learning_onboarding_completed';
    this.steps = this.learningSteps;

    if (!force && this.isCompleted('learning')) {
      return;
    }

    this.currentStep = 0;
    this.createOverlay();
    this.renderStep(0);
  }

  createOverlay() {
    if (this.overlay) {
      try {
        this.overlay.remove();
      } catch (e) {}
      this.overlay = null;
    }

    const doc = (typeof document !== 'undefined') ? document : null;
    if (!doc) return;

    // Remove any leftover overlay in DOM
    const oldOverlay = doc.getElementById('walkthrough-overlay');
    if (oldOverlay) {
      try { oldOverlay.remove(); } catch (e) {}
    }

    this.overlay = doc.createElement('div');
    this.overlay.className = 'walkthrough-overlay is-active';
    this.overlay.id = 'walkthrough-overlay';
    this.overlay.style.cssText = 'position:fixed !important; inset:0 !important; z-index:999999 !important; pointer-events:auto !important; display:block !important;';

    this.popover = doc.createElement('div');
    this.popover.className = 'walkthrough-popover';
    this.popover.style.cssText = 'position:fixed !important; z-index:1000001 !important; pointer-events:auto !important;';
    this.popover.addEventListener('click', (e) => e.stopPropagation());
    this.overlay.appendChild(this.popover);

    this.beacon = doc.createElement('div');
    this.beacon.className = 'walkthrough-beacon';
    this.beacon.style.cssText = 'position:fixed !important; z-index:1000000 !important; pointer-events:none !important;';
    this.overlay.appendChild(this.beacon);

    const container = doc.body || doc.getElementById('app-container') || doc.documentElement;
    if (container && container.appendChild) {
      container.appendChild(this.overlay);
    }
  }

  renderStep(index) {
    if (index < 0 || index >= this.steps.length) {
      this.finish();
      return;
    }

    this.currentStep = index;
    const step = this.steps[index];

    // Clear previous target highlight
    if (this.currentTarget) {
      if (this.currentTarget.classList && this.currentTarget.classList.remove) {
        this.currentTarget.classList.remove('walkthrough-highlight-target');
      }
      this.currentTarget = null;
    }

    const doc = (typeof document !== 'undefined') ? document : null;
    if (!doc) return;

    if (!this.overlay || !doc.getElementById('walkthrough-overlay')) {
      this.createOverlay();
    }

    // Find target element
    let targetEl = null;
    if (step.preferredSelector) {
      targetEl = doc.querySelector(step.preferredSelector);
    }
    if (!targetEl && step.targetSelector) {
      targetEl = doc.querySelector(step.targetSelector);
    }
    if (!targetEl && step.fallbackSelector) {
      targetEl = doc.querySelector(step.fallbackSelector);
    }

    // Generate step dots
    let dotsHtml = '';
    for (let i = 0; i < this.steps.length; i++) {
      dotsHtml += `<div class="walkthrough-dot ${i === index ? 'is-active' : ''}"></div>`;
    }

    const isLast = index === this.steps.length - 1;

    this.popover.innerHTML = `
      <div class="walkthrough-popover-header">
        <div class="walkthrough-step-badge">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          Langkah ${index + 1} dari ${this.steps.length}
        </div>
        <button class="walkthrough-close-btn" id="wt-btn-close" title="Tutup Tutorial" aria-label="Tutup" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.skip();}">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div>
        <h3 class="walkthrough-popover-title">${step.title}</h3>
        <p class="walkthrough-popover-desc">${step.description}</p>
        <div class="walkthrough-progress-dots">${dotsHtml}</div>
      </div>
      <div class="walkthrough-popover-footer">
        <button class="walkthrough-btn-skip" id="wt-btn-skip" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.skip();}">LEWATI</button>
        <div class="walkthrough-nav-btns">
          ${index > 0 ? `<button class="walkthrough-btn-prev" id="wt-btn-prev" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.renderStep(${index - 1});}">Sebelumnya</button>` : ''}
          <button class="walkthrough-btn-next" id="wt-btn-next" onclick="if(window.walkthroughBeacons){${isLast ? 'window.walkthroughBeacons.finish()' : `window.walkthroughBeacons.renderStep(${index + 1})`};}">
            ${isLast ? 'Selesai &amp; Mulai Jelajah 🚀' : 'Lanjut &rarr;'}
          </button>
        </div>
      </div>
    `;

    // Position Popover & Beacon relative to target
    this.positionElements(targetEl, step.placement);

    // Event listeners with stopPropagation
    const btnSkip = this.popover.querySelector('#wt-btn-skip');
    if (btnSkip) {
      btnSkip.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.skip();
      });
    }

    const btnClose = this.popover.querySelector('#wt-btn-close');
    if (btnClose) {
      btnClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.skip();
      });
    }

    const btnPrev = this.popover.querySelector('#wt-btn-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.renderStep(index - 1);
      });
    }

    const btnNext = this.popover.querySelector('#wt-btn-next');
    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLast) {
          this.finish();
        } else {
          this.renderStep(index + 1);
        }
      });
    }
  }

  positionElements(targetEl, placement = 'bottom') {
    const popoverWidth = 380;
    const popoverEstimatedHeight = 240;
    const padding = 20;
    const winWidth = (typeof window !== 'undefined' && window.innerWidth) ? window.innerWidth : 1280;
    const winHeight = (typeof window !== 'undefined' && window.innerHeight) ? window.innerHeight : 800;

    let rect = null;
    let hasValidRect = false;

    if (targetEl && typeof targetEl.getBoundingClientRect === 'function') {
      rect = targetEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.bottom > 0) {
        hasValidRect = true;
      }
    }

    // Default center placement fallback
    if (!hasValidRect || placement === 'center') {
      const top = Math.max(padding, Math.round(winHeight * 0.28));
      const left = Math.max(padding, Math.round(winWidth * 0.5 - popoverWidth * 0.5));

      this.popover.style.top = `${top}px`;
      this.popover.style.left = `${left}px`;
      this.popover.style.right = 'auto';
      this.popover.style.bottom = 'auto';
      this.popover.style.transform = 'none';

      if (this.beacon) {
        this.beacon.style.display = 'flex';
        this.beacon.style.left = `${Math.round(winWidth * 0.5)}px`;
        this.beacon.style.top = `${Math.max(40, top - 40)}px`;
      }
      return;
    }

    if (targetEl.classList && targetEl.classList.add) {
      targetEl.classList.add('walkthrough-highlight-target');
    }
    this.currentTarget = targetEl;

    // Beacon position
    if (this.beacon) {
      this.beacon.style.display = 'flex';
      const beaconX = Math.min(winWidth - 24, Math.max(24, Math.round(rect.left + rect.width / 2)));
      const beaconY = Math.min(winHeight - 24, Math.max(24, Math.round(rect.top + rect.height / 2)));
      this.beacon.style.left = `${beaconX}px`;
      this.beacon.style.top = `${beaconY}px`;
    }

    // Calculate Popover Position
    let top = 0;
    let left = 0;

    if (placement === 'bottom') {
      top = rect.bottom + 16;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
    } else if (placement === 'top') {
      top = rect.top - popoverEstimatedHeight - 16;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
    } else if (placement === 'left') {
      top = Math.max(padding, rect.top);
      left = rect.left - popoverWidth - 20;
    } else if (placement === 'right') {
      top = Math.max(padding, rect.top);
      left = rect.right + 20;
    } else {
      top = rect.bottom + 16;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
    }

    // Viewport bounds checking and collision prevention
    if (left < padding) {
      left = padding;
    }
    if (left + popoverWidth > winWidth - padding) {
      left = winWidth - popoverWidth - padding;
    }

    if (top < padding) {
      top = padding;
    }
    if (top + popoverEstimatedHeight > winHeight - padding) {
      // If bottom overflow, flip to above target if possible
      if (rect.top - popoverEstimatedHeight - 16 >= padding) {
        top = rect.top - popoverEstimatedHeight - 16;
      } else {
        top = Math.max(padding, winHeight - popoverEstimatedHeight - padding);
      }
    }

    this.popover.style.top = `${Math.round(top)}px`;
    this.popover.style.left = `${Math.round(left)}px`;
    this.popover.style.right = 'auto';
    this.popover.style.bottom = 'auto';
    this.popover.style.transform = 'none';
  }

  skip() {
    this.finish();
  }

  finish() {
    this.markCompleted();
    if (this.currentTarget) {
      if (this.currentTarget.classList && this.currentTarget.classList.remove) {
        this.currentTarget.classList.remove('walkthrough-highlight-target');
      }
      this.currentTarget = null;
    }
    if (this.overlay) {
      this.overlay.classList.remove('is-active');
      const ov = this.overlay;
      this.overlay = null;
      setTimeout(() => {
        if (ov && ov.remove) {
          try { ov.remove(); } catch (e) {}
        }
      }, 250);
    }
  }
}
