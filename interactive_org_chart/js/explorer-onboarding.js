/**
 * Onboarding Banners, Slides & Cards Engine for Explorer Views
 * Supports 5 views: explorer, peta-sebaran, alur-kerja, alur-proses, keterkaitan
 */

window.ExplorerOnboarding = {
    activeView: null,
    currentSlide: 0,
    isModalActive: false,
    backdropEl: null,
    modalEl: null,
    autoTriggerDelay: 400,

    // Onboarding Data (Banners & Multi-Slide Cards)
    content: {
        'explorer': {
            bannerTitle: 'Peta Hirarki Organisasi DJBC 📊',
            bannerDesc: 'Jelajahi bagan hierarki lengkap dari Kantor Pusat (Eselon I & II), Instansi Vertikal, hingga UPT.',
            slides: [
                {
                    icon: '📊',
                    title: 'Struktur Hirarki Organisasi DJBC',
                    subtitle: 'Pahami kedudukan dan peran strategis setiap tingkatan unit kerja.',
                    cards: [
                        { icon: '🏢', title: 'Kantor Pusat (Eselon I & II)', desc: 'Sekditjen, 13 Direktorat, & 3 Tenaga Pengkaji (Node Teal & Navy).' },
                        { icon: '🏛️', title: 'Instansi Vertikal', desc: '20 Kantor Wilayah, 3 KPU BC, & 104 KPPBC di daerah (Node Hijau).' },
                        { icon: '🔬', title: 'Unit Pelaksana Teknis', desc: '3 Balai Laboratorium (BLBC) & 6 PSO Bea Cukai (Node Ungu).' }
                    ]
                },
                {
                    icon: '🖱️',
                    title: 'Navigasi Canvas & Knowledge Card',
                    subtitle: 'Kemudahan eksplorasi bagan visual interaktif.',
                    cards: [
                        { icon: '🔍', title: 'Zoom In / Out', desc: 'Gunakan roda scroll mouse untuk memperbesar atau memperkecil bagan.' },
                        { icon: '✋', title: 'Drag & Pan Canvas', desc: 'Klik dan tahan mouse pada area canvas untuk menggeser tampilan.' },
                        { icon: '📄', title: 'Buka Knowledge Card', desc: 'Klik pada kotak unit mana saja untuk melihat tugas, fungsi, & regulasi.' }
                    ]
                }
            ]
        },

        'peta-sebaran': {
            bannerTitle: 'Peta Sebaran Instansi Vertikal & UPT 🗺️',
            bannerDesc: 'Visualisasi lokasi dan jaringan kantor Bea Cukai dari Sabang sampai Merauke.',
            slides: [
                {
                    icon: '🗺️',
                    title: 'Sebaran Geografis Kantor Bea Cukai',
                    subtitle: 'Jaringan pelayanan dan pengawasan di seluruh wilayah Nusantara.',
                    cards: [
                        { icon: '📍', title: 'Marker Pin Lokasi', desc: 'Pin berkilau mewakili kantor per wilayah provinsi & pulau.' },
                        { icon: '🔍', title: 'Filter Pulau & Tipe', desc: 'Saring tampilan berdasarkan pulau (Sumatera, Jawa, dll) atau tipe kantor.' },
                        { icon: '📈', title: 'Statistik Lokasi', desc: 'Panel statistik menampilkan jumlah total kantor terdaftar.' }
                    ]
                },
                {
                    icon: '📌',
                    title: 'Tipologi Marker Kantor',
                    subtitle: 'Membedakan jenis kantor berdasarkan kode marker visual.',
                    cards: [
                        { icon: '🟢 K', title: 'Kantor Wilayah (Kanwil)', desc: '20 Kanwil (18 Reguler + 2 Khusus Kepri & Papua).' },
                        { icon: '🔵 P', title: 'Kantor Pelayanan Utama (KPU)', desc: '3 KPU BC (Tanjung Priok, Batam, & Soekarno-Hatta).' },
                        { icon: '🟣 B & S', title: 'BLBC & PSO BC', desc: '3 Balai Laboratorium (B) & 6 Pangkalan Sarana Operasi Patroli Laut (S).' }
                    ]
                }
            ]
        },

        'alur-kerja': {
            bannerTitle: 'Alur Kerja & Rantai Proses Strategis 🔄',
            bannerDesc: 'Pelajari 5 tahapan kerja dari perumusan kebijakan hingga pengawasan internal.',
            slides: [
                {
                    icon: '🔄',
                    title: '5 Tahapan Rantai Kerja Strategis',
                    subtitle: 'Hubungan korelasi fungsi antar unit dalam pelaksanaan tugas organisasi.',
                    cards: [
                        { icon: '1️⃣', title: 'Perumusan Kebijakan', desc: 'Dirumuskan oleh Direktorat Teknis di Kantor Pusat DJBC.' },
                        { icon: '2️⃣', title: 'Pembinaan & Koordinasi', desc: 'Dilaksanakan oleh Sekretariat Ditjen & Kantor Wilayah.' },
                        { icon: '3️⃣', title: 'Pelayanan & Pengawasan', desc: 'Dijalankan oleh KPU, KPPBC, BLBC, & PSO di lapangan.' }
                    ]
                },
                {
                    icon: '📑',
                    title: 'Keterlibatan Unit Kerja',
                    subtitle: 'Menyorot unit penanggung jawab utama pada setiap tahap.',
                    cards: [
                        { icon: '👥', title: 'Unit Chips', desc: 'Badge warna menunjukkan unit mana saja yang memegang peranan.' },
                        { icon: '🎯', title: 'Pilih Sub-Proses', desc: 'Gunakan dropdown untuk memilih alur Impor, Ekspor, Cukai, atau P2.' },
                        { icon: '📊', title: 'Dukungan & Evaluasi', desc: 'Tahap 4 & 5 mencakup dukungan teknis UPT & pengawasan audit.' }
                    ]
                }
            ]
        },

        'alur-proses': {
            bannerTitle: 'Alur Proses Operasional Step-by-Step 🛣️',
            bannerDesc: 'Pelajari 7 langkah runtut prosedur pelayanan dan pengawasan di lapangan.',
            slides: [
                {
                    icon: '🛣️',
                    title: '7 Step Operasional Lapangan',
                    subtitle: 'Prosedur rinci pelaksanaan tugas kepabeanan dan cukai.',
                    cards: [
                        { icon: '🔢', title: '7 Indicator Steps', desc: 'Lingkaran indikator progres dari tahap 1 hingga tahap 7.' },
                        { icon: '📝', title: 'Deskripsi Pelaksanaan', desc: 'Penjelasan teknis operasional yang dilakukan pada step aktif.' },
                        { icon: '📑', title: 'Output Dokumen', desc: 'Daftar dokumen fisik atau sistem elektronik yang dihasilkan.' }
                    ]
                },
                {
                    icon: '🚚',
                    title: 'Kolaborasi Unit Pelaksana',
                    subtitle: 'Kerja sama antar unit pabean dan UPT teknis.',
                    cards: [
                        { icon: '🛃', title: 'KPPBC & KPU', desc: 'Pelaksana utama pelayanan dokumen & pemeriksaan fisik barang.' },
                        { icon: '🧪', title: 'BLBC', desc: 'Pengujian laboratorium untuk identifikasi barang impor/ekspor.' },
                        { icon: '🛥️', title: 'PSO Bea Cukai', desc: 'Dukungan armada kapal patroli laut & penindakan.' }
                    ]
                }
            ]
        },

        'keterkaitan': {
            bannerTitle: 'Peta Keterkaitan Antar Unit Kerja 🌐',
            bannerDesc: 'Visualisasi jaringan hubungan koordinasi, data, regulasi, dan pengawasan.',
            slides: [
                {
                    icon: '🌐',
                    title: 'Network Graph Keterkaitan Organisasi',
                    subtitle: 'Petakan bagaimana satu unit berhubungan dengan unit lainnya.',
                    cards: [
                        { icon: '🎯', title: 'Node Sentral', desc: 'Unit fokus utama berada di titik tengah jaringan graph.' },
                        { icon: '🔗', title: '4 Garis Hubungan', desc: 'Garis berwarna mewakili jenis keterkaitan kerja.' },
                        { icon: '🖱️', title: 'Klik Node Interaktif', desc: 'Klik node sekeliling untuk menjadikannya unit sentral baru.' }
                    ]
                },
                {
                    icon: '🎨',
                    title: 'Kode Warna Garis Hubungan',
                    subtitle: 'Arti 4 jenis garis keterkaitan kerja antar unit.',
                    cards: [
                        { icon: '🔵', title: 'Garis Biru', desc: 'Hubungan Koordinasi Operasional.' },
                        { icon: '🟢', title: 'Garis Hijau', desc: 'Hubungan Dukungan Data & Informasi.' },
                        { icon: '🟠 🟡', title: 'Garis Oranye & Kuning', desc: 'Hubungan Dukungan Regulasi & Pengawasan.' }
                    ]
                }
            ]
        }
    },

    init() {
        this.createDOM();

        // Keyboard navigation for slides modal
        window.addEventListener('keydown', (e) => {
            if (!this.isModalActive) return;
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                this.nextSlide();
            } else if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'Escape') {
                this.closeSlideModal();
            }
        });
    },

    createDOM() {
        if (document.querySelector('.onboarding-slide-modal')) return;

        // Modal Overlay Container
        this.backdropEl = document.createElement('div');
        this.backdropEl.className = 'onboarding-slide-backdrop';
        document.body.appendChild(this.backdropEl);

        this.modalEl = document.createElement('div');
        this.modalEl.className = 'onboarding-slide-modal';
        document.body.appendChild(this.modalEl);

        this.backdropEl.addEventListener('click', () => this.closeSlideModal());
    },

    // Triggered whenever user routes to a view
    checkAndTrigger(viewName) {
        if (!this.content[viewName]) return;

        this.activeView = viewName;
        
        // Render top banner if view container exists
        this.renderBanner(viewName);

        // Auto-open modal slide on first visit
        const storageKey = `djbc_banner_tour_${viewName}_done`;
        const hasSeen = localStorage.getItem(storageKey);
        if (!hasSeen) {
            setTimeout(() => {
                this.openSlideModal(viewName);
            }, this.autoTriggerDelay);
        }
    },

    // Render Banner at the top of active view container
    renderBanner(viewName) {
        const screenEl = document.getElementById(`${viewName}-screen`);
        if (!screenEl) return;

        // Check if banner already present
        let bannerEl = screenEl.querySelector('.onboarding-top-banner');
        const viewData = this.content[viewName];

        if (!bannerEl) {
            bannerEl = document.createElement('div');
            bannerEl.className = 'onboarding-top-banner fade-in';
            screenEl.prepend(bannerEl);
        }

        bannerEl.innerHTML = `
            <div class="banner-content-left flex items-center">
                <span class="banner-badge">PANDUAN HALAMAN</span>
                <div class="banner-text-info">
                    <span class="banner-title">${viewData.bannerTitle}</span>
                    <span class="banner-desc">${viewData.bannerDesc}</span>
                </div>
            </div>
            <div class="banner-controls flex items-center">
                <button class="banner-btn-action" onclick="window.ExplorerOnboarding.openSlideModal('${viewName}')">
                    📖 Buka Cards Panduan
                </button>
                <button class="banner-btn-close" onclick="this.closest('.onboarding-top-banner').remove()" title="Tutup Banner">&times;</button>
            </div>
        `;
    },

    openSlideModal(viewName = this.activeView) {
        if (!this.content[viewName]) return;
        this.activeView = viewName;
        this.currentSlide = 0;
        this.isModalActive = true;

        if (this.backdropEl) this.backdropEl.classList.add('active');
        if (this.modalEl) this.modalEl.classList.add('active');

        this.renderSlide(0);
    },

    renderSlide(slideIndex) {
        const viewData = this.content[this.activeView];
        if (!viewData || !viewData.slides[slideIndex]) return;

        this.currentSlide = slideIndex;
        const slide = viewData.slides[slideIndex];
        const totalSlides = viewData.slides.length;

        let cardsHTML = '';
        slide.cards.forEach(c => {
            cardsHTML += `
                <div class="slide-mini-card">
                    <div class="mini-card-icon">${c.icon}</div>
                    <div class="mini-card-text">
                        <div class="mini-card-title">${c.title}</div>
                        <div class="mini-card-desc">${c.desc}</div>
                    </div>
                </div>
            `;
        });

        let dotsHTML = '<div class="slide-dots">';
        for (let i = 0; i < totalSlides; i++) {
            dotsHTML += `<div class="slide-dot ${i === slideIndex ? 'active' : ''}" onclick="window.ExplorerOnboarding.renderSlide(${i})"></div>`;
        }
        dotsHTML += '</div>';

        const isLast = slideIndex === totalSlides - 1;
        const isFirst = slideIndex === 0;

        this.modalEl.innerHTML = `
            <div class="slide-modal-header">
                <div class="slide-header-title">
                    <span class="slide-big-icon">${slide.icon}</span>
                    <div>
                        <h3>${slide.title}</h3>
                        <p>${slide.subtitle}</p>
                    </div>
                </div>
                <button class="slide-close-btn" onclick="window.ExplorerOnboarding.closeSlideModal()">&times;</button>
            </div>
            
            <div class="slide-cards-grid">
                ${cardsHTML}
            </div>

            <div class="slide-modal-footer">
                ${dotsHTML}
                <div class="slide-actions">
                    ${!isFirst ? '<button class="slide-btn slide-btn-prev" onclick="window.ExplorerOnboarding.prevSlide()">&larr; Sebelum</button>' : ''}
                    <button class="slide-btn slide-btn-next" onclick="window.ExplorerOnboarding.nextSlide()">${isLast ? 'Selesai & Pahami ✨' : 'Lanjut &rarr;'}</button>
                </div>
            </div>
        `;
    },

    nextSlide() {
        const viewData = this.content[this.activeView];
        if (viewData && this.currentSlide < viewData.slides.length - 1) {
            this.renderSlide(this.currentSlide + 1);
        } else {
            this.closeSlideModal();
        }
    },

    prevSlide() {
        if (this.currentSlide > 0) {
            this.renderSlide(this.currentSlide - 1);
        }
    },

    closeSlideModal() {
        this.isModalActive = false;
        if (this.backdropEl) this.backdropEl.classList.remove('active');
        if (this.modalEl) this.modalEl.classList.remove('active');

        if (this.activeView) {
            localStorage.setItem(`djbc_banner_tour_${this.activeView}_done`, 'true');
        }
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.ExplorerOnboarding.init();
});
