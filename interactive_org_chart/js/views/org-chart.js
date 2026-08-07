/**
 * Interactive Collapsible SVG Org Chart Engine
 * Aligned with PRD v2.0 & Layered SVG Rendering (z-index layering):
 * Layer 1 (Bottom): Connector Links (gLinks)
 * Layer 2 (Middle): Unit Node Cards (gNodes)
 * Layer 3 (Top): Sub-group Headers & Pillar Group Nodes (gHeaders)
 */

window.OrgChartView = {
    container: null,
    svg: null,
    gZoom: null,
    gLinks: null,
    gNodes: null,
    gLayerEselon2: null,
    gLayerKanwil: null,
    gLayerUpt: null,
    gHeaders: null,
    
    // Zoom/Pan State
    scale: 0.85,
    translateX: 0,
    translateY: 80,
    isDragging: false,
    startX: 0,
    startY: 0,
    
    // Collapsible Group States
    expandedGroups: {
        kanpus: false,
        vertikal: false,
        upt: false
    },
    
    // Data References
    dataKanpus: null,
    dataVertikal: null,
    dataUpt: null,
    
    // Layout Constants
    nodeW: 245,
    nodeH: 75,
    colSpacing: 580, // Generous spacing to prevent sub-column overlap
    subColWidth: 270,
    rowSpacing: 105, // 30px vertical gap between stacked cards
    
    async mount(params) {
        document.getElementById('header-view-title').textContent = "Peta Hirarki Organisasi DJBC";
        this.container = document.getElementById('org-chart-canvas-container');
        if (!this.container) return;
        
        // If an active click challenge exists, auto-expand all hierarchy pillars
        if (window.App && window.App.activeClickChallenge) {
            this.expandedGroups.kanpus = true;
            this.expandedGroups.vertikal = true;
            this.expandedGroups.upt = true;
        }
        
        // Clear previous chart
        this.container.innerHTML = '';
        
        // Load data if not cached
        try {
            this.dataKanpus = await window.Data.load('kantor-pusat');
            this.dataVertikal = await window.Data.load('instansi-vertikal');
            this.dataUpt = await window.Data.load('upt');
        } catch (e) {
            this.container.innerHTML = `<div class="error-msg">Gagal memuat data organisasi. Hubungkan internet atau periksa file data.</div>`;
            return;
        }
        
        this.buildSVG();
        this.setupInteractions();
        this.centerRoot();
    },
    
    buildSVG() {
        this.container.innerHTML = '';
        
        // Create main SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', '100%');
        this.svg.setAttribute('height', '100%');
        this.svg.style.cursor = 'grab';
        
        // Create zoom container group
        this.gZoom = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.svg.appendChild(this.gZoom);
        
        // Create explicit SVG layer groups for z-index rendering
        this.gLinks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.gLinks.setAttribute('class', 'layer-links');
        
        this.gLayerEselon2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.gLayerEselon2.setAttribute('class', 'layer-eselon2');
        
        this.gLayerKanwil = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.gLayerKanwil.setAttribute('class', 'layer-kanwil');
        
        this.gLayerUpt = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.gLayerUpt.setAttribute('class', 'layer-upt');
        
        this.gHeaders = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.gHeaders.setAttribute('class', 'layer-headers');
        
        // Layering Order: Links -> Eselon II -> Kanwil -> UPT -> Headers (top)
        this.gZoom.appendChild(this.gLinks);
        this.gZoom.appendChild(this.gLayerEselon2);
        this.gZoom.appendChild(this.gLayerKanwil);
        this.gZoom.appendChild(this.gLayerUpt);
        this.gZoom.appendChild(this.gHeaders);
        
        this.container.appendChild(this.svg);
        
        // Draw Layout Elements
        this.renderTree();
        
        // Create Bottom Toolbar Controls
        this.renderToolbar();
    },
    
    toggleGroup(groupKey) {
        this.expandedGroups[groupKey] = !this.expandedGroups[groupKey];
        if (window.LandingView && window.LandingView.playBeep) {
            window.LandingView.playBeep('click');
        }
        this.renderTree();
        this.updateTransform();
    },
    
    renderTree() {
        // Clear all SVG layer groups
        if (this.gLinks) this.gLinks.innerHTML = '';
        if (this.gLayerEselon2) this.gLayerEselon2.innerHTML = '';
        if (this.gLayerKanwil) this.gLayerKanwil.innerHTML = '';
        if (this.gLayerUpt) this.gLayerUpt.innerHTML = '';
        if (this.gHeaders) this.gHeaders.innerHTML = '';
        
        const rootX = 0;
        const rootY = 0;
        
        // 1. Root Node: DJBC (Center x=0, y=0) - Appended to gHeaders (top layer)
        this.drawRootNode(rootX, rootY, this.dataKanpus);
        
        // ----------------------------------------------------
        // 2. Pillar 1: KANTOR PUSAT (Left Column: X = -colSpacing)
        // ----------------------------------------------------
        const kanpusX = -this.colSpacing;
        const kanpusY = 140;
        const isKanpusExpanded = this.expandedGroups.kanpus;
        
        this.drawLink(rootX, rootY + this.nodeH / 2, kanpusX, kanpusY - this.nodeH / 2);
        this.drawPillarGroupNode(
            kanpusX, kanpusY, 
            "1. KANTOR PUSAT", 
            "1 Sekretariat, 13 Direktorat, 3 Tenaga Pengkaji", 
            "#008080", 
            isKanpusExpanded, 
            () => this.toggleGroup('kanpus')
        );
        
        if (isKanpusExpanded) {
            const subY_header = kanpusY + this.nodeH + 45;
            
            // Separate Kantor Pusat Children into 3 Groups
            const allKanpusChildren = (this.dataKanpus && this.dataKanpus.children) ? this.dataKanpus.children : [];
            const sekretariat = allKanpusChildren.filter(c => c.id === 'setditjen' || c.nama.toLowerCase().includes('sekretariat'));
            const tenagaPengkaji = allKanpusChildren.filter(c => c.id.startsWith('tp-') || c.nama.toLowerCase().includes('tenaga pengkaji'));
            const direktorat = allKanpusChildren.filter(c => !sekretariat.includes(c) && !tenagaPengkaji.includes(c));
            
            // HORIZONTAL Sub-column positions under Kantor Pusat:
            const subX_A = kanpusX - this.subColWidth; // Sekretariat
            const subX_B = kanpusX;                    // Direktorat
            const subX_C = kanpusX + this.subColWidth; // Tenaga Pengkaji
            
            // Connectors from Kantor Pusat Group Node to the 3 Sub-column Headers
            this.drawLink(kanpusX, kanpusY + this.nodeH / 2, subX_A, subY_header - 14);
            this.drawLink(kanpusX, kanpusY + this.nodeH / 2, subX_B, subY_header - 14);
            this.drawLink(kanpusX, kanpusY + this.nodeH / 2, subX_C, subY_header - 14);
            
            // --- Sub-column A: SEKRETARIAT (Left) ---
            if (sekretariat.length > 0) {
                this.drawSubGroupHeader(subX_A, subY_header, "A. SEKRETARIAT", "#008080");
                let curY = subY_header + 40;
                sekretariat.forEach(item => {
                    this.drawUnitNode(subX_A, curY, item, 'setditjen', '#008080');
                    this.drawLink(subX_A, subY_header + 14, subX_A, curY - this.nodeH / 2);
                    curY += this.rowSpacing;
                });
            }
            
            // --- Sub-column B: DIREKTORAT (Center - 13 Units) ---
            if (direktorat.length > 0) {
                this.drawSubGroupHeader(subX_B, subY_header, `B. DIREKTORAT (${direktorat.length} Unit)`, "#F5A623");
                let curY = subY_header + 40;
                direktorat.forEach(item => {
                    this.drawUnitNode(subX_B, curY, item, 'direktorat', '#F5A623');
                    this.drawLink(subX_B, subY_header + 14, subX_B, curY - this.nodeH / 2);
                    curY += this.rowSpacing;
                });
            }
            
            // --- Sub-column C: TENAGA PENGKAJI (Right - 3 Units) ---
            if (tenagaPengkaji.length > 0) {
                this.drawSubGroupHeader(subX_C, subY_header, `C. TENAGA PENGKAJI (${tenagaPengkaji.length} Unit)`, "#8b5cf6");
                let curY = subY_header + 40;
                tenagaPengkaji.forEach(item => {
                    this.drawUnitNode(subX_C, curY, item, 'tenaga-pengkaji', '#8b5cf6');
                    this.drawLink(subX_C, subY_header + 14, subX_C, curY - this.nodeH / 2);
                    curY += this.rowSpacing;
                });
            }
        }
        
        // ----------------------------------------------------
        // 3. Pillar 2: INSTANSI VERTIKAL (Center Column: X = 0)
        // ----------------------------------------------------
        const vertikalX = 0;
        const vertikalY = 140;
        const isVertikalExpanded = this.expandedGroups.vertikal;
        
        this.drawLink(rootX, rootY + this.nodeH / 2, vertikalX, vertikalY - this.nodeH / 2);
        this.drawPillarGroupNode(
            vertikalX, vertikalY, 
            "2. INSTANSI VERTIKAL", 
            "20 Kanwil, 3 KPU & 104 KPPBC", 
            "#10b981", 
            isVertikalExpanded, 
            () => this.toggleGroup('vertikal')
        );
        
        if (isVertikalExpanded) {
            const subY_vert = vertikalY + this.nodeH + 45;
            const vertikalChildren = (this.dataVertikal && this.dataVertikal.children) ? this.dataVertikal.children : [];
            
            // Separate into KPU BC (3 units) & Kanwil (20 units)
            const kpuList = vertikalChildren.filter(c => c.id.startsWith('kpu-') || c.nama.toLowerCase().includes('kpu'));
            const kanwilList = vertikalChildren.filter(c => !kpuList.includes(c));
            
            // Sub-column X positions under Instansi Vertikal:
            const subX_KPU = vertikalX - 160;    // Left sub-column for KPU BC
            const subX_Kanwil = vertikalX + 160; // Right sub-column for Kanwil DJBC
            
            this.drawLink(vertikalX, vertikalY + this.nodeH / 2, subX_KPU, subY_vert - 14);
            this.drawLink(vertikalX, vertikalY + this.nodeH / 2, subX_Kanwil, subY_vert - 14);
            
            // --- Sub-column A: KPU BEA CUKAI (3 Unit Vertikal) ---
            if (kpuList.length > 0) {
                this.drawSubGroupHeader(subX_KPU, subY_vert, `KPU BEA CUKAI (${kpuList.length} Unit)`, "#059669");
                let curY = subY_vert + 40;
                kpuList.forEach(item => {
                    this.drawUnitNode(subX_KPU, curY, item, 'kpu', '#059669');
                    this.drawLink(subX_KPU, subY_vert + 14, subX_KPU, curY - this.nodeH / 2);
                    curY += this.rowSpacing;
                });
            }
            
            // --- Sub-column B: KANTOR WILAYAH (20 Unit Vertikal) ---
            if (kanwilList.length > 0) {
                this.drawSubGroupHeader(subX_Kanwil, subY_vert, `KANWIL DJBC (${kanwilList.length} Unit)`, "#10b981");
                let curY = subY_vert + 40;
                kanwilList.forEach(item => {
                    this.drawUnitNode(subX_Kanwil, curY, item, 'kanwil', '#10b981');
                    this.drawLink(subX_Kanwil, subY_vert + 14, subX_Kanwil, curY - this.nodeH / 2);
                    curY += this.rowSpacing;
                });
            }
        }
        
        // ----------------------------------------------------
        // 4. Pillar 3: UNIT PELAKSANA TEKNIS (Right Column: X = colSpacing)
        // ----------------------------------------------------
        const uptX = this.colSpacing;
        const uptY = 140;
        const isUptExpanded = this.expandedGroups.upt;
        
        this.drawLink(rootX, rootY + this.nodeH / 2, uptX, uptY - this.nodeH / 2);
        this.drawPillarGroupNode(
            uptX, uptY, 
            "3. UNIT PELAKSANA TEKNIS", 
            "3 BLBC & 6 PSO Bea Cukai", 
            "#6366f1", 
            isUptExpanded, 
            () => this.toggleGroup('upt')
        );
        
        if (isUptExpanded) {
            const subY_upt = uptY + this.nodeH + 45;
            const uptChildren = (this.dataUpt && this.dataUpt.children) ? this.dataUpt.children : [];
            
            // Separate into BLBC (3 units) & PSO (6 units)
            const blbcList = uptChildren.filter(c => c.id.startsWith('blbc-') || c.nama.toLowerCase().includes('laboratorium'));
            const psoList = uptChildren.filter(c => !blbcList.includes(c));
            
            const subX_BLBC = uptX - 140;
            const subX_PSO = uptX + 140;
            
            this.drawLink(uptX, uptY + this.nodeH / 2, subX_BLBC, subY_upt - 14);
            this.drawLink(uptX, uptY + this.nodeH / 2, subX_PSO, subY_upt - 14);
            
            // --- Sub-column A: BALAI LAB BEA CUKAI (3 Unit) ---
            if (blbcList.length > 0) {
                this.drawSubGroupHeader(subX_BLBC, subY_upt, `BLBC (${blbcList.length} Unit)`, "#8b5cf6");
                let curY = subY_upt + 40;
                blbcList.forEach(item => {
                    this.drawUnitNode(subX_BLBC, curY, item, 'blbc', '#8b5cf6');
                    this.drawLink(subX_BLBC, subY_upt + 14, subX_BLBC, curY - this.nodeH / 2);
                    curY += this.rowSpacing;
                });
            }
            
            // --- Sub-column B: PANGKALAN SARANA OPERASI (6 Unit) ---
            if (psoList.length > 0) {
                this.drawSubGroupHeader(subX_PSO, subY_upt, `PSO BEA CUKAI (${psoList.length} Unit)`, "#6366f1");
                let curY = subY_upt + 40;
                psoList.forEach(item => {
                    this.drawUnitNode(subX_PSO, curY, item, 'pso', '#6366f1');
                    this.drawLink(subX_PSO, subY_upt + 14, subX_PSO, curY - this.nodeH / 2);
                    curY += this.rowSpacing;
                });
            }
        }
    },
    
    drawRootNode(x, y, data) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'org-node node-root');
        g.setAttribute('transform', `translate(${x - 160}, ${y - 35})`);
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', 320);
        rect.setAttribute('height', 70);
        rect.setAttribute('rx', 12);
        rect.setAttribute('fill', '#0D2137');
        rect.setAttribute('stroke', '#F5A623');
        rect.setAttribute('stroke-width', '3');
        g.appendChild(rect);
        
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', 160);
        title.setAttribute('y', 28);
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('fill', '#F5A623');
        title.setAttribute('font-weight', 'bold');
        title.setAttribute('font-size', '13px');
        title.textContent = "Direktorat Jenderal Bea dan Cukai";
        g.appendChild(title);
        
        const sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        sub.setAttribute('x', 160);
        sub.setAttribute('y', 48);
        sub.setAttribute('text-anchor', 'middle');
        sub.setAttribute('fill', '#FFFFFF');
        sub.setAttribute('font-size', '11px');
        sub.setAttribute('font-weight', '600');
        sub.textContent = "Unit Kerja Eselon I";
        g.style.cursor = 'pointer';
        g.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.App && typeof window.App.handleChallengeNodeClick === 'function') {
                window.App.handleChallengeNodeClick('djbc', { nama: 'Direktorat Jenderal Bea dan Cukai (Eselon I)' });
            }
        });
        
        this.gHeaders.appendChild(g);
    },
    
    drawPillarGroupNode(x, y, titleText, subtitleText, colorHex, isExpanded, clickHandler) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'org-node pillar-group-node');
        g.setAttribute('transform', `translate(${x - this.nodeW / 2}, ${y - this.nodeH / 2})`);
        g.style.cursor = 'pointer';
        
        // Background card
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.nodeW);
        rect.setAttribute('height', this.nodeH);
        rect.setAttribute('rx', 10);
        rect.setAttribute('fill', '#0D2137');
        rect.setAttribute('stroke', colorHex);
        rect.setAttribute('stroke-width', '2.5');
        g.appendChild(rect);
        
        // Title
        const textTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textTitle.setAttribute('x', this.nodeW / 2);
        textTitle.setAttribute('y', 24);
        textTitle.setAttribute('text-anchor', 'middle');
        textTitle.setAttribute('fill', colorHex);
        textTitle.setAttribute('font-weight', 'bold');
        textTitle.setAttribute('font-size', '12px');
        textTitle.textContent = titleText;
        g.appendChild(textTitle);
        
        // Subtitle / Content Summary
        const textSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textSub.setAttribute('x', this.nodeW / 2);
        textSub.setAttribute('y', 42);
        textSub.setAttribute('text-anchor', 'middle');
        textSub.setAttribute('fill', 'rgba(255, 255, 255, 0.85)');
        textSub.setAttribute('font-size', '10px');
        textSub.textContent = subtitleText;
        g.appendChild(textSub);
        
        // Expand/Collapse Toggle Button Badge
        const toggleBadge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        const badgeRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        badgeRect.setAttribute('x', this.nodeW / 2 - 60);
        badgeRect.setAttribute('y', 52);
        badgeRect.setAttribute('width', 120);
        badgeRect.setAttribute('height', 18);
        badgeRect.setAttribute('rx', 9);
        badgeRect.setAttribute('fill', isExpanded ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 166, 35, 0.2)');
        badgeRect.setAttribute('stroke', isExpanded ? '#ef4444' : '#F5A623');
        badgeRect.setAttribute('stroke-width', '1');
        toggleBadge.appendChild(badgeRect);
        
        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', this.nodeW / 2);
        badgeText.setAttribute('y', 64);
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('fill', isExpanded ? '#ef4444' : '#F5A623');
        badgeText.setAttribute('font-weight', 'bold');
        badgeText.setAttribute('font-size', '9.5px');
        badgeText.textContent = isExpanded ? '[-] Collapse Hirarki' : '[+] Expand Hirarki';
        toggleBadge.appendChild(badgeText);
        
        g.appendChild(toggleBadge);
        
        g.addEventListener('click', (e) => {
            e.stopPropagation();
            clickHandler();
        });
        
        this.gHeaders.appendChild(g);
    },
    
    drawSubGroupHeader(x, y, label, colorHex) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x - 110);
        rect.setAttribute('y', y - 14);
        rect.setAttribute('width', 220);
        rect.setAttribute('height', 28);
        rect.setAttribute('rx', 14);
        rect.setAttribute('fill', 'rgba(13, 33, 55, 0.95)');
        rect.setAttribute('stroke', colorHex);
        rect.setAttribute('stroke-width', '1.5');
        g.appendChild(rect);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 4);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', colorHex);
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '10.5px');
        text.setAttribute('letter-spacing', '0.5px');
        text.textContent = label;
        g.appendChild(text);
        
        this.gHeaders.appendChild(g);
    },
    
    drawUnitNode(x, y, data, typeTag, strokeColor) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', `org-node node-${typeTag}`);
        g.setAttribute('transform', `translate(${x - this.nodeW / 2}, ${y - this.nodeH / 2})`);
        g.style.cursor = 'pointer';
        
        // Node Background Box
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', this.nodeW);
        rect.setAttribute('height', this.nodeH);
        rect.setAttribute('rx', 8);
        rect.setAttribute('fill', '#FFFFFF');
        rect.setAttribute('stroke', strokeColor);
        rect.setAttribute('stroke-width', '2');
        g.appendChild(rect);
        
        let subText = '';
        if (typeTag === 'kanwil') {
            const kppbcCount = Array.isArray(data.children) ? data.children.length : 0;
            subText = `📍 ${kppbcCount} KPPBC`;
        }
        
        // Title Text (Unit Name - Centered vertically & dynamically wrapped)
        const textTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textTitle.setAttribute('x', this.nodeW / 2);
        textTitle.setAttribute('text-anchor', 'middle');
        textTitle.setAttribute('fill', '#0D2137');
        textTitle.setAttribute('font-weight', 'bold');
        textTitle.setAttribute('font-size', '11px');
        
        let namaText = data.nama || data.singkatan || '';
        
        // Multi-line wrapping so unit names are never truncated
        const words = namaText.split(' ');
        const lines = [];
        let currentLine = [];

        words.forEach(word => {
            currentLine.push(word);
            if (currentLine.join(' ').length > 25 && currentLine.length > 1) {
                currentLine.pop();
                lines.push(currentLine.join(' '));
                currentLine = [word];
            }
        });
        if (currentLine.length > 0) {
            lines.push(currentLine.join(' '));
        }

        const lineHeight = 13.5;
        const totalTextHeight = lines.length * lineHeight;
        let startY = (this.nodeH - totalTextHeight) / 2 + 10;
        if (subText) {
            startY = 20;
        }

        lines.forEach((line, index) => {
            const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.setAttribute('x', this.nodeW / 2);
            tspan.setAttribute('y', startY + (index * lineHeight));
            tspan.textContent = line;
            textTitle.appendChild(tspan);
        });

        g.appendChild(textTitle);
        
        // Only draw Subtitle Text if subText exists (Kanwil nodes)
        if (subText) {
            const textSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textSub.setAttribute('x', this.nodeW / 2);
            textSub.setAttribute('y', 48);
            textSub.setAttribute('text-anchor', 'middle');
            textSub.setAttribute('fill', strokeColor);
            textSub.setAttribute('font-size', '9.5px');
            textSub.setAttribute('font-weight', '700');
            textSub.textContent = subText;
            g.appendChild(textSub);
        }
        
        // Click Event Handler -> Open Profile Page/Card or Tenaga Pengkaji Sidebar
        g.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.LandingView && window.LandingView.playBeep) {
                window.LandingView.playBeep('click');
            }
            
            const id = data.id;
            
            // Check if active click challenge handler is set
            if (window.App && typeof window.App.handleChallengeNodeClick === 'function') {
                window.App.handleChallengeNodeClick(id, data);
                return;
            }

            if (id.startsWith('tp-') || typeTag === 'tenaga-pengkaji') {
                // Show Tenaga Pengkaji info sidebar modal directly on org chart view
                window.KnowledgeCardModal.showTenagaPengkaji(data);
                return;
            }
            
            if (id.startsWith('kanwil-')) {
                window.location.hash = `#/kanwil/${id}`;
            } else if (id.startsWith('kppbc-') || id.startsWith('kpu-')) {
                window.location.hash = `#/kppbc/${id}`;
            } else if (id.startsWith('blbc-') || id.startsWith('pso-')) {
                window.location.hash = `#/upt/${id}`;
            } else {
                // Navigate to Kantor Pusat Unit Profile Card (Sekretariat / Direktorat)
                window.location.hash = `#/kantor-pusat/${id}`;
            }
        });
        
        // Layer Routing: Direct node to explicit SVG layer group based on typeTag
        if (typeTag === 'kanwil' || typeTag === 'kpu') {
            this.gLayerKanwil.appendChild(g);
        } else if (typeTag === 'blbc' || typeTag === 'pso') {
            this.gLayerUpt.appendChild(g);
        } else {
            // Eselon II (Sekretariat, Direktorat, Tenaga Pengkaji)
            this.gLayerEselon2.appendChild(g);
        }
    },
    
    drawLink(x1, y1, x2, y2) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midY = (y1 + y2) / 2;
        const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'rgba(245, 166, 35, 0.45)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-dasharray', '4 3');
        this.gLinks.appendChild(path);
    },
    
    setupInteractions() {
        if (!this.svg) return;
        
        // Pan Drag Controls
        this.svg.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX - this.translateX;
            this.startY = e.clientY - this.translateY;
            this.svg.style.cursor = 'grabbing';
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            this.translateX = e.clientX - this.startX;
            this.translateY = e.clientY - this.startY;
            this.updateTransform();
        });
        
        window.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                if (this.svg) this.svg.style.cursor = 'grab';
            }
        });
        
        // Wheel Zoom Control
        this.svg.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 1.1 : 0.9;
            this.scale = Math.max(0.3, Math.min(2.5, this.scale * delta));
            this.updateTransform();
        }, { passive: false });
    },
    
    updateTransform() {
        if (this.gZoom) {
            this.gZoom.setAttribute('transform', `translate(${this.translateX}, ${this.translateY}) scale(${this.scale})`);
        }
    },
    
    centerRoot() {
        const containerW = this.container.clientWidth || 800;
        this.translateX = containerW / 2;
        this.translateY = 80;
        this.scale = 0.85;
        this.updateTransform();
    },
    
    renderToolbar() {
        let toolbar = this.container.querySelector('.org-chart-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.className = 'org-chart-toolbar';
            toolbar.style.cssText = `
                position: absolute;
                bottom: 20px;
                right: 20px;
                display: flex;
                gap: 8px;
                background: rgba(13, 33, 55, 0.95);
                border: 1px solid rgba(245, 166, 35, 0.4);
                padding: 6px 14px;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.4);
                z-index: 50;
            `;
            this.container.appendChild(toolbar);
        }
        
        toolbar.innerHTML = `
            <button class="toolbar-btn" onclick="window.OrgChartView.zoomIn()" style="background: transparent; border: none; color: #fff; font-size: 1.1rem; cursor: pointer; padding: 4px 8px;" title="Zoom In">+</button>
            <button class="toolbar-btn" onclick="window.OrgChartView.zoomOut()" style="background: transparent; border: none; color: #fff; font-size: 1.1rem; cursor: pointer; padding: 4px 8px;" title="Zoom Out">&minus;</button>
            <button class="toolbar-btn" onclick="window.OrgChartView.centerRoot()" style="background: transparent; border: none; color: #F5A623; font-size: 0.9rem; cursor: pointer; padding: 4px 8px; font-weight: 600;" title="Reset Center">🎯 Reset</button>
        `;
    },
    
    zoomIn() {
        this.scale = Math.min(2.5, this.scale * 1.2);
        this.updateTransform();
    },
    
    zoomOut() {
        this.scale = Math.max(0.3, this.scale / 1.2);
        this.updateTransform();
    }
};

if (window.App) {
    window.App.registerView('explorer', window.OrgChartView);
}
