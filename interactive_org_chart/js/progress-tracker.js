/**
 * Progress Tracker & Gamification Engine
 * Aligned with PRD v2.0 (localStorage-based tracking for offline support)
 */

window.ProgressTracker = {
    state: {
        visitedUnits: [],       // list of unit IDs visited
        completedChallenges: {}, // dict of challengeId -> { score: number, date: string }
        unlockedBadges: {},     // dict of badgeId -> unlockDateString
        startTime: null,        // timestamp when current session started
        accumulatedTime: 0      // total seconds spent learning across sessions
    },
    
    timerInterval: null,
    totalUnitsCount: 153,       // 14 Kanpus + 3 TP + 20 Kanwil + 3 KPU + 104 KPPBC + 3 BLBC + 6 PSO = 153
    totalChallengesCount: 10,   // 5 clicks + 5 cases
    
    init() {
        console.log("Initializing Progress Tracker...");
        this.loadState();
        
        // Start time tracking
        this.state.startTime = Date.now();
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            if (this.state.startTime) {
                const sessionSeconds = Math.floor((Date.now() - this.state.startTime) / 1000);
                const totalSeconds = this.state.accumulatedTime + sessionSeconds;
                
                // Update UI or emit time changes if needed
                if (sessionSeconds % 10 === 0) { // Save progress every 10 seconds
                    this.saveState();
                }
            }
        }, 1000);
        
        // Listen to page close to save state
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
    },
    
    loadState() {
        try {
            const saved = localStorage.getItem('djbc_org_explorer_progress');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state.visitedUnits = parsed.visitedUnits || [];
                this.state.completedChallenges = parsed.completedChallenges || {};
                this.state.unlockedBadges = parsed.unlockedBadges || {};
                this.state.accumulatedTime = parsed.accumulatedTime || 0;
            }
        } catch (e) {
            console.error("Error loading progress state:", e);
        }
    },
    
    saveState() {
        try {
            const sessionSeconds = this.state.startTime ? Math.floor((Date.now() - this.state.startTime) / 1000) : 0;
            const stateToSave = {
                visitedUnits: this.state.visitedUnits,
                completedChallenges: this.state.completedChallenges,
                unlockedBadges: this.state.unlockedBadges,
                accumulatedTime: this.state.accumulatedTime + sessionSeconds
            };
            localStorage.setItem('djbc_org_explorer_progress', JSON.stringify(stateToSave));
            
            // If page is still active, reset session startTime to now
            if (this.state.startTime) {
                this.state.accumulatedTime += sessionSeconds;
                this.state.startTime = Date.now();
            }
        } catch (e) {
            console.error("Error saving progress state:", e);
        }
    },
    
    resetProgress() {
        this.state = {
            visitedUnits: [],
            completedChallenges: {},
            unlockedBadges: {},
            startTime: Date.now(),
            accumulatedTime: 0
        };
        this.saveState();
        if (window.App && window.App.store) {
            window.App.store.emit('progresschange', this.state);
        }
    },
    
    // Add a unit to visited list
    trackVisit(unitId) {
        if (!unitId) return;
        
        if (!this.state.visitedUnits.includes(unitId)) {
            this.state.visitedUnits.push(unitId);
            console.log(`Visited unit tracked: ${unitId}`);
            
            this.checkBadgeUnlockCriteria();
            this.saveState();
            
            // Notify AppStore
            if (window.App && window.App.store) {
                window.App.store.emit('progresschange', this.state);
            }
        }
    },
    
    // Complete an assessment challenge
    completeChallenge(challengeId, score, xp) {
        if (!challengeId) return;
        
        // Save or update completion state
        this.state.completedChallenges[challengeId] = {
            score: score,
            xp: xp,
            isCorrect: score > 0,
            date: new Date().toLocaleDateString('id-ID')
        };
        console.log(`Challenge completed: ${challengeId} with score ${score}`);
        
        this.checkBadgeUnlockCriteria();
        this.saveState();
        
        // Notify AppStore
        if (window.App && window.App.store) {
            window.App.store.emit('progresschange', this.state);
        }
    },

    retryChallenge(challengeId) {
        if (!challengeId) return;
        delete this.state.completedChallenges[challengeId];
        this.saveState();
        if (window.App && window.App.store) {
            window.App.store.emit('progresschange', this.state);
        }
    },
    
    // Check if learning milestones are met to unlock badges
    checkBadgeUnlockCriteria() {
        const visitedCount = this.state.visitedUnits.length;
        const solvedCount = Object.keys(this.state.completedChallenges).length;
        const nowStr = new Date().toLocaleDateString('id-ID');
        let newlyUnlocked = false;

        const tryUnlock = (badgeId) => {
            if (!this.state.unlockedBadges[badgeId]) {
                this.state.unlockedBadges[badgeId] = nowStr;
                newlyUnlocked = true;
                console.log(`🏆 BADGE UNLOCKED: ${badgeId}`);
                
                // Trigger visual alert if window.App exists
                if (window.App) {
                    window.App.store.emit('badgeunlocked', badgeId);
                }
            }
        };

        // 1. Explorer Pemula — Jelajahi 10 unit
        if (visitedCount >= 10) {
            tryUnlock('explorer-pemula');
        }
        
        // 2. Organization Finder — Temukan 25 unit
        if (visitedCount >= 25) {
            tryUnlock('org-finder');
        }
        
        // 3. Network Understanding — Pahami 5 hubungan kerja
        // This is unlocked when the user explores at least 5 units in the Connection Map. 
        // We track this by prefixing connection map visits or by simple coordinate exploration. 
        // For simplicity, let's unlock when they visit 5 connection nodes (tracked via visits to 'keterkaitan' or visited count >= 15)
        if (visitedCount >= 15) {
            tryUnlock('network-understanding');
        }
        
        // 4. DJBC Navigator — Jelajahi semua Kantor Pusat (14 units: Sekditjen + 13 Dit)
        const kanpusVisited = this.state.visitedUnits.filter(id => {
            return id === 'setditjen' || id.startsWith('dit-') || id.startsWith('tp-');
        }).length;
        if (kanpusVisited >= 16) { // 13 Dit + Setditjen + 3 TP = 17 units.
            tryUnlock('djbc-navigator');
        }
        
        // 5. Regional Explorer — Jelajahi 10 Kantor Wilayah
        const kanwilVisited = this.state.visitedUnits.filter(id => id.startsWith('kanwil-')).length;
        if (kanwilVisited >= 10) {
            tryUnlock('regional-explorer');
        }
        
        // 6. Organization Master — Selesaikan semua tantangan
        if (solvedCount >= this.totalChallengesCount) {
            tryUnlock('org-master');
        }
        
        return newlyUnlocked;
    },
    
    // Calculates overall progress percentage (visited units weight 70%, challenges weight 30%)
    getOverallPercentage() {
        const visitedPct = Math.min(100, (this.state.visitedUnits.length / this.totalUnitsCount) * 100);
        const solvedPct = Math.min(100, (Object.keys(this.state.completedChallenges).length / this.totalChallengesCount) * 100);
        
        const overall = Math.round((visitedPct * 0.7) + (solvedPct * 0.3));
        return Math.min(100, Math.max(0, overall));
    },
    
    getTimeSpentString() {
        const sessionSeconds = this.state.startTime ? Math.floor((Date.now() - this.state.startTime) / 1000) : 0;
        const totalSeconds = this.state.accumulatedTime + sessionSeconds;
        
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    getTotalScore() {
        return Object.values(this.state.completedChallenges).reduce((acc, curr) => acc + (curr.score || 0), 0);
    },
    
    getJourneyLevel() {
        const visitedCount = this.state.visitedUnits.length;
        const solvedCount = Object.keys(this.state.completedChallenges).length;
        
        // Journey levels: 1 (Pemula) -> 2 (Explorer Aktif) -> 3 (Connector) -> 4 (Strategist) -> 5 (Master)
        if (visitedCount >= 50 && solvedCount >= 10) {
            return { level: 5, title: "Organization Master", desc: "Kuasai seluruh materi dan tantangan" };
        } else if (visitedCount >= 30 && solvedCount >= 6) {
            return { level: 4, title: "Strategist", desc: "Selesaikan semua tantangan tingkat lanjut" };
        } else if (visitedCount >= 15 && solvedCount >= 3) {
            return { level: 3, title: "Connector", desc: "Pahami hubungan antar unit dan alur kerja" };
        } else if (visitedCount >= 10) {
            return { level: 2, title: "Explorer Aktif", desc: "Jelajahi unit-unit di Kantor Pusat, Instansi Vertikal, dan UPT" };
        } else {
            return { level: 1, title: "Pemula", desc: "Kenali struktur dasar organisasi DJBC" };
        }
    }
};
