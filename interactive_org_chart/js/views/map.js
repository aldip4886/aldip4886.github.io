/**
 * Interactive Indonesia Map Controller & Plotter
 * Aligned with PRD v2.0 (Offline-first minimal SVG map, GPS projection, category filters)
 */

window.MapView = {
    container: null,
    geoData: null,
    filteredData: [],
    
    // Equirectangular Projection Bounds (Indonesia GPS mapped to map.png)
    minLng: 94.25,
    maxLng: 141.5,
    minLat: -11.25,
    maxLat: 9.3,
    
    activeFilters: {
        pulau: 'all',
        tipe: 'all'
    },
    
    async mount(params) {
        document.getElementById('header-view-title').textContent = "Peta Sebaran Instansi Vertikal & UPT DJBC";
        this.container = document.getElementById('peta-sebaran-screen');
        if (!this.container) return;
        
        // Fetch geo-coordinates data
        try {
            this.geoData = await window.Data.load('geo-coordinates');
        } catch(e) {
            this.container.innerHTML = `<div class="error-msg">Gagal memuat data sebaran geografis.</div>`;
            return;
        }
        
        this.renderLayout();
        this.setupFilters();
        this.updatePlot();
        
        // Load Did You Know bar
        this.setupDidYouKnow('kanwil');
    },
    
    renderLayout() {
        this.container.innerHTML = `
            <div class="map-view-layout flex flex-col h-full">
                <!-- Filters Top Bar -->
                <div class="map-filters-bar flex items-center justify-between">
                    <div class="filter-group-map flex">
                        <div class="select-wrapper">
                            <label class="filter-label">Filter Wilayah (Pulau)</label>
                            <select id="map-filter-pulau">
                                <option value="all">Semua Pulau</option>
                                <option value="Sumatera">Sumatera</option>
                                <option value="Jawa">Jawa</option>
                                <option value="Bali-Nusa Tenggara">Bali & Nusa Tenggara</option>
                                <option value="Kalimantan">Kalimantan</option>
                                <option value="Sulawesi">Sulawesi</option>
                                <option value="Maluku">Maluku</option>
                                <option value="Papua">Papua</option>
                            </select>
                        </div>
                        
                        <div class="select-wrapper">
                            <label class="filter-label">Kategori Unit</label>
                            <select id="map-filter-tipe">
                                <option value="all">Semua Kategori</option>
                                <option value="kanwil">Kantor Wilayah</option>
                                <option value="kpu">KPU BC</option>
                                <option value="blbc">BLBC (Laboratorium)</option>
                                <option value="pso">PSO BC (Pangkalan Patroli)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="map-stats-indicator">
                        Menampilkan: <strong id="map-filtered-count">0</strong> unit kerja
                    </div>
                </div>
                
                <!-- Map Canvas Container -->
                <div class="map-canvas-container flex-1 relative">
                    <!-- Inline SVG Background Map of Indonesia (Minimalist stylized islands) -->
                    <svg id="indonesia-map-svg" width="100%" height="100%" viewBox="0 0 1000 450" xmlns="http://www.w3.org/2000/svg">
                        <!-- Background map.png image -->
                        <image href="map.png" x="0" y="0" width="1000" height="450" />
                        
                        <!-- Plot markers layer -->
                        <g id="map-markers-group"></g>
                    </svg>
                    
                    <!-- Tooltip Card Overlay (Absolute overlay inside container) -->
                    <div id="map-tooltip-card" class="map-tooltip hidden"></div>
                </div>
            </div>
        `;
    },
    
    setupFilters() {
        const selectPulau = document.getElementById('map-filter-pulau');
        const selectTipe = document.getElementById('map-filter-tipe');
        
        if (selectPulau) {
            selectPulau.addEventListener('change', (e) => {
                this.activeFilters.pulau = e.target.value;
                this.updatePlot();
            });
        }
        
        if (selectTipe) {
            selectTipe.addEventListener('change', (e) => {
                this.activeFilters.tipe = e.target.value;
                this.updatePlot();
            });
        }
    },
    
    updatePlot() {
        const markersGroup = document.getElementById('map-markers-group');
        const tooltip = document.getElementById('map-tooltip-card');
        if (!markersGroup) return;
        
        // Clear previous markers
        markersGroup.innerHTML = '';
        if (tooltip) tooltip.classList.add('hidden');
        
        this.filteredData = [];
        
        // Merge all categories of geo data
        const categories = ['kanwil', 'kpu', 'blbc', 'pso'];
        categories.forEach(cat => {
            if (this.activeFilters.tipe !== 'all' && this.activeFilters.tipe !== cat) {
                return;
            }
            
            const list = this.geoData[cat] || [];
            list.forEach(item => {
                if (this.activeFilters.pulau !== 'all' && item.pulau !== this.activeFilters.pulau) {
                    return;
                }
                
                // Keep category type inside item details
                this.filteredData.push({ ...item, category: cat });
            });
        });
        
        // Update count text
        const countText = document.getElementById('map-filtered-count');
        if (countText) countText.textContent = this.filteredData.length;
        
        // Plot markers on SVG map using flat equirectangular projection
        const mapW = 1000;
        const mapH = 450;
        
        this.filteredData.forEach(item => {
            const x = ((item.lng - this.minLng) / (this.maxLng - this.minLng)) * mapW;
            const y = ((this.maxLat - item.lat) / (this.maxLat - this.minLat)) * mapH;
            
            // Draw marker element
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('transform', `translate(${x}, ${y})`);
            g.style.cursor = 'pointer';
            
            // Outer glowing pulse ring
            const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            pulse.setAttribute('r', 8);
            pulse.setAttribute('fill', 'transparent');
            pulse.setAttribute('stroke', `var(--color-${item.category})`);
            pulse.setAttribute('stroke-width', 2);
            pulse.setAttribute('class', 'map-marker-pulse-svg');
            g.appendChild(pulse);
            
            // Inner solid center dot
            const center = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            center.setAttribute('r', 4);
            center.setAttribute('fill', `var(--color-${item.category})`);
            g.appendChild(center);
            
            // Tooltip interactive events
            g.addEventListener('mouseenter', (e) => {
                this.showTooltip(item, x, y);
            });
            
            g.addEventListener('mouseleave', () => {
                const tooltip = document.getElementById('map-tooltip-card');
                if (tooltip) tooltip.classList.add('hidden');
            });
            
            g.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.LandingView && window.LandingView.playBeep) {
                    window.LandingView.playBeep('click');
                }
                
                let route = `#/kanwil/${item.id}`;
                if (item.category === 'blbc' || item.category === 'pso') {
                    route = `#/upt/${item.id}`;
                } else if (item.category === 'kpu') {
                    route = `#/upt/kpu-${item.id}`;
                }
                window.location.hash = route;
            });
            
            markersGroup.appendChild(g);
        });
    },
    
    showTooltip(item, x, y) {
        const tooltip = document.getElementById('map-tooltip-card');
        if (!tooltip) return;
        
        // Position tooltip relative to container bounds
        tooltip.style.left = `${(x / 1000) * 100}%`;
        tooltip.style.top = `${((y - 20) / 450) * 100}%`; // Y-coordinate offset of 20 units
        
        // Resolve category text
        const badgeMap = {
            'kanwil': 'Kantor Wilayah',
            'kpu': 'KPU Bea Cukai',
            'blbc': 'UPT Laboratorium',
            'pso': 'UPT Pangkalan Patroli'
        };
        
        tooltip.innerHTML = `
            <div class="tooltip-body" style="pointer-events: none;">
                <span class="badge badge-${item.category}" style="margin-bottom: 4px;">${badgeMap[item.category]}</span>
                <h5 class="tooltip-title" style="margin: 2px 0 4px 0; font-size: 0.85rem; color: var(--text-dark); font-weight: 700;">${item.nama}</h5>
                <div class="tooltip-meta" style="font-size: 0.7rem; color: var(--text-muted);">Wilayah: ${item.pulau}</div>
                <div style="font-size: 0.65rem; color: var(--djbc-gold); margin-top: 6px; font-weight: 600;">⚡ Klik untuk detail unit</div>
            </div>
        `;
        
        tooltip.classList.remove('hidden');
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
    window.App.registerView('peta-sebaran', window.MapView);
}
