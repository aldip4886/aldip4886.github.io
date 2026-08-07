/**
 * Eselon III Unit Profile View Controller
 * Aligned with PRD v2.0 & User Request:
 * 1. Prominently display Jabatan Pimpinan (👑 Kepala Unit Eselon III / Administrator)
 * 2. High-contrast typography & gold sidebar meta-labels
 */

window.DetailEselon3View = {
    container: null,
    
    async mount(params) {
        this.container = document.getElementById('detail-eselon3-screen');
        if (!this.container) return;
        
        const id = params.id;
        const parentId = params.parentId;
        document.getElementById('header-view-title').textContent = "Profil Unit Eselon III DJBC";
        
        // Find Eselon III unit and its parent
        let result = null;
        if (parentId) {
            result = await window.Data.getUnitByParentAndChild(parentId, id);
        } else {
            result = await window.Data.getUnitWithParent(id);
        }
        
        if (!result) {
            this.container.innerHTML = `
                <div class="error-msg flex flex-col items-center justify-center h-full" style="padding: 40px; text-align: center;">
                    <span style="font-size: 3rem; margin-bottom: 15px;">🔍</span>
                    <h3 style="color: #ef4444;">Unit Eselon III tidak ditemukan</h3>
                    <p style="color: rgba(255,255,255,0.7); margin-top: 5px;">ID unit "${id}" tidak terdaftar dalam basis data.</p>
                    <button class="btn btn-primary" onclick="window.location.hash='#/explorer'" style="margin-top:20px;">
                        Kembali ke Explorer
                    </button>
                </div>
            `;
            return;
        }
        
        const unit = result.data;
        const parent = result.parent;
        const source = result.source;
        
        // Track visit progress
        if (window.ProgressTracker) {
            window.ProgressTracker.trackVisit(unit.id || id);
        }
        
        this.render(unit, parent, source);
        this.setupDidYouKnow(unit.id || id);
    },
    
    render(unit, parent, source) {
        // Build back button destination based on parent unit
        let backRoute = '#/explorer';
        if (source === 'kantor-pusat') {
            backRoute = `#/kantor-pusat/${parent.id}`;
        } else if (source === 'instansi-vertikal') {
            if (parent.id.startsWith('kanwil-')) {
                backRoute = `#/kanwil/${parent.id}`;
            } else {
                backRoute = `#/explorer`;
            }
        }
        
        // Determine leadership title
        const pimpinanTitle = unit.jabatan_pimpinan || `Kepala ${unit.nama}`;
        
        // Format fungsi list
        let fungsiHtml = '';
        if (unit.fungsi) {
            if (Array.isArray(unit.fungsi)) {
                fungsiHtml = `
                    <ul class="fungsi-checklist-premium" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
                        ${unit.fungsi.map(f => `<li style="color: #FFFFFF; font-size: 0.85rem; line-height: 1.5; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);"><span style="color: #10B981; font-weight: 900; margin-right: 8px;">✓</span> ${f}</li>`).join('')}
                    </ul>
                `;
            } else {
                fungsiHtml = `<p style="font-size: 0.875rem; line-height: 1.6; color: #FFFFFF; margin-top: 10px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px;">${unit.fungsi}</p>`;
            }
        } else {
            fungsiHtml = '<p style="color: rgba(255,255,255,0.6); font-size: 0.85rem; font-style: italic; margin-top: 10px;">Informasi fungsi terperinci dapat dirujuk di PMK Organisasi Bea dan Cukai.</p>';
        }
        
        this.container.innerHTML = `
            <div class="detail-page-layout flex h-full" style="padding: 24px; max-width: 1350px; margin: 0 auto;">
                <!-- Left Sidebar Details -->
                <div class="detail-sidebar-premium" style="width: 380px; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: space-between;">
                    <div class="sidebar-top-content">
                        <!-- Navigation breadcrumb -->
                        <div class="breadcrumb flex items-center" style="margin-bottom: 16px; font-size: 0.85rem;">
                            <span class="breadcrumb-item" onclick="window.location.hash='#/explorer'" style="color: var(--djbc-gold); cursor: pointer; font-weight: 600;">Explorer</span>
                            <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.4);">&rsaquo;</span>
                            <span class="breadcrumb-item" onclick="window.location.hash='${backRoute}'" style="color: rgba(255,255,255,0.8); cursor: pointer;">${parent.singkatan || parent.nama}</span>
                            <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.4);">&rsaquo;</span>
                            <span class="breadcrumb-item active" style="color: #FFFFFF; font-weight: 700;">Profil</span>
                        </div>
                        
                        <span class="badge badge-vertikal" style="margin-top: 8px; display: inline-block; background: rgba(245, 166, 35, 0.2); color: var(--djbc-gold); border: 1px solid var(--djbc-gold); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">Unit Kerja Eselon III</span>
                        
                        <h2 class="profile-name" style="color: #FFFFFF; font-size: 1.35rem; font-weight: 800; margin: 12px 0 20px 0; line-height: 1.35; border-bottom: 2px solid var(--djbc-gold); padding-bottom: 12px;">${unit.nama}</h2>
                        
                        <div class="meta-info-list" style="display: flex; flex-direction: column; gap: 16px;">
                            <!-- Prominent Jabatan Pimpinan -->
                            <div class="meta-item flex items-center" style="background: rgba(245, 166, 35, 0.1); border: 1px solid var(--djbc-gold); padding: 12px 14px; border-radius: 10px;">
                                <span class="meta-icon" style="font-size: 1.5rem; margin-right: 12px;">👑</span>
                                <div class="meta-details">
                                    <div class="meta-label" style="color: var(--djbc-gold); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Jabatan Pimpinan</div>
                                    <div class="meta-val" style="color: #FFFFFF; font-size: 0.925rem; font-weight: 800; margin-top: 2px;">${pimpinanTitle}</div>
                                </div>
                            </div>
                            
                            <div class="meta-item flex items-center">
                                <span class="meta-icon" style="font-size: 1.2rem; margin-right: 12px;">🏢</span>
                                <div class="meta-details">
                                    <div class="meta-label" style="color: var(--djbc-gold); font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Unit Induk (Atasan)</div>
                                    <div class="meta-val" style="color: #FFFFFF; font-size: 0.85rem; font-weight: 600;">${parent.nama}</div>
                                </div>
                            </div>
                            
                            <div class="meta-item flex items-center">
                                <span class="meta-icon" style="font-size: 1.2rem; margin-right: 12px;">⚖️</span>
                                <div class="meta-details">
                                    <div class="meta-label" style="color: var(--djbc-gold); font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Dasar Hukum</div>
                                    <div class="meta-val" style="color: #FFFFFF; font-size: 0.85rem; font-weight: 600;">${unit.dasar_hukum || parent.dasar_hukum || 'PMK Organisasi Kemenkeu'}</div>
                                </div>
                            </div>
                            
                            <div class="meta-item flex items-center">
                                <span class="meta-icon" style="font-size: 1.2rem; margin-right: 12px;">💼</span>
                                <div class="meta-details">
                                    <div class="meta-label" style="color: var(--djbc-gold); font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">Tingkat Jabatan</div>
                                    <div class="meta-val" style="color: #FFFFFF; font-size: 0.85rem; font-weight: 600;">Eselon III / Administrator</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sidebar-bottom-actions" style="margin-top: 24px;">
                        <button class="btn btn-secondary w-full" onclick="window.location.hash='${backRoute}'" style="background: #071527; border: 1px solid var(--djbc-gold); color: #FFFFFF; padding: 10px; border-radius: 8px; font-weight: 700; cursor: pointer; width: 100%;">
                            &larr; Kembali ke ${parent.singkatan || 'Atasan'}
                        </button>
                    </div>
                </div>
                
                <!-- Right Main Scrollable View -->
                <div class="detail-main-premium flex-1" style="margin-left: 24px;">
                    <div class="main-card-wrapper animate-fade-up" style="display: flex; flex-direction: column; gap: 20px;">
                        <!-- Card 1: Tugas Pokok -->
                        <div class="premium-info-card" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
                            <h4 class="premium-card-title" style="color: var(--djbc-gold); font-size: 1rem; font-weight: 800; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">Tugas Pokok</h4>
                            <div class="mandate-text-box" style="background: #071527; padding: 16px; border-radius: 10px; border-left: 4px solid var(--djbc-gold); color: #FFFFFF; font-size: 0.9rem; line-height: 1.6; font-weight: 500;">
                                ${unit.tugas || 'Melaksanakan perumusan dan koordinasi pelaksanaan kebijakan pelayanan, pengawasan pabean dan cukai sesuai wewenang tugas.'}
                            </div>
                        </div>
                        
                        <!-- Card 2: Uraian Fungsi Kegiatan -->
                        <div class="premium-info-card" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
                            <h4 class="premium-card-title" style="color: var(--djbc-gold); font-size: 1rem; font-weight: 800; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">Uraian Fungsi Kegiatan</h4>
                            ${fungsiHtml}
                        </div>
                        
                        <!-- Card 3: Koordinasi Wewenang -->
                        <div class="premium-info-card" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
                            <h4 class="premium-card-title" style="color: var(--djbc-gold); font-size: 1rem; font-weight: 800; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">Koordinasi Wewenang & Tanggung Jawab</h4>
                            <p class="section-body" style="font-size: 0.875rem; line-height: 1.65; color: #FFFFFF; background: #071527; padding: 16px; border-radius: 10px; margin-top: 8px;">
                                Unit kerja ini dipimpin oleh <strong>${pimpinanTitle}</strong> (pejabat setingkat Administrator / Eselon III) dan bertanggung jawab langsung atas pencapaian Indikator Kinerja Utama (IKU) di bawah arahan <strong>${parent.jabatan_pimpinan || parent.nama}</strong>. Unit ini berkoordinasi secara horizontal dengan seluruh unit kerja eselon III di lingkungan internal atasan yang bersangkutan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    async setupDidYouKnow(unitId) {
        const dykBar = document.getElementById('did-you-know-bar');
        const dykText = document.getElementById('dyk-text-content');
        if (!dykBar || !dykText) return;
        
        try {
            const dykData = await window.Data.load('did-you-know');
            const fact = dykData[unitId] || dykData['setditjen'];
            dykText.textContent = fact;
            dykBar.classList.remove('hidden');
        } catch(e) {
            dykBar.classList.add('hidden');
        }
    }
};

// Register View
if (window.App) {
    window.App.registerView('detail-eselon3', window.DetailEselon3View);
}
