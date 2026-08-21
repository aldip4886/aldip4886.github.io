/**
 * progress.js — Learning Progress Tracking & Achievement Badges Dashboard.
 * Matches Stitch: 073ccc1704584bcaaf69d56b6c03b3f0
 */

import { storage } from './storage.js';

export class ProgressTracker {
  constructor() {
    this.totalUnitsCount = 237;
    this.totalRelationshipsCount = 14;
    this.totalModulesCount = 3;
  }

  getMetrics() {
    const visited = storage.getVisitedUnits() || [];
    const earnedBadges = storage.data.earnedBadges || [];
    const quizScore = storage.data.assessmentScore || 0;
    const isCompleted = storage.data.completed || false;

    const unitPercent = Math.min(100, Math.round((visited.length / this.totalUnitsCount) * 100));
    const quizPercent = quizScore;
    const overallPercent = Math.min(100, Math.round((unitPercent * 0.5) + (quizPercent * 0.5)));

    return {
      visitedCount: visited.length,
      totalUnits: this.totalUnitsCount,
      relationshipsCount: Math.min(this.totalRelationshipsCount, Math.floor(visited.length * 0.2) + 2),
      totalRelationships: this.totalRelationshipsCount,
      modulesCompleted: visited.length > 20 ? 3 : (visited.length > 5 ? 2 : 1),
      totalModules: this.totalModulesCount,
      percentage: overallPercent,
      badges: earnedBadges,
      quizScore: quizScore,
      isCompleted: isCompleted
    };
  }

  renderProgressDashboard(containerEl, onNavigate) {
    if (!containerEl) return;
    const m = this.getMetrics();

    // Define Badges
    const badgeDefinitions = [
      {
        id: 'explorer-beginner',
        title: 'Explorer Pemula',
        desc: 'Membuka dan mengeksplorasi minimal 5 unit kerja.',
        icon: '🌟',
        unlocked: m.visitedCount >= 5
      },
      {
        id: 'central-master',
        title: 'Penguasa Pusat',
        desc: 'Mengeksplorasi unit eselon II di Kantor Pusat DJBC.',
        icon: '🏛️',
        unlocked: m.visitedCount >= 10
      },
      {
        id: 'territory-scout',
        title: 'Penjelajah Nusantara',
        desc: 'Melihat sebaran kantor vertikal dan UPT pada Peta Unit Kerja.',
        icon: '🗺️',
        unlocked: m.visitedCount >= 15
      },
      {
        id: 'regulation-expert',
        title: 'Ahli Regulasi & Tugas',
        desc: 'Lulus Kuis Pengetahuan & Studi Kasus dengan nilai ≥ 70.',
        icon: '🏆',
        unlocked: m.quizScore >= 70
      }
    ];

    containerEl.innerHTML = `
      <div style="padding: 24px 32px; max-width: 1100px; margin: 0 auto; width: 100%;">
        <!-- Header Row -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 28px; flex-wrap:wrap; gap:16px;">
          <div>
            <h2 style="font-size: 26px; font-weight: 800; color: #001631; letter-spacing: -0.5px; margin-bottom: 6px;">
              Progres & Pencapaian Belajar
            </h2>
            <p style="font-size: 14.5px; color: #64748B; margin: 0; max-width: 600px;">
              Pantau kemajuan Anda dalam memahami struktur organisasi, pembagian tugas fungsi, dan relasi kerja di lingkungan DJBC.
            </p>
          </div>
          <button id="btn-complete-course" class="btn btn-primary" style="padding: 12px 20px; font-size: 13.5px; font-weight: 700; gap: 8px; box-shadow: 0 4px 12px rgba(11, 58, 111, 0.2);">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${m.isCompleted ? '✓ Pembelajaran Selesai' : 'Selesaikan Pembelajaran'}</span>
          </button>
        </div>

        <!-- Main Stats Layout Grid -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 32px;">
          <!-- SVG Circular Total Progress Card -->
          <div class="card" style="padding: 32px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; position:relative; overflow:hidden;">
            <div style="font-size: 16px; font-weight: 700; color: #001631; margin-bottom: 20px;">Penyelesaian Total</div>
            
            <div style="position:relative; width: 170px; height: 170px; display:flex; align-items:center; justify-content:center; margin-bottom: 16px;">
              <svg style="width: 100%; height: 100%; transform: rotate(-90deg);" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#E2E8F0" stroke-width="8"></circle>
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#D9B45B" stroke-width="8"
                  stroke-dasharray="264" stroke-dashoffset="${264 - (264 * (m.percentage / 100))}"
                  stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;"></circle>
              </svg>
              <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <span style="font-size: 36px; font-weight: 800; color: #062B52; line-height: 1;">${m.percentage}%</span>
                <span style="font-size: 11px; font-weight: 600; color: #64748B; margin-top: 2px;">Tuntas</span>
              </div>
            </div>

            <p style="font-size: 13px; color: #64748B; margin: 0; max-width: 260px;">
              ${m.percentage >= 80 ? 'Pemahaman Anda mengenai tugas & fungsi DJBC sudah sangat komprehensif!' : 'Terus tingkatkan eksplorasi unit dan kerjakan kuis evaluasi.'}
            </p>
          </div>

          <!-- Secondary Metric 2x2 Cards -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
            <!-- Metric 1 -->
            <div class="progress-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #0284C7; text-transform: uppercase;">Eksplorasi</span>
                <span style="font-size: 20px;">🏛️</span>
              </div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">Unit Dikunjungi</div>
              <div style="font-size: 26px; font-weight: 800; color: #001631; margin-top: 4px;">
                ${m.visitedCount} <span style="font-size: 13px; font-weight: 500; color: #94A3B8;">/ ${m.totalUnits} Unit</span>
              </div>
              <div style="width:100%; height:6px; background:#E2E8F0; border-radius:9999px; overflow:hidden; margin-top:12px;">
                <div style="width:${Math.min(100, Math.round((m.visitedCount / m.totalUnits) * 100))}%; height:100%; background:#0284C7;"></div>
              </div>
            </div>

            <!-- Metric 2 -->
            <div class="progress-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #D97706; text-transform: uppercase;">Analisis</span>
                <span style="font-size: 20px;">🔗</span>
              </div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">Hubungan Dipelajari</div>
              <div style="font-size: 26px; font-weight: 800; color: #001631; margin-top: 4px;">
                ${m.relationshipsCount} <span style="font-size: 13px; font-weight: 500; color: #94A3B8;">/ ${m.totalRelationships} Relasi</span>
              </div>
              <div style="width:100%; height:6px; background:#E2E8F0; border-radius:9999px; overflow:hidden; margin-top:12px;">
                <div style="width:${Math.min(100, Math.round((m.relationshipsCount / m.totalRelationships) * 100))}%; height:100%; background:#D97706;"></div>
              </div>
            </div>

            <!-- Metric 3 -->
            <div class="progress-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase;">Materi</span>
                <span style="font-size: 20px;">📖</span>
              </div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">Modul Selesai</div>
              <div style="font-size: 26px; font-weight: 800; color: #001631; margin-top: 4px;">
                ${m.modulesCompleted} <span style="font-size: 13px; font-weight: 500; color: #94A3B8;">/ ${m.totalModules} Modul</span>
              </div>
              <div style="width:100%; height:6px; background:#E2E8F0; border-radius:9999px; overflow:hidden; margin-top:12px;">
                <div style="width:${Math.round((m.modulesCompleted / m.totalModules) * 100)}%; height:100%; background:#059669;"></div>
              </div>
            </div>

            <!-- Metric 4 -->
            <div class="progress-stat-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #D9B45B; text-transform: uppercase;">Evaluasi</span>
                <span style="font-size: 20px;">⭐</span>
              </div>
              <div style="font-size: 12.5px; color: #64748B; font-weight: 500;">Skor Evaluasi Terakhir</div>
              <div style="font-size: 26px; font-weight: 800; color: #001631; margin-top: 4px;">
                ${m.quizScore} <span style="font-size: 13px; font-weight: 500; color: #94A3B8;">/ 100 Nilai</span>
              </div>
              <div style="width:100%; height:6px; background:#E2E8F0; border-radius:9999px; overflow:hidden; margin-top:12px;">
                <div style="width:${m.quizScore}%; height:100%; background:#D9B45B;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Badges & Achievements Section -->
        <div class="card" style="padding: 28px; margin-bottom: 32px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
            <div>
              <h3 style="font-size: 17px; font-weight: 700; color: #001631; margin: 0 0 4px 0;">
                Lencana Pencapaian (Badges & Rewards)
              </h3>
              <p style="font-size: 13px; color: #64748B; margin: 0;">Kumpulkan seluruh lencana prestasi dengan menyelesaikan seluruh aktivitas media pembelajaran.</p>
            </div>
            <span class="badge badge-org" style="font-weight: 700;">
              ${badgeDefinitions.filter(b => b.unlocked).length} / ${badgeDefinitions.length} Terbuka
            </span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            ${badgeDefinitions.map(badge => `
              <div class="badge-unlock-card ${badge.unlocked ? 'unlocked' : 'locked'}">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: ${badge.unlocked ? '#FEF3C7' : '#E2E8F0'}; display:flex; align-items:center; justify-content:center; font-size: 22px; flex-shrink: 0;">
                  ${badge.icon}
                </div>
                <div>
                  <div style="font-size: 13.5px; font-weight: 700; color: #1E293B; display:flex; align-items:center; gap:6px;">
                    ${badge.title}
                    ${badge.unlocked ? '<span style="color:#059669; font-size:11px;">✓</span>' : '<span style="color:#94A3B8; font-size:11px;">🔒</span>'}
                  </div>
                  <div style="font-size: 12px; color: #64748B; margin-top: 2px; line-height: 1.3;">
                    ${badge.desc}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quick Navigation Call to Actions -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:20px 24px;">
          <div>
            <div style="font-size: 14.5px; font-weight: 700; color: #001631;">Siap Melanjutkan Belajar?</div>
            <div style="font-size: 13px; color: #64748B;">Pilih langkah eksplorasi selanjutnya untuk memperdalam wawasan organisasi DJBC.</div>
          </div>
          <div style="display:flex; gap:10px;">
            <button id="btn-goto-explorer" class="btn btn-outline" style="font-size:13px; font-weight:600;">
              🌳 Eksplorasi Bagan
            </button>
            <button id="btn-goto-quiz" class="btn btn-primary" style="font-size:13px; font-weight:600;">
              🎯 Kerjakan Kuis Evaluasi
            </button>
          </div>
        </div>
      </div>
    `;

    // Completion button handler
    const completeBtn = containerEl.querySelector('#btn-complete-course');
    if (completeBtn) {
      completeBtn.addEventListener('click', () => {
        storage.saveData({ completed: true });
        alert('🎉 Selamat! Anda telah menyelesaikan seluruh modul pembelajaran Interactive Organization Explorer DJBC.');
        this.renderProgressDashboard(containerEl, onNavigate);
      });
    }

    // Quick navigation actions
    const gotoExpBtn = containerEl.querySelector('#btn-goto-explorer');
    if (gotoExpBtn && onNavigate) {
      gotoExpBtn.addEventListener('click', () => onNavigate('view-explorer'));
    }

    const gotoQuizBtn = containerEl.querySelector('#btn-goto-quiz');
    if (gotoQuizBtn && onNavigate) {
      gotoQuizBtn.addEventListener('click', () => onNavigate('view-quiz'));
    }
  }
}

export const progressTracker = new ProgressTracker();
