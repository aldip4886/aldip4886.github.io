/**
 * Global Knowledge Card Modal Controller
 * Aligned with PRD v2.0 (5-tab detail overlay for any unit in the system)
 */

window.KnowledgeCardModal = {
    modalEl: null,
    activeTab: 'summary',
    currentUnit: null,
    
    init() {
        this.modalEl = document.getElementById('knowledge-card-modal');
    },
    
    async show(unitId) {
        if (!this.modalEl) this.init();
        
        // Fetch unit details from general resolver
        let resolverResult;
        try {
            resolverResult = await window.Data.getUnit(unitId);
            if (!resolverResult) {
                console.error(`Unit not found for ID: ${unitId}`);
                return;
            }
        } catch(e) {
            console.error(`Error loading unit detail:`, e);
            return;
        }
        
        this.currentUnit = resolverResult.data;
        const category = resolverResult.category; // kanpus, kanwil, kpu, kppbc, blbc, pso
        
        this.activeTab = 'summary';
        this.renderModal(category);
        this.setupTabListeners();
        
        // Show modal
        this.modalEl.classList.remove('hidden');
    },
    
    // Render Sidebar Panel for Tenaga Pengkaji (Detail Info Panel Overlay)
    showTenagaPengkaji(unitData) {
        if (!this.modalEl) this.init();
        if (!unitData) return;
        
        const categoryTag = "Tenaga Pengkaji Eselon II";
        const badgeStyle = "background: rgba(139, 92, 246, 0.25); color: #C084FC; border: 1px solid #C084FC;";
        
        const fungsiList = Array.isArray(unitData.fungsi) && unitData.fungsi.length > 0 
            ? unitData.fungsi.map(f => `
                <li style="font-size: 0.85rem; color: #FFFFFF; line-height: 1.5; display: flex; gap: 10px; background: #071527; padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                    <span style="color: #10B981; font-weight: 900; font-size: 0.95rem;">✓</span> 
                    <span>${f}</span>
                </li>
            `).join('')
            : `<li style="font-size: 0.85rem; color: #FFFFFF; background: #071527; padding: 12px 14px; border-radius: 8px;"><span style="color: #10B981;">✓</span> Melaksanakan pengkajian materi dan evaluasi pelaksanaan kebijakan teknis.</li>`;

        this.modalEl.innerHTML = `
            <div class="modal-card" style="max-width: 620px; width: 92%; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.4); border-radius: 16px; box-shadow: 0 14px 40px rgba(0,0,0,0.7); animation: fadeIn 0.25s ease;">
                <!-- Sidebar Header -->
                <div class="modal-header" style="border-bottom: 2px solid var(--djbc-gold); padding: 20px 24px;">
                    <div class="modal-title-container">
                        <span class="badge" style="${badgeStyle} padding: 5px 12px; border-radius: 6px; font-size: 0.775rem; font-weight: 800; display: inline-block; margin-bottom: 8px; letter-spacing: 0.5px;">${categoryTag}</span>
                        <h3 class="modal-title" style="margin: 0; color: #FFFFFF; font-size: 1.25rem; font-weight: 800; line-height: 1.35;">${unitData.nama}</h3>
                    </div>
                    <button class="modal-close-btn" onclick="window.KnowledgeCardModal.close()" style="color: #FFFFFF; font-size: 1.8rem; line-height: 1;">&times;</button>
                </div>
                
                <!-- Sidebar Body (detail-info-panel content) -->
                <div class="modal-body" style="padding: 24px; display: flex; flex-direction: column; gap: 20px; max-height: 72vh; overflow-y: auto;">
                    <!-- Leadership & Legal Base -->
                    <div class="info-section">
                        <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Jabatan Pimpinan & Dasar Hukum</h4>
                        <div style="background: #071527; padding: 14px; border-radius: 10px; border-left: 4px solid var(--djbc-gold);">
                            <p style="margin: 0 0 6px 0; color: #FFFFFF; font-size: 0.925rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                <span>👑</span> <span>${unitData.jabatan_pimpinan || 'Tenaga Pengkaji Eselon II'}</span>
                            </p>
                            <p style="margin: 0; color: #FFFFFF; font-size: 0.825rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                <span>⚖️</span> <span style="color: rgba(255,255,255,0.9);">Dasar Hukum: ${unitData.dasar_hukum || 'PMK Nomor 124 Tahun 2024'}</span>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Duty -->
                    <div class="info-section">
                        <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Tugas Utama</h4>
                        <p class="section-body-detail" style="margin: 0; color: #FFFFFF; font-size: 0.875rem; line-height: 1.6; background: #071527; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); font-weight: 500;">
                            ${unitData.tugas || 'Melaksanakan perumusan dan pengkajian strategis di bidang kepabeanan dan cukai.'}
                        </p>
                    </div>
                    
                    <!-- Functions -->
                    <div class="info-section">
                        <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Rincian Fungsi Pengkajian Strategis</h4>
                        <ul class="fungsi-checklist-list" style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px;">
                            ${fungsiList}
                        </ul>
                    </div>
                </div>
                
                <!-- Sidebar Footer -->
                <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: flex-end; background: #091A2F;">
                    <button class="btn btn-secondary" onclick="window.KnowledgeCardModal.close()" style="background: #0D2137; border: 1px solid var(--djbc-gold); color: #FFFFFF; padding: 8px 20px; border-radius: 8px; font-weight: 700; cursor: pointer;">Tutup</button>
                </div>
            </div>
        `;
        
        this.modalEl.classList.remove('hidden');
    },
    
    // Render detail popup modal for Eselon IV/III sub-units (like Seksi P2 inside KPPBC or Bidang inside Kanwil)
    showCustomSubunit(subunit, parentName) {
        if (!this.modalEl) this.init();
        
        this.modalEl.innerHTML = `
            <div class="modal-card" style="height: auto; max-height: 480px;">
                <div class="modal-header">
                    <div class="modal-title-container">
                        <span class="modal-title">${subunit.nama}</span>
                        <span class="modal-subtitle">Sub-unit di bawah ${parentName}</span>
                    </div>
                    <button class="modal-close-btn" onclick="window.KnowledgeCardModal.close()">&times;</button>
                </div>
                <div class="modal-body" style="padding: var(--spacing-lg); overflow-y: auto;">
                    <div class="info-section">
                        <h4 class="section-heading-detail">Tugas Pokok & Tanggung Jawab</h4>
                        <p class="section-body-detail" style="font-size: 0.85rem; line-height: 1.6; color: var(--text-body);">${subunit.tugas}</p>
                    </div>
                    ${subunit.level ? `
                        <div class="info-section" style="margin-top: 12px;">
                            <h4 class="section-heading-detail">Kedudukan Jabatan</h4>
                            <span class="badge badge-vertikal" style="text-transform: capitalize;">${subunit.level.replace('-', ' ')}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="window.KnowledgeCardModal.close()">Tutup</button>
                </div>
            </div>
        `;
        
        this.modalEl.classList.remove('hidden');
    },
    
    renderModal(cat) {
        const u = this.currentUnit;
        const isVertikal = ['kpu', 'kppbc'].includes(cat);
        
        // Define tabs based on category
        const tabListHtml = isVertikal 
            ? `
                <button class="tab-btn active" data-tab="summary">📋 Ringkasan</button>
                <button class="tab-btn" data-tab="fungsi">✓ Fungsi</button>
                <button class="tab-btn" data-tab="struktur">📊 Struktur Seksi</button>
                <button class="tab-btn" data-tab="keterkaitan">🔗 Hubungan Unit</button>
              `
            : `
                <button class="tab-btn active" data-tab="summary">📋 Ringkasan</button>
                <button class="tab-btn" data-tab="fungsi">✓ Fungsi Kerja</button>
              `;
              
        this.modalEl.innerHTML = `
            <div class="modal-card">
                <!-- Modal Header -->
                <div class="modal-header">
                    <div class="modal-title-container">
                        <span class="modal-title">${u.nama}</span>
                        <span class="modal-subtitle">${u.singkatan || ''} | ${this.getCategoryLabel(cat)}</span>
                    </div>
                    <button class="modal-close-btn" onclick="window.KnowledgeCardModal.close()">&times;</button>
                </div>
                
                <!-- Tab Menu Links -->
                <div class="tab-nav">
                    ${tabListHtml}
                </div>
                
                <!-- Modal Tab Contents -->
                <div class="modal-body tab-content">
                    <!-- Tab Summary -->
                    <div class="tab-pane active" id="pane-summary">
                        <h4 class="section-heading-detail" style="margin-top: 0;">Peran / Tugas Utama</h4>
                        <p class="section-body-detail">${u.tugas || 'Melaksanakan pengawasan dan pelayanan pabean serta cukai.'}</p>
                        
                        <div class="info-section grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); margin-top: 16px;">
                            <div>
                                <h5 class="section-heading-detail" style="font-size: 0.725rem; margin-bottom: 2px;">Pimpinan Kantor</h5>
                                <span class="text-body" style="font-size: 0.8rem; font-weight: 600;">👤 ${u.jabatan_pimpinan || 'Kepala Kantor'}</span>
                            </div>
                            <div>
                                <h5 class="section-heading-detail" style="font-size: 0.725rem; margin-bottom: 2px;">Eselonisasi</h5>
                                <span class="badge badge-vertikal" style="text-transform: uppercase; font-size: 0.65rem;">${u.eselon_kepala || 'eselon-3a'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tab Fungsi -->
                    <div class="tab-pane" id="pane-fungsi">
                        <h4 class="section-heading-detail" style="margin-top: 0;">Fungsi Operasional</h4>
                        <ul class="fungsi-checklist-list">
                            ${u.fungsi && u.fungsi.length > 0 
                                ? u.fungsi.map(f => `<li><span class="checklist-bullet">✓</span> ${f}</li>`).join('')
                                : `<li><span class="checklist-bullet">✓</span> Pengawasan lalu lintas barang ekspor/impor</li>
                                   <li><span class="checklist-bullet">✓</span> Pemungutan bea masuk, bea keluar dan cukai</li>`
                            }
                        </ul>
                    </div>
                    
                    <!-- Tab Struktur (KPPBC Only) -->
                    <div class="tab-pane" id="pane-struktur">
                        <h4 class="section-heading-detail" style="margin-top: 0;">Seksi Administrasi Internal (Eselon IV)</h4>
                        <p class="section-body-detail" style="font-size: 0.75rem; margin-bottom: 12px; color: var(--text-muted);">Klik pada seksi di bawah ini untuk melihat detail tusi.</p>
                        <div class="kppbc-seksi-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm);">
                            ${this.renderSeksiList(u, cat)}
                        </div>
                    </div>
                    
                    <!-- Tab Keterkaitan (KPPBC Only) -->
                    <div class="tab-pane" id="pane-keterkaitan">
                        <h4 class="section-heading-detail" style="margin-top: 0;">Hubungan Koordinasi & Pembinaan</h4>
                        <div class="relation-grid" style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                            <div class="relation-item flex items-center justify-between" style="border: 1px solid var(--border); padding: 8px var(--spacing-md); border-radius: var(--radius-md);">
                                <div>
                                    <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted);">PEMBINA REGIONAL</div>
                                    <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-dark);">Kantor Wilayah Terkait</div>
                                </div>
                                <button class="btn btn-secondary" onclick="window.KnowledgeCardModal.close(); window.location.hash='#/peta-sebaran'" style="padding: 4px 10px; font-size: 0.7rem;">📍 Lihat Map</button>
                            </div>
                            <div class="relation-item flex items-center justify-between" style="border: 1px solid var(--border); padding: 8px var(--spacing-md); border-radius: var(--radius-md);">
                                <div>
                                    <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted);">PEMBINA TEKNIS</div>
                                    <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-dark);">Direktorat Teknis & P2</div>
                                </div>
                                <button class="btn btn-secondary" onclick="window.KnowledgeCardModal.close(); window.location.hash='#/explorer'" style="padding: 4px 10px; font-size: 0.7rem;">📊 Lihat Hirarki</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="window.KnowledgeCardModal.close()">Tutup</button>
                    ${this.renderExploreDetailBtn(u, cat)}
                </div>
            </div>
        `;
    },
    
    renderExploreDetailBtn(unit, cat) {
        // Provide direct explore redirect button for Kanwil, KPU and UPT
        if (['kanwil', 'blbc', 'pso'].includes(cat)) {
            let route = `#/kanwil/${unit.id}`;
            if (['blbc', 'pso'].includes(cat)) route = `#/upt/${unit.id}`;
            
            return `
                <button class="btn btn-primary" onclick="window.KnowledgeCardModal.close(); window.location.hash='${route}'">
                    Buka Rincian Lengkap &rarr;
                </button>
            `;
        }
        return '';
    },
    
    renderSeksiList(unit, cat) {
        // Standard structural divisions inside KPPBC offices:
        const isKpu = cat === 'kpu';
        const seksiTemplates = isKpu 
            ? [
                { nama: "Bagian Umum", tugas: "Melaksanakan urusan kepegawaian, keuangan, tata usaha, rumah tangga, kehumasan, dan kepatuhan internal." },
                { nama: "Bidang Pelayanan & Fasilitas Pabean", tugas: "Melaksanakan pelayanan dokumen impor/ekspor, pendaftaran manifest, penetapan tarif, nilai pabean dan fasilitas pabean." },
                { nama: "Bidang Pengawasan & Penindakan", tugas: "Melaksanakan intelijen pabean, patroli wewenang pelabuhan, penindakan penyelundupan barang lartas, penyegelan peti kemas, dan penyidikan." }
              ]
            : [
                { nama: "Subbagian Umum", tugas: "Melaksanakan urusan kepegawaian, keuangan, surat-menyurat kearsipan, rumah tangga dan perlengkapan sarpras kantor." },
                { nama: "Seksi Pelayanan Kepabeanan & Cukai", tugas: "Melaksanakan pelayanan dokumen Pemberitahuan Impor/Ekspor Barang, penetapan tarif bea masuk, administrasi manifest pabean, dan pelayanan pita cukai." },
                { nama: "Seksi Penindakan & Penyidikan (P2)", tugas: "Melaksanakan pengawasan lapangan, intelijen pabean, patroli pencegahan penyelundupan barang ilegal, dan penyidikan perkara pabean/cukai." },
                { nama: "Seksi Kepatuhan Internal", tugas: "Melaksanakan pemantauan kinerja pegawai, penegakan disiplin kode etik internal, dan manajemen kualitas layanan." }
              ];
              
        return seksiTemplates.map(s => `
            <div class="struct-card" style="padding: 8px var(--spacing-md); height: auto;" onclick="window.KnowledgeCardModal.showCustomSubunit(${JSON.stringify(s).replace(/"/g, '&quot;')}, '${unit.singkatan}')">
                <div class="struct-card-title" style="font-size: 0.775rem; margin-bottom: 2px;">${s.nama}</div>
                <div style="font-size: 0.65rem; color: var(--text-muted); line-height: 1.35;">${s.tugas.substring(0, 50)}...</div>
            </div>
        `).join('');
    },
    
    getCategoryLabel(cat) {
        const labels = {
            'kanpus': 'Kantor Pusat',
            'kanwil': 'Kantor Wilayah',
            'kpu': 'Kantor Pelayanan Utama (KPU)',
            'kppbc': 'KPPBC Pelayanan Cukai',
            'blbc': 'Balai Laboratorium (UPT)',
            'pso': 'Pangkalan Sarana Operasi (UPT)'
        };
        return labels[cat] || 'Unit Kerja';
    },
    
    close() {
        if (this.modalEl) {
            this.modalEl.classList.add('hidden');
        }
    }
};

// Initialize Modal
document.addEventListener('DOMContentLoaded', () => {
    window.KnowledgeCardModal.init();
});
