/**
 * Core Application Engine & Router for Interactive Organization Explorer
 * Aligned with PRD v2.0 (Light Mode App Shell, Did You Know Bar Loop Controller)
 */

class AppStore {
    constructor() {
        this.state = {
            activeView: 'landing',
            params: {},
            searchQuery: '',
            filters: {
                pulau: 'all',
                tipe: 'all'
            }
        };
        this.listeners = {};
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.emit('statechange', this.state);
    }

    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return () => {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        };
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}

// Global Application Instance
window.App = {
    store: new AppStore(),
    views: {}, // Container for registered view controllers
    dykIndex: 0,
    dykFacts: [],
    
    init() {
        console.log("Initializing DJBC Org Explorer...");
        
        // Load progress tracker
        if (window.ProgressTracker) {
            window.ProgressTracker.init();
        }
        
        // Setup header tour button listener
        const headerTourBtn = document.getElementById('header-tour-btn');
        if (headerTourBtn) {
            headerTourBtn.addEventListener('click', () => {
                if (window.ExplorerOnboarding) {
                    window.ExplorerOnboarding.openSlideModal(this.store.state.activeView);
                }
            });
        }
        
        // Setup Did You Know Next Button Controller
        this.initDidYouKnow();
        
        // Setup global event listeners
        window.addEventListener('hashchange', () => this.router());
        
        // Initial routing
        this.router();
    },
    
    initDidYouKnow() {
        const nextBtn = document.getElementById('dyk-next-btn');
        const textEl = document.getElementById('dyk-text-content');
        const barEl = document.getElementById('did-you-know-bar');
        if (!nextBtn || !textEl) return;

        // Populate initial facts
        if (window.data_did_you_know) {
            this.dykFacts = Object.values(window.data_did_you_know);
        }

        const showNextFact = () => {
            if (this.dykFacts.length === 0 && window.data_did_you_know) {
                this.dykFacts = Object.values(window.data_did_you_know);
            }
            if (this.dykFacts.length === 0) return;

            this.dykIndex = (this.dykIndex + 1) % this.dykFacts.length;
            
            // Fade transition effect
            textEl.style.opacity = '0';
            textEl.style.transition = 'opacity 0.2s ease';
            setTimeout(() => {
                textEl.textContent = this.dykFacts[this.dykIndex];
                textEl.style.opacity = '1';
            }, 200);

            if (window.LandingView && window.LandingView.playBeep) {
                window.LandingView.playBeep('click');
            }
        };

        // Attach click listener
        nextBtn.onclick = (e) => {
            e.preventDefault();
            showNextFact();
        };

        if (barEl) barEl.classList.remove('hidden');
    },
    
    // Register a view controller
    registerView(name, controller) {
        this.views[name] = controller;
    },

    // Simple Hash-based Router
    router() {
        const hash = window.location.hash || '#/';
        
        // Routing Matcher
        let activeView = 'landing';
        let params = {};
        
        if (hash === '#/' || hash === '') {
            activeView = 'landing';
        } else if (hash === '#/explorer') {
            activeView = 'explorer';
        } else if (hash.startsWith('#/kantor-pusat/')) {
            activeView = 'detail-kanpus';
            params.id = hash.substring(15);
        } else if (hash.startsWith('#/kanwil/')) {
            activeView = 'detail-kanwil';
            params.id = hash.substring(9);
        } else if (hash.startsWith('#/upt/')) {
            activeView = 'detail-upt';
            params.id = hash.substring(6);
        } else if (hash.startsWith('#/eselon-3/')) {
            activeView = 'detail-eselon3';
            const parts = hash.substring(11).split('/');
            if (parts.length >= 2) {
                params.parentId = parts[0];
                params.id = parts[1];
            } else {
                params.id = parts[0];
            }
        } else if (hash.startsWith('#/kppbc/')) {
            activeView = 'detail-kppbc';
            params.id = hash.substring(8);
        } else if (hash === '#/peta-sebaran') {
            activeView = 'peta-sebaran';
        } else if (hash === '#/alur-kerja') {
            activeView = 'alur-kerja';
        } else if (hash.startsWith('#/alur-proses')) {
            activeView = 'alur-proses';
            const sub = hash.substring(13).replace(/^\//, '');
            params.type = sub || 'impor';
        } else if (hash === '#/keterkaitan') {
            activeView = 'keterkaitan';
        } else if (hash.startsWith('#/pencarian')) {
            activeView = 'search-results';
            const queryParam = hash.split('?q=')[1];
            if (queryParam) {
                params.q = decodeURIComponent(queryParam);
            }
        } else if (hash === '#/assessment' || hash === '#/tantangan') {
            activeView = 'assessment';
        } else if (hash === '#/progress' || hash === '#/progres') {
            activeView = 'progress';
        } else if (hash === '#/journey' || hash === '#/perjalanan') {
            activeView = 'journey';
        } else if (hash === '#/bantuan') {
            activeView = 'help';
        }

        this.store.setState({ activeView, params });
        this.renderView(activeView, params);
    },

    // Render screen matching active route
    renderView(viewName, params = {}) {
        // Hide all screens
        document.querySelectorAll('.view-screen').forEach(el => el.classList.add('hidden'));
        
        const landingPage = document.getElementById('landing-page');
        const appShell = document.getElementById('app-shell');
        
        if (viewName === 'landing') {
            if (appShell) appShell.classList.add('hidden');
            if (landingPage) landingPage.classList.remove('hidden');
            
            // Mount Landing View
            if (this.views['landing']) {
                this.views['landing'].mount();
            }
        } else {
            if (landingPage) landingPage.classList.add('hidden');
            if (appShell) appShell.classList.remove('hidden');
            
            // Mount target view inside App Shell
            const targetScreen = document.getElementById(`${viewName}-screen`);
            if (targetScreen) {
                targetScreen.classList.remove('hidden');
            }
            
            // Trigger controller mount logic
            if (this.views[viewName]) {
                this.views[viewName].mount(params);
            }
            
            // Highlight active sidebar item
            this.updateSidebarActiveState(viewName);
            
            // Update app header progress
            this.updateHeaderProgress();

            // Trigger Onboarding Tour for view if available
            if (window.ExplorerOnboarding) {
                window.ExplorerOnboarding.checkAndTrigger(viewName);
            }
        }
    },
    
    updateSidebarActiveState(viewName) {
        document.querySelectorAll('.sidebar-nav-item').forEach(el => {
            el.classList.remove('active');
            if (el.dataset.view === viewName) {
                el.classList.add('active');
            }
        });
    },
    
    updateHeaderProgress() {
        if (window.ProgressTracker) {
            const pct = window.ProgressTracker.getOverallPercentage();
            const textEl = document.getElementById('header-progress-text');
            const ringEl = document.getElementById('header-progress-ring-circle');
            
            if (textEl) textEl.textContent = `${pct}%`;
            
            if (ringEl) {
                const radius = ringEl.r.baseVal.value;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (pct / 100) * circumference;
                ringEl.style.strokeDasharray = `${circumference} ${circumference}`;
                ringEl.style.strokeDashoffset = offset;
            }
        }
    }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
});
