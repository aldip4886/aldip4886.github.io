/**
 * UPT (BLBC / PSO) Detail View Controller
 * Aligned with PRD v2.0 (Dasar hukum, pembina chips, satpel lists)
 */

window.DetailUptView = {
    container: null,
    
    async mount(params) {
        const uptId = params.id;
        this.container = document.getElementById('detail-upt-screen');
        if (!this.container) return;
        
        // Fetch unit details from Data layer
        let unitData;
        try {
            unitData = await window.Data.getUptUnit(uptId);
            if (!unitData) {
                this.container.innerHTML = `<div class="error-msg">Unit Pelaksana Teknis tidak ditemukan.</div>`;
                return;
            }
        } catch (e) {
            this.container.innerHTML = `<div class="error-msg">Gagal memuat data detail UPT.</div>`;
            return;
        }
        
        // Update header title
        document.getElementById('header-view-title').textContent = `Detail UPT: ${unitData.nama}`;
        
        // Render structure layout
        this.renderLayout(unitData);
        
        // Track visit progress
        if (window.ProgressTracker) {
            window.ProgressTracker.trackVisit(uptId);
        }
        
        // Load Did You Know bar
        this.setupDidYouKnow(uptId.startsWith('blbc-') ? 'blbc' : 'pso');
    },
    
    renderLayout(unit) {
        const isBlbc = unit.id.startsWith('blbc-');
        
        // Resolve pembina names
        const pembinaTeknisName = isBlbc ? 'Dit. Teknis Kepabeanan' : 'Dit. Penindakan & Penyidikan';
        
        this.container.innerHTML = `
            <div class="upt-detail-layout animate-fade-up">
                <!-- Breadcrumbs & Back Button -->
                <div class="detail-header-nav" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--spacing-md);">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/peta-sebaran'" style="padding: var(--spacing-sm) var(--spacing-md); font-size: 0.8rem; display: flex; align-items: center; gap: 6px;">
                        &larr; Kembali ke Peta
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0;">
                        <a href="#/peta-sebaran" class="breadcrumb-item" style="font-size: 0.75rem; color: var(--text-muted);">Peta Sebaran</a>
                        <span class="breadcrumb-separator" style="margin: 0 4px; color: var(--text-muted); font-size: 0.75rem;">&gt;</span>
                        <span class="breadcrumb-item" style="font-size: 0.75rem; color: var(--text-muted);">UPT DJBC</span>
                        <span class="breadcrumb-separator" style="margin: 0 4px; color: var(--text-muted); font-size: 0.75rem;">&gt;</span>
                        <span class="breadcrumb-item active" style="font-size: 0.75rem; font-weight: 700; color: var(--djbc-blue-dark);">${unit.singkatan}</span>
                    </div>
                </div>
                
                <div class="upt-split flex w-full" style="gap: var(--spacing-lg);">
                    <!-- Left Column: Struktur Organisasi UPT (Compact Width) -->
                    <div class="upt-mini-tree-panel flex flex-col" style="width: 360px; flex-shrink: 0; background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: 0 4px 12px rgba(0,0,0,0.02); padding: var(--spacing-lg); overflow: hidden;">
                        <div class="mini-tree-header" style="font-weight: 700; font-size: 0.95rem; color: var(--djbc-blue-dark); border-bottom: 2px solid var(--djbc-gold); padding-bottom: 8px; margin-bottom: var(--spacing-md); display: flex; align-items: center; gap: var(--spacing-xs);">
                            <span>📊</span> Sub-struktur Internal (${unit.singkatan})
                        </div>
                        <div id="upt-mini-tree-canvas" class="flex-1" style="min-height: 380px;"></div>
                    </div>
                    
                    <!-- Right Column: Detail Information Panel (Expanded Main Area) -->
                    <div class="upt-info-panel flex-1" style="background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: 0 4px 12px rgba(0,0,0,0.02); padding: var(--spacing-lg); display: flex; flex-direction: column; overflow-y: auto; gap: var(--spacing-lg);">
                        <div class="info-card-header flex items-center justify-between" style="border-bottom: 2px solid var(--djbc-gold); padding-bottom: 8px;">
                            <h3 class="info-unit-title" style="font-size: 1.15rem; font-weight: 800; color: var(--djbc-blue-dark); margin: 0;">${unit.nama}</h3>
                            <span class="badge badge-upt" style="font-size: 0.65rem;">UPT DJBC</span>
                        </div>
                        
                        <div>
                            <h4 class="section-heading-detail" style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark); margin-bottom: var(--spacing-xs); text-transform: uppercase; letter-spacing: 0.5px;">Tugas Utama</h4>
                            <div class="mandate-text-box" style="font-size: 0.85rem; line-height: 1.55;">
                                ${unit.tugas}
                            </div>
                            <div class="dasar-hukum-box" style="margin-top: var(--spacing-sm); font-size: 0.725rem;">
                                📜 Dasar Hukum: <strong>${unit.dasar_hukum}</strong>
                            </div>
                        </div>
                        
                        <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);">
                            <div>
                                <h4 class="section-heading-detail" style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark); margin-bottom: var(--spacing-xs); text-transform: uppercase; letter-spacing: 0.5px;">Pembina Teknis</h4>
                                <a href="#/kantor-pusat/${unit.pembina_teknis}" class="interaksi-chip flex items-center" style="margin-top: 4px; font-size: 0.75rem; text-decoration: none; padding: var(--spacing-xs) var(--spacing-sm); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--djbc-blue-light); background: rgba(24,144,255,0.02); transition: all 0.2s ease;">
                                    ⚙️ ${pembinaTeknisName}
                                </a>
                            </div>
                            <div>
                                <h4 class="section-heading-detail" style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark); margin-bottom: var(--spacing-xs); text-transform: uppercase; letter-spacing: 0.5px;">Pembina Admin</h4>
                                <a href="#/kanwil/${unit.pembina_adm}" class="interaksi-chip flex items-center" style="margin-top: 4px; font-size: 0.75rem; text-decoration: none; padding: var(--spacing-xs) var(--spacing-sm); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--djbc-blue-light); background: rgba(24,144,255,0.02); transition: all 0.2s ease;">
                                    🏢 Kanwil Pembina
                                </a>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="section-heading-detail" style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark); margin-bottom: var(--spacing-xs); text-transform: uppercase; letter-spacing: 0.5px;">Fungsi Kerja</h4>
                            <ul class="fungsi-checklist-premium" style="margin-top: 8px;">
                                ${unit.fungsi.map(f => `<li>${f}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="section-heading-detail" style="font-size: 0.8rem; font-weight: 700; color: var(--text-dark); margin-bottom: var(--spacing-xs); text-transform: uppercase; letter-spacing: 0.5px;">${isBlbc ? 'Satuan Pelayanan Laboratorium' : 'Wilayah Kerja Subpangkalan'}</h4>
                            <div class="satpel-container" style="margin-top: var(--spacing-xs);">
                                ${(isBlbc ? unit.satuan_pelayanan : (unit.subpangkalan || [])).map(s => `
                                    <div class="satpel-chip" style="font-size: 0.725rem; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg-page);">
                                        📍 ${s}
                                    </div>
                                `).join('')}
                                ${(!isBlbc && (!unit.subpangkalan || unit.subpangkalan.length === 0)) ? '<div style="color: var(--text-muted); font-size: 0.75rem; font-style: italic;">Tidak memiliki subpangkalan satelit. Operasi berpusat penuh di pangkalan utama.</div>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Render Mini Tree for UPT
        this.renderMiniTree(unit);
    },
    
    renderMiniTree(unit) {
        const canvas = document.getElementById('upt-mini-tree-canvas');
        if (!canvas) return;
        
        const width = canvas.clientWidth || 400;
        const height = canvas.clientHeight || 450;
        
        // Setup SVG with explicit 2-layer ordering (gLinks -> gNodes)
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        
        const gLinks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gLinks.setAttribute('class', 'mini-tree-links');
        
        const gNodes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gNodes.setAttribute('class', 'mini-tree-nodes');
        
        svg.appendChild(gLinks);
        svg.appendChild(gNodes);
        canvas.appendChild(svg);
        
        // Draw parent (centered top)
        const parentW = 200;
        const parentH = 50;
        const pX = width / 2;
        const pY = 40;
        
        const pG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        pG.setAttribute('class', 'mini-tree-node mini-tree-parent-node');
        pG.setAttribute('transform', `translate(${pX - parentW/2}, ${pY - parentH/2})`);
        
        const pRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        pRect.setAttribute('width', parentW);
        pRect.setAttribute('height', parentH);
        pRect.setAttribute('rx', 6);
        pRect.setAttribute('fill', 'var(--color-upt)');
        pRect.setAttribute('stroke', 'var(--djbc-gold)');
        pRect.setAttribute('stroke-width', '1.5');
        pG.appendChild(pRect);
        
        const pText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        pText.setAttribute('x', parentW/2);
        pText.setAttribute('y', 29);
        pText.setAttribute('text-anchor', 'middle');
        pText.setAttribute('fill', 'var(--text-white)');
        pText.setAttribute('font-size', '0.75rem');
        pText.setAttribute('font-weight', '700');
        pText.textContent = unit.singkatan;
        pG.appendChild(pText);
        gNodes.appendChild(pG);
        
        // Draw children (vertical list aligned under parent)
        const children = unit.children || [];
        const childW = 240;
        const childH = 55;
        const startY = 120;
        const spacingY = 65;
        
        let lastY = pY + parentH / 2;
        
        children.forEach((child, idx) => {
            const cX = width / 2;
            const cY = startY + (idx * spacingY);
            
            // Draw connector link line in bottom layer (gLinks) spanning only the vertical gap
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${cX} ${lastY} L ${cX} ${cY - childH/2}`;
            line.setAttribute('d', d);
            line.setAttribute('fill', 'none');
            line.setAttribute('stroke', 'rgba(124, 58, 237, 0.4)');
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('stroke-dasharray', '3 3');
            gLinks.appendChild(line);
            
            // Update lastY to current child node bottom
            lastY = cY + childH / 2;
            
            // Draw child node in top layer (gNodes)
            const cG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            cG.setAttribute('class', 'mini-tree-node mini-tree-child-node');
            cG.setAttribute('transform', `translate(${cX - childW/2}, ${cY - childH/2})`);
            cG.style.cursor = 'pointer';
            
            const cRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            cRect.setAttribute('width', childW);
            cRect.setAttribute('height', childH);
            cRect.setAttribute('rx', 6);
            cRect.setAttribute('fill', 'var(--bg-white)');
            cRect.setAttribute('stroke', 'var(--border)');
            cRect.setAttribute('stroke-width', '1.5');
            
            // Hover effect
            cG.addEventListener('mouseover', () => {
                cRect.setAttribute('fill', 'rgba(124, 58, 237, 0.08)');
                cRect.setAttribute('stroke', 'var(--color-upt)');
            });
            cG.addEventListener('mouseout', () => {
                cRect.setAttribute('fill', 'var(--bg-white)');
                cRect.setAttribute('stroke', 'var(--border)');
            });
            cG.appendChild(cRect);
            
            // Text object wrapper
            const cForeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            cForeign.setAttribute('width', childW - 20);
            cForeign.setAttribute('height', childH - 10);
            cForeign.setAttribute('x', 10);
            cForeign.setAttribute('y', 5);
            
            const cDiv = document.createElement('div');
            cDiv.style.width = '100%';
            cDiv.style.height = '100%';
            cDiv.style.display = 'flex';
            cDiv.style.alignItems = 'center';
            cDiv.style.justifyContent = 'center';
            cDiv.style.textAlign = 'center';
            cDiv.style.fontSize = '0.68rem';
            cDiv.style.fontWeight = '600';
            cDiv.style.color = 'var(--text-dark)';
            cDiv.style.lineHeight = '1.25';
            cDiv.textContent = child.nama;
            
            cForeign.appendChild(cDiv);
            cG.appendChild(cForeign);
            
            // Event listener for sub-unit click
            cG.addEventListener('click', () => {
                if (window.LandingView && window.LandingView.playBeep) {
                    window.LandingView.playBeep('click');
                }
                
                // Show modal overlay for sub-unit
                const modal = document.getElementById('knowledge-card-modal');
                if (modal && window.KnowledgeCardModal) {
                    window.KnowledgeCardModal.showCustomSubunit(child, unit.singkatan);
                }
            });
            
            gNodes.appendChild(cG);
        });
    },
    
    async setupDidYouKnow(unitId) {
        const dykBar = document.getElementById('did-you-know-bar');
        const dykText = document.getElementById('dyk-text-content');
        if (!dykBar || !dykText) return;
        
        try {
            const dykData = await window.Data.load('did-you-know');
            const fact = dykData[unitId] || dykData['blbc'];
            dykText.textContent = fact;
            dykBar.classList.remove('hidden');
        } catch(e) {
            dykBar.classList.add('hidden');
        }
    }
};

// Register View
if (window.App) {
    window.App.registerView('detail-upt', window.DetailUptView);
}
