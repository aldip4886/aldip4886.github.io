/**
 * Help and Visual Guide Controller
 * Aligned with PRD v2.0 (6 visual guide cards for application onboarding)
 */

window.HelpView = {
    container: null,
    
    mount(params) {
        document.getElementById('header-view-title').textContent = "Panduan Penggunaan Media Pembelajaran";
        this.container = document.getElementById('help-screen');
        if (!this.container) return;
        
        this.renderLayout();
        
        // Load Did You Know fact
        this.setupDidYouKnow('setditjen');
    },
    
    renderLayout() {
        const guides = [
            { icon: "📊", title: "Peta Hirarki", desc: "Bagan terpusat terbagi menjadi 3 kolom: Kantor Pusat, Instansi Vertikal, dan UPT. Gunakan mouse drag untuk menggeser, scroll wheel untuk zoom in/out, atau toolbar slider di bawah. Klik kotak unit untuk melihat detail tugas dan wewenangnya." },
            { icon: "📍", title: "Peta Sebaran", desc: "Klik menu ini untuk melihat sebaran letak geografis 20 Kantor Wilayah, 3 KPU, 3 BLBC, dan 6 PSO di seluruh wilayah Indonesia. Gunakan filter Pulau atau Kategori Unit kerja untuk memfokuskan pencarian letak kantor pelayanan." },
            { icon: "🔄", title: "Peta Alur Kerja", desc: "Pelajari prosedur kerja nyata Bea Cukai: Impor, Ekspor, Cukai, dan Penindakan secara step-by-step. Gunakan panel navigasi slide di bawah untuk berpindah tahapan dan ketahui peranan kolaborasi masing-masing unit kerja." },
            { icon: "🌐", title: "Peta Keterkaitan", desc: "Lihat visualisasi jaringan hubungan wewenang antara Kantor Pusat (pembina teknis/kebijakan), Kantor Wilayah (pembina administratif regional), dan UPT (pangkalan patroli/laboratorium barang) dalam menjalankan tugas sehari-hari." },
            { icon: "🎯", title: "Tantangan & Evaluasi", desc: "Uji pemahaman Anda melalui kuis klik node pada bagan organisasi langsung atau selesaikan kuis kasus dilema operasional di lapangan untuk mengumpulkan poin pemahaman XP." },
            { icon: "🏆", title: "Laporan Progres Belajar", desc: "Pantau persentase ketuntasan belajar Anda berdasarkan jumlah unit yang dikunjungi serta kuis yang diselesaikan. Buka 6 lencana penghargaan (badges) bergengsi untuk menunjukkan kompetensi Anda." }
        ];
        
        this.container.innerHTML = `
            <div class="help-page-layout flex flex-col h-full">
                <div class="page-intro-banner card" style="background-color: var(--bg-white); border-bottom: 2px solid var(--djbc-gold); margin-bottom: var(--spacing-md);">
                    <h3 class="intro-title">Panduan Pengguna</h3>
                    <p class="intro-desc">Selamat datang di Interactive Organization Explorer DJBC! Media interaktif ini dirancang untuk mempermudah Anda memahami struktur organisasi, tugas, fungsi, serta korelasi antar unit Bea Cukai.</p>
                </div>
                
                <div class="guides-grid-help flex-1" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-md); overflow-y: auto; padding-bottom: var(--spacing-md);">
                    ${guides.map(g => `
                        <div class="guide-card card flex flex-col items-center text-center">
                            <div class="guide-icon-avatar flex items-center justify-center">
                                ${g.icon}
                            </div>
                            <h4 class="guide-card-title">${g.title}</h4>
                            <p class="guide-card-desc">${g.desc}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="help-footer flex justify-center items-center" style="padding-top: var(--spacing-sm); flex-shrink: 0;">
                    <button class="btn btn-primary" onclick="window.location.hash='#/explorer'" style="padding: 6px var(--spacing-xl);">
                        Mulai Belajar Sekarang &rsaquo;
                    </button>
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
    window.App.registerView('help', window.HelpView);
}
