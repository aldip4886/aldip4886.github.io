/**
 * KPPBC & KPU BC Unit Profile View Controller
 * Aligned with PRD v2.0 (2-column split layout matching Kantor Pusat & UPT)
 * Left Column: Interactive 2-Layer SVG Mini Org Tree (gLinks -> gNodes)
 * Right Column: High-contrast Detail Information Panel
 */

window.DetailKppbcView = {
    container: null,
    
    async mount(params) {
        this.container = document.getElementById('detail-kppbc-screen');
        if (!this.container) return;
        
        const id = params.id;
        const isKpu = id.startsWith('kpu-');
        document.getElementById('header-view-title').textContent = isKpu ? "Profil KPU Bea Cukai DJBC" : "Profil KPPBC DJBC";
        
        // Find KPPBC / KPU BC and its parent Kanwil / DJBC Root
        const result = await window.Data.getUnitWithParent(id);
        if (!result) {
            this.container.innerHTML = `
                <div class="error-msg flex flex-col items-center justify-center h-full" style="padding: 40px; text-align: center;">
                    <span style="font-size: 3rem; margin-bottom: 15px;">🔍</span>
                    <h3>Unit Kerja tidak ditemukan</h3>
                    <p style="color:var(--text-muted); margin-top: 5px;">ID unit "${id}" tidak terdaftar dalam basis data.</p>
                    <button class="btn btn-primary" onclick="window.location.hash='#/explorer'" style="margin-top:20px;">
                        Kembali ke Peta Hirarki
                    </button>
                </div>
            `;
            return;
        }
        
        const unit = result.data;
        const parent = result.parent || { nama: 'Direktorat Jenderal Bea dan Cukai', singkatan: 'DJBC', id: 'djbc' };
        
        // Track visit progress
        if (window.ProgressTracker) {
            window.ProgressTracker.trackVisit(unit.id || id);
        }
        
        this.render(unit, parent);
        this.setupDidYouKnow(unit.id || id);
    },
    
    render(unit, parent) {
        const isKpu = unit.id.startsWith('kpu-');
        const backRoute = parent.id === 'djbc' ? '#/explorer' : `#/kanwil/${parent.id}`;
        
        // Eselon Status & Category Badge
        const categoryTag = isKpu ? "KPU Bea Cukai Eselon II" : "Unit Kerja Eselon III";
        const badgeStyle = isKpu 
            ? "background: rgba(5, 150, 105, 0.25); color: #10B981; border: 1px solid #10B981;" 
            : "background: rgba(245, 166, 35, 0.18); color: #F5A623; border: 1px solid #F5A623;";
        const eselonLabel = isKpu ? 'Eselon II' : (unit.eselon_kepala === 'eselon-3b' ? 'Eselon III.b (TMP C)' : 'Eselon III.a (TMP A / TMP B)');
        
        // Format fungsi list
        let fungsiHtml = '';
        if (unit.fungsi) {
            if (Array.isArray(unit.fungsi)) {
                fungsiHtml = `
                    <ul class="fungsi-checklist-list" style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px;">
                        ${unit.fungsi.map(f => `
                            <li style="font-size: 0.825rem; color: #FFFFFF; line-height: 1.45; display: flex; gap: 10px; background: #071527; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
                                <span style="color: #10B981; font-weight: 900; font-size: 0.9rem;">✓</span>
                                <span>${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                `;
            } else {
                fungsiHtml = `<p style="font-size: 0.85rem; line-height: 1.6; color: #FFFFFF; background: #071527; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">${unit.fungsi}</p>`;
            }
        } else {
            fungsiHtml = '<p style="color: rgba(255,255,255,0.7); font-size: 0.825rem; font-style: italic; background: #071527; padding: 12px; border-radius: 8px;">Informasi fungsi kegiatan dapat dirujuk di PMK SOTK Instansi Vertikal Bea dan Cukai.</p>';
        }
        
        this.container.innerHTML = `
            <div class="kppbc-detail-layout" style="padding: 24px; max-width: 1350px; margin: 0 auto; font-family: Inter, sans-serif;">
                <!-- Breadcrumbs & Back Button Header Bar -->
                <div class="detail-header-nav" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 16px; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/explorer'" style="padding: 9px 16px; font-size: 0.875rem; font-weight: 700; background: #071527; border: 1px solid var(--djbc-gold); color: #FFFFFF; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
                        &larr; Kembali ke Peta Hierarki
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0; font-size: 0.875rem; display: flex; align-items: center; gap: 6px;">
                        <a href="#/explorer" class="breadcrumb-item" style="color: #F5A623 !important; text-decoration: none; font-weight: 700; display: inline-block;">Home</a>
                        <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.6) !important; font-size: 0.85rem;">&gt;</span>
                        <a href="${backRoute}" class="breadcrumb-item" style="color: #E2E8F0 !important; text-decoration: none; font-weight: 600; display: inline-block;">${parent.nama || parent.singkatan}</a>
                        <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.6) !important; font-size: 0.85rem;">&gt;</span>
                        <span class="breadcrumb-item active" style="color: #FFFFFF !important; font-weight: 800; display: inline-block;">${unit.nama || unit.singkatan}</span>
                    </div>
                </div>
                
                <div class="detail-split-container flex w-full" style="gap: 24px; align-items: stretch;">
                    <!-- Left Column: Sub-structure SVG Mini Tree (Compact 360px Width) -->
                    <div class="kppbc-mini-tree-panel flex flex-col" style="width: 360px; flex-shrink: 0; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
                        <div class="mini-tree-header" style="font-weight: 800; color: var(--djbc-gold); font-size: 1.05rem; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.12); letter-spacing: 0.3px;">
                            📊 SUB-STRUKTUR INTERNAL (${unit.singkatan || 'KPPBC'})
                        </div>
                        <div id="kppbc-mini-tree-canvas" class="flex-1" style="min-height: 420px; width: 100%;"></div>
                    </div>
                    
                    <!-- Right Column: Detail Information Panel (Expanded Main Area) -->
                    <div class="kppbc-info-panel flex-1" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 26px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); display: flex; flex-direction: column; gap: 22px; overflow-y: auto;">
                        <!-- Header & Badge -->
                        <div class="info-card-header" style="border-bottom: 2px solid var(--djbc-gold); padding-bottom: 14px;">
                            <span class="badge" style="${badgeStyle} padding: 5px 12px; border-radius: 6px; font-size: 0.775rem; font-weight: 800; display: inline-block; margin-bottom: 8px; letter-spacing: 0.5px;">${categoryTag}</span>
                            <h3 class="info-unit-title" style="margin: 0; color: #FFFFFF; font-size: 1.35rem; font-weight: 800; line-height: 1.35; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${unit.nama}</h3>
                        </div>
                        
                        <!-- Leadership & Parent Meta -->
                        <div class="info-section">
                            <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Kedudukan & Jabatan Pimpinan</h4>
                            <div style="background: #071527; padding: 12px 14px; border-radius: 10px; border-left: 4px solid var(--djbc-gold); display: flex; flex-direction: column; gap: 6px;">
                                <p style="margin: 0; color: #FFFFFF; font-size: 0.925rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                    <span>👑</span> <span>${unit.jabatan_pimpinan || 'Kepala Kantor'}</span>
                                </p>
                                <p style="margin: 0; color: #FFFFFF; font-size: 0.825rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span>🏢</span> <span>Kantor Pembina: ${parent.nama}</span>
                                </p>
                                <p style="margin: 0; color: #FFFFFF; font-size: 0.825rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span>💼</span> <span>Klasifikasi Eselonisasi: ${eselonLabel}</span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Duty -->
                        <div class="info-section">
                            <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Tugas Utama</h4>
                            <p class="section-body-detail" style="margin: 0; color: #FFFFFF; font-size: 0.875rem; line-height: 1.55; background: #071527; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); font-weight: 500;">
                                ${unit.tugas || 'Melaksanakan pengawasan dan pelayanan di bidang kepabeanan dan cukai berdasarkan peraturan perundang-undangan.'}
                            </p>
                        </div>
                        
                        <!-- Functions -->
                        <div class="info-section">
                            <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Fungsi Pelaksanaan Tugas</h4>
                            ${fungsiHtml}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        `;
        
        // Render Mini SVG Org Tree
        this.renderMiniTree(unit);
    },
    
    renderMiniTree(unit) {
        const canvas = document.getElementById('kppbc-mini-tree-canvas');
        if (!canvas) return;
        
        const children = unit.children || [];
        const width = canvas.clientWidth || 310;
        const height = Math.max(420, children.length * 68 + 110);
        
        // Setup SVG for subtree with explicit 2-layer ordering (gLinks -> gNodes)
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', height);
        
        const gLinks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gLinks.setAttribute('class', 'mini-tree-links');
        
        const gNodes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gNodes.setAttribute('class', 'mini-tree-nodes');
        
        svg.appendChild(gLinks);
        svg.appendChild(gNodes);
        canvas.appendChild(svg);
        
        // Draw parent (centered top)
        const parentW = 240;
        const parentH = 50;
        const pX = width / 2;
        const pY = 40;
        
        // Draw parent node
        const pG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        pG.setAttribute('class', 'mini-tree-node mini-tree-parent-node');
        pG.setAttribute('transform', `translate(${pX - parentW/2}, ${pY - parentH/2})`);
        
        const pRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        pRect.setAttribute('width', parentW);
        pRect.setAttribute('height', parentH);
        pRect.setAttribute('rx', 8);
        pRect.setAttribute('fill', '#071527');
        pRect.setAttribute('stroke', 'var(--djbc-gold)');
        pRect.setAttribute('stroke-width', '2.5');
        pG.appendChild(pRect);
        
        const pText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        pText.setAttribute('x', parentW/2);
        pText.setAttribute('y', 30);
        pText.setAttribute('text-anchor', 'middle');
        pText.setAttribute('fill', 'var(--djbc-gold)');
        pText.setAttribute('font-size', '0.8rem');
        pText.setAttribute('font-weight', '800');
        
        let pTitle = unit.singkatan || unit.nama;
        if (pTitle.length > 30) pTitle = pTitle.substring(0, 28) + '...';
        pText.textContent = pTitle;
        pG.appendChild(pText);
        gNodes.appendChild(pG);
        
        // Draw children (vertical list aligned under parent)
        const childW = 270;
        const childH = 52;
        const startY = 125;
        const spacingY = 66;
        
        let lastY = pY + parentH / 2;
        
        children.forEach((child, idx) => {
            const cX = width / 2;
            const cY = startY + (idx * spacingY);
            
            // Draw connector link line in bottom layer (gLinks) spanning only the vertical gap
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${cX} ${lastY} L ${cX} ${cY - childH/2}`;
            line.setAttribute('d', d);
            line.setAttribute('fill', 'none');
            line.setAttribute('stroke', 'rgba(245, 166, 35, 0.45)');
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
            cRect.setAttribute('rx', 8);
            cRect.setAttribute('fill', '#FFFFFF');
            cRect.setAttribute('stroke', '#008080');
            cRect.setAttribute('stroke-width', '2');
            
            // Hover effect
            cG.addEventListener('mouseover', () => {
                cRect.setAttribute('fill', '#F0FDF4');
                cRect.setAttribute('stroke', '#F5A623');
            });
            cG.addEventListener('mouseout', () => {
                cRect.setAttribute('fill', '#FFFFFF');
                cRect.setAttribute('stroke', '#008080');
            });
            cG.appendChild(cRect);
            
            // Text object wrapper
            const cForeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            cForeign.setAttribute('width', childW - 20);
            cForeign.setAttribute('height', childH - 8);
            cForeign.setAttribute('x', 10);
            cForeign.setAttribute('y', 4);
            
            const cDiv = document.createElement('div');
            cDiv.style.width = '100%';
            cDiv.style.height = '100%';
            cDiv.style.display = 'flex';
            cDiv.style.alignItems = 'center';
            cDiv.style.justifyContent = 'center';
            cDiv.style.textAlign = 'center';
            cDiv.style.fontSize = '0.75rem';
            cDiv.style.fontWeight = '800';
            cDiv.style.color = '#0D2137';
            cDiv.style.lineHeight = '1.25';
            cDiv.textContent = child.nama;
            
            cForeign.appendChild(cDiv);
            cG.appendChild(cForeign);
            
            // Event listener for sub-unit click
            cG.addEventListener('click', () => {
                if (window.LandingView && window.LandingView.playBeep) {
                    window.LandingView.playBeep('click');
                }
                
                // Show modal overlay for sub-unit Seksi
                if (window.KnowledgeCardModal) {
                    window.KnowledgeCardModal.showCustomSubunit(child, unit.singkatan || unit.nama);
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
            const fact = dykData[unitId] || dykData['kppbc-banda-aceh'] || dykData['kanwil'];
            dykText.textContent = fact;
            dykBar.classList.remove('hidden');
        } catch(e) {
            dykBar.classList.add('hidden');
        }
    }
};

// Register View
if (window.App) {
    window.App.registerView('detail-kppbc', window.DetailKppbcView);
}
