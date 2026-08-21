/**
 * search.js — Client-side Static Search Engine & Search Results Page matching Stitch Screen 04.
 * Features:
 * - Live auto-complete dropdown on global search bar
 * - Full Search Results Page with 2-Column Bento Grid, Filter Chips, Highlight Spans
 * - Direct "Buka di Struktur" action focusing on tree canvas with optimal zoom
 * - 100% static & offline compatible with file:// protocol
 */

import { debounce, escapeHtml, getUnitIcon } from './utils.js';

export class SearchEngine {
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
