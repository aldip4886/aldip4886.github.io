/**
 * Local Search Engine & Inverted Index Generator
 * Aligned with PRD v2.0 (Offline-first client-side index, filters, pagination)
 */

window.SearchView = {
    container: null,
    searchIndex: [], // Array of searchable flat items
    results: [],
    pageSize: 8,
    currentPage: 1,
    query: '',
    
    async initIndex() {
        // If index is fully built, do not rebuild
        if (this.searchIndex.length > 50) return;
        
        this.searchIndex = []; // Reset to ensure a clean build
        console.log("Generating Search Index...");
        
        try {
            // Load all dataset files
            const kanpus = await window.Data.load('kantor-pusat');
            const vertikal = await window.Data.load('instansi-vertikal');
            const upt = await window.Data.load('upt');
            
            // 1. Index Kantor Pusat (Eselon I, II, III, IV)
            this.indexNode(kanpus, 'kanpus');
            
            // 2. Index Vertikal (Kanwil, KPU, KPPBC, Bidang Eselon III, Seksi Eselon IV)
            this.indexNode(vertikal, 'vertikal');
            
            // 3. Index UPT (BLBC, PSO, Subbag/Seksi Eselon IV)
            this.indexNode(upt, 'upt');
            
            console.log(`Search Index built successfully: ${this.searchIndex.length} searchable items.`);
        } catch(e) {
            console.error("Error building search index:", e);
        }
    },
    
    indexNode(node, defaultCat, parentNode = null) {
        if (!node) return;
        
        // Skip root placeholder nodes from list results, index children instead
        const isRootNode = node.id === 'root' || node.id === 'upt-djbc' || node.id === 'instansi-vertikal-djbc';
        
        if (!isRootNode && node.id && node.nama) {
            // Determine category classification
            let category = defaultCat;
            const nodeLevel = (node.level || '').toLowerCase();
            const eselonKepala = (node.eselon_kepala || '').toLowerCase();
            const id = node.id;
            
            if (id.startsWith('kanwil-')) {
                category = 'kanwil';
            } else if (id.startsWith('kpu-')) {
                category = 'kpu';
            } else if (id.startsWith('blbc-')) {
                category = 'blbc';
            } else if (id.startsWith('pso-')) {
                category = 'pso';
            } else if (id.startsWith('kppbc-') || eselonKepala === 'eselon-3b' || (defaultCat === 'vertikal' && nodeLevel === 'eselon-3')) {
                category = 'kppbc';
            } else if (nodeLevel === 'eselon-3' || nodeLevel === 'eselon-3a' || nodeLevel === 'eselon-3b') {
                category = 'eselon-3';
            } else if (nodeLevel === 'eselon-4' || nodeLevel === 'eselon-4a' || nodeLevel === 'eselon-4b') {
                category = 'eselon-4';
            }
            
            // Build rich searchable keywords string (safely handling arrays / strings)
            const namaStr = node.nama || '';
            const singkatanStr = node.singkatan || '';
            const tugasStr = node.tugas || '';
            const fungsiStr = Array.isArray(node.fungsi) ? node.fungsi.join(' ') : (node.fungsi || '');
            const jabatanStr = node.jabatan_pimpinan || '';
            const dasarHukumStr = node.dasar_hukum || '';
            const satpelStr = Array.isArray(node.satuan_pelayanan) ? node.satuan_pelayanan.join(' ') : (node.satuan_pelayanan || '');
            const subpangkalanStr = Array.isArray(node.subpangkalan) ? node.subpangkalan.join(' ') : (node.subpangkalan || '');
            const parentNamaStr = parentNode ? (parentNode.singkatan || parentNode.nama || '') : '';
            
            const keywords = [
                id,
                namaStr,
                singkatanStr,
                tugasStr,
                fungsiStr,
                jabatanStr,
                dasarHukumStr,
                satpelStr,
                subpangkalanStr,
                parentNamaStr
            ].join(' ').toLowerCase();
            
            this.searchIndex.push({
                id: id,
                nama: namaStr,
                singkatan: singkatanStr,
                tugas: tugasStr,
                level: nodeLevel || (category === 'kppbc' ? 'eselon-3' : 'eselon-2'),
                category: category,
                keywords: keywords,
                parentId: parentNode ? parentNode.id : null,
                parentNama: parentNamaStr,
                pembinaTeknis: node.pembina_teknis || null,
                pembinaAdm: node.pembina_adm || null
            });
        }
        
        // Recursively index primary children
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => this.indexNode(child, defaultCat, node));
        }
        
        // Recursively index internal sub_units (e.g. Bidang di Kanwil or Seksi di KPPBC)
        if (node.sub_units && Array.isArray(node.sub_units)) {
            node.sub_units.forEach(sub => {
                if (!sub || !sub.nama) return;
                const subId = sub.id || `${node.id}-${sub.nama.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`;
                const subLevel = (sub.level || (node.level === 'eselon-2' ? 'eselon-3' : 'eselon-4')).toLowerCase();
                const subCat = (subLevel === 'eselon-3' || subLevel === 'eselon-3a' || subLevel === 'eselon-3b') ? 'eselon-3' : 'eselon-4';
                
                const keywords = [
                    subId,
                    sub.nama || '',
                    sub.tugas || '',
                    node.singkatan || node.nama || ''
                ].join(' ').toLowerCase();
                
                this.searchIndex.push({
                    id: subId,
                    nama: sub.nama || '',
                    singkatan: '',
                    tugas: sub.tugas || '',
                    level: subLevel,
                    category: subCat,
                    keywords: keywords,
                    parentId: node.id,
                    parentNama: node.singkatan || node.nama
                });
            });
        }
    },
    
    getRelatedUnits(item) {
        const related = [];
        
        // 1. Induk Unit (Parent)
        if (item.parentId && item.parentNama) {
            related.push({ id: item.parentId, label: `Induk: ${item.parentNama}` });
        }
        
        // 2. Pembina Teknis / Adm
        if (item.pembinaTeknis) {
            const tek = this.searchIndex.find(x => x.id === item.pembinaTeknis);
            if (tek) related.push({ id: tek.id, label: `Pembina Teknis: ${tek.singkatan || tek.nama}` });
        }
        if (item.pembinaAdm) {
            const adm = this.searchIndex.find(x => x.id === item.pembinaAdm);
            if (adm) related.push({ id: adm.id, label: `Pembina Adm: ${adm.singkatan || adm.nama}` });
        }
        
        // 3. Anak Unit (Children)
        if (['kanwil', 'kanpus'].includes(item.category)) {
            const children = this.searchIndex.filter(x => x.parentId === item.id && !['sub-unit', 'eselon-4'].includes(x.category));
            children.slice(0, 4).forEach(c => {
                related.push({ id: c.id, label: c.singkatan || c.nama });
            });
            if (children.length > 4) {
                related.push({ id: item.id, label: `+${children.length - 4} Kantor Lainnya` });
            }
        }
        
        // 4. UPT yang dibina oleh unit ini
        const underPembina = this.searchIndex.filter(x => x.pembinaAdm === item.id || x.pembinaTeknis === item.id);
        underPembina.forEach(u => {
            related.push({ id: u.id, label: `Membina UPT: ${u.singkatan || u.nama}` });
        });

        // De-duplicate related list by target ID
        const unique = [];
        const seen = new Set();
        related.forEach(r => {
            if (r && r.id && !seen.has(r.id)) {
                seen.add(r.id);
                unique.push(r);
            }
        });

        return unique;
    },
    
    async mount(params) {
        this.container = document.getElementById('search-results-screen');
        if (!this.container) return;
        
        // Ensure index is built
        await this.initIndex();
        
        this.query = (params.query || '').trim();
        document.getElementById('header-view-title').textContent = `Hasil Pencarian: "${this.query}"`;
        
        this.currentPage = 1;
        this.performSearch();
        this.renderResults();
        
        // Hook header/sidebar input values
        const sidebarInput = document.getElementById('sidebar-search-input');
        const clearBtn = document.getElementById('sidebar-search-clear');
        if (sidebarInput) {
            sidebarInput.value = this.query;
            if (clearBtn) {
                if (sidebarInput.value.length > 0) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                }
            }
        }
    },
    
    performSearch() {
        if (!this.query) {
            this.results = [];
            return;
        }
        
        const rawTerms = this.query.split(/\s+/).map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
        if (rawTerms.length === 0) {
            this.results = [];
            return;
        }
        
        this.results = this.searchIndex.map(item => {
            let score = 0;
            const namaLower = (item.nama || '').toLowerCase();
            const singkatanLower = (item.singkatan || '').toLowerCase();
            const tugasLower = (item.tugas || '').toLowerCase();
            const parentNamaLower = (item.parentNama || '').toLowerCase();
            const keywordsLower = (item.keywords || '').toLowerCase();
            
            rawTerms.forEach(term => {
                // Exact name / abbreviation matches
                if (namaLower === term) score += 30;
                else if (namaLower.includes(term)) score += 15;
                
                if (singkatanLower && singkatanLower === term) score += 35;
                else if (singkatanLower && singkatanLower.includes(term)) score += 20;
                
                // Match in Parent Name
                if (parentNamaLower && parentNamaLower.includes(term)) score += 8;
                
                // Match in Duty description
                if (tugasLower && tugasLower.includes(term)) score += 5;
                
                // General keyword match
                if (keywordsLower.includes(term)) score += 2;
            });
            
            return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);
    },
    
    renderResults() {
        if (this.results.length === 0) {
            this.container.innerHTML = `
                <div class="search-page-layout">
                    <div class="search-empty-state">
                        <span class="empty-icon">🔍</span>
                        <h3>Tidak ada hasil ditemukan</h3>
                        <p class="empty-desc">Tidak menemukan unit kerja yang cocok dengan kata kunci "${this.query}". Coba cari kata kunci lain seperti "impor", "P2", "laboratorium", "penindakan", "keuangan", atau nama kota.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Pagination slicing
        const totalItems = this.results.length;
        const totalPages = Math.ceil(totalItems / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, totalItems);
        const paginatedItems = this.results.slice(startIndex, endIndex);
        
        const badgeMap = {
            'kanpus': 'badge-kanpus',
            'kanwil': 'badge-kanwil',
            'kpu': 'badge-kpu',
            'kppbc': 'badge-kppbc',
            'blbc': 'badge-blbc',
            'pso': 'badge-pso',
            'eselon-3': 'badge-vertikal',
            'eselon-4': 'badge-vertikal',
            'sub-unit': 'badge-vertikal'
        };
        
        const labelMap = {
            'kanpus': 'Kantor Pusat',
            'kanwil': 'Kantor Wilayah',
            'kpu': 'KPU Bea Cukai',
            'kppbc': 'KPPBC Pelayanan Cukai',
            'blbc': 'UPT Laboratorium',
            'pso': 'UPT Pangkalan Patroli',
            'eselon-3': 'Unit Eselon III',
            'eselon-4': 'Sub-unit / Seksi (Eselon IV)',
            'sub-unit': 'Sub-unit Internal'
        };
        
        this.container.innerHTML = `
            <div class="search-page-layout flex flex-col h-full">
                <div class="search-summary-info">
                    Ditemukan <strong>${totalItems}</strong> unit kerja untuk kata kunci "${this.query}".
                </div>
                
                <!-- Results List -->
                <div class="search-results-list flex-1">
                    ${paginatedItems.map(item => {
                        const related = this.getRelatedUnits(item);
                        const descText = (item.tugas || '');
                        const truncatedDesc = descText.length > 160 ? descText.substring(0, 160) + '...' : descText;
                        const categoryBadgeClass = badgeMap[item.category] || 'badge-vertikal';
                        const categoryLabel = labelMap[item.category] || 'Unit Kerja';

                        return `
                            <div class="search-result-card card flex flex-col" onclick="window.SearchView.handleResultClick('${item.id}')">
                                <div class="result-card-header flex items-center justify-between">
                                    <h4 class="result-title">${item.nama} ${item.singkatan ? `(${item.singkatan})` : ''}</h4>
                                    <span class="badge ${categoryBadgeClass}">${categoryLabel}</span>
                                </div>
                                <p class="result-desc">${truncatedDesc || 'Tugas dan fungsi unit kerja berdasarkan ketentuan PMK Organisasi Bea dan Cukai.'}</p>
                                ${item.parentNama ? `<div class="result-parent">Milik unit: <strong>${item.parentNama}</strong></div>` : ''}
                                
                                ${related.length > 0 ? `
                                    <div class="result-related-units flex" style="flex-wrap: wrap; gap: var(--spacing-xs); margin-top: var(--spacing-sm); border-top: 1px solid var(--border); padding-top: var(--spacing-xs);">
                                        <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); width: 100%;">Unit Kerja Terkait:</span>
                                        ${related.map(r => `
                                            <span class="interaksi-chip" onclick="event.stopPropagation(); window.SearchView.handleResultClick('${r.id}')" style="cursor: pointer; font-size: 0.65rem; padding: 2px 8px;">
                                                🔗 ${r.label}
                                            </span>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Pagination Footer -->
                ${totalPages > 1 ? `
                    <div class="search-pagination flex items-center justify-center">
                        <button class="btn btn-secondary btn-nav-page" ${this.currentPage === 1 ? 'disabled' : ''} onclick="window.SearchView.changePage(${this.currentPage - 1})">Sebelumnya</button>
                        <span class="pagination-indicator">Halaman <strong>${this.currentPage}</strong> dari <strong>${totalPages}</strong></span>
                        <button class="btn btn-secondary btn-nav-page" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="window.SearchView.changePage(${this.currentPage + 1})">Berikutnya</button>
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    changePage(pageNum) {
        if (window.LandingView && window.LandingView.playBeep) {
            window.LandingView.playBeep('click');
        }
        this.currentPage = pageNum;
        this.renderResults();
    },
    
    handleResultClick(id) {
        if (window.LandingView && window.LandingView.playBeep) {
            window.LandingView.playBeep('click');
        }
        
        const item = this.searchIndex.find(x => x.id === id);
        if (!item) return;
        
        const cat = item.category;
        
        if (cat === 'kanwil') {
            window.location.hash = `#/kanwil/${id}`;
        } else if (cat === 'kpu' || cat === 'kppbc') {
            window.location.hash = `#/kppbc/${id}`;
        } else if (['blbc', 'pso'].includes(cat)) {
            window.location.hash = `#/upt/${id}`;
        } else if (cat === 'eselon-3') {
            if (item.parentId) {
                window.location.hash = `#/eselon-3/${item.parentId}/${item.id}`;
            } else {
                window.location.hash = `#/eselon-3/root/${item.id}`;
            }
        } else if (cat === 'eselon-4' || cat === 'sub-unit') {
            if (window.KnowledgeCardModal && window.KnowledgeCardModal.showCustomSubunit) {
                window.KnowledgeCardModal.showCustomSubunit(item, item.parentNama || 'Unit Induk');
            } else if (item.parentId) {
                window.location.hash = `#/eselon-3/${item.parentId}/${item.id}`;
            } else {
                window.location.hash = `#/explorer`;
            }
        } else {
            if (window.KnowledgeCardModal) {
                window.KnowledgeCardModal.show(id);
            }
        }
    }
};

// Hook up sidebar search bar action inputs globally
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('sidebar-search-input');
    const btn = document.getElementById('sidebar-search-btn');
    const clearBtn = document.getElementById('sidebar-search-clear');
    
    const triggerSearch = () => {
        const query = (input.value || '').trim();
        if (query) {
            window.location.hash = `#/cari?q=${encodeURIComponent(query)}`;
        }
    };
    
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') triggerSearch();
        });
        
        // Toggle clear button on input keyup
        input.addEventListener('input', () => {
            if (clearBtn) {
                if (input.value.length > 0) {
                    clearBtn.classList.remove('hidden');
                } else {
                    clearBtn.classList.add('hidden');
                }
            }
        });
    }
    
    if (btn) {
        btn.addEventListener('click', triggerSearch);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (window.LandingView && window.LandingView.playBeep) {
                window.LandingView.playBeep('click');
            }
            input.value = '';
            clearBtn.classList.add('hidden');
            input.focus();
            
            // Redirect to main Explorer
            window.location.hash = '#/explorer';
        });
    }
});

if (window.App) {
    window.App.registerView('search-results', window.SearchView);
}
