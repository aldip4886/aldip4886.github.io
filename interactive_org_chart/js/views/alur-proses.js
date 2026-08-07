/**
 * Interactive Step-by-Step Process Slider Controller
 * Aligned with PRD v2.0 (Step indicators, role descriptions, document outputs, redirects)
 */

window.AlurProsesView = {
    container: null,
    processId: '',
    steps: [],
    activeIndex: 0,
    
    async mount(params) {
        this.processId = params.type || 'impor';
        this.container = document.getElementById('alur-proses-screen');
        if (!this.container) return;
        
        // Fetch workflow steps
        try {
            const data = await window.Data.load('alur-proses');
            const workflow = data.proses.find(p => p.id === this.processId);
            if (!workflow) {
                this.container.innerHTML = `<div class="error-msg">Alur proses "${this.processId}" tidak ditemukan.</div>`;
                return;
            }
            this.steps = workflow.tahapan || [];
        } catch(e) {
            this.container.innerHTML = `<div class="error-msg">Gagal memuat alur tahapan kerja.</div>`;
            return;
        }
        
        // Set page header title
        const processTitles = {
            'impor': 'Alur Pelayanan & Pengawasan Impor',
            'ekspor': 'Alur Pelayanan & Pengawasan Ekspor',
            'cukai': 'Alur Pencatatan & Pelunasan Cukai',
            'penindakan': 'Alur Pengawasan & Penindakan Perairan'
        };
        document.getElementById('header-view-title').textContent = processTitles[this.processId] || "Alur Kerja Operasional";
        
        this.activeIndex = 0;
        this.renderLayout();
        this.updateStepUI();
        
        // Load Did You Know fact
        this.setupDidYouKnow(this.processId);
    },
    
    renderLayout() {
        const processTabs = [
            { id: 'impor', label: '📦 Impor' },
            { id: 'ekspor', label: '🚢 Ekspor' },
            { id: 'cukai', label: '🏷️ Cukai' },
            { id: 'penindakan', label: '🛡️ Penindakan' }
        ];

        this.container.innerHTML = `
            <div class="alur-proses-layout flex flex-col h-full" style="padding: 24px; max-width: 1350px; margin: 0 auto; font-family: Inter, sans-serif;">
                <!-- Header Breadcrumbs and Navigation Row -->
                <div class="detail-header-nav" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/alur-kerja'" style="padding: 9px 16px; font-size: 0.875rem; font-weight: 700; background: #071527; border: 1px solid var(--djbc-gold); color: #FFFFFF; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
                        &larr; Kembali ke Pilihan Alur Kerja
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0; font-size: 0.875rem; display: flex; align-items: center; gap: 6px;">
                        <a href="#/explorer" class="breadcrumb-item" style="color: #F5A623 !important; text-decoration: none; font-weight: 700;">Home</a>
                        <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.6) !important; font-size: 0.85rem;">&gt;</span>
                        <a href="#/alur-kerja" class="breadcrumb-item" style="color: #E2E8F0 !important; text-decoration: none; font-weight: 600;">Alur Kerja</a>
                        <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.6) !important; font-size: 0.85rem;">&gt;</span>
                        <span class="breadcrumb-item active" style="color: #FFFFFF !important; font-weight: 800; text-transform: capitalize;">${this.processId}</span>
                    </div>
                </div>
                
                <!-- Process Switcher Tab Bar -->
                <div class="process-tab-bar" style="display: flex; gap: 10px; margin-bottom: 20px; background: #0D2137; padding: 8px; border-radius: 12px; border: 1px solid rgba(245, 166, 35, 0.25);">
                    ${processTabs.map(tab => `
                        <a href="#/alur-proses/${tab.id}" class="process-tab-btn ${this.processId === tab.id ? 'active' : ''}" style="flex: 1; text-align: center; padding: 10px; border-radius: 8px; font-weight: 700; font-size: 0.875rem; text-decoration: none; transition: all 0.2s ease; ${this.processId === tab.id ? 'background: linear-gradient(135deg, #F5A623 0%, #D97706 100%); color: #071527; box-shadow: 0 4px 12px rgba(245, 166, 35, 0.4);' : 'background: transparent; color: rgba(255,255,255,0.7);'}">
                            ${tab.label}
                        </a>
                    `).join('')}
                </div>

                <!-- Step Indicator Progress Bar Row -->
                <div class="slider-progress-indicator-container card flex flex-col items-center" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 20px 30px; margin-bottom: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                    <div class="slider-steps-track flex items-center justify-between relative w-full" style="max-width: 800px; margin: 0 auto;">
                        <div class="track-line-bg" style="position: absolute; top: 50%; left: 0; right: 0; height: 4px; background: rgba(255,255,255,0.15); transform: translateY(-50%); z-index: 1; border-radius: 2px;"></div>
                        <div class="track-line-fill" id="slider-track-fill" style="position: absolute; top: 50%; left: 0; height: 4px; background: var(--djbc-gold); transform: translateY(-50%); z-index: 2; border-radius: 2px; transition: width 0.3s ease;"></div>
                        ${this.steps.map((step, idx) => `
                            <button class="step-indicator-btn" data-index="${idx}" id="indicator-btn-${idx}" style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.25); background: #071527; color: #FFFFFF; font-size: 0.875rem; font-weight: 800; cursor: pointer; z-index: 3; display: flex; align-items: center; justify-content: center; transition: all 0.25s ease;">
                                ${step.no}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Central Step Details Card (Slider Area) -->
                <div class="step-detail-card card flex-1 flex flex-col" id="active-step-card-pane" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 26px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); min-height: 380px;">
                    <!-- Loaded dynamically via updateStepUI() -->
                </div>
                
                <!-- Slider Bottom Control Buttons -->
                <div class="slider-bottom-controls flex items-center justify-between" style="margin-top: 20px;">
                    <button class="btn btn-secondary btn-nav-slider" id="btn-slider-prev" style="padding: 10px 22px; font-weight: 700; background: #0D2137; border: 1px solid var(--djbc-gold); color: #FFFFFF; border-radius: 10px; cursor: pointer;">&larr; Sebelumnya</button>
                    <button class="btn btn-primary btn-nav-slider" id="btn-slider-next" style="padding: 10px 22px; font-weight: 700; background: linear-gradient(135deg, #F5A623 0%, #D97706 100%); color: #071527; border: none; border-radius: 10px; cursor: pointer;">Berikutnya &rarr;</button>
                </div>
            </div>
        `;
        
        // Bind slider navigation listeners
        document.getElementById('btn-slider-prev').addEventListener('click', () => this.navigateStep(-1));
        document.getElementById('btn-slider-next').addEventListener('click', () => this.navigateStep(1));
        
        // Bind step indicators click
        this.steps.forEach((_, idx) => {
            const btn = document.getElementById(`indicator-btn-${idx}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (window.LandingView && window.LandingView.playBeep) {
                        window.LandingView.playBeep('click');
                    }
                    this.activeIndex = idx;
                    this.updateStepUI();
                });
            }
        });
    },
    
    updateStepUI() {
        const step = this.steps[this.activeIndex];
        const cardPane = document.getElementById('active-step-card-pane');
        if (!step || !cardPane) return;
        
        // 1. Update Indicators active classes
        this.steps.forEach((_, idx) => {
            const btn = document.getElementById(`indicator-btn-${idx}`);
            if (btn) {
                if (idx < this.activeIndex) {
                    btn.style.borderColor = '#10B981';
                    btn.style.background = '#10B981';
                    btn.style.color = '#FFFFFF';
                    btn.style.transform = 'scale(1)';
                } else if (idx === this.activeIndex) {
                    btn.style.borderColor = '#F5A623';
                    btn.style.background = '#F5A623';
                    btn.style.color = '#071527';
                    btn.style.transform = 'scale(1.2)';
                    btn.style.boxShadow = '0 0 14px rgba(245, 166, 35, 0.8)';
                } else {
                    btn.style.borderColor = 'rgba(255,255,255,0.25)';
                    btn.style.background = '#071527';
                    btn.style.color = 'rgba(255,255,255,0.7)';
                    btn.style.transform = 'scale(1)';
                    btn.style.boxShadow = 'none';
                }
            }
        });
        
        // Update track progress fill width to align exactly with active step-indicator-btn center
        const trackFill = document.getElementById('slider-track-fill');
        const activeBtn = document.getElementById(`indicator-btn-${this.activeIndex}`);
        if (trackFill && activeBtn) {
            const updateFillWidth = () => {
                const centerPos = activeBtn.offsetLeft + (activeBtn.offsetWidth / 2);
                trackFill.style.width = `${centerPos}px`;
            };
            updateFillWidth();
            requestAnimationFrame(updateFillWidth);
        }
        
        // 2. Render details content inside central pane
        cardPane.innerHTML = `
            <div class="step-detail-inner-grid fade-in" style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px; height: 100%;">
                <!-- Left: Stage Description and Outputs -->
                <div class="step-desc-col" style="display: flex; flex-direction: column; gap: 16px;">
                    <div class="step-number-title-row flex items-center gap-sm">
                        <span class="step-num-badge" style="background: rgba(245, 166, 35, 0.2); color: var(--djbc-gold); border: 1px solid var(--djbc-gold); padding: 4px 12px; border-radius: 6px; font-weight: 800; font-size: 0.8rem;">Tahap ${step.no}</span>
                        <h3 class="step-title-header" style="margin: 0; color: #FFFFFF; font-size: 1.25rem; font-weight: 800;">${step.judul}</h3>
                    </div>
                    
                    <p class="step-description-text" style="color: rgba(255,255,255,0.9); font-size: 0.9rem; line-height: 1.6; margin: 0; background: #071527; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">${step.deskripsi}</p>
                    
                    <div class="step-outputs-box" style="background: #071527; padding: 16px; border-radius: 12px; border: 1px solid rgba(245, 166, 35, 0.25);">
                        <h4 class="section-heading-detail" style="margin: 0 0 10px 0; color: var(--djbc-gold); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Dokumen / Output yang Dihasilkan</h4>
                        <div class="output-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            ${step.output.map(o => `
                                <div class="output-card" style="padding: 10px 12px; background: #0D2137; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 8px;">
                                    <span class="output-icon" style="font-size: 1rem;">📄</span>
                                    <span class="output-label" style="font-size: 0.8rem; color: #FFFFFF; font-weight: 600;">${o}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Right: Units Involved Cards (Vertical Stack) -->
                <div class="step-units-col flex flex-col" style="background: #071527; padding: 16px; border-radius: 12px; border: 1px solid rgba(245, 166, 35, 0.25);">
                    <h4 class="section-heading-detail" style="margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--djbc-gold); font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Unit Kerja yang Terlibat</h4>
                    <div class="step-involved-units-list flex flex-col gap-sm flex-1" style="overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
                        ${step.unit_terlibat.map(u => {
                            // Resolve details redirect route
                            let route = `#/kantor-pusat/${u.unit_id}`;
                            if (u.unit_id.startsWith('kanwil-')) route = `#/kanwil/${u.unit_id}`;
                            else if (u.unit_id.startsWith('kppbc-') || u.unit_id.startsWith('kpu-')) route = `#/kppbc/${u.unit_id}`;
                            else if (u.unit_id.startsWith('blbc-') || u.unit_id.startsWith('pso-') || u.unit_id.startsWith('upt-')) route = `#/upt/${u.unit_id}`;
                            else if (u.unit_id === 'kppbc') route = `#/explorer`;
                            else if (u.unit_id === 'kanwil') route = `#/peta-sebaran`;
                            else if (u.unit_id === 'blbc' || u.unit_id === 'pso') route = `#/peta-sebaran`;
                            
                            return `
                                <div class="involved-unit-card card flex items-start gap-md" style="border-left: 4px solid ${u.warna || 'var(--djbc-gold)'}; background: #0D2137; border-radius: 8px; padding: 12px 14px; cursor: pointer; transition: all 0.2s ease;" onclick="window.AlurProsesView.navigateToUnit('${route}')">
                                    <div class="involved-unit-icon" style="font-size: 1.35rem; margin-top: 2px;">🏢</div>
                                    <div class="involved-unit-info flex-1">
                                        <div class="involved-unit-name" style="font-weight: 800; font-size: 0.875rem; color: #FFFFFF;">${u.nama}</div>
                                        <div class="involved-unit-role" style="font-size: 0.775rem; color: rgba(255,255,255,0.75); line-height: 1.45; margin-top: 3px;">${u.peran}</div>
                                    </div>
                                    <span class="item-link-arrow" style="font-size: 1.25rem; color: var(--djbc-gold); align-self: center; font-weight: 700;">&rsaquo;</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // 3. Enable/Disable navigation buttons based on bounds
        const prevBtn = document.getElementById('btn-slider-prev');
        const nextBtn = document.getElementById('btn-slider-next');
        if (prevBtn) {
            prevBtn.disabled = (this.activeIndex === 0);
            prevBtn.style.opacity = (this.activeIndex === 0) ? '0.4' : '1';
            prevBtn.style.cursor = (this.activeIndex === 0) ? 'not-allowed' : 'pointer';
        }
        if (nextBtn) {
            nextBtn.disabled = (this.activeIndex === this.steps.length - 1);
            nextBtn.style.opacity = (this.activeIndex === this.steps.length - 1) ? '0.4' : '1';
            nextBtn.style.cursor = (this.activeIndex === this.steps.length - 1) ? 'not-allowed' : 'pointer';
        }
    },
    
    navigateStep(dir) {
        if (window.LandingView && window.LandingView.playBeep) {
            window.LandingView.playBeep('click');
        }
        
        const nextIndex = this.activeIndex + dir;
        if (nextIndex >= 0 && nextIndex < this.steps.length) {
            this.activeIndex = nextIndex;
            this.updateStepUI();
        }
    },
    
    navigateToUnit(route) {
        if (window.LandingView && window.LandingView.playBeep) {
            window.LandingView.playBeep('click');
        }
        window.location.hash = route;
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
    window.App.registerView('alur-proses', window.AlurProsesView);
}
