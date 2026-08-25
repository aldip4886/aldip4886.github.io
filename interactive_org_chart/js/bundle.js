/** DJBC Explorer Standalone Static JS Bundle **/ (function() {
'use strict';


/* --- utils.js --- */

/**
 * utils.js — General utility functions for DOM manipulation, debouncing, and SVG calculations.
 */

function createElement(tag, className = '', attributes = {}, children = []) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  
  for (const [key, val] of Object.entries(attributes)) {
    if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.substring(2).toLowerCase(), val);
    } else if (val !== null && val !== undefined) {
      el.setAttribute(key, val);
    }
  }

  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement || child instanceof SVGElement) {
      el.appendChild(child);
    }
  });

  return el;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formatBadgeClass(typeStr) {
  if (!typeStr) return 'badge-policy';
  const str = typeStr.toLowerCase();
  if (str.includes('root') || str.includes('eselon-1')) return 'badge-root';
  if (str.includes('manajerial') || str.includes('sekretariat')) return 'badge-manajerial';
  if (str.includes('kanwil') || str.includes('regional')) return 'badge-regional';
  if (str.includes('kppbc') || str.includes('pelayanan')) return 'badge-kppbc';
  if (str.includes('upt') || str.includes('laboratorium') || str.includes('balai')) return 'badge-upt';
  if (str.includes('pengkaji')) return 'badge-pengkaji';
  return 'badge-policy';
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Returns the contextual emoji icon based on the unit type, role, and jurisdiction.
 * @param {string|Object} unitOrId - Unit ID string or Unit object
 * @param {Object} [unitsDict] - Optional units dictionary for lookup
 * @returns {string} Emoji character
 */
function getUnitIcon(unitOrId, unitsDict = null) {
  if (!unitOrId) return '🏢';
  let unit = typeof unitOrId === 'object' ? unitOrId : (unitsDict ? unitsDict[unitOrId] : null);
  const id = (typeof unitOrId === 'string' ? unitOrId : (unit?.id || '')).toLowerCase();
  const nama = ((unit?.nama || unit?.name || unit?.unit_name || unit?.title || '') + ' ' + id).toLowerCase();
  const level = (unit?.level || '').toLowerCase();

  // 1. Kantor Pusat DJBC & Direktorat Teknis
  if (id === 'djbc' || id === 'kantor-pusat' || id === 'kp01') return '🏛️';
  if (id === 'setditjen' || id.startsWith('setditjen-') || id.startsWith('bagian-') || nama.includes('sekretariat')) return '📋';
  if (id === 'dit-teknis-kepab' || id.startsWith('dit-teknis-kepab-') || nama.includes('teknis kepabeanan')) return '📦';
  if (id === 'dit-fasilitas-kepab' || id.startsWith('dit-fasilitas-kepab-') || nama.includes('fasilitas kepabeanan')) return '🏭';
  if (id === 'dit-audit' || id.startsWith('dit-audit-') || (id.startsWith('dit-') && nama.includes('audit'))) return '🔍';
  if (id === 'dit-ikc' || id.startsWith('dit-ikc-') || (id.startsWith('dit-') && (nama.includes('informasi') || nama.includes('ikc')))) return '💻';
  if (id === 'dit-p2' || id.startsWith('dit-p2-') || (id.startsWith('dit-') && (nama.includes('penindakan') || nama.includes('penyidikan')))) return '🛡️';
  if (id === 'dit-ksikc' || id.startsWith('dit-ksikc-') || id === 'dit-kial' || id.startsWith('dit-kial-') || (id.startsWith('dit-') && (nama.includes('internasional') || nama.includes('ksikc') || nama.includes('kial')))) return '🌐';
  if (id === 'dit-pps' || id.startsWith('dit-pps-') || (id.startsWith('dit-') && (nama.includes('penerimaan') || nama.includes('pps')))) return '💰';
  if (id === 'dit-ki' || id.startsWith('dit-ki-') || (id.startsWith('dit-') && (nama.includes('kepatuhan internal') || nama.includes('dit-ki')))) return '⚖️';
  if (id === 'dit-cukai' || id.startsWith('dit-cukai-') || (id.startsWith('dit-') && nama.includes('direktorat cukai'))) return '🏷️';
  if (id.startsWith('tp-') || id.includes('tenaga-pengkaji') || nama.includes('tenaga pengkaji')) return '💡';

  // 2. Unit Pelaksana Teknis (UPT)
  if (id.startsWith('blbc') || nama.includes('balai laboratorium') || nama.includes('blbc')) {
    if (id.includes('pengujian') || nama.includes('pengujian')) return '🧪';
    if (id.includes('mutu') || nama.includes('mutu')) return '🔬';
    return '🔬';
  }
  if (id.startsWith('pso') || nama.includes('pangkalan sarana operasi') || nama.includes('pso')) {
    if (id.includes('pengawakan') || id.includes('kelaiklautan') || nama.includes('pengawakan') || nama.includes('kelaiklautan')) return '🧭';
    if (id.includes('telekomunikasi') || nama.includes('telekomunikasi')) return '📡';
    return '⚓';
  }

  // 3. Kantor Wilayah (Kanwil)
  if (id.startsWith('kanwil') || id.startsWith('kw') || nama.includes('kantor wilayah') || nama.includes('kanwil')) return '🏢';

  // 4. Kantor Pelayanan Utama (KPU)
  if (id.startsWith('kpu') || id.startsWith('kpu0') || nama.includes('kantor pelayanan utama') || nama.includes('kpu')) {
    if (nama.includes('tanjung priok') || nama.includes('priok') || nama.includes('tipe a')) return '🚢';
    if (nama.includes('batam') || nama.includes('tipe b')) return '🏝️';
    if (nama.includes('soekarno') || nama.includes('hatta') || nama.includes('soetta') || nama.includes('tipe c')) return '✈️';
    return '🚢';
  }

  // 5. Kantor Pengawasan dan Pelayanan (KPPBC)
  if (nama.includes('cukai') || nama.includes('tmc') || nama.includes('kudus') || nama.includes('kediri')) return '🏭';
  if (nama.includes('pasar baru') || nama.includes('kantor pos') || nama.includes('pos')) return '📦';
  if (nama.includes('bandara') || nama.includes('kualanamu') || nama.includes('ngurah rai') || nama.includes('juanda') || nama.includes('airport')) return '✈️';
  if (nama.includes('pelabuhan') || nama.includes('perak') || nama.includes('tanjung mas') || nama.includes('belawan') || nama.includes('laut')) return '🚢';
  if (nama.includes('pratama') || nama.includes('perbatasan') || nama.includes('entikong') || nama.includes('atambua') || nama.includes('skouw') || nama.includes('nanga badau') || nama.includes('sebatik') || nama.includes('nunukan')) return '🚩';
  if (nama.includes('tmp a') || nama.includes('tipe madya pabean a')) return '🏬';
  if (nama.includes('tmp b') || nama.includes('tipe madya pabean b')) return '🚛';
  if (nama.includes('tmp c') || nama.includes('tipe madya pabean c')) return '🏬';
  if (id.startsWith('kppbc') || id.startsWith('kpp') || nama.includes('kppbc')) return '🏬';

  // 6. Sub-Unit Eselon IV (Seksi / Subbagian)
  if (nama.includes('umum') && (nama.includes('kepatuhan') || nama.includes('ki'))) return '📁';
  if (nama.includes('pelayanan') || nama.includes('pkc') || nama.includes('pabean')) return '📄';
  if (nama.includes('penindakan') || nama.includes('penyidikan') || nama.includes('p2') || nama.includes('intelijen')) return '🚨';
  if (nama.includes('perbendaharaan') || nama.includes('keuangan')) return '💵';
  if (nama.includes('penyuluhan') || nama.includes('layanan informasi') || nama.includes('pli') || nama.includes('humas')) return '📢';
  if (nama.includes('pengolahan data') || nama.includes('administrasi dokumen') || nama.includes('pdad') || nama.includes('ti') || nama.includes('tik')) return '💾';
  if (nama.includes('kepatuhan internal') || nama.includes('ki')) return '⚖️';
  if (nama.includes('bimbingan teknis') || nama.includes('supervisi')) return '📋';
  if (nama.includes('monitoring') || nama.includes('evaluasi')) return '📊';
  if (nama.includes('standardisasi') || nama.includes('perumusan')) return '📝';

  // Level fallbacks
  if (level === 'group') return '📁';
  if (level === 'eselon-1') return '🏛️';
  if (level === 'eselon-2') return '🏢';
  if (level === 'eselon-3') return '🏬';
  if (level === 'eselon-4') return '📄';

  return '🏢';
}

if (typeof window !== 'undefined') {
  window.getUnitIcon = getUnitIcon;
}



/* --- storage.js --- */

/**
 * storage.js — Manages local storage persistence for visited units, assessment progress, and user preferences.
 */

const STORAGE_KEY = 'djbc_org_explorer_v5';

class StorageManager {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('localStorage is not accessible, using fallback memory storage.', e);
    }
    return {
      visitedUnits: [],
      completedTopics: [],
      assessmentScores: {},
      earnedBadges: [],
      lastVisitedUnit: 'djbc',
      preferences: {
        reducedMotion: false,
        theme: 'light'
      }
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to localStorage.', e);
    }
  }

  addVisitedUnit(unitId) {
    if (!unitId) return;
    if (!this.data.visitedUnits.includes(unitId)) {
      this.data.visitedUnits.push(unitId);
    }
    this.data.lastVisitedUnit = unitId;
    this.save();
  }

  recordVisitedUnit(unitId) {
    this.addVisitedUnit(unitId);
  }

  getVisitedUnits() {
    return this.data.visitedUnits || [];
  }

  saveAssessmentScore(quizId, score) {
    if (!this.data.assessmentScores) this.data.assessmentScores = {};
    this.data.assessmentScores[quizId] = score;
    this.save();
  }

  addBadge(badgeId) {
    if (!this.data.earnedBadges) this.data.earnedBadges = [];
    if (!this.data.earnedBadges.includes(badgeId)) {
      this.data.earnedBadges.push(badgeId);
      this.save();
    }
  }

  clearProgress() {
    this.data = {
      visitedUnits: [],
      completedTopics: [],
      assessmentScores: {},
      earnedBadges: [],
      lastVisitedUnit: 'djbc',
      preferences: { reducedMotion: false, theme: 'light' }
    };
    this.save();
  }
}

const storage = new StorageManager();


/* --- scorm.js --- */

/**
 * scorm.js — Isolated SCORM 1.2 API Wrapper for LMS Communication.
 */

class ScormAdapter {
  constructor() {
    this.api = null;
    this.initialized = false;
  }

  findAPI(win) {
    let findAttempts = 0;
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
      findAttempts++;
      if (findAttempts > 7) return null;
      win = win.parent;
    }
    return win.API || null;
  }

  init() {
    try {
      this.api = this.findAPI(window);
      if (!this.api && window.opener) {
        this.api = this.findAPI(window.opener);
      }

      if (this.api) {
        const result = this.api.LMSInitialize("");
        if (result === "true" || result === true) {
          this.initialized = true;
          console.log("SCORM 1.2 API initialized successfully.");
          this.setValue("cmi.core.lesson_status", "incomplete");
          this.commit();
        }
      } else {
        console.warn("SCORM 1.2 API not found. Running in standalone mode.");
      }
    } catch (e) {
      console.warn("SCORM initialization failed:", e);
    }
  }

  initialize() {
    return this.init();
  }

  setValue(element, value) {
    if (this.initialized && this.api) {
      this.api.LMSSetValue(element, value);
    }
  }

  getValue(element) {
    if (this.initialized && this.api) {
      return this.api.LMSGetValue(element);
    }
    return "";
  }

  commit() {
    if (this.initialized && this.api) {
      this.api.LMSCommit("");
    }
  }

  setCompletion(score = 100, passed = true) {
    if (this.initialized && this.api) {
      this.setValue("cmi.core.score.raw", score.toString());
      this.setValue("cmi.core.lesson_status", passed ? "passed" : "completed");
      this.commit();
    }
  }

  finish() {
    if (this.initialized && this.api) {
      this.api.LMSFinish("");
      this.initialized = false;
    }
  }
}

const scorm = new ScormAdapter();


/* --- progress.js --- */

/**
 * progress.js — Learning Progress Tracking & Achievement Badges Dashboard.
 * Matches Stitch: 073ccc1704584bcaaf69d56b6c03b3f0
 */



class ProgressTracker {
  constructor() {
    this.totalUnitsCount = 237;
    this.totalRelationshipsCount = 14;
    this.totalModulesCount = 3;
  }

  getMetrics() {
    const visited = storage.getVisitedUnits() || [];
    const earnedBadges = storage.data.earnedBadges || [];
    const quizScore = storage.data.assessmentScore || 0;
    const isCompleted = storage.data.completed || false;

    const unitPercent = Math.min(100, Math.round((visited.length / this.totalUnitsCount) * 100));
    const quizPercent = quizScore;
    const overallPercent = Math.min(100, Math.round((unitPercent * 0.5) + (quizPercent * 0.5)));

    return {
      visitedCount: visited.length,
      totalUnits: this.totalUnitsCount,
      relationshipsCount: Math.min(this.totalRelationshipsCount, Math.floor(visited.length * 0.2) + 2),
      totalRelationships: this.totalRelationshipsCount,
      modulesCompleted: visited.length > 20 ? 3 : (visited.length > 5 ? 2 : 1),
      totalModules: this.totalModulesCount,
      percentage: overallPercent,
      badges: earnedBadges,
      quizScore: quizScore,
      isCompleted: isCompleted
    };
  }

  renderProgressDashboard(containerEl, onNavigate) {
    if (!containerEl) return;
    const m = this.getMetrics();

    // Define Badges
    const badgeDefinitions = [
      {
        id: 'explorer-beginner',
        title: 'Explorer Pemula',
        desc: 'Membuka dan mengeksplorasi minimal 5 unit kerja.',
        icon: '🌟',
        unlocked: m.visitedCount >= 5
      },
      {
        id: 'central-master',
        title: 'Penguasa Pusat',
        desc: 'Mengeksplorasi unit eselon II di Kantor Pusat DJBC.',
        icon: '🏛️',
        unlocked: m.visitedCount >= 10
      },
      {
        id: 'territory-scout',
        title: 'Penjelajah Nusantara',
        desc: 'Melihat sebaran kantor vertikal dan UPT pada Peta Unit Kerja.',
        icon: '🗺️',
        unlocked: m.visitedCount >= 15
      },
      {
        id: 'regulation-expert',
        title: 'Ahli Regulasi & Tugas',
        desc: 'Lulus Kuis Pengetahuan & Studi Kasus dengan nilai ≥ 70.',
        icon: '🏆',
        unlocked: m.quizScore >= 70
      }
    ];

    containerEl.innerHTML = `
      <div class="progress-page-wrapper" style="padding: 24px 32px; max-width: 1100px; margin: 0 auto; width: 100%;">
        <!-- Header Row -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 28px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-size: 26px; font-weight: 800; color: #001631; letter-spacing: -0.5px; margin-bottom: 6px;">
              Progres & Pencapaian Belajar
            </h2>
            <p style="font-size: 14.5px; color: #64748B; margin: 0; max-width: 600px;">
              Pantau kemajuan Anda dalam memahami struktur organisasi, pembagian tugas fungsi, dan relasi kerja di lingkungan DJBC.
            </p>
          </div>
          <button id="btn-complete-course" class="btn btn-primary" style="padding: 12px 20px; font-size: 13.5px; font-weight: 700; gap: 8px; box-shadow: 0 4px 12px rgba(11, 58, 111, 0.2);">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${m.isCompleted ? '✓ Pembelajaran Selesai' : 'Selesaikan Pembelajaran'}</span>
          </button>
        </div>

        <!-- Main Stats Layout Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 32px;">
          <!-- SVG Circular Total Progress Card -->
          <div class="card" style="padding: 32px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; position:relative; overflow:hidden;">
            <div style="font-size: 16px; font-weight: 700; color: #001631; margin-bottom: 20px;">Penyelesaian Total</div>
            
            <div style="position:relative; width: 170px; height: 170px; display:flex; align-items:center; justify-content:center; margin-bottom: 16px;">
              <svg style="width: 100%; height: 100%; transform: rotate(-90deg);" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#E2E8F0" stroke-width="8"></circle>
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#D9B45B" stroke-width="8"
                  stroke-dasharray="264" stroke-dashoffset="${264 - (264 * (m.percentage / 100))}"
                  stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;"></circle>
              </svg>
              <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <span style="font-size: 36px; font-weight: 800; color: #062B52; line-height: 1;">${m.percentage}%</span>
                <span style="font-size: 11px; font-weight: 600; color: #64748B; margin-top: 2px;">Tuntas</span>
              </div>
            </div>

            <p style="font-size: 13px; color: #64748B; margin: 0; max-width: 260px;">
              ${m.percentage >= 80 ? 'Pemahaman Anda mengenai tugas & fungsi DJBC sudah sangat komprehensif!' : 'Terus tingkatkan eksplorasi unit dan kerjakan kuis evaluasi.'}
            </p>
          </div>

          <!-- Secondary Metric 2x2 Cards -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
            <!-- Metric 1 -->
            <div class="progress-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #0284C7; text-transform: uppercase;">Eksplorasi</span>
                <span style="font-size: 20px;">🏛️</span>
              </div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">Unit Dikunjungi</div>
              <div style="font-size: 26px; font-weight: 800; color: #001631; margin-top: 4px;">
                ${m.visitedCount} <span style="font-size: 13px; font-weight: 500; color: #94A3B8;">/ ${m.totalUnits} Unit</span>
              </div>
              <div style="width:100%; height:6px; background:#E2E8F0; border-radius:9999px; overflow:hidden; margin-top:12px;">
                <div style="width:${Math.min(100, Math.round((m.visitedCount / m.totalUnits) * 100))}%; height:100%; background:#0284C7;"></div>
              </div>
            </div>

            <!-- Metric 2 -->
            <div class="progress-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #D97706; text-transform: uppercase;">Analisis</span>
                <span style="font-size: 20px;">🔗</span>
              </div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">Hubungan Dipelajari</div>
              <div style="font-size: 26px; font-weight: 800; color: #001631; margin-top: 4px;">
                ${m.relationshipsCount} <span style="font-size: 13px; font-weight: 500; color: #94A3B8;">/ ${m.totalRelationships} Relasi</span>
              </div>
              <div style="width:100%; height:6px; background:#E2E8F0; border-radius:9999px; overflow:hidden; margin-top:12px;">
                <div style="width:${Math.min(100, Math.round((m.relationshipsCount / m.totalRelationships) * 100))}%; height:100%; background:#D97706;"></div>
              </div>
            </div>

            <!-- Metric 3 -->
            <div class="progress-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase;">Materi</span>
                <span style="font-size: 20px;">📖</span>
              </div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">Modul Selesai</div>
              <div style="font-size: 26px; font-weight: 800; color: #001631; margin-top: 4px;">
                ${m.modulesCompleted} <span style="font-size: 13px; font-weight: 500; color: #94A3B8;">/ ${m.totalModules} Modul</span>
              </div>
              <div style="width:100%; height:6px; background:#E2E8F0; border-radius:9999px; overflow:hidden; margin-top:12px;">
                <div style="width:${Math.round((m.modulesCompleted / m.totalModules) * 100)}%; height:100%; background:#059669;"></div>
              </div>
            </div>

            <!-- Metric 4 -->
            <div class="progress-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #D9B45B; text-transform: uppercase;">Evaluasi</span>
                <span style="font-size: 20px;">⭐</span>
              </div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">Skor Evaluasi Terakhir</div>
              <div style="font-size: 26px; font-weight: 800; color: #001631; margin-top: 4px;">
                ${m.quizScore} <span style="font-size: 13px; font-weight: 500; color: #94A3B8;">/ 100 Nilai</span>
              </div>
              <div style="width:100%; height:6px; background:#E2E8F0; border-radius:9999px; overflow:hidden; margin-top:12px;">
                <div style="width:${m.quizScore}%; height:100%; background:#D9B45B;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges & Achievements Section -->
        <div class="card" style="padding: 28px; margin-bottom: 32px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
            <div>
              <h3 style="font-size: 17px; font-weight: 700; color: #001631; margin: 0 0 4px 0;">
                Lencana Pencapaian (Badges & Rewards)
              </h3>
              <p style="font-size: 13px; color: #64748B; margin: 0;">Kumpulkan seluruh lencana prestasi dengan menyelesaikan seluruh aktivitas media pembelajaran.</p>
            </div>
            <span class="badge badge-org" style="font-weight: 700;">
              ${badgeDefinitions.filter(b => b.unlocked).length} / ${badgeDefinitions.length} Terbuka
            </span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            ${badgeDefinitions.map(badge => `
              <div class="badge-unlock-card ${badge.unlocked ? 'unlocked' : 'locked'}">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: ${badge.unlocked ? '#FEF3C7' : '#E2E8F0'}; display:flex; align-items:center; justify-content:center; font-size: 22px; flex-shrink: 0;">
                  ${badge.icon}
                </div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 700; color: #1E293B; display:flex; align-items:center; gap:6px;">
                    ${badge.title}
                    ${badge.unlocked ? '<span style="color:#059669; font-size:11px;">✓</span>' : '<span style="color:#94A3B8; font-size:11px;">🔒</span>'}
                  </div>
                  <div style="font-size: 12px; color: #64748B; margin-top: 2px; line-height: 1.3;">
                    ${badge.desc}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quick Navigation Call to Actions -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:20px 24px;">
          <div>
            <div style="font-size: 14.5px; font-weight: 700; color: #001631;">Siap Melanjutkan Belajar?</div>
            <div style="font-size: 13px; color: #64748B;">Pilih langkah eksplorasi selanjutnya untuk memperdalam wawasan organisasi DJBC.</div>
          </div>
          <div style="display:flex; gap:10px;">
            <button id="btn-goto-explorer" class="btn btn-outline" style="font-size:13px; font-weight:600;">
              🌳 Eksplorasi Bagan
            </button>
            <button id="btn-goto-quiz" class="btn btn-primary" style="font-size:13px; font-weight:600;">
              🎯 Kerjakan Kuis Evaluasi
            </button>
          </div>
        </div>
      </div>
    `;

    // Completion button handler
    const completeBtn = containerEl.querySelector('#btn-complete-course');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        storage.saveData({ completed: true });
        alert('🎉 Selamat! Anda telah menyelesaikan seluruh modul pembelajaran Interactive Organization Explorer DJBC.');
        this.renderProgressDashboard(containerEl, onNavigate);
      });
    }

    // Quick navigation actions
    const gotoExpBtn = containerEl.querySelector('#btn-goto-explorer');
    if (gotoExpBtn && onNavigate) {
      gotoExpBtn.addEventListener('click', () => onNavigate('view-explorer'));
    }

    const gotoQuizBtn = containerEl.querySelector('#btn-goto-quiz');
    if (gotoQuizBtn && onNavigate) {
      gotoQuizBtn.addEventListener('click', () => onNavigate('view-quiz'));
    }
  }
}

const progressTracker = new ProgressTracker();


/* --- data-loader.js --- */

/**
 * data-loader.js — Packaged data loader supporting both fetch() and direct file:// inlined window JS variables.
 */

class DataLoader {
  constructor() {
    this.cache = {};
  }

  async loadJSON(filename, globalVarName) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }

    // Direct check for inlined window variable (supports opening via double-clicking index.html on file:// protocol without web server!)
    if (globalVarName && window[globalVarName]) {
      this.cache[filename] = window[globalVarName];
      return window[globalVarName];
    }

    try {
      const response = await fetch(`data/${filename}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.cache[filename] = data;
      return data;
    } catch (e) {
      if (globalVarName && window[globalVarName]) {
        this.cache[filename] = window[globalVarName];
        return window[globalVarName];
      }
      console.error(`Failed to load data/${filename}:`, e);
      return null;
    }
  }

  async getOrganizationTree() {
    return await this.loadJSON('organization.json', 'DATA_ORGANIZATION');
  }

  async getUnitsDict() {
    return await this.loadJSON('units.json', 'DATA_UNITS');
  }

  async getRelationships() {
    return await this.loadJSON('relationships.json', 'DATA_RELATIONSHIPS');
  }

  async getAssessments() {
    return await this.loadJSON('assessments.json', 'DATA_ASSESSMENTS');
  }

  async getSearchIndex() {
    return await this.loadJSON('search_index.json', 'DATA_SEARCH_INDEX');
  }

  async getGeoUnits() {
    return await this.loadJSON('geo_units.json', 'DATA_GEO_UNITS');
  }

  async getKanwilMapping() {
    return await this.loadJSON('kanwil_mapping.json', 'DATA_KANWIL_MAPPING');
  }

  async getAlurProses() {
    return await this.loadJSON('alur_proses.json', 'DATA_ALUR_PROSES');
  }

  async getLearningPaths() {
    return await this.loadJSON('learning_paths.json', 'DATA_LEARNING_PATHS');
  }

  async getQuickFacts() {
    return await this.loadJSON('quickfacts.json', 'DATA_QUICKFACTS');
  }

  async getProvinceGeo() {
    return await this.loadJSON('province_geo.json', 'DATA_PROVINCE_GEO');
  }
}


const dataLoader = new DataLoader();


/* --- tree-layout.js --- */

/**
 * tree-layout.js — Hierarchy tree layout algorithm matching Stitch Screen 02 & 03 design.
 * Features:
 * 1. Eselon-2 Click: Collapses sibling Eselon-2 nodes, renders Eselon-3 sub-units HORIZONTALLY (menyamping).
 * 2. Eselon-3 Click: Collapses sibling Eselon-3 nodes, renders Eselon-4 sub-units (Seksi) HORIZONTALLY (menyamping).
 * 3. Highly legible card dimensions & typography for crystal clear text readability across all sub-nodes.
 * 4. Toggle behavior: Clicking an active node collapses it and returns to parent level.
 * 5. Layering: Foreground priority for active sub-units.
 */

class TreeLayout {
  constructor(options = {}) {
    this.nodeWidth = options.nodeWidth || 270;
    this.nodeHeight = options.nodeHeight || 100;
    this.colSpacing = options.colSpacing || 420;
    this.subColWidth = options.subColWidth || 310;
    this.rowSpacing = options.rowSpacing || 130;
  }

  /**
    * Find the Eselon-2 ancestor of a given unit ID.
    */
  _findParentEselon2(unitId, unitsDict) {
    if (!unitId) return null;
    let curr = unitId;
    const visited = new Set();
    while (curr && !visited.has(curr)) {
      visited.add(curr);
      const unit = unitsDict[curr];
      if (unit) {
        const lvl = (unit.level || '').toLowerCase();
        if (lvl.includes('2') || lvl === 'eselon-2' || lvl === 'eselon ii') return curr;
        if (unit.parent === 'upt-djbc' || unit.parent === 'kantor-pusat' || unit.parent === 'instansi-vertikal-djbc') {
          return curr;
        }
        curr = unit.parent;
      } else {
        const p3 = this._findParentEselon3(curr, unitsDict);
        if (p3 && p3 !== curr && !visited.has(p3)) {
          curr = p3;
          continue;
        }
        if (curr.startsWith('dit-') || curr.startsWith('kanwil-') || curr.startsWith('kpu-') || curr.startsWith('blbc-') || curr.startsWith('pso-') || curr === 'setditjen' || curr.startsWith('tp-')) {
          return curr;
        }
        break;
      }
    }
    return null;
  }

  /**
    * Find the Eselon-3 ancestor of a given unit ID.
    */
  _findParentEselon3(unitId, unitsDict) {
    if (!unitId) return null;
    let curr = unitId;
    const visited = new Set();
    while (curr && !visited.has(curr)) {
      visited.add(curr);
      const unit = unitsDict[curr];
      if (unit) {
        const lvl = (unit.level || '').toLowerCase();
        if (lvl.includes('3') || lvl === 'eselon-3' || lvl === 'eselon iii') return curr;
        curr = unit.parent;
      } else {
        if (curr.includes('-seksi-')) {
          return curr.substring(0, curr.indexOf('-seksi-'));
        }
        if (curr.includes('-subbag-')) {
          return curr.substring(0, curr.indexOf('-subbag-'));
        }
        if (curr.includes('-sub4-')) {
          return curr.substring(0, curr.indexOf('-sub4-'));
        }
        break;
      }
    }
    return null;
  }

  layout(rootNode, expandedGroups = {}, selectedNodeId = null, unitsDict = {}) {
    if (!rootNode) return { nodes: [], links: [] };

    const nodes = [];
    const links = [];

    // Analyze selection state
    const selectedUnit = unitsDict[selectedNodeId];
    const selectedLevel = selectedUnit ? (selectedUnit.level || '').toLowerCase() : '';

    const isLevel4Selected = selectedLevel.includes('4') || selectedLevel.includes('iv') || (selectedNodeId && selectedNodeId.includes('-seksi-')) || (selectedNodeId && selectedNodeId.includes('-subbag-'));
    const isLevel3Selected = selectedLevel.includes('3') || selectedLevel.includes('iii') || isLevel4Selected || (selectedNodeId && selectedNodeId.startsWith('subdirektorat-')) || (selectedNodeId && selectedNodeId.startsWith('kppbc-'));
    const isLevel2Selected = selectedLevel.includes('2') || selectedLevel.includes('ii') || isLevel3Selected;

    const activeEselon2Id = isLevel2Selected ? this._findParentEselon2(selectedNodeId, unitsDict) : null;
    let activeEselon3Id = null;
    if (isLevel3Selected) {
      if (isLevel4Selected) {
        activeEselon3Id = this._findParentEselon3(selectedNodeId, unitsDict);
      } else {
        activeEselon3Id = (selectedLevel.includes('3') || selectedLevel.includes('iii')) ? selectedNodeId : this._findParentEselon3(selectedNodeId, unitsDict);
      }
    }

    // 1. Root Node: DJBC (Center x=0, y=30)
    const rootX = 0;
    const rootY = 30;

    nodes.push({
      id: 'djbc',
      data: rootNode,
      x: rootX - 140,
      y: rootY,
      width: 280,
      height: 125,
      type: 'root',
      icon: 'account_balance',
      title: 'Direktorat Jenderal Bea dan Cukai',
      subtitle: 'PMK 124/2024 & PMK 188/2016',
      badge: 'Eselon I',
      badgeColor: 'amber'
    });

    const pillars = [
      {
        id: 'kantor-pusat',
        title: 'Kantor Pusat',
        subtitle: '1 Sekretariat, 10 Dit, 4 Pengkaji',
        badge: 'Unit Induk',
        icon: 'corporate_fare',
        color: '#0284C7',
        x: -this.colSpacing,
        y: 220,
        subColumns: [
          { key: 'sekretariat', label: 'A. SEKRETARIAT', offsetX: -this.subColWidth, color: '#0284C7', filter: c => c.id === 'setditjen' || (c.nama && c.nama.toLowerCase().includes('sekretariat')) },
          { key: 'direktorat', label: 'B. DIREKTORAT', offsetX: 0, color: '#0B3A6F', filter: c => c.id && c.id.startsWith('dit-') && !c.id.startsWith('tp-') },
          { key: 'pengkaji', label: 'C. TENAGA PENGKAJI', offsetX: this.subColWidth, color: '#7C3AED', filter: c => c.id && c.id.startsWith('tp-') }
        ]
      },
      {
        id: 'instansi-vertikal-djbc',
        title: 'Instansi Vertikal',
        subtitle: '20 Kanwil, 3 KPU & 104 KPPBC',
        badge: 'Kantor Wilayah/Pelayanan',
        icon: 'account_tree',
        color: '#059669',
        x: 0,
        y: 220,
        subColumns: [
          { key: 'kpu', label: 'A. KPU BEA CUKAI', offsetX: -160, color: '#0369A1', filter: c => c.id && c.id.startsWith('kpu-') },
          { key: 'kanwil', label: 'B. KANWIL DJBC', offsetX: 160, color: '#059669', filter: c => c.id && c.id.startsWith('kanwil-') }
        ]
      },
      {
        id: 'upt-djbc',
        title: 'Unit Pelaksana Teknis',
        subtitle: '3 BLBC & 6 PSO Bea Cukai',
        badge: 'Balai Pengujian/Pangkalan',
        icon: 'science',
        color: '#7C3AED',
        x: this.colSpacing,
        y: 220,
        subColumns: [
          { key: 'blbc', label: 'A. BALAI LAB (BLBC)', offsetX: -150, color: '#8B5CF6', filter: c => c.id && c.id.startsWith('blbc-') },
          { key: 'pso', label: 'B. PSO BEA CUKAI', offsetX: 150, color: '#6366F1', filter: c => c.id && c.id.startsWith('pso-') }
        ]
      }
    ];

    const rootChildren = rootNode.children || [];

    pillars.forEach(pillar => {
      const pNodeData = rootChildren.find(c => c.id === pillar.id) || { id: pillar.id, nama: pillar.title, children: [] };
      const isExpanded = !!expandedGroups[pillar.id];

      // Connector Link from Root to Pillar
      links.push({
        source: { x: rootX, y: rootY + 125 },
        target: { x: pillar.x, y: pillar.y },
        sourceId: 'djbc',
        targetId: pillar.id
      });

      // Pillar Group Card
      nodes.push({
        id: pillar.id,
        data: pNodeData,
        x: pillar.x - this.nodeWidth / 2,
        y: pillar.y,
        width: this.nodeWidth,
        height: 125,
        type: 'pillar',
        title: pillar.title,
        subtitle: pillar.subtitle,
        badge: pillar.badge,
        icon: pillar.icon,
        color: pillar.color,
        isExpanded: isExpanded
      });

      if (isExpanded) {
        const subYHeader = pillar.y + 165;
        const allPillarChildren = pNodeData.children || [];

        pillar.subColumns.forEach(subCol => {
          const subX = pillar.x + subCol.offsetX;
          let matchingChildren = allPillarChildren.filter(subCol.filter);

          // If an Eselon-2 or lower unit is active in this pillar, collapse other Eselon-2 nodes
          if (activeEselon2Id) {
            const hasActive = matchingChildren.some(c => c.id === activeEselon2Id);
            if (hasActive) {
              matchingChildren = matchingChildren.filter(c => c.id === activeEselon2Id);
            } else {
              // Sibling sub-column under same pillar is collapsed
              matchingChildren = [];
            }
          }

          if (matchingChildren.length === 0 && activeEselon2Id) {
            return; // Skip empty subcolumn when focusing on an active Eselon-2 node
          }

          // Connector Link from Pillar to Sub-column Header
          links.push({
            source: { x: pillar.x, y: pillar.y + 125 },
            target: { x: subX, y: subYHeader },
            sourceId: pillar.id,
            targetId: `${pillar.id}-${subCol.key}-header`
          });

          // Sub-column Header Node
          nodes.push({
            id: `${pillar.id}-${subCol.key}-header`,
            type: 'header',
            label: subCol.label,
            color: subCol.color,
            x: subX - 110,
            y: subYHeader,
            width: 220,
            height: 32
          });

          // Render Child Eselon-2 Unit Cards
          let curY = subYHeader + 55;
          matchingChildren.forEach(child => {
            links.push({
              source: { x: subX, y: subYHeader + 16 },
              target: { x: subX, y: curY },
              sourceId: `${pillar.id}-${subCol.key}-header`,
              targetId: child.id
            });

            const isChildActive = child.id === activeEselon2Id;

            nodes.push({
              id: child.id,
              data: child,
              x: subX - this.nodeWidth / 2,
              y: curY,
              width: this.nodeWidth,
              height: 100,
              type: 'unit',
              color: subCol.color,
              isActive: isChildActive
            });

            // Expand sub-units under the active Eselon-2 (or UPT Eselon-3) node
            if (isChildActive) {
              // Special Case: UPT Pillar (where child is already an Eselon-3 satker like BLBC / PSO)
              if (pillar.id === 'upt-djbc' || child.level === 'eselon-3') {
                let level4Children = (child.children || []).map(sub4 => {
                  const subId = typeof sub4 === 'string' ? sub4 : (sub4.id || sub4);
                  return unitsDict[subId] || (typeof sub4 === 'object' ? sub4 : { id: subId, nama: subId, level: 'eselon-4' });
                });

                const count4 = level4Children.length;
                if (count4 > 0) {
                  const cWidth = 230;
                  const cGap = 18;
                  const totalW = count4 * cWidth + (count4 - 1) * cGap;
                  const startX = subX - totalW / 2 + cWidth / 2;
                  const horizY4 = curY + 140;

                  // Header for horizontal Eselon-4 sub-units
                  nodes.push({
                    id: `${child.id}-level4-header`,
                    type: 'header',
                    label: `SUB-UNIT ESELON IV`,
                    color: '#059669',
                    x: subX - 110,
                    y: horizY4 - 34,
                    width: 220,
                    height: 26
                  });

                  links.push({
                    source: { x: subX, y: curY + 100 },
                    target: { x: subX, y: horizY4 - 34 },
                    sourceId: child.id,
                    targetId: `${child.id}-level4-header`
                  });

                  level4Children.forEach((sub4, i4) => {
                    const child4X = startX + i4 * (cWidth + cGap);
                    const sub4Id = sub4.id || `${child.id}-sub4-${i4}`;
                    const isSelected4 = selectedNodeId === sub4Id;

                    links.push({
                      source: { x: subX, y: horizY4 - 20 },
                      target: { x: child4X, y: horizY4 },
                      sourceId: `${child.id}-level4-header`,
                      targetId: sub4Id,
                      isHorizontalBranch: true
                    });

                    nodes.push({
                      id: sub4Id,
                      data: sub4,
                      x: child4X - cWidth / 2,
                      y: horizY4,
                      width: cWidth,
                      height: 90,
                      type: 'subunit4',
                      color: '#059669',
                      isActive: isSelected4
                    });
                  });

                  curY += 250;
                } else {
                  curY += this.rowSpacing;
                }
                return;
              }

              // Standard Eselon-2 Pillars (Kantor Pusat, Kanwil, KPU)
              const rawSubChildren = child.children || [];
              const resolvedLevel3 = rawSubChildren.map(subItem => {
                const subId = typeof subItem === 'string' ? subItem : (subItem.id || subItem);
                return unitsDict[subId] || (typeof subItem === 'object' ? subItem : { id: subId, nama: subId, level: 'eselon-3' });
              });

              // Case 1: An Eselon-3 (or Eselon-4) node is selected -> collapse sibling Eselon-3 nodes
              if (activeEselon3Id) {
                const targetEselon3 = resolvedLevel3.find(sub => sub.id === activeEselon3Id) || { id: activeEselon3Id, nama: activeEselon3Id, level: 'eselon-3' };
                const eselon3Y = curY + 155;

                // Header for Selected Eselon-3
                nodes.push({
                  id: `${child.id}-selected-level3-header`,
                  type: 'header',
                  label: `UNIT TERPILIH (ESELON III)`,
                  color: '#D9B45B',
                  x: subX - 110,
                  y: curY + 115,
                  width: 220,
                  height: 28
                });

                links.push({
                  source: { x: subX, y: curY + 100 },
                  target: { x: subX, y: curY + 115 },
                  sourceId: child.id,
                  targetId: `${child.id}-selected-level3-header`
                });

                links.push({
                  source: { x: subX, y: curY + 143 },
                  target: { x: subX, y: eselon3Y },
                  sourceId: `${child.id}-selected-level3-header`,
                  targetId: targetEselon3.id
                });

                nodes.push({
                  id: targetEselon3.id,
                  data: targetEselon3,
                  x: subX - (this.nodeWidth - 10) / 2,
                  y: eselon3Y,
                  width: this.nodeWidth - 10,
                  height: 95,
                  type: 'subunit',
                  color: '#D9B45B',
                  isActive: true
                });

                // Under the selected Eselon-3 node, render its Eselon-4 children HORIZONTALLY (menyamping)
                let level4Children = (targetEselon3.children || []).map(sub4 => {
                  if (typeof sub4 === 'string') {
                    return unitsDict[sub4] || { id: sub4, nama: sub4, level: 'eselon-4' };
                  }
                  return sub4;
                });

                // Fallback for demo completeness if no children array in dict
                if (level4Children.length === 0) {
                  const titleLower = (targetEselon3.nama || '').toLowerCase();
                  const targetId = targetEselon3.id || '';

                  if (targetId.startsWith('kppbc-') || titleLower.startsWith('kppbc') || titleLower.startsWith('kantor pengawasan')) {
                    level4Children = [
                      { id: `${targetEselon3.id}-seksi-pelayanan`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-p2`, nama: 'Seksi Penindakan dan Penyidikan', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-perbendaharaan`, nama: 'Seksi Perbendaharaan', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-ki`, nama: 'Seksi Kepatuhan Internal dan Penyuluhan', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-subbag-umum`, nama: 'Subbagian Umum', level: 'eselon-4' }
                    ];
                  } else if ((titleLower.startsWith('bagian ') || targetId.startsWith('bagian-')) && !titleLower.includes('subbag')) {
                    level4Children = [
                      { id: `${targetEselon3.id}-subbag-1`, nama: 'Subbagian Tata Laksana dan Kepegawaian', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-subbag-2`, nama: 'Subbagian Kinerja dan Keuangan', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-subbag-3`, nama: 'Subbagian Rumah Tangga dan Perlengkapan', level: 'eselon-4' }
                    ];
                  } else if ((titleLower.startsWith('subdirektorat ') || targetId.startsWith('subdit-') || targetId.startsWith('subdir-')) && !titleLower.includes('seksi') && !titleLower.includes('subbag')) {
                    level4Children = [
                      { id: `${targetEselon3.id}-seksi-1`, nama: 'Seksi Standardisasi dan Perumusan Teknis', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-2`, nama: 'Seksi Bimbingan Teknis dan Supervisi', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-3`, nama: 'Seksi Monitoring, Evaluasi, dan Pengendalian', level: 'eselon-4' }
                    ];
                  } else if (titleLower.startsWith('bidang ') || targetId.includes('bid-')) {
                    if (titleLower.includes('pelayanan') || titleLower.includes('fasilitas')) {
                      level4Children = [
                        { id: `${targetEselon3.id}-seksi-pelayanan-1`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai I', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-pelayanan-2`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai II', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-fasilitas`, nama: 'Seksi Fasilitas Kepabeanan dan Cukai', level: 'eselon-4' }
                      ];
                    } else if (titleLower.includes('pengawasan') || titleLower.includes('penindakan') || titleLower.includes('p2') || titleLower.includes('penegakan')) {
                      level4Children = [
                        { id: `${targetEselon3.id}-seksi-intelijen`, nama: 'Seksi Intelijen', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-penindakan`, nama: 'Seksi Penindakan', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-penyidikan`, nama: 'Seksi Penyidikan dan Barang Hasil Penindakan', level: 'eselon-4' }
                      ];
                    } else if (titleLower.includes('kepatuhan') || titleLower.includes('internal') || titleLower.includes('ki')) {
                      level4Children = [
                        { id: `${targetEselon3.id}-seksi-kepatuhan`, nama: 'Seksi Kepatuhan Pelaksanaan Tugas', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-manajemen-risiko`, nama: 'Seksi Manajemen Risiko', level: 'eselon-4' }
                      ];
                    }
                  }
                }

                const count4 = level4Children.length;
                const cWidth = 230;
                const cGap = 18;
                const totalW = count4 * cWidth + (count4 - 1) * cGap;
                const startX = subX - totalW / 2 + cWidth / 2;
                const horizY4 = eselon3Y + 140;

                // Header for horizontal Eselon-4 sub-units
                nodes.push({
                  id: `${targetEselon3.id}-level4-header`,
                  type: 'header',
                  label: `SUB-UNIT ESELON IV`,
                  color: '#059669',
                  x: subX - 110,
                  y: horizY4 - 34,
                  width: 220,
                  height: 26
                });

                links.push({
                  source: { x: subX, y: eselon3Y + 95 },
                  target: { x: subX, y: horizY4 - 34 },
                  sourceId: targetEselon3.id,
                  targetId: `${targetEselon3.id}-level4-header`
                });

                level4Children.forEach((sub4, i4) => {
                  const child4X = startX + i4 * (cWidth + cGap);
                  const sub4Id = sub4.id || `${targetEselon3.id}-sub4-${i4}`;
                  const isSelected4 = selectedNodeId === sub4Id;

                  links.push({
                    source: { x: subX, y: horizY4 - 20 },
                    target: { x: child4X, y: horizY4 },
                    sourceId: `${targetEselon3.id}-level4-header`,
                    targetId: sub4Id,
                    isHorizontalBranch: true
                  });

                  nodes.push({
                    id: sub4Id,
                    data: sub4,
                    x: child4X - cWidth / 2,
                    y: horizY4,
                    width: cWidth,
                    height: 90,
                    type: 'subunit4',
                    color: '#059669',
                    isActive: isSelected4
                  });
                });

              } else {
                // Case 2: Eselon-2 is selected directly -> render ALL Eselon-3 units HORIZONTALLY (menyamping)
                const count3 = resolvedLevel3.length;
                const cWidth = 240;
                const cGap = 20;
                const totalW = count3 * cWidth + (count3 - 1) * cGap;
                const startX = subX - totalW / 2 + cWidth / 2;
                const horizY3 = curY + 160;

                // Header for horizontal Eselon-3 sub-units
                nodes.push({
                  id: `${child.id}-subunits-header`,
                  type: 'header',
                  label: `SUB-UNIT ESELON III`,
                  color: '#D9B45B',
                  x: subX - 110,
                  y: curY + 115,
                  width: 220,
                  height: 28
                });

                links.push({
                  source: { x: subX, y: curY + 100 },
                  target: { x: subX, y: curY + 115 },
                  sourceId: child.id,
                  targetId: `${child.id}-subunits-header`
                });

                resolvedLevel3.forEach((sub3, i3) => {
                  const child3X = startX + i3 * (cWidth + cGap);
                  const isSelected3 = selectedNodeId === sub3.id;

                  links.push({
                    source: { x: subX, y: curY + 143 },
                    target: { x: child3X, y: horizY3 },
                    sourceId: `${child.id}-subunits-header`,
                    targetId: sub3.id,
                    isHorizontalBranch: true
                  });

                  nodes.push({
                    id: sub3.id,
                    data: sub3,
                    x: child3X - cWidth / 2,
                    y: horizY3,
                    width: cWidth,
                    height: 95,
                    type: 'subunit',
                    color: '#D9B45B',
                    isActive: isSelected3
                  });
                });
              }

              curY += 280; // Spacing for active branch
            } else {
              curY += this.rowSpacing;
            }
          });
        });
      }
    });

    return { nodes, links };
  }

  generateConnectorPath(link) {
    const sx = link.source.x;
    const sy = link.source.y;
    const tx = link.target.x;
    const ty = link.target.y;

    if (link.isHorizontalBranch) {
      const midY = sy + (ty - sy) * 0.45;
      return `M ${sx} ${sy} L ${sx} ${midY} L ${tx} ${midY} L ${tx} ${ty}`;
    }

    const midY = (sy + ty) / 2;
    return `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;
  }
}


/* --- tree.js --- */

/**
 * tree.js — SVG Tree rendering and pan/zoom engine with Stitch design system.
 * Features:
 * - Optimal zoom calculation focusing on selected node and its horizontal sub-units
 * - Toggle click behavior on active nodes (collapsing to parent)
 * - Topmost layer rendering priority for active sub-units
 * - Fully offline & static compatible with file:// protocol
 */




class SVGTreeEngine {
  constructor(container, onNodeSelect, onNodeDeselect) {
    this.container = container;
    this.onNodeSelect = onNodeSelect;
    this.onNodeDeselect = onNodeDeselect;
    this.layoutEngine = new TreeLayout();

    this.expandedGroups = {
      'kantor-pusat': false,
      'instansi-vertikal-djbc': false,
      'upt-djbc': false
    };

    this.selectedNodeId = null;
    this.treeData = null;
    this.unitsDict = {};

    // Transform State
    this.scale = 0.8;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.initSVG();
    this.setupInteractions();
    this.renderToolbar();
  }

  initSVG() {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('class', 'tree-svg-canvas');
    this.svg.style.cursor = 'grab';

    // Dot grid pattern background matching Stitch Canvas
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="12" r="1.2" fill="#CBD5E1" opacity="0.6"/>
      </pattern>
    `;
    this.svg.appendChild(defs);

    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', 'url(#grid-pattern)');
    this.svg.appendChild(bgRect);

    // Zoom container
    this.gZoom = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gZoom.setAttribute('class', 'zoom-layer');
    this.gZoom.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    this.gLinks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gLinks.setAttribute('class', 'links-layer');
    this.gLinks.style.pointerEvents = 'none';

    this.gHeaders = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gHeaders.setAttribute('class', 'headers-layer');
    this.gHeaders.style.pointerEvents = 'none';

    this.gNodes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gNodes.setAttribute('class', 'nodes-layer');
    this.gNodes.style.pointerEvents = 'auto';

    this.gZoom.appendChild(this.gLinks);
    this.gZoom.appendChild(this.gHeaders);
    this.gZoom.appendChild(this.gNodes);
    this.svg.appendChild(this.gZoom);

    this.container.appendChild(this.svg);
  }

  toggleGroup(groupId) {
    const isCurrentlyExpanded = !!this.expandedGroups[groupId];
    // Accordion behavior: collapse all pillars first
    this.expandedGroups['kantor-pusat'] = false;
    this.expandedGroups['instansi-vertikal-djbc'] = false;
    this.expandedGroups['upt-djbc'] = false;

    // Toggle clicked group
    this.expandedGroups[groupId] = !isCurrentlyExpanded;
    this.selectedNodeId = null;

    this.renderTree();
    this.autoFitView();
  }

  expandAncestors(unitId) {
    if (!unitId || !this.unitsDict) return;

    // Accordion behavior: collapse all pillars first
    this.expandedGroups['kantor-pusat'] = false;
    this.expandedGroups['instansi-vertikal-djbc'] = false;
    this.expandedGroups['upt-djbc'] = false;

    // Walk up the parent chain to find pillar group
    let curr = unitId;
    const visited = new Set();
    while (curr && !visited.has(curr)) {
      visited.add(curr);
      if (curr === 'kantor-pusat') {
        this.expandedGroups['kantor-pusat'] = true;
        return;
      }
      if (curr === 'instansi-vertikal-djbc' || curr === 'instansi-vertikal') {
        this.expandedGroups['instansi-vertikal-djbc'] = true;
        return;
      }
      if (curr === 'upt-djbc' || curr === 'upt') {
        this.expandedGroups['upt-djbc'] = true;
        return;
      }
      const unitObj = this.unitsDict[curr];
      curr = unitObj ? unitObj.parent : null;
    }

    // Fallback: identify pillar from unit ID prefixes
    const id = unitId;
    if (id.startsWith('dit-') || id.startsWith('tp-') || id === 'setditjen' || id.startsWith('bagian-') || id.startsWith('subdir')) {
      this.expandedGroups['kantor-pusat'] = true;
    } else if (id.startsWith('kanwil-') || id.startsWith('kpu-') || id.startsWith('kppbc-')) {
      this.expandedGroups['instansi-vertikal-djbc'] = true;
    } else if (id.startsWith('blbc-') || id.startsWith('pso-')) {
      this.expandedGroups['upt-djbc'] = true;
    }
  }

  setTreeData(treeData) {
    this.treeData = treeData;
  }

  setUnitsDict(dict) {
    this.unitsDict = dict || {};
  }

  render(treeData, unitsDict) {
    if (!treeData) return;
    this.treeData = treeData;
    this.unitsDict = unitsDict || {};

    this.renderTree();
    this.autoFitView();
  }

  renderTree() {
    if (!this.gLinks) return;

    const layoutResult = this.layoutEngine.layout(this.treeData, this.expandedGroups, this.selectedNodeId, this.unitsDict);
    this.currentLayout = layoutResult;

    // 1. Clear SVG layers
    this.gLinks.innerHTML = '';
    this.gNodes.innerHTML = '';
    this.gHeaders.innerHTML = '';

    // 2. Draw connector lines
    layoutResult.links.forEach(link => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'org-line');
      path.setAttribute('d', this.layoutEngine.generateConnectorPath(link));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', link.isHorizontalBranch ? '#059669' : '#D9E0E8');
      path.setAttribute('stroke-width', link.isHorizontalBranch ? '2' : '2');
      this.gLinks.appendChild(path);
    });

    // 3. Sort nodes for Layering Priority (Requirement 4: Sub-units placed on frontmost layer)
    const sortedNodes = [...layoutResult.nodes].sort((a, b) => {
      const getPriority = (n) => {
        if (n.type === 'subunit4') return 4;
        if (n.type === 'subunit') return 3;
        if (n.id === this.selectedNodeId || n.isActive) return 2;
        if (n.type === 'unit') return 1;
        return 0; // headers, pillars, root
      };
      return getPriority(a) - getPriority(b);
    });

    // 4. Render HTML node cards inside SVG foreignObject
    sortedNodes.forEach(node => {
      if (node.type === 'header') {
        this.renderHeaderNode(node);
      } else {
        this.renderCardNode(node);
      }
    });
  }

  renderHeaderNode(node) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('width', node.width);
    foreignObject.setAttribute('height', node.height);
    foreignObject.style.pointerEvents = 'none';

    const div = document.createElement('div');
    div.style.cssText = `
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border: 1.5px solid ${node.color || '#0B3A6F'};
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      font-size: 11px;
      font-weight: 800;
      color: ${node.color || '#0B3A6F'};
      letter-spacing: 0.5px;
      box-sizing: border-box;
      pointer-events: none;
      user-select: none;
    `;
    div.textContent = node.label;

    foreignObject.appendChild(div);
    g.appendChild(foreignObject);
    this.gHeaders.appendChild(g);
  }

  renderCardNode(node) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
    g.setAttribute('class', 'node-group');
    g.setAttribute('data-id', node.id);
    g.style.cursor = 'pointer';
    g.style.pointerEvents = 'all';

    const isSelected = node.id === this.selectedNodeId || node.isActive;

    // 1. Native SVG Hit-Test Rectangle (Ensures 100% reliable mouse/touch capture across all browsers)
    const hitRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitRect.setAttribute('x', '0');
    hitRect.setAttribute('y', '0');
    hitRect.setAttribute('width', node.width);
    hitRect.setAttribute('height', node.height + (node.type === 'pillar' ? 30 : 0));
    hitRect.setAttribute('rx', '12');
    hitRect.setAttribute('ry', '12');
    hitRect.setAttribute('fill', 'transparent');
    hitRect.setAttribute('stroke', 'none');
    hitRect.setAttribute('stroke-width', '0');
    hitRect.setAttribute('pointer-events', 'all');
    hitRect.style.cursor = 'pointer';
    g.appendChild(hitRect);

    // 2. HTML ForeignObject Layer
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('width', node.width);
    foreignObject.setAttribute('height', node.height + (node.type === 'pillar' ? 30 : 0));
    foreignObject.setAttribute('pointer-events', 'all');
    foreignObject.style.pointerEvents = 'all';
    foreignObject.style.overflow = 'visible';

    const div = document.createElement('div');
    div.className = `node-card ${isSelected ? 'node-selected' : ''} ${node.type === 'subunit' ? 'node-subunit' : ''} ${node.type === 'subunit4' ? 'node-subunit4' : ''}`;
    div.style.pointerEvents = 'auto';
    div.style.cursor = 'pointer';
    div.style.userSelect = 'none';
    
    // Custom styling based on node type
    if (node.type === 'root') {
      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: #FFFFFF;
        border: ${isSelected ? '2.5px solid #D9B45B' : '1.5px solid #D9E0E8'};
        border-radius: 14px;
        padding: 14px 16px;
        box-shadow: 0 6px 16px rgba(11, 58, 111, 0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
      `;
      div.innerHTML = `
        <div style="width:36px; height:36px; border-radius:8px; background:#062B52; color:#FFFFFF; display:flex; align-items:center; justify-content:center; margin-bottom:6px;">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M13 12h.01M13 8h.01M9 8h.01"/></svg>
        </div>
        <div style="font-size:14px; font-weight:700; color:#062B52; line-height:1.25;">${escapeHtml(node.title)}</div>
        <span style="margin-top:6px; padding:2px 8px; background:#FEF3C7; color:#92400E; border:1px solid #FDE68A; border-radius:9999px; font-size:10.5px; font-weight:700;">${escapeHtml(node.badge)}</span>
      `;
    } else if (node.type === 'pillar') {
      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: #FFFFFF;
        border: ${node.isExpanded ? '2.5px solid ' + node.color : '1.5px solid #D9E0E8'};
        border-radius: 14px;
        padding: 12px 14px;
        box-shadow: 0 4px 14px rgba(11, 58, 111, 0.07);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
      `;
      const iconPath = node.icon === 'corporate_fare' 
        ? 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5' 
        : node.icon === 'science' 
          ? 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.022 1.022a2 2 0 00.547 2.387l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387-.477a2 2 0 001.022-.547' 
          : 'M4 6h16M4 12h16M4 18h16';

      div.innerHTML = `
        <div style="width:32px; height:32px; border-radius:6px; background:rgba(2,132,199,0.1); color:${node.color}; display:flex; align-items:center; justify-content:center; margin-bottom:4px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/></svg>
        </div>
        <div style="font-size:14px; font-weight:700; color:#062B52; line-height:1.2;">${escapeHtml(node.title)}</div>
        <div style="font-size:11px; color:#64748B; margin-top:3px;">${escapeHtml(node.subtitle)}</div>
        <div style="margin-top:8px; padding:3px 12px; background:${node.isExpanded ? '#FEE2E2' : '#FEF3C7'}; color:${node.isExpanded ? '#991B1B' : '#92400E'}; border:1px solid ${node.isExpanded ? '#FCA5A5' : '#FDE68A'}; border-radius:9999px; font-size:10px; font-weight:700;">
          ${node.isExpanded ? '[-] Collapse' : '[+] Expand'}
        </div>
      `;
    } else if (node.type === 'subunit') {
      // Sub-unit Eselon III Card (Horizontal or Selected)
      const uDict = (this.unitsDict && this.unitsDict[node.id]) || {};
      const title = uDict.nama || node.data.nama || node.data.name || uDict.singkatan || node.data.singkatan || node.id;
      const subtitle = uDict.level || node.data.level || 'Eselon III';
      const icon = getUnitIcon(uDict.id ? uDict : (node.data || node.id));

      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: ${isSelected ? '#FEF3C7' : '#FFFFFF'};
        border: ${isSelected ? '2.5px solid #D9B45B' : '1.5px solid #CBD5E1'};
        border-radius: 12px;
        padding: 10px 14px;
        box-shadow: ${isSelected ? '0 8px 20px rgba(217, 180, 91, 0.35)' : '0 3px 10px rgba(0, 0, 0, 0.06)'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        cursor: pointer;
        position: relative;
        z-index: 40;
        box-sizing: border-box;
      `;
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span style="font-size:10px; font-weight:700; padding:2px 8px; background:${isSelected ? '#FDE68A' : '#F1F5F9'}; color:#334155; border-radius:9999px; text-transform:uppercase;">${escapeHtml(subtitle)}</span>
          ${isSelected ? '<span style="font-size:10px; color:#B45309; font-weight:700;">● Aktif</span>' : ''}
        </div>
        <div style="font-size:12.5px; font-weight:700; color:#062B52; line-height:1.35; margin-top:4px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; word-break:break-word;" title="${escapeHtml(title)}"><span style="margin-right:4px;">${icon}</span>${escapeHtml(title)}</div>
      `;
    } else if (node.type === 'subunit4') {
      // Eselon IV Sub-unit Card (horizontal)
      const uDict = (this.unitsDict && this.unitsDict[node.id]) || {};
      const title = uDict.nama || node.data.nama || node.data.name || uDict.singkatan || node.data.singkatan || node.id;
      const subtitle = uDict.level || node.data.level || 'Eselon IV';
      const icon = getUnitIcon(uDict.id ? uDict : (node.data || node.id));

      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: ${isSelected ? '#DCFCE7' : '#F0FDF4'};
        border: ${isSelected ? '2.5px solid #059669' : '1.5px solid #A7F3D0'};
        border-radius: 10px;
        padding: 10px 12px;
        box-shadow: ${isSelected ? '0 8px 20px rgba(5, 150, 105, 0.3)' : '0 3px 10px rgba(0, 0, 0, 0.05)'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        cursor: pointer;
        position: relative;
        z-index: 50;
        box-sizing: border-box;
      `;
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span style="font-size:9.5px; font-weight:700; padding:2px 7px; background:${isSelected ? '#BBF7D0' : '#DCFCE7'}; color:#166534; border-radius:9999px; text-transform:uppercase;">${escapeHtml(subtitle)}</span>
          ${isSelected ? '<span style="font-size:10px; color:#059669; font-weight:700;">● Aktif</span>' : ''}
        </div>
        <div style="font-size:12px; font-weight:700; color:#065F46; line-height:1.35; margin-top:4px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; word-break:break-word;" title="${escapeHtml(title)}"><span style="margin-right:4px;">${icon}</span>${escapeHtml(title)}</div>
      `;
    } else {
      // Regular Eselon II / UPT Satker Unit Card
      const uDict = (this.unitsDict && this.unitsDict[node.id]) || {};
      const title = uDict.nama || node.data.nama || node.data.name || uDict.singkatan || node.data.singkatan || node.id;
      const subtitle = uDict.level || node.data.level || node.data.kategori_fungsi || 'Eselon II';
      const icon = getUnitIcon(uDict.id ? uDict : (node.data || node.id));

      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: ${isSelected ? '#EFF6FF' : '#FFFFFF'};
        border: ${isSelected ? '2.5px solid #0284C7' : '1.5px solid #D9E0E8'};
        border-radius: 12px;
        padding: 12px 14px;
        box-shadow: ${isSelected ? '0 8px 20px rgba(2, 132, 199, 0.25)' : '0 3px 10px rgba(11, 58, 111, 0.06)'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        cursor: pointer;
        position: relative;
        z-index: 30;
        box-sizing: border-box;
      `;
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span style="font-size:10.5px; font-weight:700; padding:2px 8px; background:${isSelected ? '#DBEAFE' : '#F2F4F7'}; color:#1E40AF; border-radius:9999px;">${escapeHtml(subtitle)}</span>
          ${isSelected ? '<span style="font-size:10px; color:#0284C7; font-weight:700;">● Aktif</span>' : ''}
        </div>
        <div style="font-size:13px; font-weight:700; color:#062B52; line-height:1.35; margin-top:4px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; word-break:break-word;" title="${escapeHtml(title)}"><span style="margin-right:4px;">${icon}</span>${escapeHtml(title)}</div>
      `;
    }

    // Centralized Click & Toggle Handler (Requirement 3: Toggle Click Behavior)
    const clickHandler = (e) => {
      this.handleNodeClick(node, e);
    };

    div.onclick = clickHandler;
    div.ontouchend = clickHandler;
    hitRect.onclick = clickHandler;
    hitRect.ontouchend = clickHandler;
    foreignObject.onclick = clickHandler;
    g.onclick = clickHandler;

    foreignObject.appendChild(div);
    g.appendChild(foreignObject);
    this.gNodes.appendChild(g);
  }

  /**
   * Handle Click with Toggle Behavior:
   * Clicking an already active/expanded node toggles it off (collapses it) and returns to parent level.
   */
  handleNodeClick(node, event) {
    if (event) {
      if (typeof event.stopPropagation === 'function') event.stopPropagation();
    }
    const clickedId = node.id || (node.data ? node.data.id : null);
    if (!clickedId) return;

    // Debounce to prevent duplicate synthetic/bubbled events
    const now = Date.now();
    if (this._lastClickId === clickedId && (now - (this._lastClickTime || 0)) < 350) {
      return;
    }
    this._lastClickId = clickedId;
    this._lastClickTime = now;

    if (node.type === 'pillar') {
      this.toggleGroup(clickedId);
      if (this.onNodeSelect) this.onNodeSelect(clickedId);
      return;
    }

    if (this.onNodeSelect) {
      this.onNodeSelect(clickedId);
    } else {
      this.selectedNodeId = clickedId;
      this.expandAncestors(clickedId);
      this.renderTree();
      this.centerOnNode(clickedId);
    }
  }

  setupInteractions() {
    if (!this.svg) return;

    this.svg.addEventListener('mousedown', (e) => {
      let el = e.target;
      while (el && el !== this.svg) {
        if (el.classList && (el.classList.contains('node-card') || el.classList.contains('node-group') || el.classList.contains('nodes-layer') || el.classList.contains('node-subunit') || el.classList.contains('node-subunit4'))) {
          return;
        }
        if (el.tagName) {
          const tag = el.tagName.toLowerCase();
          if (tag === 'foreignobject' || tag === 'div' || tag === 'span' || tag === 'p' || tag === 'h3' || tag === 'svg' || tag === 'path') {
            if (el.closest && (el.closest('.nodes-layer') || el.closest('.node-group') || el.closest('foreignObject') || el.closest('.node-card'))) {
              return;
            }
          }
        }
        el = el.parentElement || el.parentNode;
      }
      this.isDragging = true;
      if (this.gZoom) this.gZoom.style.transition = 'none';
      this.startX = e.clientX - this.translateX;
      this.startY = e.clientY - this.translateY;
      this.svg.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      this.translateX = e.clientX - this.startX;
      this.translateY = e.clientY - this.startY;
      this.updateTransform();
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (this.svg) this.svg.style.cursor = 'grab';
        if (this.gZoom) this.gZoom.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });

    this.svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.gZoom) this.gZoom.style.transition = 'none';
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      this.scale = Math.max(0.25, Math.min(2.5, this.scale * delta));
      this.updateTransform();
      this.updateZoomLabel();
      setTimeout(() => {
        if (this.gZoom) this.gZoom.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }, 100);
    }, { passive: false });

    // Touch pan and pinch-zoom handlers for mobile touchscreens
    let initialPinchDist = null;
    let initialScale = this.scale;

    this.svg.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        let el = touch.target;
        while (el && el !== this.svg) {
          if (el.classList && (el.classList.contains('node-card') || el.classList.contains('tree-toolbar'))) return;
          el = el.parentElement;
        }
        this.isDragging = true;
        if (this.gZoom) this.gZoom.style.transition = 'none';
        this.startX = touch.clientX - this.translateX;
        this.startY = touch.clientY - this.translateY;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialScale = this.scale;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        this.translateX = touch.clientX - this.startX;
        this.translateY = touch.clientY - this.startY;
        this.updateTransform();
      } else if (e.touches.length === 2 && initialPinchDist) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = currentDist / initialPinchDist;
        this.scale = Math.max(0.25, Math.min(2.5, initialScale * factor));
        this.updateTransform();
        this.updateZoomLabel();
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
      initialPinchDist = null;
      if (this.gZoom) this.gZoom.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  }

  updateTransform() {
    if (this.gZoom) {
      this.gZoom.setAttribute('transform', `translate(${this.translateX}, ${this.translateY}) scale(${this.scale})`);
    }
  }

  /**
   * Auto-fit view covering all rendered nodes
   */
  autoFitView() {
    if (!this.currentLayout || !this.currentLayout.nodes || this.currentLayout.nodes.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    this.currentLayout.nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x + n.width);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y + (n.height || 100));
    });

    const containerW = this.container.clientWidth || 800;
    const containerH = this.container.clientHeight || 600;

    const paddingX = 90;
    const paddingY = 90;

    const boundsW = (maxX - minX) || 1;
    const boundsH = (maxY - minY) || 1;

    const scaleX = (containerW - paddingX * 2) / boundsW;
    const scaleY = (containerH - paddingY * 2) / boundsH;

    let targetScale = Math.min(scaleX, scaleY);
    targetScale = Math.max(0.65, Math.min(0.95, targetScale));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    this.scale = targetScale;
    this.translateX = (containerW / 2) - centerX * this.scale;
    this.translateY = (containerH / 2) - centerY * this.scale;

    this.updateTransform();
    this.updateZoomLabel();
  }

  centerRoot() {
    this.autoFitView();
  }

  /**
   * Optimal Zoom Focusing on the Selected Node and its Horizontal Sub-units (Requirement 1 & 2)
   */
  centerOnNode(nodeId) {
    if (!this.currentLayout || !this.currentLayout.nodes || this.currentLayout.nodes.length === 0) return;
    const target = this.currentLayout.nodes.find(n => n.id === nodeId);
    if (!target) {
      this.autoFitView();
      return;
    }

    // Find all sub-units belonging to this active branch to calculate bounding box
    const branchNodes = this.currentLayout.nodes.filter(n => 
      n.id === nodeId || 
      n.type === 'subunit' || 
      n.type === 'subunit4' ||
      n.id.startsWith(`${nodeId}-`)
    );

    let minX = target.x;
    let maxX = target.x + target.width;
    let minY = target.y;
    let maxY = target.y + target.height;

    branchNodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x + n.width);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y + (n.height || 95));
    });

    const containerW = this.container.clientWidth || 800;
    const containerH = this.container.clientHeight || 600;

    const padX = 60;
    const padY = 60;

    const boundsW = (maxX - minX) + padX * 2;
    const boundsH = (maxY - minY) + padY * 2;

    const scaleX = containerW / boundsW;
    const scaleY = containerH / boundsH;
    let targetScale = Math.min(scaleX, scaleY, 1.15);
    targetScale = Math.max(0.80, targetScale);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    this.scale = targetScale;
    this.translateX = (containerW / 2) - centerX * this.scale;
    this.translateY = (containerH / 2) - centerY * this.scale;

    this.updateTransform();
    this.updateZoomLabel();
  }

  renderToolbar() {
    let toolbar = this.container.querySelector('.tree-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'tree-toolbar';
      toolbar.style.cssText = `
        position: absolute;
        bottom: 24px;
        left: 24px;
        z-index: 80;
        background: #FFFFFF;
        border: 1px solid #D9E0E8;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        display: flex;
        align-items: center;
        padding: 6px 12px;
        gap: 6px;
      `;
      this.container.appendChild(toolbar);
    }

    toolbar.innerHTML = `
      <button id="btn-zoom-out" style="width:32px; height:32px; border-radius:8px; background:#F2F4F7; border:1px solid #D9E0E8; color:#1F2937; font-size:16px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Zoom Out">−</button>
      <span id="zoom-percentage" style="font-size:12px; font-weight:600; color:#667085; padding:0 8px; border-right:1px solid #D9E0E8;">90%</span>
      <button id="btn-zoom-in" style="width:32px; height:32px; border-radius:8px; background:#F2F4F7; border:1px solid #D9E0E8; color:#1F2937; font-size:16px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Zoom In">+</button>
      <button id="btn-zoom-reset" style="width:32px; height:32px; border-radius:8px; background:#F2F4F7; border:1px solid #D9E0E8; color:#0B3A6F; font-size:14px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-left:2px;" title="Auto-Fit View">🎯</button>
    `;

    const zoomInBtn = toolbar.querySelector('#btn-zoom-in');
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
    const zoomOutBtn = toolbar.querySelector('#btn-zoom-out');
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
    const zoomResetBtn = toolbar.querySelector('#btn-zoom-reset');
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => this.autoFitView());
  }

  zoomIn() {
    this.scale = Math.min(2.5, this.scale * 1.2);
    this.updateTransform();
    this.updateZoomLabel();
  }

  zoomOut() {
    this.scale = Math.max(0.3, this.scale / 1.2);
    this.updateTransform();
    this.updateZoomLabel();
  }

  updateZoomLabel() {
    const label = this.container.querySelector('#zoom-percentage');
    if (label) {
      label.textContent = `${Math.round(this.scale * 100)}%`;
    }
  }
}


/* --- panel.js --- */

/**
 * panel.js — Contextual Detail Drawer Panel matching Stitch Screen 03 design.
 * Safely resolves unit IDs and child unit objects from unitsDict, eliminating undefined labels.
 * Reliably displays sub-units for all Kantor Pusat, Instansi Vertikal, and UPT units.
 */



function inferEselon4UnitName(unitId, fallbackName) {
  if (fallbackName && !fallbackName.includes('-seksi-') && !fallbackName.includes('-subbag-') && !fallbackName.includes('-dukungan-') && !fallbackName.includes('-tim-') && fallbackName !== unitId) {
    return fallbackName.replace(/\s+&\s+/g, ' dan ');
  }

  const id = unitId || '';
  if (id.endsWith('-seksi-1')) return 'Seksi Standardisasi dan Perumusan Teknis';
  if (id.endsWith('-seksi-2')) return 'Seksi Bimbingan Teknis dan Supervisi';
  if (id.endsWith('-seksi-3')) return 'Seksi Monitoring, Evaluasi, dan Pengendalian';
  if (id.endsWith('-subbag-1')) return 'Subbagian Tata Laksana dan Kepegawaian';
  if (id.endsWith('-subbag-2')) return 'Subbagian Kinerja dan Keuangan';
  if (id.endsWith('-subbag-3')) return 'Subbagian Rumah Tangga dan Perlengkapan';
  if (id.endsWith('-dukungan-teknis')) return 'Subbagian Dukungan Teknis dan Tata Usaha';
  if (id.endsWith('-tim-pengkaji')) return 'Tim Pengkaji Kebijakan Strategis';
  if (id.endsWith('-subbag-umum')) return 'Subbagian Umum';
  if (id.endsWith('-seksi-pelayanan')) return 'Seksi Pelayanan Kepabeanan dan Cukai';
  if (id.endsWith('-seksi-pelayanan-1')) return 'Seksi Pelayanan Kepabeanan dan Cukai I';
  if (id.endsWith('-seksi-pelayanan-2')) return 'Seksi Pelayanan Kepabeanan dan Cukai II';
  if (id.endsWith('-seksi-fasilitas')) return 'Seksi Fasilitas Kepabeanan dan Cukai';
  if (id.endsWith('-seksi-p2')) return 'Seksi Penindakan dan Penyidikan';
  if (id.endsWith('-seksi-intelijen')) return 'Seksi Intelijen';
  if (id.endsWith('-seksi-penindakan')) return 'Seksi Penindakan';
  if (id.endsWith('-seksi-penyidikan')) return 'Seksi Penyidikan dan Barang Hasil Penindakan';
  if (id.endsWith('-seksi-perbendaharaan')) return 'Seksi Perbendaharaan';
  if (id.endsWith('-seksi-ki')) return 'Seksi Kepatuhan Internal dan Penyuluhan';
  if (id.endsWith('-seksi-kepatuhan')) return 'Seksi Kepatuhan Pelaksanaan Tugas';
  if (id.endsWith('-seksi-manajemen-risiko')) return 'Seksi Manajemen Risiko';

  return fallbackName || unitId;
}

class DetailPanel {
  constructor(panelEl, unitsDict, onUnitSelect, onNavigateToMap) {
    this.panel = panelEl;
    this.unitsDict = unitsDict || {};
    this.onUnitSelect = onUnitSelect || null;
    this.onNavigateToMap = onNavigateToMap || null;
    this.isOpen = false;
    this.currentUnit = null;
    this.initUI();
  }

  setUnitsDict(dict) {
    this.unitsDict = dict || {};
  }

  setNavigateToMap(fn) {
    this.onNavigateToMap = fn;
  }

  initUI() {
    this.panel.className = 'detail-drawer';
    this.panel.innerHTML = `
      <div class="drawer-header" style="padding: 20px 24px; border-bottom: 1px solid #D9E0E8; background: #FFFFFF; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span id="drawer-badge" class="badge" style="padding: 4px 10px; background: #F2F4F7; color: #475569; border-radius: 9999px; font-size: 11px; font-weight: 600; border: 1px solid #CBD5E1;">Eselon II</span>
          <h2 id="drawer-title" class="drawer-title" style="margin-top: 8px; font-size: 18px; font-weight: 700; color: #062B52; line-height: 1.3;">Unit Name</h2>
          <p id="drawer-induk" style="font-size: 12px; color: #64748B; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
            <span>🏢</span> Direktorat Jenderal Bea dan Cukai
          </p>
        </div>
        <button id="drawer-close-btn" class="drawer-close" style="background: transparent; border: none; font-size: 24px; color: #64748B; cursor: pointer; padding: 4px;" title="Tutup Panel">&times;</button>
      </div>

      <div class="drawer-content" style="padding: 20px 24px; overflow-y: auto; max-height: calc(100vh - 120px);">
        <!-- Quick Info Grid (Lokasi Utama) -->
        <div style="margin-bottom: 20px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 10px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Lokasi Utama</div>
              <div id="drawer-lokasi" style="font-size: 13px; font-weight: 700; color: #062B52; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">-</div>
            </div>
            <button id="drawer-map-btn" class="drawer-map-action-btn" title="Lihat lokasi pada Peta Unit Kerja" aria-label="Lihat lokasi pada Peta Unit Kerja">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="drawer-section" style="margin-bottom: 20px;">
          <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">Jabatan Pimpinan</div>
          <p id="drawer-pimpinan" style="font-size: 14px; font-weight: 700; color: #062B52;">-</p>
        </div>

        <div class="drawer-section" style="margin-bottom: 20px;">
          <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">Dasar Hukum & PMK</div>
          <p id="drawer-hukum" style="font-size: 13px; color: #475569; line-height: 1.5;">-</p>
        </div>

        <div class="drawer-section" style="margin-bottom: 20px;">
          <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">Tugas Utama</div>
          <p id="drawer-tugas" style="font-size: 13px; color: #1E293B; line-height: 1.6;">-</p>
        </div>

        <div class="drawer-section" style="margin-bottom: 24px;">
          <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 8px;">Fungsi Organisasi</div>
          <ul id="drawer-fungsi" style="font-size: 13px; color: #475569; line-height: 1.6; padding-left: 16px; margin: 0;">
            <li>Melaksanakan koordinasi, pengawasan, dan perumusan kebijakan atau pelayanan teknis kepabeanan dan cukai.</li>
          </ul>
        </div>

        <!-- Section: Unit di Bawahnya (Sub-Units Eselon III / IV) -->
        <div class="drawer-section" style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #062B52; text-transform: uppercase; letter-spacing: 0.5px;">Unit di Bawahnya (Sub-Unit)</div>
            <span id="drawer-children-count" style="font-size: 10px; font-weight: 700; padding: 2px 8px; background: #E0F2FE; color: #0369A1; border-radius: 9999px;">0 Unit</span>
          </div>
          <div id="drawer-children-list" style="display: flex; flex-direction: column; gap: 8px;">
            <!-- Rendered dynamically -->
          </div>
        </div>

        <!-- Section: Unit Terkait & Interdependensi (from relationships.json) -->
        <div class="drawer-section" style="margin-bottom: 20px;">
          <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 8px;">Unit Terkait & Interdependensi</div>
          <div id="drawer-related" style="display: flex; flex-direction: column; gap: 8px;"></div>
        </div>

        <!-- Section: Keterlibatan dalam Alur Proses / SOP (from alur_proses.json) -->
        <div id="drawer-processes-section" class="drawer-section" style="margin-bottom: 20px; display: none;">
          <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 8px;">Keterlibatan dalam Alur Proses (SOP)</div>
          <div id="drawer-processes-list" style="display: flex; flex-direction: column; gap: 8px;"></div>
        </div>
      </div>
    `;

    const closeBtn = this.panel.querySelector('#drawer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  open(unitInput) {
    if (!unitInput) return;

    let unitData = null;
    if (typeof unitInput === 'string') {
      unitData = this.unitsDict[unitInput] || { id: unitInput, nama: unitInput };
    } else if (typeof unitInput === 'object') {
      const fromDict = (unitInput.id && this.unitsDict[unitInput.id]) ? this.unitsDict[unitInput.id] : {};
      unitData = Object.assign({}, fromDict, unitInput);
    }
    if (!unitData) return;

    // Reset UI structure in case it was overwritten by openRelationship()
    if (!this.panel.querySelector('#drawer-title')) {
      this.initUI();
    }

    this.currentUnit = unitData;
    this.isOpen = true;

    const backdrop = document.getElementById('drawer-backdrop');
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.onclick = () => this.close();
    }

    // Fill header elements
    const badgeEl = this.panel.querySelector('#drawer-badge');
    const levelStr = unitData.level || unitData.kategori_fungsi || 'Eselon II';
    if (badgeEl) {
      badgeEl.textContent = levelStr;
      badgeEl.className = `badge ${formatBadgeClass(levelStr)}`;
    }

    const titleEl = this.panel.querySelector('#drawer-title');
    if (titleEl) {
      let displayName = unitData.nama || unitData.singkatan || unitData.id || 'Unit DJBC';
      if (!unitData.nama || displayName === unitData.id || displayName.includes('-seksi-') || displayName.includes('-subbag-') || displayName.includes('&')) {
        displayName = inferEselon4UnitName(unitData.id, displayName);
      }
      const icon = getUnitIcon(unitData, this.unitsDict);
      titleEl.innerHTML = `<span style="font-size:20px; vertical-align:middle; margin-right:6px;">${icon}</span><span>${displayName}</span>`;
    }

    let parentName = 'Direktorat Jenderal Bea dan Cukai';
    if (unitData.parent && this.unitsDict[unitData.parent]) {
      parentName = this.unitsDict[unitData.parent].nama || parentName;
    } else if (unitData.parentNama) {
      parentName = unitData.parentNama;
    } else if (unitData.id && unitData.id.includes('-')) {
      const parts = unitData.id.split('-');
      for (let i = parts.length - 1; i >= 1; i--) {
        const potentialParentId = parts.slice(0, i).join('-');
        if (this.unitsDict[potentialParentId]) {
          parentName = this.unitsDict[potentialParentId].nama || parentName;
          break;
        }
      }
    }

    const indukEl = this.panel.querySelector('#drawer-induk');
    if (indukEl) {
      indukEl.innerHTML = `<span>🏢</span> ${parentName}`;
    }

    const kodeEl = this.panel.querySelector('#drawer-kode');
    if (kodeEl) {
      kodeEl.textContent = unitData.singkatan || unitData.id || '-';
    }

    const lokasiEl = this.panel.querySelector('#drawer-lokasi');
    if (lokasiEl) {
      lokasiEl.textContent = unitData.lokasi || unitData.provinsi || (unitData.parent === 'kantor-pusat' || (unitData.id && (unitData.id.startsWith('dit-') || unitData.id.startsWith('tp-') || unitData.id.startsWith('subdit') || unitData.id.startsWith('bagian-') || unitData.id === 'setditjen')) ? 'Kantor Pusat DJBC (Jakarta)' : 'Indonesia');
    }

    const mapBtn = this.panel.querySelector('#drawer-map-btn');
    if (mapBtn) {
      mapBtn.onclick = (e) => {
        e.stopPropagation();
        if (this.onNavigateToMap) {
          this.onNavigateToMap(unitData);
        }
      };
    }

    const pimpinanEl = this.panel.querySelector('#drawer-pimpinan');
    if (pimpinanEl) {
      let pimpinanTitle = unitData.jabatan_pimpinan;
      if (!pimpinanTitle || pimpinanTitle === '-') {
        const currentTitle = titleEl ? titleEl.textContent : '';
        if (currentTitle.startsWith('Seksi')) {
          pimpinanTitle = 'Kepala ' + currentTitle;
        } else if (currentTitle.startsWith('Subbagian')) {
          pimpinanTitle = 'Kepala ' + currentTitle;
        } else if (currentTitle.startsWith('Tim Pengkaji')) {
          pimpinanTitle = 'Ketua ' + currentTitle;
        } else if (unitData.level === 'eselon-2') {
          pimpinanTitle = 'Direktur / Kepala Kantor Wilayah';
        } else if (unitData.level === 'eselon-3') {
          pimpinanTitle = 'Kepala Subdirektorat / Bagian / Kantor';
        } else {
          pimpinanTitle = 'Kepala Seksi / Subbagian';
        }
      }
      pimpinanEl.textContent = pimpinanTitle;
    }

    const hukumEl = this.panel.querySelector('#drawer-hukum');
    if (hukumEl) {
      hukumEl.textContent = unitData.dasar_hukum || 'PMK Nomor 124 Tahun 2024';
    }

    const tugasEl = this.panel.querySelector('#drawer-tugas');
    if (tugasEl) {
      tugasEl.textContent = unitData.tugas || 'Melaksanakan tugas dan fungsi di lingkungan DJBC.';
    }

    // Render functions list
    const fungsiUl = this.panel.querySelector('#drawer-fungsi');
    if (fungsiUl) {
      fungsiUl.innerHTML = '';
      const functions = Array.isArray(unitData.fungsi) ? unitData.fungsi : (unitData.fungsi ? [unitData.fungsi] : []);
      if (functions.length) {
        functions.forEach(f => {
          const li = document.createElement('li');
          li.style.marginBottom = '6px';
          li.textContent = f;
          fungsiUl.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = 'Melaksanakan koordinasi, pengawasan, dan perumusan kebijakan atau pelayanan teknis kepabeanan dan cukai.';
        fungsiUl.appendChild(li);
      }
    }

    // 3. Render Sub-units List (Unit di Bawahnya)
    const childrenContainer = this.panel.querySelector('#drawer-children-list');
    const countBadge = this.panel.querySelector('#drawer-children-count');
    if (childrenContainer) {
      childrenContainer.innerHTML = '';

      let rawChildren = [];
      const titleLower = (unitData.nama || unitData.id || '').toLowerCase();
      const levelLower = (unitData.level || '').toLowerCase();
      const isEselon4 = levelLower === 'eselon-4' || levelLower === 'eselon iv' ||
                        titleLower.startsWith('subbag') || titleLower.startsWith('seksi') ||
                        titleLower.startsWith('subbagian') || titleLower.startsWith('kelompok jabatan fungsional');

      // Only search for sub-units if this is NOT an Eselon IV (leaf) unit
      if (!isEselon4) {
        if (unitData.children && unitData.children.length) {
          rawChildren = unitData.children;
        } else if (this.unitsDict) {
          rawChildren = Object.values(this.unitsDict).filter(u => u.parent === unitData.id);
        }

        // If an Eselon-2 or Eselon-3 unit still has 0 children in data, provide accurate structural sub-units
        if (rawChildren.length === 0) {
          const unitId = unitData.id || 'unit';

          if (unitId.startsWith('kppbc-') || titleLower.startsWith('kppbc') || titleLower.startsWith('kantor pengawasan')) {
            rawChildren = [
              { id: `${unitId}-seksi-pelayanan`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai', level: 'Eselon IV', lokasi: unitData.nama || 'Kantor Pelayanan' },
              { id: `${unitId}-seksi-p2`, nama: 'Seksi Penindakan dan Penyidikan', level: 'Eselon IV', lokasi: unitData.nama || 'Kantor Pelayanan' },
              { id: `${unitId}-seksi-perbendaharaan`, nama: 'Seksi Perbendaharaan', level: 'Eselon IV', lokasi: unitData.nama || 'Kantor Pelayanan' },
              { id: `${unitId}-seksi-ki`, nama: 'Seksi Kepatuhan Internal dan Penyuluhan', level: 'Eselon IV', lokasi: unitData.nama || 'Kantor Pelayanan' },
              { id: `${unitId}-subbag-umum`, nama: 'Subbagian Umum', level: 'Eselon IV', lokasi: unitData.nama || 'Kantor Pelayanan' }
            ];
          } else if ((titleLower.startsWith('bagian ') || unitId.startsWith('bagian-')) && !titleLower.includes('subbag')) {
            rawChildren = [
              { id: `${unitId}-subbag-1`, nama: 'Subbagian Tata Laksana dan Kepegawaian', level: 'Eselon IV', lokasi: 'Kantor Pusat' },
              { id: `${unitId}-subbag-2`, nama: 'Subbagian Kinerja dan Keuangan', level: 'Eselon IV', lokasi: 'Kantor Pusat' },
              { id: `${unitId}-subbag-3`, nama: 'Subbagian Rumah Tangga dan Perlengkapan', level: 'Eselon IV', lokasi: 'Kantor Pusat' }
            ];
          } else if ((titleLower.startsWith('subdirektorat ') || unitId.startsWith('subdit-') || unitId.startsWith('subdir-') || levelLower === 'eselon-3') && !titleLower.includes('seksi') && !titleLower.includes('subbag') && !titleLower.startsWith('bidang')) {
            rawChildren = [
              { id: `${unitId}-seksi-1`, nama: 'Seksi Standardisasi dan Perumusan Teknis', level: 'Eselon IV', lokasi: 'Kantor Pusat' },
              { id: `${unitId}-seksi-2`, nama: 'Seksi Bimbingan Teknis dan Supervisi', level: 'Eselon IV', lokasi: 'Kantor Pusat' },
              { id: `${unitId}-seksi-3`, nama: 'Seksi Monitoring, Evaluasi, dan Pengendalian', level: 'Eselon IV', lokasi: 'Kantor Pusat' }
            ];
          } else if (titleLower.startsWith('bidang ') || unitId.includes('bid-')) {
            if (titleLower.includes('pelayanan') || titleLower.includes('fasilitas')) {
              rawChildren = [
                { id: `${unitId}-seksi-pelayanan-1`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai I', level: 'Eselon IV', lokasi: unitData.lokasi || 'KPU BC' },
                { id: `${unitId}-seksi-pelayanan-2`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai II', level: 'Eselon IV', lokasi: unitData.lokasi || 'KPU BC' },
                { id: `${unitId}-seksi-fasilitas`, nama: 'Seksi Fasilitas Kepabeanan dan Cukai', level: 'Eselon IV', lokasi: unitData.lokasi || 'KPU BC' }
              ];
            } else if (titleLower.includes('pengawasan') || titleLower.includes('penindakan') || titleLower.includes('p2') || titleLower.includes('penegakan')) {
              rawChildren = [
                { id: `${unitId}-seksi-intelijen`, nama: 'Seksi Intelijen', level: 'Eselon IV', lokasi: unitData.lokasi || 'KPU BC' },
                { id: `${unitId}-seksi-penindakan`, nama: 'Seksi Penindakan', level: 'Eselon IV', lokasi: unitData.lokasi || 'KPU BC' },
                { id: `${unitId}-seksi-penyidikan`, nama: 'Seksi Penyidikan dan Barang Hasil Penindakan', level: 'Eselon IV', lokasi: unitData.lokasi || 'KPU BC' }
              ];
            } else if (titleLower.includes('kepatuhan') || titleLower.includes('internal') || titleLower.includes('ki')) {
              rawChildren = [
                { id: `${unitId}-seksi-kepatuhan`, nama: 'Seksi Kepatuhan Pelaksanaan Tugas', level: 'Eselon IV', lokasi: unitData.lokasi || 'KPU BC' },
                { id: `${unitId}-seksi-manajemen-risiko`, nama: 'Seksi Manajemen Risiko', level: 'Eselon IV', lokasi: unitData.lokasi || 'KPU BC' }
              ];
            }
          } else if (titleLower.includes('pengkaji') || unitId.startsWith('tp-')) {
            rawChildren = [
              { id: `${unitId}-tim-pengkaji`, nama: 'Tim Pengkaji Kebijakan Strategis', level: 'Fungsional Ahli Madya', lokasi: 'Kantor Pusat' },
              { id: `${unitId}-dukungan-teknis`, nama: 'Subbagian Dukungan Teknis dan Tata Usaha', level: 'Eselon IV', lokasi: 'Kantor Pusat' }
            ];
          }
        }
      }

      const resolvedChildren = rawChildren.map(child => {
        if (typeof child === 'string') {
          return this.unitsDict[child] || { id: child, nama: child, level: 'Eselon III', lokasi: 'Indonesia' };
        } else if (child && typeof child === 'object') {
          if (child.id && this.unitsDict[child.id]) {
            return { ...this.unitsDict[child.id], ...child };
          }
          return child;
        }
        return { id: String(child), nama: String(child) };
      }).filter(c => c && (c.nama || c.id));

      if (countBadge) {
        countBadge.textContent = `${resolvedChildren.length} Unit`;
      }

      if (resolvedChildren.length > 0) {
        resolvedChildren.forEach(child => {
          const childName = child.nama || child.singkatan || child.id || 'Sub-Unit';
          const childLevel = child.level || 'Eselon III';
          const childLocation = child.lokasi || child.provinsi || (child.parent === 'kantor-pusat' ? 'Kantor Pusat' : (child.kategori_fungsi || 'Unit'));

          const isChildSelected = child.id === this.currentUnit.id;
          const card = document.createElement('div');
          card.style.cssText = `
            padding: 10px 14px;
            background: ${isChildSelected ? '#ECFDF5' : '#FFFFFF'};
            border: ${isChildSelected ? '2px solid #059669' : '1px solid #E2E8F0'};
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: ${isChildSelected ? '0 4px 12px rgba(5, 150, 105, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)'};
          `;

          const childIcon = getUnitIcon(child, this.unitsDict);
          card.innerHTML = `
            <div style="flex: 1; padding-right: 8px;">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                <span style="font-size: 12.5px; font-weight: 700; color: ${isChildSelected ? '#065F46' : '#062B52'}; line-height: 1.3; display:flex; align-items:center; gap:6px;">
                  <span style="font-size: 13.5px;">${childIcon}</span>
                  <span>${childName}</span>
                </span>
                ${isChildSelected ? '<span style="font-size: 10px; font-weight: 700; color: #059669;">● Aktif</span>' : ''}
              </div>
              <div style="font-size: 10.5px; color: #64748B; margin-top: 3px; display: flex; align-items: center; gap: 6px;">
                <span style="padding: 1px 6px; background: ${isChildSelected ? '#D1FAE5' : '#F1F5F9'}; color: ${isChildSelected ? '#065F46' : '#475569'}; border-radius: 4px; font-weight: 600;">${childLevel}</span>
                <span>• ${childLocation}</span>
              </div>
            </div>
            <span style="font-size: 16px; color: ${isChildSelected ? '#059669' : '#0369A1'}; font-weight: bold;">›</span>
          `;

          card.addEventListener('mouseenter', () => {
            card.style.borderColor = '#0284C7';
            card.style.transform = 'translateX(2px)';
            card.style.background = '#F0F9FF';
          });
          card.addEventListener('mouseleave', () => {
            card.style.borderColor = '#E2E8F0';
            card.style.transform = 'none';
            card.style.background = '#FFFFFF';
          });

          card.addEventListener('click', () => {
            if (this.onUnitSelect) {
              this.onUnitSelect(child);
            }
          });

          childrenContainer.appendChild(card);
        });
      } else {
        childrenContainer.innerHTML = '<div style="font-size:12px; color:#94A3B8; font-style:italic; padding:8px 0;">Tidak ada sub-unit di bawahnya.</div>';
      }
    }

    // 4. Render Related Units & Interdependencies (from relationships.json & unitData.relatedUnits)
    const relatedContainer = this.panel.querySelector('#drawer-related');
    if (relatedContainer) {
      relatedContainer.innerHTML = '';
      const allRelationships = window.DATA_RELATIONSHIPS || window.__DJBC_RELATIONSHIPS__ || [];
      const unitRelList = [];

      // A. Explicit relatedUnits from unit record
      if (unitData.relatedUnits && unitData.relatedUnits.length) {
        unitData.relatedUnits.forEach(rel => {
          const relObj = typeof rel === 'string' ? (this.unitsDict[rel] || { id: rel, nama: rel }) : rel;
          unitRelList.push({
            target: relObj,
            label: relObj.nama || relObj.singkatan || relObj.id,
            deskripsi: 'Koordinasi Operasional & Kebijakan'
          });
        });
      }

      // B. Matched records from relationships.json
      allRelationships.forEach(r => {
        if (r.source_unit === unitData.id || r.source === unitData.id) {
          const targetId = r.target_unit || r.target;
          const targetObj = this.unitsDict[targetId] || { id: targetId, nama: r.target_name || targetId };
          unitRelList.push({
            target: targetObj,
            label: targetObj.nama || targetId,
            deskripsi: r.nama_hubungan || r.deskripsi || r.tipe_hubungan || 'Koordinasi Teknis'
          });
        } else if (r.target_unit === unitData.id || r.target === unitData.id) {
          const sourceId = r.source_unit || r.source;
          const sourceObj = this.unitsDict[sourceId] || { id: sourceId, nama: r.source_name || sourceId };
          unitRelList.push({
            target: sourceObj,
            label: sourceObj.nama || sourceId,
            deskripsi: r.nama_hubungan || r.deskripsi || r.tipe_hubungan || 'Dukungan & Supervisi'
          });
        }
      });

      // Deduplicate by target ID
      const seenTargets = new Set();
      const uniqueRels = unitRelList.filter(item => {
        const targetId = item.target.id || item.label;
        if (seenTargets.has(targetId) || targetId === unitData.id) return false;
        seenTargets.add(targetId);
        return true;
      });

      if (uniqueRels.length > 0) {
        uniqueRels.forEach(item => {
          const relCard = document.createElement('div');
          relCard.style.cssText = `
            padding: 8px 12px;
            background: #F8FAFC;
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
          `;
          relCard.innerHTML = `
            <div>
              <div style="font-size: 12px; font-weight: 700; color: #0B3A6F;">${item.label}</div>
              <div style="font-size: 10px; color: #64748B; margin-top: 2px;">${item.deskripsi}</div>
            </div>
            <span style="font-size: 14px; color: #0284C7;">➔</span>
          `;
          relCard.addEventListener('mouseenter', () => {
            relCard.style.borderColor = '#0284C7';
            relCard.style.background = '#EFF6FF';
          });
          relCard.addEventListener('mouseleave', () => {
            relCard.style.borderColor = '#CBD5E1';
            relCard.style.background = '#F8FAFC';
          });
          relCard.addEventListener('click', () => {
            if (this.onUnitSelect) {
              this.onUnitSelect(item.target);
            }
          });
          relatedContainer.appendChild(relCard);
        });
      } else {
        relatedContainer.innerHTML = '<span style="font-size:12px; color:#94A3B8; font-style:italic;">Tidak ada unit interdependensi khusus.</span>';
      }
    }

    // 5. Render Process Flows Participation (from alur_proses.json)
    const procSection = this.panel.querySelector('#drawer-processes-section');
    const procList = this.panel.querySelector('#drawer-processes-list');
    const alurData = window.DATA_ALUR_PROSES || window.__DJBC_ALUR_PROSES__ || {};
    const prosesArr = alurData.proses || [];

    if (procSection && procList) {
      procList.innerHTML = '';
      const matchedProcesses = [];

      prosesArr.forEach(proc => {
        const stagesInvolved = [];
        (proc.tahapan || []).forEach(tahap => {
          const involved = (tahap.unit_terlibat || []).some(u => 
            u.unit_id === unitData.id || 
            (unitData.id && unitData.id.startsWith(u.unit_id)) ||
            (u.unit_id === 'kantor-pusat' && unitData.parent === 'kantor-pusat') ||
            (u.unit_id === 'kanwil' && unitData.id && unitData.id.startsWith('kanwil-')) ||
            (u.unit_id === 'kppbc' && unitData.id && unitData.id.startsWith('kppbc-')) ||
            (u.unit_id === 'pso' && unitData.id && unitData.id.startsWith('pso-')) ||
            (u.unit_id === 'blbc' && unitData.id && unitData.id.startsWith('blbc-'))
          );
          if (involved) {
            stagesInvolved.push(tahap.judul);
          }
        });

        if (stagesInvolved.length > 0) {
          matchedProcesses.push({
            procTitle: proc.nama,
            stages: stagesInvolved
          });
        }
      });

      if (matchedProcesses.length > 0) {
        procSection.style.display = 'block';
        matchedProcesses.forEach(mp => {
          const card = document.createElement('div');
          card.style.cssText = `
            padding: 8px 12px;
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            border-radius: 8px;
          `;
          card.innerHTML = `
            <div style="font-size: 11.5px; font-weight: 700; color: #166534;">${mp.procTitle}</div>
            <div style="font-size: 10px; color: #15803D; margin-top: 3px;">Tahapan: ${mp.stages.join(', ')}</div>
          `;
          procList.appendChild(card);
        });
      } else {
        procSection.style.display = 'none';
      }
    }

    if (this.panel && this.panel.classList) {
      this.panel.classList.add('open');
    }
  }

  getUnitDisplayName(id) {
    if (!id) return '-';
    if (this.unitsDict[id]) return this.unitsDict[id].nama || this.unitsDict[id].singkatan || id;
    const names = {
      'dit-p2': 'Direktorat Penindakan dan Penyidikan',
      'dit-interdiksi': 'Direktorat Interdiksi Narkotika',
      'dit-teknis-kepab': 'Direktorat Teknis Kepabeanan',
      'dit-fasilitas-kepab': 'Direktorat Fasilitas Kepabeanan',
      'dit-tfc': 'Direktorat Teknis & Fasilitas Cukai',
      'dit-audit': 'Direktorat Audit Kepabeanan & Cukai',
      'dit-ikc': 'Direktorat Informasi Kepabeanan & Cukai',
      'dit-ksikc': 'Direktorat Kerja Sama Internasional Kepabeanan',
      'dit-kombimjas': 'Direktorat Komunikasi & Bimbingan Pengguna Jasa',
      'dit-kbp': 'Direktorat Keberatan, Banding, dan Peraturan',
      'setditjen': 'Sekretariat Direktorat Jenderal',
      'dit-ki': 'Direktorat Kepatuhan Internal',
      'kanwil': 'Kantor Wilayah DJBC (Regional)',
      'kpu': 'Kantor Pelayanan Utama (KPU BC)',
      'kppbc': 'Kantor Pengawasan & Pelayanan (KPPBC)',
      'blbc': 'Balai Laboratorium Bea dan Cukai (BLBC)',
      'pso': 'Pangkalan Sarana Operasi (PSO BC)',
      'insw': 'Indonesia National Single Window (INSW)',
      'ciq-imigrasi-karantina': 'Sinergi CIQ (Imigrasi & Barantin)',
      'tni-polri-bakamla': 'TNI / POLRI / Bakamla',
      'wco-asean': 'WCO & ASEAN Single Window'
    };
    return names[id] || id.toUpperCase();
  }

  getCategoryColor(cat) {
    switch ((cat || '').toLowerCase()) {
      case 'pengawasan': return '#DC2626';
      case 'pelayanan-fasilitas':
      case 'pelayanan': return '#0284C7';
      case 'laboratorium-teknis':
      case 'laboratorium': return '#059669';
      case 'data-sistem':
      case 'data': return '#4F46E5';
      case 'interdependensi-eksternal':
      case 'eksternal': return '#7C3AED';
      case 'pembinaan-sdm':
      case 'pembinaan': return '#0B3A6F';
      default: return '#64748B';
    }
  }

  openRelationship(rel) {
    if (!rel) return;
    this.isOpen = true;
    this.currentUnit = null;

    const backdrop = document.getElementById('drawer-backdrop');
    if (backdrop) {
      backdrop.classList.add('active');
      backdrop.onclick = () => this.close();
    }

    const fromName = this.getUnitDisplayName(rel.from);
    const toName = this.getUnitDisplayName(rel.to);
    const categoryColor = this.getCategoryColor(rel.category);

    this.panel.className = 'detail-drawer open';
    this.panel.innerHTML = `
      <div class="drawer-header" style="padding: 20px 24px; border-bottom: 1px solid #D9E0E8; background: #FFFFFF; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span class="badge" style="padding: 4px 10px; background: ${categoryColor}15; color: ${categoryColor}; border-radius: 9999px; font-size: 11px; font-weight: 700; border: 1px solid ${categoryColor}40;">
            ${(rel.category || 'RELASI').toUpperCase().replace('-', ' ')} • ${(rel.type || 'INTERAKSI').toUpperCase()}
          </span>
          <h2 class="drawer-title" style="margin-top: 8px; font-size: 18px; font-weight: 800; color: #062B52; line-height: 1.3;">
            ${rel.label}
          </h2>
          <p style="font-size: 12px; color: #64748B; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
            <span>🔄</span> Interaksi & Keterkaitan Antar Unit Kerja
          </p>
        </div>
        <button id="drawer-close-btn" class="drawer-close" style="background: transparent; border: none; font-size: 24px; color: #64748B; cursor: pointer; padding: 4px;" title="Tutup Panel">&times;</button>
      </div>

      <div class="drawer-content" style="padding: 20px 24px; overflow-y: auto; max-height: calc(100vh - 120px);">
        
        <!-- Unit Asal ➔ Unit Tujuan Flow Box -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 10px;">
            Alur Interaksi Antar Satuan Kerja:
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <!-- Source Unit -->
            <div class="card" style="padding: 12px 14px; border-left: 4px solid #0B3A6F; cursor: pointer; background: #FFFFFF;" data-drawer-open-unit="${rel.from}">
              <span style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase;">Unit Asal (From)</span>
              <div style="font-size: 13.5px; font-weight: 700; color: #0B3A6F; margin-top: 2px;">
                ${fromName}
              </div>
              <div style="font-size: 11px; color: #0284C7; font-weight: 600; margin-top: 4px;">🔍 Klik untuk Lihat Profil Unit Lengkap ➔</div>
            </div>

            <!-- Flow Direction Indicator -->
            <div style="text-align: center; color: ${categoryColor}; font-size: 18px; font-weight: 800; line-height: 1;">
              ↓
            </div>

            <!-- Target Unit -->
            <div class="card" style="padding: 12px 14px; border-left: 4px solid #0284C7; cursor: pointer; background: #FFFFFF;" data-drawer-open-unit="${rel.to}">
              <span style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase;">Unit Tujuan (To)</span>
              <div style="font-size: 13.5px; font-weight: 700; color: #0B3A6F; margin-top: 2px;">
                ${toName}
              </div>
              <div style="font-size: 11px; color: #0284C7; font-weight: 600; margin-top: 4px;">🔍 Klik untuk Lihat Profil Unit Lengkap ➔</div>
            </div>
          </div>
        </div>

        <!-- Quick Info Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px;">
            <div style="font-size: 10px; color: #64748B; font-weight: 600; text-transform: uppercase;">Sifat Hubungan</div>
            <div style="font-size: 12px; font-weight: 700; color: #062B52; margin-top: 2px;">${rel.sifat_hubungan || rel.type || 'Koordinatif'}</div>
          </div>
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 12px;">
            <div style="font-size: 10px; color: #64748B; font-weight: 600; text-transform: uppercase;">Dasar Hukum</div>
            <div style="font-size: 12px; font-weight: 700; color: #062B52; margin-top: 2px;">${rel.dasar_hukum || 'PMK 124/2024'}</div>
          </div>
        </div>

        <!-- Section: Penjelasan Interaksi & Mekanisme -->
        <div class="drawer-section" style="margin-bottom: 20px;">
          <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">
            Penjelasan Interaksi & Mekanisme Kerja
          </div>
          <div style="background: #FFFFFF; border-left: 4px solid ${categoryColor}; border-radius: 4px; padding: 12px 14px; border-top: 1px solid #E2E8F0; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
            <p style="font-size: 13px; color: #1E293B; line-height: 1.6; margin: 0;">
              ${rel.deskripsi}
            </p>
          </div>
        </div>

        <!-- Section: Dokumen & Data yang Dipertukarkan -->
        <div class="drawer-section" style="margin-bottom: 20px;">
          <div class="drawer-section-title" style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">
            Dokumen & Data yang Dipertukarkan
          </div>
          <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px 14px; font-size: 12.5px; font-weight: 600; color: #78350F; line-height: 1.5;">
            📄 ${rel.dokumen_data || 'Dokumen Operasional & Data Teknis Terkait'}
          </div>
        </div>

      </div>
    `;

    const closeBtn = this.panel.querySelector('#drawer-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    this.panel.querySelectorAll('[data-drawer-open-unit]').forEach(card => {
      card.addEventListener('click', () => {
        const uId = card.getAttribute('data-drawer-open-unit');
        if (uId) {
          const unitObj = this.unitsDict[uId] || { id: uId, nama: this.getUnitDisplayName(uId) };
          this.initUI();
          this.open(unitObj);
        }
      });
    });
  }

  close() {
    this.isOpen = false;
    this.panel.classList.remove('open');
    const backdrop = document.getElementById('drawer-backdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
    }
  }
}


/* --- search.js --- */

/**
 * search.js — Client-side Static Search Engine & Search Results Page matching Stitch Screen 04.
 * Features:
 * - Live auto-complete dropdown on global search bar
 * - Full Search Results Page with 2-Column Bento Grid, Filter Chips, Highlight Spans
 * - Direct "Buka di Struktur" action focusing on tree canvas with optimal zoom
 * - 100% static & offline compatible with file:// protocol
 */



class SearchEngine {
  constructor(inputEl, dropdownEl, pageContainerEl, onSelectResult, onOpenInTree, onOpenView, onOpenDetail) {
    this.input = inputEl;
    this.dropdown = dropdownEl;
    this.pageContainer = pageContainerEl;
    this.onSelectResult = onSelectResult;
    this.onOpenInTree = onOpenInTree;
    this.onOpenView = onOpenView;
    this.onOpenDetail = onOpenDetail;

    this.searchIndex = [];
    this.unitsDict = {};
    this.currentQuery = '';
    this.activeFilter = 'all'; // 'all', 'unit', 'fungsi', 'regulasi', 'lainnya'
    this.currentSort = 'relevance'; // 'relevance', 'name', 'level'

    // Static regulations database for rich contextual search
    this.regulations = [
      {
        id: 'pmk-124-2024',
        title: 'PMK No. 124 Tahun 2024',
        desc: 'Organisasi dan Tata Kerja Kementerian Keuangan (Kedudukan, Tugas, dan Struktur Kantor Pusat DJBC).',
        keywords: ['organisasi', 'struktur', 'tata kerja', 'kemenkeu', 'pusat', 'direktorat', 'setditjen', 'pengkaji']
      },
      {
        id: 'pmk-188-2016',
        title: 'PMK No. 188/PMK.01/2016',
        desc: 'Organisasi dan Tata Kerja Instansi Vertikal dan Unit Pelaksana Teknis DJBC (Kanwil, KPPBC, BLBC, PSO).',
        keywords: ['vertikal', 'kanwil', 'kppbc', 'blbc', 'pso', 'laboratorium', 'sarana operasi', 'daerah']
      },
      {
        id: 'pmk-190-2022',
        title: 'PMK No. 190/PMK.04/2022',
        desc: 'Tatalaksana Pengeluaran Barang Impor untuk Dipakai (Prosedur Kepabeanan Impor & Manifest).',
        keywords: ['impor', 'pengeluaran', 'barang impor', 'pabean', 'dokumen impor', 'pemeriksaan pabean', 'billing']
      },
      {
        id: 'pmk-155-2022',
        title: 'PMK No. 155/PMK.04/2022',
        desc: 'Ketentuan dan Ketetapan Kepabeanan di Bidang Ekspor.',
        keywords: ['ekspor', 'barang ekspor', 'pabean ekspor', 'peb', 'fasilitas ekspor']
      },
      {
        id: 'uu-17-2006',
        title: 'UU No. 17 Tahun 2006',
        desc: 'Perubahan atas UU No. 10 Tahun 1995 tentang Kepabeanan (Aspek Pengawasan, Fasilitas, & Penegakan Hukum).',
        keywords: ['undang undang', 'kepabeanan', 'uu kepabeanan', 'hukum', 'pengawasan', 'tarif', 'pabean']
      },
      {
        id: 'uu-39-2007',
        title: 'UU No. 39 Tahun 2007',
        desc: 'Perubahan atas UU No. 11 Tahun 1995 tentang Cukai (Ketentuan Hasil Tembakau, MMEA, dan BKC lainnya).',
        keywords: ['cukai', 'uu cukai', 'tembakau', 'rokok', 'mmea', 'alkohol', 'bkc', 'tarif cukai']
      }
    ];

    this.bindEvents();
  }

  setIndex(indexData) {
    this.searchIndex = indexData || [];
  }

  setUnitsDict(dict) {
    this.unitsDict = dict || {};
  }

  bindEvents() {
    // Header Search Input
    if (this.input) {
      const handleInput = debounce((e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query || query.length < 2) {
          this.closeDropdown();
          return;
        }
        this.renderDropdownResults(query);
      }, 200);

      this.input.addEventListener('input', handleInput);

      this.input.addEventListener('focus', () => {
        if (this.input.value.trim().length >= 2) {
          this.renderDropdownResults(this.input.value.trim().toLowerCase());
        }
      });

      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = this.input.value.trim();
          if (query) {
            this.closeDropdown();
            this.goToSearchPage(query);
          }
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (this.input && this.dropdown && !this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });
  }

  goToSearchPage(query) {
    this.currentQuery = query;
    if (this.onOpenView) {
      this.onOpenView('view-search');
    }
    this.renderSearchPage(query);
  }

  highlightMatch(text, query) {
    if (!text || !query) return escapeHtml(text || '');
    const cleanText = String(text);
    const words = query.trim().split(/\s+/).filter(w => w.length > 1);
    if (!words.length) return escapeHtml(cleanText);

    const pattern = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    return escapeHtml(cleanText).replace(pattern, '<span class="search-highlight">$1</span>');
  }

  performSearch(query) {
    if (!this.searchIndex.length) return { units: [], functions: [], regulations: [], totalCount: 0 };

    const queryClean = query.trim().toLowerCase();
    const queryTokens = queryClean.split(/\s+/).filter(Boolean);

    const unitResults = [];
    const functionResults = [];

    // Search Units & Functions
    this.searchIndex.forEach(item => {
      let score = 0;
      const titleLower = (item.title || '').toLowerCase();
      const shortLower = (item.shortName || '').toLowerCase();
      const unit = this.unitsDict[item.id] || {};

      if (titleLower.includes(queryClean) || shortLower.includes(queryClean)) {
        score += 20;
      }

      queryTokens.forEach(token => {
        if (item.tokens && item.tokens.some(t => t.includes(token))) {
          score += 3;
        }
        if (unit.tugas && unit.tugas.toLowerCase().includes(token)) {
          score += 2;
        }
      });

      if (score > 0) {
        unitResults.push({
          item,
          unit,
          score
        });
      }

      // Check functions
      const funcs = Array.isArray(unit.fungsi) ? unit.fungsi : (unit.fungsi ? [unit.fungsi] : []);
      funcs.forEach((f, idx) => {
        if (typeof f === 'string' && f.toLowerCase().includes(queryClean)) {
          functionResults.push({
            id: `${item.id}-func-${idx}`,
            unitId: item.id,
            unitName: item.title,
            fungsiText: f,
            score: 10
          });
        }
      });
    });

    // Search Regulations
    const regulationResults = [];
    this.regulations.forEach(reg => {
      const titleLower = reg.title.toLowerCase();
      const descLower = reg.desc.toLowerCase();
      let matched = false;

      if (titleLower.includes(queryClean) || descLower.includes(queryClean)) {
        matched = true;
      } else if (reg.keywords.some(k => queryClean.includes(k) || k.includes(queryClean))) {
        matched = true;
      }

      if (matched) {
        regulationResults.push(reg);
      }
    });

    // Sort units
    if (this.currentSort === 'relevance') {
      unitResults.sort((a, b) => b.score - a.score);
    } else if (this.currentSort === 'name') {
      unitResults.sort((a, b) => a.item.title.localeCompare(b.item.title));
    } else if (this.currentSort === 'level') {
      unitResults.sort((a, b) => (a.item.level || '').localeCompare(b.item.level || ''));
    }

    const totalCount = unitResults.length + functionResults.length + regulationResults.length;

    return {
      units: unitResults,
      functions: functionResults,
      regulations: regulationResults,
      totalCount
    };
  }

  renderDropdownResults(query) {
    if (!this.dropdown) return;
    this.dropdown.innerHTML = '';

    const { units, totalCount } = this.performSearch(query);

    if (!units.length) {
      this.dropdown.innerHTML = `
        <div class="search-result-item" style="color: #64748B; padding: 12px 16px; font-size: 13px;">
          Tidak ada hasil untuk "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      this.dropdown.classList.add('open');
      return;
    }

    // Render top 5 dropdown suggestions
    units.slice(0, 5).forEach(({ item }) => {
      const itemIcon = getUnitIcon(item, this.unitsDict);
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.style.cssText = 'padding: 10px 16px; cursor: pointer; border-bottom: 1px solid #F1F5F9; transition: background 0.15s;';
      div.innerHTML = `
        <div style="font-size: 13.5px; font-weight: 600; color: #062B52; display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 14px;">${itemIcon}</span>
          <span>${this.highlightMatch(item.title, query)}</span>
        </div>
        <div style="font-size: 11px; color: #64748B; margin-top: 2px;">${item.shortName || ''} • ${item.level || 'Unit DJBC'}</div>
      `;

      div.addEventListener('click', () => {
        this.input.value = item.title;
        this.closeDropdown();
        if (this.onSelectResult) this.onSelectResult(item.id);
      });

      this.dropdown.appendChild(div);
    });

    // Footer button to open full search results page
    const footerBtn = document.createElement('div');
    footerBtn.style.cssText = `
      padding: 10px 16px;
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      color: #0B3A6F;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;
    footerBtn.innerHTML = `
      <span>Lihat semua ${totalCount} hasil pencarian</span>
      <span style="font-size: 14px;">➔</span>
    `;
    footerBtn.addEventListener('click', () => {
      this.closeDropdown();
      this.goToSearchPage(query);
    });

    this.dropdown.appendChild(footerBtn);
    this.dropdown.classList.add('open');
  }

  closeDropdown() {
    if (this.dropdown) this.dropdown.classList.remove('open');
  }

  /**
   * Renders the complete Search Results Page matching Stitch Screen 18134903d4b24228ae405c745b430f59.
   */
  renderSearchPage(query = '') {
    if (!this.pageContainer) return;
    this.currentQuery = query.trim();

    if (!this.currentQuery) {
      this.renderEmptySearchPage();
      return;
    }

    const { units, functions, regulations, totalCount } = this.performSearch(this.currentQuery);

    const countUnit = units.length;
    const countFunc = functions.length;
    const countReg = regulations.length;
    const countLain = (countUnit > 0 || countFunc > 0) ? 1 : 0;

    // Filter results based on activeFilter
    const showUnits = (this.activeFilter === 'all' || this.activeFilter === 'unit') && countUnit > 0;
    const showFuncs = (this.activeFilter === 'all' || this.activeFilter === 'fungsi') && countFunc > 0;
    const showRegs = (this.activeFilter === 'all' || this.activeFilter === 'regulasi') && countReg > 0;

    this.pageContainer.innerHTML = `
      <!-- In-Page Search Bar & Controls -->
      <div style="margin-bottom: 28px;">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Top Row: Title, Subtitle, In-Page Search Bar, and Sort -->
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 16px;">
            <div>
              <h2 style="font-size: 28px; font-weight: 700; color: #062B52; margin: 0 0 6px 0; letter-spacing: -0.5px;">Hasil Pencarian</h2>
              <p style="font-size: 14.5px; color: #64748B; margin: 0;">
                Menampilkan <strong style="color: #062B52;">${totalCount}</strong> hasil untuk "<strong style="color: #0B3A6F;">${escapeHtml(this.currentQuery)}</strong>"
              </p>
            </div>

            <!-- In-Page Search Bar -->
            <div style="display: flex; align-items: center; gap: 12px; flex: 1; max-width: 460px;">
              <div style="position: relative; width: 100%;">
                <input 
                  type="text" 
                  id="page-search-input" 
                  value="${escapeHtml(this.currentQuery)}" 
                  placeholder="Cari unit, fungsi, regulasi..." 
                  style="width: 100%; padding: 10px 40px 10px 42px; border-radius: 9999px; border: 1px solid #CBD5E1; background: #FFFFFF; font-size: 13.5px; color: #1E293B; outline: none; box-shadow: 0 2px 6px rgba(0,0,0,0.03);"
                />
                <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <button id="page-search-clear" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; font-size: 18px; color: #94A3B8; cursor: pointer; padding: 2px;">&times;</button>
              </div>

              <!-- Sorting Dropdown -->
              <select id="search-sort-select" style="padding: 10px 14px; border-radius: 10px; border: 1px solid #CBD5E1; background: #FFFFFF; font-size: 13px; font-weight: 600; color: #062B52; outline: none; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                <option value="relevance" ${this.currentSort === 'relevance' ? 'selected' : ''}>Urutkan: Relevansi</option>
                <option value="name" ${this.currentSort === 'name' ? 'selected' : ''}>Urutkan: Nama (A-Z)</option>
                <option value="level" ${this.currentSort === 'level' ? 'selected' : ''}>Urutkan: Tingkat Eselon</option>
              </select>
            </div>
          </div>

          <!-- Filter Chips matching Stitch Screen 04 -->
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
            <button class="search-filter-chip ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">Semua (${totalCount})</button>
            <button class="search-filter-chip ${this.activeFilter === 'unit' ? 'active' : ''}" data-filter="unit">Unit (${countUnit})</button>
            <button class="search-filter-chip ${this.activeFilter === 'fungsi' ? 'active' : ''}" data-filter="fungsi">Fungsi (${countFunc})</button>
            <button class="search-filter-chip ${this.activeFilter === 'regulasi' ? 'active' : ''}" data-filter="regulasi">Regulasi (${countReg})</button>
            <button class="search-filter-chip ${this.activeFilter === 'lainnya' ? 'active' : ''}" data-filter="lainnya">Lainnya (${countLain})</button>
          </div>
        </div>
      </div>

      <!-- Bento Grid / 2-Column Asymmetric Layout -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 24px;" class="search-grid-layout">
        <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;">
          
          <!-- Left Column (8 cols): Primary Results -->
          <div style="grid-column: span 8 / span 8; display: flex; flex-direction: column; gap: 28px;" class="search-primary-col">
            
            <!-- Category: Unit Organisasi -->
            ${showUnits ? `
              <section>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid #D9E0E8; padding-bottom: 10px;">
                  <span style="font-size: 20px;">🏢</span>
                  <h3 style="font-size: 18px; font-weight: 700; color: #062B52; margin: 0;">Unit Organisasi</h3>
                  <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #64748B;">${units.length} Unit Ditemukan</span>
                </div>

                <div style="display: flex; flex-direction: column; gap: 14px;">
                  ${units.map(({ item, unit }) => {
                    const parentName = unit.parent && this.unitsDict[unit.parent] ? (this.unitsDict[unit.parent].nama || 'DJBC') : 'DJBC';
                    const breadcrumb = `DJBC ➔ ${parentName}`;
                    const desc = unit.tugas || unit.fungsi?.[0] || 'Unit pelaksana teknis dan manajerial kepabeanan dan cukai.';
                    const unitIcon = getUnitIcon(unit || item, this.unitsDict);

                    return `
                      <div class="search-result-card" data-unit-id="${item.id}">
                        <div class="search-accent-strip"></div>
                        <div style="display: flex; flex-direction: column; sm:flex-row; justify-content: space-between; align-items: flex-start; gap: 16px;">
                          <div style="flex: 1; padding-left: 6px;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                              <span style="padding: 2px 8px; background: #D5E3FF; color: #001C3B; border-radius: 9999px; font-size: 10.5px; font-weight: 700; text-transform: uppercase;">
                                ${item.level || 'Unit'}
                              </span>
                              <span style="font-size: 11.5px; color: #64748B;">${breadcrumb}</span>
                            </div>
                            <h4 style="font-size: 17px; font-weight: 700; color: #062B52; margin: 0 0 6px 0; line-height: 1.3; display: flex; align-items: center; gap: 6px;">
                              <span style="font-size: 18px; flex-shrink: 0;">${unitIcon}</span>
                              <span>${this.highlightMatch(item.title, this.currentQuery)}</span>
                            </h4>
                            <p style="font-size: 13.5px; color: #475569; margin: 0; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                              ${this.highlightMatch(desc, this.currentQuery)}
                            </p>
                          </div>
                          
                          <!-- Action Buttons -->
                          <div style="display: flex; align-items: center; gap: 8px; shrink-0; align-self: flex-end; sm:align-self: center;">
                            <button class="btn-open-tree" data-unit-id="${item.id}" style="padding: 8px 14px; background: #FFFFFF; border: 1.5px solid #0B3A6F; color: #0B3A6F; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                              <span>Buka di Struktur</span>
                              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            </button>
                            <button class="btn-open-detail" data-unit-id="${item.id}" style="padding: 8px 12px; background: #F1F5F9; border: 1px solid #CBD5E1; color: #334155; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                              Detail
                            </button>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </section>
            ` : ''}

            <!-- Category: Fungsi Utama -->
            ${showFuncs ? `
              <section>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; border-bottom: 1px solid #D9E0E8; padding-bottom: 10px;">
                  <span style="font-size: 20px;">⚡</span>
                  <h3 style="font-size: 18px; font-weight: 700; color: #062B52; margin: 0;">Fungsi Organisasi Terkait</h3>
                  <span style="margin-left: auto; font-size: 12px; font-weight: 600; color: #64748B;">${functions.length} Fungsi Ditemukan</span>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;" class="search-func-grid">
                  ${functions.slice(0, 6).map(func => `
                    <div class="search-function-card">
                      <div>
                        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                          <span style="padding: 2px 8px; background: #FFD57A; color: #795A06; border-radius: 9999px; font-size: 10.5px; font-weight: 700; text-transform: uppercase;">
                            Fungsi
                          </span>
                          <span style="font-size: 11px; color: #64748B; font-weight: 600;">${escapeHtml(func.unitName)}</span>
                        </div>
                        <p style="font-size: 13px; color: #334155; line-height: 1.5; margin: 0 0 14px 0;">
                          ${this.highlightMatch(func.fungsiText, this.currentQuery)}
                        </p>
                      </div>
                      <button class="btn-open-detail" data-unit-id="${func.unitId}" style="align-self: flex-start; background: none; border: none; padding: 0; color: #0B3A6F; font-size: 12.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                        <span>Lihat Detail Unit</span>
                        <span>➔</span>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}

          </div>

          <!-- Right Column (4 cols): Secondary / Contextual Results -->
          <div style="grid-column: span 4 / span 4; display: flex; flex-direction: column; gap: 20px;" class="search-secondary-col">
            
            <!-- Category: Regulasi Terkait -->
            ${showRegs ? `
              <div class="search-regulation-box">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 14px;">
                  <span style="font-size: 20px;">⚖️</span>
                  <h3 style="font-size: 16px; font-weight: 700; color: #062B52; margin: 0;">Regulasi Terkait</h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  ${regulations.map(reg => `
                    <div style="padding: 12px; background: #FFFFFF; border-radius: 10px; border: 1px solid #E2E8F0; transition: all 0.2s;">
                      <div style="font-size: 13.5px; font-weight: 700; color: #062B52; margin-bottom: 4px;">
                        ${this.highlightMatch(reg.title, this.currentQuery)}
                      </div>
                      <p style="font-size: 12px; color: #64748B; margin: 0; line-height: 1.4;">
                        ${this.highlightMatch(reg.desc, this.currentQuery)}
                      </p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Category: Modul Pembelajaran Promo Card -->
            <div class="search-learning-box">
              <div style="position: absolute; right: -15px; bottom: -15px; font-size: 90px; opacity: 0.12; pointer-events: none;">🎓</div>
              <h3 style="font-size: 17px; font-weight: 700; margin: 0 0 6px 0; color: #FFFFFF;">Modul Pembelajaran</h3>
              <p style="font-size: 12.5px; color: #D5E3FF; margin: 0 0 16px 0; line-height: 1.5;">
                Pelajari materi terkait <strong style="color: #FFD859;">${escapeHtml(this.currentQuery)}</strong> melalui alur pembelajaran interaktif DJBC.
              </p>
              
              <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); border-radius: 10px; padding: 12px; margin-bottom: 16px; border: 1px solid rgba(255, 255, 255, 0.15);">
                <div style="font-size: 11px; font-weight: 700; color: #FFD859; text-transform: uppercase;">Rekomendasi Modul</div>
                <div style="font-size: 13.5px; font-weight: 600; color: #FFFFFF; margin-top: 2px;">Dasar-Dasar Kepabeanan & Cukai</div>
              </div>

              <button id="btn-search-start-learning" style="width: 100%; padding: 10px; background: #FFD859; color: #001631; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                Mulai Belajar ➔
              </button>
            </div>

          </div>

        </div>
      </div>
    `;

    // Attach Event Listeners to rendered elements
    this.attachSearchPageEvents();
  }

  renderEmptySearchPage() {
    this.pageContainer.innerHTML = `
      <div style="max-width: 680px; margin: 60px auto; text-align: center; background: #FFFFFF; border-radius: 20px; border: 1px solid #D9E0E8; padding: 48px 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: #F0F9FF; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; font-size: 32px; color: #0284C7;">
          🔍
        </div>
        <h2 style="font-size: 24px; font-weight: 700; color: #062B52; margin: 0 0 10px 0;">Pencarian Struktur & Informasi DJBC</h2>
        <p style="font-size: 14.5px; color: #64748B; margin: 0 0 28px 0; line-height: 1.6;">
          Cari unit organisasi, direktorat, kantor wilayah, seksi, fungsi kerja, serta regulasi PMK terkait di lingkungan Direktorat Jenderal Bea dan Cukai.
        </p>

        <!-- Search Input Form -->
        <div style="position: relative; max-width: 480px; margin: 0 auto 24px auto;">
          <input 
            type="text" 
            id="page-search-input" 
            placeholder="Ketik kata kunci (contoh: impor, cukai, kanwil)..." 
            style="width: 100%; padding: 12px 20px 12px 46px; border-radius: 9999px; border: 1.5px solid #CBD5E1; font-size: 14px; color: #1E293B; outline: none; box-shadow: 0 2px 8px rgba(0,0,0,0.04);"
          />
          <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; color: #94A3B8;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        <!-- Suggestion Chips -->
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; align-items: center;">
          <span style="font-size: 12px; color: #94A3B8; font-weight: 600; margin-right: 4px;">Pencarian Populer:</span>
          ${['impor', 'ekspor', 'cukai', 'pengawasan', 'fasilitas', 'audit', 'jawa barat', 'blbc'].map(tag => `
            <button class="quick-tag-btn" data-query="${tag}" style="padding: 4px 12px; background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #0B3A6F; cursor: pointer; transition: all 0.15s;">
              ${tag}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.attachSearchPageEvents();
  }

  attachSearchPageEvents() {
    // In-page search input
    const pageInput = this.pageContainer.querySelector('#page-search-input');
    if (pageInput) {
      pageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const q = pageInput.value.trim();
          if (q) {
            if (this.input) this.input.value = q;
            this.renderSearchPage(q);
          }
        }
      });
    }

    // Clear search button
    const clearBtn = this.pageContainer.querySelector('#page-search-clear');
    if (clearBtn && pageInput) {
      clearBtn.addEventListener('click', () => {
        pageInput.value = '';
        if (this.input) this.input.value = '';
        this.renderEmptySearchPage();
      });
    }

    // Sort select
    const sortSelect = this.pageContainer.querySelector('#search-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderSearchPage(this.currentQuery);
      });
    }

    // Filter chips
    const filterChips = this.pageContainer.querySelectorAll('.search-filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.activeFilter = chip.getAttribute('data-filter') || 'all';
        this.renderSearchPage(this.currentQuery);
      });
    });

    // Quick tag buttons
    const tagBtns = this.pageContainer.querySelectorAll('.quick-tag-btn');
    tagBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-query');
        if (q) {
          if (this.input) this.input.value = q;
          this.renderSearchPage(q);
        }
      });
    });

    // "Buka di Struktur" buttons
    const treeBtns = this.pageContainer.querySelectorAll('.btn-open-tree');
    treeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const unitId = btn.getAttribute('data-unit-id');
        if (unitId && this.onOpenInTree) {
          this.onOpenInTree(unitId);
        }
      });
    });

    // "Detail" buttons
    const detailBtns = this.pageContainer.querySelectorAll('.btn-open-detail');
    detailBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const unitId = btn.getAttribute('data-unit-id');
        if (unitId && this.onOpenDetail) {
          this.onOpenDetail(unitId);
        } else if (unitId && this.onSelectResult) {
          this.onSelectResult(unitId);
        }
      });
    });

    // "Mulai Belajar" promo button
    const learnBtn = this.pageContainer.querySelector('#btn-search-start-learning');
    if (learnBtn && this.onOpenView) {
      learnBtn.addEventListener('click', () => {
        this.onOpenView('view-learning');
      });
    }
  }
}


/* --- map.js --- */

/**
 * map.js — Interactive Indonesia Map Engine (MapLibre GL JS Edition).
 * Basemap: Pure GeoJSON (province_geo.json / 38 Provinces).
 * Master Point Layer: customs-offices-djbc-136.json + Kantor Pusat DJBC (137 Offices).
 *
 * Features:
 * - 100% Offline & file:// protocol compatible (no external tile server required)
 * - Pure GeoJSON vector rendering with WebGL GPU acceleration
 * - Choropleth Kanwil regions (province-fill, province-line, province-hover-fill)
 * - Native WebGL Point Layers for all 137 offices (pulse halo, crisp solid dot with white/gold stroke)
 * - Instant GPU-powered filtering via map.setFilter for filter pills (Semua, Kanwil, KPU, KPPBC, UPT) & Islands
 * - Interactive Office Tooltips: official name, category badge, city, province, official street address, coordinates, side panel link
 * - Interactive Province Tooltips: Kanwil name, CR code, headquarter city, subordinate office count
 * - focusOnUnit() smooth flyTo animation from side panel "Lihat lokasi pada peta" button
 * - Responsive zoom controls, legend, and live statistics bar
 */



class IndonesiaMapEngine {
  constructor(containerEl, unitsDict, kanwilMapping, onSelectUnit, onOpenPanel) {
    this.container = containerEl;
    this.unitsDict = unitsDict || {};
    this.kanwilMapping = kanwilMapping || {};
    this.onSelectUnit = onSelectUnit;
    this.onOpenPanel = onOpenPanel;

    this.provinceGeoData = null;
    this.officesGeoData = null;
    this.currentIslandFilter = 'all';
    this.currentTypeFilter = 'all';

    this.map = null;
    this.activePopup = null;
    this.pinnedUnitId = null;
    this._hasInteracted = false;
    this._resizeObserver = null;

    this.ISLAND_BOUNDS = {
      'Sumatera':           [[94.0, -6.0],   [108.5,  6.0]],
      'Jawa':               [[105.0, -8.8],  [114.6, -5.8]],
      'Kalimantan':         [[107.5, -4.5],  [119.2,  4.5]],
      'Sulawesi':           [[118.5, -5.8],  [125.8,  2.0]],
      'Bali-Nusa Tenggara': [[114.3, -10.5], [125.5, -8.0]],
      'Maluku':             [[124.0, -9.0],  [135.0,  3.5]],
      'Papua':              [[130.0, -9.5],  [141.2,  0.0]],
    };
    this.INDONESIA_BOUNDS = [[94.5, -11.0], [141.2, 6.0]];

    this.CAT = {
      'kantor-pusat': { color: '#062B52', label: 'Kantor Pusat DJBC',         size: 18, border: '#D9B45B' },
      'kanwil':       { color: '#0284C7', label: 'Kantor Wilayah',            size: 14, border: '#FFFFFF' },
      'kpu':          { color: '#D97706', label: 'Kantor Pelayanan Utama',    size: 16, border: '#FFFFFF' },
      'kppbc':        { color: '#0B3A6F', label: 'Kantor Pengawasan & Pelayanan', size: 10, border: '#FFFFFF' },
      'blbc':         { color: '#10B981', label: 'Balai Laboratorium BC',     size: 14, border: '#FFFFFF' },
      'pso':          { color: '#EF4444', label: 'Pangkalan Sarana Operasi',  size: 14, border: '#FFFFFF' },
    };

    this.initUI();
  }

  // ─── Data setters ─────────────────────────────────────────────────────────

  setGeoData(data) {
    // Retained for backward compatibility
  }

  setProvinceGeoData(geojson) {
    this.provinceGeoData = geojson;
    if (this.map && this.map.loaded() && geojson) {
      this._addChoroplethLayer(geojson);
    }
  }

  setOfficesGeoData(geojson) {
    this.officesGeoData = geojson;
    if (this.map && this.map.loaded() && geojson) {
      this._addOfficesLayer(geojson);
    }
  }

  setKanwilMapping(m) { this.kanwilMapping = m || {}; }
  setUnitsDict(d) { this.unitsDict = d || {}; }

  // ─── UI Shell ─────────────────────────────────────────────────────────────

  initUI() {
    this.container.innerHTML = `
      <div class="map-page-wrapper" style="height:100%;display:flex;flex-direction:column;background:#EEF2F7;overflow:hidden;position:relative;font-family:'Poppins',sans-serif;">

        <header class="map-controls-bar">
          <div class="map-controls-left">
            <div class="map-filter-group-row">
              <span class="map-filter-heading">Filter Tipe Kantor:</span>
              <div id="map-pill-filters">
                <button class="map-filter-pill active" data-type="all"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#38BDF8;"></span>Semua (137)</button>
                <button class="map-filter-pill" data-type="kanwil"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#0284C7;"></span>Kanwil (21)</button>
                <button class="map-filter-pill" data-type="kpu"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#D97706;"></span>KPU (3)</button>
                <button class="map-filter-pill" data-type="kppbc"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#0B3A6F;"></span>KPPBC (104)</button>
                <button class="map-filter-pill" data-type="upt"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#059669;"></span>UPT (9)</button>
              </div>
            </div>
            <div class="map-controls-divider"></div>
            <div class="map-island-filter-wrap">
              <span class="map-island-icon">🏝️</span>
              <select id="map-filter-island" title="Pilih Wilayah / Pulau di Indonesia">
                <option value="all">Seluruh Wilayah Indonesia</option>
                <option value="Sumatera">Sumatera</option>
                <option value="Jawa">Jawa</option>
                <option value="Kalimantan">Kalimantan</option>
                <option value="Sulawesi">Sulawesi</option>
                <option value="Bali-Nusa Tenggara">Bali &amp; Nusa Tenggara</option>
                <option value="Maluku">Maluku</option>
                <option value="Papua">Papua</option>
              </select>
            </div>
          </div>
        </header>

        <div id="map-canvas-viewport" style="flex:1;position:relative;overflow:hidden;">
          <div id="maplibre-container" style="width:100%;height:100%;"></div>

          <!-- Floating Help / Guide Button directly on Map Canvas (Top Right) -->
          <button id="map-help-toggle-btn" class="floating-help-btn" style="position:absolute;top:16px;right:16px;z-index:25;" title="Buka / Tutup Panduan Peta" type="button">
            <span class="help-btn-icon">💡</span>
            <span>Panduan</span>
          </button>

          <!-- Floating Zoom Controls Widget (Bottom Left on Map Canvas above maplibregl-ctrl-bottom-left) -->
          <div class="map-floating-zoom-ctrl" style="position:absolute;bottom:56px;left:20px;display:flex;flex-direction:column;align-items:center;gap:3px;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid #D9E0E8;border-radius:10px;padding:4px;box-shadow:0 4px 18px rgba(6,43,82,0.12);z-index:25;">
            <button id="map-btn-zoom-in" style="width:32px;height:32px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#334155;transition:all 0.15s;" title="Perbesar (Zoom In)">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            </button>
            <div style="width:18px;height:1px;background:#E2E8F0;"></div>
            <button id="map-btn-zoom-out" style="width:32px;height:32px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#334155;transition:all 0.15s;" title="Perkecil (Zoom Out)">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M20 12H4"/></svg>
            </button>
            <div style="width:18px;height:1px;background:#E2E8F0;"></div>
            <button id="map-btn-zoom-reset" style="width:32px;height:32px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#334155;transition:all 0.15s;" title="Reset ke Seluruh Indonesia">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8m-4-4h8"/></svg>
            </button>
            <div style="width:18px;height:1px;background:#E2E8F0;"></div>
            <span id="map-zoom-label" style="font-size:10.5px;font-weight:700;color:#64748B;padding:2px 4px;min-width:32px;text-align:center;">z5</span>
          </div>

          <!-- Interactive Clickable Map Legend (Two-Way Synchronized Filter) -->
          <div id="map-legend-card" class="map-legend-card" style="position:absolute;bottom:24px;right:24px;background:rgba(255,255,255,0.96);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid #D9E0E8;border-radius:12px;padding:12px 14px;box-shadow:0 4px 20px rgba(6,43,82,0.1);z-index:25;min-width:215px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #F1F5F9;">
              <div style="font-size:12px;font-weight:700;color:#062B52;display:flex;align-items:center;gap:6px;">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
                Legenda Peta
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:10px;color:#94A3B8;font-weight:500;">Filter Interaktif</span>
                <button id="map-legend-close-btn" class="map-legend-close-btn" style="width:22px;height:22px;border-radius:5px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748B;transition:all 0.15s;" title="Tutup Legenda Peta">
                  <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div class="map-legend-items-list" style="display:flex;flex-direction:column;gap:3px;font-size:11.5px;color:#475569;font-weight:500;">
              <div class="map-legend-item active" data-type="all" title="Tampilkan Seluruh Tipe Kantor">
                <div style="display:flex;align-items:center;gap:7px;">
                  <span style="width:10px;height:10px;border-radius:50%;background:#38BDF8;display:inline-block;flex-shrink:0;"></span>
                  <span>Semua Tipe</span>
                </div>
                <span class="legend-badge-count" data-count="all" style="font-size:10.5px;font-weight:700;color:#64748B;">137</span>
              </div>
              <div class="map-legend-item" data-type="kanwil" title="Filter Kantor Wilayah &amp; Kantor Pusat">
                <div style="display:flex;align-items:center;gap:7px;">
                  <span style="width:10px;height:10px;border-radius:50%;background:#0284C7;border:2px solid #FFF;box-shadow:0 0 0 1px #0284C7;display:inline-block;flex-shrink:0;"></span>
                  <span>Kantor Wilayah &amp; Pusat</span>
                </div>
                <span class="legend-badge-count" data-count="kanwil" style="font-size:10.5px;font-weight:700;color:#64748B;">21</span>
              </div>
              <div class="map-legend-item" data-type="kpu" title="Filter Kantor Pelayanan Utama">
                <div style="display:flex;align-items:center;gap:7px;">
                  <span style="width:10px;height:10px;border-radius:50%;background:#D97706;border:2px solid #FFF;box-shadow:0 0 0 1px #D97706;display:inline-block;flex-shrink:0;"></span>
                  <span>Kantor Pelayanan Utama</span>
                </div>
                <span class="legend-badge-count" data-count="kpu" style="font-size:10.5px;font-weight:700;color:#64748B;">3</span>
              </div>
              <div class="map-legend-item" data-type="kppbc" title="Filter KPPBC Pelayanan &amp; Pengawasan">
                <div style="display:flex;align-items:center;gap:7px;">
                  <span style="width:9px;height:9px;border-radius:50%;background:#0B3A6F;border:2px solid #FFF;box-shadow:0 0 0 1px #0B3A6F;display:inline-block;flex-shrink:0;"></span>
                  <span>Kantor Pengawasan (KPPBC)</span>
                </div>
                <span class="legend-badge-count" data-count="kppbc" style="font-size:10.5px;font-weight:700;color:#64748B;">104</span>
              </div>
              <div class="map-legend-item" data-type="blbc" title="Filter Balai Laboratorium Bea Cukai">
                <div style="display:flex;align-items:center;gap:7px;">
                  <span style="width:10px;height:10px;border-radius:50%;background:#10B981;border:2px solid #FFF;box-shadow:0 0 0 1px #10B981;display:inline-block;flex-shrink:0;"></span>
                  <span>Balai Lab Bea Cukai (BLBC)</span>
                </div>
                <span class="legend-badge-count" data-count="blbc" style="font-size:10.5px;font-weight:700;color:#64748B;">3</span>
              </div>
              <div class="map-legend-item" data-type="pso" title="Filter Pangkalan Sarana Operasi">
                <div style="display:flex;align-items:center;gap:7px;">
                  <span style="width:10px;height:10px;border-radius:50%;background:#EF4444;border:2px solid #FFF;box-shadow:0 0 0 1px #EF4444;display:inline-block;flex-shrink:0;"></span>
                  <span>Pangkalan Sarana Operasi (PSO)</span>
                </div>
                <span class="legend-badge-count" data-count="pso" style="font-size:10.5px;font-weight:700;color:#64748B;">6</span>
              </div>
            </div>
            <div style="margin-top:6px;padding-top:6px;border-top:1px solid #F1F5F9;font-size:10px;color:#94A3B8;text-align:center;">Klik item legenda untuk memfilter peta</div>
          </div>

          <!-- Floating Reopen Legend Toggle Button (visible when legend card is closed) -->
          <button id="map-legend-open-btn" class="map-legend-open-btn" style="display:none;position:absolute;bottom:24px;right:24px;background:rgba(255,255,255,0.96);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid #D9E0E8;border-radius:10px;padding:7px 12px;box-shadow:0 4px 18px rgba(6,43,82,0.12);z-index:25;cursor:pointer;font-size:12px;font-weight:600;color:#0B3A6F;align-items:center;gap:6px;transition:all 0.2s;" title="Buka Legenda Peta">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
            <span>Legenda Peta</span>
          </button>
        </div>

        <footer class="map-stats-bar">
          <div class="map-stat-item">
            <span id="stat-count-kanwil" class="map-stat-number" style="color:#0284C7;">21</span>
            <span class="map-stat-label">Kanwil &amp; Pusat</span>
          </div>
          <div class="map-stat-divider"></div>
          <div class="map-stat-item">
            <span id="stat-count-kpu" class="map-stat-number" style="color:#D97706;">3</span>
            <span class="map-stat-label">KPU Bea Cukai</span>
          </div>
          <div class="map-stat-divider"></div>
          <div class="map-stat-item">
            <span id="stat-count-kppbc" class="map-stat-number" style="color:#0B3A6F;">104</span>
            <span class="map-stat-label">KPPBC Pelayanan</span>
          </div>
          <div class="map-stat-divider"></div>
          <div class="map-stat-item">
            <span id="stat-count-upt" class="map-stat-number" style="color:#059669;">9</span>
            <span class="map-stat-label">UPT (BLBC &amp; PSO)</span>
          </div>
        </footer>

        <div id="map-unit-modal-overlay" class="modal-overlay" style="display:none;position:fixed;inset:0;background:rgba(6,43,82,0.45);backdrop-filter:blur(4px);z-index:120;align-items:center;justify-content:center;">
          <div class="modal-container" style="background:#FFF;border-radius:16px;width:90%;max-width:540px;box-shadow:0 20px 40px rgba(0,0,0,0.2);overflow:hidden;border:1px solid #D9E0E8;animation:modalPopIn 0.25s ease-out;">
            <div style="padding:20px 24px;background:linear-gradient(135deg,#062B52 0%,#0B3A6F 100%);color:#FFF;display:flex;justify-content:space-between;align-items:flex-start;">
              <div>
                <span id="map-modal-badge" style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:9999px;background:#D9B45B;color:#062B52;text-transform:uppercase;letter-spacing:0.05em;">KANWIL</span>
                <h3 id="map-modal-title" style="font-size:18px;font-weight:700;margin-top:6px;color:#FFF;line-height:1.3;">Nama Unit</h3>
                <div id="map-modal-location" style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:4px;">-</div>
              </div>
              <button id="map-modal-close" style="background:rgba(255,255,255,0.15);border:none;color:#FFF;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">&times;</button>
            </div>
            <div style="padding:24px;max-height:360px;overflow-y:auto;">
              <div style="margin-bottom:18px;">
                <div style="font-size:11.5px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Tugas Pokok</div>
                <div id="map-modal-tugas" style="font-size:13px;color:#1E293B;line-height:1.5;">Melaksanakan koordinasi, bimbingan teknis, pengendalian, evaluasi dan pelaksanaan tugas kepabeanan dan cukai.</div>
              </div>
              <div>
                <div id="map-modal-sub-label" style="font-size:11.5px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Unit Bawahan</div>
                <div id="map-modal-kppbc-list" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
              </div>
            </div>
            <div style="padding:16px 24px;background:#F8FAFC;border-top:1px solid #E2E8F0;display:flex;justify-content:flex-end;gap:12px;">
              <button id="map-modal-cancel-btn" style="padding:8px 16px;border-radius:8px;border:1px solid #CBD5E1;background:#FFF;color:#475569;font-size:13px;font-weight:600;cursor:pointer;">Tutup</button>
              <button id="map-modal-explore-btn" style="padding:8px 18px;border-radius:8px;border:none;background:#0284C7;color:#FFF;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 2px 6px rgba(2,132,199,0.3);">Eksplorasi di Pohon Organisasi &rarr;</button>
            </div>
          </div>
        </div>

      </div>
    `;

    // Filter pills (Header)
    this.container.querySelectorAll('.map-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        this.setTypeFilter(type);
      });
    });

    // Map Legend Items (Clickable Interactive Filter with Two-Way Synchronization)
    this.container.querySelectorAll('.map-legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type');
        const newType = (this.currentTypeFilter === type && type !== 'all') ? 'all' : type;
        this.setTypeFilter(newType);
      });
    });

    // Island dropdown → fitBounds on MapLibre map & dynamic stats update
    this.container.querySelector('#map-filter-island').addEventListener('change', (e) => {
      this.currentIslandFilter = e.target.value;
      if (this.map) {
        if (e.target.value === 'all') {
          this.fitIndonesia(800);
        } else if (this.ISLAND_BOUNDS[e.target.value]) {
          this.map.fitBounds(this.ISLAND_BOUNDS[e.target.value], { padding: 40, duration: 800 });
        }
      }
      this._applyLayersFilter();
      this.updateStats();
    });

    // Floating Help / Guide Button on Map Canvas
    const mapHelpBtn = this.container.querySelector('#map-help-toggle-btn');
    if (mapHelpBtn) {
      mapHelpBtn.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        if (window.app && typeof window.app.toggleHelpTip === 'function') {
          window.app.toggleHelpTip('map');
        }
      });
    }

    // Legend Close & Reopen Toggle Buttons
    const legendCard = this.container.querySelector('#map-legend-card');
    const legendCloseBtn = this.container.querySelector('#map-legend-close-btn');
    const legendOpenBtn = this.container.querySelector('#map-legend-open-btn');

    if (legendCloseBtn && legendCard && legendOpenBtn) {
      legendCloseBtn.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        legendCard.style.display = 'none';
        legendOpenBtn.style.display = 'flex';
      });

      legendOpenBtn.addEventListener('click', (e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
        legendCard.style.display = 'block';
        legendOpenBtn.style.display = 'none';
      });
    }

    // Floating Zoom controls
    this.container.querySelector('#map-btn-zoom-in').addEventListener('click', () => {
      this._hasInteracted = true;
      if (this.map) this.map.zoomIn();
    });
    this.container.querySelector('#map-btn-zoom-out').addEventListener('click', () => {
      this._hasInteracted = true;
      if (this.map) this.map.zoomOut();
    });
    this.container.querySelector('#map-btn-zoom-reset').addEventListener('click', () => {
      this.currentIslandFilter = 'all';
      const isl = this.container.querySelector('#map-filter-island');
      if (isl) isl.value = 'all';
      this.fitIndonesia(800);
      this._applyLayersFilter();
      this.updateStats();
    });

    // Modal close handlers
    const overlay = this.container.querySelector('#map-unit-modal-overlay');
    const closeModal = () => { overlay.style.display = 'none'; };
    this.container.querySelector('#map-modal-close').addEventListener('click', closeModal);
    this.container.querySelector('#map-modal-cancel-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    this.updateStats();
    this._initMapLibre();
  }

  /**
   * Centralized filter setter that guarantees two-way synchronization between Header Pills & Map Legend.
   */
  setTypeFilter(type) {
    this.currentTypeFilter = type || 'all';

    // 1. Synchronize Header Pills
    this.container.querySelectorAll('.map-filter-pill').forEach(b => {
      const bType = b.getAttribute('data-type');
      if (this.currentTypeFilter === 'blbc' || this.currentTypeFilter === 'pso') {
        b.classList.toggle('active', bType === 'upt');
      } else {
        b.classList.toggle('active', bType === this.currentTypeFilter);
      }
    });

    // 2. Synchronize Map Legend Items
    this.container.querySelectorAll('.map-legend-item').forEach(item => {
      const itemType = item.getAttribute('data-type');
      if (this.currentTypeFilter === 'upt') {
        item.classList.toggle('active', itemType === 'upt' || itemType === 'blbc' || itemType === 'pso');
      } else {
        item.classList.toggle('active', itemType === this.currentTypeFilter);
      }
    });

    // 3. Apply GPU Layer Filter & Dynamic Stats
    this._applyLayersFilter();
    this.updateStats();
  }

  // ─── MapLibre Init ────────────────────────────────────────────────────────

  _initMapLibre() {
    if (typeof maplibregl === 'undefined') {
      console.error('MapLibre GL JS not loaded. Add <script src="assets/lib/maplibre-gl.js"> before bundle.js in index.html.');
      return;
    }
    const mapEl = this.container.querySelector('#maplibre-container');
    if (!mapEl) return;

    // Minimal blank style: ocean background, no external tile server → file:// compatible
    const style = {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {},
      layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#C8DDF0' } }]
    };

    this.map = new maplibregl.Map({
      container: mapEl,
      style,
      center: [118.0, -2.5],
      zoom: 4.8,
      minZoom: 3.5,
      maxZoom: 16,
      renderWorldCopies: false,
      attributionControl: false,
    });

    this.map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    this.map.addControl(new maplibregl.ScaleControl({ maxWidth: 120 }), 'bottom-left');

    this.map.on('zoom', () => {
      const zl = this.container.querySelector('#map-zoom-label');
      if (zl && this.map) zl.textContent = 'z' + Math.round(this.map.getZoom());
    });

    this.map.on('dragstart', () => { this._hasInteracted = true; });
    this.map.on('zoomstart', (e) => { if (e && e.originalEvent) this._hasInteracted = true; });

    this.map.on('load', () => {
      // 1. Province choropleth
      const pgd = this.provinceGeoData || window.DATA_PROVINCE_GEO;
      if (pgd) { this.provinceGeoData = pgd; this._addChoroplethLayer(pgd); }

      // 2. Customs Offices Master Point Layer
      const ogd = this.officesGeoData || window.DATA_OFFICES_GEO;
      if (ogd) { this.officesGeoData = ogd; this._addOfficesLayer(ogd); }

      this.onViewActivated();
    });

    // Setup ResizeObserver to adapt to container layout changes
    if (typeof ResizeObserver !== 'undefined' && mapEl) {
      this._resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 100 && entry.contentRect.height > 100) {
            if (this.map && this.map.loaded()) {
              this.map.resize();
              if (!this._hasInteracted) {
                this.fitIndonesia(0);
              }
            }
          }
        }
      });
      this._resizeObserver.observe(mapEl);
    }

    // Unpin tooltip when clicking blank map background (outside province polygons or office circles)
    this.map.on('click', (e) => {
      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      const officeFeatures = this.map.queryRenderedFeatures(bbox, { layers: ['office-circle'] });
      const provFeatures = this.map.queryRenderedFeatures(bbox, { layers: ['province-fill'] });
      if (officeFeatures.length === 0 && provFeatures.length === 0 && this.activePopup && this.pinnedUnitId) {
        this._unpinActivePopup();
      }
    });
  }

  onViewActivated() {
    if (!this.map) return;
    this.map.resize();
    if (!this._hasInteracted) {
      this.fitIndonesia(0);
    }
    this._applyLayersFilter();
    this.updateStats();
    this._startPulseAnimation();
  }


  fitIndonesia(duration = 600) {
    if (this.map) {
      try {
        this.map.fitBounds(this.INDONESIA_BOUNDS, {
          padding: { top: 30, bottom: 30, left: 30, right: 30 },
          maxZoom: 5.2,
          duration: duration || 0
        });
      } catch (err) {
        console.warn('fitBounds:', err);
      }
    }
  }

  // ─── Choropleth Province Layer & Region Click Tooltip ──────────────────────

  _addChoroplethLayer(geojson) {
    if (!this.map) return;
    ['province-hover-fill', 'province-line', 'province-fill'].forEach(id => {
      if (this.map.getLayer(id)) this.map.removeLayer(id);
    });
    if (this.map.getSource('provinces')) this.map.removeSource('provinces');

    this.map.addSource('provinces', { type: 'geojson', data: geojson, generateId: true });
    this.map.addLayer({ id: 'province-fill', type: 'fill', source: 'provinces', paint: { 'fill-color': ['get', 'fill_color'], 'fill-opacity': 0.28 } });
    this.map.addLayer({ id: 'province-line', type: 'line', source: 'provinces', paint: { 'line-color': '#FFFFFF', 'line-width': 0.8, 'line-opacity': 0.6 } });
    this.map.addLayer({ id: 'province-hover-fill', type: 'fill', source: 'provinces', paint: { 'fill-color': ['get', 'fill_color'], 'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 0] } });

    let hoveredId = null;
    this.map.on('mousemove', 'province-fill', (e) => {
      // Only show pointer if not over an office point
      const bbox = [[e.point.x - 4, e.point.y - 4], [e.point.x + 4, e.point.y + 4]];
      const officeFeats = this.map.queryRenderedFeatures(bbox, { layers: ['office-circle'] });
      if (officeFeats.length > 0) return;

      if (e.features.length > 0) {
        if (hoveredId !== null) this.map.setFeatureState({ source: 'provinces', id: hoveredId }, { hover: false });
        hoveredId = e.features[0].id;
        if (hoveredId !== null) this.map.setFeatureState({ source: 'provinces', id: hoveredId }, { hover: true });
        this.map.getCanvas().style.cursor = 'pointer';
      }
    });
    this.map.on('mouseleave', 'province-fill', () => {
      if (hoveredId !== null) this.map.setFeatureState({ source: 'provinces', id: hoveredId }, { hover: false });
      hoveredId = null;
      this.map.getCanvas().style.cursor = '';
    });

    // Interactive Region Click: Show Region Tooltip and toggle Side Panel when clicking a Kanwil Province Area
    this.map.on('click', 'province-fill', (e) => {
      // Ignore if clicking on an office circle
      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      const officeFeats = this.map.queryRenderedFeatures(bbox, { layers: ['office-circle'] });
      if (officeFeats.length > 0) return;

      if (e.features && e.features.length > 0) {
        const feat = e.features[0];
        const crId = feat.properties.customs_region_id || 'CR';
        const kanwilId = this._resolveKanwilIdByCr(crId, feat.properties.province_code);
        const kanwilUnit = kanwilId ? (this.unitsDict[kanwilId] || { id: kanwilId, nama: feat.properties.customs_region }) : null;
        const pinnedKey = 'region-' + (feat.properties.province_code || crId);

        if (this.pinnedUnitId === pinnedKey) {
          this._unpinActivePopup();
          if (this.onOpenPanel) {
            this.onOpenPanel(null);
          }
        } else {
          this._showRegionPopup(feat.properties, [e.lngLat.lng, e.lngLat.lat]);
          if (kanwilUnit && this.onOpenPanel) {
            this.onOpenPanel(kanwilUnit);
          }
        }
      }
    });
  }

  // ─── Native WebGL Offices Point Layer ─────────────────────────────────────

  _addOfficesLayer(geojson) {
    if (!this.map) return;
    ['office-circle-hover', 'office-circle', 'office-pulse'].forEach(id => {
      if (this.map.getLayer(id)) this.map.removeLayer(id);
    });
    if (this.map.getSource('offices')) this.map.removeSource('offices');

    this.map.addSource('offices', { type: 'geojson', data: geojson, generateId: true });

    // 1. Dual-Wave Animated Pulse Layers
    this.map.addLayer({
      id: 'office-pulse-1',
      type: 'circle',
      source: 'offices',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          4, ['*', ['get', 'radius'], 1.2],
          8, ['*', ['get', 'radius'], 1.5],
          12, ['*', ['get', 'radius'], 1.8]
        ],
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.35
      }
    });

    this.map.addLayer({
      id: 'office-pulse-2',
      type: 'circle',
      source: 'offices',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          4, ['*', ['get', 'radius'], 1.5],
          8, ['*', ['get', 'radius'], 1.9],
          12, ['*', ['get', 'radius'], 2.4]
        ],
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.2
      }
    });

    // 2. Main Solid Office Circle Layer
    this.map.addLayer({
      id: 'office-circle',
      type: 'circle',
      source: 'offices',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          4, ['get', 'radius'],
          8, ['*', ['get', 'radius'], 1.25],
          12, ['*', ['get', 'radius'], 1.6]
        ],
        'circle-color': ['get', 'color'],
        'circle-stroke-color': ['get', 'stroke_color'],
        'circle-stroke-width': [
          'interpolate', ['linear'], ['zoom'],
          4, 1.8,
          8, 2.2,
          12, 2.8
        ],
        'circle-opacity': 0.95
      }
    });

    this._startPulseAnimation();


    // Mouse Events for Office Circles
    this.map.on('mouseenter', 'office-circle', (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        const feat = e.features[0];
        if (this.pinnedUnitId === feat.properties.id) return;
        this._showOfficePopup(feat.properties, [feat.geometry.coordinates[0], feat.geometry.coordinates[1]], false);
      }
    });

    this.map.on('mouseleave', 'office-circle', () => {
      this.map.getCanvas().style.cursor = '';
      if (this.activePopup && !this.pinnedUnitId) {
        this.activePopup.remove();
        this.activePopup = null;
      }
    });

    this.map.on('click', 'office-circle', (e) => {
      if (e.features && e.features.length > 0) {
        const feat = e.features[0];
        const props = feat.properties;
        const coords = [feat.geometry.coordinates[0], feat.geometry.coordinates[1]];
        const unitId = props.id;
        const unit = (unitId && this.unitsDict[unitId]) ? this.unitsDict[unitId] : props;

        if (this.pinnedUnitId === unitId) {
          this._unpinActivePopup();
          if (this.onOpenPanel) {
            this.onOpenPanel(null);
          }
        } else {
          this._showOfficePopup(props, coords, true);
          if (this.onOpenPanel) {
            this.onOpenPanel(unit);
          }
        }
      }
    });

    this._applyLayersFilter();
  }

  // ─── GPU-Accelerated Dynamic Filter ───────────────────────────────────────

  _applyLayersFilter() {
    this.updateStats();

    if (!this.map || !this.map.getLayer('office-circle')) return;

    const filters = ['all'];

    // Category filter
    const f = this.currentTypeFilter;
    if (f === 'kanwil' || f === 'kantor-pusat') {
      filters.push(['in', ['get', 'unitCategory'], ['literal', ['kantor-pusat', 'kanwil']]]);
    } else if (f === 'kpu') {
      filters.push(['==', ['get', 'unitCategory'], 'kpu']);
    } else if (f === 'kppbc') {
      filters.push(['==', ['get', 'unitCategory'], 'kppbc']);
    } else if (f === 'upt') {
      filters.push(['in', ['get', 'unitCategory'], ['literal', ['blbc', 'pso']]]);
    } else if (f === 'blbc') {
      filters.push(['==', ['get', 'unitCategory'], 'blbc']);
    } else if (f === 'pso') {
      filters.push(['==', ['get', 'unitCategory'], 'pso']);
    }

    // Island filter
    if (this.currentIslandFilter !== 'all') {
      filters.push(['==', ['get', 'pulau'], this.currentIslandFilter]);
    }

    const filterExpr = filters.length > 1 ? filters : null;
    ['office-circle', 'office-pulse-1', 'office-pulse-2'].forEach(id => {
      if (this.map.getLayer(id)) this.map.setFilter(id, filterExpr);
    });
  }

  // ─── Pulse Animation Loop ─────────────────────────────────────────────────

  _startPulseAnimation() {
    if (this._pulseAnimFrame) cancelAnimationFrame(this._pulseAnimFrame);
    const DURATION = 2400; // ms per pulse cycle

    const animate = (timestamp) => {
      if (!this.map || !this.map.getLayer('office-pulse-1')) {
        this._pulseAnimFrame = requestAnimationFrame(animate);
        return;
      }

      const t = timestamp || performance.now();
      const p1 = (t % DURATION) / DURATION;
      const p2 = ((t + (DURATION / 2)) % DURATION) / DURATION;

      // Pulse 1
      const rMult1 = 1 + p1 * 1.6;
      const op1 = Math.max(0, (1 - p1) * 0.45);

      // Pulse 2 (offset)
      const rMult2 = 1 + p2 * 1.6;
      const op2 = Math.max(0, (1 - p2) * 0.45);

      try {
        this.map.setPaintProperty('office-pulse-1', 'circle-radius', [
          'interpolate', ['linear'], ['zoom'],
          4, ['*', ['get', 'radius'], rMult1],
          8, ['*', ['*', ['get', 'radius'], 1.25], rMult1],
          12, ['*', ['*', ['get', 'radius'], 1.6], rMult1]
        ]);
        this.map.setPaintProperty('office-pulse-1', 'circle-opacity', op1);

        if (this.map.getLayer('office-pulse-2')) {
          this.map.setPaintProperty('office-pulse-2', 'circle-radius', [
            'interpolate', ['linear'], ['zoom'],
            4, ['*', ['get', 'radius'], rMult2],
            8, ['*', ['*', ['get', 'radius'], 1.25], rMult2],
            12, ['*', ['*', ['get', 'radius'], 1.6], rMult2]
          ]);
          this.map.setPaintProperty('office-pulse-2', 'circle-opacity', op2);
        }
      } catch (err) {
        // Safe ignore during style reloads
      }

      this._pulseAnimFrame = requestAnimationFrame(animate);
    };

    this._pulseAnimFrame = requestAnimationFrame(animate);
  }

  _stopPulseAnimation() {
    if (this._pulseAnimFrame) {
      cancelAnimationFrame(this._pulseAnimFrame);
      this._pulseAnimFrame = null;
    }
  }


  // ─── Interactive Region Click Popup (Kanwil Region Tooltip) ───────────────

  _showRegionPopup(props, lngLat) {
    if (this.activePopup) { this.activePopup.remove(); this.activePopup = null; }

    const provName = props.province_name || props.PROVINSI || props.NAME_1 || 'Provinsi Indonesia';
    const kanwilName = props.customs_region || 'Wilayah Bea dan Cukai';
    const crId = props.customs_region_id || 'CR';
    const kanwilLoc = props.kanwil_location || '-';
    const fillColor = props.fill_color || '#0284C7';
    const mappingStatus = props.mapping_status || '';

    const kanwilId = this._resolveKanwilIdByCr(crId, props.province_code);
    const kanwilUnit = kanwilId ? (this.unitsDict[kanwilId] || { id: kanwilId, nama: kanwilName }) : null;
    const subs = kanwilId ? (this.kanwilMapping[kanwilId] || []) : [];

    const lat = lngLat[1]; const lng = lngLat[0];
    const coordText = `${lat > 0 ? lat.toFixed(3) + '° LU' : Math.abs(lat).toFixed(3) + '° LS'}, ${lng.toFixed(3)}° BT`;

    const statusBadge = mappingStatus === 'FULL_PROVINCE_WITH_KPU_EXCEPTION' 
      ? '<span style="font-size:9.5px;color:#FCD34D;background:rgba(217,119,6,0.2);padding:2px 6px;border-radius:4px;border:1px solid rgba(217,119,6,0.4);">Termasuk Yurisdiksi Khusus KPU</span>' 
      : (crId === 'MULTI' ? '<span style="font-size:9.5px;color:#93C5FD;background:rgba(2,132,199,0.2);padding:2px 6px;border-radius:4px;border:1px solid rgba(2,132,199,0.4);">2 Wilayah Kerja Kanwil (Jatim I & II)</span>' : '');

    const html = `
      <div style="min-width:235px;max-width:310px;font-family:'Poppins',sans-serif;padding:2px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;">
          <div style="font-size:13px;font-weight:700;color:#FFF;line-height:1.3;white-space:normal;">${provName}</div>
          <button id="mlgl-popup-close" class="map-tooltip-close-btn" title="Tutup" style="color:#FFFFFF;">&times;</button>
        </div>
        <div style="font-size:10.5px;color:#E2E8F0;margin-bottom:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="background:${fillColor};color:#FFF;font-weight:700;font-size:9px;padding:2px 6px;border-radius:4px;">${crId}</span>
          <span style="font-weight:600;color:#38BDF8;">${kanwilName}</span>
        </div>
        <div style="font-size:10px;color:#94A3B8;margin-bottom:6px;">
          <span>Kedudukan Kanwil: <strong style="color:#FFF;">${kanwilLoc}</strong></span>
          ${subs.length > 0 ? ` &bull; <strong style="color:#D9B45B;">${subs.length} KPPBC Bawahan</strong>` : ''}
        </div>
        ${statusBadge ? `<div style="margin-bottom:6px;">${statusBadge}</div>` : ''}
        <div style="font-size:10px;color:#E2E8F0;background:rgba(255,255,255,0.08);padding:4px 7px;border-radius:4px;border:1px solid rgba(255,255,255,0.12);margin-bottom:2px;">
          <span style="color:#38BDF8;">📍 Koordinat Titik:</span>
          <span style="font-family:monospace;color:#FFF;font-weight:600;"> ${coordText}</span>
        </div>
      </div>
    `;

    const popup = new maplibregl.Popup({
      closeButton: false, closeOnClick: false,
      className: 'djbc-map-popup', offset: 12, maxWidth: '330px'
    }).setLngLat(lngLat).setHTML(html).addTo(this.map);

    this.activePopup = popup;
    this.pinnedUnitId = 'region-' + (props.province_code || crId);

    setTimeout(() => {
      const cb = document.getElementById('mlgl-popup-close');
      if (cb) cb.addEventListener('click', (e) => { e.stopPropagation(); this._unpinActivePopup(); });
    }, 50);
  }

  _resolveKanwilIdByCr(crId, provinceCode) {
    const map = {
      'CR01': 'kanwil-aceh',
      'CR02': 'kanwil-sumut',
      'CR03': 'kanwil-riau',
      'CR04': 'kanwil-kepri',
      'CR05': 'kanwil-sumbagtim',
      'CR06': 'kanwil-sumbagbar',
      'CR07': 'kanwil-banten',
      'CR08': 'kanwil-jakarta',
      'CR09': 'kanwil-jabar',
      'CR10': 'kanwil-jateng-diy',
      'CR11': 'kanwil-jatim-i',
      'CR12': 'kanwil-jatim-ii',
      'CR13': 'kanwil-bali-ntb-ntt',
      'CR14': 'kanwil-kalbar',
      'CR15': 'kanwil-kalsel',
      'CR16': 'kanwil-kaltim',
      'CR17': 'kanwil-sulbagsel',
      'CR18': 'kanwil-sulbagut',
      'CR19': 'kanwil-maluku',
      'CR20': 'kanwil-papua'
    };
    if (crId === 'MULTI' && provinceCode === '35') {
      return 'kanwil-jatim-i';
    }
    return map[crId] || null;
  }

  // ─── Marker / Office Popup ────────────────────────────────────────────────

  _showOfficePopup(props, lngLat, pinned) {
    if (this.activePopup) { this.activePopup.remove(); this.activePopup = null; }

    const lat = props.lat; const lng = props.lng;
    const coordText = lat !== undefined
      ? `${lat > 0 ? lat + '\u00b0 LU' : Math.abs(lat) + '\u00b0 LS'}, ${lng}\u00b0 BT (${lat}, ${lng})`
      : 'Wilayah Indonesia';

    const locationText = props.lokasi ? `<div style="font-size:10.5px;color:#CBD5E1;margin-bottom:4px;">🏢 ${props.lokasi}</div>` : '';
    const addressText = props.address ? `<div style="font-size:9.5px;color:#94A3B8;margin-bottom:6px;line-height:1.35;font-style:italic;">${props.address}</div>` : '';
    const catLabel = props.category_label || this.CAT[props.unitCategory]?.label || 'Unit DJBC';
    const unitIcon = getUnitIcon(props, this.unitsDict);

    const html = `
      <div style="min-width:225px;max-width:300px;font-family:'Poppins',sans-serif;padding:2px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;">
          <div style="font-size:12.5px;font-weight:700;color:#FFF;line-height:1.3;white-space:normal;display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;flex-shrink:0;">${unitIcon}</span>
            <span>${props.nama}</span>
          </div>
          ${pinned ? '<button id="mlgl-popup-close" class="map-tooltip-close-btn" title="Tutup" style="color:#FFFFFF;">&times;</button>' : ''}
        </div>
        <div style="font-size:10px;color:#94A3B8;margin-bottom:4px;"><span style="color:#D9B45B;font-weight:600;">${catLabel}</span>${props.pulau ? ' &bull; ' + props.pulau : ''}</div>
        ${locationText}
        ${addressText}
        <div style="font-size:10px;color:#E2E8F0;background:rgba(255,255,255,0.08);padding:4px 7px;border-radius:4px;border:1px solid rgba(255,255,255,0.12);margin-bottom:2px;">
          <span style="color:#38BDF8;">📍 Koordinat:</span>
          <span style="font-family:monospace;color:#FFF;font-weight:600;"> ${coordText}</span>
        </div>
      </div>
    `;

    const popup = new maplibregl.Popup({
      closeButton: false, closeOnClick: false,
      className: 'djbc-map-popup', offset: 14, maxWidth: '310px'
    }).setLngLat(lngLat).setHTML(html).addTo(this.map);

    this.activePopup = popup;
    if (pinned) this.pinnedUnitId = props.id;

    setTimeout(() => {
      const cb = document.getElementById('mlgl-popup-close');
      if (cb) cb.addEventListener('click', (e) => { e.stopPropagation(); this._unpinActivePopup(); });
    }, 50);
  }

  _unpinActivePopup() {
    if (this.activePopup) { this.activePopup.remove(); this.activePopup = null; }
    this.pinnedUnitId = null;
  }

  // ─── focusOnUnit (called from side panel "Lihat lokasi di peta" button) ───

  focusOnUnit(unitOrId) {
    if (!unitOrId || !this.map) return;
    const unitId = typeof unitOrId === 'string' ? unitOrId : (unitOrId.id || '');

    // Search in offices GeoJSON
    const ogd = this.officesGeoData || window.DATA_OFFICES_GEO;
    let matchFeat = null;
    if (ogd && ogd.features) {
      matchFeat = ogd.features.find(f => f.properties.id === unitId || f.properties.unit_id === unitId);
      if (!matchFeat) {
        // Trace up hierarchy
        let curr = unitId;
        const visited = new Set();
        while (curr && !visited.has(curr)) {
          visited.add(curr);
          const u = this.unitsDict[curr];
          if (!u) break;
          matchFeat = ogd.features.find(f => f.properties.id === curr);
          if (matchFeat) break;
          curr = u.parent;
        }
      }
    }

    if (!matchFeat && ogd && ogd.features) {
      matchFeat = ogd.features[0]; // fallback to Kantor Pusat
    }

    if (!matchFeat) return;

    this._hasInteracted = true;
    const props = matchFeat.properties;
    const coords = matchFeat.geometry.coordinates;
    const isKppbc = props.unitCategory === 'kppbc';
    const filterType = isKppbc ? 'kppbc' : (props.unitCategory in ['blbc', 'pso'] ? 'upt' : (props.unitCategory === 'kpu' ? 'kpu' : 'kanwil'));

    this.currentTypeFilter = 'all'; // allow viewing in context
    this.container.querySelectorAll('.map-filter-pill').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-type') === 'all');
    });
    this.currentIslandFilter = 'all';
    const isl = this.container.querySelector('#map-filter-island');
    if (isl) isl.value = 'all';
    this._applyLayersFilter();

    const zoom = props.zoom || (isKppbc ? 11 : (props.unitCategory === 'kanwil' ? 8 : 10));
    this.map.flyTo({ center: coords, zoom, duration: 1200, essential: true });
    this.map.once('moveend', () => {
      this._showOfficePopup(props, coords, true);
    });
  }

  // ─── Detail Modal ─────────────────────────────────────────────────────────

  openUnitModal(item) {
    const overlay = this.container.querySelector('#map-unit-modal-overlay');
    if (!overlay) return;
    const ud = this.unitsDict[item.id] || {};
    const cfg = this.CAT[item.unitCategory] || this.CAT['kanwil'];

    this.container.querySelector('#map-modal-title').textContent = item.nama;
    const badge = this.container.querySelector('#map-modal-badge');
    badge.textContent = (item.category_label || cfg.label || item.unitCategory || 'Unit').toUpperCase();
    badge.style.background = cfg.color || '#D9B45B';
    badge.style.color = '#FFF';
    this.container.querySelector('#map-modal-location').textContent = `Wilayah: ${item.pulau || 'Indonesia'} \u2022 Koordinat: ${item.lat}, ${item.lng}`;
    this.container.querySelector('#map-modal-tugas').textContent = ud.tugas || 'Melaksanakan pelayanan, pengawasan, koordinasi teknis operasional, dan kepatuhan internal di bidang kepabeanan dan cukai.';

    const kl = this.container.querySelector('#map-modal-kppbc-list');
    kl.innerHTML = '';
    const sl = this.container.querySelector('#map-modal-sub-label');
    const subs = this.kanwilMapping[item.id] || ud.children || [];

    if (item.unitCategory === 'kanwil' && subs.length > 0) {
      sl.textContent = `Kantor Pengawasan (KPPBC) Bawahan (${subs.length} Unit):`;
      subs.forEach(kppbcId => {
        const u = this.unitsDict[kppbcId] || { nama: kppbcId };
        const chip = document.createElement('div');
        chip.style.cssText = 'padding:6px 12px;background:#F1F5F9;border-radius:6px;font-size:12px;font-weight:600;border:1px solid #CBD5E1;color:#062B52;cursor:pointer;transition:all 0.15s;';
        chip.textContent = u.nama || kppbcId;
        chip.addEventListener('mouseenter', () => { chip.style.background = '#E0F2FE'; chip.style.borderColor = '#0284C7'; chip.style.color = '#0284C7'; });
        chip.addEventListener('mouseleave', () => { chip.style.background = '#F1F5F9'; chip.style.borderColor = '#CBD5E1'; chip.style.color = '#062B52'; });
        chip.addEventListener('click', () => { overlay.style.display = 'none'; if (this.onSelectUnit) this.onSelectUnit(kppbcId); });
        kl.appendChild(chip);
      });
    } else {
      sl.textContent = 'Wilayah Kerja & Fasilitas:';
      kl.innerHTML = `<span style="font-size:12px;color:#64748B;">${item.address || 'Melayani kawasan pelabuhan, bandar udara, dan kawasan pabean di wilayah yurisdiksi.'}</span>`;
    }

    this.container.querySelector('#map-modal-explore-btn').onclick = () => {
      overlay.style.display = 'none';
      if (this.onSelectUnit) this.onSelectUnit(item.id);
    };
    overlay.style.display = 'flex';
  }

  // ─── Dynamic Office Stats per Island ──────────────────────────────────────

  updateStats() {
    const ogd = this.officesGeoData || (typeof window !== 'undefined' ? (window.DATA_OFFICES_GEO || window.__DJBC_OFFICES_GEO__) : null);
    const features = (ogd && ogd.features) ? ogd.features : [];

    const selectedIsland = this.currentIslandFilter || 'all';
    const filteredFeatures = selectedIsland === 'all'
      ? features
      : features.filter(f => f.properties && f.properties.pulau === selectedIsland);

    let countKanwil = 0;
    let countKpu = 0;
    let countKppbc = 0;
    let countUpt = 0;
    let countBlbc = 0;
    let countPso = 0;

    filteredFeatures.forEach(f => {
      const cat = f.properties ? f.properties.unitCategory : '';
      if (cat === 'kanwil' || cat === 'kantor-pusat') countKanwil++;
      else if (cat === 'kpu') countKpu++;
      else if (cat === 'kppbc') countKppbc++;
      else if (cat === 'blbc') { countUpt++; countBlbc++; }
      else if (cat === 'pso') { countUpt++; countPso++; }
    });

    const totalCount = filteredFeatures.length;

    // Update Footer Stats Bar
    const el = (id) => this.container ? this.container.querySelector('#' + id) : null;
    if (el('stat-count-kanwil')) el('stat-count-kanwil').textContent = countKanwil;
    if (el('stat-count-kpu')) el('stat-count-kpu').textContent = countKpu;
    if (el('stat-count-kppbc')) el('stat-count-kppbc').textContent = countKppbc;
    if (el('stat-count-upt')) el('stat-count-upt').textContent = countUpt;

    // Update Header Pill Filters with dynamic badges
    if (this.container) {
      const pillAll = this.container.querySelector('.map-filter-pill[data-type="all"]');
      if (pillAll) pillAll.innerHTML = `<span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#38BDF8;"></span>Semua (${totalCount})`;

      const pillKanwil = this.container.querySelector('.map-filter-pill[data-type="kanwil"]');
      if (pillKanwil) pillKanwil.innerHTML = `<span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#0284C7;"></span>Kanwil (${countKanwil})`;

      const pillKpu = this.container.querySelector('.map-filter-pill[data-type="kpu"]');
      if (pillKpu) pillKpu.innerHTML = `<span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#D97706;"></span>KPU (${countKpu})`;

      const pillKppbc = this.container.querySelector('.map-filter-pill[data-type="kppbc"]');
      if (pillKppbc) pillKppbc.innerHTML = `<span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#0B3A6F;"></span>KPPBC (${countKppbc})`;

      const pillUpt = this.container.querySelector('.map-filter-pill[data-type="upt"]');
      if (pillUpt) pillUpt.innerHTML = `<span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#059669;"></span>UPT (${countUpt})`;

      // Update Map Legend Badges
      const legBadge = (type) => this.container.querySelector(`.legend-badge-count[data-count="${type}"]`);
      if (legBadge('all')) legBadge('all').textContent = totalCount;
      if (legBadge('kanwil')) legBadge('kanwil').textContent = countKanwil;
      if (legBadge('kpu')) legBadge('kpu').textContent = countKpu;
      if (legBadge('kppbc')) legBadge('kppbc').textContent = countKppbc;
      if (legBadge('blbc')) legBadge('blbc').textContent = countBlbc;
      if (legBadge('pso')) legBadge('pso').textContent = countPso;

      // Update Island Selector active state
      const islSelect = this.container.querySelector('#map-filter-island');
      if (islSelect) {
        islSelect.classList.toggle('is-filtered', selectedIsland !== 'all');
      }
    }
  }

  render() {
    this._applyLayersFilter();
    this.updateStats();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IndonesiaMapEngine };
}


/* --- assessment.js --- */

/**
 * assessment.js — Knowledge Check (Tantangan Kasus & Kuis) & Results Engine.
 * Features:
 * - Instructions Screen (Petunjuk Pengerjaan) before question 1 with Confirmation Button
 * - Borderless Option Cards (Tanpa border)
 * - 2 Mandatory Parts: 10 Pilihan Ganda (10 Menit) + 5 Studi Kasus (5 Menit)
 * - Strict Completion Guard: All 15 questions must be answered before viewing Results (Notification Modal if incomplete)
 * - Real-time Countdown Timer with Auto-Submit on Timeout
 * - Comprehensive Dual-Part Results Screen & Randomized Repeat Action
 */

class AssessmentEngine {
  constructor(containerEl, onComplete, onNavigate) {
    this.container = containerEl;
    this.onComplete = onComplete || (() => {});
    this.onNavigate = onNavigate || (() => {});
    this.allQuestions = [];
    this.pgQuestions = [];
    this.skQuestions = [];
    this.pgAnswers = [];
    this.skAnswers = [];
    this.currentTab = 'pilihan-ganda'; // 'pilihan-ganda' or 'studi-kasus'
    this.currentIndex = 0;
    this.pgTimeRemaining = 600; // 10 minutes
    this.skTimeRemaining = 300; // 5 minutes
    this.timerInterval = null;
    this.isIntroConfirmed = false;
    this.isTimeout = false;
  }

  setQuestions(questionsData) {
    this.allQuestions = questionsData || [];
    this.initQuestionSets();
    if (!this.isIntroConfirmed) {
      this.renderIntroScreen();
    } else {
      this.startPart(this.currentTab, false);
    }
  }

  /**
   * Samples n random elements from an array using Fisher-Yates shuffle.
   */
  sampleRandom(array, n) {
    if (!array || !array.length) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(n, shuffled.length));
  }

  /**
   * Initializes question sets (10 random PG and 5 random Case Studies).
   */
  initQuestionSets() {
    const pgPool = this.allQuestions.filter(q => q.tipe === 'pilihan-ganda');
    const skPool = this.allQuestions.filter(q => q.tipe === 'studi-kasus' || Boolean(q.narasi));

    this.pgQuestions = this.sampleRandom(pgPool, 10);
    this.skQuestions = this.sampleRandom(skPool, 5);
    this.pgAnswers = [];
    this.skAnswers = [];
    this.pgTimeRemaining = 600;
    this.skTimeRemaining = 300;
    this.currentIndex = 0;
    this.isTimeout = false;
  }

  /**
   * Renders the Welcome / Instruction Screen (Petunjuk Pengerjaan).
   */
  renderIntroScreen() {
    this.stopTimer();
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="quiz-page-wrapper" style="padding: 28px 32px; max-width: 980px; margin: 0 auto; width: 100%;">
        <!-- Intro Hero Card -->
        <div class="card" style="background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 24px rgba(11, 58, 111, 0.08); overflow: hidden; padding: 0;">
          
          <!-- Banner Header -->
          <div style="background: linear-gradient(135deg, #062B52 0%, #0B3A6F 100%); color: #FFFFFF; padding: 36px 36px 32px 36px; text-align: center;">
            <div style="width: 56px; height: 56px; margin: 0 auto 16px auto; background: rgba(255, 255, 255, 0.12); border: 1.5px solid rgba(217, 180, 91, 0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px;">
              📝
            </div>
            <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 8px 0; color: #FFFFFF; letter-spacing: -0.3px;">
              Petunjuk Pengerjaan Kuis & Evaluasi Pemahaman
            </h2>
            <p style="font-size: 14px; color: #E2E8F0; max-width: 650px; margin: 0 auto; line-height: 1.6;">
              Uji dan ukur penguasaan materi arsitektur organisasi, tugas, fungsi, instansi vertikal, dan proses bisnis Direktorat Jenderal Bea dan Cukai.
            </p>
          </div>

          <!-- Instruction Details (Bento Grid 2x2) -->
          <div style="padding: 32px 36px;">
            <div class="quiz-intro-grid" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-bottom: 28px;">
              
              <!-- Point 1 -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #E0F2FE; color: #0284C7; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                  🎯
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #0B3A6F; margin: 0 0 4px 0;">2 Bagian Evaluasi Wajib</h4>
                  <p style="font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.5;">
                    Terdiri dari <strong>10 Soal Pilihan Ganda</strong> dan <strong>5 Soal Studi Kasus</strong>. Seluruh 15 soal wajib dijawab sebelum hasil akhir ditampilkan.
                  </p>
                </div>
              </div>

              <!-- Point 2 -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                  ⏱️
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #0B3A6F; margin: 0 0 4px 0;">Alokasi Batas Waktu</h4>
                  <p style="font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.5;">
                    <strong>10 Menit</strong> untuk Pilihan Ganda dan <strong>5 Menit</strong> untuk Studi Kasus. Timer akan menghitung mundur dan otomatis selesai jika waktu habis.
                  </p>
                </div>
              </div>

              <!-- Point 3 -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #DCFCE7; color: #166534; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                  🏆
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #0B3A6F; margin: 0 0 4px 0;">Standar Penilaian & XP</h4>
                  <p style="font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.5;">
                    Raih poin XP pada setiap jawaban tepat (+10 XP PG, +20 XP Kasus). Batas kelulusan evaluasi minimum adalah <strong>70 / 100</strong>.
                  </p>
                </div>
              </div>

              <!-- Point 4 -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #F3E8FF; color: #7C3AED; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                  🔄
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #0B3A6F; margin: 0 0 4px 0;">Bank Soal Dinamis & Ulangi</h4>
                  <p style="font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.5;">
                    Soal dipilih secara acak dari Bank Soal DJBC terstandar. Anda dapat mengulang evaluasi dengan paket soal baru yang diacak kembali.
                  </p>
                </div>
              </div>

            </div>

            <!-- Confirmation Action Box (Centered) -->
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 14px; padding: 24px 32px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 16px; max-width: 720px; margin: 0 auto;">
              <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span style="font-size: 22px;">💡</span>
                <span style="font-size: 14px; color: #1E3A8A; font-weight: 600;">
                  Pastikan Anda memiliki waktu luang yang cukup sebelum memulai sesi kuis.
                </span>
              </div>
              <button id="btn-confirm-start-quiz" class="btn btn-primary" style="font-size: 14.5px; font-weight: 700; padding: 13px 32px; background: #0B3A6F; color: #FFFFFF; border-radius: 10px; border: none; display: inline-flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; box-shadow: 0 4px 14px rgba(11, 58, 111, 0.25); transition: all 0.2s;">
                <span>Saya Mengerti Mekanisme &amp; Mulai Evaluasi</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    const startBtn = this.container.querySelector('#btn-confirm-start-quiz');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.isIntroConfirmed = true;
        this.startPart('pilihan-ganda');
      });
    }
  }

  /**
   * Starts a part (tab) of the evaluation.
   */
  startPart(tabName = 'pilihan-ganda') {
    this.currentTab = tabName;
    this.currentIndex = 0;
    this.startTimer();
    this.renderCurrentQuestion();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const updateTimerDisplay = () => {
      const remaining = this.currentTab === 'pilihan-ganda' ? this.pgTimeRemaining : this.skTimeRemaining;
      const timerEl = this.container ? this.container.querySelector('#quiz-live-timer') : null;
      const badgeEl = this.container ? this.container.querySelector('#quiz-timer-badge') : null;
      if (timerEl) {
        timerEl.textContent = this.formatTime(remaining);
      }
      if (badgeEl) {
        if (remaining <= 60) {
          badgeEl.style.background = '#FEE2E2';
          badgeEl.style.color = '#DC2626';
        } else {
          badgeEl.style.background = '#F1F5F9';
          badgeEl.style.color = '#0B3A6F';
        }
      }
    };

    updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.currentTab === 'pilihan-ganda') {
        if (this.pgTimeRemaining > 0) {
          this.pgTimeRemaining--;
          updateTimerDisplay();
        } else {
          this.handleTimeout();
        }
      } else {
        if (this.skTimeRemaining > 0) {
          this.skTimeRemaining--;
          updateTimerDisplay();
        } else {
          this.handleTimeout();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleTimeout() {
    this.stopTimer();
    this.isTimeout = true;
    // If other part is incomplete, prompt or auto finalize
    if (this.pgAnswers.length === 10 && this.skAnswers.length === 5) {
      this.renderResults();
    } else {
      this.renderResults(true);
    }
  }

  formatTime(seconds) {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  getCurrentQuestions() {
    return this.currentTab === 'pilihan-ganda' ? this.pgQuestions : this.skQuestions;
  }

  getCurrentAnswers() {
    return this.currentTab === 'pilihan-ganda' ? this.pgAnswers : this.skAnswers;
  }

  renderCurrentQuestion() {
    if (!this.container) return;

    if (!this.isIntroConfirmed) {
      this.renderIntroScreen();
      return;
    }

    const questions = this.getCurrentQuestions();
    const answers = this.getCurrentAnswers();

    if (!questions.length) return;

    // Check if currentIndex exceeds questions
    if (this.currentIndex >= questions.length) {
      this.checkCompletionOrPromptNext();
      return;
    }

    const q = questions[this.currentIndex];
    const totalQ = questions.length;
    const progressPct = Math.round(((this.currentIndex) / totalQ) * 100);
    const isCaseStudy = this.currentTab === 'studi-kasus' || Boolean(q.narasi);
    const remainingTime = this.currentTab === 'pilihan-ganda' ? this.pgTimeRemaining : this.skTimeRemaining;

    // Calculate total XP earned so far across both parts
    const totalXP = (this.pgAnswers.filter(a => a.isCorrect).length * 10) + (this.skAnswers.filter(a => a.isCorrect).length * 20);

    const choices = (q.pilihan && Array.isArray(q.pilihan)) ? q.pilihan.map((p, idx) => ({
      id: p.id || String.fromCharCode(65 + idx),
      label: p.label || p.nama || p,
      deskripsi: p.deskripsi || ''
    })) : [];

    this.container.innerHTML = `
      <div class="quiz-page-wrapper" style="padding: 24px 32px; max-width: 1040px; margin: 0 auto; width: 100%;">
        
        <!-- Mode & Tab Navigation Bar (2 Tabs: PILIHAN GANDA & STUDI KASUS) -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 20px; border-bottom:1px solid #E2E8F0; padding-bottom:14px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn ${this.currentTab === 'pilihan-ganda' ? 'btn-primary' : 'btn-outline'}" data-tab-name="pilihan-ganda" style="font-size:12.5px; padding:7px 16px; font-weight:700; border-radius:8px; display:flex; align-items:center; gap:6px;">
              <span>🎯 PILIHAN GANDA</span>
              <span style="font-size:11px; opacity:0.9; background:rgba(0,0,0,0.15); padding:1px 7px; border-radius:4px;">${this.pgAnswers.length}/10 Selesai</span>
            </button>
            <button class="btn ${this.currentTab === 'studi-kasus' ? 'btn-primary' : 'btn-outline'}" data-tab-name="studi-kasus" style="font-size:12.5px; padding:7px 16px; font-weight:700; border-radius:8px; display:flex; align-items:center; gap:6px;">
              <span>📋 STUDI KASUS</span>
              <span style="font-size:11px; opacity:0.9; background:rgba(0,0,0,0.15); padding:1px 7px; border-radius:4px;">${this.skAnswers.length}/5 Selesai</span>
            </button>
          </div>

          <div style="display:flex; align-items:center; gap:14px;">
            <div id="quiz-timer-badge" style="display:flex; align-items:center; gap:6px; background:#F1F5F9; padding:6px 14px; border-radius:9999px; font-size:13px; font-weight:700; color:#0B3A6F; transition: all 0.3s ease;">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span id="quiz-live-timer">${this.formatTime(remainingTime)}</span>
            </div>
            <div style="font-size:13px; font-weight:700; color:#D9B45B; background:#001631; padding:6px 14px; border-radius:9999px;">
              ⭐ ${totalXP} XP
            </div>
          </div>
        </div>

        <!-- Progress Tracker Bar -->
        <div style="margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; color:#64748B; margin-bottom:6px;">
            <span>${this.currentTab === 'pilihan-ganda' ? 'Bagian 1: Pilihan Ganda' : 'Bagian 2: Studi Kasus'} — Pertanyaan ${this.currentIndex + 1} dari ${totalQ}</span>
            <span>${progressPct}% Selesai</span>
          </div>
          <div style="width:100%; height:8px; background:#E2E8F0; border-radius:9999px; overflow:hidden;">
            <div style="width:${progressPct}%; height:100%; background:linear-gradient(90deg, #0B3A6F 0%, #D9B45B 100%); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Main Question Card -->
        <div class="card quiz-card-wrapper" style="padding: 28px 32px; margin-bottom: 24px; background:#FFFFFF; border-radius:14px; border:1px solid #E2E8F0; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
          <!-- Category & Type Badges -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; gap:8px; align-items:center;">
              <span class="badge ${isCaseStudy ? 'badge-org' : 'badge-policy'}" style="font-size:11.5px; font-weight:700; text-transform:uppercase;">
                ${isCaseStudy ? '📋 Tantangan Studi Kasus' : '🎯 Pilihan Ganda'}
              </span>
              ${q.kategori_mp ? `
                <span class="badge badge-tech" style="font-size:11px; font-weight:600;">
                  ${q.kategori_mp.split(':')[0]}
                </span>
              ` : ''}
            </div>
            <span style="font-size:12px; font-weight:700; color:#D9B45B; background:#FFFDF5; border:1px solid #FEF08A; padding:4px 10px; border-radius:6px;">
              +${q.xp || (isCaseStudy ? 20 : 10)} XP
            </span>
          </div>

          <!-- Case Study Narrative Box (If applicable) -->
          ${isCaseStudy && q.narasi ? `
            <div style="background:#F8FAFC; border-left:4px solid #D9B45B; border-radius:8px; padding:18px 20px; margin-bottom: 20px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #854D0E; text-transform: uppercase; margin-bottom: 6px; display:flex; align-items:center; gap:6px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Skenario Kasus Operasional / Regulasi:
              </div>
              <p style="font-size: 13.5px; line-height: 1.65; color: #1E293B; margin: 0;">
                ${q.narasi}
              </p>
            </div>
          ` : ''}

          <!-- Question Text -->
          <h3 style="font-size: 17px; font-weight: 700; color: #001631; line-height: 1.5; margin: 0 0 20px 0;">
            ${q.soal}
          </h3>

          <!-- Options Container (Borderless Options) -->
          <div id="quiz-options-container" style="display:flex; flex-direction:column; gap: 10px; margin-bottom: 24px;">
            <!-- Options dynamically mounted -->
          </div>

          <!-- Feedback Section (Hidden until answered) -->
          <div id="quiz-feedback-box" style="display:none; border-radius:10px; padding:20px; margin-top: 20px;">
            <!-- Feedback content -->
          </div>
        </div>
      </div>
    `;

    // Tab button click listeners
    this.container.querySelectorAll('[data-tab-name]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab-name');
        if (tab !== this.currentTab) {
          this.startPart(tab);
        }
      });
    });

    // Populate borderless options
    const optionsContainer = this.container.querySelector('#quiz-options-container');
    if (optionsContainer) {
      choices.forEach((opt) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option-label';
        optionEl.style.border = 'none'; // User requested: Hilangkan border dari quiz-option-label
        optionEl.setAttribute('data-choice-id', opt.id);

        optionEl.innerHTML = `
          <div style="display:flex; align-items:center; gap:14px; width:100%;">
            <div class="quiz-option-radio" style="width:30px; height:30px; border-radius:50%; background:#E2E8F0; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:#334155; flex-shrink:0; transition: all 0.2s;">
              ${opt.id.toUpperCase()}
            </div>
            <div style="flex:1;">
              <div style="font-weight:600; font-size:14.5px; color:#001631; line-height:1.4;">${opt.label}</div>
            </div>
          </div>
        `;

        optionEl.addEventListener('click', () => this.handleAnswerSelect(opt.id, q));
        optionsContainer.appendChild(optionEl);
      });
    }
  }

  handleAnswerSelect(selectedId, question) {
    const feedbackBox = this.container.querySelector('#quiz-feedback-box');
    const options = this.container.querySelectorAll('.quiz-option-label');
    if (!feedbackBox || !options.length) return;

    // Prevent re-answering
    options.forEach(opt => {
      opt.style.pointerEvents = 'none';
    });

    const isCorrect = String(selectedId).toLowerCase() === String(question.correct || question.correct_node_id).toLowerCase();

    const answerRecord = {
      questionId: question.id,
      selected: selectedId,
      isCorrect: isCorrect,
      question: question
    };

    if (this.currentTab === 'pilihan-ganda') {
      this.pgAnswers.push(answerRecord);
    } else {
      this.skAnswers.push(answerRecord);
    }

    // Style option cards (Borderless highlighting)
    options.forEach(opt => {
      const choiceId = opt.getAttribute('data-choice-id');
      const radio = opt.querySelector('.quiz-option-radio');
      if (String(choiceId).toLowerCase() === String(question.correct || question.correct_node_id).toLowerCase()) {
        opt.style.background = '#ECFDF5';
        if (radio) {
          radio.style.background = '#059669';
          radio.style.color = '#FFFFFF';
          radio.innerHTML = '✓';
        }
      } else if (String(choiceId).toLowerCase() === String(selectedId).toLowerCase() && !isCorrect) {
        opt.style.background = '#FEF2F2';
        if (radio) {
          radio.style.background = '#DC2626';
          radio.style.color = '#FFFFFF';
          radio.innerHTML = '✕';
        }
      } else {
        opt.style.opacity = '0.5';
      }
    });

    const currentQuestions = this.getCurrentQuestions();
    const isLastInTab = this.currentIndex >= currentQuestions.length - 1;

    let nextBtnLabel = 'Lanjut ke Soal Berikutnya →';
    if (isLastInTab) {
      if (this.currentTab === 'pilihan-ganda') {
        nextBtnLabel = this.skAnswers.length >= 5 ? 'Lihat Hasil Evaluasi Akhir 🏆' : 'Selesai Bagian 1: Lanjut ke Studi Kasus →';
      } else {
        nextBtnLabel = this.pgAnswers.length >= 10 ? 'Lihat Hasil Evaluasi Akhir 🏆' : 'Lanjut ke Pilihan Ganda →';
      }
    }

    // Render feedback section
    feedbackBox.style.display = 'block';
    if (isCorrect) {
      feedbackBox.style.background = '#ECFDF5';
      feedbackBox.style.border = '1px solid #A7F3D0';
      feedbackBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:50%; background:#059669; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700;">✓</div>
            <span style="font-size: 16px; font-weight: 800; color: #065F46;">Jawaban Anda Tepat Sekali!</span>
          </div>
          <span style="font-size: 13px; font-weight: 700; color: #059669; background:#D1FAE5; padding:4px 10px; border-radius:6px;">
            +${question.xp || (this.currentTab === 'studi-kasus' ? 20 : 10)} XP
          </span>
        </div>
        <p style="font-size: 13.5px; line-height: 1.6; color: #064E3B; margin: 0 0 16px 0;">
          <strong>Pembahasan & Dasar Regulasi:</strong> ${question.pembahasan || 'Jawaban Anda telah diverifikasi benar sesuai dengan struktur organisasi dan regulasi kepabeanan.'}
        </p>
        <div style="display:flex; justify-content:flex-end;">
          <button id="btn-next-question" class="btn btn-primary" style="font-size:13px; font-weight:700; gap:6px;">
            <span>${nextBtnLabel}</span>
          </button>
        </div>
      `;
    } else {
      feedbackBox.style.background = '#FEF2F2';
      feedbackBox.style.border = '1px solid #FECACA';
      feedbackBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:50%; background:#DC2626; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700;">✕</div>
            <span style="font-size: 16px; font-weight: 800; color: #991B1B;">Jawaban Kurang Tepat</span>
          </div>
          <span style="font-size: 12px; font-weight: 600; color: #991B1B; background:#FEE2E2; padding:4px 10px; border-radius:6px;">
            +0 XP
          </span>
        </div>
        <p style="font-size: 13.5px; line-height: 1.6; color: #7F1D1D; margin: 0 0 16px 0;">
          <strong>Pembahasan & Dasar Regulasi:</strong> ${question.pembahasan || 'Periksa kembali modul terkait tugas dan fungsi unit kerja kepabeanan dan cukai.'}
        </p>
        <div style="display:flex; justify-content:flex-end;">
          <button id="btn-next-question" class="btn btn-primary" style="font-size:13px; font-weight:700; gap:6px;">
            <span>${nextBtnLabel}</span>
          </button>
        </div>
      `;
    }

    const nextBtn = feedbackBox.querySelector('#btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!isLastInTab) {
          this.currentIndex++;
          this.renderCurrentQuestion();
        } else {
          this.checkCompletionOrPromptNext();
        }
      });
    }
  }

  /**
   * Checks completion status of both PG and Case Study parts.
   * If both complete -> displays Results.
   * If incomplete -> displays transition prompt or notification popup modal.
   */
  checkCompletionOrPromptNext() {
    const pgDone = this.pgAnswers.length >= 10;
    const skDone = this.skAnswers.length >= 5;

    if (pgDone && skDone) {
      this.renderResults();
      return;
    }

    if (this.currentTab === 'pilihan-ganda' && pgDone && !skDone) {
      // Transition from Part 1 to Part 2
      this.showTransitionToCaseStudyModal();
    } else if (this.currentTab === 'studi-kasus' && skDone && !pgDone) {
      // Prompt user to complete Part 1
      this.showIncompleteWarningModal('pilihan-ganda');
    } else {
      this.showIncompleteWarningModal();
    }
  }

  /**
   * Modal dialog shown when Part 1 (Pilihan Ganda) is completed.
   */
  showTransitionToCaseStudyModal() {
    const modalEl = document.createElement('div');
    modalEl.style.cssText = 'position:fixed; inset:0; background:rgba(0,14,35,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
    modalEl.innerHTML = `
      <div style="background:#FFFFFF; border-radius:16px; max-width:520px; width:100%; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.25); text-align:center;">
        <div style="width:56px; height:56px; background:#DCFCE7; color:#166534; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 16px auto;">
          ✓
        </div>
        <h3 style="font-size:20px; font-weight:800; color:#0B3A6F; margin:0 0 8px 0;">Bagian 1: Pilihan Ganda Selesai!</h3>
        <p style="font-size:13.5px; color:#64748B; line-height:1.6; margin:0 0 24px 0;">
          Anda telah menyelesaikan <strong>10 soal Pilihan Ganda</strong>. Lanjutkan ke <strong>Bagian 2: 5 Soal Studi Kasus (Waktu: 5 Menit)</strong> untuk menuntaskan evaluasi dan membuka halaman Hasil Akhir.
        </p>
        <button id="btn-modal-start-casestudy" class="btn btn-primary" style="font-size:14px; font-weight:700; padding:12px 28px; width:100%; border-radius:8px;">
          Lanjutkan ke Studi Kasus (5 Soal) →
        </button>
      </div>
    `;

    document.body.appendChild(modalEl);
    modalEl.querySelector('#btn-modal-start-casestudy').addEventListener('click', () => {
      document.body.removeChild(modalEl);
      this.startPart('studi-kasus');
    });
  }

  /**
   * Modal notification / warning popup if user attempts to view results without completing all questions.
   */
  showIncompleteWarningModal(targetTab) {
    const pgRemaining = Math.max(0, 10 - this.pgAnswers.length);
    const skRemaining = Math.max(0, 5 - this.skAnswers.length);

    const modalEl = document.createElement('div');
    modalEl.style.cssText = 'position:fixed; inset:0; background:rgba(0,14,35,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
    modalEl.innerHTML = `
      <div style="background:#FFFFFF; border-radius:16px; max-width:520px; width:100%; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.25); text-align:center;">
        <div style="width:56px; height:56px; background:#FEE2E2; color:#DC2626; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 16px auto;">
          ⚠️
        </div>
        <h3 style="font-size:20px; font-weight:800; color:#0B3A6F; margin:0 0 8px 0;">Evaluasi Belum Lengkap</h3>
        <p style="font-size:13.5px; color:#64748B; line-height:1.6; margin:0 0 20px 0;">
          Sebelum menampilkan halaman Hasil Akhir, pastikan Anda telah menyelesaikan seluruh soal pada <strong>Pilihan Ganda</strong> dan <strong>Studi Kasus</strong>.
        </p>

        <div style="background:#F8FAFC; border-radius:10px; padding:14px 18px; margin-bottom:24px; text-align:left; font-size:13px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="font-weight:600; color:#1E293B;">🎯 Pilihan Ganda (10 Soal):</span>
            <span style="font-weight:700; color:${pgRemaining === 0 ? '#059669' : '#DC2626'};">${this.pgAnswers.length} / 10 Terjawab ${pgRemaining === 0 ? '✓' : `(Sisa ${pgRemaining})`}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="font-weight:600; color:#1E293B;">📋 Studi Kasus (5 Soal):</span>
            <span style="font-weight:700; color:${skRemaining === 0 ? '#059669' : '#DC2626'};">${this.skAnswers.length} / 5 Terjawab ${skRemaining === 0 ? '✓' : `(Sisa ${skRemaining})`}</span>
          </div>
        </div>

        <button id="btn-modal-resume" class="btn btn-primary" style="font-size:14px; font-weight:700; padding:12px 28px; width:100%; border-radius:8px;">
          Lanjutkan Pengerjaan Soal →
        </button>
      </div>
    `;

    document.body.appendChild(modalEl);
    modalEl.querySelector('#btn-modal-resume').addEventListener('click', () => {
      document.body.removeChild(modalEl);
      if (pgRemaining > 0) {
        this.startPart('pilihan-ganda');
      } else {
        this.startPart('studi-kasus');
      }
    });
  }

  /**
   * Renders the Final Comprehensive Results Screen across both PG & Case Study parts.
   */
  renderResults(forceTimeout = false) {
    this.stopTimer();

    // Check mandatory completion requirement unless forced by overall timeout
    if (!forceTimeout && (this.pgAnswers.length < 10 || this.skAnswers.length < 5)) {
      this.showIncompleteWarningModal();
      return;
    }

    const pgCorrect = this.pgAnswers.filter(a => a.isCorrect).length;
    const skCorrect = this.skAnswers.filter(a => a.isCorrect).length;
    const totalCorrect = pgCorrect + skCorrect;
    const totalQuestions = 15;
    const scorePct = Math.round((totalCorrect / totalQuestions) * 100);
    const wrongCount = Math.max(0, totalQuestions - totalCorrect);
    const totalXP = (pgCorrect * 10) + (skCorrect * 20);

    const timeSpentPG = Math.max(0, 600 - this.pgTimeRemaining);
    const timeSpentSK = Math.max(0, 300 - this.skTimeRemaining);
    const totalTimeSpentStr = this.formatTime(timeSpentPG + timeSpentSK);

    const circumference = 276.46; // 2 * PI * 44
    const strokeDashoffset = circumference - (circumference * scorePct / 100);

    // Call onComplete callback with assessment stats
    this.onComplete(scorePct, {
      score: totalCorrect,
      totalQuestions: totalQuestions,
      xp: totalXP,
      timeSpent: totalTimeSpentStr,
      pgCorrect: pgCorrect,
      skCorrect: skCorrect
    });

    // Topic performance breakdown calculation across all answered questions
    const allAnswers = [...this.pgAnswers, ...this.skAnswers];
    const topicStats = {};
    allAnswers.forEach(ans => {
      const topicName = (ans.question.kategori_mp || 'Umum').split(':')[0].trim();
      if (!topicStats[topicName]) {
        topicStats[topicName] = { total: 0, correct: 0 };
      }
      topicStats[topicName].total++;
      if (ans.isCorrect) topicStats[topicName].correct++;
    });

    const defaultTopics = [
      { key: 'MP 1', name: 'Manajemen Pemerintahan', color: '#059669' },
      { key: 'MP 2', name: 'Kantor Pusat DJBC', color: '#0284C7' },
      { key: 'MP 3', name: 'Instansi Vertikal & UPT', color: '#B45309' },
      { key: 'MP 4', name: 'Jabatan Fungsional', color: '#7C3AED' },
      { key: 'MP 5', name: 'Interdependensi & SOP', color: '#DC2626' }
    ];

    const topicData = defaultTopics.map(dt => {
      const stat = Object.entries(topicStats).find(([k]) => k.includes(dt.key));
      let pct = 100;
      if (stat && stat[1].total > 0) {
        pct = Math.round((stat[1].correct / stat[1].total) * 100);
      } else {
        pct = scorePct >= 80 ? 90 : (scorePct >= 60 ? 70 : 50);
      }
      return { ...dt, pct };
    });

    let recommendationText = '';
    if (scorePct >= 85) {
      recommendationText = 'Luar biasa! Pemahaman Anda mengenai arsitektur organisasi dan tusi DJBC sangat komprehensif. Pertahankan keunggulan ini!';
    } else if (scorePct >= 70) {
      recommendationText = 'Bagus! Anda telah lulus batas kompetensi. Disarankan mereview kembali modul dan bagan organisasi untuk mengoptimalkan pemahaman.';
    } else {
      recommendationText = 'Perlu pendalaman lebih lanjut. Buka Modul Pembelajaran dan Eksplorasi Organisasi untuk mempelajari kembali pembagian fungsi unit kerja.';
    }

    this.container.innerHTML = `
      <div style="padding: 24px 32px; max-width: 1040px; margin: 0 auto; width: 100%;">
        
        <!-- Breadcrumb Navigation -->
        <nav style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748B; margin-bottom: 20px;">
          <span style="cursor: pointer; color: #0B3A6F; font-weight: 600;" id="breadcrumb-quiz-root">Evaluasi</span>
          <span>›</span>
          <span style="color: #1E293B; font-weight: 700;">Hasil Evaluasi Akhir</span>
        </nav>

        ${this.isTimeout ? `
          <!-- Timeout Warning Banner -->
          <div style="background:#FEF2F2; border-left:4px solid #DC2626; border-radius:10px; padding:14px 18px; margin-bottom:20px; display:flex; align-items:center; gap:12px;">
            <span style="font-size:22px;">⏱️</span>
            <div>
              <div style="font-size:14px; font-weight:700; color:#991B1B;">Batas Waktu Telah Habis!</div>
              <div style="font-size:12.5px; color:#7F1D1D; margin-top:2px;">Sesi evaluasi otomatis diselesaikan sesuai batas waktu yang ditentukan.</div>
            </div>
          </div>
        ` : ''}

        <!-- Bento Style Results Card -->
        <div class="card" style="background: #FFFFFF; border-radius: 16px; border: 1px solid #D9E0E8; box-shadow: 0 4px 20px rgba(11, 58, 111, 0.06); overflow: hidden; padding: 0;">
          
          <!-- Top Header Banner (Centered, Gradient) -->
          <div style="padding: 36px 32px; text-align: center; border-bottom: 1px solid #D9E0E8; background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);">
            <div style="width: 52px; height: 52px; margin: 0 auto 16px auto; background: #FFFDF0; border: 1px solid #FDE68A; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(217, 180, 91, 0.2);">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#D9B45B">
                <path d="M12 2l2.4 2.5 3.4-.4 1.1 3.2 3.1 1.5-.7 3.4 2 2.8-2 2.8.7 3.4-3.1 1.5-1.1 3.2-3.4-.4L12 22l-2.4-2.5-3.4.4-1.1-3.2-3.1-1.5.7-3.4-2-2.8 2-2.8-.7-3.4 3.1-1.5 1.1-3.2 3.4.4L12 2zm-1.5 14.5l6-6-1.4-1.4-4.6 4.6-2.1-2.1-1.4 1.4 3.5 3.5z"/>
              </svg>
            </div>
            <h2 style="font-size: 24px; font-weight: 800; color: #0B3A6F; margin: 0 0 6px 0; line-height: 1.3;">
              ${scorePct >= 70 ? 'Selamat! Anda Telah Menyelesaikan Evaluasi Komprehensif' : 'Evaluasi Komprehensif Selesai'}
            </h2>
            <p style="font-size: 14px; color: #64748B; margin: 0 0 28px 0;">10 Soal Pilihan Ganda + 5 Soal Studi Kasus</p>

            <!-- Circular Score Gauge -->
            <div style="display: flex; justify-content: center; align-items: center;">
              <div style="width: 170px; height: 170px; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; background: #FFFFFF; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04); border: 8px solid #F1F5F9;">
                <svg style="position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg);" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="transparent" stroke="#E2E8F0" stroke-width="8"></circle>
                  <circle cx="50" cy="50" r="44" fill="transparent" stroke="#D9B45B" stroke-width="8" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;"></circle>
                </svg>
                <div style="text-align: center; z-index: 2;">
                  <span style="font-size: 40px; font-weight: 800; color: #0B3A6F; line-height: 1; display: block;">${scorePct}</span>
                  <span style="font-size: 11.5px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">Skor Akhir / 100</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bento Grid: Ringkasan + Analisis Performa Topik -->
          <div style="padding: 28px 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px;">
            
            <!-- Col 1: Ringkasan Dual-Part -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <h3 style="font-size: 16px; font-weight: 700; color: #0B3A6F; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin: 0 0 4px 0;">Ringkasan Hasil</h3>
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #F8FAFC;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 6px; background: #DCFCE7; color: #166534; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">🎯</div>
                  <span style="font-size: 13.5px; font-weight: 600; color: #1E293B;">Pilihan Ganda</span>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: #0B3A6F;">${pgCorrect} / 10 Benar</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #F8FAFC;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 6px; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">📋</div>
                  <span style="font-size: 13.5px; font-weight: 600; color: #1E293B;">Studi Kasus</span>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: #0B3A6F;">${skCorrect} / 5 Benar</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #F8FAFC;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 6px; background: #E0F2FE; color: #0369A1; display: flex; align-items: center; justify-content: center; font-size: 14px;">⏱</div>
                  <span style="font-size: 13.5px; font-weight: 600; color: #1E293B;">Total Waktu</span>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: #0B3A6F;">${totalTimeSpentStr}</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #FFFDF0; border: 1px solid #FEF08A;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 6px; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center; font-size: 14px;">⭐</div>
                  <span style="font-size: 13.5px; font-weight: 600; color: #78350F;">Total Poin XP</span>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: #B45309;">+${totalXP} XP</span>
              </div>
            </div>

            <!-- Col 2: Analisis Performa Topik -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <h3 style="font-size: 16px; font-weight: 700; color: #0B3A6F; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin: 0;">Analisis Performa Topik</h3>
              
              <div style="display: flex; flex-direction: column; gap: 14px; justify-content: center; flex: 1;">
                ${topicData.map(topic => `
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                      <span style="font-size: 13.5px; font-weight: 600; color: #1E293B;">${topic.name}</span>
                      <span style="font-size: 13.5px; font-weight: 700; color: ${topic.color};">${topic.pct}%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #F1F5F9; border-radius: 9999px; overflow: hidden;">
                      <div style="width: ${topic.pct}%; height: 100%; background: ${topic.color}; border-radius: 9999px; transition: width 0.6s ease;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Recommendation & Action Section (Bottom) -->
          <div style="padding: 24px 32px; background: #F8FAFC; border-top: 1px solid #D9E0E8;">
            <!-- Lightbulb Recommendation Box -->
            <div style="display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 14px 18px;">
              <div style="color: #1D4ED8; font-size: 20px; line-height: 1; flex-shrink: 0; margin-top: 1px;">💡</div>
              <div>
                <p style="font-size: 13.5px; color: #1E3A8A; line-height: 1.6; margin: 0;">
                  <strong>Saran Pembelajaran:</strong> ${recommendationText}
                </p>
              </div>
            </div>

            <!-- Action Buttons: Ulangi Kuis & Lanjutkan Belajar -->
            <div style="display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-wrap: wrap;">
              <button id="btn-restart-quiz" class="btn btn-outline" style="font-size: 13px; font-weight: 700; padding: 9px 18px; border: 1.5px solid #0B3A6F; color: #0B3A6F; background: #FFFFFF; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Ulangi Kuis (Soal Acak Baru)
              </button>
              <button id="btn-go-learning" class="btn btn-primary" style="font-size: 13px; font-weight: 700; padding: 9px 20px; background: #0B3A6F; color: #FFFFFF; border-radius: 8px; border: none; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 6px rgba(11, 58, 111, 0.2);">
                Lanjutkan Belajar
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    // Action button & breadcrumb listeners
    const breadcrumbRoot = this.container.querySelector('#breadcrumb-quiz-root');
    if (breadcrumbRoot) {
      breadcrumbRoot.addEventListener('click', () => {
        this.initQuestionSets();
        this.startPart('pilihan-ganda');
      });
    }

    const restartBtn = this.container.querySelector('#btn-restart-quiz');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.initQuestionSets();
        this.startPart('pilihan-ganda');
      });
    }

    const learningBtn = this.container.querySelector('#btn-go-learning');
    if (learningBtn) {
      learningBtn.addEventListener('click', () => {
        this.onNavigate('view-learning');
      });
    }
  }
}


/* --- learning.js --- */

/**
 * learning.js — Interactive Learning Module & Topic Stepper Engine with Clickable Unit Detail Panels.
 * Matches Stitch: 7950ce7bc9cd4ab3bb2455f22febfcd1 and Pusdiklat BPPK Curriculum (MP 1 s.d. MP 5).
 */

class LearningModuleEngine {
  constructor(containerEl, learningPaths, unitsDict, onNavigate, onSelectUnit) {
    this.container = containerEl;
    this.learningPaths = learningPaths || [];
    this.unitsDict = unitsDict || {};
    this.onNavigate = onNavigate || (() => {});
    this.onSelectUnit = onSelectUnit || (() => {});
    this.currentModuleIndex = 0;
    this.currentTopicIndex = 0;

    // Structured curriculum data matching official references in referensi/
    this.modules = [
      {
        id: 'mp-01',
        title: 'MP 1: DJBC dalam Manajemen Pemerintahan',
        subtitle: 'Peran, Kedudukan, Visi Misi, dan 4 Peran Strategis DJBC',
        jp: '3 JP',
        estimatedTime: '15 Menit',
        topics: [
          {
            id: 'mp1-t1',
            title: 'Peran & Kedudukan DJBC dalam Kemenkeu & NKRI',
            status: 'completed',
            summary: 'Kehadiran dan pelaksanaan tugas DJBC merupakan amanat langsung konstitusi UUD 1945 Pasal 23A untuk menjamin kedaulatan fiskal dan perlindungan masyarakat.',
            content: `
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin-bottom:20px;">
                <h4 style="font-size:15px; font-weight:700; color:#0B3A6F; margin-bottom:10px;">Landasan Hierarki Hukum Kedudukan DJBC:</h4>
                <div style="display:flex; flex-direction:column; gap:12px;">
                  <div style="background:#FFFFFF; border:1px solid #D9E0E8; border-left:4px solid #0B3A6F; border-radius:8px; padding:12px 16px;">
                    <div style="font-weight:700; font-size:13.5px; color:#001631;">UUD 1945 (Pasal 23A)</div>
                    <div style="font-size:12.5px; color:#475569; margin-top:2px;">
                      <em>"Pajak dan pungutan lain yang bersifat memaksa untuk keperluan negara diatur dengan undang-undang."</em> Pungutan Bea Masuk, Bea Keluar, dan Cukai dijamin konstitusi demi membiayai pembangunan nasional.
                    </div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #D9E0E8; border-left:4px solid #0284C7; border-radius:8px; padding:12px 16px;">
                    <div style="font-weight:700; font-size:13.5px; color:#001631;">UU Kepabeanan (UU No. 10/1995 jo UU No. 17/2006) & UU Cukai (UU No. 39/2007)</div>
                    <div style="font-size:12.5px; color:#475569; margin-top:2px;">
                      Mandat pengawasan lalu lintas barang ekspor/impor di perbatasan, pemungutan bea masuk/keluar, serta pengendalian konsumsi dan peredaran Barang Kena Cukai (BKC).
                    </div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #D9E0E8; border-left:4px solid #D9B45B; border-radius:8px; padding:12px 16px;">
                    <div style="font-weight:700; font-size:13.5px; color:#001631;">Peraturan Menteri Keuangan (PMK Nomor 124 Tahun 2024)</div>
                    <div style="font-size:12.5px; color:#475569; margin-top:2px;">
                      DJBC berada di bawah dan bertanggung jawab langsung kepada Menteri Keuangan, dipimpin oleh Direktur Jenderal Bea dan Cukai sebagai pengelola kebijakan fiskal kepabeanan & cukai.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Interactive Unit Link Card -->
              <div class="card unit-interactive-card" data-unit-id="djbc" style="padding:16px 20px; border-left:4px solid #0B3A6F; cursor:pointer; background:#FFFFFF; margin-top:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span class="badge badge-org" style="font-size:11px;">Unit Induk Eselon I</span>
                    <h4 style="font-size:15px; font-weight:800; color:#0B3A6F; margin:4px 0 2px 0;">Direktorat Jenderal Bea dan Cukai (DJBC)</h4>
                    <p style="font-size:12.5px; color:#64748B; margin:0;">Pimpinan: Direktur Jenderal Bea dan Cukai | Dasar Hukum: PMK 124/2024</p>
                  </div>
                  <button class="btn btn-outline" style="font-size:12px; font-weight:700; gap:4px; padding:6px 14px;">
                    🔍 Detail Unit
                  </button>
                </div>
              </div>
            `
          },
          {
            id: 'mp1-t2',
            title: 'Visi dan Misi DJBC',
            status: 'active',
            summary: 'Visi DJBC mencerminkan cita-cita tertinggi organisasi menjadi institusi kepabeanan dan cukai terkemuka di dunia melalui 5 misi transformasi.',
            content: `
              <div style="background:linear-gradient(135deg, #062B52 0%, #0B3A6F 100%); color:#FFFFFF; border-radius:14px; padding:24px; text-align:center; margin-bottom:20px; box-shadow:0 4px 16px rgba(6,43,82,0.15);">
                <span style="font-size:12px; font-weight:700; color:#D9B45B; text-transform:uppercase; letter-spacing:1px;">VISI ORGANISASI</span>
                <h3 style="font-size:22px; font-weight:800; margin:8px 0 0 0; color:#FFFFFF;">
                  “Menjadi Institusi Kepabeanan dan Cukai Terkemuka di Dunia”
                </h3>
              </div>

              <h4 style="font-size:15px; font-weight:700; color:#001631; margin-bottom:12px;">5 Misi Strategis DJBC:</h4>
              <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">1</div>
                  <div style="font-size:13px; color:#334155;">Memfasilitasi perdagangan dan industri dengan memberikan pelayanan prima berstandar internasional.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">2</div>
                  <div style="font-size:13px; color:#334155;">Melindungi perbatasan dan masyarakat Indonesia dari penyelundupan barang terlarang dan berbahaya.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">3</div>
                  <div style="font-size:13px; color:#334155;">Mengoptimalkan penerimaan negara di sektor kepabeanan dan cukai guna menopang APBN.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">4</div>
                  <div style="font-size:13px; color:#334155;">Mewujudkan tata kelola organisasi yang transparan, efektif, efisien, dan berintegritas tinggi.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">5</div>
                  <div style="font-size:13px; color:#334155;">Mengembangkan SDM yang profesional, adaptif terhadap teknologi digital, dan berdaya saing global.</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp1-t3',
            title: 'Tugas dan 4 Peran Strategis DJBC',
            status: 'locked',
            summary: 'Tugas DJBC diwujudkan dalam 4 pilar peran strategis: Revenue Collector, Trade Facilitator, Industrial Assistance, dan Community Protector.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin: 16px 0;">
                <div class="unit-interactive-card" data-unit-id="dit-tfc" style="background:#FFFFFF; border:1.5px solid #0B3A6F; border-radius:12px; padding:18px; cursor:pointer; box-shadow:0 2px 8px rgba(11,58,111,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:28px;">💰</div>
                    <span style="font-size:11px; font-weight:700; color:#0B3A6F;">Detail Unit ➔</span>
                  </div>
                  <div style="font-weight:800; font-size:15px; color:#0B3A6F; margin-top:8px;">Revenue Collector</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:6px; line-height:1.5;">
                    Memungut Bea Masuk, Bea Keluar, dan Cukai (Hasil Tembakau, MMEA, Etil Alkohol) untuk kas negara.
                  </div>
                </div>

                <div class="unit-interactive-card" data-unit-id="dit-teknis-kepab" style="background:#FFFFFF; border:1.5px solid #0284C7; border-radius:12px; padding:18px; cursor:pointer; box-shadow:0 2px 8px rgba(2,132,199,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:28px;">🚢</div>
                    <span style="font-size:11px; font-weight:700; color:#0284C7;">Detail Unit ➔</span>
                  </div>
                  <div style="font-weight:800; font-size:15px; color:#0284C7; margin-top:8px;">Trade Facilitator</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:6px; line-height:1.5;">
                    Menyederhanakan prosedur kepabeanan ekspor/impor melalui sistem otomasi CEISA & AEO.
                  </div>
                </div>

                <div class="unit-interactive-card" data-unit-id="dit-fasilitas-kepab" style="background:#FFFFFF; border:1.5px solid #059669; border-radius:12px; padding:18px; cursor:pointer; box-shadow:0 2px 8px rgba(5,150,105,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:28px;">🏭</div>
                    <span style="font-size:11px; font-weight:700; color:#059669;">Detail Unit ➔</span>
                  </div>
                  <div style="font-weight:800; font-size:15px; color:#059669; margin-top:8px;">Industrial Assistance</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:6px; line-height:1.5;">
                    Insentif fiskal (Kawasan Berikat, KITE, Pusat Logistik Berikat) untuk daya saing manufaktur ekspor.
                  </div>
                </div>

                <div class="unit-interactive-card" data-unit-id="dit-p2" style="background:#FFFFFF; border:1.5px solid #DC2626; border-radius:12px; padding:18px; cursor:pointer; box-shadow:0 2px 8px rgba(220,38,38,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:28px;">🛡️</div>
                    <span style="font-size:11px; font-weight:700; color:#DC2626;">Detail Unit ➔</span>
                  </div>
                  <div style="font-weight:800; font-size:15px; color:#DC2626; margin-top:8px;">Community Protector</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:6px; line-height:1.5;">
                    Mencegah masuknya narkotika, senjata ilegal, limbah B3, dan barang selundupan berbahaya.
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp1-t4',
            title: 'Kelembagaan & Hierarki Makro DJBC',
            status: 'locked',
            summary: 'Organisasi DJBC dirancang secara hierarkis dalam 3 pilar: Kantor Pusat (Regulator), Instansi Vertikal (Operasional Wilayah), dan UPT (Dukungan Teknis Khusus).',
            content: `
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin-bottom:16px;">
                <div style="font-size:14px; font-weight:700; color:#001631; margin-bottom:12px;">Klik unit di bawah ini untuk membuka detail profil di panel samping:</div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
                  <div class="card unit-interactive-card" data-unit-id="kantor-pusat" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                    <strong style="color:#0B3A6F; font-size:13.5px;">1. Kantor Pusat DJBC</strong>
                    <div style="font-size:12px; color:#64748B; margin-top:4px;">1 Setditjen, 10 Direktorat, dan 3 Tenaga Pengkaji (Regulator Kebijakan).</div>
                  </div>
                  <div class="card unit-interactive-card" data-unit-id="instansi-vertikal-djbc" style="padding:14px; cursor:pointer; border-left:4px solid #0284C7;">
                    <strong style="color:#0284C7; font-size:13.5px;">2. Instansi Vertikal</strong>
                    <div style="font-size:12px; color:#64748B; margin-top:4px;">20 Kanwil, 3 KPU BC, dan 104 KPPBC (Pelayanan & Pengawasan Lapangan).</div>
                  </div>
                  <div class="card unit-interactive-card" data-unit-id="upt-djbc" style="padding:14px; cursor:pointer; border-left:4px solid #D9B45B;">
                    <strong style="color:#854D0E; font-size:13.5px;">3. Unit Pelaksana Teknis (UPT)</strong>
                    <div style="font-size:12px; color:#64748B; margin-top:4px;">3 Balai Laboratorium (BLBC) dan 6 Pangkalan Sarana Operasi (PSO BC).</div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: 'mp-02',
        title: 'MP 2: Struktur Organisasi Kantor Pusat DJBC',
        subtitle: 'Sekretariat Direktorat Jenderal, 10 Direktorat Teknis, & Tenaga Pengkaji',
        jp: '3 JP',
        estimatedTime: '20 Menit',
        topics: [
          {
            id: 'mp2-t1',
            title: 'Sekretariat Direktorat Jenderal (Setditjen)',
            status: 'active',
            summary: 'Setditjen mengoordinasikan pelaksanaan tugas, pembinaan SDM, keuangan, pengelolaan aset, organisasi, dan tata laksana di lingkungan DJBC.',
            content: `
              <div class="card unit-interactive-card" data-unit-id="setditjen" style="padding:16px 20px; border-left:4px solid #0B3A6F; cursor:pointer; background:#FFFFFF; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span class="badge badge-org" style="font-size:11px;">Eselon II.a</span>
                    <h4 style="font-size:16px; font-weight:800; color:#0B3A6F; margin:4px 0 2px 0;">Sekretariat Direktorat Jenderal (Setditjen)</h4>
                    <p style="font-size:12.5px; color:#64748B; margin:0;">Mengoordinasikan manajerial, perencanaan, kepegawaian, keuangan, dan tata laksana.</p>
                  </div>
                  <button class="btn btn-outline" style="font-size:12px; font-weight:700; gap:4px; padding:6px 14px;">
                    🔍 Detail Setditjen
                  </button>
                </div>
              </div>

              <div style="font-size:13px; font-weight:700; color:#001631; margin-bottom:8px;">Bagian-Bagian Eselon III di Lingkungan Setditjen:</div>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin:12px 0;">
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Perencanaan ➔</div>
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Organisasi & TL ➔</div>
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Kepegawaian ➔</div>
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Keuangan ➔</div>
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Umum & BMN ➔</div>
              </div>
            `
          },
          {
            id: 'mp2-t2',
            title: 'Direktorat Teknis, Fasilitas, & Cukai',
            status: 'locked',
            summary: 'Tiga direktorat pilar perumusan regulasi teknis operasional, insentif fiskal industri, dan pungutan cukai.',
            content: `
              <div style="display:flex; flex-direction:column; gap:12px; margin: 12px 0;">
                <div class="card unit-interactive-card" data-unit-id="dit-teknis-kepab" style="padding:16px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0B3A6F; font-size:14px;">1. Direktorat Teknis Kepabeanan</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Merumuskan standardisasi impor/ekspor, tarif HS Code, nilai pabean, dan AEO.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0B3A6F;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="dit-fasilitas-kepab" style="padding:16px; cursor:pointer; border-left:4px solid #059669;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#059669; font-size:14px;">2. Direktorat Fasilitas Kepabeanan</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Fasilitas pembebasan, keringanan, Kawasan Berikat, KITE, dan Kawasan Ekonomi Khusus.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#059669;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="dit-tfc" style="padding:16px; cursor:pointer; border-left:4px solid #D97706;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#D97706; font-size:14px;">3. Direktorat Teknis dan Fasilitas Cukai</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Tarif cukai, izin NPPBKC pabrik rokok/miras, pelunasan pita cukai, dan pengawasan BKC.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#D97706;">Detail ➔</span>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp2-t3',
            title: 'Direktorat Penindakan, Interdiksi, & Audit',
            status: 'locked',
            summary: 'Pilar penegakan hukum, intelijen, patroli laut, pemberantasan penyelundupan narkotika, dan post-clearance audit.',
            content: `
              <div style="display:flex; flex-direction:column; gap:12px; margin: 12px 0;">
                <div class="card unit-interactive-card" data-unit-id="dit-p2" style="padding:16px; cursor:pointer; border-left:4px solid #991B1B;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#991B1B; font-size:14px;">1. Direktorat Penindakan dan Penyidikan (P2)</strong>
                      <div style="font-size:12.5px; color:#7F1D1D; margin-top:4px;">Pusat intelijen pabean/cukai, patroli laut terintegrasi, dan penyidikan tindak pidana.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#991B1B;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="dit-interdiksi" style="padding:16px; cursor:pointer; border-left:4px solid #991B1B;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#991B1B; font-size:14px;">2. Direktorat Interdiksi Narkotika</strong>
                      <div style="font-size:12.5px; color:#7F1D1D; margin-top:4px;">Pencegahan penyelundupan Narkotika (NPP) dan pembinaan Unit Anjing Pelacak K-9.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#991B1B;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="dit-audit" style="padding:16px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0B3A6F; font-size:14px;">3. Direktorat Audit Kepabeanan dan Cukai</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Audit pembukuan importir/eksportir pasca-pengeluaran barang (post-clearance audit).</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0B3A6F;">Detail ➔</span>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp2-t4',
            title: 'Direktorat IKC, KSIKC, Kombimjas, & KBP',
            status: 'locked',
            summary: 'Direktorat penunjang sistem otomasi TIK, kerja sama internasional, komunikasi publik, dan perumusan produk hukum.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="dit-ikc" style="padding:14px; cursor:pointer; border-left:4px solid #0284C7;">
                  <strong style="color:#0284C7; font-size:13px;">Dit. IKC (Informasi Kepabeanan & Cukai)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Sistem CEISA 4.0, big data, dan server.</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="dit-ksikc" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Dit. KSIKC (Kerja Sama Internasional)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Perjanjian bilateral pabean, WCO, & ASEAN.</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="dit-kombimjas" style="padding:14px; cursor:pointer; border-left:4px solid #D9B45B;">
                  <strong style="color:#854D0E; font-size:13px;">Dit. Kombimjas (Komunikasi & Bimbingan)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Contact Center Bravo 1500225 & edukasi publik.</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="dit-kbp" style="padding:14px; cursor:pointer; border-left:4px solid #475569;">
                  <strong style="color:#334155; font-size:13px;">Dit. KBP (Keberatan, Banding, & Peraturan)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Sengketa banding pengadilan pajak & advokasi.</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp2-t5',
            title: 'Tenaga Pengkaji DJBC (Eselon II)',
            status: 'locked',
            summary: 'Tiga pejabat Eselon II Tenaga Pengkaji yang bertugas menyusun telaahan, kajian strategis makro, dan rekomendasi kebijakan langsung kepada Direktur Jenderal.',
            content: `
              <div class="card unit-interactive-card" data-unit-id="tenaga-pengkaji" style="padding:18px; cursor:pointer; border-left:4px solid #0B3A6F; background:#EFF6FF; margin:12px 0;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span class="badge badge-org" style="font-size:11px;">Eselon II</span>
                    <h4 style="font-size:15px; font-weight:800; color:#1E3A8A; margin:4px 0;">Kelompok Tenaga Pengkaji DJBC</h4>
                  </div>
                  <button class="btn btn-outline" style="font-size:12px; font-weight:700;">🔍 Detail Unit</button>
                </div>
                <ul style="font-size:12.5px; color:#1E3A8A; line-height:1.7; margin:8px 0 0 0; padding-left:18px;">
                  <li>Tenaga Pengkaji Bidang Pengembangan Kapasitas dan Kinerja Organisasi</li>
                  <li>Tenaga Pengkaji Bidang Pengawasan dan Penegakan Hukum</li>
                  <li>Tenaga Pengkaji Bidang Pelayanan dan Penerimaan</li>
                </ul>
              </div>
            `
          }
        ]
      },
      {
        id: 'mp-03',
        title: 'MP 3: Organisasi Instansi Vertikal dan UPT',
        subtitle: '20 Kantor Wilayah, 3 KPU BC, 104 KPPBC, 3 BLBC, & 6 PSO',
        jp: '4 JP',
        estimatedTime: '25 Menit',
        topics: [
          {
            id: 'mp3-t1',
            title: 'Kantor Wilayah (Kanwil DJBC)',
            status: 'active',
            summary: '20 Kanwil bertindak sebagai pembina teknis regional, pengendali operasional KPPBC, pelaksana audit kepabeanan, dan pengawas kepatuhan internal di tingkat provinsi.',
            content: `
              <p style="font-size:13.5px; color:#334155; line-height:1.6;">
                Setiap Kanwil dipimpin oleh Kepala Kantor Wilayah (Eselon IIa/IIb) yang membina beberapa KPPBC di wilayah kerjanya.
              </p>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:14px 0;">
                <div class="card unit-interactive-card" data-unit-id="kanwil-aceh" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Kanwil DJBC Aceh</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Banda Aceh | Klik untuk lihat profil ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kanwil-sumut" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Kanwil DJBC Sumatera Utara</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Medan | Klik untuk lihat profil ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kanwil-jabar" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Kanwil DJBC Jawa Barat</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Bandung | Klik untuk lihat profil ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kanwil-jatim-i" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Kanwil DJBC Jawa Timur I</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Surabaya | Klik untuk lihat profil ➔</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp3-t2',
            title: 'Kantor Pelayanan Utama (KPU BC)',
            status: 'locked',
            summary: '3 KPU dibentuk di pelabuhan/bandara dengan volume devisa & lalu lintas barang raksasa, mengintegrasikan fungsi Kanwil dan KPPBC dalam satu atap mandiri.',
            content: `
              <div style="display:flex; flex-direction:column; gap:12px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="kpu-tanjung-priok" style="padding:16px; cursor:pointer; border-left:4px solid #0284C7;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0284C7; font-size:14px;">1. 🚢 KPU Bea Cukai Tipe A Tanjung Priok (Jakarta)</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Pelabuhan peti kemas internasional terbesar di Indonesia.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0284C7;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="kpu-batam" style="padding:16px; cursor:pointer; border-left:4px solid #0284C7;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0284C7; font-size:14px;">2. 🏝️ KPU Bea Cukai Tipe B Batam</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Kawasan Perdagangan Bebas dan Pelabuhan Bebas (Free Trade Zone).</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0284C7;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="kpu-soekarno-hatta" style="padding:16px; cursor:pointer; border-left:4px solid #0284C7;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0284C7; font-size:14px;">3. ✈️ KPU Bea Cukai Tipe C Soekarno-Hatta (Tangerang)</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Bandara internasional kargo udara dan penumpang internasional.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0284C7;">Detail ➔</span>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp3-t3',
            title: 'Kantor Pengawasan dan Pelayanan (KPPBC)',
            status: 'locked',
            summary: '104 KPPBC tersebar di seluruh kabupaten/kota pelabuhan dan perbatasan, terbagi dalam Tipe Madya Pabean (A, B, C) dan Tipe Pratama.',
            content: `
              <p style="font-size:13.5px; color:#334155; line-height:1.6;">
                KPPBC bertugas melakukan penerimaan dokumen PIB/PEB, penetapan tarif & nilai pabean, pemeriksaan fisik barang di lapangan, patroli darat, pelayanan cukai pabrik rokok, dan penindakan pelanggaran.
              </p>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="kppbc-bandung" style="padding:12px; cursor:pointer; border-left:3px solid #0B3A6F;">
                  <strong style="font-size:13px; color:#0B3A6F;">🏬 KPPBC TMP A Bandung</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Klik untuk lihat profil unit ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kppbc-kudus" style="padding:12px; cursor:pointer; border-left:3px solid #0B3A6F;">
                  <strong style="font-size:13px; color:#0B3A6F;">🏭 KPPBC TMC Kudus</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Klik untuk lihat profil unit ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kppbc-tanjung-perak" style="padding:12px; cursor:pointer; border-left:3px solid #0B3A6F;">
                  <strong style="font-size:13px; color:#0B3A6F;">🚢 KPPBC TMP A Tanjung Perak</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Klik untuk lihat profil unit ➔</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp3-t4',
            title: 'Unit Pelaksana Teknis (BLBC & PSO BC)',
            status: 'locked',
            summary: 'UPT memberikan dukungan keahlian laboratorium ilmiah dan sarana armada patroli laut berstandar militer.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="blbc-jakarta" style="padding:16px; cursor:pointer; border-left:4px solid #854D0E; background:#FFFDF5;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#854D0E; font-size:14px;">🔬 Balai Laboratorium Bea Cukai (BLBC)</strong>
                    <span style="font-size:11px; font-weight:700; color:#854D0E;">Detail ➔</span>
                  </div>
                  <div style="font-size:12px; color:#713F12; margin-top:6px;">
                    3 Lokasi: Jakarta (Pusat), Surabaya, dan Medan. Menguji komposisi kimiawi, spektrum tekstil, mineral, dan bahan kimia berbahaya.
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="pso-karimun" style="padding:16px; cursor:pointer; border-left:4px solid #854D0E; background:#FFFDF5;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#854D0E; font-size:14px;">⚓ Pangkalan Sarana Operasi (PSO BC)</strong>
                    <span style="font-size:11px; font-weight:700; color:#854D0E;">Detail ➔</span>
                  </div>
                  <div style="font-size:12px; color:#713F12; margin-top:6px;">
                    6 Wilayah Pangkalan: Tanjung Balai Karimun (Tipe A), Batam, Tanjung Priok, Pantoloan, Sorong, dan Kupang. Mengelola armada kapal Fast Patrol Boat (FPB).
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp3-t5',
            title: 'Perbedaan Tipe-Tipe Kantor Pelayanan Bea dan Cukai',
            status: 'locked',
            summary: 'Analisis komprehensif tipologi kantor pelayanan: KPU Tipe A/B/C vs KPPBC Tipe Madya Pabean (A/B/C), Tipe Madya Cukai (TMC), dan Tipe Pratama berdasarkan beban kerja, penerimaan, dan eselonisasi.',
            content: `
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin-bottom:20px;">
                <h4 style="font-size:15px; font-weight:800; color:#062B52; margin-bottom:10px;">4 Parameter Utama Penetapan Tipologi Kantor Pelayanan:</h4>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
                  <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-left:4px solid #0284C7; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#001631;">1. Volume Dokumen & Transaksi</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Jumlah dokumen PIB (impor), PEB (ekspor), manifes kargo, dan permohonan fasilitas kepabeanan/cukai per tahun.</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-left:4px solid #059669; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#001631;">2. Potensi Penerimaan Negara</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Besaran target dan realisasi penerimaan Bea Masuk, Bea Keluar, dan Cukai (mulai puluhan miliar hingga puluhan triliun rupiah).</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-left:4px solid #DC2626; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#001631;">3. Kerawanan & Kompleksitas Pengawasan</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Tingkat kerawanan penyelundupan di perbatasan, jalur pelayaran selat internasional, serta luas area pengawasan laut/darat.</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-left:4px solid #D97706; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#001631;">4. Karakteristik Kawasan Khusus</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Keberadaan Pelabuhan Utama, Bandara Hub Internasional, Kawasan Perdagangan Bebas (KPBPB), KEK, atau Sentra Pabrik Rokok.</div>
                  </div>
                </div>
              </div>

              <!-- Komparasi Perbedaan Utama KPU vs KPPBC -->
              <h4 style="font-size:15px; font-weight:800; color:#0B3A6F; margin:20px 0 12px 0;">Perbedaan Fundamental: KPU vs KPPBC</h4>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:20px;">
                <div style="background:#EFF6FF; border:1.5px solid #3B82F6; border-radius:10px; padding:16px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <span class="badge" style="background:#3B82F6; color:#FFFFFF; font-size:11px; font-weight:700;">KANTOR PELAYANAN UTAMA (KPU)</span>
                    <span style="font-size:12px; font-weight:800; color:#1D4ED8;">Eselon II</span>
                  </div>
                  <ul style="font-size:12.5px; color:#1E3A8A; line-height:1.6; padding-left:18px; margin:0;">
                    <li><strong>Hierarki:</strong> Bertanggung jawab <strong>langsung kepada Dirjen Bea dan Cukai</strong> (tidak di bawah Kanwil).</li>
                    <li><strong>Struktur:</strong> Konsep <em>single window / satu atap</em> menggabungkan fungsi Kanwil dan Kantor Pelayanan.</li>
                    <li><strong>Kewenangan:</strong> Memiliki Bidang Perbendaharaan & Keberatan sendiri serta Bidang Kepatuhan Internal mandiri.</li>
                    <li><strong>Eselonisasi Pejabat:</strong> Kepala Kantor Eselon IIa/IIb, Kepala Bidang Eselon III, Kepala Seksi Eselon IV.</li>
                  </ul>
                </div>

                <div style="background:#F0FDF4; border:1.5px solid #22C55E; border-radius:10px; padding:16px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <span class="badge" style="background:#16A34A; color:#FFFFFF; font-size:11px; font-weight:700;">KANTOR PENGAWASAN & PELAYANAN (KPPBC)</span>
                    <span style="font-size:12px; font-weight:800; color:#15803D;">Eselon III / IV</span>
                  </div>
                  <ul style="font-size:12.5px; color:#14532D; line-height:1.6; padding-left:18px; margin:0;">
                    <li><strong>Hierarki:</strong> Berada di bawah koordinasi dan pembinaan <strong>Kepala Kantor Wilayah (Kanwil)</strong> terkait.</li>
                    <li><strong>Struktur:</strong> Terfokus pada eksekusi teknis operasional pelayanan dan pengawasan langsung di lapangan.</li>
                    <li><strong>Kewenangan:</strong> Pengajuan keberatan dan audit kepabeanan berlanjut dikoordinasikan bersama Kanwil pembina.</li>
                    <li><strong>Eselonisasi Pejabat:</strong> Kepala Kantor Eselon IIIa/IIIb (Tipe Madya) atau Eselon IVa (Tipe Pratama).</li>
                  </ul>
                </div>
              </div>

              <!-- Rincian Tipologi & Tabel Perbandingan -->
              <h4 style="font-size:15px; font-weight:800; color:#062B52; margin:20px 0 12px 0;">Matriks Komparasi Tipe Kantor Pelayanan DJBC:</h4>
              <div style="overflow-x:auto; margin-bottom:20px; border:1px solid #E2E8F0; border-radius:10px;">
                <table style="width:100%; border-collapse:collapse; font-size:12.5px; text-align:left;">
                  <thead>
                    <tr style="background:#0B3A6F; color:#FFFFFF;">
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Tipe Kantor</th>
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Eselon Pimpinan</th>
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Atasan Langsung</th>
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Fokus & Karakteristik Wilayah</th>
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Contoh Kantor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0284C7;">KPU Tipe A</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#E0F2FE; color:#0369A1; font-weight:700;">Eselon II.a</span></td>
                      <td style="padding:10px 12px; font-weight:600;">Dirjen Bea Cukai</td>
                      <td style="padding:10px 12px;">Pelabuhan peti kemas laut internasional terbesar dengan arus devisa & kargo ekspor-impor raksasa.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPU BC Tipe A Tanjung Priok</td>
                    </tr>
                    <tr style="background:#FFFFFF; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0284C7;">KPU Tipe B</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#E0F2FE; color:#0369A1; font-weight:700;">Eselon II.b</span></td>
                      <td style="padding:10px 12px; font-weight:600;">Dirjen Bea Cukai</td>
                      <td style="padding:10px 12px;">Kawasan Perdagangan Bebas dan Pelabuhan Bebas (KPBPB/FTZ) dengan perlakuan pabean khusus.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPU BC Tipe B Batam</td>
                    </tr>
                    <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0284C7;">KPU Tipe C</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#E0F2FE; color:#0369A1; font-weight:700;">Eselon II.b</span></td>
                      <td style="padding:10px 12px; font-weight:600;">Dirjen Bea Cukai</td>
                      <td style="padding:10px 12px;">Bandara internasional hub udara, terminal kargo pesawat, penumpang mancanegara, & PJT.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPU BC Tipe C Soekarno-Hatta</td>
                    </tr>
                    <tr style="background:#FFFFFF; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0B3A6F;">KPPBC TMP A</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:700;">Eselon III.a</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Pelabuhan besar/kawasan industri padat fasilitas (Kawasan Berikat, KITE) dengan volume dokumen sangat tinggi.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">TMP A Tanjung Perak, TMP A Bandung, TMP A Semarang</td>
                    </tr>
                    <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0B3A6F;">KPPBC TMP B</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:700;">Eselon III.a</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Pusat ekonomi regional provinsi, pelabuhan ekspor komoditas alam, dan bandara internasional daerah.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">TMP B Surakarta, TMP B Pontianak, TMP B Palembang</td>
                    </tr>
                    <tr style="background:#FFFFFF; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0B3A6F;">KPPBC TMP C</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:700;">Eselon III.b</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Wilayah kota/kabupaten dengan fokus industri tertentu atau penanganan pos internasional.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">TMP C Cirebon, TMP C Magelang, TMP C Kantor Pos Pasar Baru</td>
                    </tr>
                    <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#D97706;">KPPBC TMC (Cukai)</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:700;">Eselon III.a / III.b</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Sentra industri hasil tembakau (rokok) & MMEA dengan target penerimaan cukai skala triliunan.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPPBC TMC Kudus, TMC Kediri, TMC Malang</td>
                    </tr>
                    <tr style="background:#FFFFFF;">
                      <td style="padding:10px 12px; font-weight:700; color:#475569;">KPPBC Tipe Pratama</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#F1F5F9; color:#475569; font-weight:700;">Eselon IV.a</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Pos Lintas Batas Negara (PLBN) darat atau pelabuhan pulau terpencil dengan transaksi terbatas.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPPBC Pratama di kawasan perbatasan darat/kepulauan terluar</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Interactive Unit Explorer Cards -->
              <h4 style="font-size:14px; font-weight:700; color:#001631; margin-bottom:10px;">Eksplorasi Profil Unit Pelayanan di Side Panel:</h4>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
                <div class="card unit-interactive-card" data-unit-id="kpu-tanjung-priok" style="padding:12px; cursor:pointer; border-left:3px solid #0284C7;">
                  <strong style="font-size:13px; color:#0284C7;">🚢 KPU Tipe A Tg. Priok</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contoh KPU Laut Terbesar ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kpu-soekarno-hatta" style="padding:12px; cursor:pointer; border-left:3px solid #0284C7;">
                  <strong style="font-size:13px; color:#0284C7;">✈️ KPU Tipe C Soetta</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contoh KPU Udara Terbesar ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kppbc-tanjungperak" style="padding:12px; cursor:pointer; border-left:3px solid #0B3A6F;">
                  <strong style="font-size:13px; color:#0B3A6F;">🚢 KPPBC TMP A Tg. Perak</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contoh TMP A Pelabuhan ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kppbc-kudus" style="padding:12px; cursor:pointer; border-left:3px solid #D97706;">
                  <strong style="font-size:13px; color:#D97706;">🏭 KPPBC TMC Kudus</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contoh Sentra Cukai Rokok ➔</div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: 'mp-04',
        title: 'MP 4: Jabatan Fungsional di Lingkungan DJBC',
        subtitle: 'Kategori Keahlian, Keterampilan, Jenjang Karir, & Butir Kegiatan',
        jp: '2 JP',
        estimatedTime: '15 Menit',
        topics: [
          {
            id: 'mp4-t1',
            title: 'Pengertian & Kategori Jabatan Fungsional',
            status: 'active',
            summary: 'Jabatan Fungsional (JF) adalah sekelompok jabatan yang berisi fungsi dan tugas berkaitan dengan pelayanan fungsional berbasis keahlian dan keterampilan tertentu.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin: 14px 0;">
                <div style="background:#F8FAFC; border:1.5px solid #0B3A6F; border-radius:10px; padding:16px;">
                  <span style="font-size:12px; font-weight:700; color:#0B3A6F; text-transform:uppercase;">Kategori Keahlian</span>
                  <div style="font-size:13px; color:#334155; margin-top:6px; line-height:1.5;">
                    Dominasi karakteristik pekerjaan pada ranah <strong>kognitif</strong> (pengetahuan, analisis, dan perumusan kebijakan). Kualifikasi pendidikan minimal S1 / D-IV.
                  </div>
                </div>
                <div style="background:#F8FAFC; border:1.5px solid #0284C7; border-radius:10px; padding:16px;">
                  <span style="font-size:12px; font-weight:700; color:#0284C7; text-transform:uppercase;">Kategori Keterampilan</span>
                  <div style="font-size:13px; color:#334155; margin-top:6px; line-height:1.5;">
                    Dominasi karakteristik pekerjaan pada ranah <strong>psikomotorik</strong> (prosedural teknis operasional). Kualifikasi pendidikan minimal SMA / D-III.
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp4-t2',
            title: 'Jenjang & Koefisien Angka Kredit',
            status: 'locked',
            summary: 'Jenjang jabatan merefleksikan tingkatan kompleksitas lingkup pekerjaan dan angka kredit tahunan.',
            content: `
              <div style="overflow-x:auto; margin:14px 0;">
                <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
                  <thead>
                    <tr style="background:#062B52; color:#FFFFFF;">
                      <th style="padding:10px 14px;">Kategori</th>
                      <th style="padding:10px 14px;">Jenjang Jabatan</th>
                      <th style="padding:10px 14px;">Pangkat / Golongan</th>
                      <th style="padding:10px 14px;">Koefisien AK/Tahun</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#FFFFFF;">
                      <td rowspan="4" style="padding:10px 14px; font-weight:700; color:#0B3A6F; vertical-align:top; border-right:1px solid #E2E8F0;">Keahlian</td>
                      <td style="padding:10px 14px; font-weight:600;">Ahli Utama</td>
                      <td style="padding:10px 14px;">IV/d – IV/e</td>
                      <td style="padding:10px 14px; font-weight:700; color:#059669;">50</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#F8FAFC;">
                      <td style="padding:10px 14px; font-weight:600;">Ahli Madya</td>
                      <td style="padding:10px 14px;">IV/a – IV/c</td>
                      <td style="padding:10px 14px; font-weight:700; color:#059669;">37,5</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#FFFFFF;">
                      <td style="padding:10px 14px; font-weight:600;">Ahli Muda</td>
                      <td style="padding:10px 14px;">III/c – III/d</td>
                      <td style="padding:10px 14px; font-weight:700; color:#059669;">25</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#F8FAFC;">
                      <td style="padding:10px 14px; font-weight:600;">Ahli Pertama</td>
                      <td style="padding:10px 14px;">III/a – III/b</td>
                      <td style="padding:10px 14px; font-weight:700; color:#059669;">12,5</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#FFFFFF;">
                      <td rowspan="3" style="padding:10px 14px; font-weight:700; color:#0284C7; vertical-align:top; border-right:1px solid #E2E8F0;">Keterampilan</td>
                      <td style="padding:10px 14px; font-weight:600;">Penyelia</td>
                      <td style="padding:10px 14px;">III/c – III/d</td>
                      <td style="padding:10px 14px; font-weight:700; color:#0284C7;">25</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#F8FAFC;">
                      <td style="padding:10px 14px; font-weight:600;">Mahir</td>
                      <td style="padding:10px 14px;">III/a – III/b</td>
                      <td style="padding:10px 14px; font-weight:700; color:#0284C7;">12,5</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#FFFFFF;">
                      <td style="padding:10px 14px; font-weight:600;">Terampil</td>
                      <td style="padding:10px 14px;">II/b – II/d</td>
                      <td style="padding:10px 14px; font-weight:700; color:#0284C7;">5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `
          },
          {
            id: 'mp4-t3',
            title: 'JF Pemeriksa Bea dan Cukai (PBC)',
            status: 'locked',
            summary: 'JF PBC merupakan ujung tombak fungsional yang memiliki kewenangan mandiri dalam pemeriksaan dan penetapan dokumen kepabeanan dan cukai.',
            content: `
              <p style="font-size:13.5px; color:#334155; line-height:1.6;">
                Ruang lingkup butir kegiatan JF PBC meliputi:
              </p>
              <ul style="font-size:13px; color:#334155; line-height:1.7; padding-left:18px; margin:0 0 16px 0;">
                <li>Pemeriksaan fisik barang impor/ekspor menggunakan pemindai X-Ray atau pembongkaran kemasan.</li>
                <li>Penelitian dan penetapan klasifikasi pos tarif HS Code dan nilai pabean (SPTNP).</li>
                <li>Pelaksanaan audit kepabeanan dan cukai atas pembukuan importir/pabrik BKC.</li>
                <li>Kegiatan intelijen pabean, analisis citra manifest, patroli laut, dan penindakan penyelundupan.</li>
              </ul>

              <div class="card unit-interactive-card" data-unit-id="dit-teknis-kepab" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="color:#0B3A6F; font-size:13px;">Unit Pembina Teknis Fungsional: Dit. Teknis Kepabeanan</strong>
                    <div style="font-size:12px; color:#64748B;">Klik untuk membuka rincian tugas dan fungsi unit pembina ➔</div>
                  </div>
                  <span style="font-size:12px; font-weight:700; color:#0B3A6F;">Detail ➔</span>
                </div>
              </div>
            `
          },
          {
            id: 'mp4-t4',
            title: 'Mekanisme Pengangkatan dalam JF',
            status: 'locked',
            summary: 'Pengangkatan ke dalam JF dilakukan melalui 4 jalur: Pengangkatan Pertama (CPNS), Penyesuaian/Inpassing, Perpindahan Jabatan, dan Promosi.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin:12px 0;">
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">1. Pengangkatan Pertama:</strong> Formasi Calon PNS untuk Ahli Pertama atau Terampil.
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">2. Penyesuaian (Inpassing):</strong> Penyetaraan jabatan struktural ke dalam JF.
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">3. Perpindahan Jabatan:</strong> Perpindahan horizontal antar rumpun JF atau pimpinan tinggi.
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">4. Promosi:</strong> Kenaikan jenjang jabatan fungsional setingkat lebih tinggi melalui uji kompetensi.
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: 'mp-05',
        title: 'MP 5: Interdependensi Tugas dan Fungsi DJBC',
        subtitle: 'Sinergi CIQ, Perbantuan TNI/Polri, Lartas K/L (INSW), & Forum Internasional',
        jp: '2 JP',
        estimatedTime: '15 Menit',
        topics: [
          {
            id: 'mp5-t1',
            title: 'Kerja Sama CIQ di Pintu Masuk Negara',
            status: 'active',
            summary: 'Konsep sinergi Customs, Immigration, and Quarantine (CIQ) di pelabuhan internasional, bandara, dan Pos Lintas Batas Negara (PLBN).',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin: 14px 0;">
                <div class="card unit-interactive-card" data-unit-id="djbc" style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; padding:16px; cursor:pointer;">
                  <div style="font-size:24px; margin-bottom:4px;">📦</div>
                  <strong style="color:#1E40AF; font-size:13.5px;">DJBC (Customs) ➔</strong>
                  <div style="font-size:12px; color:#1E3A8A; margin-top:4px;">Pengawasan dan pemungutan bea atas <strong>lalu lintas barang</strong>.</div>
                </div>
                <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; padding:16px;">
                  <div style="font-size:24px; margin-bottom:4px;">🛂</div>
                  <strong style="color:#1E40AF; font-size:13.5px;">Ditjen Imigrasi</strong>
                  <div style="font-size:12px; color:#1E3A8A; margin-top:4px;">Pemeriksaan paspor, visa, dan <strong>lalu lintas orang / pelintas batas</strong>.</div>
                </div>
                <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; padding:16px;">
                  <div style="font-size:24px; margin-bottom:4px;">🌱</div>
                  <strong style="color:#1E40AF; font-size:13.5px;">Badan Karantina Indonesia</strong>
                  <div style="font-size:12px; color:#1E3A8A; margin-top:4px;">Pengawasan karantina atas <strong>hewan, ikan, dan tumbuhan</strong>.</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp5-t2',
            title: 'Perbantuan TNI, Polri, & Aparat Penegak Hukum',
            status: 'locked',
            summary: 'Mandat Pasal 76 UU Kepabeanan dan Pasal 34 UU Cukai memberikan kewenangan Pejabat Bea Cukai meminta bantuan TNI/Polri dalam penindakan berisiko tinggi.',
            content: `
              <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:10px; padding:16px; margin: 12px 0;">
                <div style="font-size:13.5px; font-weight:700; color:#991B1B; margin-bottom:6px;">Dasar Hukum Sinergi Taktis:</div>
                <p style="font-size:12.5px; line-height:1.6; color:#7F1D1D; margin:0;">
                  <em>"Pejabat Bea dan Cukai dalam melaksanakan tugas pengawasan dan penindakan dapat meminta bantuan Kepolisian RI, Tentara Nasional Indonesia, Badan Keamanan Laut (Bakamla), dan/atau instansi lainnya; dan atas permintaan tersebut instansi yang diminta berkewajiban untuk memenuhinya."</em> (Pasal 76 UU Kepabeanan jo Pasal 34 UU Cukai).
                </p>
              </div>

              <div class="card unit-interactive-card" data-unit-id="dit-p2" style="padding:14px; cursor:pointer; border-left:4px solid #991B1B; margin-top:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="color:#991B1B; font-size:13px;">Unit Pelaksana Kerja Sama Operasi: Dit. Penindakan & Penyidikan</strong>
                    <div style="font-size:12px; color:#64748B;">Klik untuk membuka detail unit di side panel ➔</div>
                  </div>
                  <span style="font-size:12px; font-weight:700; color:#991B1B;">Detail ➔</span>
                </div>
              </div>
            `
          },
          {
            id: 'mp5-t3',
            title: 'Pengawasan Larangan & Pembatasan (Lartas) & INSW',
            status: 'locked',
            summary: 'DJBC bertindak sebagai garda batas penjaga kebijakan tata niaga impor/ekspor yang diterbitkan oleh K/L teknis.',
            content: `
              <p style="font-size:13.5px; color:#334155; line-height:1.6;">
                Semua barang dapat diekspor/diimpor kecuali yang dilarang atau dibatasi (Lartas). Aturan Lartas dari instansi teknis terintegrasi melalui <strong>Indonesia National Single Window (INSW)</strong>:
              </p>
              <ul style="font-size:12.5px; color:#334155; line-height:1.7; padding-left:18px; margin:0;">
                <li><strong>Kementerian Perdagangan:</strong> Persetujuan Impor (PI), Laporan Surveyor (LS).</li>
                <li><strong>BPOM & Kemenkes:</strong> Izin Edar obat, suplemen, kosmetik, dan alat kesehatan.</li>
                <li><strong>Kementerian Pertanian:</strong> Izin pemasukan bibit unggul dan komoditas pangan.</li>
                <li><strong>BAPETEN:</strong> Pengawasan bahan radioaktif dan nuklir.</li>
              </ul>
            `
          },
          {
            id: 'mp5-t4',
            title: 'Kiprah DJBC dalam Forum & Kerja Sama Internasional',
            status: 'locked',
            summary: 'Keikutsertaan aktif DJBC dalam harmonisasi kepabeanan global dan pertukaran intelijen internasional.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="dit-ksikc" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Dit. Kerja Sama Internasional (KSIKC)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Klik untuk melihat tusi kerja sama WCO, ASEAN, & RILO AP ➔</div>
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">World Customs Organization (WCO)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:2px;">Harmonized System (HS Code), SAFE Framework of Standards, dan Kyoto Convention.</div>
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">ASEAN Customs Single Window</strong>
                  <div style="font-size:12px; color:#475569; margin-top:2px;">Pertukaran e-Form D Surat Keterangan Asal (SKA) otomatis antar negara ASEAN.</div>
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">RILO AP (Regional Intelligence)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:2px;">Pertukaran data intelijen penegakan hukum narkotika dan satwa langka lintas negara.</div>
                </div>
              </div>
            `
          }
        ]
      }
    ];
  }

  render() {
    if (!this.container) return;

    const activeModule = this.modules[this.currentModuleIndex] || this.modules[0];
    const activeTopic = activeModule.topics[this.currentTopicIndex] || activeModule.topics[0];

    this.container.innerHTML = `
      <div class="learning-page-wrapper" style="padding: 24px 32px; max-width: 1240px; margin: 0 auto; width: 100%;">
        <!-- Header Bar with Breadcrumb and Tour Button -->
        <div class="learning-header-bar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; gap: 12px; width: 100%;">
          <!-- Breadcrumb Bar -->
          <div class="learning-breadcrumb-bar" style="display:flex; align-items:center; gap:8px; font-size:13px; color:#64748B; flex:1; min-width:0; overflow:hidden;">
            <span class="learning-breadcrumb-module" style="display:flex; align-items:center; gap:5px; font-weight:700; color:#0B3A6F; white-space:nowrap; flex-shrink:0;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              ${activeModule.title.split(':')[0]}
            </span>
            <span class="learning-breadcrumb-sep" style="color:#94A3B8; font-weight:600; flex-shrink:0;">›</span>
            <span class="learning-breadcrumb-topic" style="font-weight:700; color:#001631; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${activeTopic.title}">${activeTopic.title}</span>
          </div>

          <!-- Tutorial Beacon Trigger Button -->
          <button id="learning-tour-btn" class="btn btn-outline learning-tour-btn" style="font-size:12px; font-weight:600; padding:5px 12px; gap:6px; border-radius:20px; cursor:pointer; flex-shrink:0; white-space:nowrap; display:flex; align-items:center;" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.startLearningTour(true);}" title="Buka Panduan Interaktif Modul">
            <span>💡</span>
            <span class="learning-tour-btn-text">Panduan Modul</span>
          </button>
        </div>

        <!-- Module Selector Tabs (MP 1 s.d. MP 5) -->
        <div id="learning-module-tabs" style="display:flex; gap:10px; margin-bottom: 24px; border-bottom:1px solid #E2E8F0; padding-bottom:14px; overflow-x:auto;">
          ${this.modules.map((mod, idx) => `
            <button class="btn ${idx === this.currentModuleIndex ? 'btn-primary' : 'btn-outline'}" data-mod-idx="${idx}" style="font-size:13px; font-weight:600; white-space:nowrap; padding:8px 16px;">
              ${mod.title.split(':')[0]} (${mod.jp})
            </button>
          `).join('')}
        </div>

        <!-- Grid Layout: Sub-Topic Stepper (Left) & Lesson Content (Right) -->
        <div class="learning-content-grid" style="display:grid; grid-template-columns: 290px 1fr; gap: 28px; align-items:flex-start;">
          <!-- Left Column: Vertical Sub-Topic Stepper -->
          <div id="learning-stepper-sidebar" class="card" style="padding: 20px; position:sticky; top: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <span style="font-size: 14px; font-weight: 700; color: #001631;">Sub-Topik Modul</span>
              <span class="badge badge-org" style="font-size:11px;">${activeModule.jp}</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:4px; position:relative;">
              <div style="position:absolute; left:25px; top:15px; bottom:15px; width:2px; background:#E2E8F0; z-index:1;"></div>

              ${activeModule.topics.map((t, idx) => {
                const isSelected = idx === this.currentTopicIndex;
                const statusClass = isSelected ? 'active' : (t.status === 'completed' ? 'completed' : (t.status === 'locked' ? 'locked' : ''));
                return `
                  <div class="learning-stepper-item ${statusClass}" data-topic-idx="${idx}">
                    <div class="learning-stepper-dot">
                      ${isSelected ? '▶' : (t.status === 'completed' ? '✓' : (idx + 1))}
                    </div>
                    <div style="flex:1;">
                      <div style="font-size:13px; font-weight:${isSelected ? '700' : '600'}; color:${isSelected ? '#0B3A6F' : '#334155'};">
                        ${t.title}
                      </div>
                      <div style="font-size:11px; color:#94A3B8; margin-top:2px;">
                        ${isSelected ? 'Sedang Dipelajari' : (t.status === 'completed' ? 'Selesai' : 'Siap Dibaca')}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Right Column: Main Lesson Content Area -->
          <div id="learning-lesson-content" class="card" style="padding: 32px;">
            <!-- Lesson Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px; border-bottom:1px solid #E2E8F0; padding-bottom: 16px;">
              <div>
                <span class="badge badge-policy" style="font-size:11.5px; font-weight:700; text-transform:uppercase;">
                  ${activeModule.title} • Sub-Topik ${this.currentTopicIndex + 1} dari ${activeModule.topics.length}
                </span>
                <h2 style="font-size: 22px; font-weight: 800; color: #001631; margin: 8px 0 4px 0;">
                  ${activeTopic.title}
                </h2>
                <div style="font-size: 13px; color: #64748B;">
                  ${activeModule.subtitle} (Alokasi: <strong>${activeModule.jp}</strong>)
                </div>
              </div>
            </div>

            <!-- Summary Box -->
            <div style="background:#F8FAFC; border-left:4px solid #0B3A6F; border-radius:4px; padding:16px 20px; margin-bottom: 24px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #0B3A6F; text-transform: uppercase; margin-bottom: 4px;">
                💡 Ringkasan & Kompetensi Dasar
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0;">
                ${activeTopic.summary}
              </p>
            </div>

            <!-- Detailed Content with Clickable Unit Cards -->
            <div style="margin-bottom: 32px;">
              ${activeTopic.content}
            </div>

            <!-- Lesson Navigation Action Buttons -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #E2E8F0; padding-top: 24px; flex-wrap:wrap; gap:12px;">
              <button id="btn-explore-topic-tree" class="btn btn-outline" style="font-size:13px; font-weight:600; gap:6px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                Buka di Bagan Organisasi
              </button>

              <div style="display:flex; gap:10px;">
                ${this.currentTopicIndex > 0 ? `
                  <button id="btn-prev-topic" class="btn btn-outline" style="font-size:13px; font-weight:600;">
                    ← Topik Sebelumnya
                  </button>
                ` : ''}

                <button id="btn-next-topic" class="btn btn-primary" style="font-size:13px; font-weight:700; gap:6px;">
                  <span>${this.currentTopicIndex < activeModule.topics.length - 1 ? 'Lanjut ke Topik Berikutnya →' : (this.currentModuleIndex < this.modules.length - 1 ? 'Lanjut ke Modul Berikutnya →' : 'Mulai Uji Kasus & Kuis 🎯')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Module Selector event listeners
    this.container.querySelectorAll('[data-mod-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentModuleIndex = parseInt(btn.getAttribute('data-mod-idx'), 10);
        this.currentTopicIndex = 0;
        this.render();
      });
    });

    // Attach Sub-Topic Stepper click event listeners
    this.container.querySelectorAll('[data-topic-idx]').forEach(item => {
      item.addEventListener('click', () => {
        this.currentTopicIndex = parseInt(item.getAttribute('data-topic-idx'), 10);
        this.render();
      });
    });

    // Attach Clickable Unit listeners to open DetailPanel
    this.container.querySelectorAll('[data-unit-id]').forEach(unitEl => {
      unitEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const unitId = unitEl.getAttribute('data-unit-id');
        if (unitId && this.onSelectUnit) {
          this.onSelectUnit(unitId);
        }
      });
    });

    // Previous Topic Button
    const prevBtn = this.container.querySelector('#btn-prev-topic');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentTopicIndex > 0) {
          this.currentTopicIndex--;
          this.render();
        }
      });
    }

    // Next Topic Button
    const nextBtn = this.container.querySelector('#btn-next-topic');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentTopicIndex < activeModule.topics.length - 1) {
          activeTopic.status = 'completed';
          this.currentTopicIndex++;
          this.render();
        } else if (this.currentModuleIndex < this.modules.length - 1) {
          this.currentModuleIndex++;
          this.currentTopicIndex = 0;
          this.render();
        } else {
          this.onNavigate('view-quiz');
        }
      });
    }

    // Open Topic in Explorer Tree
    const exploreBtn = this.container.querySelector('#btn-explore-topic-tree');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        this.onNavigate('view-explorer');
      });
    }
  }
}


/* --- process-flow.js --- */

/**
 * process-flow.js — Business Process Flow & SOP Interactive Catalog & Modal Detail Engine.
 * 1. Initial State: Displays interactive list/catalog of all 8 DJBC Business Processes & SOPs with filters.
 * 2. On Selection: Opens a comprehensive pop-up modal containing visual timeline stepper, detailed steps,
 *    involved unit chips (with side panel bridge), document outputs, and previous/next process navigation.
 */



class ProcessFlowEngine {
  constructor(containerEl, processData, onSelectUnit, onNavigateUnit) {
    this.container = containerEl;
    this.processData = processData && processData.proses ? processData.proses : (Array.isArray(processData) ? processData : []);
    this.onSelectUnit = onSelectUnit || (() => {});
    this.onNavigateUnit = onNavigateUnit || (() => {});
    this.currentProcessIndex = 0;
    this.currentStepIndex = 0;
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.isModalOpen = false;
    this.boundKeyHandler = null;

    this.initKeyboardListener();
  }

  initKeyboardListener() {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    if (this.boundKeyHandler && window.removeEventListener) {
      window.removeEventListener('keydown', this.boundKeyHandler);
    }
    this.boundKeyHandler = (e) => {
      // Only process when container is visible in DOM
      if (!this.container || !this.container.offsetParent) return;

      if (e.key === 'Escape' && this.isModalOpen) {
        e.preventDefault();
        this.closeModal();
      } else if (this.isModalOpen) {
        if (e.altKey && e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevProcess();
        } else if (e.altKey && e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextProcess();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevStep();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextStep();
        }
      }
    };
    window.addEventListener('keydown', this.boundKeyHandler);
  }

  setProcessData(data) {
    this.processData = data && data.proses ? data.proses : (Array.isArray(data) ? data : []);
    this.currentProcessIndex = 0;
    this.currentStepIndex = 0;
    this.render();
  }

  openModal(processIndex = 0, stepIndex = 0) {
    this.currentProcessIndex = Math.max(0, Math.min(processIndex, this.processData.length - 1));
    this.currentStepIndex = stepIndex;
    this.isModalOpen = true;
    this.render();
  }

  closeModal() {
    this.isModalOpen = false;
    this.render();
  }

  nextProcess() {
    if (this.currentProcessIndex < this.processData.length - 1) {
      this.currentProcessIndex++;
      this.currentStepIndex = 0;
      this.render();
    }
  }

  prevProcess() {
    if (this.currentProcessIndex > 0) {
      this.currentProcessIndex--;
      this.currentStepIndex = 0;
      this.render();
    }
  }

  nextStep() {
    const currentProcess = this.processData[this.currentProcessIndex];
    if (currentProcess && currentProcess.tahapan && this.currentStepIndex < currentProcess.tahapan.length - 1) {
      this.currentStepIndex++;
      this.render();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.currentStepIndex = Math.max(0, this.currentStepIndex);
      this.render();
    }
  }

  goToStep(idx) {
    this.currentStepIndex = idx;
    this.render();
  }

  filterProcesses() {
    return this.processData.filter(proc => {
      const matchCategory = this.selectedCategory === 'ALL' || proc.kategori === this.selectedCategory;
      const query = this.searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        proc.nama.toLowerCase().includes(query) ||
        (proc.deskripsi_singkat && proc.deskripsi_singkat.toLowerCase().includes(query)) ||
        (proc.dasar_hukum_utama && proc.dasar_hukum_utama.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });
  }

  render() {
    if (!this.container) return;

    if (!this.processData.length) {
      this.container.innerHTML = `<div style="padding:40px; text-align:center; color:#64748B;">Data alur proses tidak ditemukan.</div>`;
      return;
    }

    const filtered = this.filterProcesses();
    const categories = ['ALL', ...new Set(this.processData.map(p => p.kategori).filter(Boolean))];

    const currentProcess = this.processData[this.currentProcessIndex] || this.processData[0];
    const steps = currentProcess.tahapan || [];
    const activeStep = steps[this.currentStepIndex] || steps[0] || {};
    const totalProcesses = this.processData.length;
    const totalSteps = steps.length;

    // Build Main List View HTML
    const listHtml = `
      <div class="process-catalog-view" style="padding: 12px 20px; max-width: 1400px; margin: 0 auto; width: 100%; height: calc(100vh - 76px); display: flex; flex-direction: column; box-sizing: border-box; overflow-y: auto; font-family:'Poppins',sans-serif;">
        
        <!-- Header Banner & Intro -->
        <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 8px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
              <span class="badge" style="background:#0B3A6F15; color:#0B3A6F; font-size:10px; font-weight:700; border:1px solid #0B3A6F30; text-transform:uppercase; padding: 2px 6px;">
                STANDAR OPERASIONAL PROSEDUR (SOP)
              </span>
              <span class="badge" style="background:#FEF3C7; color:#92400E; font-size:10px; font-weight:700; border:1px solid #FDE68A; padding: 2px 6px;">
                ${this.processData.length} Alur Bisnis Utama
              </span>
            </div>
            <h2 style="font-size: 18px; font-weight: 800; color: #001631; margin: 0; line-height: 1.2;">
              Katalog Alur Kerja &amp; SOP DJBC
            </h2>
            <p style="font-size: 11.5px; color: #64748B; margin: 2px 0 0 0;">
              Pilih alur kerja untuk membuka tahapan proses interaktif, SLA, dan unit kerja yang terlibat.
            </p>
          </div>

          <!-- Search & Filter Controls -->
          <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
            <!-- Search Box -->
            <div style="position: relative; min-width: 220px;">
              <input type="text" id="sop-search-input" placeholder="Cari SOP, regulasi, kata kunci..." value="${this.searchQuery}" style="width: 100%; padding: 5px 10px 5px 28px; font-size: 11.5px; border: 1px solid #CBD5E1; border-radius: 6px; background: #FFFFFF; font-family: inherit;">
              <span style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #94A3B8; font-size: 12px;">🔍</span>
            </div>

            <!-- Tutorial Beacon Trigger Button -->
            <button id="process-tour-btn" class="btn btn-outline" style="font-size:11px; font-weight:600; padding:4px 10px; gap:4px; border-radius:16px; cursor:pointer;" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.startProcessTour(true);}" title="Buka Panduan Interaktif Alur Kerja">
              <span>💡</span>
              <span>Panduan</span>
            </button>
          </div>
        </div>

        <!-- Category Filter Tabs -->
        <div id="sop-categories-container" style="display: flex; gap: 5px; margin-bottom: 10px; flex-wrap: wrap;">
          ${categories.map(cat => {
            const isSelected = this.selectedCategory === cat;
            const count = cat === 'ALL' ? this.processData.length : this.processData.filter(p => p.kategori === cat).length;
            const label = cat === 'ALL' ? 'Semua Alur' : cat;
            return `
              <button class="sop-filter-btn" data-category="${cat}" style="padding: 4px 10px; border-radius: 16px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: 1px solid ${isSelected ? '#0B3A6F' : '#E2E8F0'}; background: ${isSelected ? '#0B3A6F' : '#FFFFFF'}; color: ${isSelected ? '#FFFFFF' : '#475569'}; font-family: inherit;">
                ${label} (${count})
              </button>
            `;
          }).join('')}
        </div>

        <!-- SOP Cards Grid List (4 Columns Compact - Fits 1 Screen) -->
        <div id="sop-cards-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 10px;">
          ${filtered.map((proc) => {
            const originalIndex = this.processData.indexOf(proc);
            const stepCount = proc.tahapan ? proc.tahapan.length : 0;
            return `
              <div class="card sop-card-item" data-process-idx="${originalIndex}">
                <div>
                  <!-- Top Badge Line -->
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; flex-wrap: wrap; gap: 4px;">
                    <span class="badge" style="background: #F1F5F9; color: #0B3A6F; font-size: 9.5px; font-weight: 700; border: 1px solid #E2E8F0; padding: 1px 5px;">
                      ${proc.kategori || 'SOP DJBC'}
                    </span>
                    <span style="font-size: 9.5px; font-weight: 800; color: #D9B45B; background: #0B3A6F; padding: 1px 5px; border-radius: 3px;">
                      SOP #${String(originalIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <!-- SOP Title -->
                  <h3 style="font-size: 12.5px; font-weight: 800; color: #001631; margin: 0 0 3px 0; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${proc.nama}">
                    ${proc.nama}
                  </h3>

                  <!-- SOP Short Description -->
                  <p style="font-size: 11px; color: #64748B; line-height: 1.35; margin: 0 0 6px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${proc.deskripsi_singkat || ''}
                  </p>
                </div>

                <!-- Footer Metadata & Action -->
                <div>
                  <div style="display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 6px; font-size: 10px;">
                    <span class="badge" style="background:#EFF6FF; color:#1D4ED8; font-weight:600; border:1px solid #DBEAFE; padding: 1px 5px;">
                      📌 ${stepCount} Tahap
                    </span>
                    ${proc.sla_total ? `
                      <span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:600; border:1px solid #FDE68A; padding: 1px 5px;">
                        ⏱ ${proc.sla_total}
                      </span>
                    ` : ''}
                    ${proc.dasar_hukum_utama ? `
                      <span class="badge" style="background:#F8FAFC; color:#64748B; font-weight:500; border:1px solid #E2E8F0; padding: 1px 5px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${proc.dasar_hukum_utama}">
                        ⚖ ${proc.dasar_hukum_utama}
                      </span>
                    ` : ''}
                  </div>

                  <button class="btn btn-primary btn-open-sop" data-process-idx="${originalIndex}" style="width: 100%; justify-content: center; padding: 5px 8px; font-size: 11px; font-weight: 700; border-radius: 6px; min-height: 28px;">
                    <span>Buka Detail Alur</span>
                    <span style="font-size: 12px;">➔</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${filtered.length === 0 ? `
          <div style="padding: 30px; text-align: center; background: #FFFFFF; border-radius: 12px; border: 1px dashed #CBD5E1; color: #64748B;">
            <div style="font-size: 28px; margin-bottom: 6px;">🔍</div>
            <div style="font-weight: 700; font-size: 14px; color: #001631;">Tidak ada Alur Kerja yang cocok</div>
            <div style="font-size: 12px; margin-top: 4px;">Coba ubah kata kunci pencarian atau pilih kategori lain.</div>
          </div>
        ` : ''}

      </div>
    `;

    // Build Modal Pop-Up HTML if Modal is Open
    const modalHtml = this.isModalOpen ? `
      <div id="sop-detail-modal-overlay" style="position: fixed; inset: 0; background: rgba(6, 35, 71, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; font-family:'Poppins',sans-serif; animation: fadeIn 0.2s ease;">
        
        <div id="sop-detail-modal-dialog" style="background: #FFFFFF; border-radius: 18px; width: 100%; max-width: 1200px; max-height: 92vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(217, 180, 91, 0.25); overflow: hidden; position: relative;">
          
          <!-- MODAL HEADER: Title, Badges & Process Navigation -->
          <div style="padding: 14px 20px; background: linear-gradient(135deg, #0B3A6F 0%, #062347 100%); color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 2px solid #D9B45B; flex-shrink: 0;">
            
            <!-- Left: Title & Badges -->
            <div style="flex: 1; min-width: 240px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                <span style="font-size: 11px; font-weight: 800; color: #001631; background: #D9B45B; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
                  ${currentProcess.kategori || 'SOP & ALUR KERJA'}
                </span>
                <span style="font-size: 11px; font-weight: 700; color: #FFFFFF; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 4px;">
                  Alur ${this.currentProcessIndex + 1} / ${totalProcesses}
                </span>
                ${currentProcess.sla_total ? `
                  <span style="font-size: 11px; font-weight: 600; color: #FEF3C7; background: rgba(254, 243, 199, 0.15); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(254, 243, 199, 0.3);">
                    ⏱ Total SLA: ${currentProcess.sla_total}
                  </span>
                ` : ''}
              </div>
              <h2 style="font-size: 17px; font-weight: 800; color: #FFFFFF; margin: 0; line-height: 1.3;">
                ${currentProcess.nama}
              </h2>
            </div>

            <!-- Right: Process Navigation Controls & Close Button -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <button id="modal-btn-prev-process" class="btn" style="background: rgba(255,255,255,0.12); color: #FFFFFF; border: 1px solid rgba(255,255,255,0.25); padding: 5px 10px; font-size: 11.5px; font-weight: 700; border-radius: 6px; cursor: ${this.currentProcessIndex === 0 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentProcessIndex === 0 ? '0.4' : '1'};" ${this.currentProcessIndex === 0 ? 'disabled' : ''} title="Alur Sebelumnya (Alt+Left)">
                ← Alur Sebelumnya
              </button>

              <select id="modal-process-dropdown" style="padding: 5px 8px; font-size: 11.5px; font-weight: 700; color: #0B3A6F; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 6px; cursor: pointer; max-width: 170px;">
                ${this.processData.map((proc, idx) => `
                  <option value="${idx}" ${idx === this.currentProcessIndex ? 'selected' : ''}>
                    Alur ${idx + 1}: ${proc.nama.split('(')[0].trim()}
                  </option>
                `).join('')}
              </select>

              <button id="modal-btn-next-process" class="btn" style="background: rgba(255,255,255,0.12); color: #FFFFFF; border: 1px solid rgba(255,255,255,0.25); padding: 5px 10px; font-size: 11.5px; font-weight: 700; border-radius: 6px; cursor: ${this.currentProcessIndex === totalProcesses - 1 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentProcessIndex === totalProcesses - 1 ? '0.4' : '1'};" ${this.currentProcessIndex === totalProcesses - 1 ? 'disabled' : ''} title="Alur Berikutnya (Alt+Right)">
                Alur Berikutnya →
              </button>

              <button id="modal-btn-close-x" style="background: rgba(255,255,255,0.2); border: none; color: #FFFFFF; font-size: 16px; font-weight: 700; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-left: 2px;" title="Tutup Dialog (Esc)">
                ✕
              </button>
            </div>

          </div>

          <!-- Horizontal Timeline Stepper Bar (Anchored at Top of Modal Dialog - Always 100% Visible) -->
          <div class="sop-timeline-stepper-container" style="margin: 12px 20px 0 20px; flex-shrink: 0;">
            <div class="sop-timeline-stepper-track">
              
              <!-- Background Timeline Track -->
              <div class="sop-stepper-line-bg"></div>
              <div class="sop-stepper-line-progress" style="width: ${totalSteps > 1 ? (this.currentStepIndex / (totalSteps - 1)) * 100 : 0}%;"></div>

              ${steps.map((st, idx) => {
                const isSelected = idx === this.currentStepIndex;
                const isCompleted = idx < this.currentStepIndex;
                const nodeBg = isSelected ? '#0B3A6F' : (isCompleted ? '#059669' : '#FFFFFF');
                const nodeColor = (isSelected || isCompleted) ? '#FFFFFF' : '#475569';
                const nodeBorder = isSelected ? '3px solid #D9B45B' : (isCompleted ? '2.5px solid #059669' : '2px solid #CBD5E1');

                return `
                  <div class="timeline-step-node ${isSelected ? 'active' : (isCompleted ? 'completed' : '')}" data-step-idx="${idx}" title="Tahap ${idx + 1}: ${st.judul}">
                    <div class="timeline-step-circle" style="background: ${nodeBg}; color: ${nodeColor}; border: ${nodeBorder};">
                      ${isCompleted ? '✓' : (st.no || idx + 1)}
                    </div>
                    <div class="timeline-step-label">
                      ${st.judul.split('&')[0].split('(')[0].trim()}
                    </div>
                  </div>
                `;
              }).join('')}

            </div>
          </div>

          <!-- MODAL BODY: 2-Column Step Detail -->
          <div style="padding: 12px 20px 16px 20px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; background: #F8FAFC;">
            
            <!-- Main Step Content (2 Columns) -->
            <div class="sop-step-content-grid" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; flex: 1;">
              
              <!-- Column 1: Step Details & Outputs -->
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
                    <div>
                      <span class="badge badge-org" style="font-size: 10.5px; font-weight: 700; text-transform: uppercase;">
                        Tahap ${activeStep.no || (this.currentStepIndex + 1)} dari ${totalSteps}
                      </span>
                      <h3 style="font-size: 16.5px; font-weight: 800; color: #001631; margin: 4px 0 0 0; line-height: 1.3;">
                        ${activeStep.judul}
                      </h3>
                    </div>

                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      ${activeStep.sla ? `
                        <span class="badge" style="background:#FEF3C7; color:#92400E; font-size:10.5px; font-weight:700; border:1px solid #FDE68A;">
                          ⏱ SLA: ${activeStep.sla}
                        </span>
                      ` : ''}
                      ${activeStep.dasar_hukum ? `
                        <span class="badge" style="background:#F1F5F9; color:#475569; font-size:10.5px; font-weight:600;">
                          ⚖ ${activeStep.dasar_hukum}
                        </span>
                      ` : ''}
                    </div>
                  </div>

                  <!-- Step Operational Description -->
                  <div style="background: #F8FAFC; border-left: 4px solid #0B3A6F; border-radius: 4px; padding: 12px 14px; margin-bottom: 14px; border-top: 1px solid #E2E8F0; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
                    <div style="font-size: 11px; font-weight: 700; color: #0B3A6F; text-transform: uppercase; margin-bottom: 4px;">
                      📋 Penjelasan Pelaksanaan &amp; Mekanisme Kerja:
                    </div>
                    <p style="font-size: 13px; line-height: 1.6; color: #1E293B; margin: 0;">
                      ${activeStep.deskripsi}
                    </p>
                  </div>

                  <!-- Output Documents -->
                  ${activeStep.output && activeStep.output.length > 0 ? `
                    <div style="margin-bottom: 12px;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">
                        📑 Dokumen Keluaran (Output) / Bukti Pelaksanaan:
                      </div>
                      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${activeStep.output.map(doc => `
                          <span style="font-size: 11.5px; font-weight: 600; background: #FFFBEB; border: 1px solid #FDE68A; color: #78350F; padding: 4px 10px; border-radius: 6px;">
                            📄 ${doc}
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>

                <div style="font-size: 11px; color: #64748B; background: #F1F5F9; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 6px;">
                  <span>💡</span>
                  <span>Seluruh tahapan diawasi melalui integrasi sistem CEISA 4.0 dan Portal INSW.</span>
                </div>
              </div>

              <!-- Column 2: Involved Units & Control Point -->
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="font-size: 11.5px; font-weight: 700; color: #0B3A6F; text-transform: uppercase; letter-spacing: 0.5px;">
                      🏢 Satuan Kerja yang Terlibat:
                    </div>
                    <span style="font-size: 10px; font-weight: 700; color: #0284C7; background: #E0F2FE; padding: 2px 8px; border-radius: 4px;">
                      Klik Unit ➔ Side Panel
                    </span>
                  </div>

                  <!-- Unit Cards -->
                  <div style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; padding-right: 4px;">
                    ${(activeStep.unit_terlibat || []).map(u => {
                      const uIcon = getUnitIcon(u.unit_id || u);
                      return `
                        <div class="card sop-unit-card" data-unit-id="${u.unit_id}" style="padding: 10px 12px; border-left: 4px solid ${u.warna || '#0B3A6F'}; cursor: pointer; background: #F8FAFC; border: 1px solid #E2E8F0; border-left-width: 4px; border-radius: 8px; transition: all 0.15s ease;">
                          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="font-size: 12px; font-weight: 700; color: #0B3A6F; display: flex; align-items: center; gap: 6px;">
                              <span style="font-size: 13px;">${uIcon}</span>
                              <span>${u.nama}</span>
                            </div>
                            <span style="font-size: 9.5px; font-weight: 700; color: ${u.warna || '#0B3A6F'}; background: ${u.warna || '#0B3A6F'}12; padding: 2px 6px; border-radius: 4px; white-space: nowrap;">
                              ${u.level || 'Pelaksana'}
                            </span>
                          </div>
                          <div style="font-size: 11px; color: #475569; margin-top: 3px; line-height: 1.4;">
                            ${u.peran}
                          </div>
                          <div style="font-size: 10px; color: #0284C7; font-weight: 600; margin-top: 3px; display: flex; align-items: center; gap: 2px;">
                            🔍 Buka Profil Unit di Side Panel ➔
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Critical Control Point -->
                <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 10px 12px; margin-top: 10px;">
                  <div style="font-size: 10.5px; font-weight: 700; color: #166534; text-transform: uppercase; margin-bottom: 2px;">
                    🛡️ Poin Kritis Pengawasan &amp; Kepatuhan:
                  </div>
                  <div style="font-size: 11.5px; color: #15803D; line-height: 1.4;">
                    Memastikan kepatuhan tata laksana pabean/cukai serta kesesuaian waktu layanan sesuai Service Level Agreement (SLA).
                  </div>
                </div>
              </div>

            </div>

          </div>

          <!-- MODAL FOOTER: Step Navigation Controls & Close Button -->
          <div class="sop-modal-footer">
            
            <!-- Step Info Indicator -->
            <div class="sop-modal-footer-step-info">
              <span class="sop-modal-step-text">
                Tahap ${this.currentStepIndex + 1} dari ${totalSteps}
              </span>
              <div class="sop-modal-step-dots">
                ${steps.map((_, sIdx) => `
                  <div class="modal-step-dot ${sIdx === this.currentStepIndex ? 'active' : (sIdx < this.currentStepIndex ? 'completed' : '')}" data-step-idx="${sIdx}" title="Menuju Tahap ${sIdx + 1}"></div>
                `).join('')}
              </div>
            </div>

            <!-- Action Buttons Group -->
            <div class="sop-modal-footer-actions">
              <button id="modal-btn-prev-step" class="btn btn-outline sop-modal-nav-btn" ${this.currentStepIndex === 0 ? 'disabled' : ''} title="Tahap Sebelumnya (Left Arrow)">
                <span>←</span>
                <span class="btn-step-label">Sebelumnya</span>
              </button>

              <button id="modal-btn-next-step" class="btn btn-primary sop-modal-nav-btn" ${this.currentStepIndex === totalSteps - 1 ? 'disabled' : ''} title="Tahap Berikutnya (Right Arrow)">
                <span class="btn-step-label">Berikutnya</span>
                <span>→</span>
              </button>

              <button id="modal-btn-close-footer" class="btn btn-outline sop-modal-close-btn" title="Tutup Dialog (Esc)">
                <span>✕ Tutup</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    ` : '';

    this.container.innerHTML = listHtml + modalHtml;

    // Attach Listeners
    this.attachEventListeners();
  }

  attachEventListeners() {
    // 1. Search filter input
    const searchInput = this.container.querySelector('#sop-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
        const reInput = this.container.querySelector('#sop-search-input');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(reInput.value.length, reInput.value.length);
        }
      });
    }

    // 2. Category filter buttons
    this.container.querySelectorAll('.sop-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.getAttribute('data-category') || 'ALL';
        this.render();
      });
    });

    // 3. Open SOP cards / buttons
    this.container.querySelectorAll('.sop-card-item, .btn-open-sop').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = parseInt(el.getAttribute('data-process-idx'), 10);
        if (!isNaN(idx)) {
          this.openModal(idx, 0);
        }
      });
    });

    // If modal is open, attach modal listeners
    if (this.isModalOpen) {
      const modalOverlay = this.container.querySelector('#sop-detail-modal-overlay');
      const closeX = this.container.querySelector('#modal-btn-close-x');
      const closeFooter = this.container.querySelector('#modal-btn-close-footer');

      if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) this.closeModal();
        });
      }
      if (closeX) closeX.addEventListener('click', () => this.closeModal());
      if (closeFooter) closeFooter.addEventListener('click', () => this.closeModal());

      // Process navigation in modal
      const prevProc = this.container.querySelector('#modal-btn-prev-process');
      if (prevProc) prevProc.addEventListener('click', () => this.prevProcess());

      const nextProc = this.container.querySelector('#modal-btn-next-process');
      if (nextProc) nextProc.addEventListener('click', () => this.nextProcess());

      const procDropdown = this.container.querySelector('#modal-process-dropdown');
      if (procDropdown) {
        procDropdown.addEventListener('change', (e) => {
          this.currentProcessIndex = parseInt(e.target.value, 10) || 0;
          this.currentStepIndex = 0;
          this.render();
        });
      }

      // Step navigation in modal
      const prevStep = this.container.querySelector('#modal-btn-prev-step');
      if (prevStep) prevStep.addEventListener('click', () => this.prevStep());

      const nextStep = this.container.querySelector('#modal-btn-next-step');
      if (nextStep) nextStep.addEventListener('click', () => this.nextStep());

      // Step nodes & dots in modal
      this.container.querySelectorAll('.timeline-step-node, .modal-step-dot').forEach(node => {
        node.addEventListener('click', () => {
          const sIdx = parseInt(node.getAttribute('data-step-idx'), 10);
          if (!isNaN(sIdx)) this.goToStep(sIdx);
        });
      });

      // Unit cards click in modal -> open side panel
      this.container.querySelectorAll('.sop-unit-card, [data-unit-id]').forEach(card => {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          const unitId = card.getAttribute('data-unit-id');
          if (unitId && this.onSelectUnit) {
            this.onSelectUnit(unitId);
          }
        });
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.ProcessFlowEngine = ProcessFlowEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProcessFlowEngine };
}



/* --- relationships-view.js --- */

/**
 * relationships-view.js — Interactive Flat Network Diagram & Interdependensi Explorer.
 * Immersive flat SVG network diagram with connected nodes, animated interactive lines,
 * category filters, hover tooltips, and seamless Side Panel drawer integration for all 36 interactions.
 * Bottom card removed per user request: all interaction and unit details open directly in the Side Panel.
 */

class RelationshipsViewEngine {
  constructor(containerEl, relationshipsData, unitsDict, onNavigateUnit, onSelectRelationship) {
    this.container = containerEl;
    this.relationships = relationshipsData || [];
    this.unitsDict = unitsDict || {};
    this.onNavigateUnit = onNavigateUnit || (() => {});
    this.onSelectRelationship = onSelectRelationship || (() => {});
    this.selectedCategory = 'all';
    this.selectedNodeId = null;
    this.selectedEdgeId = null;
    this.zoomLevel = 1.0;

    // Node metadata and flat coordinate definitions across 5 tiers
    this.nodesMap = {
      'setditjen': { id: 'setditjen', name: 'Setditjen', full: 'Sekretariat Direktorat Jenderal', icon: '🏛️', tier: 'pusat', cat: 'pembinaan', x: 90, y: 75, color: '#0B3A6F' },
      'dit-ki': { id: 'dit-ki', name: 'Dit. KI', full: 'Direktorat Kepatuhan Internal', icon: '🛡️', tier: 'pusat', cat: 'pengawasan', x: 220, y: 75, color: '#DC2626' },
      'dit-teknis-kepab': { id: 'dit-teknis-kepab', name: 'Dit. Teknis', full: 'Direktorat Teknis Kepabeanan', icon: '🚢', tier: 'pusat', cat: 'pelayanan', x: 365, y: 75, color: '#0284C7' },
      'dit-fasilitas-kepab': { id: 'dit-fasilitas-kepab', name: 'Dit. Fasilitas', full: 'Direktorat Fasilitas Kepabeanan', icon: '🏭', tier: 'pusat', cat: 'pelayanan', x: 510, y: 75, color: '#059669' },
      'dit-tfc': { id: 'dit-tfc', name: 'Dit. Cukai', full: 'Direktorat Teknis & Fasilitas Cukai', icon: '🏷️', tier: 'pusat', cat: 'pelayanan', x: 655, y: 75, color: '#D97706' },
      'dit-p2': { id: 'dit-p2', name: 'Dit. P2', full: 'Direktorat Penindakan dan Penyidikan', icon: '⚔️', tier: 'pusat', cat: 'pengawasan', x: 800, y: 75, color: '#991B1B' },
      'dit-interdiksi': { id: 'dit-interdiksi', name: 'Dit. Interdiksi', full: 'Direktorat Interdiksi Narkotika', icon: '🐕', tier: 'pusat', cat: 'pengawasan', x: 945, y: 75, color: '#7F1D1D' },
      
      'dit-audit': { id: 'dit-audit', name: 'Dit. Audit', full: 'Direktorat Audit Kepabeanan dan Cukai', icon: '📊', tier: 'pusat', cat: 'pengawasan', x: 190, y: 195, color: '#0369A1' },
      'dit-ikc': { id: 'dit-ikc', name: 'Dit. IKC', full: 'Direktorat Informasi Kepabeanan & Cukai', icon: '💻', tier: 'pusat', cat: 'data', x: 370, y: 195, color: '#4F46E5' },
      'dit-kombimjas': { id: 'dit-kombimjas', name: 'Dit. Kombimjas', full: 'Dit. Komunikasi & Bimbingan Pengguna Jasa', icon: '📢', tier: 'pusat', cat: 'pelayanan', x: 550, y: 195, color: '#B45309' },
      'dit-ksikc': { id: 'dit-ksikc', name: 'Dit. KSIKC', full: 'Dit. Kerja Sama Internasional Kepabeanan', icon: '🌐', tier: 'pusat', cat: 'eksternal', x: 730, y: 195, color: '#1E40AF' },
      'dit-kbp': { id: 'dit-kbp', name: 'Dit. KBP', full: 'Dit. Keberatan, Banding, dan Peraturan', icon: '⚖️', tier: 'pusat', cat: 'pelayanan', x: 900, y: 195, color: '#334155' },

      'kpu': { id: 'kpu', name: 'KPU Bea Cukai', full: 'Kantor Pelayanan Utama (Priok, Batam, Soetta)', icon: '🏢', tier: 'vertikal', cat: 'pelayanan', x: 240, y: 330, color: '#0284C7' },
      'kanwil': { id: 'kanwil', name: 'Kanwil DJBC', full: 'Kantor Wilayah DJBC (20 Regional)', icon: '🏛️', tier: 'vertikal', cat: 'pembinaan', x: 530, y: 330, color: '#0B3A6F' },
      'kppbc': { id: 'kppbc', name: 'KPPBC', full: 'Kantor Pengawasan & Pelayanan (104 Kantor)', icon: '🏬', tier: 'vertikal', cat: 'pelayanan', x: 820, y: 330, color: '#0369A1' },

      'blbc': { id: 'blbc', name: 'BLBC', full: 'Balai Laboratorium Bea dan Cukai (3 Lab)', icon: '🔬', tier: 'upt', cat: 'laboratorium', x: 380, y: 465, color: '#059669' },
      'pso': { id: 'pso', name: 'PSO BC', full: 'Pangkalan Sarana Operasi (6 Armada Laut)', icon: '⚓', tier: 'upt', cat: 'pengawasan', x: 680, y: 465, color: '#B45309' },

      'insw': { id: 'insw', name: 'INSW', full: 'Indonesia National Single Window (Lartas K/L)', icon: '🔄', tier: 'eksternal', cat: 'eksternal', x: 170, y: 590, color: '#7C3AED' },
      'ciq-imigrasi-karantina': { id: 'ciq-imigrasi-karantina', name: 'Sinergi CIQ', full: 'Customs, Immigration, & Barantin', icon: '🛂', tier: 'eksternal', cat: 'eksternal', x: 420, y: 590, color: '#0D9488' },
      'tni-polri-bakamla': { id: 'tni-polri-bakamla', name: 'TNI / POLRI / Bakamla / BNN', full: 'Perbantuan Hankam, Penegakan Hukum & BNN', icon: '🎖️', tier: 'eksternal', cat: 'eksternal', x: 670, y: 590, color: '#991B1B' },
      'wco-asean': { id: 'wco-asean', name: 'WCO & ASEAN', full: 'World Customs Org & ASEAN Single Window', icon: '🌍', tier: 'eksternal', cat: 'eksternal', x: 910, y: 590, color: '#2563EB' }
    };
  }

  setRelationships(data) {
    this.relationships = data || [];
    this.render();
  }

  getUnitDisplayName(id) {
    if (this.nodesMap[id]) return this.nodesMap[id].full;
    if (this.unitsDict[id]) return this.unitsDict[id].nama || this.unitsDict[id].nama_resmi || id;
    return id.toUpperCase();
  }

  getCategoryColor(cat) {
    switch ((cat || '').toLowerCase()) {
      case 'pengawasan': return '#DC2626';
      case 'pelayanan-fasilitas':
      case 'pelayanan': return '#0284C7';
      case 'laboratorium-teknis':
      case 'laboratorium': return '#059669';
      case 'data-sistem':
      case 'data': return '#4F46E5';
      case 'interdependensi-eksternal':
      case 'eksternal': return '#7C3AED';
      case 'pembinaan-sdm':
      case 'pembinaan': return '#0B3A6F';
      default: return '#64748B';
    }
  }

  render() {
    if (!this.container) return;

    // Filter relationships based on active category
    let filteredRels = this.relationships;
    if (this.selectedCategory !== 'all') {
      filteredRels = filteredRels.filter(r => r.category === this.selectedCategory || r.type === this.selectedCategory);
    }

    const activeNode = this.selectedNodeId ? this.nodesMap[this.selectedNodeId] : null;
    const nodeRels = this.selectedNodeId ? this.relationships.filter(r => r.from === this.selectedNodeId || r.to === this.selectedNodeId) : [];

    // Category counts calculation
    const countAll = this.relationships.length;
    const countPengawasan = this.relationships.filter(r => r.category === 'pengawasan').length;
    const countPelayanan = this.relationships.filter(r => r.category === 'pelayanan-fasilitas' || r.category === 'pelayanan').length;
    const countLab = this.relationships.filter(r => r.category === 'laboratorium-teknis' || r.category === 'laboratorium').length;
    const countData = this.relationships.filter(r => r.category === 'data-sistem' || r.category === 'data').length;
    const countEksternal = this.relationships.filter(r => r.category === 'interdependensi-eksternal' || r.category === 'eksternal').length;
    const countPembinaan = this.relationships.filter(r => r.category === 'pembinaan-sdm' || r.category === 'pembinaan').length;

    this.container.innerHTML = `
      <div class="relationships-page-wrapper" style="padding: 24px 32px; max-width: 1400px; margin: 0 auto; width: 100%; position:relative;">
        
        <!-- Floating Network Tooltip Element -->
        <div id="network-edge-tooltip" style="position:fixed; display:none; pointer-events:none; z-index:9999; background:#001631; color:#FFFFFF; padding:10px 14px; border-radius:8px; font-size:12px; box-shadow:0 8px 24px rgba(0,0,0,0.25); max-width:340px; line-height:1.45; border:1px solid #D9B45B;"></div>

        <!-- Header Section -->
        <div style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="badge badge-org" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
              Diagram Jaringan Interaktif & Interdependensi Tusi DJBC
            </span>
            <h2 style="font-size: 24px; font-weight: 800; color: #001631; margin: 6px 0 4px 0;">
              Keterkaitan dan Interaksi Antar Satuan Kerja DJBC
            </h2>
            <p style="font-size: 13.5px; color: #64748B; margin: 0; max-width: 900px; line-height: 1.5;">
              Visualisasi relasi operasional, koordinasi intelijen, pengujian ilmiah, dan sinergi antar unit kerja DJBC serta mitra strategis. Arahkan kursor (*hover*) atau klik pada garis relasi maupun kartu unit (*node*) untuk menampilkan detail lengkap pada <strong>Side Panel</strong>.
            </p>
          </div>

          <!-- Instruction Badge & Tour Button -->
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px; background:#F8FAFC; border:1px solid #CBD5E1; padding:8px 14px; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
              <span style="font-size:18px;">💡</span>
              <div style="font-size:12px; color:#0B3A6F; font-weight:600; line-height:1.3;">
                Klik <strong>Garis Relasi</strong> atau <strong>Node Unit</strong><br>untuk membuka detail di <strong>Side Panel</strong>
              </div>
            </div>
            <button id="relationships-tour-btn" class="btn btn-outline" style="font-size:12px; font-weight:600; padding:8px 14px; gap:6px; border-radius:20px; cursor:pointer;" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.startRelationshipsTour(true);}" title="Buka Panduan Interaktif Diagram Jaringan">
              <span>💡</span>
              <span>Panduan Jaringan</span>
            </button>
          </div>
        </div>

        <!-- Filter Toolbar & Action Controls -->
        <div id="relationships-filter-bar" class="relationships-filter-bar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom: 18px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:12px 18px; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
          
          <!-- Category Filter Pills -->
          <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
            <span style="font-size:11.5px; font-weight:700; color:#64748B; text-transform:uppercase; margin-right:4px;">Filter:</span>
            <button class="btn ${this.selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="all" style="font-size:12px; padding:5px 12px;">
              Semua (${countAll})
            </button>
            <button class="btn ${this.selectedCategory === 'pengawasan' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="pengawasan" style="font-size:12px; padding:5px 12px; border-left:3px solid #DC2626;">
              🛡️ Pengawasan & P2 (${countPengawasan})
            </button>
            <button class="btn ${this.selectedCategory === 'pelayanan-fasilitas' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="pelayanan-fasilitas" style="font-size:12px; padding:5px 12px; border-left:3px solid #0284C7;">
              🚢 Pelayanan & Fasilitas (${countPelayanan})
            </button>
            <button class="btn ${this.selectedCategory === 'laboratorium-teknis' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="laboratorium-teknis" style="font-size:12px; padding:5px 12px; border-left:3px solid #059669;">
              🔬 UPT & Laboratorium (${countLab})
            </button>
            <button class="btn ${this.selectedCategory === 'data-sistem' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="data-sistem" style="font-size:12px; padding:5px 12px; border-left:3px solid #4F46E5;">
              💻 Data & Sistem (${countData})
            </button>
            <button class="btn ${this.selectedCategory === 'interdependensi-eksternal' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="interdependensi-eksternal" style="font-size:12px; padding:5px 12px; border-left:3px solid #7C3AED;">
              🌐 Lintas Instansi (${countEksternal})
            </button>
            <button class="btn ${this.selectedCategory === 'pembinaan-sdm' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="pembinaan-sdm" style="font-size:12px; padding:5px 12px; border-left:3px solid #0B3A6F;">
              🏛️ Pembinaan SDM (${countPembinaan})
            </button>
          </div>

          <!-- Network Canvas Action Controls -->
          <div style="display:flex; gap:6px; align-items:center;">
            ${this.selectedNodeId || this.selectedEdgeId || this.selectedCategory !== 'all' ? `
              <button id="btn-net-reset" class="btn btn-outline" style="font-size:12px; padding:5px 12px; gap:4px;" title="Reset Fokus Diagram">
                ↺ Reset Fokus
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Full-Width Interactive SVG Network Canvas Container -->
        <div class="card" style="padding: 16px; background:#FFFFFF; position:relative; overflow:hidden; border:1px solid #E2E8F0; border-radius:14px; box-shadow:0 4px 20px rgba(0,0,0,0.04); min-height:680px;">
          
          <!-- Tier Legend Watermark Header -->
          <div style="position:absolute; top:14px; left:18px; font-size:11px; font-weight:700; color:#94A3B8; display:flex; gap:18px; z-index:5; pointer-events:none; flex-wrap:wrap;">
            <span>▲ Tier 1 & 2: Kantor Pusat (Regulator & Penunjang)</span>
            <span>● Tier 3: Instansi Vertikal (KPU, Kanwil, KPPBC)</span>
            <span>■ Tier 4: UPT (BLBC & PSO BC)</span>
            <span>◆ Tier 5: Sinergi Lintas K/L & Internasional</span>
          </div>

          <!-- Active Focus Indicator Pill -->
          ${this.selectedNodeId ? `
            <div style="position:absolute; top:14px; right:18px; font-size:11.5px; font-weight:700; color:#0B3A6F; background:#E0F2FE; border:1px solid #7DD3FC; padding:4px 12px; border-radius:9999px; z-index:5;">
              Node Fokus: <strong>${activeNode ? activeNode.name : this.selectedNodeId}</strong> (${nodeRels.length} Garis Terhubung)
            </div>
          ` : ''}

          <div style="width:100%; overflow-x:auto;">
            <svg id="network-diagram-svg" viewBox="0 0 1060 670" style="width:100%; min-width:960px; height:auto; display:block;">
              <defs>
                <!-- Arrow Markers -->
                <marker id="arrow-default" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
                </marker>
                <marker id="arrow-pengawasan" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#DC2626" />
                </marker>
                <marker id="arrow-pelayanan" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284C7" />
                </marker>
                <marker id="arrow-laboratorium" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                </marker>
                <marker id="arrow-data" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#4F46E5" />
                </marker>
                <marker id="arrow-eksternal" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#7C3AED" />
                </marker>
                <marker id="arrow-pembinaan" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#0B3A6F" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="8.5" markerHeight="8.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#D9B45B" />
                </marker>

                <!-- Filters for glowing nodes and paths -->
                <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0B3A6F" flood-opacity="0.12" />
                </filter>
                <filter id="active-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#D9B45B" flood-opacity="0.85" />
                </filter>
              </defs>

              <!-- Subtle Tier Separator Horizontal Guides -->
              <g opacity="0.05">
                <line x1="0" y1="135" x2="1060" y2="135" stroke="#000" stroke-dasharray="5,5" />
                <line x1="0" y1="260" x2="1060" y2="260" stroke="#000" stroke-dasharray="5,5" />
                <line x1="0" y1="395" x2="1060" y2="395" stroke="#000" stroke-dasharray="5,5" />
                <line x1="0" y1="525" x2="1060" y2="525" stroke="#000" stroke-dasharray="5,5" />
              </g>

              <!-- Network Edges Layer -->
              <g id="network-edges-layer">
                ${filteredRels.map(rel => {
                  const src = this.nodesMap[rel.from];
                  const tgt = this.nodesMap[rel.to];
                  if (!src || !tgt) return '';

                  const isEdgeSelected = this.selectedEdgeId === rel.id;
                  const isConnectedToSelectedNode = this.selectedNodeId ? (rel.from === this.selectedNodeId || rel.to === this.selectedNodeId) : true;
                  
                  // Curved line control point calculation
                  const dx = tgt.x - src.x;
                  const dy = tgt.y - src.y;
                  const cx = (src.x + tgt.x) / 2 + (dy * 0.14);
                  const cy = (src.y + tgt.y) / 2 - (dx * 0.14);

                  const edgeColor = isEdgeSelected ? '#D9B45B' : this.getCategoryColor(rel.category);
                  const strokeWidth = isEdgeSelected ? '4.0' : (isConnectedToSelectedNode && this.selectedNodeId ? '3.0' : '1.8');
                  const opacity = (this.selectedNodeId && !isConnectedToSelectedNode && !isEdgeSelected) ? '0.10' : (this.selectedEdgeId && !isEdgeSelected ? '0.12' : '0.88');
                  const marker = isEdgeSelected ? 'url(#arrow-active)' : `url(#arrow-${rel.category.split('-')[0]})`;

                  return `
                    <g class="network-edge-group" data-edge-id="${rel.id}" style="cursor:pointer; transition:all 0.2s ease;">
                      <!-- Thick invisible path for effortless hover and click -->
                      <path class="edge-hit-area" d="M ${src.x} ${src.y} Q ${cx} ${cy} ${tgt.x} ${tgt.y}" fill="none" stroke="transparent" stroke-width="24" />
                      
                      <!-- Visible styled curved line -->
                      <path class="edge-visible-path" 
                            d="M ${src.x} ${src.y} Q ${cx} ${cy} ${tgt.x} ${tgt.y}" 
                            fill="none" 
                            stroke="${edgeColor}" 
                            stroke-width="${strokeWidth}" 
                            opacity="${opacity}" 
                            marker-end="${marker}"
                            stroke-dasharray="${isEdgeSelected ? '6,4' : 'none'}" />
                    </g>
                  `;
                }).join('')}
              </g>

              <!-- Network Nodes Layer -->
              <g id="network-nodes-layer">
                ${Object.values(this.nodesMap).map(node => {
                  const isNodeSelected = this.selectedNodeId === node.id;
                  const isConnected = !this.selectedNodeId || isNodeSelected || (nodeRels.some(r => r.from === node.id || r.to === node.id));
                  const opacity = isConnected ? '1.0' : '0.18';
                  const filterAttr = isNodeSelected ? 'url(#active-glow)' : 'url(#node-glow)';
                  const strokeBorder = isNodeSelected ? '#D9B45B' : (isConnected ? node.color : '#CBD5E1');
                  const strokeWidth = isNodeSelected ? '3' : '1.5';

                  return `
                    <g class="network-node-group" data-node-id="${node.id}" transform="translate(${node.x}, ${node.y})" opacity="${opacity}" style="cursor:pointer; transition:all 0.2s ease;" filter="${filterAttr}">
                      <!-- Flat Node Container Box -->
                      <rect x="-64" y="-23" width="128" height="46" rx="9" ry="9" fill="#FFFFFF" stroke="${strokeBorder}" stroke-width="${strokeWidth}" />
                      
                      <!-- Icon Circle -->
                      <circle cx="-44" cy="0" r="14" fill="${node.color}15" stroke="${node.color}30" stroke-width="1" />
                      <text x="-44" y="5" text-anchor="middle" font-size="12.5">${node.icon}</text>
                      
                      <!-- Node Text Labels -->
                      <text x="-24" y="-3" font-size="11.5" font-weight="700" fill="#001631" text-anchor="start">${node.name}</text>
                      <text x="-24" y="11" font-size="9" font-weight="600" fill="${node.color}" text-anchor="start">${node.tier.toUpperCase()}</text>
                    </g>
                  `;
                }).join('')}
              </g>
            </svg>
          </div>
        </div>

      </div>
    `;

    // Tooltip Element Reference
    const tooltipEl = this.container.querySelector('#network-edge-tooltip');

    // Category Filter Buttons
    this.container.querySelectorAll('[data-rel-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.getAttribute('data-rel-filter');
        this.selectedEdgeId = null;
        this.render();
      });
    });

    // Reset Focus Button
    const resetBtn = this.container.querySelector('#btn-net-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.selectedCategory = 'all';
        this.selectedNodeId = null;
        this.selectedEdgeId = null;
        this.render();
      });
    }

    // Node Click on SVG -> Open Node Profile in Side Panel Drawer
    this.container.querySelectorAll('.network-node-group').forEach(nodeGroup => {
      nodeGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeId = nodeGroup.getAttribute('data-node-id');
        this.selectedNodeId = (this.selectedNodeId === nodeId) ? null : nodeId;
        this.selectedEdgeId = null;
        this.render();
        if (nodeId && this.onNavigateUnit) {
          this.onNavigateUnit(nodeId);
        }
      });
    });

    // Edge Hover & Click on SVG -> Open Relationship Details in Side Panel Drawer
    this.container.querySelectorAll('.network-edge-group').forEach(edgeGroup => {
      const edgeId = edgeGroup.getAttribute('data-edge-id');
      const rel = this.relationships.find(r => r.id === edgeId);
      const visiblePath = edgeGroup.querySelector('.edge-visible-path');

      // Hover events
      edgeGroup.addEventListener('mouseenter', (e) => {
        if (visiblePath) {
          visiblePath.setAttribute('stroke-width', '4.2');
          visiblePath.setAttribute('stroke', '#D9B45B');
        }
        if (tooltipEl && rel) {
          const fromTitle = this.getUnitDisplayName(rel.from).split('(')[0].trim();
          const toTitle = this.getUnitDisplayName(rel.to).split('(')[0].trim();
          const catColor = this.getCategoryColor(rel.category);
          tooltipEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:10px; font-weight:700; color:${catColor}; text-transform:uppercase;">${rel.category.replace('-', ' ')}</span>
              <span style="font-size:10px; color:#D9B45B; font-weight:600;">${rel.type.toUpperCase()}</span>
            </div>
            <div style="font-weight:700; font-size:12.5px; color:#FFFFFF; margin-bottom:4px;">${rel.label}</div>
            <div style="font-size:11.5px; color:#E2E8F0;">${fromTitle} ➔ ${toTitle}</div>
            <div style="font-size:10px; color:#D9B45B; margin-top:6px; font-weight:600;">🔍 Klik garis untuk membuka detail di Side Panel</div>
          `;
          tooltipEl.style.display = 'block';
          tooltipEl.style.left = `${e.clientX + 14}px`;
          tooltipEl.style.top = `${e.clientY + 14}px`;
        }
      });

      edgeGroup.addEventListener('mousemove', (e) => {
        if (tooltipEl && tooltipEl.style.display === 'block') {
          tooltipEl.style.left = `${e.clientX + 14}px`;
          tooltipEl.style.top = `${e.clientY + 14}px`;
        }
      });

      edgeGroup.addEventListener('mouseleave', () => {
        if (visiblePath && this.selectedEdgeId !== edgeId) {
          visiblePath.setAttribute('stroke-width', '1.8');
          visiblePath.setAttribute('stroke', this.getCategoryColor(rel ? rel.category : ''));
        }
        if (tooltipEl) {
          tooltipEl.style.display = 'none';
        }
      });

      // Click event -> Open Side Panel Drawer
      edgeGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tooltipEl) tooltipEl.style.display = 'none';
        this.selectedEdgeId = (this.selectedEdgeId === edgeId) ? null : edgeId;
        this.render();
        if (rel && this.onSelectRelationship) {
          this.onSelectRelationship(rel);
        }
      });
    });
  }
}


/* --- breadcrumb.js --- */

/**
 * breadcrumb.js — Dynamic hierarchy breadcrumb path renderer.
 */

class Breadcrumb {
  constructor(containerEl, unitsDict, onNavigate) {
    this.container = containerEl;
    this.unitsDict = unitsDict || {};
    this.onNavigate = onNavigate;
  }

  setUnitsDict(dict) {
    this.unitsDict = dict;
  }

  update(currentUnitId) {
    if (!this.container) return;
    this.container.innerHTML = '';

    const path = [];
    let curr = currentUnitId;

    while (curr && this.unitsDict[curr]) {
      const u = this.unitsDict[curr];
      path.unshift({ id: u.id, name: u.singkatan || u.nama });
      curr = u.parent;
    }

    if (!path.length) {
      path.push({ id: 'djbc', name: 'DJBC' });
    }

    const ol = document.createElement('div');
    ol.className = 'breadcrumb';

    path.forEach((item, index) => {
      if (index > 0) {
        const sep = document.createElement('span');
        sep.className = 'breadcrumb-separator';
        sep.textContent = '›';
        ol.appendChild(sep);
      }

      const step = document.createElement('span');
      step.className = `breadcrumb-item ${index === path.length - 1 ? 'active' : ''}`;
      step.textContent = item.name;

      if (index < path.length - 1) {
        step.addEventListener('click', () => {
          if (this.onNavigate) this.onNavigate(item.id);
        });
      }

      ol.appendChild(step);
    });

    this.container.appendChild(ol);
  }
}


/* --- minimap.js --- */

/**
 * minimap.js — Mini Map Navigation Indicator Component.
 */

class MiniMap {
  constructor(containerEl, treeEngine) {
    this.container = containerEl;
    this.treeEngine = treeEngine;

    this.initUI();
  }

  initUI() {
    if (!this.container) return;
    this.container.className = 'minimap-container';
    this.container.innerHTML = `
      <div style="font-size:10px; font-weight:700; color:var(--color-text-secondary); padding:4px 8px; border-bottom:1px solid #E5E9F0; background:#F8FAFC;">PETA MINI</div>
      <div id="minimap-canvas" style="position:relative; width:100%; height:calc(100% - 22px); background:#F5F7FA; overflow:hidden;">
        <svg id="minimap-svg" width="100%" height="100%"></svg>
        <div id="minimap-viewport-box" style="position:absolute; border:2px solid var(--color-accent-blue); background:rgba(47,128,237,0.1); pointer-events:none;"></div>
      </div>
    `;
  }

  update(layoutResult, transformState) {
    if (!this.container || !layoutResult || !layoutResult.nodes) return;

    const svg = this.container.querySelector('#minimap-svg');
    if (!svg) return;

    svg.innerHTML = '';

    const bounds = layoutResult.bounds;
    const padding = 100;
    const minX = bounds.minX - padding;
    const maxX = bounds.maxX + padding;
    const minY = bounds.minY - padding;
    const maxY = bounds.maxY + padding;
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;

    const containerRect = this.container.getBoundingClientRect();
    const mapWidth = containerRect.width;
    const mapHeight = containerRect.height - 22;

    const scaleX = mapWidth / width;
    const scaleY = mapHeight / height;
    const scale = Math.min(scaleX, scaleY);

    // Draw mini node dots
    layoutResult.nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const cx = (node.x + node.width / 2 - minX) * scale;
      const cy = (node.y + node.height / 2 - minY) * scale;

      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', node.id === this.treeEngine.selectedNodeId ? '#C9A34E' : '#0B3A6F');
      svg.appendChild(circle);
    });

    // Update viewport rect indicator
    const box = this.container.querySelector('#minimap-viewport-box');
    if (box && transformState) {
      const parentRect = this.treeEngine.container.getBoundingClientRect();

      const viewX = (-transformState.translateX / transformState.scale - minX) * scale;
      const viewY = (-transformState.translateY / transformState.scale - minY) * scale;
      const viewW = (parentRect.width / transformState.scale) * scale;
      const viewH = (parentRect.height / transformState.scale) * scale;

      box.style.left = `${Math.max(0, viewX)}px`;
      box.style.top = `${Math.max(0, viewY)}px`;
      box.style.width = `${Math.min(mapWidth, viewW)}px`;
      box.style.height = `${Math.min(mapHeight, viewH)}px`;
    }
  }
}


/* --- walkthrough.js --- */



class WalkthroughBeacons {
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

    this.processSteps = [
      {
        targetSelector: '#sop-search-input',
        preferredSelector: '#sop-search-input',
        title: 'Pencarian SOP & Regulasi',
        description: 'Cari alur bisnis pabean dan cukai berdasarkan kata kunci nama proses, dokumen PIB/PEB/CK-1, komoditas, atau nomor PMK terkait secara instan.',
        placement: 'bottom'
      },
      {
        targetSelector: '#sop-categories-container',
        preferredSelector: '#sop-categories-container, .sop-filter-btn',
        title: 'Kategori Proses Bisnis Utama',
        description: 'Saring katalog 8 SOP berdasarkan klaster layanan: Pelayanan & Fasilitas, Pengawasan & P2, Keberatan & Banding, atau UPT Laboratorium & Operasi.',
        placement: 'bottom'
      },
      {
        targetSelector: '.sop-card-item',
        preferredSelector: '.sop-card-item:first-child, .sop-card-item',
        title: 'Kartu Alur Kerja & Standar Layanan (SLA)',
        description: 'Setiap kartu menyajikan rangkuman tahapan kerja, alokasi waktu SLA layanan, dan dasar hukum utama. Klik kartu untuk membuka linimasa proses.',
        placement: 'right'
      },
      {
        targetSelector: '.btn-open-sop',
        preferredSelector: '.sop-card-item:first-child .btn-open-sop, .sop-card-item:first-child, .btn-open-sop',
        title: 'Dialog Tahapan & Jembatan Unit Kerja',
        description: 'Di dalam detail alur kerja, Anda dapat mempelajari urutan langkah, melihat output dokumen resmi, dan mengklik chip unit pelaksana untuk membuka Side Panel.',
        placement: 'bottom'
      }
    ];

    this.relationshipsSteps = [
      {
        targetSelector: '#network-diagram-svg',
        preferredSelector: '#network-diagram-svg, svg#network-diagram-svg, #network-canvas-container',
        title: 'Diagram Jaringan Interdependensi DJBC',
        description: 'Visualisasi peta hubungan koordinasi operasional, pertukaran data intelijen, dan sinergi antar seluruh satuan kerja DJBC serta instansi mitra.',
        placement: 'center'
      },
      {
        targetSelector: '#relationships-filter-bar',
        preferredSelector: '#relationships-filter-bar, button[data-rel-filter]',
        title: 'Filter Klaster Hubungan Kerja',
        description: 'Saring diagram interaktif menurut jenis interaksi: Pengawasan & P2, Pelayanan & Fasilitas, Pengujian Lab BLBC, Integrasi Sistem CEISA, Sinergi CIQ, atau Pembinaan SDM.',
        placement: 'bottom'
      },
      {
        targetSelector: '.network-node-group',
        preferredSelector: 'g.network-node-group[data-node-id="setditjen"], g.network-node-group, .network-node',
        title: 'Node Unit Kerja (5 Tingkatan Organisasi)',
        description: 'Node dikelompokkan dalam 5 tingkatan: Kantor Pusat, Unit Vertikal Daerah, UPT Teknis, dan Mitra Eksternal. Klik kartu node untuk melihat seluruh keterkaitannya di Side Panel.',
        placement: 'right'
      },
      {
        targetSelector: '.network-edge-group',
        preferredSelector: 'g.network-edge-group:first-of-type .edge-visible-path, g.network-edge-group:first-of-type, .network-edge-group, .edge-visible-path',
        fallbackSelector: '#network-diagram-svg',
        title: 'Garis Interaksi & Detail Side Panel',
        description: 'Arahkan kursor (*hover*) pada garis penghubung untuk melihat intisari interaksi, atau klik garis relasi untuk membaca dasar hukum dan pola koordinasi lengkap di Side Panel.',
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
      let key = 'djbc_explorer_onboarding_completed';
      if (tourType === 'learning') key = 'djbc_learning_onboarding_completed';
      else if (tourType === 'process') key = 'djbc_process_onboarding_completed';
      else if (tourType === 'relationships') key = 'djbc_relationships_onboarding_completed';

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
      let key = 'djbc_explorer_onboarding_completed';
      if (tourType === 'learning') key = 'djbc_learning_onboarding_completed';
      else if (tourType === 'process') key = 'djbc_process_onboarding_completed';
      else if (tourType === 'relationships') key = 'djbc_relationships_onboarding_completed';

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

  startProcessTour(force = false) {
    this.activeTourType = 'process';
    this.storageKey = 'djbc_process_onboarding_completed';
    this.steps = this.processSteps;

    if (!force && this.isCompleted('process')) {
      return;
    }

    this.currentStep = 0;
    this.createOverlay();
    this.renderStep(0);
  }

  startRelationshipsTour(force = false) {
    this.activeTourType = 'relationships';
    this.storageKey = 'djbc_relationships_onboarding_completed';
    this.steps = this.relationshipsSteps;

    if (!force && this.isCompleted('relationships')) {
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
    this.overlay.style.cssText = 'position:fixed !important; inset:0 !important; z-index:2147483640 !important; pointer-events:auto !important; display:block !important;';

    this.popover = doc.createElement('div');
    this.popover.className = 'walkthrough-popover';
    this.popover.style.cssText = 'position:fixed !important; z-index:2147483647 !important; pointer-events:auto !important;';
    this.popover.addEventListener('click', (e) => e.stopPropagation());
    this.overlay.appendChild(this.popover);

    this.beacon = doc.createElement('div');
    this.beacon.className = 'walkthrough-beacon';
    this.beacon.style.cssText = 'position:fixed !important; z-index:2147483646 !important; pointer-events:none !important;';
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

    if (targetEl) {
      if (typeof targetEl.scrollIntoView === 'function') {
        try {
          targetEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
        } catch (e) {}
      }
      if (typeof targetEl.getBoundingClientRect === 'function') {
        rect = targetEl.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.bottom > 0) {
          hasValidRect = true;
        }
      }
    }

    // Default center placement fallback
    if (!hasValidRect || placement === 'center') {
      const top = Math.max(padding, Math.round(winHeight * 0.24));
      const left = Math.max(padding, Math.round(winWidth * 0.5 - popoverWidth * 0.5));

      this.popover.style.top = `${top}px`;
      this.popover.style.left = `${left}px`;
      this.popover.style.right = 'auto';
      this.popover.style.bottom = 'auto';
      this.popover.style.transform = 'none';

      if (this.beacon) {
        if (hasValidRect && rect) {
          this.beacon.style.display = 'flex';
          this.beacon.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
          this.beacon.style.top = `${Math.round(rect.top + rect.height / 2)}px`;
        } else {
          this.beacon.style.display = 'flex';
          this.beacon.style.left = `${Math.round(winWidth * 0.5)}px`;
          this.beacon.style.top = `${Math.max(40, top - 40)}px`;
        }
      }
      return;
    }

    if (targetEl.classList && targetEl.classList.add) {
      targetEl.classList.add('walkthrough-highlight-target');
    }
    this.currentTarget = targetEl;

    // Beacon position directly over target center
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
      // If top space is too tight, flip to bottom
      if (top < padding) {
        top = rect.bottom + 16;
      }
    } else if (placement === 'left') {
      top = Math.max(padding, rect.top);
      left = rect.left - popoverWidth - 20;
      if (left < padding) {
        left = rect.right + 20;
      }
    } else if (placement === 'right') {
      top = Math.max(padding, rect.top);
      left = rect.right + 20;
      if (left + popoverWidth > winWidth - padding) {
        left = rect.left - popoverWidth - 20;
      }
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


/* --- user-profile.js --- */

/**
 * user-profile.js — KLC2 User Profile Session, Token Fetcher & SCORM Bridge
 * Primary Authentication: KLC2 Session Cookie via /office/api/auth/session
 * Fallbacks: Token Storage, Parent Window, SCORM Learner Data
 */

class KLCUserProfileManager {
  constructor() {
    // Target Endpoint Sesi Utama KLC2 (Cookie Session)
    this.sessionEndpoints = [
      '/office/api/auth/session',
      'https://klc2.kemenkeu.go.id/office/api/auth/session',
      '/api/auth/session',
      'https://klc2.kemenkeu.go.id/api/auth/session',
      '/res/user/principal/me/profile',
      'https://klc2.kemenkeu.go.id/res/user/principal/me/profile',
      '/res/user/profile/me',
      '/res/user/me'
    ];

    this.pollIntervalMs = 30000;
    this.pollTimer = null;

    this.fallbackProfile = {
      name: 'Pegawai DJBC',
      userType: 'PEGAWAI DJBC',
      role: 'PEGAWAI DJBC',
      avatarUrl: '',
      nip: '-',
      email: '-'
    };
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  log(msg, obj = null) {
    console.log(`[UserProfile ${new Date().toLocaleTimeString()}] ${msg}`, obj || '');
  }

  async init() {
    this.log('Memulai inisialisasi UserProfile KLC2 Cookie Session...');

    // 1. Tampilkan profile tersimpan jika ada
    const savedProfile = this.getSavedProfile();
    if (savedProfile && savedProfile.name && savedProfile.name !== 'Peserta' && savedProfile.name !== 'Pegawai DJBC') {
      this.currentUser = savedProfile;
      this.isAuthenticated = true;
      this.render(savedProfile);
    } else {
      this.render(this.fallbackProfile);
    }

    // 2. Periksa URL Parameters (?token= / ?access_token=)
    if (typeof window !== 'undefined' && window.location && typeof URLSearchParams !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token') || urlParams.get('access_token');
      if (urlToken) {
        this.log('Token ditemukan di URL Parameter');
        this.saveToken(urlToken);
      }
    }

    // 3. Ekstrak data dari window.top / window.parent KLC2 jika ada
    this.checkParentWindowUserData();

    // 4. Periksa data dari SCORM API jika tersedia
    this.checkScormUserData();

    // 5. LAKUKAN PENGAMBILAN UTAMA VIA COOKIE SESSION (ENDPOINT /office/api/auth/session)
    let success = await this.fetchSessionFromKLC2();

    // 6. Jika Cookie Session belum berhasil, gunakan fallback token bertingkat
    if (!success) {
      const token = await this.obtainTokenFromKLC2();
      if (token) {
        success = await this.fetchProfileWithToken(token);
      }
    }

    // 7. Pasang listener navigasi & polling 30 detik
    this.setupNavigationListeners();
    this.start30SecPolling();
  }

  /**
   * MENGAMBIL USER PROFILE DARI SESSION COOKIE /office/api/auth/session (UTAMA)
   */
  async fetchSessionFromKLC2() {
    const activeToken = this.getStoredToken();

    for (const ep of this.sessionEndpoints) {
      try {
        this.log(`Mengirim request Cookie Session ke: ${ep}`);

        let controller = null;
        let signal = undefined;
        let timeoutId = null;

        if (typeof AbortController !== 'undefined') {
          controller = new AbortController();
          signal = controller.signal;
          timeoutId = setTimeout(() => controller.abort(), 4500);
        }

        const headers = {
          'Accept': 'application/json, text/plain, */*',
          'X-Requested-With': 'XMLHttpRequest'
        };

        if (activeToken) {
          headers['Authorization'] = activeToken.startsWith('Bearer') ? activeToken : `Bearer ${activeToken}`;
        }

        let requestUrl = ep;
        if (activeToken && !ep.includes('?')) {
          requestUrl = `${ep}?token=${encodeURIComponent(activeToken)}`;
        }

        if (typeof fetch === 'undefined') {
          if (timeoutId) clearTimeout(timeoutId);
          return false;
        }

        const response = await fetch(requestUrl, {
          method: 'GET',
          credentials: 'include', // Kunci untuk mengirimkan session cookie KLC2!
          headers: headers,
          signal: signal
        });

        if (timeoutId) clearTimeout(timeoutId);

        if (response && response.ok) {
          const json = await response.json();
          this.log(`Response dari ${ep} diterima`);

          const profile = this.parseProfileData(json);
          if (profile && profile.name && profile.name !== 'Peserta' && profile.name !== 'Pegawai DJBC') {
            this.log(`SUKSES BERHASIL! User Profile didapatkan dari ${ep}:`, profile.name);

            // Ekstrak token jika ada di dalam payload sesi
            const extractedToken = json.accessToken || json.token || json.user?.token || json.data?.token;
            if (extractedToken) {
              this.saveToken(extractedToken);
            }

            this.saveProfileToStorage(profile);
            this.render(profile);
            return true;
          }
        } else if (response) {
          this.log(`HTTP ${response.status} dari ${ep}`);
        }
      } catch (err) {
        this.log(`Catatan fetch ${ep}:`, err.message);
      }
    }
    return false;
  }

  async fetchProfileWithToken(token) {
    if (!token) return false;
    return await this.fetchSessionFromKLC2();
  }

  checkParentWindowUserData() {
    try {
      if (typeof window !== 'undefined' && window.top && window.top !== window) {
        const topWin = window.top;
        const topUser = topWin.user || topWin.currentUser || topWin.USER_DATA || topWin.principal || topWin.profile;
        if (topUser) {
          const parsed = this.parseProfileData(topUser);
          if (parsed && parsed.name && parsed.name !== 'Peserta' && parsed.name !== 'Pegawai DJBC') {
            this.log('User profile ditemukan dari window.top:', parsed.name);
            this.saveProfileToStorage(parsed);
            this.render(parsed);
            return true;
          }
        }
      }
    } catch (e) {}
    return false;
  }

  checkScormUserData() {
    try {
      if (typeof window !== 'undefined' && window.scorm && typeof window.scorm.getValue === 'function') {
        const scormName = window.scorm.getValue('cmi.core.student_name');
        if (scormName && typeof scormName === 'string' && scormName.trim()) {
          // Format SCORM biasanya "Last, First" -> ubah jadi "First Last"
          let formattedName = scormName.trim();
          if (formattedName.includes(',')) {
            const parts = formattedName.split(',').map(s => s.trim());
            if (parts.length >= 2) {
              formattedName = `${parts[1]} ${parts[0]}`;
            }
          }
          const scormId = window.scorm.getValue('cmi.core.student_id') || '-';
          const profile = {
            name: formattedName,
            avatarUrl: '',
            userType: 'PEGAWAI DJBC',
            role: 'PEGAWAI DJBC',
            email: '-',
            nip: scormId
          };
          this.log('User data didapatkan dari SCORM LMS:', formattedName);
          if (!this.currentUser || !this.currentUser.name || this.currentUser.name === 'Pegawai DJBC') {
            this.saveProfileToStorage(profile);
            this.render(profile);
          }
        }
      }
    } catch (e) {}
  }

  async obtainTokenFromKLC2() {
    if (typeof window === 'undefined') return '';
    const urlParams = (window.location && window.location.search) ? new URLSearchParams(window.location.search) : null;
    let token = urlParams ? (urlParams.get('token') || urlParams.get('access_token')) : '';
    if (token) {
      this.saveToken(token);
      return token;
    }

    token = this.scanStoragesForToken();
    if (token) {
      this.saveToken(token);
      return token;
    }

    const cookieToken = this.getCookie('klc_token') || this.getCookie('access_token') || this.getCookie('token') || this.getCookie('next-auth.session-token');
    if (cookieToken) {
      this.saveToken(cookieToken);
      return cookieToken;
    }

    return this.getStoredToken();
  }

  scanStoragesForToken() {
    const storages = [];
    try { if (window.top && window.top.localStorage) storages.push(window.top.localStorage); } catch(e){}
    try { if (window.top && window.top.sessionStorage) storages.push(window.top.sessionStorage); } catch(e){}
    try { if (window.localStorage) storages.push(window.localStorage); } catch(e){}
    try { if (window.sessionStorage) storages.push(window.sessionStorage); } catch(e){}

    const knownKeys = ['klc_token', 'access_token', 'token', 'auth_token', 'bearer_token', 'jwt_token', 'user_token', 'id_token', 'session_token'];

    for (const store of storages) {
      for (const key of knownKeys) {
        try {
          const val = store.getItem(key);
          if (val && typeof val === 'string' && val.length > 10) {
            const clean = val.replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '').trim();
            if (clean) return clean;
          }
        } catch(e) {}
      }
    }

    for (const store of storages) {
      try {
        for (let i = 0; i < store.length; i++) {
          const k = store.key(i);
          const val = store.getItem(k);
          if (val && typeof val === 'string' && val.includes('eyJ')) {
            const jwtMatch = val.match(/eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/);
            if (jwtMatch) return jwtMatch[0];
          }
        }
      } catch(e) {}
    }

    return '';
  }

  saveToken(token) {
    if (!token) return;
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem('klc_token', token);
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('klc_token', token);
      if (typeof window !== 'undefined' && window.top && window.top !== window) {
        try {
          window.top.localStorage.setItem('klc_token', token);
        } catch (e) {}
      }
      this.log('Token otentikasi disimpan.');
    } catch (e) {}
  }

  getStoredToken() {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token') || urlParams.get('access_token');
        if (urlToken) {
          this.saveToken(urlToken);
          return urlToken;
        }
      }

      const scanned = this.scanStoragesForToken();
      if (scanned) return scanned;

      return (typeof localStorage !== 'undefined' ? localStorage.getItem('klc_token') : '') ||
             (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('klc_token') : '') ||
             (typeof localStorage !== 'undefined' ? localStorage.getItem('access_token') : '') || '';
    } catch (e) {
      return '';
    }
  }

  getCookie(name) {
    try {
      if (typeof document === 'undefined') return '';
      const cookieString = document.cookie || (window.top && window.top.document ? window.top.document.cookie : '');
      const match = cookieString.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return decodeURIComponent(match[2]);
    } catch(e) {}
    return '';
  }

  /**
   * Mem-parser Objek Sesi / Profil yang dikirimkan oleh KLC2
   */
  parseProfileData(json) {
    if (!json) return null;

    // Mendukung format NextAuth session { user: { name, email, image, provider }, expires }
    const userObj = json.user || json.data || json.payload || json.principal || json.profile || json;
    if (!userObj) return null;

    let userName = userObj.name || userObj.fullName || userObj.full_name || userObj.nama || userObj.student_name || json.name || '';
    let userPhoto = userObj.image || userObj.picture || userObj.image_url || userObj.avatar || userObj.avatarUrl || userObj.avatar_url || userObj.photo || json.image || json.avatar || '';

    if (!userName) return null;

    if (userPhoto && !userPhoto.startsWith('http://') && !userPhoto.startsWith('https://') && !userPhoto.startsWith('data:')) {
      if (userPhoto.startsWith('/')) {
        userPhoto = `https://klc2.kemenkeu.go.id${userPhoto}`;
      } else {
        userPhoto = `https://klc2.kemenkeu.go.id/${userPhoto}`;
      }
    }

    // Ekstrak Jenis User dari field 'provider' (diubah menjadi UPPERCASE seluruhnya)
    let rawProvider = userObj.provider || json.provider || userObj.user_type || userObj.userType || userObj.type || 'PEGAWAI DJBC';
    let userType = String(rawProvider).toUpperCase();

    return {
      name: userName,
      avatarUrl: userPhoto,
      userType: userType,
      role: userType, // Untuk badge header
      email: userObj.email || json.email || '-',
      nip: userObj.nip || userObj.preferred_username || userObj.username || '-'
    };
  }

  saveProfileToStorage(profile) {
    try {
      if (!profile || !profile.name || profile.name === 'Peserta' || profile.name === 'Pegawai DJBC') return;
      this.isAuthenticated = true;
      this.currentUser = profile;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('klc_user_profile', JSON.stringify(profile));
      }
    } catch (e) {}
  }

  getSavedProfile() {
    try {
      if (typeof localStorage !== 'undefined') {
        const str = localStorage.getItem('klc_user_profile');
        if (str) return JSON.parse(str);
      }
    } catch (e) {}
    return null;
  }

  setupNavigationListeners() {
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('hashchange', () => this.fetchSessionFromKLC2());
      window.addEventListener('popstate', () => this.fetchSessionFromKLC2());
      window.addEventListener('pageshow', () => this.fetchSessionFromKLC2());
    }
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') this.fetchSessionFromKLC2();
      });
    }
  }

  start30SecPolling() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (typeof setInterval !== 'undefined') {
      this.pollTimer = setInterval(() => this.fetchSessionFromKLC2(), this.pollIntervalMs);
    }
  }

  render(profile) {
    if (typeof document === 'undefined') return;

    if (this.currentUser && this.currentUser.name && this.currentUser.name !== 'Peserta' && this.currentUser.name !== 'Pegawai DJBC' && (!profile || profile.name === 'Peserta' || profile.name === 'Pegawai DJBC')) {
      profile = this.currentUser;
    }

    const user = profile || this.fallbackProfile;

    if (user && user.name && user.name !== 'Peserta' && user.name !== 'Pegawai DJBC') {
      this.currentUser = user;
      this.isAuthenticated = true;
    }

    const profileWidgets = document.querySelectorAll('#user-profile-widget, .user-profile-widget, .user-profile-header');
    profileWidgets.forEach(w => {
      w.style.cursor = 'pointer';
      w.onclick = () => this.showProfileDetailModal(user);
    });

    const nameEls = document.querySelectorAll('#user-display-name, .user-display-name, .user-name');
    const roleEls = document.querySelectorAll('#user-display-role, .user-display-role, .user-role');
    const imgEls = document.querySelectorAll('#user-avatar-img, .user-avatar-img');
    const placeholderEls = document.querySelectorAll('#user-avatar-placeholder, .user-avatar-placeholder');
    const initialsEls = document.querySelectorAll('#user-avatar-initials, .user-avatar-initials');

    let initials = 'BC';
    if (user.name) {
      const parts = user.name.trim().split(' ').filter(Boolean);
      if (parts.length >= 2) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else if (parts.length === 1 && parts[0].length > 0) {
        initials = parts[0].substring(0, 2).toUpperCase();
      }
    }

    nameEls.forEach(el => { el.textContent = user.name || 'Pegawai DJBC'; });
    roleEls.forEach(el => { el.textContent = user.userType || user.role || 'PEGAWAI DJBC'; });
    initialsEls.forEach(el => { el.textContent = initials; });

    if (user.avatarUrl) {
      imgEls.forEach(img => {
        img.src = user.avatarUrl;
        img.style.display = 'block';
        img.onerror = () => {
          img.style.display = 'none';
          placeholderEls.forEach(p => {
            p.style.display = 'flex';
          });
        };
      });
      placeholderEls.forEach(p => { p.style.display = 'none'; });
    } else {
      imgEls.forEach(img => { img.style.display = 'none'; });
      placeholderEls.forEach(p => {
        p.style.display = 'flex';
      });
    }
  }

  showProfileDetailModal(profile) {
    if (typeof document === 'undefined') return;

    let modal = document.getElementById('klc-user-profile-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'klc-user-profile-detail-modal';
      modal.style.cssText = 'position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.6); backdrop-filter:blur(6px); z-index:999999; padding:16px;';
      document.body.appendChild(modal);
    }

    const user = profile || this.fallbackProfile;
    const initialText = (user.name || 'BC').substring(0, 2).toUpperCase();

    modal.innerHTML = `
      <div style="background:linear-gradient(145deg, #0B3A6F 0%, #062347 100%); border:1px solid #D9B45B; border-radius:18px; padding:24px; max-width:360px; width:100%; color:#FFFFFF; box-shadow:0 20px 40px rgba(0,0,0,0.4); position:relative; font-family:'Poppins',sans-serif;">
        <button id="close-user-profile-detail-modal" style="position:absolute; top:12px; right:12px; background:none; border:none; color:rgba(255,255,255,0.7); font-size:22px; cursor:pointer; padding:4px 8px; line-height:1;" title="Tutup">&times;</button>
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center;">
          <!-- 1. Foto Profil & Inisial Nama -->
          <div style="width:76px; height:76px; border-radius:50%; border:2.5px solid #D9B45B; overflow:hidden; margin-bottom:12px; box-shadow:0 4px 14px rgba(0,0,0,0.3); background:#0B3A6F; display:flex; align-items:center; justify-content:center;">
            ${user.avatarUrl ? `<img src="${user.avatarUrl}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
            <span style="font-size:22px; font-weight:700; color:#D9B45B; ${user.avatarUrl ? 'display:none;' : ''}">${initialText}</span>
          </div>

          <!-- 2. Nama Lengkap -->
          <h3 style="font-size:16px; font-weight:700; color:#FFFFFF; margin-bottom:14px; line-height:1.3;">${user.name}</h3>

          <!-- 3. Email -->
          <div style="background:rgba(255,255,255,0.08); width:100%; padding:9px 14px; border-radius:10px; font-size:12px; color:#E2E8F0; margin-bottom:8px; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:space-between;">
            <span style="color:rgba(255,255,255,0.6); font-weight:500;">Email</span>
            <span style="font-weight:600; color:#FFFFFF;">${user.email || '-'}</span>
          </div>

          <!-- 4. Detail NIP -->
          <div style="background:rgba(255,255,255,0.08); width:100%; padding:9px 14px; border-radius:10px; font-size:12px; color:#E2E8F0; margin-bottom:8px; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:space-between;">
            <span style="color:rgba(255,255,255,0.6); font-weight:500;">NIP</span>
            <span style="font-weight:600; color:#FFFFFF;">${user.nip || '-'}</span>
          </div>

          <!-- 5. Jenis User (UPPERCASE) -->
          <div style="background:rgba(255,255,255,0.08); width:100%; padding:9px 14px; border-radius:10px; font-size:12px; color:#E2E8F0; margin-bottom:4px; border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:space-between;">
            <span style="color:rgba(255,255,255,0.6); font-weight:500;">Jenis User</span>
            <span style="font-weight:700; color:#D9B45B;">${(user.userType || user.provider || 'PEGAWAI DJBC').toUpperCase()}</span>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'flex';

    const closeBtn = document.getElementById('close-user-profile-detail-modal');
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = 'none';
      };
    }
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    };
  }
}

const userProfile = new KLCUserProfileManager();
if (typeof window !== 'undefined') {
  window.UserProfile = userProfile;
  window.KLCUserProfileManager = KLCUserProfileManager;
}

if (typeof window !== 'undefined') {
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('message', (event) => {
      if (event.data && (event.data.token || event.data.type === 'KLC_AUTH_TOKEN' || event.data.name)) {
        if (event.data.name) {
          const parsed = window.UserProfile.parseProfileData(event.data);
          if (parsed) {
            window.UserProfile.saveProfileToStorage(parsed);
            window.UserProfile.render(parsed);
          }
        } else {
          const token = event.data.token || event.data.payload;
          if (token) {
            window.UserProfile.saveToken(token);
            window.UserProfile.init();
          }
        }
      }
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading' && typeof document.addEventListener === 'function') {
      document.addEventListener('DOMContentLoaded', () => window.UserProfile.init());
    } else {
      window.UserProfile.init();
    }
  }
}


/* --- app.js --- */

/**
 * app.js — Main Application Orchestrator for DJBC Interactive Organization Explorer.
 * Connects SVGTreeEngine, IndonesiaMapEngine, DetailPanel, SearchEngine, AssessmentEngine,
 * LearningModuleEngine, ProcessFlowEngine, RelationshipsViewEngine, and Navigation.
 */
















class DJBCExplorerApp {
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


})();
