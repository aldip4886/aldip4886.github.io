/**
 * minimap.js — Mini Map Navigation Indicator Component.
 */

export class MiniMap {
  constructor(containerEl, treeEngine) {
    this.container = containerEl;
    this.treeEngine = treeEngine;

    this.initUI();
  }

  initUI() {
    if (!this.container) return;
    this.container.className = 'minimap-container';
    this.container.innerHTML = `
      <div style="font-size:10px; font-weight:700; color:var(--color-text-secondary); padding:4px 8px; border-bottom:1px solid #E5E9F0; background:#F8FAFC;">PETA MINI</div>
      <div id="minimap-canvas" style="position:relative; width:100%; height:calc(100% - 22px); background:#F5F7FA; overflow:hidden;">
        <svg id="minimap-svg" width="100%" height="100%"></svg>
        <div id="minimap-viewport-box" style="position:absolute; border:2px solid var(--color-accent-blue); background:rgba(47,128,237,0.1); pointer-events:none;"></div>
      </div>
    `;
  }

  update(layoutResult, transformState) {
    if (!this.container || !layoutResult || !layoutResult.nodes) return;

    const svg = this.container.querySelector('#minimap-svg');
    if (!svg) return;

    svg.innerHTML = '';

    const bounds = layoutResult.bounds;
    const padding = 100;
    const minX = bounds.minX - padding;
    const maxX = bounds.maxX + padding;
    const minY = bounds.minY - padding;
    const maxY = bounds.maxY + padding;
    const width = maxX - minX || 1;
    const height = maxY - minY || 1;

    const containerRect = this.container.getBoundingClientRect();
    const mapWidth = containerRect.width;
    const mapHeight = containerRect.height - 22;

    const scaleX = mapWidth / width;
    const scaleY = mapHeight / height;
    const scale = Math.min(scaleX, scaleY);

    // Draw mini node dots
    layoutResult.nodes.forEach(node => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const cx = (node.x + node.width / 2 - minX) * scale;
      const cy = (node.y + node.height / 2 - minY) * scale;

      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', node.id === this.treeEngine.selectedNodeId ? '#C9A34E' : '#0B3A6F');
      svg.appendChild(circle);
    });

    // Update viewport rect indicator
    const box = this.container.querySelector('#minimap-viewport-box');
    if (box && transformState) {
      const parentRect = this.treeEngine.container.getBoundingClientRect();

      const viewX = (-transformState.translateX / transformState.scale - minX) * scale;
      const viewY = (-transformState.translateY / transformState.scale - minY) * scale;
      const viewW = (parentRect.width / transformState.scale) * scale;
      const viewH = (parentRect.height / transformState.scale) * scale;

      box.style.left = `${Math.max(0, viewX)}px`;
      box.style.top = `${Math.max(0, viewY)}px`;
      box.style.width = `${Math.min(mapWidth, viewW)}px`;
      box.style.height = `${Math.min(mapHeight, viewH)}px`;
    }
  }
}
