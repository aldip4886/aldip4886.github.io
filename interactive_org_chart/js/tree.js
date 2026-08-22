/**
 * tree.js — SVG Tree rendering and pan/zoom engine with Stitch design system.
 * Features:
 * - Optimal zoom calculation focusing on selected node and its horizontal sub-units
 * - Toggle click behavior on active nodes (collapsing to parent)
 * - Topmost layer rendering priority for active sub-units
 * - Fully offline & static compatible with file:// protocol
 */

import { TreeLayout } from './tree-layout.js';
import { getUnitIcon, escapeHtml } from './utils.js';

export class SVGTreeEngine {
  constructor(container, onNodeSelect, onNodeDeselect) {
    this.container = container;
    this.onNodeSelect = onNodeSelect;
    this.onNodeDeselect = onNodeDeselect;
    this.layoutEngine = new TreeLayout();

    this.expandedGroups = {
      'kantor-pusat': false,
      'instansi-vertikal-djbc': false,
      'upt-djbc': false
    };

    this.selectedNodeId = null;
    this.treeData = null;
    this.unitsDict = {};

    // Transform State
    this.scale = 0.8;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.initSVG();
    this.setupInteractions();
    this.renderToolbar();
  }

  initSVG() {
    this.container.innerHTML = '';
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('class', 'tree-svg-canvas');
    this.svg.style.cursor = 'grab';

    // Dot grid pattern background matching Stitch Canvas
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="12" r="1.2" fill="#CBD5E1" opacity="0.6"/>
      </pattern>
    `;
    this.svg.appendChild(defs);

    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', 'url(#grid-pattern)');
    this.svg.appendChild(bgRect);

    // Zoom container
    this.gZoom = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gZoom.setAttribute('class', 'zoom-layer');
    this.gZoom.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    this.gLinks = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gLinks.setAttribute('class', 'links-layer');
    this.gLinks.style.pointerEvents = 'none';

    this.gHeaders = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gHeaders.setAttribute('class', 'headers-layer');
    this.gHeaders.style.pointerEvents = 'none';

    this.gNodes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.gNodes.setAttribute('class', 'nodes-layer');
    this.gNodes.style.pointerEvents = 'auto';

    this.gZoom.appendChild(this.gLinks);
    this.gZoom.appendChild(this.gHeaders);
    this.gZoom.appendChild(this.gNodes);
    this.svg.appendChild(this.gZoom);

    this.container.appendChild(this.svg);
  }

  toggleGroup(groupId) {
    const isCurrentlyExpanded = !!this.expandedGroups[groupId];
    // Accordion behavior: collapse all pillars first
    this.expandedGroups['kantor-pusat'] = false;
    this.expandedGroups['instansi-vertikal-djbc'] = false;
    this.expandedGroups['upt-djbc'] = false;

    // Toggle clicked group
    this.expandedGroups[groupId] = !isCurrentlyExpanded;
    this.selectedNodeId = null;

    this.renderTree();
    this.autoFitView();
  }

  expandAncestors(unitId) {
    if (!unitId || !this.unitsDict) return;

    // Accordion behavior: collapse all pillars first
    this.expandedGroups['kantor-pusat'] = false;
    this.expandedGroups['instansi-vertikal-djbc'] = false;
    this.expandedGroups['upt-djbc'] = false;

    // Walk up the parent chain to find pillar group
    let curr = unitId;
    const visited = new Set();
    while (curr && !visited.has(curr)) {
      visited.add(curr);
      if (curr === 'kantor-pusat') {
        this.expandedGroups['kantor-pusat'] = true;
        return;
      }
      if (curr === 'instansi-vertikal-djbc' || curr === 'instansi-vertikal') {
        this.expandedGroups['instansi-vertikal-djbc'] = true;
        return;
      }
      if (curr === 'upt-djbc' || curr === 'upt') {
        this.expandedGroups['upt-djbc'] = true;
        return;
      }
      const unitObj = this.unitsDict[curr];
      curr = unitObj ? unitObj.parent : null;
    }

    // Fallback: identify pillar from unit ID prefixes
    const id = unitId;
    if (id.startsWith('dit-') || id.startsWith('tp-') || id === 'setditjen' || id.startsWith('bagian-') || id.startsWith('subdir')) {
      this.expandedGroups['kantor-pusat'] = true;
    } else if (id.startsWith('kanwil-') || id.startsWith('kpu-') || id.startsWith('kppbc-')) {
      this.expandedGroups['instansi-vertikal-djbc'] = true;
    } else if (id.startsWith('blbc-') || id.startsWith('pso-')) {
      this.expandedGroups['upt-djbc'] = true;
    }
  }

  setTreeData(treeData) {
    this.treeData = treeData;
  }

  setUnitsDict(dict) {
    this.unitsDict = dict || {};
  }

  render(treeData, unitsDict) {
    if (!treeData) return;
    this.treeData = treeData;
    this.unitsDict = unitsDict || {};

    this.renderTree();
    this.autoFitView();
  }

  renderTree() {
    if (!this.gLinks) return;

    const layoutResult = this.layoutEngine.layout(this.treeData, this.expandedGroups, this.selectedNodeId, this.unitsDict);
    this.currentLayout = layoutResult;

    // 1. Clear SVG layers
    this.gLinks.innerHTML = '';
    this.gNodes.innerHTML = '';
    this.gHeaders.innerHTML = '';

    // 2. Draw connector lines
    layoutResult.links.forEach(link => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'org-line');
      path.setAttribute('d', this.layoutEngine.generateConnectorPath(link));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', link.isHorizontalBranch ? '#059669' : '#D9E0E8');
      path.setAttribute('stroke-width', link.isHorizontalBranch ? '2' : '2');
      this.gLinks.appendChild(path);
    });

    // 3. Sort nodes for Layering Priority (Requirement 4: Sub-units placed on frontmost layer)
    const sortedNodes = [...layoutResult.nodes].sort((a, b) => {
      const getPriority = (n) => {
        if (n.type === 'subunit4') return 4;
        if (n.type === 'subunit') return 3;
        if (n.id === this.selectedNodeId || n.isActive) return 2;
        if (n.type === 'unit') return 1;
        return 0; // headers, pillars, root
      };
      return getPriority(a) - getPriority(b);
    });

    // 4. Render HTML node cards inside SVG foreignObject
    sortedNodes.forEach(node => {
      if (node.type === 'header') {
        this.renderHeaderNode(node);
      } else {
        this.renderCardNode(node);
      }
    });
  }

  renderHeaderNode(node) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('width', node.width);
    foreignObject.setAttribute('height', node.height);
    foreignObject.style.pointerEvents = 'none';

    const div = document.createElement('div');
    div.style.cssText = `
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      border: 1.5px solid ${node.color || '#0B3A6F'};
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      font-size: 11px;
      font-weight: 800;
      color: ${node.color || '#0B3A6F'};
      letter-spacing: 0.5px;
      box-sizing: border-box;
      pointer-events: none;
      user-select: none;
    `;
    div.textContent = node.label;

    foreignObject.appendChild(div);
    g.appendChild(foreignObject);
    this.gHeaders.appendChild(g);
  }

  renderCardNode(node) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
    g.setAttribute('class', 'node-group');
    g.style.cursor = 'pointer';
    g.style.pointerEvents = 'all';

    const isSelected = node.id === this.selectedNodeId || node.isActive;
    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    foreignObject.setAttribute('width', node.width);
    foreignObject.setAttribute('height', node.height + (node.type === 'pillar' ? 30 : 0));
    foreignObject.setAttribute('pointer-events', 'all');
    foreignObject.style.pointerEvents = 'all';
    foreignObject.style.overflow = 'visible';

    const div = document.createElement('div');
    div.className = `node-card ${isSelected ? 'node-selected' : ''} ${node.type === 'subunit' ? 'node-subunit' : ''} ${node.type === 'subunit4' ? 'node-subunit4' : ''}`;
    div.style.pointerEvents = 'auto';
    div.style.cursor = 'pointer';
    div.style.userSelect = 'none';
    
    // Custom styling based on node type
    if (node.type === 'root') {
      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: #FFFFFF;
        border: ${isSelected ? '2.5px solid #D9B45B' : '1.5px solid #D9E0E8'};
        border-radius: 14px;
        padding: 14px 16px;
        box-shadow: 0 6px 16px rgba(11, 58, 111, 0.08);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
      `;
      div.innerHTML = `
        <div style="width:36px; height:36px; border-radius:8px; background:#062B52; color:#FFFFFF; display:flex; align-items:center; justify-content:center; margin-bottom:6px;">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M13 12h.01M13 8h.01M9 8h.01"/></svg>
        </div>
        <div style="font-size:14px; font-weight:700; color:#062B52; line-height:1.25;">${escapeHtml(node.title)}</div>
        <span style="margin-top:6px; padding:2px 8px; background:#FEF3C7; color:#92400E; border:1px solid #FDE68A; border-radius:9999px; font-size:10.5px; font-weight:700;">${escapeHtml(node.badge)}</span>
      `;
    } else if (node.type === 'pillar') {
      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: #FFFFFF;
        border: ${node.isExpanded ? '2.5px solid ' + node.color : '1.5px solid #D9E0E8'};
        border-radius: 14px;
        padding: 12px 14px;
        box-shadow: 0 4px 14px rgba(11, 58, 111, 0.07);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
      `;
      const iconPath = node.icon === 'corporate_fare' 
        ? 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5' 
        : node.icon === 'science' 
          ? 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.022 1.022a2 2 0 00.547 2.387l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387-.477a2 2 0 001.022-.547' 
          : 'M4 6h16M4 12h16M4 18h16';

      div.innerHTML = `
        <div style="width:32px; height:32px; border-radius:6px; background:rgba(2,132,199,0.1); color:${node.color}; display:flex; align-items:center; justify-content:center; margin-bottom:4px;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"/></svg>
        </div>
        <div style="font-size:14px; font-weight:700; color:#062B52; line-height:1.2;">${escapeHtml(node.title)}</div>
        <div style="font-size:11px; color:#64748B; margin-top:3px;">${escapeHtml(node.subtitle)}</div>
        <div style="margin-top:8px; padding:3px 12px; background:${node.isExpanded ? '#FEE2E2' : '#FEF3C7'}; color:${node.isExpanded ? '#991B1B' : '#92400E'}; border:1px solid ${node.isExpanded ? '#FCA5A5' : '#FDE68A'}; border-radius:9999px; font-size:10px; font-weight:700;">
          ${node.isExpanded ? '[-] Collapse' : '[+] Expand'}
        </div>
      `;
    } else if (node.type === 'subunit') {
      // Sub-unit Eselon III Card (Horizontal or Selected)
      const uDict = (this.unitsDict && this.unitsDict[node.id]) || {};
      const title = uDict.nama || node.data.nama || node.data.name || uDict.singkatan || node.data.singkatan || node.id;
      const subtitle = uDict.level || node.data.level || 'Eselon III';
      const icon = getUnitIcon(uDict.id ? uDict : (node.data || node.id));

      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: ${isSelected ? '#FEF3C7' : '#FFFFFF'};
        border: ${isSelected ? '2.5px solid #D9B45B' : '1.5px solid #CBD5E1'};
        border-radius: 12px;
        padding: 10px 14px;
        box-shadow: ${isSelected ? '0 8px 20px rgba(217, 180, 91, 0.35)' : '0 3px 10px rgba(0, 0, 0, 0.06)'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        cursor: pointer;
        position: relative;
        z-index: 40;
        box-sizing: border-box;
      `;
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span style="font-size:10px; font-weight:700; padding:2px 8px; background:${isSelected ? '#FDE68A' : '#F1F5F9'}; color:#334155; border-radius:9999px; text-transform:uppercase;">${escapeHtml(subtitle)}</span>
          ${isSelected ? '<span style="font-size:10px; color:#B45309; font-weight:700;">● Aktif</span>' : ''}
        </div>
        <div style="font-size:12.5px; font-weight:700; color:#062B52; line-height:1.35; margin-top:4px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; word-break:break-word;" title="${escapeHtml(title)}"><span style="margin-right:4px;">${icon}</span>${escapeHtml(title)}</div>
      `;
    } else if (node.type === 'subunit4') {
      // Eselon IV Sub-unit Card (horizontal)
      const uDict = (this.unitsDict && this.unitsDict[node.id]) || {};
      const title = uDict.nama || node.data.nama || node.data.name || uDict.singkatan || node.data.singkatan || node.id;
      const subtitle = uDict.level || node.data.level || 'Eselon IV';
      const icon = getUnitIcon(uDict.id ? uDict : (node.data || node.id));

      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: ${isSelected ? '#DCFCE7' : '#F0FDF4'};
        border: ${isSelected ? '2.5px solid #059669' : '1.5px solid #A7F3D0'};
        border-radius: 10px;
        padding: 10px 12px;
        box-shadow: ${isSelected ? '0 8px 20px rgba(5, 150, 105, 0.3)' : '0 3px 10px rgba(0, 0, 0, 0.05)'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        cursor: pointer;
        position: relative;
        z-index: 50;
        box-sizing: border-box;
      `;
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span style="font-size:9.5px; font-weight:700; padding:2px 7px; background:${isSelected ? '#BBF7D0' : '#DCFCE7'}; color:#166534; border-radius:9999px; text-transform:uppercase;">${escapeHtml(subtitle)}</span>
          ${isSelected ? '<span style="font-size:10px; color:#059669; font-weight:700;">● Aktif</span>' : ''}
        </div>
        <div style="font-size:12px; font-weight:700; color:#065F46; line-height:1.35; margin-top:4px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; word-break:break-word;" title="${escapeHtml(title)}"><span style="margin-right:4px;">${icon}</span>${escapeHtml(title)}</div>
      `;
    } else {
      // Regular Eselon II / UPT Satker Unit Card
      const uDict = (this.unitsDict && this.unitsDict[node.id]) || {};
      const title = uDict.nama || node.data.nama || node.data.name || uDict.singkatan || node.data.singkatan || node.id;
      const subtitle = uDict.level || node.data.level || node.data.kategori_fungsi || 'Eselon II';
      const icon = getUnitIcon(uDict.id ? uDict : (node.data || node.id));

      div.style.cssText = `
        width: 100%;
        height: ${node.height}px;
        background: ${isSelected ? '#EFF6FF' : '#FFFFFF'};
        border: ${isSelected ? '2.5px solid #0284C7' : '1.5px solid #D9E0E8'};
        border-radius: 12px;
        padding: 12px 14px;
        box-shadow: ${isSelected ? '0 8px 20px rgba(2, 132, 199, 0.25)' : '0 3px 10px rgba(11, 58, 111, 0.06)'};
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        cursor: pointer;
        position: relative;
        z-index: 30;
        box-sizing: border-box;
      `;
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span style="font-size:10.5px; font-weight:700; padding:2px 8px; background:${isSelected ? '#DBEAFE' : '#F2F4F7'}; color:#1E40AF; border-radius:9999px;">${escapeHtml(subtitle)}</span>
          ${isSelected ? '<span style="font-size:10px; color:#0284C7; font-weight:700;">● Aktif</span>' : ''}
        </div>
        <div style="font-size:13px; font-weight:700; color:#062B52; line-height:1.35; margin-top:4px; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; word-break:break-word;" title="${escapeHtml(title)}"><span style="margin-right:4px;">${icon}</span>${escapeHtml(title)}</div>
      `;
    }

    // Centralized Click & Toggle Handler (Requirement 3: Toggle Click Behavior)
    const clickHandler = (e) => {
      this.handleNodeClick(node, e);
    };

    div.onclick = clickHandler;
    div.ontouchend = clickHandler;
    foreignObject.onclick = clickHandler;
    g.onclick = clickHandler;

    foreignObject.appendChild(div);
    g.appendChild(foreignObject);
    this.gNodes.appendChild(g);
  }

  /**
   * Handle Click with Toggle Behavior:
   * Clicking an already active/expanded node toggles it off (collapses it) and returns to parent level.
   */
  handleNodeClick(node, event) {
    if (event) {
      if (typeof event.stopPropagation === 'function') event.stopPropagation();
    }
    const clickedId = node.id || (node.data ? node.data.id : null);
    if (!clickedId) return;

    // Debounce to prevent duplicate synthetic/bubbled events
    const now = Date.now();
    if (this._lastClickId === clickedId && (now - (this._lastClickTime || 0)) < 350) {
      return;
    }
    this._lastClickId = clickedId;
    this._lastClickTime = now;

    if (node.type === 'pillar') {
      this.toggleGroup(clickedId);
      if (this.onNodeSelect) this.onNodeSelect(clickedId);
      return;
    }

    if (this.onNodeSelect) {
      this.onNodeSelect(clickedId);
    } else {
      this.selectedNodeId = clickedId;
      this.expandAncestors(clickedId);
      this.renderTree();
      this.centerOnNode(clickedId);
    }
  }

  setupInteractions() {
    if (!this.svg) return;

    this.svg.addEventListener('mousedown', (e) => {
      let el = e.target;
      while (el && el !== this.svg) {
        if (el.classList && (el.classList.contains('node-card') || el.classList.contains('node-group') || el.classList.contains('nodes-layer') || el.classList.contains('node-subunit') || el.classList.contains('node-subunit4'))) {
          return;
        }
        if (el.tagName) {
          const tag = el.tagName.toLowerCase();
          if (tag === 'foreignobject' || tag === 'div' || tag === 'span' || tag === 'p' || tag === 'h3' || tag === 'svg' || tag === 'path') {
            if (el.closest && (el.closest('.nodes-layer') || el.closest('.node-group') || el.closest('foreignObject') || el.closest('.node-card'))) {
              return;
            }
          }
        }
        el = el.parentElement || el.parentNode;
      }
      this.isDragging = true;
      if (this.gZoom) this.gZoom.style.transition = 'none';
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
        if (this.gZoom) this.gZoom.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });

    this.svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (this.gZoom) this.gZoom.style.transition = 'none';
      const delta = e.deltaY < 0 ? 1.1 : 0.9;
      this.scale = Math.max(0.25, Math.min(2.5, this.scale * delta));
      this.updateTransform();
      this.updateZoomLabel();
      setTimeout(() => {
        if (this.gZoom) this.gZoom.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }, 100);
    }, { passive: false });
  }

  updateTransform() {
    if (this.gZoom) {
      this.gZoom.setAttribute('transform', `translate(${this.translateX}, ${this.translateY}) scale(${this.scale})`);
    }
  }

  /**
   * Auto-fit view covering all rendered nodes
   */
  autoFitView() {
    if (!this.currentLayout || !this.currentLayout.nodes || this.currentLayout.nodes.length === 0) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    this.currentLayout.nodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x + n.width);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y + (n.height || 100));
    });

    const containerW = this.container.clientWidth || 800;
    const containerH = this.container.clientHeight || 600;

    const paddingX = 90;
    const paddingY = 90;

    const boundsW = (maxX - minX) || 1;
    const boundsH = (maxY - minY) || 1;

    const scaleX = (containerW - paddingX * 2) / boundsW;
    const scaleY = (containerH - paddingY * 2) / boundsH;

    let targetScale = Math.min(scaleX, scaleY);
    targetScale = Math.max(0.65, Math.min(0.95, targetScale));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    this.scale = targetScale;
    this.translateX = (containerW / 2) - centerX * this.scale;
    this.translateY = (containerH / 2) - centerY * this.scale;

    this.updateTransform();
    this.updateZoomLabel();
  }

  centerRoot() {
    this.autoFitView();
  }

  /**
   * Optimal Zoom Focusing on the Selected Node and its Horizontal Sub-units (Requirement 1 & 2)
   */
  centerOnNode(nodeId) {
    if (!this.currentLayout || !this.currentLayout.nodes || this.currentLayout.nodes.length === 0) return;
    const target = this.currentLayout.nodes.find(n => n.id === nodeId);
    if (!target) {
      this.autoFitView();
      return;
    }

    // Find all sub-units belonging to this active branch to calculate bounding box
    const branchNodes = this.currentLayout.nodes.filter(n => 
      n.id === nodeId || 
      n.type === 'subunit' || 
      n.type === 'subunit4' ||
      n.id.startsWith(`${nodeId}-`)
    );

    let minX = target.x;
    let maxX = target.x + target.width;
    let minY = target.y;
    let maxY = target.y + target.height;

    branchNodes.forEach(n => {
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x + n.width);
      minY = Math.min(minY, n.y);
      maxY = Math.max(maxY, n.y + (n.height || 95));
    });

    const containerW = this.container.clientWidth || 800;
    const containerH = this.container.clientHeight || 600;

    const padX = 60;
    const padY = 60;

    const boundsW = (maxX - minX) + padX * 2;
    const boundsH = (maxY - minY) + padY * 2;

    const scaleX = containerW / boundsW;
    const scaleY = containerH / boundsH;
    let targetScale = Math.min(scaleX, scaleY, 1.15);
    targetScale = Math.max(0.80, targetScale);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    this.scale = targetScale;
    this.translateX = (containerW / 2) - centerX * this.scale;
    this.translateY = (containerH / 2) - centerY * this.scale;

    this.updateTransform();
    this.updateZoomLabel();
  }

  renderToolbar() {
    let toolbar = this.container.querySelector('.tree-toolbar');
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'tree-toolbar';
      toolbar.style.cssText = `
        position: absolute;
        bottom: 24px;
        left: 24px;
        z-index: 80;
        background: #FFFFFF;
        border: 1px solid #D9E0E8;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        display: flex;
        align-items: center;
        padding: 6px 12px;
        gap: 6px;
      `;
      this.container.appendChild(toolbar);
    }

    toolbar.innerHTML = `
      <button id="btn-zoom-out" style="width:32px; height:32px; border-radius:8px; background:#F2F4F7; border:1px solid #D9E0E8; color:#1F2937; font-size:16px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Zoom Out">−</button>
      <span id="zoom-percentage" style="font-size:12px; font-weight:600; color:#667085; padding:0 8px; border-right:1px solid #D9E0E8;">90%</span>
      <button id="btn-zoom-in" style="width:32px; height:32px; border-radius:8px; background:#F2F4F7; border:1px solid #D9E0E8; color:#1F2937; font-size:16px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center;" title="Zoom In">+</button>
      <button id="btn-zoom-reset" style="width:32px; height:32px; border-radius:8px; background:#F2F4F7; border:1px solid #D9E0E8; color:#0B3A6F; font-size:14px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-left:2px;" title="Auto-Fit View">🎯</button>
    `;

    const zoomInBtn = toolbar.querySelector('#btn-zoom-in');
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
    const zoomOutBtn = toolbar.querySelector('#btn-zoom-out');
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
    const zoomResetBtn = toolbar.querySelector('#btn-zoom-reset');
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => this.autoFitView());
  }

  zoomIn() {
    this.scale = Math.min(2.5, this.scale * 1.2);
    this.updateTransform();
    this.updateZoomLabel();
  }

  zoomOut() {
    this.scale = Math.max(0.3, this.scale / 1.2);
    this.updateTransform();
    this.updateZoomLabel();
  }

  updateZoomLabel() {
    const label = this.container.querySelector('#zoom-percentage');
    if (label) {
      label.textContent = `${Math.round(this.scale * 100)}%`;
    }
  }
}
