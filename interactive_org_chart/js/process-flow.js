/**
 * process-flow.js — Business Process Flow & SOP Interactive Catalog & Modal Detail Engine.
 * 1. Initial State: Displays interactive list/catalog of all 8 DJBC Business Processes & SOPs with filters.
 * 2. On Selection: Opens a comprehensive pop-up modal containing visual timeline stepper, detailed steps,
 *    involved unit chips (with side panel bridge), document outputs, and previous/next process navigation.
 */

import { getUnitIcon } from './utils.js';

export class ProcessFlowEngine {
  constructor(containerEl, processData, onSelectUnit, onNavigateUnit) {
    this.container = containerEl;
    this.processData = processData && processData.proses ? processData.proses : (Array.isArray(processData) ? processData : []);
    this.onSelectUnit = onSelectUnit || (() => {});
    this.onNavigateUnit = onNavigateUnit || (() => {});
    this.currentProcessIndex = 0;
    this.currentStepIndex = 0;
    this.selectedCategory = 'ALL';
    this.searchQuery = '';
    this.isModalOpen = false;
    this.boundKeyHandler = null;

    this.initKeyboardListener();
  }

  initKeyboardListener() {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    if (this.boundKeyHandler && window.removeEventListener) {
      window.removeEventListener('keydown', this.boundKeyHandler);
    }
    this.boundKeyHandler = (e) => {
      // Only process when container is visible in DOM
      if (!this.container || !this.container.offsetParent) return;

      if (e.key === 'Escape' && this.isModalOpen) {
        e.preventDefault();
        this.closeModal();
      } else if (this.isModalOpen) {
        if (e.altKey && e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevProcess();
        } else if (e.altKey && e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextProcess();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevStep();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextStep();
        }
      }
    };
    window.addEventListener('keydown', this.boundKeyHandler);
  }

  setProcessData(data) {
    this.processData = data && data.proses ? data.proses : (Array.isArray(data) ? data : []);
    this.currentProcessIndex = 0;
    this.currentStepIndex = 0;
    this.render();
  }

  openModal(processIndex = 0, stepIndex = 0) {
    this.currentProcessIndex = Math.max(0, Math.min(processIndex, this.processData.length - 1));
    this.currentStepIndex = stepIndex;
    this.isModalOpen = true;
    this.render();
  }

  closeModal() {
    this.isModalOpen = false;
    this.render();
  }

  nextProcess() {
    if (this.currentProcessIndex < this.processData.length - 1) {
      this.currentProcessIndex++;
      this.currentStepIndex = 0;
      this.render();
    }
  }

  prevProcess() {
    if (this.currentProcessIndex > 0) {
      this.currentProcessIndex--;
      this.currentStepIndex = 0;
      this.render();
    }
  }

  nextStep() {
    const currentProcess = this.processData[this.currentProcessIndex];
    if (currentProcess && currentProcess.tahapan && this.currentStepIndex < currentProcess.tahapan.length - 1) {
      this.currentStepIndex++;
      this.render();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.currentStepIndex = Math.max(0, this.currentStepIndex);
      this.render();
    }
  }

  goToStep(idx) {
    this.currentStepIndex = idx;
    this.render();
  }

  filterProcesses() {
    return this.processData.filter(proc => {
      const matchCategory = this.selectedCategory === 'ALL' || proc.kategori === this.selectedCategory;
      const query = this.searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        proc.nama.toLowerCase().includes(query) ||
        (proc.deskripsi_singkat && proc.deskripsi_singkat.toLowerCase().includes(query)) ||
        (proc.dasar_hukum_utama && proc.dasar_hukum_utama.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });
  }

  render() {
    if (!this.container) return;

    if (!this.processData.length) {
      this.container.innerHTML = `<div style="padding:40px; text-align:center; color:#64748B;">Data alur proses tidak ditemukan.</div>`;
      return;
    }

    const filtered = this.filterProcesses();
    const categories = ['ALL', ...new Set(this.processData.map(p => p.kategori).filter(Boolean))];

    const currentProcess = this.processData[this.currentProcessIndex] || this.processData[0];
    const steps = currentProcess.tahapan || [];
    const activeStep = steps[this.currentStepIndex] || steps[0] || {};
    const totalProcesses = this.processData.length;
    const totalSteps = steps.length;

    // Build Main List View HTML
    const listHtml = `
      <div class="process-catalog-view" style="padding: 16px 24px; max-width: 1400px; margin: 0 auto; width: 100%; height: calc(100vh - 76px); display: flex; flex-direction: column; box-sizing: border-box; overflow-y: auto; font-family:'Poppins',sans-serif;">
        
        <!-- Header Banner & Intro -->
        <div style="margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 3px;">
              <span class="badge" style="background:#0B3A6F15; color:#0B3A6F; font-size:10.5px; font-weight:700; border:1px solid #0B3A6F30; text-transform:uppercase;">
                STANDAR OPERASIONAL PROSEDUR (SOP)
              </span>
              <span class="badge" style="background:#FEF3C7; color:#92400E; font-size:10.5px; font-weight:700; border:1px solid #FDE68A;">
                ${this.processData.length} Alur Bisnis Utama
              </span>
            </div>
            <h2 style="font-size: 20px; font-weight: 800; color: #001631; margin: 0; line-height: 1.2;">
              Katalog Alur Kerja &amp; SOP DJBC
            </h2>
            <p style="font-size: 12px; color: #64748B; margin: 3px 0 0 0;">
              Pilih salah satu alur kerja di bawah untuk membuka dialog interaktif tahapan proses, SLA, dan unit kerja yang terlibat.
            </p>
          </div>

          <!-- Search & Filter Controls -->
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <!-- Search Box -->
            <div style="position: relative; min-width: 240px;">
              <input type="text" id="sop-search-input" placeholder="Cari nama SOP, regulasi, kata kunci..." value="${this.searchQuery}" style="width: 100%; padding: 6px 12px 6px 32px; font-size: 12px; border: 1px solid #CBD5E1; border-radius: 8px; background: #FFFFFF; font-family: inherit;">
              <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94A3B8; font-size: 13px;">🔍</span>
            </div>

            <!-- Tutorial Beacon Trigger Button -->
            <button id="process-tour-btn" class="btn btn-outline" style="font-size:11.5px; font-weight:600; padding:5px 12px; gap:6px; border-radius:20px; cursor:pointer;" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.startProcessTour(true);}" title="Buka Panduan Interaktif Alur Kerja">
              <span>💡</span>
              <span>Panduan SOP</span>
            </button>
          </div>
        </div>

        <!-- Category Filter Tabs -->
        <div id="sop-categories-container" style="display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
          ${categories.map(cat => {
            const isSelected = this.selectedCategory === cat;
            const count = cat === 'ALL' ? this.processData.length : this.processData.filter(p => p.kategori === cat).length;
            const label = cat === 'ALL' ? 'Semua Alur Kerja' : cat;
            return `
              <button class="sop-filter-btn" data-category="${cat}" style="padding: 5px 12px; border-radius: 20px; font-size: 11.5px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: 1px solid ${isSelected ? '#0B3A6F' : '#E2E8F0'}; background: ${isSelected ? '#0B3A6F' : '#FFFFFF'}; color: ${isSelected ? '#FFFFFF' : '#475569'}; font-family: inherit;">
                ${label} (${count})
              </button>
            `;
          }).join('')}
        </div>

        <!-- SOP Cards Grid List (Compact & Visible on 1 Page) -->
        <div id="sop-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-bottom: 16px;">
          ${filtered.map((proc) => {
            const originalIndex = this.processData.indexOf(proc);
            const stepCount = proc.tahapan ? proc.tahapan.length : 0;
            return `
              <div class="card sop-card-item" data-process-idx="${originalIndex}">
                <div>
                  <!-- Top Badge Line -->
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; flex-wrap: wrap; gap: 4px;">
                    <span class="badge" style="background: #F1F5F9; color: #0B3A6F; font-size: 10.5px; font-weight: 700; border: 1px solid #E2E8F0; padding: 2px 6px;">
                      ${proc.kategori || 'SOP DJBC'}
                    </span>
                    <span style="font-size: 10.5px; font-weight: 800; color: #D9B45B; background: #0B3A6F; padding: 2px 6px; border-radius: 4px;">
                      SOP #${String(originalIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <!-- SOP Title -->
                  <h3 style="font-size: 13.5px; font-weight: 800; color: #001631; margin: 0 0 4px 0; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${proc.nama}">
                    ${proc.nama}
                  </h3>

                  <!-- SOP Short Description -->
                  <p style="font-size: 11.5px; color: #64748B; line-height: 1.4; margin: 0 0 8px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${proc.deskripsi_singkat || ''}
                  </p>
                </div>

                <!-- Footer Metadata & Action -->
                <div>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; font-size: 10.5px;">
                    <span class="badge" style="background:#EFF6FF; color:#1D4ED8; font-weight:600; border:1px solid #DBEAFE; padding: 2px 6px;">
                      📌 ${stepCount} Tahap
                    </span>
                    ${proc.sla_total ? `
                      <span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:600; border:1px solid #FDE68A; padding: 2px 6px;">
                        ⏱ ${proc.sla_total}
                      </span>
                    ` : ''}
                    ${proc.dasar_hukum_utama ? `
                      <span class="badge" style="background:#F8FAFC; color:#64748B; font-weight:500; border:1px solid #E2E8F0; padding: 2px 6px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${proc.dasar_hukum_utama}">
                        ⚖ ${proc.dasar_hukum_utama}
                      </span>
                    ` : ''}
                  </div>

                  <button class="btn btn-primary btn-open-sop" data-process-idx="${originalIndex}" style="width: 100%; justify-content: center; padding: 6px 10px; font-size: 11.5px; font-weight: 700; border-radius: 6px;">
                    <span>Buka Detail Alur Kerja</span>
                    <span style="font-size: 13px;">➔</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        ${filtered.length === 0 ? `
          <div style="padding: 30px; text-align: center; background: #FFFFFF; border-radius: 12px; border: 1px dashed #CBD5E1; color: #64748B;">
            <div style="font-size: 28px; margin-bottom: 6px;">🔍</div>
            <div style="font-weight: 700; font-size: 14px; color: #001631;">Tidak ada Alur Kerja yang cocok</div>
            <div style="font-size: 12px; margin-top: 4px;">Coba ubah kata kunci pencarian atau pilih kategori lain.</div>
          </div>
        ` : ''}

      </div>
    `;

    // Build Modal Pop-Up HTML if Modal is Open
    const modalHtml = this.isModalOpen ? `
      <div id="sop-detail-modal-overlay" style="position: fixed; inset: 0; background: rgba(6, 35, 71, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; font-family:'Poppins',sans-serif; animation: fadeIn 0.2s ease;">
        
        <div id="sop-detail-modal-dialog" style="background: #FFFFFF; border-radius: 18px; width: 100%; max-width: 1200px; max-height: 92vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(217, 180, 91, 0.25); overflow: hidden; position: relative;">
          
          <!-- MODAL HEADER: Title, Badges & Process Navigation -->
          <div style="padding: 14px 20px; background: linear-gradient(135deg, #0B3A6F 0%, #062347 100%); color: #FFFFFF; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; border-bottom: 2px solid #D9B45B; flex-shrink: 0;">
            
            <!-- Left: Title & Badges -->
            <div style="flex: 1; min-width: 240px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                <span style="font-size: 11px; font-weight: 800; color: #001631; background: #D9B45B; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">
                  ${currentProcess.kategori || 'SOP & ALUR KERJA'}
                </span>
                <span style="font-size: 11px; font-weight: 700; color: #FFFFFF; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 4px;">
                  Alur ${this.currentProcessIndex + 1} / ${totalProcesses}
                </span>
                ${currentProcess.sla_total ? `
                  <span style="font-size: 11px; font-weight: 600; color: #FEF3C7; background: rgba(254, 243, 199, 0.15); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(254, 243, 199, 0.3);">
                    ⏱ Total SLA: ${currentProcess.sla_total}
                  </span>
                ` : ''}
              </div>
              <h2 style="font-size: 17px; font-weight: 800; color: #FFFFFF; margin: 0; line-height: 1.3;">
                ${currentProcess.nama}
              </h2>
            </div>

            <!-- Right: Process Navigation Controls & Close Button -->
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <button id="modal-btn-prev-process" class="btn" style="background: rgba(255,255,255,0.12); color: #FFFFFF; border: 1px solid rgba(255,255,255,0.25); padding: 5px 10px; font-size: 11.5px; font-weight: 700; border-radius: 6px; cursor: ${this.currentProcessIndex === 0 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentProcessIndex === 0 ? '0.4' : '1'};" ${this.currentProcessIndex === 0 ? 'disabled' : ''} title="Alur Sebelumnya (Alt+Left)">
                ← Alur Sebelumnya
              </button>

              <select id="modal-process-dropdown" style="padding: 5px 8px; font-size: 11.5px; font-weight: 700; color: #0B3A6F; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 6px; cursor: pointer; max-width: 170px;">
                ${this.processData.map((proc, idx) => `
                  <option value="${idx}" ${idx === this.currentProcessIndex ? 'selected' : ''}>
                    Alur ${idx + 1}: ${proc.nama.split('(')[0].trim()}
                  </option>
                `).join('')}
              </select>

              <button id="modal-btn-next-process" class="btn" style="background: rgba(255,255,255,0.12); color: #FFFFFF; border: 1px solid rgba(255,255,255,0.25); padding: 5px 10px; font-size: 11.5px; font-weight: 700; border-radius: 6px; cursor: ${this.currentProcessIndex === totalProcesses - 1 ? 'not-allowed' : 'pointer'}; opacity: ${this.currentProcessIndex === totalProcesses - 1 ? '0.4' : '1'};" ${this.currentProcessIndex === totalProcesses - 1 ? 'disabled' : ''} title="Alur Berikutnya (Alt+Right)">
                Alur Berikutnya →
              </button>

              <button id="modal-btn-close-x" style="background: rgba(255,255,255,0.2); border: none; color: #FFFFFF; font-size: 16px; font-weight: 700; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-left: 2px;" title="Tutup Dialog (Esc)">
                ✕
              </button>
            </div>

          </div>

          <!-- Horizontal Timeline Stepper Bar (Anchored at Top of Modal Dialog - Always 100% Visible) -->
          <div class="sop-timeline-stepper-container" style="margin: 12px 20px 0 20px; flex-shrink: 0;">
            <div class="sop-timeline-stepper-track">
              
              <!-- Background Timeline Track -->
              <div class="sop-stepper-line-bg"></div>
              <div class="sop-stepper-line-progress" style="width: ${totalSteps > 1 ? (this.currentStepIndex / (totalSteps - 1)) * 100 : 0}%;"></div>

              ${steps.map((st, idx) => {
                const isSelected = idx === this.currentStepIndex;
                const isCompleted = idx < this.currentStepIndex;
                const nodeBg = isSelected ? '#0B3A6F' : (isCompleted ? '#059669' : '#FFFFFF');
                const nodeColor = (isSelected || isCompleted) ? '#FFFFFF' : '#475569';
                const nodeBorder = isSelected ? '3px solid #D9B45B' : (isCompleted ? '2.5px solid #059669' : '2px solid #CBD5E1');

                return `
                  <div class="timeline-step-node ${isSelected ? 'active' : (isCompleted ? 'completed' : '')}" data-step-idx="${idx}" title="Tahap ${idx + 1}: ${st.judul}">
                    <div class="timeline-step-circle" style="background: ${nodeBg}; color: ${nodeColor}; border: ${nodeBorder};">
                      ${isCompleted ? '✓' : (st.no || idx + 1)}
                    </div>
                    <div class="timeline-step-label">
                      ${st.judul.split('&')[0].split('(')[0].trim()}
                    </div>
                  </div>
                `;
              }).join('')}

            </div>
          </div>

          <!-- MODAL BODY: 2-Column Step Detail -->
          <div style="padding: 12px 20px 16px 20px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; background: #F8FAFC;">
            
            <!-- Main Step Content (2 Columns) -->
            <div class="sop-step-content-grid" style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; flex: 1;">
              
              <!-- Column 1: Step Details & Outputs -->
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
                    <div>
                      <span class="badge badge-org" style="font-size: 10.5px; font-weight: 700; text-transform: uppercase;">
                        Tahap ${activeStep.no || (this.currentStepIndex + 1)} dari ${totalSteps}
                      </span>
                      <h3 style="font-size: 16.5px; font-weight: 800; color: #001631; margin: 4px 0 0 0; line-height: 1.3;">
                        ${activeStep.judul}
                      </h3>
                    </div>

                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      ${activeStep.sla ? `
                        <span class="badge" style="background:#FEF3C7; color:#92400E; font-size:10.5px; font-weight:700; border:1px solid #FDE68A;">
                          ⏱ SLA: ${activeStep.sla}
                        </span>
                      ` : ''}
                      ${activeStep.dasar_hukum ? `
                        <span class="badge" style="background:#F1F5F9; color:#475569; font-size:10.5px; font-weight:600;">
                          ⚖ ${activeStep.dasar_hukum}
                        </span>
                      ` : ''}
                    </div>
                  </div>

                  <!-- Step Operational Description -->
                  <div style="background: #F8FAFC; border-left: 4px solid #0B3A6F; border-radius: 4px; padding: 12px 14px; margin-bottom: 14px; border-top: 1px solid #E2E8F0; border-right: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0;">
                    <div style="font-size: 11px; font-weight: 700; color: #0B3A6F; text-transform: uppercase; margin-bottom: 4px;">
                      📋 Penjelasan Pelaksanaan &amp; Mekanisme Kerja:
                    </div>
                    <p style="font-size: 13px; line-height: 1.6; color: #1E293B; margin: 0;">
                      ${activeStep.deskripsi}
                    </p>
                  </div>

                  <!-- Output Documents -->
                  ${activeStep.output && activeStep.output.length > 0 ? `
                    <div style="margin-bottom: 12px;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">
                        📑 Dokumen Keluaran (Output) / Bukti Pelaksanaan:
                      </div>
                      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${activeStep.output.map(doc => `
                          <span style="font-size: 11.5px; font-weight: 600; background: #FFFBEB; border: 1px solid #FDE68A; color: #78350F; padding: 4px 10px; border-radius: 6px;">
                            📄 ${doc}
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>

                <div style="font-size: 11px; color: #64748B; background: #F1F5F9; padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 6px;">
                  <span>💡</span>
                  <span>Seluruh tahapan diawasi melalui integrasi sistem CEISA 4.0 dan Portal INSW.</span>
                </div>
              </div>

              <!-- Column 2: Involved Units & Control Point -->
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div style="font-size: 11.5px; font-weight: 700; color: #0B3A6F; text-transform: uppercase; letter-spacing: 0.5px;">
                      🏢 Satuan Kerja yang Terlibat:
                    </div>
                    <span style="font-size: 10px; font-weight: 700; color: #0284C7; background: #E0F2FE; padding: 2px 8px; border-radius: 4px;">
                      Klik Unit ➔ Side Panel
                    </span>
                  </div>

                  <!-- Unit Cards -->
                  <div style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; padding-right: 4px;">
                    ${(activeStep.unit_terlibat || []).map(u => {
                      const uIcon = getUnitIcon(u.unit_id || u);
                      return `
                        <div class="card sop-unit-card" data-unit-id="${u.unit_id}" style="padding: 10px 12px; border-left: 4px solid ${u.warna || '#0B3A6F'}; cursor: pointer; background: #F8FAFC; border: 1px solid #E2E8F0; border-left-width: 4px; border-radius: 8px; transition: all 0.15s ease;">
                          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                            <div style="font-size: 12px; font-weight: 700; color: #0B3A6F; display: flex; align-items: center; gap: 6px;">
                              <span style="font-size: 13px;">${uIcon}</span>
                              <span>${u.nama}</span>
                            </div>
                            <span style="font-size: 9.5px; font-weight: 700; color: ${u.warna || '#0B3A6F'}; background: ${u.warna || '#0B3A6F'}12; padding: 2px 6px; border-radius: 4px; white-space: nowrap;">
                              ${u.level || 'Pelaksana'}
                            </span>
                          </div>
                          <div style="font-size: 11px; color: #475569; margin-top: 3px; line-height: 1.4;">
                            ${u.peran}
                          </div>
                          <div style="font-size: 10px; color: #0284C7; font-weight: 600; margin-top: 3px; display: flex; align-items: center; gap: 2px;">
                            🔍 Buka Profil Unit di Side Panel ➔
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Critical Control Point -->
                <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 8px; padding: 10px 12px; margin-top: 10px;">
                  <div style="font-size: 10.5px; font-weight: 700; color: #166534; text-transform: uppercase; margin-bottom: 2px;">
                    🛡️ Poin Kritis Pengawasan &amp; Kepatuhan:
                  </div>
                  <div style="font-size: 11.5px; color: #15803D; line-height: 1.4;">
                    Memastikan kepatuhan tata laksana pabean/cukai serta kesesuaian waktu layanan sesuai Service Level Agreement (SLA).
                  </div>
                </div>
              </div>

            </div>

          </div>

          <!-- MODAL FOOTER: Step Navigation Controls & Close Button -->
          <div class="sop-modal-footer">
            
            <!-- Step Info Indicator -->
            <div class="sop-modal-footer-step-info">
              <span class="sop-modal-step-text">
                Tahap ${this.currentStepIndex + 1} dari ${totalSteps}
              </span>
              <div class="sop-modal-step-dots">
                ${steps.map((_, sIdx) => `
                  <div class="modal-step-dot ${sIdx === this.currentStepIndex ? 'active' : (sIdx < this.currentStepIndex ? 'completed' : '')}" data-step-idx="${sIdx}" title="Menuju Tahap ${sIdx + 1}"></div>
                `).join('')}
              </div>
            </div>

            <!-- Action Buttons Group -->
            <div class="sop-modal-footer-actions">
              <button id="modal-btn-prev-step" class="btn btn-outline sop-modal-nav-btn" ${this.currentStepIndex === 0 ? 'disabled' : ''} title="Tahap Sebelumnya (Left Arrow)">
                <span>←</span>
                <span class="btn-step-label">Sebelumnya</span>
              </button>

              <button id="modal-btn-next-step" class="btn btn-primary sop-modal-nav-btn" ${this.currentStepIndex === totalSteps - 1 ? 'disabled' : ''} title="Tahap Berikutnya (Right Arrow)">
                <span class="btn-step-label">Berikutnya</span>
                <span>→</span>
              </button>

              <button id="modal-btn-close-footer" class="btn btn-outline sop-modal-close-btn" title="Tutup Dialog (Esc)">
                <span>✕ Tutup</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    ` : '';

    this.container.innerHTML = listHtml + modalHtml;

    // Attach Listeners
    this.attachEventListeners();
  }

  attachEventListeners() {
    // 1. Search filter input
    const searchInput = this.container.querySelector('#sop-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
        const reInput = this.container.querySelector('#sop-search-input');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(reInput.value.length, reInput.value.length);
        }
      });
    }

    // 2. Category filter buttons
    this.container.querySelectorAll('.sop-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.getAttribute('data-category') || 'ALL';
        this.render();
      });
    });

    // 3. Open SOP cards / buttons
    this.container.querySelectorAll('.sop-card-item, .btn-open-sop').forEach(el => {
      el.addEventListener('click', (e) => {
        const idx = parseInt(el.getAttribute('data-process-idx'), 10);
        if (!isNaN(idx)) {
          this.openModal(idx, 0);
        }
      });
    });

    // If modal is open, attach modal listeners
    if (this.isModalOpen) {
      const modalOverlay = this.container.querySelector('#sop-detail-modal-overlay');
      const closeX = this.container.querySelector('#modal-btn-close-x');
      const closeFooter = this.container.querySelector('#modal-btn-close-footer');

      if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) this.closeModal();
        });
      }
      if (closeX) closeX.addEventListener('click', () => this.closeModal());
      if (closeFooter) closeFooter.addEventListener('click', () => this.closeModal());

      // Process navigation in modal
      const prevProc = this.container.querySelector('#modal-btn-prev-process');
      if (prevProc) prevProc.addEventListener('click', () => this.prevProcess());

      const nextProc = this.container.querySelector('#modal-btn-next-process');
      if (nextProc) nextProc.addEventListener('click', () => this.nextProcess());

      const procDropdown = this.container.querySelector('#modal-process-dropdown');
      if (procDropdown) {
        procDropdown.addEventListener('change', (e) => {
          this.currentProcessIndex = parseInt(e.target.value, 10) || 0;
          this.currentStepIndex = 0;
          this.render();
        });
      }

      // Step navigation in modal
      const prevStep = this.container.querySelector('#modal-btn-prev-step');
      if (prevStep) prevStep.addEventListener('click', () => this.prevStep());

      const nextStep = this.container.querySelector('#modal-btn-next-step');
      if (nextStep) nextStep.addEventListener('click', () => this.nextStep());

      // Step nodes & dots in modal
      this.container.querySelectorAll('.timeline-step-node, .modal-step-dot').forEach(node => {
        node.addEventListener('click', () => {
          const sIdx = parseInt(node.getAttribute('data-step-idx'), 10);
          if (!isNaN(sIdx)) this.goToStep(sIdx);
        });
      });

      // Unit cards click in modal -> open side panel
      this.container.querySelectorAll('.sop-unit-card, [data-unit-id]').forEach(card => {
        card.addEventListener('click', (e) => {
          e.stopPropagation();
          const unitId = card.getAttribute('data-unit-id');
          if (unitId && this.onSelectUnit) {
            this.onSelectUnit(unitId);
          }
        });
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.ProcessFlowEngine = ProcessFlowEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ProcessFlowEngine };
}

