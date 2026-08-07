/**
 * Alur Kerja (Workflow List) View Controller
 * Aligned with PRD v2.0 (Workflow choices: Impor, Ekspor, Cukai, Penindakan)
 */

window.AlurKerjaView = {
    container: null,
    
    mount(params) {
        document.getElementById('header-view-title').textContent = "Peta Alur Kerja Layanan & Pengawasan DJBC";
        this.container = document.getElementById('alur-kerja-screen');
        if (!this.container) return;
        
        this.renderLayout();
        
        // Load Did You Know bar
        this.setupDidYouKnow('setditjen');
    },
    
    renderLayout() {
        this.container.innerHTML = `
            <div class="alur-kerja-layout flex flex-col h-full">
                <div class="page-intro-banner card" style="background-color: var(--bg-white); border-bottom: 2px solid var(--djbc-gold); margin-bottom: var(--spacing-md);">
                    <h3 class="intro-title">Pilih Alur Kerja Kerja</h3>
                    <p class="intro-desc">Pelajari langkah-langkah kerja operasional DJBC di lapangan, serta ketahui unit kerja mana saja yang bertanggung jawab dan saling berkolaborasi dalam setiap tahapan.</p>
                </div>
                
                <div class="workflow-choices-grid">
                    <!-- Card Impor -->
                    <div class="workflow-card card flex flex-col justify-between" onclick="window.location.hash='#/alur-proses/impor'">
                        <div>
                            <div class="workflow-header-row flex items-center justify-between">
                                <span class="workflow-icon-plate" style="background-color: rgba(14, 116, 144, 0.1); color: var(--color-kanpus);">🚢</span>
                                <span class="badge badge-kanpus">7 Tahapan</span>
                            </div>
                            <h4 class="workflow-title">Pelayanan & Pengawasan Impor</h4>
                            <p class="workflow-desc">Alur proses penyelesaian barang impor mulai dari kedatangan manifes kapal, pengajuan PIB, jalur pelayanan (Hijau/Kuning/Merah), hingga post-clearance audit.</p>
                        </div>
                        <div class="workflow-meta-row flex items-center justify-between">
                            <span class="involved-units-lbl">Unit terlibat: KPPBC, Kanwil, Laboratorium, Audit</span>
                            <span class="workflow-arrow-link">Pelajari &rarr;</span>
                        </div>
                    </div>
                    
                    <!-- Card Ekspor -->
                    <div class="workflow-card card flex flex-col justify-between" onclick="window.location.hash='#/alur-proses/ekspor'">
                        <div>
                            <div class="workflow-header-row flex items-center justify-between">
                                <span class="workflow-icon-plate" style="background-color: rgba(5, 150, 105, 0.1); color: var(--color-vertikal);">✈️</span>
                                <span class="badge badge-vertikal">4 Tahapan</span>
                            </div>
                            <h4 class="workflow-title">Pelayanan & Pengawasan Ekspor</h4>
                            <p class="workflow-desc">Proses pelayanan dokumen eksportir (PEB), pencocokan fisik barang ekspor, pemuatan kontainer ke kapal (NPE), dan rekonsiliasi data manifest luar negeri.</p>
                        </div>
                        <div class="workflow-meta-row flex items-center justify-between">
                            <span class="involved-units-lbl">Unit terlibat: KPPBC, Dit. Teknis, Bea Cukai Pintu Gerbang</span>
                            <span class="workflow-arrow-link">Pelajari &rarr;</span>
                        </div>
                    </div>
                    
                    <!-- Card Cukai -->
                    <div class="workflow-card card flex flex-col justify-between" onclick="window.location.hash='#/alur-proses/cukai'">
                        <div>
                            <div class="workflow-header-row flex items-center justify-between">
                                <span class="workflow-icon-plate" style="background-color: rgba(245, 158, 11, 0.1); color: var(--warning);">🏷️</span>
                                <span class="badge badge-warning">4 Tahapan</span>
                            </div>
                            <h4 class="workflow-title">Pencatatan & Pelunasan Cukai</h4>
                            <p class="workflow-desc">Alur pengawasan pabrik barang kena cukai (BKC), pendaftaran NPPBKC, pemesanan keping segel pita cukai (CK-1), hingga pelekatan segel kemasan rokok/MMEA.</p>
                        </div>
                        <div class="workflow-meta-row flex items-center justify-between">
                            <span class="involved-units-lbl">Unit terlibat: KPPBC, Dit. Cukai, Produsen Hasil Tembakau</span>
                            <span class="workflow-arrow-link">Pelajari &rarr;</span>
                        </div>
                    </div>
                    
                    <!-- Card Penindakan -->
                    <div class="workflow-card card flex flex-col justify-between" onclick="window.location.hash='#/alur-proses/penindakan'">
                        <div>
                            <div class="workflow-header-row flex items-center justify-between">
                                <span class="workflow-icon-plate" style="background-color: rgba(124, 58, 237, 0.1); color: var(--color-upt);">⚓</span>
                                <span class="badge badge-upt">5 Tahapan</span>
                            </div>
                            <h4 class="workflow-title">Pengawasan & Penindakan Lapangan</h4>
                            <p class="workflow-desc">Prosedur intelijen pabean (NHI), mobilisasi patroli laut (PSO), pengejaran dan pemberhentian kapal penyelundup, penyegelan barang bukti, hingga penyidikan PPNS.</p>
                        </div>
                        <div class="workflow-meta-row flex items-center justify-between">
                            <span class="involved-units-lbl">Unit terlibat: PSO Patroli, KPPBC Seksi P2, Dit. P2, PPNS</span>
                            <span class="workflow-arrow-link">Pelajari &rarr;</span>
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
    window.App.registerView('alur-kerja', window.AlurKerjaView);
}
