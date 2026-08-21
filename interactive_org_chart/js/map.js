/**
 * map.js — Interactive Indonesia Map Engine (MapLibre GL JS Edition).
 * Basemap: Pure GeoJSON (province_geo.json / 38 Provinces).
 * Master Point Layer: customs-offices-djbc-136.json + Kantor Pusat DJBC (137 Offices).
 *
 * Features:
 * - 100% Offline & file:// protocol compatible (no external tile server required)
 * - Pure GeoJSON vector rendering with WebGL GPU acceleration
 * - Choropleth Kanwil regions (province-fill, province-line, province-hover-fill)
 * - Native WebGL Point Layers for all 137 offices (pulse halo, crisp solid dot with white/gold stroke)
 * - Instant GPU-powered filtering via map.setFilter for filter pills (Semua, Kanwil, KPU, KPPBC, UPT) & Islands
 * - Interactive Office Tooltips: official name, category badge, city, province, official street address, coordinates, side panel link
 * - Interactive Province Tooltips: Kanwil name, CR code, headquarter city, subordinate office count
 * - focusOnUnit() smooth flyTo animation from side panel "Lihat lokasi pada peta" button
 * - Responsive zoom controls, legend, and live statistics bar
 */

import { getUnitIcon } from './utils.js';

export class IndonesiaMapEngine {
  constructor(containerEl, unitsDict, kanwilMapping, onSelectUnit, onOpenPanel) {
    this.container = containerEl;
    this.unitsDict = unitsDict || {};
    this.kanwilMapping = kanwilMapping || {};
    this.onSelectUnit = onSelectUnit;
    this.onOpenPanel = onOpenPanel;

    this.provinceGeoData = null;
    this.officesGeoData = null;
    this.currentIslandFilter = 'all';
    this.currentTypeFilter = 'all';

    this.map = null;
    this.activePopup = null;
    this.pinnedUnitId = null;
    this._hasInteracted = false;
    this._resizeObserver = null;

    this.ISLAND_BOUNDS = {
      'Sumatera':           [[94.0, -6.0],   [108.5,  6.0]],
      'Jawa':               [[105.0, -8.8],  [114.6, -5.8]],
      'Kalimantan':         [[107.5, -4.5],  [119.2,  4.5]],
      'Sulawesi':           [[118.5, -5.8],  [125.8,  2.0]],
      'Bali-Nusa Tenggara': [[114.3, -10.5], [125.5, -8.0]],
      'Maluku':             [[124.0, -9.0],  [135.0,  3.5]],
      'Papua':              [[130.0, -9.5],  [141.2,  0.0]],
    };
    this.INDONESIA_BOUNDS = [[94.5, -11.0], [141.2, 6.0]];

    this.CAT = {
      'kantor-pusat': { color: '#062B52', label: 'Kantor Pusat DJBC',         size: 18, border: '#D9B45B' },
      'kanwil':       { color: '#0284C7', label: 'Kantor Wilayah',            size: 14, border: '#FFFFFF' },
      'kpu':          { color: '#D97706', label: 'Kantor Pelayanan Utama',    size: 16, border: '#FFFFFF' },
      'kppbc':        { color: '#0B3A6F', label: 'Kantor Pengawasan & Pelayanan', size: 10, border: '#FFFFFF' },
      'blbc':         { color: '#10B981', label: 'Balai Laboratorium BC',     size: 14, border: '#FFFFFF' },
      'pso':          { color: '#EF4444', label: 'Pangkalan Sarana Operasi',  size: 14, border: '#FFFFFF' },
    };

    this.initUI();
  }

  // ─── Data setters ─────────────────────────────────────────────────────────

  setGeoData(data) {
    // Retained for backward compatibility
  }

  setProvinceGeoData(geojson) {
    this.provinceGeoData = geojson;
    if (this.map && this.map.loaded() && geojson) {
      this._addChoroplethLayer(geojson);
    }
  }

  setOfficesGeoData(geojson) {
    this.officesGeoData = geojson;
    if (this.map && this.map.loaded() && geojson) {
      this._addOfficesLayer(geojson);
    }
  }

  setKanwilMapping(m) { this.kanwilMapping = m || {}; }
  setUnitsDict(d) { this.unitsDict = d || {}; }

  // ─── UI Shell ─────────────────────────────────────────────────────────────

  initUI() {
    this.container.innerHTML = `
      <div class="map-page-wrapper" style="height:100%;display:flex;flex-direction:column;background:#EEF2F7;overflow:hidden;position:relative;font-family:'Poppins',sans-serif;">

        <header class="map-controls-bar" style="height:64px;background:#FFF;border-bottom:1px solid #D9E0E8;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:30;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,0.02);flex-wrap:wrap;gap:12px;">
          <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
            <span style="font-size:13.5px;font-weight:600;color:#475569;letter-spacing:0.01em;">Filter Tipe Kantor:</span>
            <div id="map-pill-filters" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <button class="map-filter-pill active" data-type="all"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#38BDF8;"></span>Semua (137)</button>
              <button class="map-filter-pill" data-type="kanwil"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#0284C7;"></span>Kanwil (20)</button>
              <button class="map-filter-pill" data-type="kpu"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#D97706;"></span>KPU (3)</button>
              <button class="map-filter-pill" data-type="kppbc"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#0B3A6F;"></span>KPPBC (104)</button>
              <button class="map-filter-pill" data-type="upt"><span class="map-pill-dot" style="width:8px;height:8px;border-radius:50%;background:#059669;"></span>UPT (9)</button>
            </div>
            <div style="height:24px;width:1px;background:#E2E8F0;margin:0 4px;"></div>
            <select id="map-filter-island" style="padding:6px 12px;font-size:12.5px;font-weight:500;color:#334155;background:#FFF;border:1px solid #D9E0E8;border-radius:8px;outline:none;cursor:pointer;font-family:inherit;">
              <option value="all">Seluruh Wilayah Indonesia</option>
              <option value="Sumatera">Sumatera</option>
              <option value="Jawa">Jawa</option>
              <option value="Kalimantan">Kalimantan</option>
              <option value="Sulawesi">Sulawesi</option>
              <option value="Bali-Nusa Tenggara">Bali &amp; Nusa Tenggara</option>
              <option value="Maluku">Maluku</option>
              <option value="Papua">Papua</option>
            </select>
          </div>
          <div style="display:flex;align-items:center;gap:6px;background:#FFF;border:1px solid #D9E0E8;border-radius:8px;padding:4px;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
            <button id="map-btn-zoom-in" style="width:32px;height:32px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#334155;" title="Perbesar (Zoom In)">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
            </button>
            <div style="width:1px;height:16px;background:#E2E8F0;"></div>
            <button id="map-btn-zoom-out" style="width:32px;height:32px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#334155;" title="Perkecil (Zoom Out)">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 12H4"/></svg>
            </button>
            <div style="width:1px;height:16px;background:#E2E8F0;"></div>
            <button id="map-btn-zoom-reset" style="width:32px;height:32px;border:none;background:transparent;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#334155;" title="Reset ke Indonesia">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8m-4-4h8"/></svg>
            </button>
            <span id="map-zoom-label" style="font-size:11.5px;font-weight:700;color:#64748B;padding:0 6px;min-width:40px;text-align:center;">z5</span>
          </div>
        </header>

        <div id="map-canvas-viewport" style="flex:1;position:relative;overflow:hidden;">
          <div id="maplibre-container" style="width:100%;height:100%;"></div>
          <div class="map-legend-card" style="position:absolute;bottom:20px;right:24px;background:#FFF;border:1px solid #D9E0E8;border-radius:12px;padding:14px 18px;box-shadow:0 4px 20px rgba(0,0,0,0.08);z-index:25;">
            <div style="font-size:12.5px;font-weight:700;color:#062B52;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>
              Legenda Peta
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;font-size:11.5px;color:#475569;font-weight:500;">
              <div style="display:flex;align-items:center;gap:8px;"><span style="width:12px;height:12px;border-radius:50%;background:#062B52;border:2px solid #D9B45B;display:inline-block;flex-shrink:0;"></span>Kantor Pusat DJBC</div>
              <div style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:#0284C7;border:2px solid #FFF;box-shadow:0 0 0 1px #0284C7;display:inline-block;flex-shrink:0;"></span>Kantor Wilayah (Kanwil)</div>
              <div style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:#D97706;border:2px solid #FFF;box-shadow:0 0 0 1px #D97706;display:inline-block;flex-shrink:0;"></span>Kantor Pelayanan Utama (KPU)</div>
              <div style="display:flex;align-items:center;gap:8px;"><span style="width:9px;height:9px;border-radius:50%;background:#0B3A6F;border:2px solid #FFF;box-shadow:0 0 0 1px #0B3A6F;display:inline-block;flex-shrink:0;"></span>Kantor Pengawasan (KPPBC)</div>
              <div style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:#10B981;border:2px solid #FFF;box-shadow:0 0 0 1px #10B981;display:inline-block;flex-shrink:0;"></span>Balai Lab Bea Cukai (BLBC)</div>
              <div style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:#EF4444;border:2px solid #FFF;box-shadow:0 0 0 1px #EF4444;display:inline-block;flex-shrink:0;"></span>Pangkalan Sarana Operasi (PSO)</div>
              <div style="margin-top:6px;padding-top:6px;border-top:1px solid #E2E8F0;font-size:10.5px;color:#94A3B8;">Klik area provinsi untuk info Kanwil</div>
            </div>
          </div>
        </div>

        <footer class="map-stats-bar" style="height:76px;background:#FFF;border-top:1px solid #D9E0E8;display:flex;align-items:center;justify-content:space-around;padding:0 32px;box-shadow:0 -2px 10px rgba(0,0,0,0.02);z-index:30;flex-shrink:0;">
          <div style="display:flex;flex-direction:column;align-items:center;"><span id="stat-count-kanwil" style="font-size:22px;font-weight:700;color:#062B52;line-height:1.2;">20</span><span style="font-size:11px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;">Kantor Wilayah</span></div>
          <div style="width:1px;height:36px;background:#E2E8F0;"></div>
          <div style="display:flex;flex-direction:column;align-items:center;"><span id="stat-count-kpu" style="font-size:22px;font-weight:700;color:#D97706;line-height:1.2;">3</span><span style="font-size:11px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;">KPU Bea Cukai</span></div>
          <div style="width:1px;height:36px;background:#E2E8F0;"></div>
          <div style="display:flex;flex-direction:column;align-items:center;"><span id="stat-count-kppbc" style="font-size:22px;font-weight:700;color:#0B3A6F;line-height:1.2;">104</span><span style="font-size:11px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;">KPPBC Pelayanan</span></div>
          <div style="width:1px;height:36px;background:#E2E8F0;"></div>
          <div style="display:flex;flex-direction:column;align-items:center;"><span id="stat-count-upt" style="font-size:22px;font-weight:700;color:#059669;line-height:1.2;">9</span><span style="font-size:11px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;">UPT (BLBC &amp; PSO)</span></div>
        </footer>

        <div id="map-unit-modal-overlay" class="modal-overlay" style="display:none;position:fixed;inset:0;background:rgba(6,43,82,0.45);backdrop-filter:blur(4px);z-index:120;align-items:center;justify-content:center;">
          <div class="modal-container" style="background:#FFF;border-radius:16px;width:90%;max-width:540px;box-shadow:0 20px 40px rgba(0,0,0,0.2);overflow:hidden;border:1px solid #D9E0E8;animation:modalPopIn 0.25s ease-out;">
            <div style="padding:20px 24px;background:linear-gradient(135deg,#062B52 0%,#0B3A6F 100%);color:#FFF;display:flex;justify-content:space-between;align-items:flex-start;">
              <div>
                <span id="map-modal-badge" style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:9999px;background:#D9B45B;color:#062B52;text-transform:uppercase;letter-spacing:0.05em;">KANWIL</span>
                <h3 id="map-modal-title" style="font-size:18px;font-weight:700;margin-top:6px;color:#FFF;line-height:1.3;">Nama Unit</h3>
                <div id="map-modal-location" style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:4px;">-</div>
              </div>
              <button id="map-modal-close" style="background:rgba(255,255,255,0.15);border:none;color:#FFF;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">&times;</button>
            </div>
            <div style="padding:24px;max-height:360px;overflow-y:auto;">
              <div style="margin-bottom:18px;">
                <div style="font-size:11.5px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Tugas Pokok</div>
                <div id="map-modal-tugas" style="font-size:13px;color:#1E293B;line-height:1.5;">Melaksanakan koordinasi, bimbingan teknis, pengendalian, evaluasi dan pelaksanaan tugas kepabeanan dan cukai.</div>
              </div>
              <div>
                <div id="map-modal-sub-label" style="font-size:11.5px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Unit Bawahan</div>
                <div id="map-modal-kppbc-list" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
              </div>
            </div>
            <div style="padding:16px 24px;background:#F8FAFC;border-top:1px solid #E2E8F0;display:flex;justify-content:flex-end;gap:12px;">
              <button id="map-modal-cancel-btn" style="padding:8px 16px;border-radius:8px;border:1px solid #CBD5E1;background:#FFF;color:#475569;font-size:13px;font-weight:600;cursor:pointer;">Tutup</button>
              <button id="map-modal-explore-btn" style="padding:8px 18px;border-radius:8px;border:none;background:#0284C7;color:#FFF;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;box-shadow:0 2px 6px rgba(2,132,199,0.3);">Eksplorasi di Pohon Organisasi &rarr;</button>
            </div>
          </div>
        </div>

      </div>
    `;

    // Filter pills
    this.container.querySelectorAll('.map-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.map-filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTypeFilter = btn.getAttribute('data-type');
        this._applyLayersFilter();
      });
    });

    // Island dropdown → fitBounds on MapLibre map
    this.container.querySelector('#map-filter-island').addEventListener('change', (e) => {
      this.currentIslandFilter = e.target.value;
      if (this.map) {
        if (e.target.value === 'all') {
          this.fitIndonesia(800);
        } else if (this.ISLAND_BOUNDS[e.target.value]) {
          this.map.fitBounds(this.ISLAND_BOUNDS[e.target.value], { padding: 40, duration: 800 });
        }
      }
      this._applyLayersFilter();
    });

    // Zoom controls
    this.container.querySelector('#map-btn-zoom-in').addEventListener('click', () => {
      this._hasInteracted = true;
      if (this.map) this.map.zoomIn();
    });
    this.container.querySelector('#map-btn-zoom-out').addEventListener('click', () => {
      this._hasInteracted = true;
      if (this.map) this.map.zoomOut();
    });
    this.container.querySelector('#map-btn-zoom-reset').addEventListener('click', () => {
      this.currentIslandFilter = 'all';
      const isl = this.container.querySelector('#map-filter-island');
      if (isl) isl.value = 'all';
      this.fitIndonesia(800);
      this._applyLayersFilter();
    });

    // Modal close handlers
    const overlay = this.container.querySelector('#map-unit-modal-overlay');
    const closeModal = () => { overlay.style.display = 'none'; };
    this.container.querySelector('#map-modal-close').addEventListener('click', closeModal);
    this.container.querySelector('#map-modal-cancel-btn').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

    this._initMapLibre();
  }

  // ─── MapLibre Init ────────────────────────────────────────────────────────

  _initMapLibre() {
    if (typeof maplibregl === 'undefined') {
      console.error('MapLibre GL JS not loaded. Add <script src="assets/lib/maplibre-gl.js"> before bundle.js in index.html.');
      return;
    }
    const mapEl = this.container.querySelector('#maplibre-container');
    if (!mapEl) return;

    // Minimal blank style: ocean background, no external tile server → file:// compatible
    const style = {
      version: 8,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      sources: {},
      layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#C8DDF0' } }]
    };

    this.map = new maplibregl.Map({
      container: mapEl,
      style,
      center: [118.0, -2.5],
      zoom: 4.8,
      minZoom: 3.5,
      maxZoom: 16,
      renderWorldCopies: false,
      attributionControl: false,
    });

    this.map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    this.map.addControl(new maplibregl.ScaleControl({ maxWidth: 120 }), 'bottom-left');

    this.map.on('zoom', () => {
      const zl = this.container.querySelector('#map-zoom-label');
      if (zl && this.map) zl.textContent = 'z' + Math.round(this.map.getZoom());
    });

    this.map.on('dragstart', () => { this._hasInteracted = true; });
    this.map.on('zoomstart', (e) => { if (e && e.originalEvent) this._hasInteracted = true; });

    this.map.on('load', () => {
      // 1. Province choropleth
      const pgd = this.provinceGeoData || window.DATA_PROVINCE_GEO;
      if (pgd) { this.provinceGeoData = pgd; this._addChoroplethLayer(pgd); }

      // 2. Customs Offices Master Point Layer
      const ogd = this.officesGeoData || window.DATA_OFFICES_GEO;
      if (ogd) { this.officesGeoData = ogd; this._addOfficesLayer(ogd); }

      this.onViewActivated();
    });

    // Setup ResizeObserver to adapt to container layout changes
    if (typeof ResizeObserver !== 'undefined' && mapEl) {
      this._resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 100 && entry.contentRect.height > 100) {
            if (this.map && this.map.loaded()) {
              this.map.resize();
              if (!this._hasInteracted) {
                this.fitIndonesia(0);
              }
            }
          }
        }
      });
      this._resizeObserver.observe(mapEl);
    }

    // Unpin tooltip when clicking blank map background (outside province polygons or office circles)
    this.map.on('click', (e) => {
      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      const officeFeatures = this.map.queryRenderedFeatures(bbox, { layers: ['office-circle'] });
      const provFeatures = this.map.queryRenderedFeatures(bbox, { layers: ['province-fill'] });
      if (officeFeatures.length === 0 && provFeatures.length === 0 && this.activePopup && this.pinnedUnitId) {
        this._unpinActivePopup();
      }
    });
  }

  onViewActivated() {
    if (!this.map) return;
    this.map.resize();
    if (!this._hasInteracted) {
      this.fitIndonesia(0);
    }
    this._applyLayersFilter();
    this.updateStats();
    this._startPulseAnimation();
  }


  fitIndonesia(duration = 600) {
    if (this.map) {
      try {
        this.map.fitBounds(this.INDONESIA_BOUNDS, {
          padding: { top: 30, bottom: 30, left: 30, right: 30 },
          maxZoom: 5.2,
          duration: duration || 0
        });
      } catch (err) {
        console.warn('fitBounds:', err);
      }
    }
  }

  // ─── Choropleth Province Layer & Region Click Tooltip ──────────────────────

  _addChoroplethLayer(geojson) {
    if (!this.map) return;
    ['province-hover-fill', 'province-line', 'province-fill'].forEach(id => {
      if (this.map.getLayer(id)) this.map.removeLayer(id);
    });
    if (this.map.getSource('provinces')) this.map.removeSource('provinces');

    this.map.addSource('provinces', { type: 'geojson', data: geojson, generateId: true });
    this.map.addLayer({ id: 'province-fill', type: 'fill', source: 'provinces', paint: { 'fill-color': ['get', 'fill_color'], 'fill-opacity': 0.28 } });
    this.map.addLayer({ id: 'province-line', type: 'line', source: 'provinces', paint: { 'line-color': '#FFFFFF', 'line-width': 0.8, 'line-opacity': 0.6 } });
    this.map.addLayer({ id: 'province-hover-fill', type: 'fill', source: 'provinces', paint: { 'fill-color': ['get', 'fill_color'], 'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 0] } });

    let hoveredId = null;
    this.map.on('mousemove', 'province-fill', (e) => {
      // Only show pointer if not over an office point
      const bbox = [[e.point.x - 4, e.point.y - 4], [e.point.x + 4, e.point.y + 4]];
      const officeFeats = this.map.queryRenderedFeatures(bbox, { layers: ['office-circle'] });
      if (officeFeats.length > 0) return;

      if (e.features.length > 0) {
        if (hoveredId !== null) this.map.setFeatureState({ source: 'provinces', id: hoveredId }, { hover: false });
        hoveredId = e.features[0].id;
        if (hoveredId !== null) this.map.setFeatureState({ source: 'provinces', id: hoveredId }, { hover: true });
        this.map.getCanvas().style.cursor = 'pointer';
      }
    });
    this.map.on('mouseleave', 'province-fill', () => {
      if (hoveredId !== null) this.map.setFeatureState({ source: 'provinces', id: hoveredId }, { hover: false });
      hoveredId = null;
      this.map.getCanvas().style.cursor = '';
    });

    // Interactive Region Click: Show Region Tooltip and toggle Side Panel when clicking a Kanwil Province Area
    this.map.on('click', 'province-fill', (e) => {
      // Ignore if clicking on an office circle
      const bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
      const officeFeats = this.map.queryRenderedFeatures(bbox, { layers: ['office-circle'] });
      if (officeFeats.length > 0) return;

      if (e.features && e.features.length > 0) {
        const feat = e.features[0];
        const crId = feat.properties.customs_region_id || 'CR';
        const kanwilId = this._resolveKanwilIdByCr(crId, feat.properties.province_code);
        const kanwilUnit = kanwilId ? (this.unitsDict[kanwilId] || { id: kanwilId, nama: feat.properties.customs_region }) : null;
        const pinnedKey = 'region-' + (feat.properties.province_code || crId);

        if (this.pinnedUnitId === pinnedKey) {
          this._unpinActivePopup();
          if (this.onOpenPanel) {
            this.onOpenPanel(null);
          }
        } else {
          this._showRegionPopup(feat.properties, [e.lngLat.lng, e.lngLat.lat]);
          if (kanwilUnit && this.onOpenPanel) {
            this.onOpenPanel(kanwilUnit);
          }
        }
      }
    });
  }

  // ─── Native WebGL Offices Point Layer ─────────────────────────────────────

  _addOfficesLayer(geojson) {
    if (!this.map) return;
    ['office-circle-hover', 'office-circle', 'office-pulse'].forEach(id => {
      if (this.map.getLayer(id)) this.map.removeLayer(id);
    });
    if (this.map.getSource('offices')) this.map.removeSource('offices');

    this.map.addSource('offices', { type: 'geojson', data: geojson, generateId: true });

    // 1. Dual-Wave Animated Pulse Layers
    this.map.addLayer({
      id: 'office-pulse-1',
      type: 'circle',
      source: 'offices',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          4, ['*', ['get', 'radius'], 1.2],
          8, ['*', ['get', 'radius'], 1.5],
          12, ['*', ['get', 'radius'], 1.8]
        ],
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.35
      }
    });

    this.map.addLayer({
      id: 'office-pulse-2',
      type: 'circle',
      source: 'offices',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          4, ['*', ['get', 'radius'], 1.5],
          8, ['*', ['get', 'radius'], 1.9],
          12, ['*', ['get', 'radius'], 2.4]
        ],
        'circle-color': ['get', 'color'],
        'circle-opacity': 0.2
      }
    });

    // 2. Main Solid Office Circle Layer
    this.map.addLayer({
      id: 'office-circle',
      type: 'circle',
      source: 'offices',
      paint: {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          4, ['get', 'radius'],
          8, ['*', ['get', 'radius'], 1.25],
          12, ['*', ['get', 'radius'], 1.6]
        ],
        'circle-color': ['get', 'color'],
        'circle-stroke-color': ['get', 'stroke_color'],
        'circle-stroke-width': [
          'interpolate', ['linear'], ['zoom'],
          4, 1.8,
          8, 2.2,
          12, 2.8
        ],
        'circle-opacity': 0.95
      }
    });

    this._startPulseAnimation();


    // Mouse Events for Office Circles
    this.map.on('mouseenter', 'office-circle', (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        const feat = e.features[0];
        if (this.pinnedUnitId === feat.properties.id) return;
        this._showOfficePopup(feat.properties, [feat.geometry.coordinates[0], feat.geometry.coordinates[1]], false);
      }
    });

    this.map.on('mouseleave', 'office-circle', () => {
      this.map.getCanvas().style.cursor = '';
      if (this.activePopup && !this.pinnedUnitId) {
        this.activePopup.remove();
        this.activePopup = null;
      }
    });

    this.map.on('click', 'office-circle', (e) => {
      if (e.features && e.features.length > 0) {
        const feat = e.features[0];
        const props = feat.properties;
        const coords = [feat.geometry.coordinates[0], feat.geometry.coordinates[1]];
        const unitId = props.id;
        const unit = (unitId && this.unitsDict[unitId]) ? this.unitsDict[unitId] : props;

        if (this.pinnedUnitId === unitId) {
          this._unpinActivePopup();
          if (this.onOpenPanel) {
            this.onOpenPanel(null);
          }
        } else {
          this._showOfficePopup(props, coords, true);
          if (this.onOpenPanel) {
            this.onOpenPanel(unit);
          }
        }
      }
    });

    this._applyLayersFilter();
  }

  // ─── GPU-Accelerated Dynamic Filter ───────────────────────────────────────

  _applyLayersFilter() {
    if (!this.map || !this.map.getLayer('office-circle')) return;

    const filters = ['all'];

    // Category filter
    const f = this.currentTypeFilter;
    if (f === 'kanwil') {
      filters.push(['in', ['get', 'unitCategory'], ['literal', ['kantor-pusat', 'kanwil']]]);
    } else if (f === 'kpu') {
      filters.push(['==', ['get', 'unitCategory'], 'kpu']);
    } else if (f === 'kppbc') {
      filters.push(['==', ['get', 'unitCategory'], 'kppbc']);
    } else if (f === 'upt') {
      filters.push(['in', ['get', 'unitCategory'], ['literal', ['blbc', 'pso']]]);
    }

    // Island filter
    if (this.currentIslandFilter !== 'all') {
      filters.push(['==', ['get', 'pulau'], this.currentIslandFilter]);
    }

    const filterExpr = filters.length > 1 ? filters : null;
    ['office-circle', 'office-pulse-1', 'office-pulse-2'].forEach(id => {
      if (this.map.getLayer(id)) this.map.setFilter(id, filterExpr);
    });
  }

  // ─── Pulse Animation Loop ─────────────────────────────────────────────────

  _startPulseAnimation() {
    if (this._pulseAnimFrame) cancelAnimationFrame(this._pulseAnimFrame);
    const DURATION = 2400; // ms per pulse cycle

    const animate = (timestamp) => {
      if (!this.map || !this.map.getLayer('office-pulse-1')) {
        this._pulseAnimFrame = requestAnimationFrame(animate);
        return;
      }

      const t = timestamp || performance.now();
      const p1 = (t % DURATION) / DURATION;
      const p2 = ((t + (DURATION / 2)) % DURATION) / DURATION;

      // Pulse 1
      const rMult1 = 1 + p1 * 1.6;
      const op1 = Math.max(0, (1 - p1) * 0.45);

      // Pulse 2 (offset)
      const rMult2 = 1 + p2 * 1.6;
      const op2 = Math.max(0, (1 - p2) * 0.45);

      try {
        this.map.setPaintProperty('office-pulse-1', 'circle-radius', [
          'interpolate', ['linear'], ['zoom'],
          4, ['*', ['get', 'radius'], rMult1],
          8, ['*', ['*', ['get', 'radius'], 1.25], rMult1],
          12, ['*', ['*', ['get', 'radius'], 1.6], rMult1]
        ]);
        this.map.setPaintProperty('office-pulse-1', 'circle-opacity', op1);

        if (this.map.getLayer('office-pulse-2')) {
          this.map.setPaintProperty('office-pulse-2', 'circle-radius', [
            'interpolate', ['linear'], ['zoom'],
            4, ['*', ['get', 'radius'], rMult2],
            8, ['*', ['*', ['get', 'radius'], 1.25], rMult2],
            12, ['*', ['*', ['get', 'radius'], 1.6], rMult2]
          ]);
          this.map.setPaintProperty('office-pulse-2', 'circle-opacity', op2);
        }
      } catch (err) {
        // Safe ignore during style reloads
      }

      this._pulseAnimFrame = requestAnimationFrame(animate);
    };

    this._pulseAnimFrame = requestAnimationFrame(animate);
  }

  _stopPulseAnimation() {
    if (this._pulseAnimFrame) {
      cancelAnimationFrame(this._pulseAnimFrame);
      this._pulseAnimFrame = null;
    }
  }


  // ─── Interactive Region Click Popup (Kanwil Region Tooltip) ───────────────

  _showRegionPopup(props, lngLat) {
    if (this.activePopup) { this.activePopup.remove(); this.activePopup = null; }

    const provName = props.province_name || props.PROVINSI || props.NAME_1 || 'Provinsi Indonesia';
    const kanwilName = props.customs_region || 'Wilayah Bea dan Cukai';
    const crId = props.customs_region_id || 'CR';
    const kanwilLoc = props.kanwil_location || '-';
    const fillColor = props.fill_color || '#0284C7';
    const mappingStatus = props.mapping_status || '';

    const kanwilId = this._resolveKanwilIdByCr(crId, props.province_code);
    const kanwilUnit = kanwilId ? (this.unitsDict[kanwilId] || { id: kanwilId, nama: kanwilName }) : null;
    const subs = kanwilId ? (this.kanwilMapping[kanwilId] || []) : [];

    const lat = lngLat[1]; const lng = lngLat[0];
    const coordText = `${lat > 0 ? lat.toFixed(3) + '° LU' : Math.abs(lat).toFixed(3) + '° LS'}, ${lng.toFixed(3)}° BT`;

    const statusBadge = mappingStatus === 'FULL_PROVINCE_WITH_KPU_EXCEPTION' 
      ? '<span style="font-size:9.5px;color:#FCD34D;background:rgba(217,119,6,0.2);padding:2px 6px;border-radius:4px;border:1px solid rgba(217,119,6,0.4);">Termasuk Yurisdiksi Khusus KPU</span>' 
      : (crId === 'MULTI' ? '<span style="font-size:9.5px;color:#93C5FD;background:rgba(2,132,199,0.2);padding:2px 6px;border-radius:4px;border:1px solid rgba(2,132,199,0.4);">2 Wilayah Kerja Kanwil (Jatim I & II)</span>' : '');

    const html = `
      <div style="min-width:235px;max-width:310px;font-family:'Poppins',sans-serif;padding:2px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;">
          <div style="font-size:13px;font-weight:700;color:#FFF;line-height:1.3;white-space:normal;">${provName}</div>
          <button id="mlgl-popup-close" class="map-tooltip-close-btn" title="Tutup" style="color:#FFFFFF;">&times;</button>
        </div>
        <div style="font-size:10.5px;color:#E2E8F0;margin-bottom:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="background:${fillColor};color:#FFF;font-weight:700;font-size:9px;padding:2px 6px;border-radius:4px;">${crId}</span>
          <span style="font-weight:600;color:#38BDF8;">${kanwilName}</span>
        </div>
        <div style="font-size:10px;color:#94A3B8;margin-bottom:6px;">
          <span>Kedudukan Kanwil: <strong style="color:#FFF;">${kanwilLoc}</strong></span>
          ${subs.length > 0 ? ` &bull; <strong style="color:#D9B45B;">${subs.length} KPPBC Bawahan</strong>` : ''}
        </div>
        ${statusBadge ? `<div style="margin-bottom:6px;">${statusBadge}</div>` : ''}
        <div style="font-size:10px;color:#E2E8F0;background:rgba(255,255,255,0.08);padding:4px 7px;border-radius:4px;border:1px solid rgba(255,255,255,0.12);margin-bottom:2px;">
          <span style="color:#38BDF8;">📍 Koordinat Titik:</span>
          <span style="font-family:monospace;color:#FFF;font-weight:600;"> ${coordText}</span>
        </div>
      </div>
    `;

    const popup = new maplibregl.Popup({
      closeButton: false, closeOnClick: false,
      className: 'djbc-map-popup', offset: 12, maxWidth: '330px'
    }).setLngLat(lngLat).setHTML(html).addTo(this.map);

    this.activePopup = popup;
    this.pinnedUnitId = 'region-' + (props.province_code || crId);

    setTimeout(() => {
      const cb = document.getElementById('mlgl-popup-close');
      if (cb) cb.addEventListener('click', (e) => { e.stopPropagation(); this._unpinActivePopup(); });
    }, 50);
  }

  _resolveKanwilIdByCr(crId, provinceCode) {
    const map = {
      'CR01': 'kanwil-aceh',
      'CR02': 'kanwil-sumut',
      'CR03': 'kanwil-riau',
      'CR04': 'kanwil-kepri',
      'CR05': 'kanwil-sumbagtim',
      'CR06': 'kanwil-sumbagbar',
      'CR07': 'kanwil-banten',
      'CR08': 'kanwil-jakarta',
      'CR09': 'kanwil-jabar',
      'CR10': 'kanwil-jateng-diy',
      'CR11': 'kanwil-jatim-i',
      'CR12': 'kanwil-jatim-ii',
      'CR13': 'kanwil-bali-ntb-ntt',
      'CR14': 'kanwil-kalbar',
      'CR15': 'kanwil-kalsel',
      'CR16': 'kanwil-kaltim',
      'CR17': 'kanwil-sulbagsel',
      'CR18': 'kanwil-sulbagut',
      'CR19': 'kanwil-maluku',
      'CR20': 'kanwil-papua'
    };
    if (crId === 'MULTI' && provinceCode === '35') {
      return 'kanwil-jatim-i';
    }
    return map[crId] || null;
  }

  // ─── Marker / Office Popup ────────────────────────────────────────────────

  _showOfficePopup(props, lngLat, pinned) {
    if (this.activePopup) { this.activePopup.remove(); this.activePopup = null; }

    const lat = props.lat; const lng = props.lng;
    const coordText = lat !== undefined
      ? `${lat > 0 ? lat + '\u00b0 LU' : Math.abs(lat) + '\u00b0 LS'}, ${lng}\u00b0 BT (${lat}, ${lng})`
      : 'Wilayah Indonesia';

    const locationText = props.lokasi ? `<div style="font-size:10.5px;color:#CBD5E1;margin-bottom:4px;">🏢 ${props.lokasi}</div>` : '';
    const addressText = props.address ? `<div style="font-size:9.5px;color:#94A3B8;margin-bottom:6px;line-height:1.35;font-style:italic;">${props.address}</div>` : '';
    const catLabel = props.category_label || this.CAT[props.unitCategory]?.label || 'Unit DJBC';
    const unitIcon = getUnitIcon(props, this.unitsDict);

    const html = `
      <div style="min-width:225px;max-width:300px;font-family:'Poppins',sans-serif;padding:2px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;">
          <div style="font-size:12.5px;font-weight:700;color:#FFF;line-height:1.3;white-space:normal;display:flex;align-items:center;gap:6px;">
            <span style="font-size:14px;flex-shrink:0;">${unitIcon}</span>
            <span>${props.nama}</span>
          </div>
          ${pinned ? '<button id="mlgl-popup-close" class="map-tooltip-close-btn" title="Tutup" style="color:#FFFFFF;">&times;</button>' : ''}
        </div>
        <div style="font-size:10px;color:#94A3B8;margin-bottom:4px;"><span style="color:#D9B45B;font-weight:600;">${catLabel}</span>${props.pulau ? ' &bull; ' + props.pulau : ''}</div>
        ${locationText}
        ${addressText}
        <div style="font-size:10px;color:#E2E8F0;background:rgba(255,255,255,0.08);padding:4px 7px;border-radius:4px;border:1px solid rgba(255,255,255,0.12);margin-bottom:2px;">
          <span style="color:#38BDF8;">📍 Koordinat:</span>
          <span style="font-family:monospace;color:#FFF;font-weight:600;"> ${coordText}</span>
        </div>
      </div>
    `;

    const popup = new maplibregl.Popup({
      closeButton: false, closeOnClick: false,
      className: 'djbc-map-popup', offset: 14, maxWidth: '310px'
    }).setLngLat(lngLat).setHTML(html).addTo(this.map);

    this.activePopup = popup;
    if (pinned) this.pinnedUnitId = props.id;

    setTimeout(() => {
      const cb = document.getElementById('mlgl-popup-close');
      if (cb) cb.addEventListener('click', (e) => { e.stopPropagation(); this._unpinActivePopup(); });
    }, 50);
  }

  _unpinActivePopup() {
    if (this.activePopup) { this.activePopup.remove(); this.activePopup = null; }
    this.pinnedUnitId = null;
  }

  // ─── focusOnUnit (called from side panel "Lihat lokasi di peta" button) ───

  focusOnUnit(unitOrId) {
    if (!unitOrId || !this.map) return;
    const unitId = typeof unitOrId === 'string' ? unitOrId : (unitOrId.id || '');

    // Search in offices GeoJSON
    const ogd = this.officesGeoData || window.DATA_OFFICES_GEO;
    let matchFeat = null;
    if (ogd && ogd.features) {
      matchFeat = ogd.features.find(f => f.properties.id === unitId || f.properties.unit_id === unitId);
      if (!matchFeat) {
        // Trace up hierarchy
        let curr = unitId;
        const visited = new Set();
        while (curr && !visited.has(curr)) {
          visited.add(curr);
          const u = this.unitsDict[curr];
          if (!u) break;
          matchFeat = ogd.features.find(f => f.properties.id === curr);
          if (matchFeat) break;
          curr = u.parent;
        }
      }
    }

    if (!matchFeat && ogd && ogd.features) {
      matchFeat = ogd.features[0]; // fallback to Kantor Pusat
    }

    if (!matchFeat) return;

    this._hasInteracted = true;
    const props = matchFeat.properties;
    const coords = matchFeat.geometry.coordinates;
    const isKppbc = props.unitCategory === 'kppbc';
    const filterType = isKppbc ? 'kppbc' : (props.unitCategory in ['blbc', 'pso'] ? 'upt' : (props.unitCategory === 'kpu' ? 'kpu' : 'kanwil'));

    this.currentTypeFilter = 'all'; // allow viewing in context
    this.container.querySelectorAll('.map-filter-pill').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-type') === 'all');
    });
    this.currentIslandFilter = 'all';
    const isl = this.container.querySelector('#map-filter-island');
    if (isl) isl.value = 'all';
    this._applyLayersFilter();

    const zoom = props.zoom || (isKppbc ? 11 : (props.unitCategory === 'kanwil' ? 8 : 10));
    this.map.flyTo({ center: coords, zoom, duration: 1200, essential: true });
    this.map.once('moveend', () => {
      this._showOfficePopup(props, coords, true);
    });
  }

  // ─── Detail Modal ─────────────────────────────────────────────────────────

  openUnitModal(item) {
    const overlay = this.container.querySelector('#map-unit-modal-overlay');
    if (!overlay) return;
    const ud = this.unitsDict[item.id] || {};
    const cfg = this.CAT[item.unitCategory] || this.CAT['kanwil'];

    this.container.querySelector('#map-modal-title').textContent = item.nama;
    const badge = this.container.querySelector('#map-modal-badge');
    badge.textContent = (item.category_label || cfg.label || item.unitCategory || 'Unit').toUpperCase();
    badge.style.background = cfg.color || '#D9B45B';
    badge.style.color = '#FFF';
    this.container.querySelector('#map-modal-location').textContent = `Wilayah: ${item.pulau || 'Indonesia'} \u2022 Koordinat: ${item.lat}, ${item.lng}`;
    this.container.querySelector('#map-modal-tugas').textContent = ud.tugas || 'Melaksanakan pelayanan, pengawasan, koordinasi teknis operasional, dan kepatuhan internal di bidang kepabeanan dan cukai.';

    const kl = this.container.querySelector('#map-modal-kppbc-list');
    kl.innerHTML = '';
    const sl = this.container.querySelector('#map-modal-sub-label');
    const subs = this.kanwilMapping[item.id] || ud.children || [];

    if (item.unitCategory === 'kanwil' && subs.length > 0) {
      sl.textContent = `Kantor Pengawasan (KPPBC) Bawahan (${subs.length} Unit):`;
      subs.forEach(kppbcId => {
        const u = this.unitsDict[kppbcId] || { nama: kppbcId };
        const chip = document.createElement('div');
        chip.style.cssText = 'padding:6px 12px;background:#F1F5F9;border-radius:6px;font-size:12px;font-weight:600;border:1px solid #CBD5E1;color:#062B52;cursor:pointer;transition:all 0.15s;';
        chip.textContent = u.nama || kppbcId;
        chip.addEventListener('mouseenter', () => { chip.style.background = '#E0F2FE'; chip.style.borderColor = '#0284C7'; chip.style.color = '#0284C7'; });
        chip.addEventListener('mouseleave', () => { chip.style.background = '#F1F5F9'; chip.style.borderColor = '#CBD5E1'; chip.style.color = '#062B52'; });
        chip.addEventListener('click', () => { overlay.style.display = 'none'; if (this.onSelectUnit) this.onSelectUnit(kppbcId); });
        kl.appendChild(chip);
      });
    } else {
      sl.textContent = 'Wilayah Kerja & Fasilitas:';
      kl.innerHTML = `<span style="font-size:12px;color:#64748B;">${item.address || 'Melayani kawasan pelabuhan, bandar udara, dan kawasan pabean di wilayah yurisdiksi.'}</span>`;
    }

    this.container.querySelector('#map-modal-explore-btn').onclick = () => {
      overlay.style.display = 'none';
      if (this.onSelectUnit) this.onSelectUnit(item.id);
    };
    overlay.style.display = 'flex';
  }

  // ─── Stats ────────────────────────────────────────────────────────────────

  updateStats() {
    const el = (id) => this.container.querySelector('#' + id);
    if (el('stat-count-kanwil')) el('stat-count-kanwil').textContent = '20';
    if (el('stat-count-kpu')) el('stat-count-kpu').textContent = '3';
    if (el('stat-count-kppbc')) el('stat-count-kppbc').textContent = '104';
    if (el('stat-count-upt')) el('stat-count-upt').textContent = '9';
  }

  render() {
    this._applyLayersFilter();
    this.updateStats();
  }
}
