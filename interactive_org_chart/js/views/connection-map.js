/**
 * Interactive Connection Map View Controller
 * Aligned with PRD v2.0 (SVG relation network graph, hover highlights)
 */

window.ConnectionMapView = {
    container: null,
    connections: [],
    
    // Custom Coordinates for the 12 key nodes in the network
    nodes: {
        "dit-p2": { label: "Direktorat Penindakan & Penyidikan", icon: "🛡️", x: 180, y: 75, cat: "kanpus" },
        "dit-teknis-kepab": { label: "Direktorat Teknis Kepabeanan", icon: "📋", x: 420, y: 75, cat: "kanpus" },
        "dit-audit": { label: "Direktorat Audit Kepabeanan", icon: "🔍", x: 660, y: 75, cat: "kanpus" },
        "dit-ki": { label: "Direktorat Kepatuhan Internal", icon: "⚖️", x: 880, y: 75, cat: "kanpus" },
        
        "dit-ikc": { label: "Direktorat IKC", icon: "💻", x: 140, y: 195, cat: "kanpus" },
        "dit-ksikc": { label: "Dit. Kerjasama & IKC", icon: "🌐", x: 360, y: 195, cat: "kanpus" },
        "dit-kbp": { label: "Dit. Keberatan & Peraturan", icon: "💰", x: 640, y: 195, cat: "kanpus" },
        "dit-fasilitas-kepab": { label: "Direktorat Fasilitas Kepabeanan", icon: "🏢", x: 880, y: 195, cat: "kanpus" },
        
        "kanwil": { label: "Kantor Wilayah DJBC", icon: "🏛️", x: 160, y: 325, cat: "kanwil" },
        "kppbc": { label: "KPPBC (Pelayanan Pabean)", icon: "🏬", x: 400, y: 325, cat: "kppbc" },
        "pso": { label: "PSO Bea Cukai (Pangkalan)", icon: "⚓", x: 640, y: 325, cat: "pso" },
        "blbc": { label: "BLBC (Balai Laboratorium)", icon: "🔬", x: 880, y: 325, cat: "blbc" }
    },
    
    async mount(params) {
        document.getElementById('header-view-title').textContent = "Peta Hubungan Kerja & Keterkaitan Antar Unit";
        this.container = document.getElementById('keterkaitan-screen');
        if (!this.container) return;
        
        // Fetch connections
        try {
            const data = await window.Data.load('connections');
            this.connections = data.connections || [];
        } catch(e) {
            this.container.innerHTML = `<div class="error-msg">Gagal memuat data keterkaitan unit.</div>`;
            return;
        }
        
        this.renderLayout();
        this.renderGraph();
        
        // Load Did You Know fact
        this.setupDidYouKnow('dit-p2');
    },
    
    renderLayout() {
        this.container.innerHTML = `
            <div class="keterkaitan-layout flex flex-col h-full" style="padding: 24px; max-width: 1350px; margin: 0 auto; font-family: Inter, sans-serif;">
                <!-- Header Breadcrumbs and Navigation Row -->
                <div class="detail-header-nav" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/explorer'" style="padding: 9px 16px; font-size: 0.875rem; font-weight: 700; background: #071527; border: 1px solid var(--djbc-gold); color: #FFFFFF; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
                        &larr; Kembali ke Peta Hierarki
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0; font-size: 0.875rem; display: flex; align-items: center; gap: 6px;">
                        <a href="#/explorer" class="breadcrumb-item" style="color: #F5A623 !important; text-decoration: none; font-weight: 700;">Home</a>
                        <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.6) !important; font-size: 0.85rem;">&gt;</span>
                        <span class="breadcrumb-item active" style="color: #FFFFFF !important; font-weight: 800;">Peta Keterkaitan Wewenang</span>
                    </div>
                </div>

                <!-- Info Intro Row -->
                <div class="keterkaitan-header-row card flex items-center justify-between" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                    <div>
                        <h3 class="keterkaitan-intro-title" style="margin: 0 0 6px 0; color: var(--djbc-gold); font-size: 1.15rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                            <span>🌐</span> Peta Keterkaitan Wewenang & Hubungan Kerja
                        </h3>
                        <p class="keterkaitan-intro-desc" style="margin: 0; color: rgba(255,255,255,0.85); font-size: 0.875rem; line-height: 1.5;">Klik pada lingkaran unit kerja untuk menyorot hubungan kerja dengan unit lainnya. Arahkan kursor ke garis penghubung untuk membaca detail koordinasi.</p>
                    </div>
                </div>
                
                <!-- Graph Render Area -->
                <div class="graph-viewport flex-1 relative" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); min-height: 440px;">
                    <!-- SVG Canvas -->
                    <svg id="connection-graph-svg" width="100%" height="100%" viewBox="0 0 1000 420" xmlns="http://www.w3.org/2000/svg">
                        <!-- Links/Lines layer -->
                        <g id="graph-links-group"></g>
                        <!-- Nodes layer -->
                        <g id="graph-nodes-group"></g>
                    </svg>
                    
                    <!-- Floating Relation Detail Box -->
                    <div id="graph-relation-detail-box" class="relation-detail-panel hidden" style="position: absolute; background: #071527; border: 1px solid var(--djbc-gold); border-left: 5px solid var(--djbc-gold); border-radius: 12px; padding: 14px 18px; box-shadow: 0 12px 35px rgba(0,0,0,0.75); max-width: 380px; min-width: 260px; z-index: 50; transition: left 0.15s ease-out, top 0.15s ease-out; pointer-events: auto;">
                        <button id="close-relation-box-btn" onclick="window.ConnectionMapView.hideRelationDetails(true)" style="position: absolute; top: 8px; right: 10px; background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 0.95rem; cursor: pointer; padding: 2px 6px; border-radius: 4px; font-weight: 700;">✕</button>
                        <div style="font-weight: 800; font-size: 0.725rem; text-transform: uppercase; color: var(--djbc-gold); letter-spacing: 0.6px;" id="relation-tag-lbl">Hubungan Kerja</div>
                        <h4 style="font-size: 0.925rem; font-weight: 800; margin: 4px 0; color: #FFFFFF;" id="relation-title-lbl">Hubungan P2 ke Wilayah</h4>
                        <p style="font-size: 0.8rem; color: rgba(255,255,255,0.85); line-height: 1.5; margin: 4px 0 0 0;" id="relation-desc-lbl">Deskripsi detail koordinasi operasional.</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    isPinned: false,

    renderGraph() {
        const svg = document.getElementById('connection-graph-svg');
        const linksGroup = document.getElementById('graph-links-group');
        const nodesGroup = document.getElementById('graph-nodes-group');
        
        if (!svg || !linksGroup || !nodesGroup) return;
        
        // Clear previous graphs
        linksGroup.innerHTML = '';
        nodesGroup.innerHTML = '';
        this.isPinned = false;
        
        // Click SVG backdrop to unpin/hide detail box
        svg.addEventListener('click', (e) => {
            if (e.target === svg || e.target.id === 'graph-links-group') {
                this.hideRelationDetails(true);
            }
        });

        // 1. Draw Links with Thick Hit Target Lines (26px wide zone)
        this.connections.forEach((conn) => {
            const fromNode = this.nodes[conn.from];
            const toNode = this.nodes[conn.to];
            
            if (fromNode && toNode) {
                const linkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                linkGroup.setAttribute('class', 'graph-link-group');
                
                const d = `M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`;
                
                // Thick invisible hit area path (26px wide zone for easy hover & click)
                const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                hitPath.setAttribute('d', d);
                hitPath.setAttribute('stroke', 'transparent');
                hitPath.setAttribute('stroke-width', '26');
                hitPath.setAttribute('fill', 'none');
                hitPath.setAttribute('pointer-events', 'stroke');
                hitPath.style.cursor = 'pointer';
                
                // Visible line
                const visualPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                visualPath.setAttribute('d', d);
                visualPath.setAttribute('class', 'graph-link-line');
                visualPath.setAttribute('stroke', 'rgba(255,255,255,0.25)');
                visualPath.setAttribute('stroke-width', '3.5');
                visualPath.setAttribute('fill', 'none');
                visualPath.style.transition = 'stroke 0.2s ease, stroke-width 0.2s ease';
                
                linkGroup.appendChild(hitPath);
                linkGroup.appendChild(visualPath);
                
                // Hover to highlight line & show detail box near mouse
                hitPath.addEventListener('mouseenter', (e) => {
                    visualPath.setAttribute('stroke', '#F5A623');
                    visualPath.setAttribute('stroke-width', '6');
                    if (!this.isPinned) {
                        this.showRelationDetails(conn, e, fromNode, toNode);
                    }
                });
                
                hitPath.addEventListener('mousemove', (e) => {
                    if (!this.isPinned) {
                        this.positionRelationBox(e, fromNode, toNode);
                    }
                });
                
                hitPath.addEventListener('mouseleave', () => {
                    visualPath.setAttribute('stroke', 'rgba(255,255,255,0.25)');
                    visualPath.setAttribute('stroke-width', '3.5');
                    if (!this.isPinned) {
                        this.hideRelationDetails();
                    }
                });
                
                // Click line to pin detail box in place near clicked position
                hitPath.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (window.LandingView && window.LandingView.playBeep) {
                        window.LandingView.playBeep('click');
                    }
                    visualPath.setAttribute('stroke', '#F5A623');
                    visualPath.setAttribute('stroke-width', '6');
                    this.isPinned = true;
                    this.showRelationDetails(conn, e, fromNode, toNode);
                });
                
                linksGroup.appendChild(linkGroup);
            }
        });
        
        // 2. Draw Nodes with Icons & Full Unit Names
        Object.entries(this.nodes).forEach(([id, n]) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('transform', `translate(${n.x}, ${n.y})`);
            g.setAttribute('class', `graph-node-g node-cat-${n.cat}`);
            g.style.cursor = 'pointer';
            
            // Invisible stationary hit area circle to prevent mouse jittering
            const circleHit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleHit.setAttribute('r', 34);
            circleHit.setAttribute('fill', 'transparent');
            circleHit.setAttribute('pointer-events', 'all');
            g.appendChild(circleHit);

            // Background outer ring
            const circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleBg.setAttribute('class', 'node-main-circle');
            circleBg.setAttribute('r', 22);
            circleBg.setAttribute('fill', '#071527');
            circleBg.setAttribute('stroke', `var(--color-${n.cat})`);
            circleBg.setAttribute('stroke-width', '3.5');
            g.appendChild(circleBg);
            
            // Icon (Emoji) inside node circle
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            icon.setAttribute('class', 'node-icon-text');
            icon.setAttribute('y', 6);
            icon.setAttribute('text-anchor', 'middle');
            icon.setAttribute('font-size', '1.15rem');
            icon.textContent = n.icon || '🏢';
            g.appendChild(icon);
            
            // Label tag under node with full Unit Name
            const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            const approxWidth = Math.max(n.label.length * 6.5 + 14, 80);
            labelBg.setAttribute('class', 'node-label-bg');
            labelBg.setAttribute('x', -approxWidth / 2);
            labelBg.setAttribute('y', 28);
            labelBg.setAttribute('width', approxWidth);
            labelBg.setAttribute('height', 20);
            labelBg.setAttribute('rx', 5);
            labelBg.setAttribute('fill', '#071527');
            labelBg.setAttribute('stroke', 'rgba(245, 166, 35, 0.4)');
            labelBg.setAttribute('stroke-width', '1');
            g.appendChild(labelBg);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('class', 'node-label-text');
            label.setAttribute('y', 42);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '0.675rem');
            label.setAttribute('font-weight', '700');
            label.setAttribute('fill', '#FFFFFF');
            label.textContent = n.label;
            g.appendChild(label);
            
            // Hover to highlight connections
            g.addEventListener('mouseenter', () => {
                this.focusNodeConnections(id);
            });
            g.addEventListener('mouseleave', () => {
                this.resetNodeConnections();
            });

            // Click node to navigate directly to its unit detail profile page
            g.addEventListener('click', (e) => {
                e.stopPropagation();
                if (window.LandingView && window.LandingView.playBeep) {
                    window.LandingView.playBeep('click');
                }
                
                let route = `#/kantor-pusat/${id}`;
                if (id === 'kanwil') route = `#/kanwil/kanwil-aceh`;
                else if (id === 'kppbc') route = `#/kppbc/kppbc-banda-aceh`;
                else if (id === 'blbc') route = `#/upt/blbc-jakarta`;
                else if (id === 'pso') route = `#/upt/pso-tanjung-balai-karimun`;
                
                window.location.hash = route;
            });
            
            nodesGroup.appendChild(g);
        });
    },
    
    resetNodeConnections() {
        const links = this.container.querySelectorAll('.graph-link-line');
        if (links) {
            links.forEach(l => {
                l.style.opacity = '1';
                l.setAttribute('stroke', 'rgba(255,255,255,0.25)');
            });
        }
    },

    focusNodeConnections(nodeId) {
        const links = this.container.querySelectorAll('.graph-link-line');
        if (!links) return;
        
        // Dim all
        links.forEach(l => l.style.opacity = '0.15');
        
        // Find links connected to selected node and highlight them
        this.connections.forEach((conn, idx) => {
            if (conn.from === nodeId || conn.to === nodeId) {
                const linkEl = links[idx];
                if (linkEl) {
                    linkEl.style.opacity = '1';
                    linkEl.setAttribute('stroke', '#F5A623');
                    linkEl.setAttribute('stroke-width', '4');
                }
            }
        });
    },
    
    showRelationDetails(conn, e, fromNode, toNode) {
        const box = document.getElementById('graph-relation-detail-box');
        if (!box) return;
        
        document.getElementById('relation-title-lbl').textContent = conn.label;
        document.getElementById('relation-desc-lbl').textContent = conn.deskripsi;
        
        // Resolve type label
        const typeLabels = {
            "koordinasi": "Koordinasi Operasional",
            "data": "Pertukaran Data Intelijen",
            "pengawasan": "Pembinaan & Pengawasan",
            "regulasi": "Konsultasi Regulasi & Hukum"
        };
        document.getElementById('relation-tag-lbl').textContent = typeLabels[conn.type] || 'Hubungan Kerja';
        
        box.classList.remove('hidden');
        this.positionRelationBox(e, fromNode, toNode);
    },

    positionRelationBox(e, fromNode, toNode) {
        const box = document.getElementById('graph-relation-detail-box');
        const viewport = this.container ? this.container.querySelector('.graph-viewport') : null;
        if (!box || !viewport) return;

        const rect = viewport.getBoundingClientRect();
        let posX = 0, posY = 0;

        if (e && e.clientX && e.clientY) {
            posX = e.clientX - rect.left;
            posY = e.clientY - rect.top;
        } else if (fromNode && toNode) {
            posX = ((fromNode.x + toNode.x) / 2 / 1000) * rect.width;
            posY = ((fromNode.y + toNode.y) / 2 / 420) * rect.height;
        }

        const boxWidth = box.offsetWidth || 340;
        const boxHeight = box.offsetHeight || 120;

        let left = posX + 16;
        let top = posY - boxHeight / 2;

        if (left + boxWidth > rect.width - 15) {
            left = posX - boxWidth - 16;
        }
        if (left < 15) left = 15;

        if (top + boxHeight > rect.height - 15) {
            top = rect.height - boxHeight - 15;
        }
        if (top < 15) top = 15;

        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
        box.style.bottom = 'auto';
        box.style.transform = 'none';
    },

    hideRelationDetails(force = false) {
        if (force) this.isPinned = false;
        if (this.isPinned) return;
        const box = document.getElementById('graph-relation-detail-box');
        if (box) box.classList.add('hidden');
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
    window.App.registerView('keterkaitan', window.ConnectionMapView);
}
