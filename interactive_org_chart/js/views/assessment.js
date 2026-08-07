/**
 * E-Learning Assessment & Quiz Controller
 * Aligned with PRD v2.0 (Click challenges, case study radio forms, pembahasan reveal)
 */

window.AssessmentView = {
    container: null,
    challenges: [],
    studiKasus: [],
    
    activeCaseId: null, // ID of currently active case study
    selectedAnswer: null,
    
    async mount(params) {
        document.getElementById('header-view-title').textContent = "Evaluasi & Uji Pemahaman Mandiri";
        this.container = document.getElementById('assessment-screen');
        if (!this.container) return;
        
        // Load questions
        try {
            const data = await window.Data.load('assessment');
            this.challenges = data.challenges || [];
            this.studiKasus = data.studi_kasus || [];
        } catch(e) {
            this.container.innerHTML = `<div class="error-msg">Gagal memuat bank soal evaluasi.</div>`;
            return;
        }
        
        this.renderLayout();
        this.setupListeners();
        
        // Clear active states
        this.activeCaseId = null;
        this.selectedAnswer = null;
    },
    
    renderLayout() {
        const tracker = window.ProgressTracker;
        const totalXp = tracker ? tracker.getTotalScore() : 0;
        const solvedDict = tracker ? tracker.state.completedChallenges : {};
        
        this.container.innerHTML = `
            <div class="assessment-layout" style="background: #071527; padding: 24px; max-width: 1350px; margin: 0 auto; min-height: 100%; color: #FFFFFF;">
                <!-- Header Breadcrumbs and Navigation Row -->
                <div class="detail-header-nav" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 16px; background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); padding: 12px 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                    <button class="btn btn-secondary" onclick="window.location.hash='#/explorer'" style="padding: 9px 16px; font-size: 0.875rem; font-weight: 700; background: #071527; border: 1px solid var(--djbc-gold); color: #FFFFFF; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px;">
                        &larr; Kembali ke Peta Hierarki
                    </button>
                    <div class="breadcrumb-container" style="margin-bottom: 0; font-size: 0.875rem; display: flex; align-items: center; gap: 6px;">
                        <a href="#/explorer" class="breadcrumb-item" style="color: #F5A623 !important; text-decoration: none; font-weight: 700;">Home</a>
                        <span class="breadcrumb-separator" style="margin: 0 6px; color: rgba(255,255,255,0.6) !important; font-size: 0.85rem;">&gt;</span>
                        <span class="breadcrumb-item active" style="color: #FFFFFF !important; font-weight: 800;">Evaluasi & Uji Pemahaman Mandiri</span>
                    </div>
                </div>

                <!-- XP Banner row -->
                <div class="assessment-xp-banner flex items-center justify-between" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.4); border-radius: 16px; padding: 20px 24px; margin-bottom: 24px; box-shadow: 0 8px 25px rgba(0,0,0,0.3);">
                    <div class="flex items-center gap-md">
                        <span class="banner-badge-icon" style="font-size: 2.5rem;">🎖️</span>
                        <div>
                            <div class="xp-title" style="font-size: 1.1rem; font-weight: 800; color: #F5A623;">Akumulasi Skor Pemahaman</div>
                            <div class="xp-subtitle" style="color: rgba(255,255,255,0.85); font-size: 0.875rem;">Selesaikan kuis dan kasus untuk mendapatkan XP</div>
                        </div>
                    </div>
                    <div class="xp-val-box">
                        <span class="xp-val" style="font-size: 2.8rem; font-weight: 900; color: #F5A623;">${totalXp}</span> <span class="xp-lbl" style="color: #FFFFFF; font-weight: 800;">XP</span>
                    </div>
                </div>
                
                <div class="assessment-grid">
                    <!-- Column 1: Click Challenges (Tipe 1) -->
                    <div class="challenge-column flex flex-col">
                        <h3 class="column-heading" style="color: #F5A623; font-size: 1.15rem; font-weight: 800;">🎯 Tantangan Klik Bagan Hirarki</h3>
                        <p class="column-desc" style="color: rgba(255,255,255,0.8); font-size: 0.875rem; margin-bottom: 16px;">Pilih tantangan, lalu klik unit kerja yang tepat langsung pada bagan hierarki organisasi.</p>
                        
                        <div class="challenge-list flex flex-col" style="gap: 16px;">
                            ${this.challenges.map(c => {
                                const saved = solvedDict[c.id];
                                const isDone = !!saved;
                                const isCorrect = isDone && (saved.score > 0 || saved.isCorrect !== false);
                                const isRevealed = !!(this.revealedAnswers && this.revealedAnswers[c.id]);
                                const borderColor = isDone ? (isCorrect ? '#10B981' : (isRevealed ? '#F5A623' : '#EF4444')) : '#F5A623';
                                const badgeBg = isDone ? (isCorrect ? 'rgba(16, 185, 129, 0.2)' : (isRevealed ? 'rgba(245, 166, 35, 0.2)' : 'rgba(239, 68, 68, 0.2)')) : 'rgba(245, 166, 35, 0.2)';
                                const badgeColor = isDone ? (isCorrect ? '#10B981' : (isRevealed ? '#F5A623' : '#EF4444')) : '#F5A623';
                                const badgeBorder = isDone ? (isCorrect ? '#10B981' : (isRevealed ? '#F5A623' : '#EF4444')) : 'rgba(245, 166, 35, 0.5)';
                                const iconIndicator = isDone ? (isCorrect ? '✅' : (isRevealed ? '💡' : '❌')) : '🎯';

                                return `
                                    <div class="challenge-card card ${isDone ? 'completed' : ''}" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-left: 5px solid ${borderColor}; border-radius: 12px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                                        <div class="flex items-start justify-between">
                                            <div style="max-width: 82%;">
                                                <div class="challenge-tag flex items-center gap-xs" style="margin-bottom: 8px;">
                                                    <span class="badge" style="font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">
                                                        ${isDone ? 'Selesai' : 'Tantangan Klik'}
                                                    </span>
                                                    <span class="xp-tag" style="background: rgba(245, 166, 35, 0.2); color: #F5A623; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(245, 166, 35, 0.4);">
                                                        ${isDone ? (isCorrect ? `+${c.xp} XP` : `0 / ${c.xp} XP`) : `+${c.xp} XP`}
                                                    </span>
                                                </div>
                                                <div class="challenge-question" style="color: #FFFFFF; font-size: 0.95rem; font-weight: 700; line-height: 1.5;">${c.soal}</div>
                                            </div>
                                            <span class="done-check-icon" style="font-size: 1.4rem;">${iconIndicator}</span>
                                        </div>
                                        
                                        ${isDone 
                                            ? (isCorrect 
                                                ? `<div class="pembahasan-box" style="margin-top: 12px; padding: 12px 16px; background: #071527; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.4); color: #E2E8F0; font-size: 0.85rem;">
                                                    <div style="margin-bottom: 6px; font-weight: 800; color: #10B981;">✅ Jawaban Benar (+${c.xp} XP)</div>
                                                    <strong style="color: #10B981;">Pembahasan:</strong> ${c.pembahasan}
                                                   </div>`
                                                : (isRevealed
                                                    ? `<div class="pembahasan-box" style="margin-top: 12px; padding: 12px 16px; background: #071527; border-radius: 8px; border: 1px solid rgba(245, 166, 35, 0.4); color: #E2E8F0; font-size: 0.85rem;">
                                                        <div style="margin-bottom: 6px; font-weight: 800; color: #F5A623;">💡 Kunci Jawaban & Pembahasan:</div>
                                                        <strong style="color: #F5A623;">Pembahasan:</strong> ${c.pembahasan}
                                                       </div>`
                                                    : `<div class="pembahasan-box" style="margin-top: 12px; padding: 12px 16px; background: #071527; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.4); color: #E2E8F0; font-size: 0.85rem;">
                                                        <div style="margin-bottom: 6px; font-weight: 800; color: #EF4444;">❌ Jawaban Kurang Tepat (0 / ${c.xp} XP)</div>
                                                        <div style="color: rgba(255,255,255,0.85); margin-bottom: 10px; font-size: 0.825rem;">Jawaban Anda belum tepat. Anda dapat mencoba lagi atau melihat kunci jawaban.</div>
                                                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                                            <button onclick="window.AssessmentView.retryChallenge('${c.id}')" style="padding: 6px 14px; font-size: 0.78rem; font-weight: 700; background: #F5A623; color: #071527; border: none; border-radius: 6px; cursor: pointer;">🔄 Coba Lagi</button>
                                                            <button onclick="window.AssessmentView.revealAnswer('${c.id}')" style="padding: 6px 14px; font-size: 0.78rem; font-weight: 700; background: #0D2137; color: #F5A623; border: 1px solid #F5A623; border-radius: 6px; cursor: pointer;">💡 Tampilkan Jawaban</button>
                                                        </div>
                                                       </div>`
                                                  )
                                              )
                                            : `<div class="challenge-action-area" id="click-area-${c.id}">
                                                <div style="display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;">
                                                    <button class="btn btn-primary" onclick="window.AssessmentView.activateDirectClickChallenge('${c.id}')" style="padding: 8px 16px; font-size: 0.85rem; font-weight: 700; background: #F5A623; color: #071527; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
                                                        ⚡ Jawab Langsung
                                                    </button>
                                                    <button class="btn btn-secondary" onclick="window.AssessmentView.startClickChallenge('${c.id}')" style="padding: 8px 14px; font-size: 0.85rem; font-weight: 700; background: #071527; color: #F5A623; border: 1px solid #F5A623; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;">
                                                        🗺️ Pilih di Bagan Hirarki
                                                    </button>
                                                </div>
                                               </div>`
                                        }
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <!-- Column 2: Case Studies (Tipe 2) -->
                    <div class="challenge-column flex flex-col">
                        <h3 class="column-heading" style="color: #F5A623; font-size: 1.15rem; font-weight: 800;">📖 Studi Kasus Kerja Mandiri</h3>
                        <p class="column-desc" style="color: rgba(255,255,255,0.8); font-size: 0.875rem; margin-bottom: 16px;">Simulasikan kasus kepabeanan/cukai di lapangan, lalu tentukan unit mana yang bertanggung jawab.</p>
                        
                        <div class="challenge-list flex flex-col" id="case-study-list-container" style="gap: 16px;">
                            ${this.studiKasus.map(s => {
                                const saved = solvedDict[s.id];
                                const isDone = !!saved;
                                const isCorrect = isDone && (saved.score > 0 || saved.isCorrect !== false);
                                const isRevealed = !!(this.revealedAnswers && this.revealedAnswers[s.id]);
                                const borderColor = isDone ? (isCorrect ? '#10B981' : (isRevealed ? '#F5A623' : '#EF4444')) : '#F5A623';
                                const badgeBg = isDone ? (isCorrect ? 'rgba(16, 185, 129, 0.2)' : (isRevealed ? 'rgba(245, 166, 35, 0.2)' : 'rgba(239, 68, 68, 0.2)')) : 'rgba(245, 166, 35, 0.2)';
                                const badgeColor = isDone ? (isCorrect ? '#10B981' : (isRevealed ? '#F5A623' : '#EF4444')) : '#F5A623';
                                const badgeBorder = isDone ? (isCorrect ? '#10B981' : (isRevealed ? '#F5A623' : '#EF4444')) : 'rgba(245, 166, 35, 0.5)';
                                const iconIndicator = isDone ? (isCorrect ? '✅' : (isRevealed ? '💡' : '❌')) : '📝';

                                return `
                                    <div class="challenge-card card ${isDone ? 'completed' : ''}" id="card-${s.id}" style="background: #0D2137; border: 1px solid rgba(245, 166, 35, 0.35); border-left: 5px solid ${borderColor}; border-radius: 12px; padding: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.3);">
                                        <div class="flex items-start justify-between">
                                            <div style="max-width: 85%;">
                                                <div class="challenge-tag flex items-center gap-xs" style="margin-bottom: 8px;">
                                                    <span class="badge" style="font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">
                                                        ${isDone ? 'Selesai' : 'Studi Kasus'}
                                                    </span>
                                                    <span class="xp-tag" style="background: rgba(245, 166, 35, 0.2); color: #F5A623; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(245, 166, 35, 0.4);">
                                                        ${isDone ? `${saved.score} / ${s.xp} XP` : `+${s.xp} XP`}
                                                    </span>
                                                </div>
                                                <div class="case-narasi" style="color: #FFFFFF; font-size: 0.9rem; line-height: 1.6; margin-bottom: 10px; background: #071527; padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(245, 166, 35, 0.35); border-left: 4px solid #F5A623;">
                                                    <div style="font-size: 0.725rem; font-weight: 800; color: #F5A623; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">📜 Skenario Kasus:</div>
                                                    "${s.narasi}"
                                                </div>
                                                <div class="challenge-question" style="font-weight: 700; color: #FFFFFF; font-size: 0.95rem; line-height: 1.5;">${s.soal}</div>
                                            </div>
                                            <span class="done-check-icon" style="font-size: 1.4rem;">${iconIndicator}</span>
                                        </div>
                                        
                                        <!-- Case Interactive Pane -->
                                        <div class="case-interactive-area" id="area-${s.id}">
                                            ${isDone 
                                                ? (isCorrect
                                                    ? `<div class="pembahasan-box" style="margin-top: 12px; padding: 12px 16px; background: #071527; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.4); color: #E2E8F0; font-size: 0.85rem;">
                                                        <div style="margin-bottom: 6px; font-weight: 800; color: #10B981;">✅ Jawaban Benar! (Skor: ${saved.score}/${s.xp} XP)</div>
                                                        <strong style="color: #10B981;">Pembahasan:</strong> ${s.pembahasan}
                                                       </div>`
                                                    : (isRevealed
                                                        ? `<div class="pembahasan-box" style="margin-top: 12px; padding: 12px 16px; background: #071527; border-radius: 8px; border: 1px solid rgba(245, 166, 35, 0.4); color: #E2E8F0; font-size: 0.85rem;">
                                                            <div style="margin-bottom: 6px; font-weight: 800; color: #F5A623;">💡 Kunci Jawaban & Pembahasan:</div>
                                                            <strong style="color: #F5A623;">Pembahasan:</strong> ${s.pembahasan}
                                                           </div>`
                                                        : `<div class="pembahasan-box" style="margin-top: 12px; padding: 12px 16px; background: #071527; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.4); color: #E2E8F0; font-size: 0.85rem;">
                                                            <div style="margin-bottom: 6px; font-weight: 800; color: #EF4444;">❌ Jawaban Kurang Tepat (Skor: 0/${s.xp} XP)</div>
                                                            <div style="color: rgba(255,255,255,0.85); margin-bottom: 10px; font-size: 0.825rem;">Jawaban Anda belum tepat. Anda dapat mencoba lagi atau melihat kunci jawaban.</div>
                                                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                                                <button onclick="window.AssessmentView.retryChallenge('${s.id}')" style="padding: 6px 14px; font-size: 0.78rem; font-weight: 700; background: #F5A623; color: #071527; border: none; border-radius: 6px; cursor: pointer;">🔄 Coba Lagi</button>
                                                                <button onclick="window.AssessmentView.revealAnswer('${s.id}')" style="padding: 6px 14px; font-size: 0.78rem; font-weight: 700; background: #0D2137; color: #F5A623; border: 1px solid #F5A623; border-radius: 6px; cursor: pointer;">💡 Tampilkan Jawaban</button>
                                                            </div>
                                                           </div>`
                                                      )
                                                  )
                                                : `<button class="btn btn-secondary" onclick="window.AssessmentView.activateCase('${s.id}')" style="padding: 8px 16px; font-size: 0.85rem; font-weight: 700; background: #071527; color: #FFFFFF; border: 1px solid #F5A623; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; margin-top: 14px;">
                                                    Kerjakan Kasus
                                                   </button>`
                                            }
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tutorial Popup Modal -->
            <div id="click-challenge-tutorial-modal" class="modal-backdrop hidden" style="position: fixed; inset: 0; background: rgba(7, 21, 39, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;">
                <div style="background: #0D2137; border: 2px solid #F5A623; border-radius: 16px; padding: 28px; max-width: 540px; width: 100%; box-shadow: 0 15px 40px rgba(0,0,0,0.8); color: #FFFFFF;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 12px;">
                        <h3 style="margin: 0; color: #F5A623; font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                            <span>🎯</span> Panduan Tantangan Klik Bagan
                        </h3>
                        <button onclick="window.AssessmentView.closeTutorialModal()" style="background: transparent; border: none; color: rgba(255,255,255,0.6); font-size: 1.2rem; cursor: pointer;">✕</button>
                    </div>
                    
                    <p style="font-size: 0.9rem; color: rgba(255,255,255,0.9); line-height: 1.5; margin-bottom: 20px;">
                        Tantangan ini menguji pemahaman Anda dengan cara mencocokkan soal tugas & fungsi langsung pada bagan hierarki organisasi DJBC:
                    </p>

                    <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
                        <div style="display: flex; gap: 14px; align-items: flex-start; background: #071527; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(245, 166, 35, 0.25);">
                            <span style="font-size: 1.4rem;">📌</span>
                            <div>
                                <strong style="color: #F5A623; font-size: 0.95rem; display: block;">1. Perhatikan Soal Tantangan</strong>
                                <span style="font-size: 0.825rem; color: rgba(255,255,255,0.8);">Saat tantangan dimulai, soal aktif akan melayang pada banner bagian atas halaman.</span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 14px; align-items: flex-start; background: #071527; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(245, 166, 35, 0.25);">
                            <span style="font-size: 1.4rem;">🗺️</span>
                            <div>
                                <strong style="color: #F5A623; font-size: 0.95rem; display: block;">2. Jelajahi Bagan Hierarki Organisasi</strong>
                                <span style="font-size: 0.825rem; color: rgba(255,255,255,0.8);">Anda akan otomatis berada di halaman Bagan Hierarki (<code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; color: #F5A623;">#/explorer</code>). Cari posisi unit kerja yang dicari.</span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 14px; align-items: flex-start; background: #071527; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(245, 166, 35, 0.25);">
                            <span style="font-size: 1.4rem;">🖱️</span>
                            <div>
                                <strong style="color: #F5A623; font-size: 0.95rem; display: block;">3. Klik Kotak Unit Kerja Jawaban Anda</strong>
                                <span style="font-size: 0.825rem; color: rgba(255,255,255,0.8);">Klik langsung pada node/kotak unit kerja yang tepat pada bagan. Jawaban Anda akan langsung diverifikasi!</span>
                            </div>
                        </div>
                    </div>

                    <button onclick="window.AssessmentView.confirmTutorialAndStart()" style="width: 100%; padding: 12px; font-size: 0.95rem; font-weight: 800; background: #F5A623; color: #071527; border: none; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(245,166,35,0.4);">
                        🚀 Saya Paham, Mulai Tantangan!
                    </button>
                </div>
            </div>

            <!-- Confirmation Popup Modal -->
            <div id="click-challenge-confirmation-modal" class="modal-backdrop hidden" style="position: fixed; inset: 0; background: rgba(7, 21, 39, 0.88); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;">
                <div style="background: #0D2137; border: 2px solid #F5A623; border-radius: 18px; padding: 28px; max-width: 480px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.85); color: #FFFFFF; text-align: center;">
                    <div style="font-size: 3.5rem; margin-bottom: 10px;">🤔</div>
                    <h3 style="margin: 0 0 8px 0; color: #F5A623; font-size: 1.3rem; font-weight: 900;">KONFIRMASI JAWABAN</h3>
                    
                    <p style="font-size: 0.875rem; color: rgba(255,255,255,0.85); line-height: 1.5; margin-bottom: 16px;">
                        Apakah Anda yakin memilih unit organisasi berikut sebagai jawaban dari tantangan ini?
                    </p>

                    <div style="background: #071527; border: 1px solid #F5A623; border-radius: 12px; padding: 14px 18px; margin-bottom: 22px; text-align: center;">
                        <div style="font-size: 0.725rem; text-transform: uppercase; color: #F5A623; font-weight: 800; letter-spacing: 0.5px;">UNIT KERJA PILIHAN ANDA</div>
                        <h4 id="confirmation-unit-name" style="margin: 6px 0 0 0; color: #FFFFFF; font-size: 1.1rem; font-weight: 800;">[Nama Unit]</h4>
                    </div>

                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button id="btn-confirm-challenge-answer" style="padding: 12px 20px; font-size: 0.875rem; font-weight: 800; background: #F5A623; color: #071527; border: none; border-radius: 10px; cursor: pointer; flex: 1; box-shadow: 0 4px 15px rgba(245,166,35,0.3); transition: all 0.2s;">
                            Ya, Konfirmasi
                        </button>
                        <button onclick="window.AssessmentView.closeConfirmationModal()" style="padding: 12px 20px; font-size: 0.875rem; font-weight: 700; background: #071527; color: rgba(255,255,255,0.8); border: 1px solid rgba(255,255,255,0.25); border-radius: 10px; cursor: pointer; flex: 1;">
                            ↩️ Batal / Pilih Lain
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    pendingChallengeId: null,
    pendingClickedNodeId: null,
    revealedAnswers: {},

    revealAnswer(id) {
        if (!this.revealedAnswers) this.revealedAnswers = {};
        this.revealedAnswers[id] = true;
        this.renderLayout();
    },

    retryChallenge(id) {
        if (this.revealedAnswers) {
            delete this.revealedAnswers[id];
        }
        if (window.ProgressTracker) {
            window.ProgressTracker.retryChallenge(id);
        }
        this.renderLayout();
    },

    unitOptionsMap: {
        'ch-01': [
            { id: 'dit-teknis-kepab', name: 'Direktorat Teknis Kepabeanan' },
            { id: 'dit-fasilitas-kepab', name: 'Direktorat Fasilitas Kepabeanan' },
            { id: 'dit-audit', name: 'Direktorat Audit Kepabeanan dan Cukai' },
            { id: 'dit-ppk', name: 'Direktorat Penindakan dan Penyidikan' }
        ],
        'ch-02': [
            { id: 'dit-interdiksi', name: 'Direktorat Interdiksi Narkotika' },
            { id: 'dit-ppk', name: 'Direktorat Penindakan dan Penyidikan' },
            { id: 'dit-ki', name: 'Direktorat Kepatuhan Internal' },
            { id: 'pso', name: 'Pangkalan Sarana Operasi (PSO)' }
        ],
        'ch-03': [
            { id: 'dit-audit', name: 'Direktorat Audit Kepabeanan dan Cukai' },
            { id: 'dit-teknis-kepab', name: 'Direktorat Teknis Kepabeanan' },
            { id: 'dit-ki', name: 'Direktorat Kepatuhan Internal' },
            { id: 'dit-penerimaan', name: 'Direktorat Penerimaan dan Perencanaan Strategis' }
        ],
        'ch-04': [
            { id: 'dit-ki', name: 'Direktorat Kepatuhan Internal' },
            { id: 'dit-kombimjas', name: 'Direktorat Komunikasi dan Bimbingan Pengguna Jasa' },
            { id: 'secretariat', name: 'Sekretariat Direktorat Jenderal' },
            { id: 'dit-audit', name: 'Direktorat Audit Kepabeanan dan Cukai' }
        ],
        'ch-05': [
            { id: 'dit-kombimjas', name: 'Direktorat Komunikasi dan Bimbingan Pengguna Jasa' },
            { id: 'dit-ikc', name: 'Direktorat Informasi Kepabeanan dan Cukai' },
            { id: 'secretariat', name: 'Sekretariat Direktorat Jenderal' },
            { id: 'dit-ki', name: 'Direktorat Kepatuhan Internal' }
        ]
    },

    activateDirectClickChallenge(challengeId) {
        const ch = this.challenges.find(c => c.id === challengeId);
        if (!ch) return;

        const area = document.getElementById(`click-area-${challengeId}`);
        if (!area) return;

        const options = this.unitOptionsMap[challengeId] || [
            { id: ch.correct_node_id, name: 'Unit Kerja Terkait' },
            { id: 'dit-ki', name: 'Direktorat Kepatuhan Internal' },
            { id: 'secretariat', name: 'Sekretariat Direktorat Jenderal' },
            { id: 'dit-teknis-kepab', name: 'Direktorat Teknis Kepabeanan' }
        ];

        area.innerHTML = `
            <form id="form-click-${challengeId}" class="click-form-options flex flex-col" style="margin-top: 12px; gap: 8px;">
                <div style="font-size: 0.8rem; font-weight: 800; color: #F5A623; margin-bottom: 4px;">PILIH UNIT KERJA JAWABAN:</div>
                ${options.map(opt => `
                    <label class="click-option-label flex items-center gap-sm" style="background: #071527; border: 1px solid rgba(255,255,255,0.15); padding: 10px 14px; border-radius: 8px; cursor: pointer; transition: border 0.2s;">
                        <input type="radio" name="click-option-${challengeId}" value="${opt.id}" data-name="${opt.name}" class="click-option-radio" style="margin: 0; cursor: pointer;">
                        <span class="option-title-label" style="color: #FFFFFF; font-weight: 700; font-size: 0.875rem;">${opt.name}</span>
                    </label>
                `).join('')}
                
                <div class="form-actions flex gap-sm" style="margin-top: 8px; flex-wrap: wrap;">
                    <button type="button" class="btn btn-primary" onclick="window.AssessmentView.submitDirectClickAnswer('${challengeId}')" style="padding: 8px 16px; font-size: 0.85rem; font-weight: 700; background: #F5A623; color: #071527; border: none; border-radius: 8px; cursor: pointer;">
                        Kirim Jawaban
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="window.AssessmentView.startClickChallenge('${challengeId}')" style="padding: 8px 14px; font-size: 0.85rem; font-weight: 700; background: #071527; color: #F5A623; border: 1px solid #F5A623; border-radius: 8px; cursor: pointer;">
                        🗺️ Cari di Bagan Hirarki
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="window.AssessmentView.renderLayout()" style="padding: 8px 14px; font-size: 0.85rem; font-weight: 700; background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer;">
                        Batal
                    </button>
                </div>
            </form>
        `;
    },

    submitDirectClickAnswer(challengeId) {
        const ch = this.challenges.find(c => c.id === challengeId);
        if (!ch) return;

        const form = document.getElementById(`form-click-${challengeId}`);
        if (!form) return;

        const selected = form.querySelector(`input[name="click-option-${challengeId}"]:checked`);
        if (!selected) {
            this.showFeedbackModal({
                isCorrect: false,
                title: 'PERHATIAN',
                scoreText: 'Pilih Jawaban',
                bodyHtml: 'Silakan pilih salah satu unit kerja terlebih dahulu sebelum menekan tombol Kirim Jawaban.',
                onCloseRoute: null
            });
            return;
        }

        const clickedNodeId = selected.value;
        const unitName = selected.getAttribute('data-name') || clickedNodeId;

        // Show Confirmation Modal!
        this.showConfirmationModal(clickedNodeId, { nama: unitName }, ch);
    },

    startClickChallenge(challengeId) {
        const ch = this.challenges.find(c => c.id === challengeId);
        if (!ch) return;
        
        this.pendingChallengeId = challengeId;
        
        // Check if tutorial has been seen before
        const hasSeen = localStorage.getItem('hasSeenClickChallengeTutorial');
        if (!hasSeen) {
            this.showTutorialModal();
        } else {
            this.executeClickChallengeStart(ch);
        }
    },

    showTutorialModal(challengeId) {
        if (challengeId) this.pendingChallengeId = challengeId;
        const modal = document.getElementById('click-challenge-tutorial-modal');
        if (modal) {
            if (modal.parentElement !== document.body) {
                document.body.appendChild(modal);
            }
            modal.style.zIndex = '99999';
            modal.classList.remove('hidden');
        }
    },

    closeTutorialModal() {
        const modal = document.getElementById('click-challenge-tutorial-modal');
        if (modal) modal.classList.add('hidden');
    },

    confirmTutorialAndStart() {
        localStorage.setItem('hasSeenClickChallengeTutorial', 'true');
        this.closeTutorialModal();
        
        const ch = this.challenges.find(c => c.id === this.pendingChallengeId);
        if (ch) {
            this.executeClickChallengeStart(ch);
        }
    },

    executeClickChallengeStart(ch) {
        if (window.App) {
            window.App.activeClickChallenge = ch;
            window.location.hash = '#/explorer';
            setTimeout(() => {
                this.injectChallengeBannerIntoOrgChart(ch);
            }, 100);
        }
    },
    
    injectChallengeBannerIntoOrgChart(ch) {
        const explorerScreen = document.getElementById('explorer-screen');
        if (!explorerScreen) return;
        
        const oldBanner = document.getElementById('active-challenge-banner');
        if (oldBanner) oldBanner.remove();
        
        const banner = document.createElement('div');
        banner.id = 'active-challenge-banner';
        banner.className = 'active-challenge-banner-floating flex items-center justify-between';
        banner.style.cssText = 'position: fixed; top: 75px; left: 50%; transform: translateX(-50%); background: #0D2137; border: 2px solid #F5A623; border-radius: 12px; padding: 12px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.6); z-index: 500; min-width: 380px; max-width: 600px; display: flex; align-items: center; justify-content: space-between; gap: 16px; color: #FFFFFF;';
        
        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 1.8rem;">🎯</span>
                <div>
                    <div style="font-weight: 800; font-size: 0.75rem; color: #F5A623; text-transform: uppercase; letter-spacing: 0.5px;">TANTANGAN KLIK AKTIF</div>
                    <div style="font-size: 0.875rem; font-weight: 700; color: #FFFFFF; margin-top: 2px;">${ch.soal}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <button onclick="window.AssessmentView.showTutorialModal('${ch.id}')" style="padding: 6px 12px; font-size: 0.75rem; font-weight: 700; background: #071527; color: #F5A623; border: 1px solid #F5A623; border-radius: 6px; cursor: pointer;">❓ Petunjuk</button>
                <button onclick="window.AssessmentView.cancelClickChallenge()" style="padding: 6px 12px; font-size: 0.75rem; font-weight: 700; background: #071527; color: #EF4444; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; cursor: pointer;">Batal</button>
            </div>
        `;
        
        explorerScreen.appendChild(banner);
        
        window.App.handleChallengeNodeClick = (clickedNodeId, nodeData) => {
            this.showConfirmationModal(clickedNodeId, nodeData, ch);
        };
    },

    showConfirmationModal(nodeId, nodeData, ch) {
        const modal = document.getElementById('click-challenge-confirmation-modal');
        if (!modal) return;

        if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }
        modal.style.zIndex = '99999';

        const nameEl = document.getElementById('confirmation-unit-name');
        if (nameEl) {
            let unitName = nodeId;
            if (nodeData && typeof nodeData === 'object') {
                unitName = nodeData.nama || nodeData.singkatan || nodeId;
            }

            const unitDict = {
                'dit-audit': 'Direktorat Audit Kepabeanan dan Cukai',
                'dit-teknis-kepab': 'Direktorat Teknis Kepabeanan',
                'dit-fasilitas-kepab': 'Direktorat Fasilitas Kepabeanan',
                'dit-ppk': 'Direktorat Penindakan dan Penyidikan',
                'dit-p2': 'Direktorat Penindakan dan Penyidikan',
                'dit-interdiksi': 'Direktorat Interdiksi Narkotika',
                'dit-ki': 'Direktorat Kepatuhan Internal',
                'dit-kombimjas': 'Direktorat Komunikasi dan Bimbingan Pengguna Jasa',
                'dit-ikc': 'Direktorat Informasi Kepabeanan dan Cukai',
                'dit-penerimaan': 'Direktorat Penerimaan dan Perencanaan Strategis',
                'dit-tfc': 'Direktorat Teknis dan Fasilitas Cukai',
                'secretariat': 'Sekretariat Direktorat Jenderal',
                'setditjen': 'Sekretariat Direktorat Jenderal',
                'pso': 'Pangkalan Sarana Operasi Bea Cukai'
            };

            if ((unitName === nodeId || !unitName) && unitDict[nodeId]) {
                unitName = unitDict[nodeId];
            }

            nameEl.textContent = unitName;
        }

        const confirmBtn = document.getElementById('btn-confirm-challenge-answer');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                this.closeConfirmationModal();
                this.confirmChallengeAnswer(nodeId, ch);
            };
        }

        modal.classList.remove('hidden');
    },

    closeConfirmationModal() {
        const modal = document.getElementById('click-challenge-confirmation-modal');
        if (modal) modal.classList.add('hidden');
    },

    confirmChallengeAnswer(clickedNodeId, ch) {
        const isCorrect = clickedNodeId === ch.correct_node_id;
        
        if (isCorrect) {
            if (window.LandingView && window.LandingView.playBeep) {
                window.LandingView.playBeep('click');
            }
            if (window.ProgressTracker) {
                window.ProgressTracker.completeChallenge(ch.id, ch.xp, ch.xp);
            }
            this.cancelClickChallenge();
            this.showFeedbackModal({
                isCorrect: true,
                title: 'SELAMAT! JAWABAN BENAR',
                scoreText: `+${ch.xp} XP Diperoleh!`,
                bodyHtml: `<strong>Pembahasan Lengkap:</strong><br><span style="margin-top: 6px; display: block; color: rgba(255,255,255,0.9);">${ch.pembahasan}</span>`,
                onCloseRoute: '#/tantangan'
            });
        } else {
            this.cancelClickChallenge();
            this.showFeedbackModal({
                isCorrect: false,
                title: 'JAWABAN BELUM TEPAT',
                scoreText: 'Skor: 0 XP',
                bodyHtml: `<strong>Petunjuk Kunci:</strong><br><span style="margin-top: 6px; display: block; color: rgba(255,255,255,0.9);">${ch.hint}</span>`,
                onCloseRoute: '#/tantangan'
            });
        }
    },
    
    cancelClickChallenge() {
        if (window.App) {
            window.App.activeClickChallenge = null;
            window.App.handleChallengeNodeClick = null;
        }
        const banner = document.getElementById('active-challenge-banner');
        if (banner) banner.remove();
    },
    
    activateCase(caseId) {
        const s = this.studiKasus.find(item => item.id === caseId);
        if (!s) return;
        
        this.activeCaseId = caseId;
        this.selectedAnswer = null;
        
        const area = document.getElementById(`area-${caseId}`);
        if (!area) return;
        
        area.innerHTML = `
            <form id="form-${caseId}" class="case-form-options flex flex-col" style="margin-top: 10px; gap: 8px;">
                ${s.pilihan.map(opt => `
                    <label class="case-option-label flex items-start gap-sm" style="background: #071527; border: 1px solid rgba(255,255,255,0.15); padding: 10px 14px; border-radius: 8px; cursor: pointer;">
                        <input type="radio" name="option-${caseId}" value="${opt.id}" class="case-option-radio" style="margin-top: 3px;">
                        <div class="option-text-wrapper">
                            <span class="option-title-label" style="color: #F5A623; font-weight: 700;"><strong>${opt.label}</strong></span>
                            <span class="option-desc-label" style="display: block; font-size: 0.8rem; color: rgba(255,255,255,0.85); margin-top: 2px;">${opt.deskripsi}</span>
                        </div>
                    </label>
                `).join('')}
                
                <div class="form-actions flex gap-sm" style="margin-top: 8px;">
                    <button type="button" class="btn btn-primary" onclick="window.AssessmentView.submitCaseAnswer('${caseId}')" style="padding: 8px 16px; font-size: 0.85rem; font-weight: 700; background: #F5A623; color: #071527; border: none; border-radius: 8px; cursor: pointer;">
                        Kirim Jawaban
                    </button>
                    <button type="button" class="btn btn-ghost" onclick="window.AssessmentView.renderLayout()" style="padding: 8px 16px; font-size: 0.85rem; font-weight: 700; background: transparent; color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer;">
                        Batal
                    </button>
                </div>
            </form>
        `;
    },
    
    submitCaseAnswer(caseId) {
        const s = this.studiKasus.find(item => item.id === caseId);
        if (!s) return;
        
        const form = document.getElementById(`form-${caseId}`);
        if (!form) return;
        
        const selected = form.querySelector('input[name="option-'+caseId+'"]:checked');
        if (!selected) {
            this.showFeedbackModal({
                isCorrect: false,
                title: 'PERHATIAN',
                scoreText: 'Pilih Jawaban',
                bodyHtml: 'Silakan pilih salah satu opsi jawaban terlebih dahulu sebelum menekan tombol Kirim Jawaban.',
                onCloseRoute: null
            });
            return;
        }
        
        const ans = selected.value;
        const isCorrect = ans === s.correct;
        const awardedScore = isCorrect ? s.xp : 0;
        
        if (window.ProgressTracker) {
            window.ProgressTracker.completeChallenge(caseId, awardedScore, s.xp);
        }
        
        const correctOpt = s.pilihan.find(o => o.id === s.correct);
        
        this.showFeedbackModal({
            isCorrect: isCorrect,
            title: isCorrect ? 'SELAMAT! JAWABAN BENAR' : 'JAWABAN KURANG TEPAT',
            scoreText: isCorrect ? `+${s.xp} XP Diperoleh!` : 'Skor: 0 XP',
            bodyHtml: isCorrect ? `
                <div style="margin-bottom: 8px;"><strong>Jawaban Tepat:</strong> <span style="color: #F5A623;">${correctOpt ? correctOpt.label : ''}</span></div>
                <strong>Pembahasan Studi Kasus:</strong><br>
                <span style="margin-top: 4px; display: block; color: rgba(255,255,255,0.9);">${s.pembahasan}</span>
            ` : `
                <div style="margin-bottom: 8px; color: #EF4444; font-weight: 700;">Jawaban yang Anda pilih belum tepat.</div>
                <span>Silakan tekan tombol <strong>Coba Lagi</strong> untuk mengulang atau <strong>Tampilkan Jawaban</strong> jika memerlukan kunci jawaban.</span>
            `,
            onCloseRoute: null,
            onCloseCallback: () => this.renderLayout()
        });
    },

    showFeedbackModal({ isCorrect, title, scoreText, bodyHtml, onCloseRoute, onCloseCallback }) {
        let modal = document.getElementById('assessment-feedback-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'assessment-feedback-modal';
            modal.className = 'modal-backdrop hidden';
            document.body.appendChild(modal);
        } else if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }
        
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(7, 21, 39, 0.88); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;';

        const redirectTarget = onCloseRoute || '#/tantangan';

        modal.innerHTML = `
            <div style="background: #0D2137; border: 2px solid #F5A623; border-radius: 18px; padding: 28px; max-width: 520px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.85); color: #FFFFFF; text-align: center; animation: fadeIn 0.2s ease forwards;">
                <div style="font-size: 3.5rem; margin-bottom: 10px;">${isCorrect ? '🎉' : '💡'}</div>
                <h3 style="margin: 0 0 6px 0; color: ${isCorrect ? '#F5A623' : '#E2E8F0'}; font-size: 1.35rem; font-weight: 900;">${title}</h3>
                <div style="display: inline-block; background: ${isCorrect ? 'rgba(245, 166, 35, 0.2)' : 'rgba(255, 255, 255, 0.1)'}; color: ${isCorrect ? '#F5A623' : '#FFFFFF'}; border: 1px solid ${isCorrect ? '#F5A623' : 'rgba(255, 255, 255, 0.3)'}; padding: 4px 14px; border-radius: 20px; font-weight: 800; font-size: 0.875rem; margin-bottom: 18px;">${scoreText}</div>
                
                <div style="background: #071527; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 16px; text-align: left; margin-bottom: 22px; font-size: 0.875rem; line-height: 1.5; color: rgba(255,255,255,0.9);">
                    ${bodyHtml}
                </div>

                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.AssessmentView.closeFeedbackModal('${redirectTarget}')" style="padding: 10px 20px; font-size: 0.875rem; font-weight: 800; background: #F5A623; color: #071527; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 14px rgba(245,166,35,0.4); transition: transform 0.15s ease;">
                        Kembali ke Halaman Tantangan &rsaquo;
                    </button>
                    ${isCorrect ? `
                        <button onclick="window.AssessmentView.closeFeedbackModal('#/progres')" style="padding: 10px 20px; font-size: 0.875rem; font-weight: 700; background: #071527; color: #FFFFFF; border: 1px solid #F5A623; border-radius: 8px; cursor: pointer;">
                            🏆 Lihat Progres Saya
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        this.onFeedbackCloseCallback = onCloseCallback;
        modal.classList.remove('hidden');

        if (isCorrect) {
            this.triggerRealisticConfetti();
            if (window.LandingView && window.LandingView.playBeep) {
                window.LandingView.playBeep('click');
            }
        }
    },

    triggerRealisticConfetti() {
        const confettiFn = (typeof confetti === 'function' ? confetti : (typeof window.confetti === 'function' ? window.confetti : null));
        if (confettiFn) {
            var count = 250;
            var defaults = {
                origin: { y: 0.7 },
                zIndex: 999999
            };

            function fire(particleRatio, opts) {
                confettiFn(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
            });
            fire(0.2, {
                spread: 60,
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                scalar: 1.2
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
            });
        }
    },

    closeFeedbackModal(redirectRoute) {
        const modal = document.getElementById('assessment-feedback-modal');
        if (modal) modal.classList.add('hidden');

        if (this.onFeedbackCloseCallback) {
            this.onFeedbackCloseCallback();
            this.onFeedbackCloseCallback = null;
        }

        if (redirectRoute) {
            window.location.hash = redirectRoute;
        }
    },
    
    setupListeners() {
        window.addEventListener('hashchange', () => {
            this.cancelClickChallenge();
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
    window.App.registerView('assessment', window.AssessmentView);
}
