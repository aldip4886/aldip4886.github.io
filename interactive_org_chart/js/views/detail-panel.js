/**
 * Kantor Pusat Unit Detail Controller (Sekretariat, Direktorat & Tenaga Pengkaji)
 * Aligned with PRD v2.0 & User Request for high-contrast, proportional font styling
 */

window.DetailPanel = {
    container: null,
    
    async mount(params) {
        const unitId = params.id;
        this.container = document.getElementById('detail-kanpus-screen');
        if (!this.container) return;
        
        // Fetch unit details from Data layer
        let unitData;
        try {
            unitData = await window.Data.getKantorPusatUnit(unitId);
            if (!unitData) {
                this.container.innerHTML = `
                    <div style="padding: 40px; text-align: center;">
                        <div class="error-msg" style="margin-bottom: 20px; color: #ef4444; font-weight: 700;">Unit Kantor Pusat [${unitId}] tidak ditemukan.</div>
                        <button class="btn btn-secondary" onclick="window.location.hash='#/explorer'" style="padding: 10px 20px;">&larr; Kembali ke Peta Hirarki</button>
                    </div>
                `;
                return;
            }
        } catch (e) {
            this.container.innerHTML = `<div class="error-msg" style="color: #ef4444; font-weight: 700;">Gagal memuat data detail unit Kantor Pusat.</div>`;
            return;
        }
        
        // Tenaga Pengkaji full profile page removed -> redirect to org chart explorer & open sidebar panel
        if (unitId.startsWith('tp-')) {
            window.location.hash = '#/explorer';
            setTimeout(() => {
                if (window.KnowledgeCardModal) {
                    window.KnowledgeCardModal.showTenagaPengkaji(unitData);
                }
            }, 250);
            return;
        }
        
        // Category Label Tag & Theme Colors
        let categoryTag = "Direktorat Eselon II";
        let badgeStyle = "background: rgba(245, 166, 35, 0.18); color: #F5A623; border: 1px solid #F5A623;";
        if (unitId === 'setditjen') {
            categoryTag = "Sekretariat DJBC";
            badgeStyle = "background: rgba(0, 128, 128, 0.25); color: #00E5E5; border: 1px solid #00E5E5;";
        } else if (unitId.startsWith('tp-')) {
            categoryTag = "Tenaga Pengkaji Eselon II";
            badgeStyle = "background: rgba(139, 92, 246, 0.25); color: #C084FC; border: 1px solid #C084FC;";
        }
        
        // Update header title
        document.getElementById('header-view-title').textContent = `Profil ${categoryTag}: ${unitData.nama}`;
        
        // Render structure layout
        this.renderLayout(unitData, categoryTag, badgeStyle);
        
        // Track visit progress
        if (window.ProgressTracker) {
            window.ProgressTracker.trackVisit(unitId);
        }
        
        // Load Did You Know bar
        this.setupDidYouKnow(unitId);
    },
    
    renderLayout(unit, categoryTag, badgeStyle) {
        this.container.innerHTML = `
            <div class="detail-kanpus-layout" style="padding: 24px; max-width: 1350px; margin: 0 auto; font-family: Inter, sans-serif;">
                <!-- Breadcrumbs & Back Button -->
                <div class="detail-header-nav" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 16px;">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/explorer'" style="padding: 10px 18px; font-size: 0.875rem; font-weight: 700; background: #0D2137; border: 1px solid var(--djbc-gold); color: #FFFFFF; border-radius: 10px; cursor: pointer; transition: all 0.2s ease;">
                        &larr; Kembali ke Peta Hirarki
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0; font-size: 0.875rem;">
                        <a href="#/explorer" class="breadcrumb-item" style="color: var(--djbc-gold); text-decoration: none; font-weight: 600;">Peta Hirarki</a>
                        <span class="breadcrumb-separator" style="margin: 0 8px; color: rgba(255,255,255,0.4);">&gt;</span>
                        <span class="breadcrumb-item" style="color: rgba(255,255,255,0.8); font-weight: 600;">Kantor Pusat</span>
                        <span class="breadcrumb-separator" style="margin: 0 8px; color: rgba(255,255,255,0.4);">&gt;</span>
                        <span class="breadcrumb-item active" style="color: #FFFFFF; font-weight: 700;">${unit.singkatan || unit.nama}</span>
                    </div>
                </div>
                
                <div class="detail-split-container flex w-full" style="gap: 24px; align-items: stretch;">
                    <!-- Left Column: Sub-structure Tree / Info Box -->
                    <div class="detail-mini-tree-panel flex-1 flex flex-col" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
                        <div class="mini-tree-header" style="font-weight: 800; color: var(--djbc-gold); font-size: 1.05rem; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.12); letter-spacing: 0.3px;">
                            ${unit.children && unit.children.length > 0 ? 'SUB-STRUKTUR ORGANISASI (UNIT ESELON III)' : 'INFORMASI STAF AHLI & PENGKAJIAN STRATEGIS'}
                        </div>
                        <div id="mini-org-tree-canvas" class="flex-1" style="min-height: 440px; width: 100%;"></div>
                    </div>
                    
                    <!-- Right Column: Detail Information Panel -->
                    <div class="detail-info-panel" style="width: 540px; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-radius: 16px; padding: 26px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); display: flex; flex-direction: column; gap: 22px;">
                        <!-- Header & Badge -->
                        <div class="info-card-header" style="border-bottom: 2px solid var(--djbc-gold); padding-bottom: 14px;">
                            <span class="badge" style="${badgeStyle} padding: 5px 12px; border-radius: 6px; font-size: 0.775rem; font-weight: 800; display: inline-block; margin-bottom: 8px; letter-spacing: 0.5px;">${categoryTag}</span>
                            <h3 class="info-unit-title" style="margin: 0; color: #FFFFFF; font-size: 1.35rem; font-weight: 800; line-height: 1.35; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${unit.nama}</h3>
                        </div>
                        
                        <!-- Leadership & Legal Base -->
                        <div class="info-section">
                            <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Jabatan Pimpinan & Dasar Hukum</h4>
                            <div style="background: #071527; padding: 12px 14px; border-radius: 10px; border-left: 4px solid var(--djbc-gold);">
                                <p style="margin: 0 0 6px 0; color: #FFFFFF; font-size: 0.925rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                    <span>👑</span> <span>${unit.jabatan_pimpinan || 'Pimpinan Eselon II'}</span>
                                </p>
                                <p style="margin: 0; color: #FFFFFF; font-size: 0.825rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span>⚖️</span> <span style="color: #FFFFFF;">Dasar Hukum: ${unit.dasar_hukum || 'PMK Nomor 124 Tahun 2024'}</span>
                                </p>
                            </div>
                        </div>
                        
                        <!-- Duty -->
                        <div class="info-section">
                            <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Tugas Utama</h4>
                            <p class="section-body-detail" style="margin: 0; color: #FFFFFF; font-size: 0.875rem; line-height: 1.55; background: #071527; padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); font-weight: 500;">
                                ${unit.tugas || 'Melaksanakan perumusan dan pelaksanaan kebijakan teknis di bidang kepabeanan dan cukai.'}
                            </p>
                        </div>
                        
                        <!-- Functions -->
                        <div class="info-section">
                            <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Rincian Fungsi Kerja</h4>
                            <ul class="fungsi-checklist-list" style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
                                ${Array.isArray(unit.fungsi) && unit.fungsi.length > 0 
                                    ? unit.fungsi.map(f => `
                                        <li style="font-size: 0.825rem; color: #FFFFFF; line-height: 1.45; display: flex; gap: 10px; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                                            <span style="color: #10B981; font-weight: 900; font-size: 0.9rem;">✓</span> 
                                            <span style="color: #FFFFFF; font-weight: 500;">${f}</span>
                                        </li>
                                    `).join('')
                                    : (typeof unit.fungsi === 'string' 
                                        ? `<li style="font-size: 0.825rem; color: #FFFFFF; line-height: 1.45; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px;"><span style="color: #10B981; font-weight: 900;">✓</span> ${unit.fungsi}</li>`
                                        : `<li style="font-size: 0.825rem; color: #FFFFFF; line-height: 1.45;"><span style="color: #10B981; font-weight: 900;">✓</span> Melaksanakan perumusan dan koordinasi pelaksanaan tugas teknis.</li>`
                                      )
                                }
                            </ul>
                        </div>
                        
                        <!-- Output Grid -->
                        <div class="info-section">
                            <h4 class="section-heading-detail" style="color: var(--djbc-gold); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.6px; margin: 0 0 8px 0;">Output Utama Pekerjaan</h4>
                            <div class="output-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                <div class="output-card" style="background: #071527; padding: 10px 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(245, 166, 35, 0.25);">
                                    <span style="font-size: 1.25rem;">📝</span>
                                    <span style="font-size: 0.8rem; color: #FFFFFF; font-weight: 700;">Peraturan & Kebijakan</span>
                                </div>
                                <div class="output-card" style="background: #071527; padding: 10px 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(245, 166, 35, 0.25);">
                                    <span style="font-size: 1.25rem;">📈</span>
                                    <span style="font-size: 0.8rem; color: #FFFFFF; font-weight: 700;">Laporan Kinerja & Evaluasi</span>
                                </div>
                                <div class="output-card" style="background: #071527; padding: 10px 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(245, 166, 35, 0.25);">
                                    <span style="font-size: 1.25rem;">🤝</span>
                                    <span style="font-size: 0.8rem; color: #FFFFFF; font-weight: 700;">Bimbingan & Supervisi</span>
                                </div>
                                <div class="output-card" style="background: #071527; padding: 10px 12px; border-radius: 8px; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(245, 166, 35, 0.25);">
                                    <span style="font-size: 1.25rem;">🎯</span>
                                    <span style="font-size: 0.8rem; color: #FFFFFF; font-weight: 700;">Rekomendasi Strategis</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Render the Mini Tree SVG or Expert Advisor Card
        this.renderMiniTree(unit);
    },
    
    renderMiniTree(unit) {
        const canvas = document.getElementById('mini-org-tree-canvas');
        if (!canvas) return;
        
        const children = unit.children || [];
        
        // Special render for Tenaga Pengkaji (No sub-units, display strategic assessment card)
        if (children.length === 0) {
            canvas.innerHTML = `
                <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 28px; background: rgba(139, 92, 246, 0.08); border: 1px dashed rgba(192, 132, 252, 0.5); border-radius: 14px;">
                    <div style="font-size: 3rem; margin-bottom: 14px;">🎓</div>
                    <h4 style="color: var(--djbc-gold); font-size: 1.15rem; margin: 0 0 10px 0; font-weight: 800;">JABATAN FUNGSIONAL STAF AHLI PENGKAJI</h4>
                    <p style="color: #FFFFFF; font-size: 0.875rem; max-width: 380px; line-height: 1.6; margin: 0 0 20px 0; font-weight: 500;">
                        ${unit.nama} bertindak secara independen memberikan masukan konsepsional, penalaran mendalam, dan rekomendasi pemecahan masalah langsung kepada Direktur Jenderal Bea dan Cukai.
                    </p>
                    <div style="background: #071527; padding: 14px 18px; border-radius: 10px; border: 1px solid rgba(245, 166, 35, 0.3); width: 100%; max-width: 360px; text-align: left;">
                        <div style="font-size: 0.8rem; color: var(--djbc-gold); font-weight: 800; margin-bottom: 8px; letter-spacing: 0.5px;">💡 FOKUS PENGKAJIAN STRATEGIS:</div>
                        <div style="font-size: 0.825rem; color: #FFFFFF; font-weight: 600; margin-bottom: 6px;">• Analisis Isu Strategis Kebijakan Kepabeanan</div>
                        <div style="font-size: 0.825rem; color: #FFFFFF; font-weight: 600; margin-bottom: 6px;">• Formulasi Solusi Konsepsional Berbasis Riset</div>
                        <div style="font-size: 0.825rem; color: #FFFFFF; font-weight: 600;">• Telaah Keahlian Khusus Bidang Terkait</div>
                    </div>
                </div>
            `;
            return;
        }
        
        const width = canvas.clientWidth || 520;
        const height = Math.max(440, children.length * 68 + 110);
        
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
        const parentW = 300;
        const parentH = 54;
        const pX = width / 2;
        const pY = 42;
        
        // Draw parent node
        const pG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        pG.setAttribute('class', 'mini-tree-node mini-tree-parent-node');
        pG.setAttribute('transform', `translate(${pX - parentW/2}, ${pY - parentH/2})`);
        
        const pRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        pRect.setAttribute('width', parentW);
        pRect.setAttribute('height', parentH);
        pRect.setAttribute('rx', 10);
        pRect.setAttribute('fill', '#071527');
        pRect.setAttribute('stroke', 'var(--djbc-gold)');
        pRect.setAttribute('stroke-width', '2.5');
        pG.appendChild(pRect);
        
        const pText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        pText.setAttribute('x', parentW/2);
        pText.setAttribute('y', 32);
        pText.setAttribute('text-anchor', 'middle');
        pText.setAttribute('fill', 'var(--djbc-gold)');
        pText.setAttribute('font-size', '0.875rem');
        pText.setAttribute('font-weight', '800');
        
        let pTitle = unit.singkatan || unit.nama;
        if (pTitle.length > 34) pTitle = pTitle.substring(0, 32) + '...';
        pText.textContent = pTitle;
        pG.appendChild(pText);
        gNodes.appendChild(pG);
        
        // Draw children (vertical list aligned under parent)
        const childW = 340;
        const childH = 50;
        const startY = 125;
        const spacingY = 64;
        
        let lastY = pY + parentH / 2;
        
        children.forEach((child, idx) => {
            const cX = width / 2;
            const cY = startY + (idx * spacingY);
            
            // Draw connector link line in bottom layer (gLinks) spanning only the vertical gap
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${cX} ${lastY} L ${cX} ${cY - childH/2}`;
            line.setAttribute('d', d);
            line.setAttribute('fill', 'none');
            line.setAttribute('stroke', 'rgba(245, 166, 35, 0.5)');
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
            cDiv.style.fontSize = '0.775rem';
            cDiv.style.fontWeight = '800';
            cDiv.style.color = '#0D2137';
            cDiv.style.lineHeight = '1.25';
            cDiv.textContent = child.nama;
            
            cForeign.appendChild(cDiv);
            cG.appendChild(cForeign);
            
            // Event listener for sub-unit Eselon III click
            cG.addEventListener('click', () => {
                if (window.LandingView && window.LandingView.playBeep) {
                    window.LandingView.playBeep('click');
                }
                
                // Navigate to dedicated Eselon III profile page
                window.location.hash = `#/eselon-3/${unit.id}/${child.id}`;
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
    window.App.registerView('detail-kanpus', window.DetailPanel);
}
