/**
 * breadcrumb.js — Dynamic hierarchy breadcrumb path renderer.
 */

export class Breadcrumb {
  constructor(containerEl, unitsDict, onNavigate) {
    this.container = containerEl;
    this.unitsDict = unitsDict || {};
    this.onNavigate = onNavigate;
  }

  setUnitsDict(dict) {
    this.unitsDict = dict;
  }

  update(currentUnitId) {
    if (!this.container) return;
    this.container.innerHTML = '';

    const path = [];
    let curr = currentUnitId;

    while (curr && this.unitsDict[curr]) {
      const u = this.unitsDict[curr];
      path.unshift({ id: u.id, name: u.singkatan || u.nama });
      curr = u.parent;
    }

    if (!path.length) {
      path.push({ id: 'djbc', name: 'DJBC' });
    }

    const ol = document.createElement('div');
    ol.className = 'breadcrumb';

    path.forEach((item, index) => {
      if (index > 0) {
        const sep = document.createElement('span');
        sep.className = 'breadcrumb-separator';
        sep.textContent = '›';
        ol.appendChild(sep);
      }

      const step = document.createElement('span');
      step.className = `breadcrumb-item ${index === path.length - 1 ? 'active' : ''}`;
      step.textContent = item.name;

      if (index < path.length - 1) {
        step.addEventListener('click', () => {
          if (this.onNavigate) this.onNavigate(item.id);
        });
      }

      ol.appendChild(step);
    });

    this.container.appendChild(ol);
  }
}
