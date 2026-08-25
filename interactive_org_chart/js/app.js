/**
 * app.js — Main Application Orchestrator for DJBC Interactive Organization Explorer.
 * Connects SVGTreeEngine, IndonesiaMapEngine, DetailPanel, SearchEngine, AssessmentEngine,
 * LearningModuleEngine, ProcessFlowEngine, RelationshipsViewEngine, and Navigation.
 */

import { SVGTreeEngine } from './tree.js';
import { IndonesiaMapEngine } from './map.js';
import { DetailPanel } from './panel.js';
import { Breadcrumb } from './breadcrumb.js';
import { SearchEngine } from './search.js';
import { AssessmentEngine } from './assessment.js';
import { progressTracker } from './progress.js';
import { LearningModuleEngine } from './learning.js';
import { ProcessFlowEngine } from './process-flow.js';
import { RelationshipsViewEngine } from './relationships-view.js';
import { scorm } from './scorm.js';
import { storage } from './storage.js';
import { WalkthroughBeacons } from './walkthrough.js';
import { userProfile } from './user-profile.js';

export class DJBCExplorerApp {
  constructor() {
    this.currentView = 'view-landing';
    this.treeEngine = null;
    this.mapEngine = null;
    this.panel = null;
    this.breadcrumb = null;
    this.searchEngine = null;
    this.quizEngine = null;
    this.learningEngine = null;
    this.processEngine = null;
    this.relationshipsEngine = null;
    this.walkthrough = null;

    // Datasets
    this.orgTreeData = null;
    this.unitsDict = {};
    this.relationshipsData = [];
    this.assessmentsData = [];
    this.geoData = [];
    this.kanwilMapping = {};
    this.searchIndex = [];
    this.alurProses = {};
    this.quickfacts = {};
    this.learningPaths = [];

    this.init();
  }

  async init() {
    try {
      if (typeof scorm !== 'undefined' && scorm && typeof scorm.init === 'function') {
        scorm.init();
      }
    } catch (e) {
      console.warn("SCORM initialization skipped:", e);
    }

    this.loadData();
    this.initTheme();
    this.initNavigation();
    this.initExplorer();
    this.initSearch();
    this.initMap();
    this.initAssessment();
    this.initProgressView();
    this.initLearning();
    this.initProcessFlow();
    this.initRelationships();
    this.initWalkthrough();
    this.initQuickFactsFooter();
    this.initHashRouting();
  }

  loadData() {
    this.orgTreeData = window.DATA_ORGANIZATION || window.ORGANIZATION_DATA || window.__DJBC_ORG_DATA__ || {};
    this.unitsDict = window.DATA_UNITS || window.UNITS_DATA || window.__DJBC_UNITS_DATA__ || {};
    this.relationshipsData = window.DATA_RELATIONSHIPS || window.RELATIONSHIPS_DATA || window.__DJBC_RELATIONSHIPS__ || [];
    this.assessmentsData = window.DATA_ASSESSMENTS || window.assessmentsData || window.__DJBC_ASSESSMENTS__ || [];
    this.geoData = window.DATA_GEO_UNITS || window.__DJBC_GEO_DATA__ || [];
    this.kanwilMapping = window.DATA_KANWIL_MAPPING || window.__DJBC_KANWIL_MAPPING__ || {};
    this.searchIndex = window.DATA_SEARCH_INDEX || window.__DJBC_SEARCH_INDEX__ || [];
    this.alurProses = window.DATA_ALUR_PROSES || window.__DJBC_ALUR_PROSES__ || {};
    this.quickfacts = window.DATA_QUICKFACTS || window.__DJBC_QUICKFACTS__ || {};
    this.learningPaths = window.DATA_LEARNING_PATHS || window.__DJBC_LEARNING_PATHS__ || [];
    this.provinceGeoData = window.DATA_PROVINCE_GEO || null;
    this.officesGeoData = window.DATA_OFFICES_GEO || null;

    // Mirror to both window prefixes for universal interoperability
    window.__DJBC_ORG_DATA__ = this.orgTreeData;
    window.__DJBC_UNITS_DATA__ = this.unitsDict;
    window.__DJBC_RELATIONSHIPS__ = this.relationshipsData;
    window.__DJBC_ASSESSMENTS__ = this.assessmentsData;
    window.__DJBC_GEO_DATA__ = this.geoData;
    window.__DJBC_KANWIL_MAPPING__ = this.kanwilMapping;
    window.__DJBC_SEARCH_INDEX__ = this.searchIndex;
    window.__DJBC_ALUR_PROSES__ = this.alurProses;
    window.__DJBC_QUICKFACTS__ = this.quickfacts;
    window.__DJBC_LEARNING_PATHS__ = this.learningPaths;
  }

  initTheme() {
    let savedTheme = 'light';
    try {
      savedTheme = localStorage.getItem('djbc_theme_mode') || 'light';
    } catch (e) {}

    this.setTheme(savedTheme);

    // Attach listeners to all theme toggle buttons across the app (Header & Beranda)
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn, #landing-theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(nextTheme);
      });
    });
  }

  setTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (document.body) {
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
      document.body.classList.toggle('theme-dark', isDark);
    }
    document.documentElement.classList.toggle('theme-dark', isDark);

    try {
      localStorage.setItem('djbc_theme_mode', isDark ? 'dark' : 'light');
    } catch (e) {}

    // Update label text if present on any toggle buttons
    document.querySelectorAll('.theme-toggle-label').forEach(label => {
      label.textContent = isDark ? 'Mode Gelap' : 'Mode Terang';
    });

    // Notify engines if needed
    if (this.treeEngine && typeof this.treeEngine.onThemeChange === 'function') {
      this.treeEngine.onThemeChange(isDark ? 'dark' : 'light');
    }
  }

  requestFullscreen() {
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          docEl.msRequestFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen request was prevented or not supported:", err);
    }
  }

  initNavigation() {
    // Mobile Hamburger Menu Toggle & Sidebar Backdrop
    const mobileMenuToggle = (typeof document !== 'undefined' && typeof document.getElementById === 'function') ? document.getElementById('mobile-menu-toggle') : null;
    const sidebar = (typeof document !== 'undefined' && typeof document.querySelector === 'function') ? document.querySelector('.sidebar') : null;
    const sidebarBackdrop = (typeof document !== 'undefined' && typeof document.getElementById === 'function') ? document.getElementById('sidebar-backdrop') : null;

    if (mobileMenuToggle && sidebar) {
      mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sidebar.classList.toggle('mobile-open');
        if (sidebarBackdrop) {
          sidebarBackdrop.classList.toggle('active', isOpen);
        }
      });
    }

    if (sidebarBackdrop && sidebar) {
      sidebarBackdrop.addEventListener('click', () => {
        sidebar.classList.remove('mobile-open');
        sidebarBackdrop.classList.remove('active');
      });
    }

    // Sidebar Header click to Beranda
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader && typeof sidebarHeader.addEventListener === 'function') {
      sidebarHeader.addEventListener('click', () => {
        this.switchView('view-landing');
      });
    }

    // Sidebar nav items
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetView = item.getAttribute('data-view');
        if (targetView) {
          this.switchView(targetView);
        }
      });
    });

    // Landing Page CTA and Cards (Activates Fullscreen & Switches View)
    const landingExplorationBtns = document.querySelectorAll('[data-action="start-exploration"], #btn-start-exploration, .landing-cta-btn');
    landingExplorationBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.requestFullscreen();
        this.switchView('view-explorer');
      });
    });

    // Landing Page Help Button (Lihat Panduan - Activates Fullscreen & Switches View)
    const landingHelpBtns = document.querySelectorAll('#btn-landing-help, [data-action="view-help"], #landing-btn-help');
    landingHelpBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.requestFullscreen();
        this.switchView('view-help');
      });
    });

    // Header Help Button
    const headerHelpBtn = document.querySelector('.btn-header-help');
    if (headerHelpBtn) {
      headerHelpBtn.addEventListener('click', () => {
        this.switchView('view-help');
      });
    }

    // Floating Help Toggle Buttons on Explorer & Map
    const explorerHelpToggleBtn = document.getElementById('explorer-help-toggle-btn');
    if (explorerHelpToggleBtn) {
      explorerHelpToggleBtn.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        this.toggleHelpTip('explorer');
      });
    }
    const mapHelpToggleBtn = document.getElementById('map-help-toggle-btn');
    if (mapHelpToggleBtn) {
      mapHelpToggleBtn.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        this.toggleHelpTip('map');
      });
    }

    // Landing feature cards direct view navigation
    const landingFeatureCards = document.querySelectorAll('.landing-feature-card, .feature-card');
    landingFeatureCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const directView = card.getAttribute('data-view');
        if (directView) {
          this.switchView(directView);
          return;
        }
        const cardTitle = card.querySelector('.card-title, h3');
        const text = cardTitle ? cardTitle.textContent.toLowerCase() : '';
        if (text.includes('belajar') || text.includes('mandiri') || text.includes('modul')) {
          this.switchView('view-learning');
        } else if (text.includes('keterkaitan') || text.includes('relasi') || text.includes('pahami')) {
          this.switchView('view-connections');
        } else if (text.includes('alur') || text.includes('proses')) {
          this.switchView('view-process');
        } else if (text.includes('uji') || text.includes('kuis') || text.includes('evaluasi') || text.includes('pemahaman')) {
          this.switchView('view-quiz');
        } else if (text.includes('eksplorasi')) {
          this.switchView('view-explorer');
        } else if (index === 0) {
          this.switchView('view-explorer');
        } else if (index === 1) {
          this.switchView('view-connections');
        } else if (index === 2) {
          this.switchView('view-process');
        } else if (index === 3) {
          this.switchView('view-quiz');
        }
      });
    });

    // Sound toggle on landing page
    const soundBtn = document.getElementById('landing-btn-sound');
    if (soundBtn) {
      let soundEnabled = true;
      soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundBtn.style.background = soundEnabled ? 'transparent' : 'rgba(239, 68, 68, 0.2)';
        soundBtn.style.color = soundEnabled ? 'rgba(255, 255, 255, 0.8)' : '#F87171';
        soundBtn.title = soundEnabled ? 'Audio Aktif' : 'Audio Nonaktif';
      });
    }
  }

  initHashRouting() {
    const handleHash = () => {
      const hash = window.location.hash;
      if (!hash) return;

      if (hash.includes('explorer') || hash.includes('hirarki')) this.switchView('view-explorer');
      else if (hash.includes('map') || hash.includes('sebaran')) this.switchView('view-map');
      else if (hash.includes('learning') || hash.includes('jalur')) this.switchView('view-learning');
      else if (hash.includes('quiz') || hash.includes('tantangan')) this.switchView('view-quiz');
      else if (hash.includes('progress') || hash.includes('progres')) this.switchView('view-progress');
      else if (hash.includes('process') || hash.includes('sop') || hash.includes('alur')) this.switchView('view-process');
      else if (hash.includes('connections') || hash.includes('relasi') || hash.includes('keterkaitan')) this.switchView('view-connections');
      else if (hash.includes('search') || hash.includes('pencarian')) {
        this.switchView('view-search');
        if (hash.includes('?q=')) {
          const q = decodeURIComponent(hash.split('?q=')[1] || '');
          if (this.searchEngine && q) {
            this.searchEngine.renderSearchPage(q);
          }
        }
      }
      else if (hash.includes('help') || hash.includes('bantuan')) this.switchView('view-help');
      else if (hash.includes('about') || hash.includes('tentang')) this.switchView('view-about');
      else if (hash.includes('landing') || hash.includes('beranda')) this.switchView('view-landing');

      // Unit detail routing from URL hash
      if (hash.includes('/unit/') || hash.includes('/kantor-pusat/') || hash.includes('/kanwil/') || hash.includes('/kppbc/') || hash.includes('/upt/')) {
        const parts = hash.split('/');
        const unitId = parts[parts.length - 1];
        if (unitId && this.unitsDict[unitId]) {
          this.switchView('view-explorer');
          this.selectUnit(unitId);
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    if (window.location.hash) {
      handleHash();
    }
  }

  switchView(viewId) {
    const prevView = this.currentView;
    this.currentView = viewId;

    // Auto-close mobile sidebar when changing view
    const sidebarEl = (typeof document !== 'undefined' && typeof document.querySelector === 'function') ? document.querySelector('.sidebar') : null;
    const sidebarBackdropEl = (typeof document !== 'undefined' && typeof document.getElementById === 'function') ? document.getElementById('sidebar-backdrop') : null;
    if (sidebarEl && sidebarEl.classList) sidebarEl.classList.remove('mobile-open');
    if (sidebarBackdropEl && sidebarBackdropEl.classList) sidebarBackdropEl.classList.remove('active');

    // Automatically close side panel drawer whenever user switches page/view
    if (prevView && prevView !== viewId) {
      if (this.panel && typeof this.panel.close === 'function') {
        this.panel.close();
      }
    }

    // Toggle landing page mode on app container (hides sidebar & search on landing)
    const appContainer = document.getElementById('app-container');
    if (appContainer) {
      if (viewId === 'view-landing') {
        appContainer.classList.add('is-landing');
      } else {
        appContainer.classList.remove('is-landing');
      }
    }

    // Toggle Quick Facts Footer visibility (hidden on landing/Beranda page, visible on other pages)
    const quickFactsFooter = document.getElementById('global-quickfacts-bar');
    if (quickFactsFooter && quickFactsFooter.style) {
      if (viewId === 'view-landing') {
        quickFactsFooter.style.display = 'none';
      } else {
        quickFactsFooter.style.display = '';
      }
    }

    // Update nav active states
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Switch view containers
    const views = document.querySelectorAll('.page-view');
    views.forEach(v => {
      if (v.id === viewId) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });

    // Special view triggers
    if (viewId === 'view-explorer') {
      if (this.treeEngine) {
        this.treeEngine.setTreeData(this.orgTreeData);
        this.treeEngine.setUnitsDict(this.unitsDict);
        this.treeEngine.renderTree();
        if (!this.treeEngine.selectedNodeId) {
          this.treeEngine.autoFitView();
        }
      }
      // Onboarding walkthrough temporarily disabled per request; show contextual help tips card instead
      this.checkAndShowHelpTip('explorer');
    } else if (viewId === 'view-map') {
      this.checkAndShowHelpTip('map');
      if (this.mapEngine) {
        requestAnimationFrame(() => {
          if (this.mapEngine.onViewActivated) {
            this.mapEngine.onViewActivated();
          } else {
            this.mapEngine.render();
          }
        });
      }
    } else if (viewId === 'view-progress') {

      this.initProgressView();
    } else if (viewId === 'view-learning' && this.learningEngine) {
      this.learningEngine.render();
      setTimeout(() => {
        if (this.walkthrough) {
          this.walkthrough.startLearningTour();
        }
      }, 350);
    } else if (viewId === 'view-process' && this.processEngine) {
      this.processEngine.render();
      setTimeout(() => {
        if (this.walkthrough) {
          this.walkthrough.startProcessTour();
        }
      }, 350);
    } else if (viewId === 'view-connections' && this.relationshipsEngine) {
      this.relationshipsEngine.render();
      setTimeout(() => {
        if (this.walkthrough) {
          this.walkthrough.startRelationshipsTour();
        }
      }, 350);
    } else if (viewId === 'view-search' && this.searchEngine) {
      this.searchEngine.renderSearchPage(this.searchEngine.currentQuery || '');
    } else if (viewId === 'view-quiz' && this.quizEngine) {
      if (!this.quizEngine.allQuestions || !this.quizEngine.allQuestions.length) {
        this.quizEngine.setQuestions(this.assessmentsData);
      } else if (!this.quizEngine.container || !this.quizEngine.container.innerHTML.trim()) {
        this.quizEngine.renderCurrentQuestion();
      }
    }
  }

  initExplorer() {
    const treeContainer = document.getElementById('tree-container');
    const drawerEl = document.getElementById('unit-detail-drawer');
    const breadcrumbEl = document.getElementById('breadcrumb-container');

    if (!treeContainer || !drawerEl) return;

    this.panel = new DetailPanel(
      drawerEl,
      this.unitsDict,
      (childUnit) => {
        if (childUnit) {
          this.selectUnit(childUnit);
        }
      },
      (targetUnit) => {
        this.navigateToMapUnit(targetUnit);
      }
    );
    this.breadcrumb = new Breadcrumb(breadcrumbEl, this.unitsDict, (unitId) => {
      this.selectUnit(unitId);
    });

    this.treeEngine = new SVGTreeEngine(
      treeContainer,
      (unitId) => {
        this.selectUnit(unitId);
      },
      (unitId, isExpanded) => {
        // Expand/collapse callback
      }
    );

    this.treeEngine.setTreeData(this.orgTreeData);
    this.treeEngine.setUnitsDict(this.unitsDict);
  }

  selectUnit(unitInput, openModal = false, forceOpen = false) {
    if (!unitInput) return;

    let unit = null;
    let unitId = null;

    if (typeof unitInput === 'string') {
      unitId = unitInput;
      unit = this.unitsDict[unitId];
    } else if (typeof unitInput === 'object') {
      unit = unitInput;
      unitId = unitInput.id;
    }

    if (!unitId) return;

    // Toggle behavior: If the clicked unit is already open in the side panel, toggle it closed
    if (!forceOpen && this.panel && this.panel.isOpen && this.panel.currentUnit && this.panel.currentUnit.id === unitId) {
      this.panel.close();
      if (this.treeEngine) {
        this.treeEngine.selectedNodeId = null;
        this.treeEngine.renderTree();
      }
      return;
    }

    // Build fallback unit if not present
    if (!unit) {
      let parentId = null;
      if (unitId.includes('-')) {
        const parts = unitId.split('-');
        for (let i = parts.length - 1; i >= 1; i--) {
          const potParent = parts.slice(0, i).join('-');
          if (this.unitsDict[potParent]) {
            parentId = potParent;
            break;
          }
        }
      }

      const rawName = (typeof unitInput === 'object' ? (unitInput.nama || unitInput.label) : null);
      let inferredName = rawName || unitId;
      if (inferredName === unitId || !rawName || inferredName.includes('-seksi-') || inferredName.includes('-subbag-') || inferredName.includes('&')) {
        if (unitId.endsWith('-seksi-1')) inferredName = 'Seksi Standardisasi dan Perumusan Teknis';
        else if (unitId.endsWith('-seksi-2')) inferredName = 'Seksi Bimbingan Teknis dan Supervisi';
        else if (unitId.endsWith('-seksi-3')) inferredName = 'Seksi Monitoring, Evaluasi, dan Pengendalian';
        else if (unitId.endsWith('-subbag-1')) inferredName = 'Subbagian Tata Laksana dan Kepegawaian';
        else if (unitId.endsWith('-subbag-2')) inferredName = 'Subbagian Kinerja dan Keuangan';
        else if (unitId.endsWith('-subbag-3')) inferredName = 'Subbagian Rumah Tangga dan Perlengkapan';
        else if (unitId.endsWith('-dukungan-teknis')) inferredName = 'Subbagian Dukungan Teknis dan Tata Usaha';
        else if (unitId.endsWith('-tim-pengkaji')) inferredName = 'Tim Pengkaji Kebijakan Strategis';
        else if (unitId.endsWith('-subbag-umum')) inferredName = 'Subbagian Umum';
        else if (unitId.endsWith('-seksi-pelayanan')) inferredName = 'Seksi Pelayanan Kepabeanan dan Cukai';
        else if (unitId.endsWith('-seksi-pelayanan-1')) inferredName = 'Seksi Pelayanan Kepabeanan dan Cukai I';
        else if (unitId.endsWith('-seksi-pelayanan-2')) inferredName = 'Seksi Pelayanan Kepabeanan dan Cukai II';
        else if (unitId.endsWith('-seksi-fasilitas')) inferredName = 'Seksi Fasilitas Kepabeanan dan Cukai';
        else if (unitId.endsWith('-seksi-p2')) inferredName = 'Seksi Penindakan dan Penyidikan';
        else if (unitId.endsWith('-seksi-intelijen')) inferredName = 'Seksi Intelijen';
        else if (unitId.endsWith('-seksi-penindakan')) inferredName = 'Seksi Penindakan';
        else if (unitId.endsWith('-seksi-penyidikan')) inferredName = 'Seksi Penyidikan dan Barang Hasil Penindakan';
        else if (unitId.endsWith('-seksi-perbendaharaan')) inferredName = 'Seksi Perbendaharaan';
        else if (unitId.endsWith('-seksi-ki')) inferredName = 'Seksi Kepatuhan Internal dan Penyuluhan';
        else if (unitId.endsWith('-seksi-kepatuhan')) inferredName = 'Seksi Kepatuhan Pelaksanaan Tugas';
        else if (unitId.endsWith('-seksi-manajemen-risiko')) inferredName = 'Seksi Manajemen Risiko';
        else if (rawName) inferredName = rawName.replace(/\s+&\s+/g, ' dan ');
      }

      const pimpinanName = inferredName.startsWith('Subbagian') || inferredName.startsWith('Subbag')
        ? 'Kepala ' + inferredName
        : (inferredName.startsWith('Seksi') ? 'Kepala ' + inferredName : (inferredName.startsWith('Tim') ? 'Ketua ' + inferredName : 'Kepala Seksi'));

      unit = {
        id: unitId,
        nama: inferredName,
        nama_resmi: inferredName,
        singkatan: inferredName,
        level: 'eselon-4',
        eselon: 'IV',
        parent: parentId,
        jabatan_pimpinan: pimpinanName,
        pimpinan: pimpinanName,
        lokasi: 'Kantor Pusat DJBC (Jakarta)',
        dasar_hukum: 'PMK Nomor 124 Tahun 2024',
        tugas: inferredName.startsWith('Subbag') || inferredName.startsWith('Subbagian')
          ? 'Melaksanakan urusan tata laksana, kepegawaian, keuangan, rumah tangga, dan dukungan administratif.'
          : 'Melaksanakan penyiapan bahan perumusan kebijakan teknis, standardisasi, bimbingan teknis, supervisi, monitoring, dan evaluasi.',
        fungsi: [
          'Pelaksanaan operasional teknis dan bimbingan supervisi',
          'Penatausahaan, pemantauan, evaluasi, dan pelaporan kinerja'
        ],
        children: []
      };
      this.unitsDict[unitId] = unit;
    }

    // Save to storage; drawer rendering must still work if storage is unavailable.
    try {
      if (storage && typeof storage.recordVisitedUnit === 'function') {
        storage.recordVisitedUnit(unitId);
      } else if (storage && typeof storage.addVisitedUnit === 'function') {
        storage.addVisitedUnit(unitId);
      }
    } catch (e) {
      console.warn('Unable to record visited unit:', e);
    }

    // Update panel
    if (this.panel) {
      this.panel.open(unit);
    }

    // Update breadcrumb
    if (this.breadcrumb) {
      this.breadcrumb.update(unitId);
    }

    // Highlight node on tree
    if (this.treeEngine) {
      this.treeEngine.selectedNodeId = unitId;
      this.treeEngine.expandAncestors(unitId);
      this.treeEngine.renderTree();
      this.treeEngine.centerOnNode(unitId);
    }
  }

  initSearch() {
    const inputEl = document.getElementById('global-search-input');
    const dropdownEl = document.getElementById('global-search-dropdown');
    const pageContainer = document.getElementById('search-page-container');

    if (inputEl && dropdownEl) {
      this.searchEngine = new SearchEngine(
        inputEl,
        dropdownEl,
        pageContainer,
        (unitId) => {
          this.switchView('view-explorer');
          this.selectUnit(unitId);
        },
        (unitId) => {
          this.switchView('view-explorer');
          this.selectUnit(unitId, true);
        },
        (viewId) => {
          this.switchView(viewId);
        },
        (unitId) => {
          this.openUnitDrawer(unitId);
        }
      );
      this.searchEngine.setIndex(this.searchIndex);
      this.searchEngine.setUnitsDict(this.unitsDict);
    }
  }

  initMap() {
    const mapContainer = document.getElementById('map-view-container');
    if (mapContainer) {
      this.mapEngine = new IndonesiaMapEngine(
        mapContainer,
        this.unitsDict,
        this.kanwilMapping,
        (unitId) => {
          this.switchView('view-explorer');
          this.selectUnit(unitId);
        },
        (unitObjOrId) => {
          if (!unitObjOrId) {
            if (this.panel && typeof this.panel.close === 'function') {
              this.panel.close();
            }
            return;
          }
          const unitId = typeof unitObjOrId === 'string' ? unitObjOrId : (unitObjOrId ? unitObjOrId.id : null);
          const unit = (unitId && this.unitsDict[unitId]) ? this.unitsDict[unitId] : (typeof unitObjOrId === 'object' ? unitObjOrId : null);
          if (unit && this.panel) {
            if (this.panel.isOpen && this.panel.currentUnit && this.panel.currentUnit.id === unit.id) {
              this.panel.close();
            } else {
              this.panel.open(unit);
            }
          }
        }
      );
      this.mapEngine.setGeoData(this.geoData);
      if (this.provinceGeoData) {
        this.mapEngine.setProvinceGeoData(this.provinceGeoData);
      }
      if (this.officesGeoData) {
        this.mapEngine.setOfficesGeoData(this.officesGeoData);
      }
    }
  }


  navigateToMapUnit(unitInput) {
    if (!unitInput) return;
    this.switchView('view-map');
    if (this.mapEngine) {
      this.mapEngine.focusOnUnit(unitInput);
    }
  }

  initAssessment() {
    const quizContainer = document.getElementById('quiz-view-container');
    if (quizContainer) {
      this.quizEngine = new AssessmentEngine(
        quizContainer,
        (score, stats) => {
          storage.saveAssessmentScore('quiz-main', score);
          scorm.setCompletion(score, score >= 70);
        },
        (viewId) => {
          this.switchView(viewId);
        }
      );
      this.quizEngine.setQuestions(this.assessmentsData);
    }
  }

  initProgressView() {
    const progressContainer = document.getElementById('progress-view-container');
    if (progressContainer) {
      progressTracker.renderProgressDashboard(progressContainer, (viewId) => {
        this.switchView(viewId);
      });
    }
  }

  openUnitDrawer(unitIdOrObj) {
    if (!unitIdOrObj) return;
    let unit = null;
    if (typeof unitIdOrObj === 'string') {
      unit = this.unitsDict[unitIdOrObj];
      if (!unit) {
        // Fallback search for aliases or generic roles
        if (unitIdOrObj === 'kanwil') unit = this.unitsDict['kanwil-jabar'];
        else if (unitIdOrObj === 'kppbc') unit = this.unitsDict['kppbc-bandung'];
        else if (unitIdOrObj === 'blbc') unit = this.unitsDict['blbc-jakarta'];
        else if (unitIdOrObj === 'pso') unit = this.unitsDict['pso-tbk'];
        else {
          const matchKey = Object.keys(this.unitsDict).find(k => k.includes(unitIdOrObj) || unitIdOrObj.includes(k));
          if (matchKey) unit = this.unitsDict[matchKey];
        }
      }
    } else if (typeof unitIdOrObj === 'object') {
      unit = unitIdOrObj;
    }

    if (unit && this.panel) {
      this.panel.open(unit);
    }
  }

  initLearning() {
    const learningContainer = document.getElementById('learning-view-container');
    if (learningContainer) {
      this.learningEngine = new LearningModuleEngine(
        learningContainer,
        this.learningPaths,
        this.unitsDict,
        (viewId) => {
          this.switchView(viewId);
        },
        (unitId) => {
          this.openUnitDrawer(unitId);
        }
      );
      this.learningEngine.render();
    }
  }

  initProcessFlow() {
    const processContainer = document.getElementById('process-view-container');
    if (processContainer) {
      this.processEngine = new ProcessFlowEngine(
        processContainer,
        this.alurProses,
        (unitId) => {
          this.openUnitDrawer(unitId);
        },
        (unitId) => {
          this.switchView('view-explorer');
          this.selectUnit(unitId);
        }
      );
      this.processEngine.render();
    }
  }

  initWalkthrough() {
    this.walkthrough = new WalkthroughBeacons(this);
  }

  checkAndShowHelpTip(viewType) {
    try {
      const storageKey = `djbc_tip_${viewType}_dismissed`;
      const isDismissed = (typeof localStorage !== 'undefined' && localStorage) ? (localStorage.getItem(storageKey) === 'true') : false;
      if (!isDismissed) {
        const card = document.getElementById(`${viewType}-help-tips-card`);
        if (card) {
          card.style.display = 'block';
        }
      }
    } catch (e) {
      console.warn(`Unable to check help tip for ${viewType}:`, e);
    }
  }

  dismissHelpTip(viewType) {
    try {
      const storageKey = `djbc_tip_${viewType}_dismissed`;
      if (typeof localStorage !== 'undefined' && localStorage) {
        localStorage.setItem(storageKey, 'true');
      }
    } catch (e) {}
    const card = document.getElementById(`${viewType}-help-tips-card`);
    if (card) {
      card.style.display = 'none';
    }
  }

  toggleHelpTip(viewType) {
    const card = document.getElementById(`${viewType}-help-tips-card`);
    if (card) {
      const computedDisplay = (typeof window !== 'undefined' && window.getComputedStyle)
        ? window.getComputedStyle(card).display
        : card.style.display;
      const isVisible = (card.style.display === 'block' || (computedDisplay !== 'none' && card.style.display !== 'none'));
      if (isVisible) {
        card.style.display = 'none';
      } else {
        card.style.display = 'block';
      }
    }
  }

  initRelationships() {
    const connectionsContainer = document.getElementById('connections-view-container');
    if (connectionsContainer) {
      this.relationshipsEngine = new RelationshipsViewEngine(
        connectionsContainer,
        this.relationshipsData,
        this.unitsDict,
        (unitId) => {
          this.openUnitDrawer(unitId);
        },
        (rel) => {
          if (this.panel) {
            this.panel.openRelationship(rel);
          }
        }
      );
      this.relationshipsEngine.render();
    }
  }

  initQuickFactsFooter() {
    const footerContainer = document.getElementById('global-quickfacts-bar');

    if (!footerContainer) return;

    const quickfactsDict = this.quickfacts || {};
    const factsList = Object.values(quickfactsDict).filter(f => typeof f === 'string' && f.trim().length > 0);

    if (factsList.length === 0) {
      footerContainer.style.display = 'none';
      return;
    }

    let currentIndex = 0;
    const textEl = document.getElementById('global-quickfact-text');
    const counterEl = document.getElementById('quickfact-counter');
    const prevBtn = document.getElementById('quickfact-btn-prev');
    const nextBtn = document.getElementById('quickfact-btn-next');

    const updateFact = (idx, isTransition = true) => {
      currentIndex = (idx + factsList.length) % factsList.length;
      if (textEl) {
        if (isTransition) {
          textEl.style.opacity = '0';
          setTimeout(() => {
            textEl.textContent = factsList[currentIndex];
            textEl.style.opacity = '1';
          }, 120);
        } else {
          textEl.textContent = factsList[currentIndex];
          textEl.style.opacity = '1';
        }
      }
      if (counterEl) {
        counterEl.textContent = `${currentIndex + 1} / ${factsList.length}`;
      }
    };

    // Initial render
    updateFact(0, false);

    // Initial visibility check (hidden on Beranda/landing page, visible on other views)
    if (this.currentView === 'view-landing' || document.getElementById('app-container')?.classList.contains('is-landing')) {
      footerContainer.style.display = 'none';
    } else {
      footerContainer.style.display = '';
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateFact(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateFact(currentIndex + 1);
      });
    }
  }
}


// Expose modules to global window object for universal testing and external access
window.DetailPanel = DetailPanel;
window.AssessmentEngine = AssessmentEngine;
window.LearningModuleEngine = LearningModuleEngine;
window.ProcessFlowEngine = ProcessFlowEngine;
window.RelationshipsViewEngine = RelationshipsViewEngine;
window.IndonesiaMapEngine = IndonesiaMapEngine;
window.SVGTreeEngine = SVGTreeEngine;
window.UserProfile = userProfile;
window.progressTracker = progressTracker;
window.DJBCExplorerApp = DJBCExplorerApp;

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new DJBCExplorerApp();
  });
}
