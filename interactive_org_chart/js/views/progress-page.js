/**
 * Gamified Progress Dashboard Controller
 * Aligned with PRD v2.0 (Donut chart SVG, statistics cards, badge lock/unlock display, progress resets)
 */

window.ProgressView = {
    container: null,
    timerInterval: null,
    
    mount(params) {
        document.getElementById('header-view-title').textContent = "Laporan Progres Belajar Saya";
        this.container = document.getElementById('progress-screen');
        if (!this.container) return;
        
        this.renderLayout();
        this.startLiveStatsTimer();
        
        // Load Did You Know bar
        this.setupDidYouKnow('setditjen');
    },
    
    renderLayout() {
        const tracker = window.ProgressTracker;
        if (!tracker) return;
        
        const pct = tracker.getOverallPercentage();
        const score = tracker.getTotalScore();
        const visited = tracker.state.visitedUnits.length;
        const challenges = Object.keys(tracker.state.completedChallenges).length;
        const timeStr = tracker.getTimeSpentString();
        
        // Badge list metadata
        const badgeList = [
            { id: 'explorer-pemula', title: 'Explorer Pemula', desc: 'Jelajahi 10 unit kerja di Bea Cukai.', icon: '🎓' },
            { id: 'org-finder', title: 'Organization Finder', desc: 'Jelajahi 25 unit kerja di Bea Cukai.', icon: '🔍' },
            { id: 'network-understanding', title: 'Network Understanding', desc: 'Pahami interaksi dan relasi wewenang.', icon: '🌐' },
            { id: 'djbc-navigator', title: 'DJBC Navigator', desc: 'Kunjungi semua unit Kantor Pusat (17 unit).', icon: '⚓' },
            { id: 'regional-explorer', title: 'Regional Explorer', desc: 'Kunjungi minimal 10 Kantor Wilayah.', icon: '🗺️' },
            { id: 'org-master', title: 'Organization Master', desc: 'Selesaikan seluruh kuis dan tantangan.', icon: '🏆' }
        ];
        
        // Calculate Donut circle stroke parameters
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (pct / 100) * circumference;
        
        this.container.innerHTML = `
            <div class="progress-page-layout flex flex-col h-full" style="background: #071527; padding: 24px; max-width: 1350px; margin: 0 auto; min-height: 100%; color: #FFFFFF;">
                <!-- Header Breadcrumbs and Navigation Row -->
                <div class="detail-header-nav" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/explorer'" style="padding: 9px 16px; font-size: 0.875rem; font-weight: 700; background: #071527; border: 1px solid var(--djbc-gold); color: #FFFFFF; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
                        &larr; Kembali ke Peta Hierarki
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0; font-size: 0.875rem; display: flex; align-items: center; gap: 6px;">
                        <a href="#/explorer" class="breadcrumb-item" style="color: #F5A623 !important; text-decoration: none; font-weight: 700;">Home</a>
                        <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.6) !important; font-size: 0.85rem;">&gt;</span>
                        <span class="breadcrumb-item active" style="color: #FFFFFF !important; font-weight: 800;">Laporan Progres Belajar & Badges</span>
                    </div>
                </div>

                <!-- Top Overview Grid (Donut + Stats) -->
                <div class="progress-overview-row flex gap-lg" style="margin-bottom: 20px;">
                    <!-- Left: Donut Chart -->
                    <div class="donut-chart-card card flex items-center justify-center flex-col" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; min-width: 260px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                        <div class="donut-chart-container" style="position: relative; width: 150px; height: 150px;">
                            <svg class="donut-svg" width="150" height="150">
                                <circle class="donut-circle-bg" cx="75" cy="75" r="${radius}" fill="transparent" stroke="#1E3A5F" stroke-width="12"/>
                                <circle class="donut-circle-fill" cx="75" cy="75" r="${radius}" fill="transparent" stroke="#F5A623" stroke-width="12" 
                                    stroke-dasharray="${circumference} ${circumference}" stroke-dashoffset="${offset}" style="transition: stroke-dashoffset 0.8s ease;"/>
                            </svg>
                            <div class="donut-text-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                                <span class="donut-percentage" id="donut-pct-text" style="font-size: 1.8rem; font-weight: 900; color: #FFFFFF; display: block;">${pct}%</span>
                                <span class="donut-label" style="font-size: 0.7rem; font-weight: 800; color: #F5A623; letter-spacing: 0.5px;">SELESAI</span>
                            </div>
                        </div>
                        <div class="donut-subtitle" style="font-weight: 700; font-size: 0.875rem; margin-top: 14px; color: #E2E8F0;">Persentase Pemahaman Materi</div>
                    </div>
                    
                    <!-- Right: Statistics Cards Grid -->
                    <div class="stats-cards-block flex-1 grid" style="grid-template-columns: repeat(2, 1fr); gap: 16px;">
                        <div class="stat-card" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                            <div class="stat-icon" style="font-size: 2.2rem;">🎖️</div>
                            <div class="stat-info">
                                <span class="stat-label" style="font-size: 0.775rem; color: rgba(255,255,255,0.7); display: block; font-weight: 600;">Total Skor Pemahaman</span>
                                <span class="stat-value" id="live-xp-score" style="font-size: 1.4rem; font-weight: 900; color: #F5A623;">${score} XP</span>
                            </div>
                        </div>
                        
                        <div class="stat-card" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                            <div class="stat-icon" style="font-size: 2.2rem;">🏢</div>
                            <div class="stat-info">
                                <span class="stat-label" style="font-size: 0.775rem; color: rgba(255,255,255,0.7); display: block; font-weight: 600;">Unit Kerja Dikunjungi</span>
                                <span class="stat-value" id="live-visited-units" style="font-size: 1.4rem; font-weight: 900; color: #FFFFFF;">${visited} / ${tracker.totalUnitsCount} Unit</span>
                            </div>
                        </div>
                        
                        <div class="stat-card" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                            <div class="stat-icon" style="font-size: 2.2rem;">📝</div>
                            <div class="stat-info">
                                <span class="stat-label" style="font-size: 0.775rem; color: rgba(255,255,255,0.7); display: block; font-weight: 600;">Tantangan Diselesaikan</span>
                                <span class="stat-value" id="live-solved-challenges" style="font-size: 1.4rem; font-weight: 900; color: #FFFFFF;">${challenges} / ${tracker.totalChallengesCount} Kuis</span>
                            </div>
                        </div>
                        
                        <div class="stat-card" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 14px; padding: 18px 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                            <div class="stat-icon" style="font-size: 2.2rem;">⏱️</div>
                            <div class="stat-info">
                                <span class="stat-label" style="font-size: 0.775rem; color: rgba(255,255,255,0.7); display: block; font-weight: 600;">Waktu Sesi Belajar</span>
                                <span class="stat-value" id="live-time-spent" style="font-size: 1.4rem; font-weight: 900; color: #F5A623;">${timeStr}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Bottom: Badge Collection Grid -->
                <div class="badge-collection-panel card flex-1 flex flex-col" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; margin-top: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                    <h3 class="panel-heading" style="margin: 0 0 16px 0; color: #F5A623; font-size: 1.1rem; font-weight: 800;">🏆 Koleksi Lencana Pencapaian (Badges)</h3>
                    <div class="badges-grid flex-1" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
                        ${badgeList.map(b => {
                            const isUnlocked = !!tracker.state.unlockedBadges[b.id];
                            const dateUnlocked = tracker.state.unlockedBadges[b.id] || '';
                            return `
                                <div class="badge-card card flex items-center gap-md ${isUnlocked ? 'unlocked' : 'locked'}" style="background: #071527; border: 1px solid ${isUnlocked ? '#F5A623' : 'rgba(255,255,255,0.15)'}; border-radius: 12px; padding: 16px; opacity: ${isUnlocked ? '1' : '0.65'};">
                                    <div class="badge-avatar flex items-center justify-center" style="font-size: 2.2rem; min-width: 50px;">
                                        <span class="badge-avatar-icon">${b.icon}</span>
                                    </div>
                                    <div class="badge-info flex-1">
                                        <div class="badge-card-title" style="font-weight: 800; font-size: 0.925rem; color: ${isUnlocked ? '#F5A623' : '#FFFFFF'};">${b.title}</div>
                                        <div class="badge-card-desc" style="font-size: 0.775rem; color: rgba(255,255,255,0.75); margin: 3px 0 6px 0; line-height: 1.4;">${b.desc}</div>
                                        ${isUnlocked 
                                            ? `<span class="badge-date" style="font-size: 0.7rem; font-weight: 700; color: #10B981; background: rgba(16, 185, 129, 0.15); padding: 2px 8px; border-radius: 4px;">Terbuka: ${dateUnlocked}</span>` 
                                            : `<span class="badge-status-lbl" style="font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 4px;">Terkunci</span>`
                                        }
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <!-- Footer Action Buttons -->
                <div class="progress-actions-footer flex justify-between items-center" style="padding-top: 20px; flex-shrink: 0;">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/perjalanan'" style="padding: 10px 18px; font-size: 0.875rem; font-weight: 700; background: #0D2137; border: 1px solid #F5A623; color: #FFFFFF; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
                        🧭 Peta Perjalanan Belajar
                    </button>
                    <button class="btn btn-secondary" onclick="window.ProgressView.triggerReset()" style="padding: 10px 18px; font-size: 0.875rem; font-weight: 700; background: #0D2137; color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
                        🗑️ Reset Semua Progres Saya
                    </button>
                </div>
            </div>
        `;
    },
    
    startLiveStatsTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            const timeEl = document.getElementById('live-time-spent');
            if (timeEl && window.ProgressTracker) {
                timeEl.textContent = window.ProgressTracker.getTimeSpentString();
            }
        }, 1000);
    },
    
    stopLiveStatsTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    },
    
    triggerReset() {
        const conf = confirm("APAKAH ANDA YAKIN?\nTindakan ini akan menghapus semua riwayat kunjungan unit kerja, skor kuis, dan lencana yang telah Anda buka!");
        if (conf && window.ProgressTracker) {
            window.ProgressTracker.resetProgress();
            this.renderLayout(); // Redraw UI
            alert("Progres belajar Anda telah di-reset ke nol.");
        }
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

// Cleanup timer on unload/navigate away
window.addEventListener('hashchange', () => {
    if (window.ProgressView) {
        window.ProgressView.stopLiveStatsTimer();
    }
});

// Register View
if (window.App) {
    window.App.registerView('progress', window.ProgressView);
}
