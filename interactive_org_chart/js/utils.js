/**
 * utils.js — General utility functions for DOM manipulation, debouncing, and SVG calculations.
 */

export function createElement(tag, className = '', attributes = {}, children = []) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  
  for (const [key, val] of Object.entries(attributes)) {
    if (key.startsWith('on') && typeof val === 'function') {
      el.addEventListener(key.substring(2).toLowerCase(), val);
    } else if (val !== null && val !== undefined) {
      el.setAttribute(key, val);
    }
  }

  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement || child instanceof SVGElement) {
      el.appendChild(child);
    }
  });

  return el;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function formatBadgeClass(typeStr) {
  if (!typeStr) return 'badge-policy';
  const str = typeStr.toLowerCase();
  if (str.includes('root') || str.includes('eselon-1')) return 'badge-root';
  if (str.includes('manajerial') || str.includes('sekretariat')) return 'badge-manajerial';
  if (str.includes('kanwil') || str.includes('regional')) return 'badge-regional';
  if (str.includes('kppbc') || str.includes('pelayanan')) return 'badge-kppbc';
  if (str.includes('upt') || str.includes('laboratorium') || str.includes('balai')) return 'badge-upt';
  if (str.includes('pengkaji')) return 'badge-pengkaji';
  return 'badge-policy';
}

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Returns the contextual emoji icon based on the unit type, role, and jurisdiction.
 * @param {string|Object} unitOrId - Unit ID string or Unit object
 * @param {Object} [unitsDict] - Optional units dictionary for lookup
 * @returns {string} Emoji character
 */
export function getUnitIcon(unitOrId, unitsDict = null) {
  if (!unitOrId) return '🏢';
  let unit = typeof unitOrId === 'object' ? unitOrId : (unitsDict ? unitsDict[unitOrId] : null);
  const id = (typeof unitOrId === 'string' ? unitOrId : (unit?.id || '')).toLowerCase();
  const nama = ((unit?.nama || unit?.name || unit?.unit_name || unit?.title || '') + ' ' + id).toLowerCase();
  const level = (unit?.level || '').toLowerCase();

  // 1. Kantor Pusat DJBC & Direktorat Teknis
  if (id === 'djbc' || id === 'kantor-pusat' || id === 'kp01') return '🏛️';
  if (id === 'setditjen' || id.startsWith('setditjen-') || id.startsWith('bagian-') || nama.includes('sekretariat')) return '📋';
  if (id === 'dit-teknis-kepab' || id.startsWith('dit-teknis-kepab-') || nama.includes('teknis kepabeanan')) return '📦';
  if (id === 'dit-fasilitas-kepab' || id.startsWith('dit-fasilitas-kepab-') || nama.includes('fasilitas kepabeanan')) return '🏭';
  if (id === 'dit-audit' || id.startsWith('dit-audit-') || (id.startsWith('dit-') && nama.includes('audit'))) return '🔍';
  if (id === 'dit-ikc' || id.startsWith('dit-ikc-') || (id.startsWith('dit-') && (nama.includes('informasi') || nama.includes('ikc')))) return '💻';
  if (id === 'dit-p2' || id.startsWith('dit-p2-') || (id.startsWith('dit-') && (nama.includes('penindakan') || nama.includes('penyidikan')))) return '🛡️';
  if (id === 'dit-ksikc' || id.startsWith('dit-ksikc-') || id === 'dit-kial' || id.startsWith('dit-kial-') || (id.startsWith('dit-') && (nama.includes('internasional') || nama.includes('ksikc') || nama.includes('kial')))) return '🌐';
  if (id === 'dit-pps' || id.startsWith('dit-pps-') || (id.startsWith('dit-') && (nama.includes('penerimaan') || nama.includes('pps')))) return '💰';
  if (id === 'dit-ki' || id.startsWith('dit-ki-') || (id.startsWith('dit-') && (nama.includes('kepatuhan internal') || nama.includes('dit-ki')))) return '⚖️';
  if (id === 'dit-cukai' || id.startsWith('dit-cukai-') || (id.startsWith('dit-') && nama.includes('direktorat cukai'))) return '🏷️';
  if (id.startsWith('tp-') || id.includes('tenaga-pengkaji') || nama.includes('tenaga pengkaji')) return '💡';

  // 2. Unit Pelaksana Teknis (UPT)
  if (id.startsWith('blbc') || nama.includes('balai laboratorium') || nama.includes('blbc')) {
    if (id.includes('pengujian') || nama.includes('pengujian')) return '🧪';
    if (id.includes('mutu') || nama.includes('mutu')) return '🔬';
    return '🔬';
  }
  if (id.startsWith('pso') || nama.includes('pangkalan sarana operasi') || nama.includes('pso')) {
    if (id.includes('pengawakan') || id.includes('kelaiklautan') || nama.includes('pengawakan') || nama.includes('kelaiklautan')) return '🧭';
    if (id.includes('telekomunikasi') || nama.includes('telekomunikasi')) return '📡';
    return '⚓';
  }

  // 3. Kantor Wilayah (Kanwil)
  if (id.startsWith('kanwil') || id.startsWith('kw') || nama.includes('kantor wilayah') || nama.includes('kanwil')) return '🏢';

  // 4. Kantor Pelayanan Utama (KPU)
  if (id.startsWith('kpu') || id.startsWith('kpu0') || nama.includes('kantor pelayanan utama') || nama.includes('kpu')) {
    if (nama.includes('tanjung priok') || nama.includes('priok') || nama.includes('tipe a')) return '🚢';
    if (nama.includes('batam') || nama.includes('tipe b')) return '🏝️';
    if (nama.includes('soekarno') || nama.includes('hatta') || nama.includes('soetta') || nama.includes('tipe c')) return '✈️';
    return '🚢';
  }

  // 5. Kantor Pengawasan dan Pelayanan (KPPBC)
  if (nama.includes('cukai') || nama.includes('tmc') || nama.includes('kudus') || nama.includes('kediri')) return '🏭';
  if (nama.includes('pasar baru') || nama.includes('kantor pos') || nama.includes('pos')) return '📦';
  if (nama.includes('bandara') || nama.includes('kualanamu') || nama.includes('ngurah rai') || nama.includes('juanda') || nama.includes('airport')) return '✈️';
  if (nama.includes('pelabuhan') || nama.includes('perak') || nama.includes('tanjung mas') || nama.includes('belawan') || nama.includes('laut')) return '🚢';
  if (nama.includes('pratama') || nama.includes('perbatasan') || nama.includes('entikong') || nama.includes('atambua') || nama.includes('skouw') || nama.includes('nanga badau') || nama.includes('sebatik') || nama.includes('nunukan')) return '🚩';
  if (nama.includes('tmp a') || nama.includes('tipe madya pabean a')) return '🏬';
  if (nama.includes('tmp b') || nama.includes('tipe madya pabean b')) return '🚛';
  if (nama.includes('tmp c') || nama.includes('tipe madya pabean c')) return '🏬';
  if (id.startsWith('kppbc') || id.startsWith('kpp') || nama.includes('kppbc')) return '🏬';

  // 6. Sub-Unit Eselon IV (Seksi / Subbagian)
  if (nama.includes('umum') && (nama.includes('kepatuhan') || nama.includes('ki'))) return '📁';
  if (nama.includes('pelayanan') || nama.includes('pkc') || nama.includes('pabean')) return '📄';
  if (nama.includes('penindakan') || nama.includes('penyidikan') || nama.includes('p2') || nama.includes('intelijen')) return '🚨';
  if (nama.includes('perbendaharaan') || nama.includes('keuangan')) return '💵';
  if (nama.includes('penyuluhan') || nama.includes('layanan informasi') || nama.includes('pli') || nama.includes('humas')) return '📢';
  if (nama.includes('pengolahan data') || nama.includes('administrasi dokumen') || nama.includes('pdad') || nama.includes('ti') || nama.includes('tik')) return '💾';
  if (nama.includes('kepatuhan internal') || nama.includes('ki')) return '⚖️';
  if (nama.includes('bimbingan teknis') || nama.includes('supervisi')) return '📋';
  if (nama.includes('monitoring') || nama.includes('evaluasi')) return '📊';
  if (nama.includes('standardisasi') || nama.includes('perumusan')) return '📝';

  // Level fallbacks
  if (level === 'group') return '📁';
  if (level === 'eselon-1') return '🏛️';
  if (level === 'eselon-2') return '🏢';
  if (level === 'eselon-3') return '🏬';
  if (level === 'eselon-4') return '📄';

  return '🏢';
}

if (typeof window !== 'undefined') {
  window.getUnitIcon = getUnitIcon;
}

