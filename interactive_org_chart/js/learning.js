/**
 * learning.js — Interactive Learning Module & Topic Stepper Engine with Clickable Unit Detail Panels.
 * Matches Stitch: 7950ce7bc9cd4ab3bb2455f22febfcd1 and Pusdiklat BPPK Curriculum (MP 1 s.d. MP 5).
 */

export class LearningModuleEngine {
  constructor(containerEl, learningPaths, unitsDict, onNavigate, onSelectUnit) {
    this.container = containerEl;
    this.learningPaths = learningPaths || [];
    this.unitsDict = unitsDict || {};
    this.onNavigate = onNavigate || (() => {});
    this.onSelectUnit = onSelectUnit || (() => {});
    this.currentModuleIndex = 0;
    this.currentTopicIndex = 0;

    // Structured curriculum data matching official references in referensi/
    this.modules = [
      {
        id: 'mp-01',
        title: 'MP 1: DJBC dalam Manajemen Pemerintahan',
        subtitle: 'Peran, Kedudukan, Visi Misi, dan 4 Peran Strategis DJBC',
        jp: '3 JP',
        estimatedTime: '15 Menit',
        topics: [
          {
            id: 'mp1-t1',
            title: 'Peran & Kedudukan DJBC dalam Kemenkeu & NKRI',
            status: 'completed',
            summary: 'Kehadiran dan pelaksanaan tugas DJBC merupakan amanat langsung konstitusi UUD 1945 Pasal 23A untuk menjamin kedaulatan fiskal dan perlindungan masyarakat.',
            content: `
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin-bottom:20px;">
                <h4 style="font-size:15px; font-weight:700; color:#0B3A6F; margin-bottom:10px;">Landasan Hierarki Hukum Kedudukan DJBC:</h4>
                <div style="display:flex; flex-direction:column; gap:12px;">
                  <div style="background:#FFFFFF; border:1px solid #D9E0E8; border-left:4px solid #0B3A6F; border-radius:8px; padding:12px 16px;">
                    <div style="font-weight:700; font-size:13.5px; color:#001631;">UUD 1945 (Pasal 23A)</div>
                    <div style="font-size:12.5px; color:#475569; margin-top:2px;">
                      <em>"Pajak dan pungutan lain yang bersifat memaksa untuk keperluan negara diatur dengan undang-undang."</em> Pungutan Bea Masuk, Bea Keluar, dan Cukai dijamin konstitusi demi membiayai pembangunan nasional.
                    </div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #D9E0E8; border-left:4px solid #0284C7; border-radius:8px; padding:12px 16px;">
                    <div style="font-weight:700; font-size:13.5px; color:#001631;">UU Kepabeanan (UU No. 10/1995 jo UU No. 17/2006) & UU Cukai (UU No. 39/2007)</div>
                    <div style="font-size:12.5px; color:#475569; margin-top:2px;">
                      Mandat pengawasan lalu lintas barang ekspor/impor di perbatasan, pemungutan bea masuk/keluar, serta pengendalian konsumsi dan peredaran Barang Kena Cukai (BKC).
                    </div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #D9E0E8; border-left:4px solid #D9B45B; border-radius:8px; padding:12px 16px;">
                    <div style="font-weight:700; font-size:13.5px; color:#001631;">Peraturan Menteri Keuangan (PMK Nomor 124 Tahun 2024)</div>
                    <div style="font-size:12.5px; color:#475569; margin-top:2px;">
                      DJBC berada di bawah dan bertanggung jawab langsung kepada Menteri Keuangan, dipimpin oleh Direktur Jenderal Bea dan Cukai sebagai pengelola kebijakan fiskal kepabeanan & cukai.
                    </div>
                  </div>
                </div>
              </div>

              <!-- Interactive Unit Link Card -->
              <div class="card unit-interactive-card" data-unit-id="djbc" style="padding:16px 20px; border-left:4px solid #0B3A6F; cursor:pointer; background:#FFFFFF; margin-top:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span class="badge badge-org" style="font-size:11px;">Unit Induk Eselon I</span>
                    <h4 style="font-size:15px; font-weight:800; color:#0B3A6F; margin:4px 0 2px 0;">Direktorat Jenderal Bea dan Cukai (DJBC)</h4>
                    <p style="font-size:12.5px; color:#64748B; margin:0;">Pimpinan: Direktur Jenderal Bea dan Cukai | Dasar Hukum: PMK 124/2024</p>
                  </div>
                  <button class="btn btn-outline" style="font-size:12px; font-weight:700; gap:4px; padding:6px 14px;">
                    🔍 Detail Unit
                  </button>
                </div>
              </div>
            `
          },
          {
            id: 'mp1-t2',
            title: 'Visi dan Misi DJBC',
            status: 'active',
            summary: 'Visi DJBC mencerminkan cita-cita tertinggi organisasi menjadi institusi kepabeanan dan cukai terkemuka di dunia melalui 5 misi transformasi.',
            content: `
              <div style="background:linear-gradient(135deg, #062B52 0%, #0B3A6F 100%); color:#FFFFFF; border-radius:14px; padding:24px; text-align:center; margin-bottom:20px; box-shadow:0 4px 16px rgba(6,43,82,0.15);">
                <span style="font-size:12px; font-weight:700; color:#D9B45B; text-transform:uppercase; letter-spacing:1px;">VISI ORGANISASI</span>
                <h3 style="font-size:22px; font-weight:800; margin:8px 0 0 0; color:#FFFFFF;">
                  “Menjadi Institusi Kepabeanan dan Cukai Terkemuka di Dunia”
                </h3>
              </div>

              <h4 style="font-size:15px; font-weight:700; color:#001631; margin-bottom:12px;">5 Misi Strategis DJBC:</h4>
              <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">1</div>
                  <div style="font-size:13px; color:#334155;">Memfasilitasi perdagangan dan industri dengan memberikan pelayanan prima berstandar internasional.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">2</div>
                  <div style="font-size:13px; color:#334155;">Melindungi perbatasan dan masyarakat Indonesia dari penyelundupan barang terlarang dan berbahaya.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">3</div>
                  <div style="font-size:13px; color:#334155;">Mengoptimalkan penerimaan negara di sektor kepabeanan dan cukai guna menopang APBN.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">4</div>
                  <div style="font-size:13px; color:#334155;">Mewujudkan tata kelola organisasi yang transparan, efektif, efisien, dan berintegritas tinggi.</div>
                </div>
                <div style="display:flex; gap:12px; align-items:flex-start; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 16px;">
                  <div style="width:24px; height:24px; border-radius:50%; background:#0B3A6F; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">5</div>
                  <div style="font-size:13px; color:#334155;">Mengembangkan SDM yang profesional, adaptif terhadap teknologi digital, dan berdaya saing global.</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp1-t3',
            title: 'Tugas dan 4 Peran Strategis DJBC',
            status: 'locked',
            summary: 'Tugas DJBC diwujudkan dalam 4 pilar peran strategis: Revenue Collector, Trade Facilitator, Industrial Assistance, dan Community Protector.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin: 16px 0;">
                <div class="unit-interactive-card" data-unit-id="dit-tfc" style="background:#FFFFFF; border:1.5px solid #0B3A6F; border-radius:12px; padding:18px; cursor:pointer; box-shadow:0 2px 8px rgba(11,58,111,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:28px;">💰</div>
                    <span style="font-size:11px; font-weight:700; color:#0B3A6F;">Detail Unit ➔</span>
                  </div>
                  <div style="font-weight:800; font-size:15px; color:#0B3A6F; margin-top:8px;">Revenue Collector</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:6px; line-height:1.5;">
                    Memungut Bea Masuk, Bea Keluar, dan Cukai (Hasil Tembakau, MMEA, Etil Alkohol) untuk kas negara.
                  </div>
                </div>

                <div class="unit-interactive-card" data-unit-id="dit-teknis-kepab" style="background:#FFFFFF; border:1.5px solid #0284C7; border-radius:12px; padding:18px; cursor:pointer; box-shadow:0 2px 8px rgba(2,132,199,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:28px;">🚢</div>
                    <span style="font-size:11px; font-weight:700; color:#0284C7;">Detail Unit ➔</span>
                  </div>
                  <div style="font-weight:800; font-size:15px; color:#0284C7; margin-top:8px;">Trade Facilitator</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:6px; line-height:1.5;">
                    Menyederhanakan prosedur kepabeanan ekspor/impor melalui sistem otomasi CEISA & AEO.
                  </div>
                </div>

                <div class="unit-interactive-card" data-unit-id="dit-fasilitas-kepab" style="background:#FFFFFF; border:1.5px solid #059669; border-radius:12px; padding:18px; cursor:pointer; box-shadow:0 2px 8px rgba(5,150,105,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:28px;">🏭</div>
                    <span style="font-size:11px; font-weight:700; color:#059669;">Detail Unit ➔</span>
                  </div>
                  <div style="font-weight:800; font-size:15px; color:#059669; margin-top:8px;">Industrial Assistance</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:6px; line-height:1.5;">
                    Insentif fiskal (Kawasan Berikat, KITE, Pusat Logistik Berikat) untuk daya saing manufaktur ekspor.
                  </div>
                </div>

                <div class="unit-interactive-card" data-unit-id="dit-p2" style="background:#FFFFFF; border:1.5px solid #DC2626; border-radius:12px; padding:18px; cursor:pointer; box-shadow:0 2px 8px rgba(220,38,38,0.06);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:28px;">🛡️</div>
                    <span style="font-size:11px; font-weight:700; color:#DC2626;">Detail Unit ➔</span>
                  </div>
                  <div style="font-weight:800; font-size:15px; color:#DC2626; margin-top:8px;">Community Protector</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:6px; line-height:1.5;">
                    Mencegah masuknya narkotika, senjata ilegal, limbah B3, dan barang selundupan berbahaya.
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp1-t4',
            title: 'Kelembagaan & Hierarki Makro DJBC',
            status: 'locked',
            summary: 'Organisasi DJBC dirancang secara hierarkis dalam 3 pilar: Kantor Pusat (Regulator), Instansi Vertikal (Operasional Wilayah), dan UPT (Dukungan Teknis Khusus).',
            content: `
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin-bottom:16px;">
                <div style="font-size:14px; font-weight:700; color:#001631; margin-bottom:12px;">Klik unit di bawah ini untuk membuka detail profil di panel samping:</div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
                  <div class="card unit-interactive-card" data-unit-id="kantor-pusat" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                    <strong style="color:#0B3A6F; font-size:13.5px;">1. Kantor Pusat DJBC</strong>
                    <div style="font-size:12px; color:#64748B; margin-top:4px;">1 Setditjen, 10 Direktorat, dan 3 Tenaga Pengkaji (Regulator Kebijakan).</div>
                  </div>
                  <div class="card unit-interactive-card" data-unit-id="instansi-vertikal-djbc" style="padding:14px; cursor:pointer; border-left:4px solid #0284C7;">
                    <strong style="color:#0284C7; font-size:13.5px;">2. Instansi Vertikal</strong>
                    <div style="font-size:12px; color:#64748B; margin-top:4px;">20 Kanwil, 3 KPU BC, dan 104 KPPBC (Pelayanan & Pengawasan Lapangan).</div>
                  </div>
                  <div class="card unit-interactive-card" data-unit-id="upt-djbc" style="padding:14px; cursor:pointer; border-left:4px solid #D9B45B;">
                    <strong style="color:#854D0E; font-size:13.5px;">3. Unit Pelaksana Teknis (UPT)</strong>
                    <div style="font-size:12px; color:#64748B; margin-top:4px;">3 Balai Laboratorium (BLBC) dan 6 Pangkalan Sarana Operasi (PSO BC).</div>
                  </div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: 'mp-02',
        title: 'MP 2: Struktur Organisasi Kantor Pusat DJBC',
        subtitle: 'Sekretariat Direktorat Jenderal, 10 Direktorat Teknis, & Tenaga Pengkaji',
        jp: '3 JP',
        estimatedTime: '20 Menit',
        topics: [
          {
            id: 'mp2-t1',
            title: 'Sekretariat Direktorat Jenderal (Setditjen)',
            status: 'active',
            summary: 'Setditjen mengoordinasikan pelaksanaan tugas, pembinaan SDM, keuangan, pengelolaan aset, organisasi, dan tata laksana di lingkungan DJBC.',
            content: `
              <div class="card unit-interactive-card" data-unit-id="setditjen" style="padding:16px 20px; border-left:4px solid #0B3A6F; cursor:pointer; background:#FFFFFF; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span class="badge badge-org" style="font-size:11px;">Eselon II.a</span>
                    <h4 style="font-size:16px; font-weight:800; color:#0B3A6F; margin:4px 0 2px 0;">Sekretariat Direktorat Jenderal (Setditjen)</h4>
                    <p style="font-size:12.5px; color:#64748B; margin:0;">Mengoordinasikan manajerial, perencanaan, kepegawaian, keuangan, dan tata laksana.</p>
                  </div>
                  <button class="btn btn-outline" style="font-size:12px; font-weight:700; gap:4px; padding:6px 14px;">
                    🔍 Detail Setditjen
                  </button>
                </div>
              </div>

              <div style="font-size:13px; font-weight:700; color:#001631; margin-bottom:8px;">Bagian-Bagian Eselon III di Lingkungan Setditjen:</div>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin:12px 0;">
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Perencanaan ➔</div>
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Organisasi & TL ➔</div>
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Kepegawaian ➔</div>
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Keuangan ➔</div>
                <div class="unit-interactive-card" data-unit-id="setditjen" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; font-size:12.5px; font-weight:600; color:#0B3A6F; cursor:pointer;">Bagian Umum & BMN ➔</div>
              </div>
            `
          },
          {
            id: 'mp2-t2',
            title: 'Direktorat Teknis, Fasilitas, & Cukai',
            status: 'locked',
            summary: 'Tiga direktorat pilar perumusan regulasi teknis operasional, insentif fiskal industri, dan pungutan cukai.',
            content: `
              <div style="display:flex; flex-direction:column; gap:12px; margin: 12px 0;">
                <div class="card unit-interactive-card" data-unit-id="dit-teknis-kepab" style="padding:16px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0B3A6F; font-size:14px;">1. Direktorat Teknis Kepabeanan</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Merumuskan standardisasi impor/ekspor, tarif HS Code, nilai pabean, dan AEO.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0B3A6F;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="dit-fasilitas-kepab" style="padding:16px; cursor:pointer; border-left:4px solid #059669;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#059669; font-size:14px;">2. Direktorat Fasilitas Kepabeanan</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Fasilitas pembebasan, keringanan, Kawasan Berikat, KITE, dan Kawasan Ekonomi Khusus.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#059669;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="dit-tfc" style="padding:16px; cursor:pointer; border-left:4px solid #D97706;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#D97706; font-size:14px;">3. Direktorat Teknis dan Fasilitas Cukai</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Tarif cukai, izin NPPBKC pabrik rokok/miras, pelunasan pita cukai, dan pengawasan BKC.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#D97706;">Detail ➔</span>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp2-t3',
            title: 'Direktorat Penindakan, Interdiksi, & Audit',
            status: 'locked',
            summary: 'Pilar penegakan hukum, intelijen, patroli laut, pemberantasan penyelundupan narkotika, dan post-clearance audit.',
            content: `
              <div style="display:flex; flex-direction:column; gap:12px; margin: 12px 0;">
                <div class="card unit-interactive-card" data-unit-id="dit-p2" style="padding:16px; cursor:pointer; border-left:4px solid #991B1B;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#991B1B; font-size:14px;">1. Direktorat Penindakan dan Penyidikan (P2)</strong>
                      <div style="font-size:12.5px; color:#7F1D1D; margin-top:4px;">Pusat intelijen pabean/cukai, patroli laut terintegrasi, dan penyidikan tindak pidana.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#991B1B;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="dit-interdiksi" style="padding:16px; cursor:pointer; border-left:4px solid #991B1B;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#991B1B; font-size:14px;">2. Direktorat Interdiksi Narkotika</strong>
                      <div style="font-size:12.5px; color:#7F1D1D; margin-top:4px;">Pencegahan penyelundupan Narkotika (NPP) dan pembinaan Unit Anjing Pelacak K-9.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#991B1B;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="dit-audit" style="padding:16px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0B3A6F; font-size:14px;">3. Direktorat Audit Kepabeanan dan Cukai</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Audit pembukuan importir/eksportir pasca-pengeluaran barang (post-clearance audit).</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0B3A6F;">Detail ➔</span>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp2-t4',
            title: 'Direktorat IKC, KSIKC, Kombimjas, & KBP',
            status: 'locked',
            summary: 'Direktorat penunjang sistem otomasi TIK, kerja sama internasional, komunikasi publik, dan perumusan produk hukum.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="dit-ikc" style="padding:14px; cursor:pointer; border-left:4px solid #0284C7;">
                  <strong style="color:#0284C7; font-size:13px;">Dit. IKC (Informasi Kepabeanan & Cukai)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Sistem CEISA 4.0, big data, dan server.</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="dit-ksikc" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Dit. KSIKC (Kerja Sama Internasional)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Perjanjian bilateral pabean, WCO, & ASEAN.</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="dit-kombimjas" style="padding:14px; cursor:pointer; border-left:4px solid #D9B45B;">
                  <strong style="color:#854D0E; font-size:13px;">Dit. Kombimjas (Komunikasi & Bimbingan)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Contact Center Bravo 1500225 & edukasi publik.</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="dit-kbp" style="padding:14px; cursor:pointer; border-left:4px solid #475569;">
                  <strong style="color:#334155; font-size:13px;">Dit. KBP (Keberatan, Banding, & Peraturan)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Sengketa banding pengadilan pajak & advokasi.</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp2-t5',
            title: 'Tenaga Pengkaji DJBC (Eselon II)',
            status: 'locked',
            summary: 'Tiga pejabat Eselon II Tenaga Pengkaji yang bertugas menyusun telaahan, kajian strategis makro, dan rekomendasi kebijakan langsung kepada Direktur Jenderal.',
            content: `
              <div class="card unit-interactive-card" data-unit-id="tenaga-pengkaji" style="padding:18px; cursor:pointer; border-left:4px solid #0B3A6F; background:#EFF6FF; margin:12px 0;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <span class="badge badge-org" style="font-size:11px;">Eselon II</span>
                    <h4 style="font-size:15px; font-weight:800; color:#1E3A8A; margin:4px 0;">Kelompok Tenaga Pengkaji DJBC</h4>
                  </div>
                  <button class="btn btn-outline" style="font-size:12px; font-weight:700;">🔍 Detail Unit</button>
                </div>
                <ul style="font-size:12.5px; color:#1E3A8A; line-height:1.7; margin:8px 0 0 0; padding-left:18px;">
                  <li>Tenaga Pengkaji Bidang Pengembangan Kapasitas dan Kinerja Organisasi</li>
                  <li>Tenaga Pengkaji Bidang Pengawasan dan Penegakan Hukum</li>
                  <li>Tenaga Pengkaji Bidang Pelayanan dan Penerimaan</li>
                </ul>
              </div>
            `
          }
        ]
      },
      {
        id: 'mp-03',
        title: 'MP 3: Organisasi Instansi Vertikal dan UPT',
        subtitle: '20 Kantor Wilayah, 3 KPU BC, 104 KPPBC, 3 BLBC, & 6 PSO',
        jp: '4 JP',
        estimatedTime: '25 Menit',
        topics: [
          {
            id: 'mp3-t1',
            title: 'Kantor Wilayah (Kanwil DJBC)',
            status: 'active',
            summary: '20 Kanwil bertindak sebagai pembina teknis regional, pengendali operasional KPPBC, pelaksana audit kepabeanan, dan pengawas kepatuhan internal di tingkat provinsi.',
            content: `
              <p style="font-size:13.5px; color:#334155; line-height:1.6;">
                Setiap Kanwil dipimpin oleh Kepala Kantor Wilayah (Eselon IIa/IIb) yang membina beberapa KPPBC di wilayah kerjanya.
              </p>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:14px 0;">
                <div class="card unit-interactive-card" data-unit-id="kanwil-aceh" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Kanwil DJBC Aceh</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Banda Aceh | Klik untuk lihat profil ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kanwil-sumut" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Kanwil DJBC Sumatera Utara</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Medan | Klik untuk lihat profil ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kanwil-jabar" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Kanwil DJBC Jawa Barat</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Bandung | Klik untuk lihat profil ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kanwil-jatim-i" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Kanwil DJBC Jawa Timur I</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Surabaya | Klik untuk lihat profil ➔</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp3-t2',
            title: 'Kantor Pelayanan Utama (KPU BC)',
            status: 'locked',
            summary: '3 KPU dibentuk di pelabuhan/bandara dengan volume devisa & lalu lintas barang raksasa, mengintegrasikan fungsi Kanwil dan KPPBC dalam satu atap mandiri.',
            content: `
              <div style="display:flex; flex-direction:column; gap:12px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="kpu-tanjung-priok" style="padding:16px; cursor:pointer; border-left:4px solid #0284C7;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0284C7; font-size:14px;">1. 🚢 KPU Bea Cukai Tipe A Tanjung Priok (Jakarta)</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Pelabuhan peti kemas internasional terbesar di Indonesia.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0284C7;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="kpu-batam" style="padding:16px; cursor:pointer; border-left:4px solid #0284C7;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0284C7; font-size:14px;">2. 🏝️ KPU Bea Cukai Tipe B Batam</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Kawasan Perdagangan Bebas dan Pelabuhan Bebas (Free Trade Zone).</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0284C7;">Detail ➔</span>
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="kpu-soekarno-hatta" style="padding:16px; cursor:pointer; border-left:4px solid #0284C7;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <strong style="color:#0284C7; font-size:14px;">3. ✈️ KPU Bea Cukai Tipe C Soekarno-Hatta (Tangerang)</strong>
                      <div style="font-size:12.5px; color:#475569; margin-top:4px;">Bandara internasional kargo udara dan penumpang internasional.</div>
                    </div>
                    <span style="font-size:12px; font-weight:700; color:#0284C7;">Detail ➔</span>
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp3-t3',
            title: 'Kantor Pengawasan dan Pelayanan (KPPBC)',
            status: 'locked',
            summary: '104 KPPBC tersebar di seluruh kabupaten/kota pelabuhan dan perbatasan, terbagi dalam Tipe Madya Pabean (A, B, C) dan Tipe Pratama.',
            content: `
              <p style="font-size:13.5px; color:#334155; line-height:1.6;">
                KPPBC bertugas melakukan penerimaan dokumen PIB/PEB, penetapan tarif & nilai pabean, pemeriksaan fisik barang di lapangan, patroli darat, pelayanan cukai pabrik rokok, dan penindakan pelanggaran.
              </p>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="kppbc-bandung" style="padding:12px; cursor:pointer; border-left:3px solid #0B3A6F;">
                  <strong style="font-size:13px; color:#0B3A6F;">🏬 KPPBC TMP A Bandung</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Klik untuk lihat profil unit ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kppbc-kudus" style="padding:12px; cursor:pointer; border-left:3px solid #0B3A6F;">
                  <strong style="font-size:13px; color:#0B3A6F;">🏭 KPPBC TMC Kudus</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Klik untuk lihat profil unit ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kppbc-tanjung-perak" style="padding:12px; cursor:pointer; border-left:3px solid #0B3A6F;">
                  <strong style="font-size:13px; color:#0B3A6F;">🚢 KPPBC TMP A Tanjung Perak</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Klik untuk lihat profil unit ➔</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp3-t4',
            title: 'Unit Pelaksana Teknis (BLBC & PSO BC)',
            status: 'locked',
            summary: 'UPT memberikan dukungan keahlian laboratorium ilmiah dan sarana armada patroli laut berstandar militer.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="blbc-jakarta" style="padding:16px; cursor:pointer; border-left:4px solid #854D0E; background:#FFFDF5;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#854D0E; font-size:14px;">🔬 Balai Laboratorium Bea Cukai (BLBC)</strong>
                    <span style="font-size:11px; font-weight:700; color:#854D0E;">Detail ➔</span>
                  </div>
                  <div style="font-size:12px; color:#713F12; margin-top:6px;">
                    3 Lokasi: Jakarta (Pusat), Surabaya, dan Medan. Menguji komposisi kimiawi, spektrum tekstil, mineral, dan bahan kimia berbahaya.
                  </div>
                </div>

                <div class="card unit-interactive-card" data-unit-id="pso-karimun" style="padding:16px; cursor:pointer; border-left:4px solid #854D0E; background:#FFFDF5;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong style="color:#854D0E; font-size:14px;">⚓ Pangkalan Sarana Operasi (PSO BC)</strong>
                    <span style="font-size:11px; font-weight:700; color:#854D0E;">Detail ➔</span>
                  </div>
                  <div style="font-size:12px; color:#713F12; margin-top:6px;">
                    6 Wilayah Pangkalan: Tanjung Balai Karimun (Tipe A), Batam, Tanjung Priok, Pantoloan, Sorong, dan Kupang. Mengelola armada kapal Fast Patrol Boat (FPB).
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp3-t5',
            title: 'Perbedaan Tipe-Tipe Kantor Pelayanan Bea dan Cukai',
            status: 'locked',
            summary: 'Analisis komprehensif tipologi kantor pelayanan: KPU Tipe A/B/C vs KPPBC Tipe Madya Pabean (A/B/C), Tipe Madya Cukai (TMC), dan Tipe Pratama berdasarkan beban kerja, penerimaan, dan eselonisasi.',
            content: `
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin-bottom:20px;">
                <h4 style="font-size:15px; font-weight:800; color:#062B52; margin-bottom:10px;">4 Parameter Utama Penetapan Tipologi Kantor Pelayanan:</h4>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
                  <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-left:4px solid #0284C7; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#001631;">1. Volume Dokumen & Transaksi</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Jumlah dokumen PIB (impor), PEB (ekspor), manifes kargo, dan permohonan fasilitas kepabeanan/cukai per tahun.</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-left:4px solid #059669; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#001631;">2. Potensi Penerimaan Negara</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Besaran target dan realisasi penerimaan Bea Masuk, Bea Keluar, dan Cukai (mulai puluhan miliar hingga puluhan triliun rupiah).</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-left:4px solid #DC2626; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#001631;">3. Kerawanan & Kompleksitas Pengawasan</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Tingkat kerawanan penyelundupan di perbatasan, jalur pelayaran selat internasional, serta luas area pengawasan laut/darat.</div>
                  </div>
                  <div style="background:#FFFFFF; border:1px solid #CBD5E1; border-left:4px solid #D97706; border-radius:8px; padding:12px;">
                    <div style="font-weight:700; font-size:13px; color:#001631;">4. Karakteristik Kawasan Khusus</div>
                    <div style="font-size:12px; color:#475569; margin-top:4px;">Keberadaan Pelabuhan Utama, Bandara Hub Internasional, Kawasan Perdagangan Bebas (KPBPB), KEK, atau Sentra Pabrik Rokok.</div>
                  </div>
                </div>
              </div>

              <!-- Komparasi Perbedaan Utama KPU vs KPPBC -->
              <h4 style="font-size:15px; font-weight:800; color:#0B3A6F; margin:20px 0 12px 0;">Perbedaan Fundamental: KPU vs KPPBC</h4>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-bottom:20px;">
                <div style="background:#EFF6FF; border:1.5px solid #3B82F6; border-radius:10px; padding:16px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <span class="badge" style="background:#3B82F6; color:#FFFFFF; font-size:11px; font-weight:700;">KANTOR PELAYANAN UTAMA (KPU)</span>
                    <span style="font-size:12px; font-weight:800; color:#1D4ED8;">Eselon II</span>
                  </div>
                  <ul style="font-size:12.5px; color:#1E3A8A; line-height:1.6; padding-left:18px; margin:0;">
                    <li><strong>Hierarki:</strong> Bertanggung jawab <strong>langsung kepada Dirjen Bea dan Cukai</strong> (tidak di bawah Kanwil).</li>
                    <li><strong>Struktur:</strong> Konsep <em>single window / satu atap</em> menggabungkan fungsi Kanwil dan Kantor Pelayanan.</li>
                    <li><strong>Kewenangan:</strong> Memiliki Bidang Perbendaharaan & Keberatan sendiri serta Bidang Kepatuhan Internal mandiri.</li>
                    <li><strong>Eselonisasi Pejabat:</strong> Kepala Kantor Eselon IIa/IIb, Kepala Bidang Eselon III, Kepala Seksi Eselon IV.</li>
                  </ul>
                </div>

                <div style="background:#F0FDF4; border:1.5px solid #22C55E; border-radius:10px; padding:16px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                    <span class="badge" style="background:#16A34A; color:#FFFFFF; font-size:11px; font-weight:700;">KANTOR PENGAWASAN & PELAYANAN (KPPBC)</span>
                    <span style="font-size:12px; font-weight:800; color:#15803D;">Eselon III / IV</span>
                  </div>
                  <ul style="font-size:12.5px; color:#14532D; line-height:1.6; padding-left:18px; margin:0;">
                    <li><strong>Hierarki:</strong> Berada di bawah koordinasi dan pembinaan <strong>Kepala Kantor Wilayah (Kanwil)</strong> terkait.</li>
                    <li><strong>Struktur:</strong> Terfokus pada eksekusi teknis operasional pelayanan dan pengawasan langsung di lapangan.</li>
                    <li><strong>Kewenangan:</strong> Pengajuan keberatan dan audit kepabeanan berlanjut dikoordinasikan bersama Kanwil pembina.</li>
                    <li><strong>Eselonisasi Pejabat:</strong> Kepala Kantor Eselon IIIa/IIIb (Tipe Madya) atau Eselon IVa (Tipe Pratama).</li>
                  </ul>
                </div>
              </div>

              <!-- Rincian Tipologi & Tabel Perbandingan -->
              <h4 style="font-size:15px; font-weight:800; color:#062B52; margin:20px 0 12px 0;">Matriks Komparasi Tipe Kantor Pelayanan DJBC:</h4>
              <div style="overflow-x:auto; margin-bottom:20px; border:1px solid #E2E8F0; border-radius:10px;">
                <table style="width:100%; border-collapse:collapse; font-size:12.5px; text-align:left;">
                  <thead>
                    <tr style="background:#0B3A6F; color:#FFFFFF;">
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Tipe Kantor</th>
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Eselon Pimpinan</th>
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Atasan Langsung</th>
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Fokus & Karakteristik Wilayah</th>
                      <th style="padding:10px 12px; border-bottom:1px solid #CBD5E1;">Contoh Kantor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0284C7;">KPU Tipe A</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#E0F2FE; color:#0369A1; font-weight:700;">Eselon II.a</span></td>
                      <td style="padding:10px 12px; font-weight:600;">Dirjen Bea Cukai</td>
                      <td style="padding:10px 12px;">Pelabuhan peti kemas laut internasional terbesar dengan arus devisa & kargo ekspor-impor raksasa.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPU BC Tipe A Tanjung Priok</td>
                    </tr>
                    <tr style="background:#FFFFFF; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0284C7;">KPU Tipe B</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#E0F2FE; color:#0369A1; font-weight:700;">Eselon II.b</span></td>
                      <td style="padding:10px 12px; font-weight:600;">Dirjen Bea Cukai</td>
                      <td style="padding:10px 12px;">Kawasan Perdagangan Bebas dan Pelabuhan Bebas (KPBPB/FTZ) dengan perlakuan pabean khusus.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPU BC Tipe B Batam</td>
                    </tr>
                    <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0284C7;">KPU Tipe C</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#E0F2FE; color:#0369A1; font-weight:700;">Eselon II.b</span></td>
                      <td style="padding:10px 12px; font-weight:600;">Dirjen Bea Cukai</td>
                      <td style="padding:10px 12px;">Bandara internasional hub udara, terminal kargo pesawat, penumpang mancanegara, & PJT.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPU BC Tipe C Soekarno-Hatta</td>
                    </tr>
                    <tr style="background:#FFFFFF; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0B3A6F;">KPPBC TMP A</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:700;">Eselon III.a</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Pelabuhan besar/kawasan industri padat fasilitas (Kawasan Berikat, KITE) dengan volume dokumen sangat tinggi.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">TMP A Tanjung Perak, TMP A Bandung, TMP A Semarang</td>
                    </tr>
                    <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0B3A6F;">KPPBC TMP B</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:700;">Eselon III.a</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Pusat ekonomi regional provinsi, pelabuhan ekspor komoditas alam, dan bandara internasional daerah.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">TMP B Surakarta, TMP B Pontianak, TMP B Palembang</td>
                    </tr>
                    <tr style="background:#FFFFFF; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#0B3A6F;">KPPBC TMP C</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:700;">Eselon III.b</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Wilayah kota/kabupaten dengan fokus industri tertentu atau penanganan pos internasional.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">TMP C Cirebon, TMP C Magelang, TMP C Kantor Pos Pasar Baru</td>
                    </tr>
                    <tr style="background:#F8FAFC; border-bottom:1px solid #E2E8F0;">
                      <td style="padding:10px 12px; font-weight:700; color:#D97706;">KPPBC TMC (Cukai)</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#FEF3C7; color:#92400E; font-weight:700;">Eselon III.a / III.b</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Sentra industri hasil tembakau (rokok) & MMEA dengan target penerimaan cukai skala triliunan.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPPBC TMC Kudus, TMC Kediri, TMC Malang</td>
                    </tr>
                    <tr style="background:#FFFFFF;">
                      <td style="padding:10px 12px; font-weight:700; color:#475569;">KPPBC Tipe Pratama</td>
                      <td style="padding:10px 12px;"><span class="badge" style="background:#F1F5F9; color:#475569; font-weight:700;">Eselon IV.a</span></td>
                      <td style="padding:10px 12px;">Kakanwil DJBC</td>
                      <td style="padding:10px 12px;">Pos Lintas Batas Negara (PLBN) darat atau pelabuhan pulau terpencil dengan transaksi terbatas.</td>
                      <td style="padding:10px 12px; font-weight:600; color:#0B3A6F;">KPPBC Pratama di kawasan perbatasan darat/kepulauan terluar</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Interactive Unit Explorer Cards -->
              <h4 style="font-size:14px; font-weight:700; color:#001631; margin-bottom:10px;">Eksplorasi Profil Unit Pelayanan di Side Panel:</h4>
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
                <div class="card unit-interactive-card" data-unit-id="kpu-tanjung-priok" style="padding:12px; cursor:pointer; border-left:3px solid #0284C7;">
                  <strong style="font-size:13px; color:#0284C7;">🚢 KPU Tipe A Tg. Priok</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contoh KPU Laut Terbesar ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kpu-soekarno-hatta" style="padding:12px; cursor:pointer; border-left:3px solid #0284C7;">
                  <strong style="font-size:13px; color:#0284C7;">✈️ KPU Tipe C Soetta</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contoh KPU Udara Terbesar ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kppbc-tanjungperak" style="padding:12px; cursor:pointer; border-left:3px solid #0B3A6F;">
                  <strong style="font-size:13px; color:#0B3A6F;">🚢 KPPBC TMP A Tg. Perak</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contoh TMP A Pelabuhan ➔</div>
                </div>
                <div class="card unit-interactive-card" data-unit-id="kppbc-kudus" style="padding:12px; cursor:pointer; border-left:3px solid #D97706;">
                  <strong style="font-size:13px; color:#D97706;">🏭 KPPBC TMC Kudus</strong>
                  <div style="font-size:11.5px; color:#64748B; margin-top:2px;">Contoh Sentra Cukai Rokok ➔</div>
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: 'mp-04',
        title: 'MP 4: Jabatan Fungsional di Lingkungan DJBC',
        subtitle: 'Kategori Keahlian, Keterampilan, Jenjang Karir, & Butir Kegiatan',
        jp: '2 JP',
        estimatedTime: '15 Menit',
        topics: [
          {
            id: 'mp4-t1',
            title: 'Pengertian & Kategori Jabatan Fungsional',
            status: 'active',
            summary: 'Jabatan Fungsional (JF) adalah sekelompok jabatan yang berisi fungsi dan tugas berkaitan dengan pelayanan fungsional berbasis keahlian dan keterampilan tertentu.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px; margin: 14px 0;">
                <div style="background:#F8FAFC; border:1.5px solid #0B3A6F; border-radius:10px; padding:16px;">
                  <span style="font-size:12px; font-weight:700; color:#0B3A6F; text-transform:uppercase;">Kategori Keahlian</span>
                  <div style="font-size:13px; color:#334155; margin-top:6px; line-height:1.5;">
                    Dominasi karakteristik pekerjaan pada ranah <strong>kognitif</strong> (pengetahuan, analisis, dan perumusan kebijakan). Kualifikasi pendidikan minimal S1 / D-IV.
                  </div>
                </div>
                <div style="background:#F8FAFC; border:1.5px solid #0284C7; border-radius:10px; padding:16px;">
                  <span style="font-size:12px; font-weight:700; color:#0284C7; text-transform:uppercase;">Kategori Keterampilan</span>
                  <div style="font-size:13px; color:#334155; margin-top:6px; line-height:1.5;">
                    Dominasi karakteristik pekerjaan pada ranah <strong>psikomotorik</strong> (prosedural teknis operasional). Kualifikasi pendidikan minimal SMA / D-III.
                  </div>
                </div>
              </div>
            `
          },
          {
            id: 'mp4-t2',
            title: 'Jenjang & Koefisien Angka Kredit',
            status: 'locked',
            summary: 'Jenjang jabatan merefleksikan tingkatan kompleksitas lingkup pekerjaan dan angka kredit tahunan.',
            content: `
              <div style="overflow-x:auto; margin:14px 0;">
                <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
                  <thead>
                    <tr style="background:#062B52; color:#FFFFFF;">
                      <th style="padding:10px 14px;">Kategori</th>
                      <th style="padding:10px 14px;">Jenjang Jabatan</th>
                      <th style="padding:10px 14px;">Pangkat / Golongan</th>
                      <th style="padding:10px 14px;">Koefisien AK/Tahun</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#FFFFFF;">
                      <td rowspan="4" style="padding:10px 14px; font-weight:700; color:#0B3A6F; vertical-align:top; border-right:1px solid #E2E8F0;">Keahlian</td>
                      <td style="padding:10px 14px; font-weight:600;">Ahli Utama</td>
                      <td style="padding:10px 14px;">IV/d – IV/e</td>
                      <td style="padding:10px 14px; font-weight:700; color:#059669;">50</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#F8FAFC;">
                      <td style="padding:10px 14px; font-weight:600;">Ahli Madya</td>
                      <td style="padding:10px 14px;">IV/a – IV/c</td>
                      <td style="padding:10px 14px; font-weight:700; color:#059669;">37,5</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#FFFFFF;">
                      <td style="padding:10px 14px; font-weight:600;">Ahli Muda</td>
                      <td style="padding:10px 14px;">III/c – III/d</td>
                      <td style="padding:10px 14px; font-weight:700; color:#059669;">25</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#F8FAFC;">
                      <td style="padding:10px 14px; font-weight:600;">Ahli Pertama</td>
                      <td style="padding:10px 14px;">III/a – III/b</td>
                      <td style="padding:10px 14px; font-weight:700; color:#059669;">12,5</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#FFFFFF;">
                      <td rowspan="3" style="padding:10px 14px; font-weight:700; color:#0284C7; vertical-align:top; border-right:1px solid #E2E8F0;">Keterampilan</td>
                      <td style="padding:10px 14px; font-weight:600;">Penyelia</td>
                      <td style="padding:10px 14px;">III/c – III/d</td>
                      <td style="padding:10px 14px; font-weight:700; color:#0284C7;">25</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#F8FAFC;">
                      <td style="padding:10px 14px; font-weight:600;">Mahir</td>
                      <td style="padding:10px 14px;">III/a – III/b</td>
                      <td style="padding:10px 14px; font-weight:700; color:#0284C7;">12,5</td>
                    </tr>
                    <tr style="border-bottom:1px solid #E2E8F0; background:#FFFFFF;">
                      <td style="padding:10px 14px; font-weight:600;">Terampil</td>
                      <td style="padding:10px 14px;">II/b – II/d</td>
                      <td style="padding:10px 14px; font-weight:700; color:#0284C7;">5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `
          },
          {
            id: 'mp4-t3',
            title: 'JF Pemeriksa Bea dan Cukai (PBC)',
            status: 'locked',
            summary: 'JF PBC merupakan ujung tombak fungsional yang memiliki kewenangan mandiri dalam pemeriksaan dan penetapan dokumen kepabeanan dan cukai.',
            content: `
              <p style="font-size:13.5px; color:#334155; line-height:1.6;">
                Ruang lingkup butir kegiatan JF PBC meliputi:
              </p>
              <ul style="font-size:13px; color:#334155; line-height:1.7; padding-left:18px; margin:0 0 16px 0;">
                <li>Pemeriksaan fisik barang impor/ekspor menggunakan pemindai X-Ray atau pembongkaran kemasan.</li>
                <li>Penelitian dan penetapan klasifikasi pos tarif HS Code dan nilai pabean (SPTNP).</li>
                <li>Pelaksanaan audit kepabeanan dan cukai atas pembukuan importir/pabrik BKC.</li>
                <li>Kegiatan intelijen pabean, analisis citra manifest, patroli laut, dan penindakan penyelundupan.</li>
              </ul>

              <div class="card unit-interactive-card" data-unit-id="dit-teknis-kepab" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="color:#0B3A6F; font-size:13px;">Unit Pembina Teknis Fungsional: Dit. Teknis Kepabeanan</strong>
                    <div style="font-size:12px; color:#64748B;">Klik untuk membuka rincian tugas dan fungsi unit pembina ➔</div>
                  </div>
                  <span style="font-size:12px; font-weight:700; color:#0B3A6F;">Detail ➔</span>
                </div>
              </div>
            `
          },
          {
            id: 'mp4-t4',
            title: 'Mekanisme Pengangkatan dalam JF',
            status: 'locked',
            summary: 'Pengangkatan ke dalam JF dilakukan melalui 4 jalur: Pengangkatan Pertama (CPNS), Penyesuaian/Inpassing, Perpindahan Jabatan, dan Promosi.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin:12px 0;">
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">1. Pengangkatan Pertama:</strong> Formasi Calon PNS untuk Ahli Pertama atau Terampil.
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">2. Penyesuaian (Inpassing):</strong> Penyetaraan jabatan struktural ke dalam JF.
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">3. Perpindahan Jabatan:</strong> Perpindahan horizontal antar rumpun JF atau pimpinan tinggi.
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">4. Promosi:</strong> Kenaikan jenjang jabatan fungsional setingkat lebih tinggi melalui uji kompetensi.
                </div>
              </div>
            `
          }
        ]
      },
      {
        id: 'mp-05',
        title: 'MP 5: Interdependensi Tugas dan Fungsi DJBC',
        subtitle: 'Sinergi CIQ, Perbantuan TNI/Polri, Lartas K/L (INSW), & Forum Internasional',
        jp: '2 JP',
        estimatedTime: '15 Menit',
        topics: [
          {
            id: 'mp5-t1',
            title: 'Kerja Sama CIQ di Pintu Masuk Negara',
            status: 'active',
            summary: 'Konsep sinergi Customs, Immigration, and Quarantine (CIQ) di pelabuhan internasional, bandara, dan Pos Lintas Batas Negara (PLBN).',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin: 14px 0;">
                <div class="card unit-interactive-card" data-unit-id="djbc" style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; padding:16px; cursor:pointer;">
                  <div style="font-size:24px; margin-bottom:4px;">📦</div>
                  <strong style="color:#1E40AF; font-size:13.5px;">DJBC (Customs) ➔</strong>
                  <div style="font-size:12px; color:#1E3A8A; margin-top:4px;">Pengawasan dan pemungutan bea atas <strong>lalu lintas barang</strong>.</div>
                </div>
                <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; padding:16px;">
                  <div style="font-size:24px; margin-bottom:4px;">🛂</div>
                  <strong style="color:#1E40AF; font-size:13.5px;">Ditjen Imigrasi</strong>
                  <div style="font-size:12px; color:#1E3A8A; margin-top:4px;">Pemeriksaan paspor, visa, dan <strong>lalu lintas orang / pelintas batas</strong>.</div>
                </div>
                <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:10px; padding:16px;">
                  <div style="font-size:24px; margin-bottom:4px;">🌱</div>
                  <strong style="color:#1E40AF; font-size:13.5px;">Badan Karantina Indonesia</strong>
                  <div style="font-size:12px; color:#1E3A8A; margin-top:4px;">Pengawasan karantina atas <strong>hewan, ikan, dan tumbuhan</strong>.</div>
                </div>
              </div>
            `
          },
          {
            id: 'mp5-t2',
            title: 'Perbantuan TNI, Polri, & Aparat Penegak Hukum',
            status: 'locked',
            summary: 'Mandat Pasal 76 UU Kepabeanan dan Pasal 34 UU Cukai memberikan kewenangan Pejabat Bea Cukai meminta bantuan TNI/Polri dalam penindakan berisiko tinggi.',
            content: `
              <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:10px; padding:16px; margin: 12px 0;">
                <div style="font-size:13.5px; font-weight:700; color:#991B1B; margin-bottom:6px;">Dasar Hukum Sinergi Taktis:</div>
                <p style="font-size:12.5px; line-height:1.6; color:#7F1D1D; margin:0;">
                  <em>"Pejabat Bea dan Cukai dalam melaksanakan tugas pengawasan dan penindakan dapat meminta bantuan Kepolisian RI, Tentara Nasional Indonesia, Badan Keamanan Laut (Bakamla), dan/atau instansi lainnya; dan atas permintaan tersebut instansi yang diminta berkewajiban untuk memenuhinya."</em> (Pasal 76 UU Kepabeanan jo Pasal 34 UU Cukai).
                </p>
              </div>

              <div class="card unit-interactive-card" data-unit-id="dit-p2" style="padding:14px; cursor:pointer; border-left:4px solid #991B1B; margin-top:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="color:#991B1B; font-size:13px;">Unit Pelaksana Kerja Sama Operasi: Dit. Penindakan & Penyidikan</strong>
                    <div style="font-size:12px; color:#64748B;">Klik untuk membuka detail unit di side panel ➔</div>
                  </div>
                  <span style="font-size:12px; font-weight:700; color:#991B1B;">Detail ➔</span>
                </div>
              </div>
            `
          },
          {
            id: 'mp5-t3',
            title: 'Pengawasan Larangan & Pembatasan (Lartas) & INSW',
            status: 'locked',
            summary: 'DJBC bertindak sebagai garda batas penjaga kebijakan tata niaga impor/ekspor yang diterbitkan oleh K/L teknis.',
            content: `
              <p style="font-size:13.5px; color:#334155; line-height:1.6;">
                Semua barang dapat diekspor/diimpor kecuali yang dilarang atau dibatasi (Lartas). Aturan Lartas dari instansi teknis terintegrasi melalui <strong>Indonesia National Single Window (INSW)</strong>:
              </p>
              <ul style="font-size:12.5px; color:#334155; line-height:1.7; padding-left:18px; margin:0;">
                <li><strong>Kementerian Perdagangan:</strong> Persetujuan Impor (PI), Laporan Surveyor (LS).</li>
                <li><strong>BPOM & Kemenkes:</strong> Izin Edar obat, suplemen, kosmetik, dan alat kesehatan.</li>
                <li><strong>Kementerian Pertanian:</strong> Izin pemasukan bibit unggul dan komoditas pangan.</li>
                <li><strong>BAPETEN:</strong> Pengawasan bahan radioaktif dan nuklir.</li>
              </ul>
            `
          },
          {
            id: 'mp5-t4',
            title: 'Kiprah DJBC dalam Forum & Kerja Sama Internasional',
            status: 'locked',
            summary: 'Keikutsertaan aktif DJBC dalam harmonisasi kepabeanan global dan pertukaran intelijen internasional.',
            content: `
              <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin:12px 0;">
                <div class="card unit-interactive-card" data-unit-id="dit-ksikc" style="padding:14px; cursor:pointer; border-left:4px solid #0B3A6F;">
                  <strong style="color:#0B3A6F; font-size:13px;">Dit. Kerja Sama Internasional (KSIKC)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:4px;">Klik untuk melihat tusi kerja sama WCO, ASEAN, & RILO AP ➔</div>
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">World Customs Organization (WCO)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:2px;">Harmonized System (HS Code), SAFE Framework of Standards, dan Kyoto Convention.</div>
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">ASEAN Customs Single Window</strong>
                  <div style="font-size:12px; color:#475569; margin-top:2px;">Pertukaran e-Form D Surat Keterangan Asal (SKA) otomatis antar negara ASEAN.</div>
                </div>
                <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px;">
                  <strong style="color:#0B3A6F; font-size:13px;">RILO AP (Regional Intelligence)</strong>
                  <div style="font-size:12px; color:#475569; margin-top:2px;">Pertukaran data intelijen penegakan hukum narkotika dan satwa langka lintas negara.</div>
                </div>
              </div>
            `
          }
        ]
      }
    ];
  }

  render() {
    if (!this.container) return;

    const activeModule = this.modules[this.currentModuleIndex] || this.modules[0];
    const activeTopic = activeModule.topics[this.currentTopicIndex] || activeModule.topics[0];

    this.container.innerHTML = `
      <div class="learning-page-wrapper" style="padding: 24px 32px; max-width: 1240px; margin: 0 auto; width: 100%;">
        <!-- Header Bar with Breadcrumb and Tour Button -->
        <div class="learning-header-bar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px; gap: 12px; width: 100%;">
          <!-- Breadcrumb Bar -->
          <div class="learning-breadcrumb-bar" style="display:flex; align-items:center; gap:8px; font-size:13px; color:#64748B; flex:1; min-width:0; overflow:hidden;">
            <span class="learning-breadcrumb-module" style="display:flex; align-items:center; gap:5px; font-weight:700; color:#0B3A6F; white-space:nowrap; flex-shrink:0;">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              ${activeModule.title.split(':')[0]}
            </span>
            <span class="learning-breadcrumb-sep" style="color:#94A3B8; font-weight:600; flex-shrink:0;">›</span>
            <span class="learning-breadcrumb-topic" style="font-weight:700; color:#001631; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${activeTopic.title}">${activeTopic.title}</span>
          </div>

          <!-- Tutorial Beacon Trigger Button -->
          <button id="learning-tour-btn" class="btn btn-outline learning-tour-btn" style="font-size:12px; font-weight:600; padding:5px 12px; gap:6px; border-radius:20px; cursor:pointer; flex-shrink:0; white-space:nowrap; display:flex; align-items:center;" onclick="if(window.walkthroughBeacons){window.walkthroughBeacons.startLearningTour(true);}" title="Buka Panduan Interaktif Modul">
            <span>💡</span>
            <span class="learning-tour-btn-text">Panduan Modul</span>
          </button>
        </div>

        <!-- Module Selector Tabs (MP 1 s.d. MP 5) -->
        <div id="learning-module-tabs" style="display:flex; gap:10px; margin-bottom: 24px; border-bottom:1px solid #E2E8F0; padding-bottom:14px; overflow-x:auto;">
          ${this.modules.map((mod, idx) => `
            <button class="btn ${idx === this.currentModuleIndex ? 'btn-primary' : 'btn-outline'}" data-mod-idx="${idx}" style="font-size:13px; font-weight:600; white-space:nowrap; padding:8px 16px;">
              ${mod.title.split(':')[0]} (${mod.jp})
            </button>
          `).join('')}
        </div>

        <!-- Grid Layout: Sub-Topic Stepper (Left) & Lesson Content (Right) -->
        <div class="learning-content-grid" style="display:grid; grid-template-columns: 290px 1fr; gap: 28px; align-items:flex-start;">
          <!-- Left Column: Vertical Sub-Topic Stepper -->
          <div id="learning-stepper-sidebar" class="card" style="padding: 20px; position:sticky; top: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0;">
              <span style="font-size: 14px; font-weight: 700; color: #001631;">Sub-Topik Modul</span>
              <span class="badge badge-org" style="font-size:11px;">${activeModule.jp}</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:4px; position:relative;">
              <div style="position:absolute; left:25px; top:15px; bottom:15px; width:2px; background:#E2E8F0; z-index:1;"></div>

              ${activeModule.topics.map((t, idx) => {
                const isSelected = idx === this.currentTopicIndex;
                const statusClass = isSelected ? 'active' : (t.status === 'completed' ? 'completed' : (t.status === 'locked' ? 'locked' : ''));
                return `
                  <div class="learning-stepper-item ${statusClass}" data-topic-idx="${idx}">
                    <div class="learning-stepper-dot">
                      ${isSelected ? '▶' : (t.status === 'completed' ? '✓' : (idx + 1))}
                    </div>
                    <div style="flex:1;">
                      <div style="font-size:13px; font-weight:${isSelected ? '700' : '600'}; color:${isSelected ? '#0B3A6F' : '#334155'};">
                        ${t.title}
                      </div>
                      <div style="font-size:11px; color:#94A3B8; margin-top:2px;">
                        ${isSelected ? 'Sedang Dipelajari' : (t.status === 'completed' ? 'Selesai' : 'Siap Dibaca')}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Right Column: Main Lesson Content Area -->
          <div id="learning-lesson-content" class="card" style="padding: 32px;">
            <!-- Lesson Header -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px; border-bottom:1px solid #E2E8F0; padding-bottom: 16px;">
              <div>
                <span class="badge badge-policy" style="font-size:11.5px; font-weight:700; text-transform:uppercase;">
                  ${activeModule.title} • Sub-Topik ${this.currentTopicIndex + 1} dari ${activeModule.topics.length}
                </span>
                <h2 style="font-size: 22px; font-weight: 800; color: #001631; margin: 8px 0 4px 0;">
                  ${activeTopic.title}
                </h2>
                <div style="font-size: 13px; color: #64748B;">
                  ${activeModule.subtitle} (Alokasi: <strong>${activeModule.jp}</strong>)
                </div>
              </div>
            </div>

            <!-- Summary Box -->
            <div style="background:#F8FAFC; border-left:4px solid #0B3A6F; border-radius:4px; padding:16px 20px; margin-bottom: 24px;">
              <div style="font-size: 11.5px; font-weight: 700; color: #0B3A6F; text-transform: uppercase; margin-bottom: 4px;">
                💡 Ringkasan & Kompetensi Dasar
              </div>
              <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0;">
                ${activeTopic.summary}
              </p>
            </div>

            <!-- Detailed Content with Clickable Unit Cards -->
            <div style="margin-bottom: 32px;">
              ${activeTopic.content}
            </div>

            <!-- Lesson Navigation Action Buttons -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #E2E8F0; padding-top: 24px; flex-wrap:wrap; gap:12px;">
              <button id="btn-explore-topic-tree" class="btn btn-outline" style="font-size:13px; font-weight:600; gap:6px;">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                Buka di Bagan Organisasi
              </button>

              <div style="display:flex; gap:10px;">
                ${this.currentTopicIndex > 0 ? `
                  <button id="btn-prev-topic" class="btn btn-outline" style="font-size:13px; font-weight:600;">
                    ← Topik Sebelumnya
                  </button>
                ` : ''}

                <button id="btn-next-topic" class="btn btn-primary" style="font-size:13px; font-weight:700; gap:6px;">
                  <span>${this.currentTopicIndex < activeModule.topics.length - 1 ? 'Lanjut ke Topik Berikutnya →' : (this.currentModuleIndex < this.modules.length - 1 ? 'Lanjut ke Modul Berikutnya →' : 'Mulai Uji Kasus & Kuis 🎯')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach Module Selector event listeners
    this.container.querySelectorAll('[data-mod-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentModuleIndex = parseInt(btn.getAttribute('data-mod-idx'), 10);
        this.currentTopicIndex = 0;
        this.render();
      });
    });

    // Attach Sub-Topic Stepper click event listeners
    this.container.querySelectorAll('[data-topic-idx]').forEach(item => {
      item.addEventListener('click', () => {
        this.currentTopicIndex = parseInt(item.getAttribute('data-topic-idx'), 10);
        this.render();
      });
    });

    // Attach Clickable Unit listeners to open DetailPanel
    this.container.querySelectorAll('[data-unit-id]').forEach(unitEl => {
      unitEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const unitId = unitEl.getAttribute('data-unit-id');
        if (unitId && this.onSelectUnit) {
          this.onSelectUnit(unitId);
        }
      });
    });

    // Previous Topic Button
    const prevBtn = this.container.querySelector('#btn-prev-topic');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentTopicIndex > 0) {
          this.currentTopicIndex--;
          this.render();
        }
      });
    }

    // Next Topic Button
    const nextBtn = this.container.querySelector('#btn-next-topic');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentTopicIndex < activeModule.topics.length - 1) {
          activeTopic.status = 'completed';
          this.currentTopicIndex++;
          this.render();
        } else if (this.currentModuleIndex < this.modules.length - 1) {
          this.currentModuleIndex++;
          this.currentTopicIndex = 0;
          this.render();
        } else {
          this.onNavigate('view-quiz');
        }
      });
    }

    // Open Topic in Explorer Tree
    const exploreBtn = this.container.querySelector('#btn-explore-topic-tree');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        this.onNavigate('view-explorer');
      });
    }
  }
}
