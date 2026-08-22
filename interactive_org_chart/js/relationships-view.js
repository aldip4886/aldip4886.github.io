/**
 * relationships-view.js — Interactive Flat Network Diagram & Interdependensi Explorer.
 * Immersive flat SVG network diagram with connected nodes, animated interactive lines,
 * category filters, hover tooltips, and seamless Side Panel drawer integration for all 36 interactions.
 * Bottom card removed per user request: all interaction and unit details open directly in the Side Panel.
 */

export class RelationshipsViewEngine {
  constructor(containerEl, relationshipsData, unitsDict, onNavigateUnit, onSelectRelationship) {
    this.container = containerEl;
    this.relationships = relationshipsData || [];
    this.unitsDict = unitsDict || {};
    this.onNavigateUnit = onNavigateUnit || (() => {});
    this.onSelectRelationship = onSelectRelationship || (() => {});
    this.selectedCategory = 'all';
    this.selectedNodeId = null;
    this.selectedEdgeId = null;
    this.zoomLevel = 1.0;

    // Node metadata and flat coordinate definitions across 5 tiers
    this.nodesMap = {
      'setditjen': { id: 'setditjen', name: 'Setditjen', full: 'Sekretariat Direktorat Jenderal', icon: '🏛️', tier: 'pusat', cat: 'pembinaan', x: 90, y: 75, color: '#0B3A6F' },
      'dit-ki': { id: 'dit-ki', name: 'Dit. KI', full: 'Direktorat Kepatuhan Internal', icon: '🛡️', tier: 'pusat', cat: 'pengawasan', x: 220, y: 75, color: '#DC2626' },
      'dit-teknis-kepab': { id: 'dit-teknis-kepab', name: 'Dit. Teknis', full: 'Direktorat Teknis Kepabeanan', icon: '🚢', tier: 'pusat', cat: 'pelayanan', x: 365, y: 75, color: '#0284C7' },
      'dit-fasilitas-kepab': { id: 'dit-fasilitas-kepab', name: 'Dit. Fasilitas', full: 'Direktorat Fasilitas Kepabeanan', icon: '🏭', tier: 'pusat', cat: 'pelayanan', x: 510, y: 75, color: '#059669' },
      'dit-tfc': { id: 'dit-tfc', name: 'Dit. Cukai', full: 'Direktorat Teknis & Fasilitas Cukai', icon: '🏷️', tier: 'pusat', cat: 'pelayanan', x: 655, y: 75, color: '#D97706' },
      'dit-p2': { id: 'dit-p2', name: 'Dit. P2', full: 'Direktorat Penindakan dan Penyidikan', icon: '⚔️', tier: 'pusat', cat: 'pengawasan', x: 800, y: 75, color: '#991B1B' },
      'dit-interdiksi': { id: 'dit-interdiksi', name: 'Dit. Interdiksi', full: 'Direktorat Interdiksi Narkotika', icon: '🐕', tier: 'pusat', cat: 'pengawasan', x: 945, y: 75, color: '#7F1D1D' },
      
      'dit-audit': { id: 'dit-audit', name: 'Dit. Audit', full: 'Direktorat Audit Kepabeanan dan Cukai', icon: '📊', tier: 'pusat', cat: 'pengawasan', x: 190, y: 195, color: '#0369A1' },
      'dit-ikc': { id: 'dit-ikc', name: 'Dit. IKC', full: 'Direktorat Informasi Kepabeanan & Cukai', icon: '💻', tier: 'pusat', cat: 'data', x: 370, y: 195, color: '#4F46E5' },
      'dit-kombimjas': { id: 'dit-kombimjas', name: 'Dit. Kombimjas', full: 'Dit. Komunikasi & Bimbingan Pengguna Jasa', icon: '📢', tier: 'pusat', cat: 'pelayanan', x: 550, y: 195, color: '#B45309' },
      'dit-ksikc': { id: 'dit-ksikc', name: 'Dit. KSIKC', full: 'Dit. Kerja Sama Internasional Kepabeanan', icon: '🌐', tier: 'pusat', cat: 'eksternal', x: 730, y: 195, color: '#1E40AF' },
      'dit-kbp': { id: 'dit-kbp', name: 'Dit. KBP', full: 'Dit. Keberatan, Banding, dan Peraturan', icon: '⚖️', tier: 'pusat', cat: 'pelayanan', x: 900, y: 195, color: '#334155' },

      'kpu': { id: 'kpu', name: 'KPU Bea Cukai', full: 'Kantor Pelayanan Utama (Priok, Batam, Soetta)', icon: '🏢', tier: 'vertikal', cat: 'pelayanan', x: 240, y: 330, color: '#0284C7' },
      'kanwil': { id: 'kanwil', name: 'Kanwil DJBC', full: 'Kantor Wilayah DJBC (20 Regional)', icon: '🏛️', tier: 'vertikal', cat: 'pembinaan', x: 530, y: 330, color: '#0B3A6F' },
      'kppbc': { id: 'kppbc', name: 'KPPBC', full: 'Kantor Pengawasan & Pelayanan (104 Kantor)', icon: '🏬', tier: 'vertikal', cat: 'pelayanan', x: 820, y: 330, color: '#0369A1' },

      'blbc': { id: 'blbc', name: 'BLBC', full: 'Balai Laboratorium Bea dan Cukai (3 Lab)', icon: '🔬', tier: 'upt', cat: 'laboratorium', x: 380, y: 465, color: '#059669' },
      'pso': { id: 'pso', name: 'PSO BC', full: 'Pangkalan Sarana Operasi (6 Armada Laut)', icon: '⚓', tier: 'upt', cat: 'pengawasan', x: 680, y: 465, color: '#B45309' },

      'insw': { id: 'insw', name: 'INSW', full: 'Indonesia National Single Window (Lartas K/L)', icon: '🔄', tier: 'eksternal', cat: 'eksternal', x: 170, y: 590, color: '#7C3AED' },
      'ciq-imigrasi-karantina': { id: 'ciq-imigrasi-karantina', name: 'Sinergi CIQ', full: 'Customs, Immigration, & Barantin', icon: '🛂', tier: 'eksternal', cat: 'eksternal', x: 420, y: 590, color: '#0D9488' },
      'tni-polri-bakamla': { id: 'tni-polri-bakamla', name: 'TNI / POLRI / Bakamla / BNN', full: 'Perbantuan Hankam, Penegakan Hukum & BNN', icon: '🎖️', tier: 'eksternal', cat: 'eksternal', x: 670, y: 590, color: '#991B1B' },
      'wco-asean': { id: 'wco-asean', name: 'WCO & ASEAN', full: 'World Customs Org & ASEAN Single Window', icon: '🌍', tier: 'eksternal', cat: 'eksternal', x: 910, y: 590, color: '#2563EB' }
    };
  }

  setRelationships(data) {
    this.relationships = data || [];
    this.render();
  }

  getUnitDisplayName(id) {
    if (this.nodesMap[id]) return this.nodesMap[id].full;
    if (this.unitsDict[id]) return this.unitsDict[id].nama || this.unitsDict[id].nama_resmi || id;
    return id.toUpperCase();
  }

  getCategoryColor(cat) {
    switch ((cat || '').toLowerCase()) {
      case 'pengawasan': return '#DC2626';
      case 'pelayanan-fasilitas':
      case 'pelayanan': return '#0284C7';
      case 'laboratorium-teknis':
      case 'laboratorium': return '#059669';
      case 'data-sistem':
      case 'data': return '#4F46E5';
      case 'interdependensi-eksternal':
      case 'eksternal': return '#7C3AED';
      case 'pembinaan-sdm':
      case 'pembinaan': return '#0B3A6F';
      default: return '#64748B';
    }
  }

  render() {
    if (!this.container) return;

    // Filter relationships based on active category
    let filteredRels = this.relationships;
    if (this.selectedCategory !== 'all') {
      filteredRels = filteredRels.filter(r => r.category === this.selectedCategory || r.type === this.selectedCategory);
    }

    const activeNode = this.selectedNodeId ? this.nodesMap[this.selectedNodeId] : null;
    const nodeRels = this.selectedNodeId ? this.relationships.filter(r => r.from === this.selectedNodeId || r.to === this.selectedNodeId) : [];

    // Category counts calculation
    const countAll = this.relationships.length;
    const countPengawasan = this.relationships.filter(r => r.category === 'pengawasan').length;
    const countPelayanan = this.relationships.filter(r => r.category === 'pelayanan-fasilitas' || r.category === 'pelayanan').length;
    const countLab = this.relationships.filter(r => r.category === 'laboratorium-teknis' || r.category === 'laboratorium').length;
    const countData = this.relationships.filter(r => r.category === 'data-sistem' || r.category === 'data').length;
    const countEksternal = this.relationships.filter(r => r.category === 'interdependensi-eksternal' || r.category === 'eksternal').length;
    const countPembinaan = this.relationships.filter(r => r.category === 'pembinaan-sdm' || r.category === 'pembinaan').length;

    this.container.innerHTML = `
      <div style="padding: 24px 32px; max-width: 1400px; margin: 0 auto; width: 100%; position:relative;">
        
        <!-- Floating Network Tooltip Element -->
        <div id="network-edge-tooltip" style="position:fixed; display:none; pointer-events:none; z-index:9999; background:#001631; color:#FFFFFF; padding:10px 14px; border-radius:8px; font-size:12px; box-shadow:0 8px 24px rgba(0,0,0,0.25); max-width:340px; line-height:1.45; border:1px solid #D9B45B;"></div>

        <!-- Header Section -->
        <div style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="badge badge-org" style="font-size:11.5px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
              Diagram Jaringan Interaktif & Interdependensi Tusi DJBC
            </span>
            <h2 style="font-size: 24px; font-weight: 800; color: #001631; margin: 6px 0 4px 0;">
              Keterkaitan dan Interaksi Antar Satuan Kerja DJBC
            </h2>
            <p style="font-size: 13.5px; color: #64748B; margin: 0; max-width: 900px; line-height: 1.5;">
              Visualisasi relasi operasional, koordinasi intelijen, pengujian ilmiah, dan sinergi antar unit kerja DJBC serta mitra strategis. Arahkan kursor (*hover*) atau klik pada garis relasi maupun kartu unit (*node*) untuk menampilkan detail lengkap pada <strong>Side Panel</strong>.
            </p>
          </div>

          <!-- Instruction Badge & Tour Button -->
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="display:flex; align-items:center; gap:8px; background:#F8FAFC; border:1px solid #CBD5E1; padding:8px 14px; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
              <span style="font-size:18px;">💡</span>
              <div style="font-size:12px; color:#0B3A6F; font-weight:600; line-height:1.3;">
                Klik <strong>Garis Relasi</strong> atau <strong>Node Unit</strong><br>untuk membuka detail di <strong>Side Panel</strong>
              </div>
            </div>
            <button id="relationships-tour-btn" class="btn btn-outline" style="font-size:12px; font-weight:600; padding:8px 14px; gap:6px; border-radius:20px; cursor:pointer;" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.startRelationshipsTour(true);}" title="Buka Panduan Interaktif Diagram Jaringan">
              <span>💡</span>
              <span>Panduan Jaringan</span>
            </button>
          </div>
        </div>

        <!-- Filter Toolbar & Action Controls -->
        <div id="relationships-filter-bar" class="relationships-filter-bar" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom: 18px; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:12px 18px; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
          
          <!-- Category Filter Pills -->
          <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
            <span style="font-size:11.5px; font-weight:700; color:#64748B; text-transform:uppercase; margin-right:4px;">Filter:</span>
            <button class="btn ${this.selectedCategory === 'all' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="all" style="font-size:12px; padding:5px 12px;">
              Semua (${countAll})
            </button>
            <button class="btn ${this.selectedCategory === 'pengawasan' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="pengawasan" style="font-size:12px; padding:5px 12px; border-left:3px solid #DC2626;">
              🛡️ Pengawasan & P2 (${countPengawasan})
            </button>
            <button class="btn ${this.selectedCategory === 'pelayanan-fasilitas' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="pelayanan-fasilitas" style="font-size:12px; padding:5px 12px; border-left:3px solid #0284C7;">
              🚢 Pelayanan & Fasilitas (${countPelayanan})
            </button>
            <button class="btn ${this.selectedCategory === 'laboratorium-teknis' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="laboratorium-teknis" style="font-size:12px; padding:5px 12px; border-left:3px solid #059669;">
              🔬 UPT & Laboratorium (${countLab})
            </button>
            <button class="btn ${this.selectedCategory === 'data-sistem' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="data-sistem" style="font-size:12px; padding:5px 12px; border-left:3px solid #4F46E5;">
              💻 Data & Sistem (${countData})
            </button>
            <button class="btn ${this.selectedCategory === 'interdependensi-eksternal' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="interdependensi-eksternal" style="font-size:12px; padding:5px 12px; border-left:3px solid #7C3AED;">
              🌐 Lintas Instansi (${countEksternal})
            </button>
            <button class="btn ${this.selectedCategory === 'pembinaan-sdm' ? 'btn-primary' : 'btn-outline'}" data-rel-filter="pembinaan-sdm" style="font-size:12px; padding:5px 12px; border-left:3px solid #0B3A6F;">
              🏛️ Pembinaan SDM (${countPembinaan})
            </button>
          </div>

          <!-- Network Canvas Action Controls -->
          <div style="display:flex; gap:6px; align-items:center;">
            ${this.selectedNodeId || this.selectedEdgeId || this.selectedCategory !== 'all' ? `
              <button id="btn-net-reset" class="btn btn-outline" style="font-size:12px; padding:5px 12px; gap:4px;" title="Reset Fokus Diagram">
                ↺ Reset Fokus
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Full-Width Interactive SVG Network Canvas Container -->
        <div class="card" style="padding: 16px; background:#FFFFFF; position:relative; overflow:hidden; border:1px solid #E2E8F0; border-radius:14px; box-shadow:0 4px 20px rgba(0,0,0,0.04); min-height:680px;">
          
          <!-- Tier Legend Watermark Header -->
          <div style="position:absolute; top:14px; left:18px; font-size:11px; font-weight:700; color:#94A3B8; display:flex; gap:18px; z-index:5; pointer-events:none; flex-wrap:wrap;">
            <span>▲ Tier 1 & 2: Kantor Pusat (Regulator & Penunjang)</span>
            <span>● Tier 3: Instansi Vertikal (KPU, Kanwil, KPPBC)</span>
            <span>■ Tier 4: UPT (BLBC & PSO BC)</span>
            <span>◆ Tier 5: Sinergi Lintas K/L & Internasional</span>
          </div>

          <!-- Active Focus Indicator Pill -->
          ${this.selectedNodeId ? `
            <div style="position:absolute; top:14px; right:18px; font-size:11.5px; font-weight:700; color:#0B3A6F; background:#E0F2FE; border:1px solid #7DD3FC; padding:4px 12px; border-radius:9999px; z-index:5;">
              Node Fokus: <strong>${activeNode ? activeNode.name : this.selectedNodeId}</strong> (${nodeRels.length} Garis Terhubung)
            </div>
          ` : ''}

          <div style="width:100%; overflow-x:auto;">
            <svg id="network-diagram-svg" viewBox="0 0 1060 670" style="width:100%; min-width:960px; height:auto; display:block;">
              <defs>
                <!-- Arrow Markers -->
                <marker id="arrow-default" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
                </marker>
                <marker id="arrow-pengawasan" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#DC2626" />
                </marker>
                <marker id="arrow-pelayanan" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284C7" />
                </marker>
                <marker id="arrow-laboratorium" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                </marker>
                <marker id="arrow-data" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#4F46E5" />
                </marker>
                <marker id="arrow-eksternal" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#7C3AED" />
                </marker>
                <marker id="arrow-pembinaan" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#0B3A6F" />
                </marker>
                <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="8.5" markerHeight="8.5" orient="auto">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#D9B45B" />
                </marker>

                <!-- Filters for glowing nodes and paths -->
                <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0B3A6F" flood-opacity="0.12" />
                </filter>
                <filter id="active-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#D9B45B" flood-opacity="0.85" />
                </filter>
              </defs>

              <!-- Subtle Tier Separator Horizontal Guides -->
              <g opacity="0.05">
                <line x1="0" y1="135" x2="1060" y2="135" stroke="#000" stroke-dasharray="5,5" />
                <line x1="0" y1="260" x2="1060" y2="260" stroke="#000" stroke-dasharray="5,5" />
                <line x1="0" y1="395" x2="1060" y2="395" stroke="#000" stroke-dasharray="5,5" />
                <line x1="0" y1="525" x2="1060" y2="525" stroke="#000" stroke-dasharray="5,5" />
              </g>

              <!-- Network Edges Layer -->
              <g id="network-edges-layer">
                ${filteredRels.map(rel => {
                  const src = this.nodesMap[rel.from];
                  const tgt = this.nodesMap[rel.to];
                  if (!src || !tgt) return '';

                  const isEdgeSelected = this.selectedEdgeId === rel.id;
                  const isConnectedToSelectedNode = this.selectedNodeId ? (rel.from === this.selectedNodeId || rel.to === this.selectedNodeId) : true;
                  
                  // Curved line control point calculation
                  const dx = tgt.x - src.x;
                  const dy = tgt.y - src.y;
                  const cx = (src.x + tgt.x) / 2 + (dy * 0.14);
                  const cy = (src.y + tgt.y) / 2 - (dx * 0.14);

                  const edgeColor = isEdgeSelected ? '#D9B45B' : this.getCategoryColor(rel.category);
                  const strokeWidth = isEdgeSelected ? '4.0' : (isConnectedToSelectedNode && this.selectedNodeId ? '3.0' : '1.8');
                  const opacity = (this.selectedNodeId && !isConnectedToSelectedNode && !isEdgeSelected) ? '0.10' : (this.selectedEdgeId && !isEdgeSelected ? '0.12' : '0.88');
                  const marker = isEdgeSelected ? 'url(#arrow-active)' : `url(#arrow-${rel.category.split('-')[0]})`;

                  return `
                    <g class="network-edge-group" data-edge-id="${rel.id}" style="cursor:pointer; transition:all 0.2s ease;">
                      <!-- Thick invisible path for effortless hover and click -->
                      <path class="edge-hit-area" d="M ${src.x} ${src.y} Q ${cx} ${cy} ${tgt.x} ${tgt.y}" fill="none" stroke="transparent" stroke-width="24" />
                      
                      <!-- Visible styled curved line -->
                      <path class="edge-visible-path" 
                            d="M ${src.x} ${src.y} Q ${cx} ${cy} ${tgt.x} ${tgt.y}" 
                            fill="none" 
                            stroke="${edgeColor}" 
                            stroke-width="${strokeWidth}" 
                            opacity="${opacity}" 
                            marker-end="${marker}"
                            stroke-dasharray="${isEdgeSelected ? '6,4' : 'none'}" />
                    </g>
                  `;
                }).join('')}
              </g>

              <!-- Network Nodes Layer -->
              <g id="network-nodes-layer">
                ${Object.values(this.nodesMap).map(node => {
                  const isNodeSelected = this.selectedNodeId === node.id;
                  const isConnected = !this.selectedNodeId || isNodeSelected || (nodeRels.some(r => r.from === node.id || r.to === node.id));
                  const opacity = isConnected ? '1.0' : '0.18';
                  const filterAttr = isNodeSelected ? 'url(#active-glow)' : 'url(#node-glow)';
                  const strokeBorder = isNodeSelected ? '#D9B45B' : (isConnected ? node.color : '#CBD5E1');
                  const strokeWidth = isNodeSelected ? '3' : '1.5';

                  return `
                    <g class="network-node-group" data-node-id="${node.id}" transform="translate(${node.x}, ${node.y})" opacity="${opacity}" style="cursor:pointer; transition:all 0.2s ease;" filter="${filterAttr}">
                      <!-- Flat Node Container Box -->
                      <rect x="-64" y="-23" width="128" height="46" rx="9" ry="9" fill="#FFFFFF" stroke="${strokeBorder}" stroke-width="${strokeWidth}" />
                      
                      <!-- Icon Circle -->
                      <circle cx="-44" cy="0" r="14" fill="${node.color}15" stroke="${node.color}30" stroke-width="1" />
                      <text x="-44" y="5" text-anchor="middle" font-size="12.5">${node.icon}</text>
                      
                      <!-- Node Text Labels -->
                      <text x="-24" y="-3" font-size="11.5" font-weight="700" fill="#001631" text-anchor="start">${node.name}</text>
                      <text x="-24" y="11" font-size="9" font-weight="600" fill="${node.color}" text-anchor="start">${node.tier.toUpperCase()}</text>
                    </g>
                  `;
                }).join('')}
              </g>
            </svg>
          </div>
        </div>

      </div>
    `;

    // Tooltip Element Reference
    const tooltipEl = this.container.querySelector('#network-edge-tooltip');

    // Category Filter Buttons
    this.container.querySelectorAll('[data-rel-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.getAttribute('data-rel-filter');
        this.selectedEdgeId = null;
        this.render();
      });
    });

    // Reset Focus Button
    const resetBtn = this.container.querySelector('#btn-net-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.selectedCategory = 'all';
        this.selectedNodeId = null;
        this.selectedEdgeId = null;
        this.render();
      });
    }

    // Node Click on SVG -> Open Node Profile in Side Panel Drawer
    this.container.querySelectorAll('.network-node-group').forEach(nodeGroup => {
      nodeGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeId = nodeGroup.getAttribute('data-node-id');
        this.selectedNodeId = (this.selectedNodeId === nodeId) ? null : nodeId;
        this.selectedEdgeId = null;
        this.render();
        if (nodeId && this.onNavigateUnit) {
          this.onNavigateUnit(nodeId);
        }
      });
    });

    // Edge Hover & Click on SVG -> Open Relationship Details in Side Panel Drawer
    this.container.querySelectorAll('.network-edge-group').forEach(edgeGroup => {
      const edgeId = edgeGroup.getAttribute('data-edge-id');
      const rel = this.relationships.find(r => r.id === edgeId);
      const visiblePath = edgeGroup.querySelector('.edge-visible-path');

      // Hover events
      edgeGroup.addEventListener('mouseenter', (e) => {
        if (visiblePath) {
          visiblePath.setAttribute('stroke-width', '4.2');
          visiblePath.setAttribute('stroke', '#D9B45B');
        }
        if (tooltipEl && rel) {
          const fromTitle = this.getUnitDisplayName(rel.from).split('(')[0].trim();
          const toTitle = this.getUnitDisplayName(rel.to).split('(')[0].trim();
          const catColor = this.getCategoryColor(rel.category);
          tooltipEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:10px; font-weight:700; color:${catColor}; text-transform:uppercase;">${rel.category.replace('-', ' ')}</span>
              <span style="font-size:10px; color:#D9B45B; font-weight:600;">${rel.type.toUpperCase()}</span>
            </div>
            <div style="font-weight:700; font-size:12.5px; color:#FFFFFF; margin-bottom:4px;">${rel.label}</div>
            <div style="font-size:11.5px; color:#E2E8F0;">${fromTitle} ➔ ${toTitle}</div>
            <div style="font-size:10px; color:#D9B45B; margin-top:6px; font-weight:600;">🔍 Klik garis untuk membuka detail di Side Panel</div>
          `;
          tooltipEl.style.display = 'block';
          tooltipEl.style.left = `${e.clientX + 14}px`;
          tooltipEl.style.top = `${e.clientY + 14}px`;
        }
      });

      edgeGroup.addEventListener('mousemove', (e) => {
        if (tooltipEl && tooltipEl.style.display === 'block') {
          tooltipEl.style.left = `${e.clientX + 14}px`;
          tooltipEl.style.top = `${e.clientY + 14}px`;
        }
      });

      edgeGroup.addEventListener('mouseleave', () => {
        if (visiblePath && this.selectedEdgeId !== edgeId) {
          visiblePath.setAttribute('stroke-width', '1.8');
          visiblePath.setAttribute('stroke', this.getCategoryColor(rel ? rel.category : ''));
        }
        if (tooltipEl) {
          tooltipEl.style.display = 'none';
        }
      });

      // Click event -> Open Side Panel Drawer
      edgeGroup.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tooltipEl) tooltipEl.style.display = 'none';
        this.selectedEdgeId = (this.selectedEdgeId === edgeId) ? null : edgeId;
        this.render();
        if (rel && this.onSelectRelationship) {
          this.onSelectRelationship(rel);
        }
      });
    });
  }
}
