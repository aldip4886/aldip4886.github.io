/**
 * Kantor Wilayah 5-Tab Detail View Controller
 * Aligned with PRD v2.0 (Tab navigation, child KPPBC listing, contacts)
 */

window.DetailKanwilView = {
    container: null,
    activeTab: 'ringkasan',
    unitData: null,
    
    async mount(params) {
        const kanwilId = params.id;
        this.container = document.getElementById('detail-kanwil-screen');
        if (!this.container) return;
        
        // Fetch unit details from Data layer
        try {
            this.unitData = await window.Data.getVertikalUnit(kanwilId);
            if (!this.unitData) {
                this.container.innerHTML = `<div class="error-msg">Kantor Wilayah tidak ditemukan.</div>`;
                return;
            }
        } catch(e) {
            this.container.innerHTML = `<div class="error-msg">Gagal memuat data detail Kanwil.</div>`;
            return;
        }
        
        // Update header title
        document.getElementById('header-view-title').textContent = `Detail Kantor Wilayah: ${this.unitData.nama}`;
        
        // Reset active tab to ringkasan
        this.activeTab = 'ringkasan';
        
        this.renderLayout();
        this.setupTabListeners();
        
        // Track visit progress
        if (window.ProgressTracker) {
            window.ProgressTracker.trackVisit(kanwilId);
        }
        
        // Load Did You Know bar
        this.setupDidYouKnow('kanwil');
    },
    
    renderLayout() {
        const kw = this.unitData;
        const isKhusus = kw.id.includes('khusus') || kw.nama.includes('Khusus');
        
        this.container.innerHTML = `
            <div class="kanwil-detail-layout">
                <!-- Breadcrumbs & Back Button -->
                <div class="detail-header-nav">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/peta-sebaran'" style="padding: var(--spacing-sm) var(--spacing-md); font-size: 0.8rem;">
                        &larr; Kembali ke Peta Sebaran
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0;">
                        <a href="#/peta-sebaran" class="breadcrumb-item">Peta Sebaran</a>
                        <span class="breadcrumb-separator">&gt;</span>
                        <span class="breadcrumb-item">Kantor Wilayah</span>
                        <span class="breadcrumb-separator">&gt;</span>
                        <span class="breadcrumb-item active">${kw.singkatan}</span>
                    </div>
                </div>
                
                <div class="kanwil-split flex w-full">
                    <!-- Left Sidebar Menu (5 Tabs) -->
                    <aside class="kanwil-menu-panel">
                        <div class="kanwil-profile flex flex-col items-center">
                            <!-- Visual Badge representing Kanwil Tipe -->
                            <div class="kanwil-badge-plate flex items-center justify-center">
                                🏢
                            </div>
                            <div class="kanwil-profile-name">${kw.singkatan}</div>
                            <span class="badge ${isKhusus ? 'badge-kpu' : 'badge-kanwil'}">${isKhusus ? 'Kanwil Khusus' : 'Kanwil Reguler'}</span>
                        </div>
                        
                        <div class="kanwil-tab-list flex flex-col">
                            <button class="kanwil-tab-btn active" data-tab="ringkasan">📋 Ringkasan</button>
                            <button class="kanwil-tab-btn" data-tab="struktur">📊 Struktur Organisasi</button>
                            <button class="kanwil-tab-btn" data-tab="wilayah">🗺️ Wilayah Kerja</button>
                            <button class="kanwil-tab-btn" data-tab="kppbc">🏢 KPPBC di Bawahnya</button>
                            <button class="kanwil-tab-btn" data-tab="info">ℹ️ Informasi Lain</button>
                        </div>
                    </aside>
                    
                    <!-- Right Content Area -->
                    <main class="kanwil-content-panel flex-1">
                        <!-- Tab Ringkasan -->
                        <div class="kanwil-tab-pane active" id="pane-ringkasan">
                            <h3 class="pane-heading">Ringkasan Unit Kerja</h3>
                            <div class="ringkasan-grid">
                                <div class="ringkasan-text">
                                    <div class="info-section">
                                        <h4 class="section-label">Tugas Pokok</h4>
                                        <p class="section-body">${kw.tugas}</p>
                                    </div>
                                    <div class="info-section">
                                        <h4 class="section-label">Pimpinan Utama</h4>
                                        <p class="section-body flex items-center gap-xs">
                                            👤 <strong>${kw.jabatan_pimpinan}</strong>
                                        </p>
                                    </div>
                                    <div class="info-section">
                                        <h4 class="section-label">Kontak Layanan</h4>
                                        <p class="section-body" style="font-size: 0.825rem; line-height: 1.5;">
                                            📞 Telepon: (021) 1500225 (Bravo)<br>
                                            ✉️ Email: kanwil.${kw.id}@customs.go.id<br>
                                            📍 Alamat: Kompleks Gedung Bea Cukai Prov. ${kw.nama.split(' ').pop()}
                                        </p>
                                    </div>
                                </div>
                                <div class="ringkasan-visual flex flex-col items-center">
                                    <div class="building-card flex flex-col items-center">
                                        <!-- Gedung Icon Placeholder -->
                                        <div class="building-photo-placeholder">
                                            🏛️
                                        </div>
                                        <span class="photo-caption">Kantor Wilayah ${kw.singkatan}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tab Struktur -->
                        <div class="kanwil-tab-pane" id="pane-struktur">
                            <h3 class="pane-heading">Struktur Internal Kantor Wilayah</h3>
                            <p class="pane-subtitle">Susunan Bidang dan Bagian (Eselon III) berdasarkan dasar hukum PMK 188/2016 jo PMK 183/2020.</p>
                            <div class="mini-struct-grid">
                                ${(kw.sub_units || []).map(sub => `
                                    <div class="struct-card flex flex-col justify-between" onclick="window.location.hash='#/eselon-3/${sub.id}'">
                                        <div>
                                            <div class="struct-card-title">${sub.nama}</div>
                                            <div class="struct-card-desc">${sub.tugas.substring(0, 100)}...</div>
                                        </div>
                                        <span class="struct-card-link">Detail &rarr;</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Tab Wilayah -->
                        <div class="kanwil-tab-pane" id="pane-wilayah">
                            <h3 class="pane-heading">Wilayah Kerja Pengawasan</h3>
                            <div class="wilayah-card">
                                <div class="wilayah-icon">🗺️</div>
                                <div class="wilayah-info">
                                    <h4 class="wilayah-title">Provinsi Cakupan</h4>
                                    <p class="wilayah-desc">Mengawasi dan melayani seluruh wilayah administrasi pabean di provinsi/daerah induk dan sekitarnya.</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tab KPPBC -->
                        <div class="kanwil-tab-pane" id="pane-kppbc">
                            <h3 class="pane-heading">Daftar KPPBC Di Bawah Wewenang</h3>
                            <div class="kppbc-counter-bar">
                                Total KPPBC: <strong>${(kw.children || []).length} Kantor Pelayanan</strong>
                            </div>
                            <div class="kppbc-list-container">
                                ${(kw.children || []).map(child => `
                                    <div class="kppbc-list-item flex items-center justify-between" onclick="window.DetailKanwilView.navigateToKPPBC('${child.id}')">
                                        <div class="flex items-center gap-md">
                                            <span class="kppbc-item-icon">🏢</span>
                                            <div class="kppbc-item-info">
                                                <span class="kppbc-item-name">${child.nama}</span>
                                                <span class="badge ${child.eselon_kepala === 'eselon-3b' ? 'badge-kppbc' : 'badge-kpu'}">${child.eselon_kepala === 'eselon-3b' ? 'Eselon III.b (TMP C)' : 'Eselon III.a'}</span>
                                            </div>
                                        </div>
                                        <span class="kppbc-item-arrow">&rsaquo;</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Tab Info -->
                        <div class="kanwil-tab-pane" id="pane-info">
                            <h3 class="pane-heading">Informasi Lainnya</h3>
                            <div class="info-section">
                                <h4 class="section-label">Kelompok Jabatan Fungsional</h4>
                                <p class="section-body">Di lingkungan Kantor Wilayah terdapat Pejabat Fungsional Pemeriksa Bea dan Cukai (PF PBC) yang melakukan fungsi teknis khusus di bidang audit, klasifikasi tarif, nilai pabean, dan penindakan.</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;
    },
    
    setupTabListeners() {
        const tabs = this.container.querySelectorAll('.kanwil-tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                if (window.LandingView && window.LandingView.playBeep) {
                    window.LandingView.playBeep('click');
                }
                
                // Remove active from all tabs & panes
                tabs.forEach(t => t.classList.remove('active'));
                this.container.querySelectorAll('.kanwil-tab-pane').forEach(p => p.classList.remove('active'));
                
                // Add active to current
                tab.classList.add('active');
                const targetPane = this.container.querySelector(`#pane-${tab.dataset.tab}`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
                
                this.activeTab = tab.dataset.tab;
            });
        });
    },
    
    navigateToKPPBC(kppbcId) {
        // Navigate to dedicated KPPBC profile page
        window.location.hash = `#/kppbc/${kppbcId}`;
    },
    
    async setupDidYouKnow(unitId) {
        const dykBar = document.getElementById('did-you-know-bar');
        const dykText = document.getElementById('dyk-text-content');
        if (!dykBar || !dykText) return;
        
        try {
            const dykData = await window.Data.load('did-you-know');
            const fact = dykData[unitId] || dykData['kanwil'];
            dykText.textContent = fact;
            dykBar.classList.remove('hidden');
        } catch(e) {
            dykBar.classList.add('hidden');
        }
    }
};

// Register View
if (window.App) {
    window.App.registerView('detail-kanwil', window.DetailKanwilView);
}
