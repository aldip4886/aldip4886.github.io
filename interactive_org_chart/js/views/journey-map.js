/**
 * E-Learning Journey Roadmap Milestone View Controller
 * Aligned with PRD v2.0 (Milestone tracking levels 1-5, lock/unlock highlights)
 */

window.JourneyView = {
    container: null,
    
    mount(params) {
        document.getElementById('header-view-title').textContent = "Peta Perjalanan Belajar Mandiri";
        this.container = document.getElementById('journey-screen');
        if (!this.container) return;
        
        this.renderLayout();
        
        // Load Did You Know fact
        this.setupDidYouKnow('setditjen');
    },
    
    renderLayout() {
        const tracker = window.ProgressTracker;
        if (!tracker) return;
        
        const currentLvl = tracker.getJourneyLevel(); // { level, title, desc }
        const visited = tracker.state.visitedUnits.length;
        const solved = Object.keys(tracker.state.completedChallenges).length;
        
        // Roadmap milestones definition
        const milestones = [
            { level: 1, title: "Level 1: Pemula", desc: "Kenali struktur dasar organisasi DJBC.", req: "Mulai perjalanan belajar dengan mengunjungi unit kerja manapun.", isMet: true },
            { level: 2, title: "Level 2: Explorer Aktif", desc: "Jelajahi unit Kantor Pusat, Instansi Vertikal, dan UPT.", req: "Jelajahi minimal 10 unit kerja.", isMet: visited >= 10 },
            { level: 3, title: "Level 3: Connector", desc: "Pahami hubungan antar unit dan alur kerja.", req: "Jelajahi minimal 15 unit kerja dan selesaikan 3 kuis/tantangan.", isMet: visited >= 15 && solved >= 3 },
            { level: 4, title: "Level 4: Strategist", desc: "Selesaikan semua tantangan tingkat lanjut.", req: "Jelajahi minimal 30 unit kerja dan selesaikan 6 kuis/tantangan.", isMet: visited >= 30 && solved >= 6 },
            { level: 5, title: "Level 5: Organization Master", desc: "Kuasai seluruh materi tugas dan fungsi DJBC.", req: "Jelajahi minimal 50 unit kerja dan tuntaskan 10 kuis/tantangan.", isMet: visited >= 50 && solved >= 10 }
        ];
        
        this.container.innerHTML = `
            <div class="journey-page-layout flex flex-col h-full" style="background: #071527; padding: 24px; max-width: 1350px; margin: 0 auto; min-height: 100%; color: #FFFFFF;">
                <!-- Header Breadcrumbs and Navigation Row -->
                <div class="detail-header-nav" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/explorer'" style="padding: 9px 16px; font-size: 0.875rem; font-weight: 700; background: #071527; border: 1px solid var(--djbc-gold); color: #FFFFFF; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
                        &larr; Kembali ke Peta Hierarki
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0; font-size: 0.875rem; display: flex; align-items: center; gap: 6px;">
                        <a href="#/explorer" class="breadcrumb-item" style="color: #F5A623 !important; text-decoration: none; font-weight: 700;">Home</a>
                        <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.6) !important; font-size: 0.85rem;">&gt;</span>
                        <span class="breadcrumb-item active" style="color: #FFFFFF !important; font-weight: 800;">Peta Perjalanan Belajar Mandiri</span>
                    </div>
                </div>

                <div class="page-intro-banner card" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-left: 5px solid #F5A623; border-radius: 14px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                    <h3 class="intro-title" style="margin: 0 0 6px 0; color: #F5A623; font-size: 1.15rem; font-weight: 800;">🧭 Roadmap Belajar Anda</h3>
                    <p class="intro-desc" style="margin: 0; color: rgba(255,255,255,0.85); font-size: 0.875rem; line-height: 1.5;">Materi e-learning ini dibagi menjadi 5 tingkatan milestone. Tingkatkan pemahaman Anda dengan mengunjungi unit kerja baru serta memecahkan studi kasus untuk mencapai level tertinggi!</p>
                </div>
                
                <div class="journey-main-grid flex-1 flex gap-lg" style="overflow: hidden;">
                    <!-- Left: Roadmap Path -->
                    <div class="journey-road-panel card flex-1" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; overflow-y: auto; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                        <div class="journey-path">
                            ${milestones.map(m => {
                                const isActive = currentLvl.level === m.level;
                                const isDone = m.isMet;
                                const stateClass = isDone ? 'completed' : (isActive ? 'active' : 'locked');
                                
                                return `
                                    <div class="journey-step ${stateClass}" style="margin-bottom: 20px; padding: 16px; background: #071527; border: 1px solid ${isDone ? 'rgba(16, 185, 129, 0.4)' : (isActive ? '#F5A623' : 'rgba(255,255,255,0.1)')}; border-radius: 12px;">
                                        <div class="journey-info">
                                            <div class="journey-title flex items-center gap-xs" style="margin-bottom: 6px;">
                                                <span style="font-weight: 800; font-size: 1rem; color: ${isDone ? '#10B981' : (isActive ? '#F5A623' : '#FFFFFF')};">${m.title}</span>
                                                ${isDone ? '<span class="badge badge-success" style="font-size:0.7rem; padding:2px 8px; background: rgba(16, 185, 129, 0.2); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px; font-weight:700;">Tuntas</span>' : ''}
                                                ${isActive ? '<span class="badge badge-info" style="font-size:0.7rem; padding:2px 8px; background: rgba(245, 166, 35, 0.2); color: #F5A623; border: 1px solid rgba(245, 166, 35, 0.4); border-radius: 6px; font-weight:700;">Level Saat Ini</span>' : ''}
                                            </div>
                                            <div class="journey-desc" style="font-size: 0.85rem; color: rgba(255,255,255,0.85); line-height: 1.45;">${m.desc}</div>
                                            <div class="journey-req" style="font-size: 0.775rem; color: rgba(255,255,255,0.6); margin-top: 6px; font-weight: 600;">
                                                ⚙️ Kriteria: ${m.req}
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <!-- Right: Current Level Overview -->
                    <div class="journey-level-card flex flex-col" style="width: 320px; gap: 16px; flex-shrink: 0;">
                        <div class="card flex flex-col items-center text-center" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                            <div class="level-avatar flex items-center justify-center" style="font-size: 3rem; background: #071527; width: 75px; height: 75px; border-radius: 50%; border: 2px solid #F5A623; margin-bottom: 12px;">
                                🧭
                            </div>
                            <div class="level-tag" style="font-weight: 800; font-size: 0.75rem; color: #F5A623; text-transform: uppercase; letter-spacing: 0.5px;">Pencapaian Level</div>
                            <h4 style="font-size: 1.2rem; font-weight: 800; color: #FFFFFF; margin-top: 4px;">${currentLvl.title}</h4>
                            <p style="font-size: 0.825rem; color: rgba(255,255,255,0.8); line-height: 1.5; margin-top: 8px;">${currentLvl.desc}</p>
                        </div>
                        
                        <div class="card flex flex-col" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                            <h5 style="font-weight: 800; font-size: 0.875rem; color: #F5A623; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 8px; margin-bottom: 16px;">Rasio Target Level Berikutnya</h5>
                            
                            <div class="stat-progress-item" style="margin-bottom: 14px;">
                                <div class="flex justify-between" style="font-size: 0.775rem; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">
                                    <span>Kunjungan Unit Kerja</span>
                                    <span style="color: #F5A623;">${visited} unit</span>
                                </div>
                                <div class="progress-bar-container" style="background: #071527; height: 10px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                                    <div class="progress-bar-fill" style="width: ${Math.min(100, (visited / 50) * 100)}%; background: #F5A623; height: 100%; transition: width 0.5s ease;"></div>
                                </div>
                            </div>
                            
                            <div class="stat-progress-item">
                                <div class="flex justify-between" style="font-size: 0.775rem; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">
                                    <span>Tantangan Dipecahkan</span>
                                    <span style="color: #F5A623;">${solved} / 10 kuis</span>
                                </div>
                                <div class="progress-bar-container" style="background: #071527; height: 10px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                                    <div class="progress-bar-fill" style="width: ${Math.min(100, (solved / 10) * 100)}%; background: #10B981; height: 100%; transition: width 0.5s ease;"></div>
                                </div>
                            </div>
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
    window.App.registerView('journey', window.JourneyView);
}
