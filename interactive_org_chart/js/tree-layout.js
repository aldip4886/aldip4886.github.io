/**
 * tree-layout.js — Hierarchy tree layout algorithm matching Stitch Screen 02 & 03 design.
 * Features:
 * 1. Eselon-2 Click: Collapses sibling Eselon-2 nodes, renders Eselon-3 sub-units HORIZONTALLY (menyamping).
 * 2. Eselon-3 Click: Collapses sibling Eselon-3 nodes, renders Eselon-4 sub-units (Seksi) HORIZONTALLY (menyamping).
 * 3. Highly legible card dimensions & typography for crystal clear text readability across all sub-nodes.
 * 4. Toggle behavior: Clicking an active node collapses it and returns to parent level.
 * 5. Layering: Foreground priority for active sub-units.
 */

export class TreeLayout {
  constructor(options = {}) {
    this.nodeWidth = options.nodeWidth || 270;
    this.nodeHeight = options.nodeHeight || 100;
    this.colSpacing = options.colSpacing || 420;
    this.subColWidth = options.subColWidth || 310;
    this.rowSpacing = options.rowSpacing || 130;
  }

  /**
    * Find the Eselon-2 ancestor of a given unit ID.
    */
  _findParentEselon2(unitId, unitsDict) {
    if (!unitId) return null;
    let curr = unitId;
    const visited = new Set();
    while (curr && !visited.has(curr)) {
      visited.add(curr);
      const unit = unitsDict[curr];
      if (unit) {
        const lvl = (unit.level || '').toLowerCase();
        if (lvl.includes('2') || lvl === 'eselon-2' || lvl === 'eselon ii') return curr;
        if (unit.parent === 'upt-djbc' || unit.parent === 'kantor-pusat' || unit.parent === 'instansi-vertikal-djbc') {
          return curr;
        }
        curr = unit.parent;
      } else {
        const p3 = this._findParentEselon3(curr, unitsDict);
        if (p3 && p3 !== curr && !visited.has(p3)) {
          curr = p3;
          continue;
        }
        if (curr.startsWith('dit-') || curr.startsWith('kanwil-') || curr.startsWith('kpu-') || curr.startsWith('blbc-') || curr.startsWith('pso-') || curr === 'setditjen' || curr.startsWith('tp-')) {
          return curr;
        }
        break;
      }
    }
    return null;
  }

  /**
    * Find the Eselon-3 ancestor of a given unit ID.
    */
  _findParentEselon3(unitId, unitsDict) {
    if (!unitId) return null;
    let curr = unitId;
    const visited = new Set();
    while (curr && !visited.has(curr)) {
      visited.add(curr);
      const unit = unitsDict[curr];
      if (unit) {
        const lvl = (unit.level || '').toLowerCase();
        if (lvl.includes('3') || lvl === 'eselon-3' || lvl === 'eselon iii') return curr;
        curr = unit.parent;
      } else {
        if (curr.includes('-seksi-')) {
          return curr.substring(0, curr.indexOf('-seksi-'));
        }
        if (curr.includes('-subbag-')) {
          return curr.substring(0, curr.indexOf('-subbag-'));
        }
        if (curr.includes('-sub4-')) {
          return curr.substring(0, curr.indexOf('-sub4-'));
        }
        break;
      }
    }
    return null;
  }

  layout(rootNode, expandedGroups = {}, selectedNodeId = null, unitsDict = {}) {
    if (!rootNode) return { nodes: [], links: [] };

    const nodes = [];
    const links = [];

    // Analyze selection state
    const selectedUnit = unitsDict[selectedNodeId];
    const selectedLevel = selectedUnit ? (selectedUnit.level || '').toLowerCase() : '';

    const isLevel4Selected = selectedLevel.includes('4') || selectedLevel.includes('iv') || (selectedNodeId && selectedNodeId.includes('-seksi-')) || (selectedNodeId && selectedNodeId.includes('-subbag-'));
    const isLevel3Selected = selectedLevel.includes('3') || selectedLevel.includes('iii') || isLevel4Selected || (selectedNodeId && selectedNodeId.startsWith('subdirektorat-')) || (selectedNodeId && selectedNodeId.startsWith('kppbc-'));
    const isLevel2Selected = selectedLevel.includes('2') || selectedLevel.includes('ii') || isLevel3Selected;

    const activeEselon2Id = isLevel2Selected ? this._findParentEselon2(selectedNodeId, unitsDict) : null;
    let activeEselon3Id = null;
    if (isLevel3Selected) {
      if (isLevel4Selected) {
        activeEselon3Id = this._findParentEselon3(selectedNodeId, unitsDict);
      } else {
        activeEselon3Id = (selectedLevel.includes('3') || selectedLevel.includes('iii')) ? selectedNodeId : this._findParentEselon3(selectedNodeId, unitsDict);
      }
    }

    // 1. Root Node: DJBC (Center x=0, y=30)
    const rootX = 0;
    const rootY = 30;

    nodes.push({
      id: 'djbc',
      data: rootNode,
      x: rootX - 140,
      y: rootY,
      width: 280,
      height: 125,
      type: 'root',
      icon: 'account_balance',
      title: 'Direktorat Jenderal Bea dan Cukai',
      subtitle: 'PMK 124/2024 & PMK 188/2016',
      badge: 'Eselon I',
      badgeColor: 'amber'
    });

    const pillars = [
      {
        id: 'kantor-pusat',
        title: 'Kantor Pusat',
        subtitle: '1 Sekretariat, 10 Dit, 4 Pengkaji',
        badge: 'Unit Induk',
        icon: 'corporate_fare',
        color: '#0284C7',
        x: -this.colSpacing,
        y: 220,
        subColumns: [
          { key: 'sekretariat', label: 'A. SEKRETARIAT', offsetX: -this.subColWidth, color: '#0284C7', filter: c => c.id === 'setditjen' || (c.nama && c.nama.toLowerCase().includes('sekretariat')) },
          { key: 'direktorat', label: 'B. DIREKTORAT', offsetX: 0, color: '#0B3A6F', filter: c => c.id && c.id.startsWith('dit-') && !c.id.startsWith('tp-') },
          { key: 'pengkaji', label: 'C. TENAGA PENGKAJI', offsetX: this.subColWidth, color: '#7C3AED', filter: c => c.id && c.id.startsWith('tp-') }
        ]
      },
      {
        id: 'instansi-vertikal-djbc',
        title: 'Instansi Vertikal',
        subtitle: '20 Kanwil, 3 KPU & 104 KPPBC',
        badge: 'Kantor Wilayah/Pelayanan',
        icon: 'account_tree',
        color: '#059669',
        x: 0,
        y: 220,
        subColumns: [
          { key: 'kpu', label: 'A. KPU BEA CUKAI', offsetX: -160, color: '#0369A1', filter: c => c.id && c.id.startsWith('kpu-') },
          { key: 'kanwil', label: 'B. KANWIL DJBC', offsetX: 160, color: '#059669', filter: c => c.id && c.id.startsWith('kanwil-') }
        ]
      },
      {
        id: 'upt-djbc',
        title: 'Unit Pelaksana Teknis',
        subtitle: '3 BLBC & 6 PSO Bea Cukai',
        badge: 'Balai Pengujian/Pangkalan',
        icon: 'science',
        color: '#7C3AED',
        x: this.colSpacing,
        y: 220,
        subColumns: [
          { key: 'blbc', label: 'A. BALAI LAB (BLBC)', offsetX: -150, color: '#8B5CF6', filter: c => c.id && c.id.startsWith('blbc-') },
          { key: 'pso', label: 'B. PSO BEA CUKAI', offsetX: 150, color: '#6366F1', filter: c => c.id && c.id.startsWith('pso-') }
        ]
      }
    ];

    const rootChildren = rootNode.children || [];

    pillars.forEach(pillar => {
      const pNodeData = rootChildren.find(c => c.id === pillar.id) || { id: pillar.id, nama: pillar.title, children: [] };
      const isExpanded = !!expandedGroups[pillar.id];

      // Connector Link from Root to Pillar
      links.push({
        source: { x: rootX, y: rootY + 125 },
        target: { x: pillar.x, y: pillar.y },
        sourceId: 'djbc',
        targetId: pillar.id
      });

      // Pillar Group Card
      nodes.push({
        id: pillar.id,
        data: pNodeData,
        x: pillar.x - this.nodeWidth / 2,
        y: pillar.y,
        width: this.nodeWidth,
        height: 125,
        type: 'pillar',
        title: pillar.title,
        subtitle: pillar.subtitle,
        badge: pillar.badge,
        icon: pillar.icon,
        color: pillar.color,
        isExpanded: isExpanded
      });

      if (isExpanded) {
        const subYHeader = pillar.y + 165;
        const allPillarChildren = pNodeData.children || [];

        pillar.subColumns.forEach(subCol => {
          const subX = pillar.x + subCol.offsetX;
          let matchingChildren = allPillarChildren.filter(subCol.filter);

          // If an Eselon-2 or lower unit is active in this pillar, collapse other Eselon-2 nodes
          if (activeEselon2Id) {
            const hasActive = matchingChildren.some(c => c.id === activeEselon2Id);
            if (hasActive) {
              matchingChildren = matchingChildren.filter(c => c.id === activeEselon2Id);
            } else {
              // Sibling sub-column under same pillar is collapsed
              matchingChildren = [];
            }
          }

          if (matchingChildren.length === 0 && activeEselon2Id) {
            return; // Skip empty subcolumn when focusing on an active Eselon-2 node
          }

          // Connector Link from Pillar to Sub-column Header
          links.push({
            source: { x: pillar.x, y: pillar.y + 125 },
            target: { x: subX, y: subYHeader },
            sourceId: pillar.id,
            targetId: `${pillar.id}-${subCol.key}-header`
          });

          // Sub-column Header Node
          nodes.push({
            id: `${pillar.id}-${subCol.key}-header`,
            type: 'header',
            label: subCol.label,
            color: subCol.color,
            x: subX - 110,
            y: subYHeader,
            width: 220,
            height: 32
          });

          // Render Child Eselon-2 Unit Cards
          let curY = subYHeader + 55;
          matchingChildren.forEach(child => {
            links.push({
              source: { x: subX, y: subYHeader + 16 },
              target: { x: subX, y: curY },
              sourceId: `${pillar.id}-${subCol.key}-header`,
              targetId: child.id
            });

            const isChildActive = child.id === activeEselon2Id;

            nodes.push({
              id: child.id,
              data: child,
              x: subX - this.nodeWidth / 2,
              y: curY,
              width: this.nodeWidth,
              height: 100,
              type: 'unit',
              color: subCol.color,
              isActive: isChildActive
            });

            // Expand sub-units under the active Eselon-2 (or UPT Eselon-3) node
            if (isChildActive) {
              // Special Case: UPT Pillar (where child is already an Eselon-3 satker like BLBC / PSO)
              if (pillar.id === 'upt-djbc' || child.level === 'eselon-3') {
                let level4Children = (child.children || []).map(sub4 => {
                  const subId = typeof sub4 === 'string' ? sub4 : (sub4.id || sub4);
                  return unitsDict[subId] || (typeof sub4 === 'object' ? sub4 : { id: subId, nama: subId, level: 'eselon-4' });
                });

                const count4 = level4Children.length;
                if (count4 > 0) {
                  const cWidth = 230;
                  const cGap = 18;
                  const totalW = count4 * cWidth + (count4 - 1) * cGap;
                  const startX = subX - totalW / 2 + cWidth / 2;
                  const horizY4 = curY + 140;

                  // Header for horizontal Eselon-4 sub-units
                  nodes.push({
                    id: `${child.id}-level4-header`,
                    type: 'header',
                    label: `SUB-UNIT ESELON IV`,
                    color: '#059669',
                    x: subX - 110,
                    y: horizY4 - 34,
                    width: 220,
                    height: 26
                  });

                  links.push({
                    source: { x: subX, y: curY + 100 },
                    target: { x: subX, y: horizY4 - 34 },
                    sourceId: child.id,
                    targetId: `${child.id}-level4-header`
                  });

                  level4Children.forEach((sub4, i4) => {
                    const child4X = startX + i4 * (cWidth + cGap);
                    const sub4Id = sub4.id || `${child.id}-sub4-${i4}`;
                    const isSelected4 = selectedNodeId === sub4Id;

                    links.push({
                      source: { x: subX, y: horizY4 - 20 },
                      target: { x: child4X, y: horizY4 },
                      sourceId: `${child.id}-level4-header`,
                      targetId: sub4Id,
                      isHorizontalBranch: true
                    });

                    nodes.push({
                      id: sub4Id,
                      data: sub4,
                      x: child4X - cWidth / 2,
                      y: horizY4,
                      width: cWidth,
                      height: 90,
                      type: 'subunit4',
                      color: '#059669',
                      isActive: isSelected4
                    });
                  });

                  curY += 250;
                } else {
                  curY += this.rowSpacing;
                }
                return;
              }

              // Standard Eselon-2 Pillars (Kantor Pusat, Kanwil, KPU)
              const rawSubChildren = child.children || [];
              const resolvedLevel3 = rawSubChildren.map(subItem => {
                const subId = typeof subItem === 'string' ? subItem : (subItem.id || subItem);
                return unitsDict[subId] || (typeof subItem === 'object' ? subItem : { id: subId, nama: subId, level: 'eselon-3' });
              });

              // Case 1: An Eselon-3 (or Eselon-4) node is selected -> collapse sibling Eselon-3 nodes
              if (activeEselon3Id) {
                const targetEselon3 = resolvedLevel3.find(sub => sub.id === activeEselon3Id) || { id: activeEselon3Id, nama: activeEselon3Id, level: 'eselon-3' };
                const eselon3Y = curY + 155;

                // Header for Selected Eselon-3
                nodes.push({
                  id: `${child.id}-selected-level3-header`,
                  type: 'header',
                  label: `UNIT TERPILIH (ESELON III)`,
                  color: '#D9B45B',
                  x: subX - 110,
                  y: curY + 115,
                  width: 220,
                  height: 28
                });

                links.push({
                  source: { x: subX, y: curY + 100 },
                  target: { x: subX, y: curY + 115 },
                  sourceId: child.id,
                  targetId: `${child.id}-selected-level3-header`
                });

                links.push({
                  source: { x: subX, y: curY + 143 },
                  target: { x: subX, y: eselon3Y },
                  sourceId: `${child.id}-selected-level3-header`,
                  targetId: targetEselon3.id
                });

                nodes.push({
                  id: targetEselon3.id,
                  data: targetEselon3,
                  x: subX - (this.nodeWidth - 10) / 2,
                  y: eselon3Y,
                  width: this.nodeWidth - 10,
                  height: 95,
                  type: 'subunit',
                  color: '#D9B45B',
                  isActive: true
                });

                // Under the selected Eselon-3 node, render its Eselon-4 children HORIZONTALLY (menyamping)
                let level4Children = (targetEselon3.children || []).map(sub4 => {
                  if (typeof sub4 === 'string') {
                    return unitsDict[sub4] || { id: sub4, nama: sub4, level: 'eselon-4' };
                  }
                  return sub4;
                });

                // Fallback for demo completeness if no children array in dict
                if (level4Children.length === 0) {
                  const titleLower = (targetEselon3.nama || '').toLowerCase();
                  const targetId = targetEselon3.id || '';

                  if (targetId.startsWith('kppbc-') || titleLower.startsWith('kppbc') || titleLower.startsWith('kantor pengawasan')) {
                    level4Children = [
                      { id: `${targetEselon3.id}-seksi-pelayanan`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-p2`, nama: 'Seksi Penindakan dan Penyidikan', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-perbendaharaan`, nama: 'Seksi Perbendaharaan', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-ki`, nama: 'Seksi Kepatuhan Internal dan Penyuluhan', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-subbag-umum`, nama: 'Subbagian Umum', level: 'eselon-4' }
                    ];
                  } else if ((titleLower.startsWith('bagian ') || targetId.startsWith('bagian-')) && !titleLower.includes('subbag')) {
                    level4Children = [
                      { id: `${targetEselon3.id}-subbag-1`, nama: 'Subbagian Tata Laksana dan Kepegawaian', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-subbag-2`, nama: 'Subbagian Kinerja dan Keuangan', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-subbag-3`, nama: 'Subbagian Rumah Tangga dan Perlengkapan', level: 'eselon-4' }
                    ];
                  } else if ((titleLower.startsWith('subdirektorat ') || targetId.startsWith('subdit-') || targetId.startsWith('subdir-')) && !titleLower.includes('seksi') && !titleLower.includes('subbag')) {
                    level4Children = [
                      { id: `${targetEselon3.id}-seksi-1`, nama: 'Seksi Standardisasi dan Perumusan Teknis', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-2`, nama: 'Seksi Bimbingan Teknis dan Supervisi', level: 'eselon-4' },
                      { id: `${targetEselon3.id}-seksi-3`, nama: 'Seksi Monitoring, Evaluasi, dan Pengendalian', level: 'eselon-4' }
                    ];
                  } else if (titleLower.startsWith('bidang ') || targetId.includes('bid-')) {
                    if (titleLower.includes('pelayanan') || titleLower.includes('fasilitas')) {
                      level4Children = [
                        { id: `${targetEselon3.id}-seksi-pelayanan-1`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai I', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-pelayanan-2`, nama: 'Seksi Pelayanan Kepabeanan dan Cukai II', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-fasilitas`, nama: 'Seksi Fasilitas Kepabeanan dan Cukai', level: 'eselon-4' }
                      ];
                    } else if (titleLower.includes('pengawasan') || titleLower.includes('penindakan') || titleLower.includes('p2') || titleLower.includes('penegakan')) {
                      level4Children = [
                        { id: `${targetEselon3.id}-seksi-intelijen`, nama: 'Seksi Intelijen', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-penindakan`, nama: 'Seksi Penindakan', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-penyidikan`, nama: 'Seksi Penyidikan dan Barang Hasil Penindakan', level: 'eselon-4' }
                      ];
                    } else if (titleLower.includes('kepatuhan') || titleLower.includes('internal') || titleLower.includes('ki')) {
                      level4Children = [
                        { id: `${targetEselon3.id}-seksi-kepatuhan`, nama: 'Seksi Kepatuhan Pelaksanaan Tugas', level: 'eselon-4' },
                        { id: `${targetEselon3.id}-seksi-manajemen-risiko`, nama: 'Seksi Manajemen Risiko', level: 'eselon-4' }
                      ];
                    }
                  }
                }

                const count4 = level4Children.length;
                const cWidth = 230;
                const cGap = 18;
                const totalW = count4 * cWidth + (count4 - 1) * cGap;
                const startX = subX - totalW / 2 + cWidth / 2;
                const horizY4 = eselon3Y + 140;

                // Header for horizontal Eselon-4 sub-units
                nodes.push({
                  id: `${targetEselon3.id}-level4-header`,
                  type: 'header',
                  label: `SUB-UNIT ESELON IV`,
                  color: '#059669',
                  x: subX - 110,
                  y: horizY4 - 34,
                  width: 220,
                  height: 26
                });

                links.push({
                  source: { x: subX, y: eselon3Y + 95 },
                  target: { x: subX, y: horizY4 - 34 },
                  sourceId: targetEselon3.id,
                  targetId: `${targetEselon3.id}-level4-header`
                });

                level4Children.forEach((sub4, i4) => {
                  const child4X = startX + i4 * (cWidth + cGap);
                  const sub4Id = sub4.id || `${targetEselon3.id}-sub4-${i4}`;
                  const isSelected4 = selectedNodeId === sub4Id;

                  links.push({
                    source: { x: subX, y: horizY4 - 20 },
                    target: { x: child4X, y: horizY4 },
                    sourceId: `${targetEselon3.id}-level4-header`,
                    targetId: sub4Id,
                    isHorizontalBranch: true
                  });

                  nodes.push({
                    id: sub4Id,
                    data: sub4,
                    x: child4X - cWidth / 2,
                    y: horizY4,
                    width: cWidth,
                    height: 90,
                    type: 'subunit4',
                    color: '#059669',
                    isActive: isSelected4
                  });
                });

              } else {
                // Case 2: Eselon-2 is selected directly -> render ALL Eselon-3 units HORIZONTALLY (menyamping)
                const count3 = resolvedLevel3.length;
                const cWidth = 240;
                const cGap = 20;
                const totalW = count3 * cWidth + (count3 - 1) * cGap;
                const startX = subX - totalW / 2 + cWidth / 2;
                const horizY3 = curY + 160;

                // Header for horizontal Eselon-3 sub-units
                nodes.push({
                  id: `${child.id}-subunits-header`,
                  type: 'header',
                  label: `SUB-UNIT ESELON III`,
                  color: '#D9B45B',
                  x: subX - 110,
                  y: curY + 115,
                  width: 220,
                  height: 28
                });

                links.push({
                  source: { x: subX, y: curY + 100 },
                  target: { x: subX, y: curY + 115 },
                  sourceId: child.id,
                  targetId: `${child.id}-subunits-header`
                });

                resolvedLevel3.forEach((sub3, i3) => {
                  const child3X = startX + i3 * (cWidth + cGap);
                  const isSelected3 = selectedNodeId === sub3.id;

                  links.push({
                    source: { x: subX, y: curY + 143 },
                    target: { x: child3X, y: horizY3 },
                    sourceId: `${child.id}-subunits-header`,
                    targetId: sub3.id,
                    isHorizontalBranch: true
                  });

                  nodes.push({
                    id: sub3.id,
                    data: sub3,
                    x: child3X - cWidth / 2,
                    y: horizY3,
                    width: cWidth,
                    height: 95,
                    type: 'subunit',
                    color: '#D9B45B',
                    isActive: isSelected3
                  });
                });
              }

              curY += 280; // Spacing for active branch
            } else {
              curY += this.rowSpacing;
            }
          });
        });
      }
    });

    return { nodes, links };
  }

  generateConnectorPath(link) {
    const sx = link.source.x;
    const sy = link.source.y;
    const tx = link.target.x;
    const ty = link.target.y;

    if (link.isHorizontalBranch) {
      const midY = sy + (ty - sy) * 0.45;
      return `M ${sx} ${sy} L ${sx} ${midY} L ${tx} ${midY} L ${tx} ${ty}`;
    }

    const midY = (sy + ty) / 2;
    return `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;
  }
}
