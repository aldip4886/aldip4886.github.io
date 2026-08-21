/**
 * assessment.js — Knowledge Check (Tantangan Kasus & Kuis) & Results Engine.
 * Features:
 * - Instructions Screen (Petunjuk Pengerjaan) before question 1 with Confirmation Button
 * - Borderless Option Cards (Tanpa border)
 * - 2 Mandatory Parts: 10 Pilihan Ganda (10 Menit) + 5 Studi Kasus (5 Menit)
 * - Strict Completion Guard: All 15 questions must be answered before viewing Results (Notification Modal if incomplete)
 * - Real-time Countdown Timer with Auto-Submit on Timeout
 * - Comprehensive Dual-Part Results Screen & Randomized Repeat Action
 */

export class AssessmentEngine {
  constructor(containerEl, onComplete, onNavigate) {
    this.container = containerEl;
    this.onComplete = onComplete || (() => {});
    this.onNavigate = onNavigate || (() => {});
    this.allQuestions = [];
    this.pgQuestions = [];
    this.skQuestions = [];
    this.pgAnswers = [];
    this.skAnswers = [];
    this.currentTab = 'pilihan-ganda'; // 'pilihan-ganda' or 'studi-kasus'
    this.currentIndex = 0;
    this.pgTimeRemaining = 600; // 10 minutes
    this.skTimeRemaining = 300; // 5 minutes
    this.timerInterval = null;
    this.isIntroConfirmed = false;
    this.isTimeout = false;
  }

  setQuestions(questionsData) {
    this.allQuestions = questionsData || [];
    this.initQuestionSets();
    if (!this.isIntroConfirmed) {
      this.renderIntroScreen();
    } else {
      this.startPart(this.currentTab, false);
    }
  }

  /**
   * Samples n random elements from an array using Fisher-Yates shuffle.
   */
  sampleRandom(array, n) {
    if (!array || !array.length) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, Math.min(n, shuffled.length));
  }

  /**
   * Initializes question sets (10 random PG and 5 random Case Studies).
   */
  initQuestionSets() {
    const pgPool = this.allQuestions.filter(q => q.tipe === 'pilihan-ganda');
    const skPool = this.allQuestions.filter(q => q.tipe === 'studi-kasus' || Boolean(q.narasi));

    this.pgQuestions = this.sampleRandom(pgPool, 10);
    this.skQuestions = this.sampleRandom(skPool, 5);
    this.pgAnswers = [];
    this.skAnswers = [];
    this.pgTimeRemaining = 600;
    this.skTimeRemaining = 300;
    this.currentIndex = 0;
    this.isTimeout = false;
  }

  /**
   * Renders the Welcome / Instruction Screen (Petunjuk Pengerjaan).
   */
  renderIntroScreen() {
    this.stopTimer();
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="padding: 28px 32px; max-width: 980px; margin: 0 auto; width: 100%;">
        <!-- Intro Hero Card -->
        <div class="card" style="background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; box-shadow: 0 4px 24px rgba(11, 58, 111, 0.08); overflow: hidden; padding: 0;">
          
          <!-- Banner Header -->
          <div style="background: linear-gradient(135deg, #062B52 0%, #0B3A6F 100%); color: #FFFFFF; padding: 36px 36px 32px 36px; text-align: center;">
            <div style="width: 56px; height: 56px; margin: 0 auto 16px auto; background: rgba(255, 255, 255, 0.12); border: 1.5px solid rgba(217, 180, 91, 0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px;">
              📝
            </div>
            <h2 style="font-size: 24px; font-weight: 800; margin: 0 0 8px 0; color: #FFFFFF; letter-spacing: -0.3px;">
              Petunjuk Pengerjaan Kuis & Evaluasi Pemahaman
            </h2>
            <p style="font-size: 14px; color: #E2E8F0; max-width: 650px; margin: 0 auto; line-height: 1.6;">
              Uji dan ukur penguasaan materi arsitektur organisasi, tugas, fungsi, instansi vertikal, dan proses bisnis Direktorat Jenderal Bea dan Cukai.
            </p>
          </div>

          <!-- Instruction Details (Bento Grid) -->
          <div style="padding: 32px 36px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 28px;">
              
              <!-- Point 1 -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #E0F2FE; color: #0284C7; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                  🎯
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #0B3A6F; margin: 0 0 4px 0;">2 Bagian Evaluasi Wajib</h4>
                  <p style="font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.5;">
                    Terdiri dari <strong>10 Soal Pilihan Ganda</strong> dan <strong>5 Soal Studi Kasus</strong>. Seluruh 15 soal wajib dijawab sebelum hasil akhir ditampilkan.
                  </p>
                </div>
              </div>

              <!-- Point 2 -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                  ⏱️
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #0B3A6F; margin: 0 0 4px 0;">Alokasi Batas Waktu</h4>
                  <p style="font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.5;">
                    <strong>10 Menit</strong> untuk Pilihan Ganda dan <strong>5 Menit</strong> untuk Studi Kasus. Timer akan menghitung mundur dan otomatis selesai jika waktu habis.
                  </p>
                </div>
              </div>

              <!-- Point 3 -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #DCFCE7; color: #166534; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                  🏆
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #0B3A6F; margin: 0 0 4px 0;">Standar Penilaian & XP</h4>
                  <p style="font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.5;">
                    Raih poin XP pada setiap jawaban tepat (+10 XP PG, +20 XP Kasus). Batas kelulusan evaluasi minimum adalah <strong>70 / 100</strong>.
                  </p>
                </div>
              </div>

              <!-- Point 4 -->
              <div style="background: #F8FAFC; border-radius: 12px; padding: 18px 20px; display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background: #F3E8FF; color: #7C3AED; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;">
                  🔄
                </div>
                <div>
                  <h4 style="font-size: 14px; font-weight: 700; color: #0B3A6F; margin: 0 0 4px 0;">Bank Soal Dinamis & Ulangi</h4>
                  <p style="font-size: 12.5px; color: #64748B; margin: 0; line-height: 1.5;">
                    Soal dipilih secara acak dari Bank Soal DJBC terstandar. Anda dapat mengulang evaluasi dengan paket soal baru yang diacak kembali.
                  </p>
                </div>
              </div>

            </div>

            <!-- Confirmation Action Box -->
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 22px;">💡</span>
                <span style="font-size: 13.5px; color: #1E3A8A; font-weight: 600;">
                  Pastikan Anda memiliki waktu luang yang cukup sebelum memulai sesi kuis.
                </span>
              </div>
              <button id="btn-confirm-start-quiz" class="btn btn-primary" style="font-size: 14px; font-weight: 700; padding: 11px 26px; background: #0B3A6F; color: #FFFFFF; border-radius: 8px; border: none; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; box-shadow: 0 3px 10px rgba(11, 58, 111, 0.25); transition: all 0.2s;">
                <span>Saya Mengerti Mekanisme &amp; Mulai Evaluasi</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    `;

    const startBtn = this.container.querySelector('#btn-confirm-start-quiz');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.isIntroConfirmed = true;
        this.startPart('pilihan-ganda');
      });
    }
  }

  /**
   * Starts a part (tab) of the evaluation.
   */
  startPart(tabName = 'pilihan-ganda') {
    this.currentTab = tabName;
    this.currentIndex = 0;
    this.startTimer();
    this.renderCurrentQuestion();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const updateTimerDisplay = () => {
      const remaining = this.currentTab === 'pilihan-ganda' ? this.pgTimeRemaining : this.skTimeRemaining;
      const timerEl = this.container ? this.container.querySelector('#quiz-live-timer') : null;
      const badgeEl = this.container ? this.container.querySelector('#quiz-timer-badge') : null;
      if (timerEl) {
        timerEl.textContent = this.formatTime(remaining);
      }
      if (badgeEl) {
        if (remaining <= 60) {
          badgeEl.style.background = '#FEE2E2';
          badgeEl.style.color = '#DC2626';
        } else {
          badgeEl.style.background = '#F1F5F9';
          badgeEl.style.color = '#0B3A6F';
        }
      }
    };

    updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.currentTab === 'pilihan-ganda') {
        if (this.pgTimeRemaining > 0) {
          this.pgTimeRemaining--;
          updateTimerDisplay();
        } else {
          this.handleTimeout();
        }
      } else {
        if (this.skTimeRemaining > 0) {
          this.skTimeRemaining--;
          updateTimerDisplay();
        } else {
          this.handleTimeout();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleTimeout() {
    this.stopTimer();
    this.isTimeout = true;
    // If other part is incomplete, prompt or auto finalize
    if (this.pgAnswers.length === 10 && this.skAnswers.length === 5) {
      this.renderResults();
    } else {
      this.renderResults(true);
    }
  }

  formatTime(seconds) {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  getCurrentQuestions() {
    return this.currentTab === 'pilihan-ganda' ? this.pgQuestions : this.skQuestions;
  }

  getCurrentAnswers() {
    return this.currentTab === 'pilihan-ganda' ? this.pgAnswers : this.skAnswers;
  }

  renderCurrentQuestion() {
    if (!this.container) return;

    if (!this.isIntroConfirmed) {
      this.renderIntroScreen();
      return;
    }

    const questions = this.getCurrentQuestions();
    const answers = this.getCurrentAnswers();

    if (!questions.length) return;

    // Check if currentIndex exceeds questions
    if (this.currentIndex >= questions.length) {
      this.checkCompletionOrPromptNext();
      return;
    }

    const q = questions[this.currentIndex];
    const totalQ = questions.length;
    const progressPct = Math.round(((this.currentIndex) / totalQ) * 100);
    const isCaseStudy = this.currentTab === 'studi-kasus' || Boolean(q.narasi);
    const remainingTime = this.currentTab === 'pilihan-ganda' ? this.pgTimeRemaining : this.skTimeRemaining;

    // Calculate total XP earned so far across both parts
    const totalXP = (this.pgAnswers.filter(a => a.isCorrect).length * 10) + (this.skAnswers.filter(a => a.isCorrect).length * 20);

    const choices = (q.pilihan && Array.isArray(q.pilihan)) ? q.pilihan.map((p, idx) => ({
      id: p.id || String.fromCharCode(65 + idx),
      label: p.label || p.nama || p,
      deskripsi: p.deskripsi || ''
    })) : [];

    this.container.innerHTML = `
      <div style="padding: 24px 32px; max-width: 1040px; margin: 0 auto; width: 100%;">
        
        <!-- Mode & Tab Navigation Bar (2 Tabs: PILIHAN GANDA & STUDI KASUS) -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom: 20px; border-bottom:1px solid #E2E8F0; padding-bottom:14px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn ${this.currentTab === 'pilihan-ganda' ? 'btn-primary' : 'btn-outline'}" data-tab-name="pilihan-ganda" style="font-size:12.5px; padding:7px 16px; font-weight:700; border-radius:8px; display:flex; align-items:center; gap:6px;">
              <span>🎯 PILIHAN GANDA</span>
              <span style="font-size:11px; opacity:0.9; background:rgba(0,0,0,0.15); padding:1px 7px; border-radius:4px;">${this.pgAnswers.length}/10 Selesai</span>
            </button>
            <button class="btn ${this.currentTab === 'studi-kasus' ? 'btn-primary' : 'btn-outline'}" data-tab-name="studi-kasus" style="font-size:12.5px; padding:7px 16px; font-weight:700; border-radius:8px; display:flex; align-items:center; gap:6px;">
              <span>📋 STUDI KASUS</span>
              <span style="font-size:11px; opacity:0.9; background:rgba(0,0,0,0.15); padding:1px 7px; border-radius:4px;">${this.skAnswers.length}/5 Selesai</span>
            </button>
          </div>

          <div style="display:flex; align-items:center; gap:14px;">
            <div id="quiz-timer-badge" style="display:flex; align-items:center; gap:6px; background:#F1F5F9; padding:6px 14px; border-radius:9999px; font-size:13px; font-weight:700; color:#0B3A6F; transition: all 0.3s ease;">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span id="quiz-live-timer">${this.formatTime(remainingTime)}</span>
            </div>
            <div style="font-size:13px; font-weight:700; color:#D9B45B; background:#001631; padding:6px 14px; border-radius:9999px;">
              ⭐ ${totalXP} XP
            </div>
          </div>
        </div>

        <!-- Progress Tracker Bar -->
        <div style="margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; font-size:12.5px; font-weight:600; color:#64748B; margin-bottom:6px;">
            <span>${this.currentTab === 'pilihan-ganda' ? 'Bagian 1: Pilihan Ganda' : 'Bagian 2: Studi Kasus'} — Pertanyaan ${this.currentIndex + 1} dari ${totalQ}</span>
            <span>${progressPct}% Selesai</span>
          </div>
          <div style="width:100%; height:8px; background:#E2E8F0; border-radius:9999px; overflow:hidden;">
            <div style="width:${progressPct}%; height:100%; background:linear-gradient(90deg, #0B3A6F 0%, #D9B45B 100%); transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Main Question Card -->
        <div class="card quiz-card-wrapper" style="padding: 28px 32px; margin-bottom: 24px; background:#FFFFFF; border-radius:14px; border:1px solid #E2E8F0; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
          <!-- Category & Type Badges -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; gap:8px; align-items:center;">
              <span class="badge ${isCaseStudy ? 'badge-org' : 'badge-policy'}" style="font-size:11.5px; font-weight:700; text-transform:uppercase;">
                ${isCaseStudy ? '📋 Tantangan Studi Kasus' : '🎯 Pilihan Ganda'}
              </span>
              ${q.kategori_mp ? `
                <span class="badge badge-tech" style="font-size:11px; font-weight:600;">
                  ${q.kategori_mp.split(':')[0]}
                </span>
              ` : ''}
            </div>
            <span style="font-size:12px; font-weight:700; color:#D9B45B; background:#FFFDF5; border:1px solid #FEF08A; padding:4px 10px; border-radius:6px;">
              +${q.xp || (isCaseStudy ? 20 : 10)} XP
            </span>
          </div>

          <!-- Case Study Narrative Box (If applicable) -->
          ${isCaseStudy && q.narasi ? `
            <div style="background:#F8FAFC; border-left:4px solid #D9B45B; border-radius:8px; padding:18px 20px; margin-bottom: 20px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #854D0E; text-transform: uppercase; margin-bottom: 6px; display:flex; align-items:center; gap:6px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Skenario Kasus Operasional / Regulasi:
              </div>
              <p style="font-size: 13.5px; line-height: 1.65; color: #1E293B; margin: 0;">
                ${q.narasi}
              </p>
            </div>
          ` : ''}

          <!-- Question Text -->
          <h3 style="font-size: 17px; font-weight: 700; color: #001631; line-height: 1.5; margin: 0 0 20px 0;">
            ${q.soal}
          </h3>

          <!-- Options Container (Borderless Options) -->
          <div id="quiz-options-container" style="display:flex; flex-direction:column; gap: 10px; margin-bottom: 24px;">
            <!-- Options dynamically mounted -->
          </div>

          <!-- Feedback Section (Hidden until answered) -->
          <div id="quiz-feedback-box" style="display:none; border-radius:10px; padding:20px; margin-top: 20px;">
            <!-- Feedback content -->
          </div>
        </div>
      </div>
    `;

    // Tab button click listeners
    this.container.querySelectorAll('[data-tab-name]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab-name');
        if (tab !== this.currentTab) {
          this.startPart(tab);
        }
      });
    });

    // Populate borderless options
    const optionsContainer = this.container.querySelector('#quiz-options-container');
    if (optionsContainer) {
      choices.forEach((opt) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option-label';
        optionEl.style.border = 'none'; // User requested: Hilangkan border dari quiz-option-label
        optionEl.setAttribute('data-choice-id', opt.id);

        optionEl.innerHTML = `
          <div style="display:flex; align-items:center; gap:14px; width:100%;">
            <div class="quiz-option-radio" style="width:30px; height:30px; border-radius:50%; background:#E2E8F0; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:#334155; flex-shrink:0; transition: all 0.2s;">
              ${opt.id.toUpperCase()}
            </div>
            <div style="flex:1;">
              <div style="font-weight:600; font-size:14.5px; color:#001631; line-height:1.4;">${opt.label}</div>
            </div>
          </div>
        `;

        optionEl.addEventListener('click', () => this.handleAnswerSelect(opt.id, q));
        optionsContainer.appendChild(optionEl);
      });
    }
  }

  handleAnswerSelect(selectedId, question) {
    const feedbackBox = this.container.querySelector('#quiz-feedback-box');
    const options = this.container.querySelectorAll('.quiz-option-label');
    if (!feedbackBox || !options.length) return;

    // Prevent re-answering
    options.forEach(opt => {
      opt.style.pointerEvents = 'none';
    });

    const isCorrect = String(selectedId).toLowerCase() === String(question.correct || question.correct_node_id).toLowerCase();

    const answerRecord = {
      questionId: question.id,
      selected: selectedId,
      isCorrect: isCorrect,
      question: question
    };

    if (this.currentTab === 'pilihan-ganda') {
      this.pgAnswers.push(answerRecord);
    } else {
      this.skAnswers.push(answerRecord);
    }

    // Style option cards (Borderless highlighting)
    options.forEach(opt => {
      const choiceId = opt.getAttribute('data-choice-id');
      const radio = opt.querySelector('.quiz-option-radio');
      if (String(choiceId).toLowerCase() === String(question.correct || question.correct_node_id).toLowerCase()) {
        opt.style.background = '#ECFDF5';
        if (radio) {
          radio.style.background = '#059669';
          radio.style.color = '#FFFFFF';
          radio.innerHTML = '✓';
        }
      } else if (String(choiceId).toLowerCase() === String(selectedId).toLowerCase() && !isCorrect) {
        opt.style.background = '#FEF2F2';
        if (radio) {
          radio.style.background = '#DC2626';
          radio.style.color = '#FFFFFF';
          radio.innerHTML = '✕';
        }
      } else {
        opt.style.opacity = '0.5';
      }
    });

    const currentQuestions = this.getCurrentQuestions();
    const isLastInTab = this.currentIndex >= currentQuestions.length - 1;

    let nextBtnLabel = 'Lanjut ke Soal Berikutnya →';
    if (isLastInTab) {
      if (this.currentTab === 'pilihan-ganda') {
        nextBtnLabel = this.skAnswers.length >= 5 ? 'Lihat Hasil Evaluasi Akhir 🏆' : 'Selesai Bagian 1: Lanjut ke Studi Kasus →';
      } else {
        nextBtnLabel = this.pgAnswers.length >= 10 ? 'Lihat Hasil Evaluasi Akhir 🏆' : 'Lanjut ke Pilihan Ganda →';
      }
    }

    // Render feedback section
    feedbackBox.style.display = 'block';
    if (isCorrect) {
      feedbackBox.style.background = '#ECFDF5';
      feedbackBox.style.border = '1px solid #A7F3D0';
      feedbackBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:50%; background:#059669; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700;">✓</div>
            <span style="font-size: 16px; font-weight: 800; color: #065F46;">Jawaban Anda Tepat Sekali!</span>
          </div>
          <span style="font-size: 13px; font-weight: 700; color: #059669; background:#D1FAE5; padding:4px 10px; border-radius:6px;">
            +${question.xp || (this.currentTab === 'studi-kasus' ? 20 : 10)} XP
          </span>
        </div>
        <p style="font-size: 13.5px; line-height: 1.6; color: #064E3B; margin: 0 0 16px 0;">
          <strong>Pembahasan & Dasar Regulasi:</strong> ${question.pembahasan || 'Jawaban Anda telah diverifikasi benar sesuai dengan struktur organisasi dan regulasi kepabeanan.'}
        </p>
        <div style="display:flex; justify-content:flex-end;">
          <button id="btn-next-question" class="btn btn-primary" style="font-size:13px; font-weight:700; gap:6px;">
            <span>${nextBtnLabel}</span>
          </button>
        </div>
      `;
    } else {
      feedbackBox.style.background = '#FEF2F2';
      feedbackBox.style.border = '1px solid #FECACA';
      feedbackBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:28px; height:28px; border-radius:50%; background:#DC2626; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700;">✕</div>
            <span style="font-size: 16px; font-weight: 800; color: #991B1B;">Jawaban Kurang Tepat</span>
          </div>
          <span style="font-size: 12px; font-weight: 600; color: #991B1B; background:#FEE2E2; padding:4px 10px; border-radius:6px;">
            +0 XP
          </span>
        </div>
        <p style="font-size: 13.5px; line-height: 1.6; color: #7F1D1D; margin: 0 0 16px 0;">
          <strong>Pembahasan & Dasar Regulasi:</strong> ${question.pembahasan || 'Periksa kembali modul terkait tugas dan fungsi unit kerja kepabeanan dan cukai.'}
        </p>
        <div style="display:flex; justify-content:flex-end;">
          <button id="btn-next-question" class="btn btn-primary" style="font-size:13px; font-weight:700; gap:6px;">
            <span>${nextBtnLabel}</span>
          </button>
        </div>
      `;
    }

    const nextBtn = feedbackBox.querySelector('#btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (!isLastInTab) {
          this.currentIndex++;
          this.renderCurrentQuestion();
        } else {
          this.checkCompletionOrPromptNext();
        }
      });
    }
  }

  /**
   * Checks completion status of both PG and Case Study parts.
   * If both complete -> displays Results.
   * If incomplete -> displays transition prompt or notification popup modal.
   */
  checkCompletionOrPromptNext() {
    const pgDone = this.pgAnswers.length >= 10;
    const skDone = this.skAnswers.length >= 5;

    if (pgDone && skDone) {
      this.renderResults();
      return;
    }

    if (this.currentTab === 'pilihan-ganda' && pgDone && !skDone) {
      // Transition from Part 1 to Part 2
      this.showTransitionToCaseStudyModal();
    } else if (this.currentTab === 'studi-kasus' && skDone && !pgDone) {
      // Prompt user to complete Part 1
      this.showIncompleteWarningModal('pilihan-ganda');
    } else {
      this.showIncompleteWarningModal();
    }
  }

  /**
   * Modal dialog shown when Part 1 (Pilihan Ganda) is completed.
   */
  showTransitionToCaseStudyModal() {
    const modalEl = document.createElement('div');
    modalEl.style.cssText = 'position:fixed; inset:0; background:rgba(0,14,35,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
    modalEl.innerHTML = `
      <div style="background:#FFFFFF; border-radius:16px; max-width:520px; width:100%; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.25); text-align:center;">
        <div style="width:56px; height:56px; background:#DCFCE7; color:#166534; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 16px auto;">
          ✓
        </div>
        <h3 style="font-size:20px; font-weight:800; color:#0B3A6F; margin:0 0 8px 0;">Bagian 1: Pilihan Ganda Selesai!</h3>
        <p style="font-size:13.5px; color:#64748B; line-height:1.6; margin:0 0 24px 0;">
          Anda telah menyelesaikan <strong>10 soal Pilihan Ganda</strong>. Lanjutkan ke <strong>Bagian 2: 5 Soal Studi Kasus (Waktu: 5 Menit)</strong> untuk menuntaskan evaluasi dan membuka halaman Hasil Akhir.
        </p>
        <button id="btn-modal-start-casestudy" class="btn btn-primary" style="font-size:14px; font-weight:700; padding:12px 28px; width:100%; border-radius:8px;">
          Lanjutkan ke Studi Kasus (5 Soal) →
        </button>
      </div>
    `;

    document.body.appendChild(modalEl);
    modalEl.querySelector('#btn-modal-start-casestudy').addEventListener('click', () => {
      document.body.removeChild(modalEl);
      this.startPart('studi-kasus');
    });
  }

  /**
   * Modal notification / warning popup if user attempts to view results without completing all questions.
   */
  showIncompleteWarningModal(targetTab) {
    const pgRemaining = Math.max(0, 10 - this.pgAnswers.length);
    const skRemaining = Math.max(0, 5 - this.skAnswers.length);

    const modalEl = document.createElement('div');
    modalEl.style.cssText = 'position:fixed; inset:0; background:rgba(0,14,35,0.7); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px;';
    modalEl.innerHTML = `
      <div style="background:#FFFFFF; border-radius:16px; max-width:520px; width:100%; padding:32px; box-shadow:0 10px 30px rgba(0,0,0,0.25); text-align:center;">
        <div style="width:56px; height:56px; background:#FEE2E2; color:#DC2626; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 16px auto;">
          ⚠️
        </div>
        <h3 style="font-size:20px; font-weight:800; color:#0B3A6F; margin:0 0 8px 0;">Evaluasi Belum Lengkap</h3>
        <p style="font-size:13.5px; color:#64748B; line-height:1.6; margin:0 0 20px 0;">
          Sebelum menampilkan halaman Hasil Akhir, pastikan Anda telah menyelesaikan seluruh soal pada <strong>Pilihan Ganda</strong> dan <strong>Studi Kasus</strong>.
        </p>

        <div style="background:#F8FAFC; border-radius:10px; padding:14px 18px; margin-bottom:24px; text-align:left; font-size:13px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="font-weight:600; color:#1E293B;">🎯 Pilihan Ganda (10 Soal):</span>
            <span style="font-weight:700; color:${pgRemaining === 0 ? '#059669' : '#DC2626'};">${this.pgAnswers.length} / 10 Terjawab ${pgRemaining === 0 ? '✓' : `(Sisa ${pgRemaining})`}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span style="font-weight:600; color:#1E293B;">📋 Studi Kasus (5 Soal):</span>
            <span style="font-weight:700; color:${skRemaining === 0 ? '#059669' : '#DC2626'};">${this.skAnswers.length} / 5 Terjawab ${skRemaining === 0 ? '✓' : `(Sisa ${skRemaining})`}</span>
          </div>
        </div>

        <button id="btn-modal-resume" class="btn btn-primary" style="font-size:14px; font-weight:700; padding:12px 28px; width:100%; border-radius:8px;">
          Lanjutkan Pengerjaan Soal →
        </button>
      </div>
    `;

    document.body.appendChild(modalEl);
    modalEl.querySelector('#btn-modal-resume').addEventListener('click', () => {
      document.body.removeChild(modalEl);
      if (pgRemaining > 0) {
        this.startPart('pilihan-ganda');
      } else {
        this.startPart('studi-kasus');
      }
    });
  }

  /**
   * Renders the Final Comprehensive Results Screen across both PG & Case Study parts.
   */
  renderResults(forceTimeout = false) {
    this.stopTimer();

    // Check mandatory completion requirement unless forced by overall timeout
    if (!forceTimeout && (this.pgAnswers.length < 10 || this.skAnswers.length < 5)) {
      this.showIncompleteWarningModal();
      return;
    }

    const pgCorrect = this.pgAnswers.filter(a => a.isCorrect).length;
    const skCorrect = this.skAnswers.filter(a => a.isCorrect).length;
    const totalCorrect = pgCorrect + skCorrect;
    const totalQuestions = 15;
    const scorePct = Math.round((totalCorrect / totalQuestions) * 100);
    const wrongCount = Math.max(0, totalQuestions - totalCorrect);
    const totalXP = (pgCorrect * 10) + (skCorrect * 20);

    const timeSpentPG = Math.max(0, 600 - this.pgTimeRemaining);
    const timeSpentSK = Math.max(0, 300 - this.skTimeRemaining);
    const totalTimeSpentStr = this.formatTime(timeSpentPG + timeSpentSK);

    const circumference = 276.46; // 2 * PI * 44
    const strokeDashoffset = circumference - (circumference * scorePct / 100);

    // Call onComplete callback with assessment stats
    this.onComplete(scorePct, {
      score: totalCorrect,
      totalQuestions: totalQuestions,
      xp: totalXP,
      timeSpent: totalTimeSpentStr,
      pgCorrect: pgCorrect,
      skCorrect: skCorrect
    });

    // Topic performance breakdown calculation across all answered questions
    const allAnswers = [...this.pgAnswers, ...this.skAnswers];
    const topicStats = {};
    allAnswers.forEach(ans => {
      const topicName = (ans.question.kategori_mp || 'Umum').split(':')[0].trim();
      if (!topicStats[topicName]) {
        topicStats[topicName] = { total: 0, correct: 0 };
      }
      topicStats[topicName].total++;
      if (ans.isCorrect) topicStats[topicName].correct++;
    });

    const defaultTopics = [
      { key: 'MP 1', name: 'Manajemen Pemerintahan', color: '#059669' },
      { key: 'MP 2', name: 'Kantor Pusat DJBC', color: '#0284C7' },
      { key: 'MP 3', name: 'Instansi Vertikal & UPT', color: '#B45309' },
      { key: 'MP 4', name: 'Jabatan Fungsional', color: '#7C3AED' },
      { key: 'MP 5', name: 'Interdependensi & SOP', color: '#DC2626' }
    ];

    const topicData = defaultTopics.map(dt => {
      const stat = Object.entries(topicStats).find(([k]) => k.includes(dt.key));
      let pct = 100;
      if (stat && stat[1].total > 0) {
        pct = Math.round((stat[1].correct / stat[1].total) * 100);
      } else {
        pct = scorePct >= 80 ? 90 : (scorePct >= 60 ? 70 : 50);
      }
      return { ...dt, pct };
    });

    let recommendationText = '';
    if (scorePct >= 85) {
      recommendationText = 'Luar biasa! Pemahaman Anda mengenai arsitektur organisasi dan tusi DJBC sangat komprehensif. Pertahankan keunggulan ini!';
    } else if (scorePct >= 70) {
      recommendationText = 'Bagus! Anda telah lulus batas kompetensi. Disarankan mereview kembali modul dan bagan organisasi untuk mengoptimalkan pemahaman.';
    } else {
      recommendationText = 'Perlu pendalaman lebih lanjut. Buka Modul Pembelajaran dan Eksplorasi Organisasi untuk mempelajari kembali pembagian fungsi unit kerja.';
    }

    this.container.innerHTML = `
      <div style="padding: 24px 32px; max-width: 1040px; margin: 0 auto; width: 100%;">
        
        <!-- Breadcrumb Navigation -->
        <nav style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748B; margin-bottom: 20px;">
          <span style="cursor: pointer; color: #0B3A6F; font-weight: 600;" id="breadcrumb-quiz-root">Evaluasi</span>
          <span>›</span>
          <span style="color: #1E293B; font-weight: 700;">Hasil Evaluasi Akhir</span>
        </nav>

        ${this.isTimeout ? `
          <!-- Timeout Warning Banner -->
          <div style="background:#FEF2F2; border-left:4px solid #DC2626; border-radius:10px; padding:14px 18px; margin-bottom:20px; display:flex; align-items:center; gap:12px;">
            <span style="font-size:22px;">⏱️</span>
            <div>
              <div style="font-size:14px; font-weight:700; color:#991B1B;">Batas Waktu Telah Habis!</div>
              <div style="font-size:12.5px; color:#7F1D1D; margin-top:2px;">Sesi evaluasi otomatis diselesaikan sesuai batas waktu yang ditentukan.</div>
            </div>
          </div>
        ` : ''}

        <!-- Bento Style Results Card -->
        <div class="card" style="background: #FFFFFF; border-radius: 16px; border: 1px solid #D9E0E8; box-shadow: 0 4px 20px rgba(11, 58, 111, 0.06); overflow: hidden; padding: 0;">
          
          <!-- Top Header Banner (Centered, Gradient) -->
          <div style="padding: 36px 32px; text-align: center; border-bottom: 1px solid #D9E0E8; background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);">
            <div style="width: 52px; height: 52px; margin: 0 auto 16px auto; background: #FFFDF0; border: 1px solid #FDE68A; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(217, 180, 91, 0.2);">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#D9B45B">
                <path d="M12 2l2.4 2.5 3.4-.4 1.1 3.2 3.1 1.5-.7 3.4 2 2.8-2 2.8.7 3.4-3.1 1.5-1.1 3.2-3.4-.4L12 22l-2.4-2.5-3.4.4-1.1-3.2-3.1-1.5.7-3.4-2-2.8 2-2.8-.7-3.4 3.1-1.5 1.1-3.2 3.4.4L12 2zm-1.5 14.5l6-6-1.4-1.4-4.6 4.6-2.1-2.1-1.4 1.4 3.5 3.5z"/>
              </svg>
            </div>
            <h2 style="font-size: 24px; font-weight: 800; color: #0B3A6F; margin: 0 0 6px 0; line-height: 1.3;">
              ${scorePct >= 70 ? 'Selamat! Anda Telah Menyelesaikan Evaluasi Komprehensif' : 'Evaluasi Komprehensif Selesai'}
            </h2>
            <p style="font-size: 14px; color: #64748B; margin: 0 0 28px 0;">10 Soal Pilihan Ganda + 5 Soal Studi Kasus</p>

            <!-- Circular Score Gauge -->
            <div style="display: flex; justify-content: center; align-items: center;">
              <div style="width: 170px; height: 170px; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; background: #FFFFFF; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04); border: 8px solid #F1F5F9;">
                <svg style="position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg);" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="transparent" stroke="#E2E8F0" stroke-width="8"></circle>
                  <circle cx="50" cy="50" r="44" fill="transparent" stroke="#D9B45B" stroke-width="8" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" style="transition: stroke-dashoffset 1s ease-out;"></circle>
                </svg>
                <div style="text-align: center; z-index: 2;">
                  <span style="font-size: 40px; font-weight: 800; color: #0B3A6F; line-height: 1; display: block;">${scorePct}</span>
                  <span style="font-size: 11.5px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px;">Skor Akhir / 100</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bento Grid: Ringkasan + Analisis Performa Topik -->
          <div style="padding: 28px 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px;">
            
            <!-- Col 1: Ringkasan Dual-Part -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <h3 style="font-size: 16px; font-weight: 700; color: #0B3A6F; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin: 0 0 4px 0;">Ringkasan Hasil</h3>
              
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #F8FAFC;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 6px; background: #DCFCE7; color: #166534; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">🎯</div>
                  <span style="font-size: 13.5px; font-weight: 600; color: #1E293B;">Pilihan Ganda</span>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: #0B3A6F;">${pgCorrect} / 10 Benar</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #F8FAFC;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 6px; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">📋</div>
                  <span style="font-size: 13.5px; font-weight: 600; color: #1E293B;">Studi Kasus</span>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: #0B3A6F;">${skCorrect} / 5 Benar</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #F8FAFC;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 6px; background: #E0F2FE; color: #0369A1; display: flex; align-items: center; justify-content: center; font-size: 14px;">⏱</div>
                  <span style="font-size: 13.5px; font-weight: 600; color: #1E293B;">Total Waktu</span>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: #0B3A6F;">${totalTimeSpentStr}</span>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; background: #FFFDF0; border: 1px solid #FEF08A;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div style="width: 28px; height: 28px; border-radius: 6px; background: #FEF3C7; color: #B45309; display: flex; align-items: center; justify-content: center; font-size: 14px;">⭐</div>
                  <span style="font-size: 13.5px; font-weight: 600; color: #78350F;">Total Poin XP</span>
                </div>
                <span style="font-size: 16px; font-weight: 800; color: #B45309;">+${totalXP} XP</span>
              </div>
            </div>

            <!-- Col 2: Analisis Performa Topik -->
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <h3 style="font-size: 16px; font-weight: 700; color: #0B3A6F; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; margin: 0;">Analisis Performa Topik</h3>
              
              <div style="display: flex; flex-direction: column; gap: 14px; justify-content: center; flex: 1;">
                ${topicData.map(topic => `
                  <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                      <span style="font-size: 13.5px; font-weight: 600; color: #1E293B;">${topic.name}</span>
                      <span style="font-size: 13.5px; font-weight: 700; color: ${topic.color};">${topic.pct}%</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #F1F5F9; border-radius: 9999px; overflow: hidden;">
                      <div style="width: ${topic.pct}%; height: 100%; background: ${topic.color}; border-radius: 9999px; transition: width 0.6s ease;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Recommendation & Action Section (Bottom) -->
          <div style="padding: 24px 32px; background: #F8FAFC; border-top: 1px solid #D9E0E8;">
            <!-- Lightbulb Recommendation Box -->
            <div style="display: flex; gap: 14px; align-items: flex-start; margin-bottom: 20px; background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 10px; padding: 14px 18px;">
              <div style="color: #1D4ED8; font-size: 20px; line-height: 1; flex-shrink: 0; margin-top: 1px;">💡</div>
              <div>
                <p style="font-size: 13.5px; color: #1E3A8A; line-height: 1.6; margin: 0;">
                  <strong>Saran Pembelajaran:</strong> ${recommendationText}
                </p>
              </div>
            </div>

            <!-- Action Buttons: Ulangi Kuis & Lanjutkan Belajar -->
            <div style="display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-wrap: wrap;">
              <button id="btn-restart-quiz" class="btn btn-outline" style="font-size: 13px; font-weight: 700; padding: 9px 18px; border: 1.5px solid #0B3A6F; color: #0B3A6F; background: #FFFFFF; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Ulangi Kuis (Soal Acak Baru)
              </button>
              <button id="btn-go-learning" class="btn btn-primary" style="font-size: 13px; font-weight: 700; padding: 9px 20px; background: #0B3A6F; color: #FFFFFF; border-radius: 8px; border: none; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 6px rgba(11, 58, 111, 0.2);">
                Lanjutkan Belajar
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    // Action button & breadcrumb listeners
    const breadcrumbRoot = this.container.querySelector('#breadcrumb-quiz-root');
    if (breadcrumbRoot) {
      breadcrumbRoot.addEventListener('click', () => {
        this.initQuestionSets();
        this.startPart('pilihan-ganda');
      });
    }

    const restartBtn = this.container.querySelector('#btn-restart-quiz');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.initQuestionSets();
        this.startPart('pilihan-ganda');
      });
    }

    const learningBtn = this.container.querySelector('#btn-go-learning');
    if (learningBtn) {
      learningBtn.addEventListener('click', () => {
        this.onNavigate('view-learning');
      });
    }
  }
}
