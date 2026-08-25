/**
 * panel.js — Contextual Detail Drawer Panel matching Stitch Screen 03 design.
 * Safely resolves unit IDs and child unit objects from unitsDict, eliminating undefined labels.
 * Reliably displays sub-units for all Kantor Pusat, Instansi Vertikal, and UPT units.
 */

import { formatBadgeClass, getUnitIcon } from './utils.js';

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

export class DetailPanel {
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
