window.data_alur_proses = {
  "proses": [
    {
      "id": "impor",
      "nama": "Proses Impor (Pelayanan & Pengawasan)",
      "tahapan": [
        {
          "no": 1,
          "judul": "Perencanaan Impor & Registrasi",
          "deskripsi": "Importir melakukan registrasi kepabeanan untuk memperoleh akses kepabeanan, mempersiapkan dokumen izin impor, dan mengecek ketentuan larangan/pembatasan (lartas) komoditi.",
          "output": [
            "Akses Kepabeanan Aktif",
            "Persetujuan Izin Impor (Lartas)"
          ],
          "unit_terlibat": [
            {
              "unit_id": "dit-teknis-kepab",
              "nama": "Dit. Teknis Kepabeanan",
              "peran": "Perumusan kebijakan registrasi kepabeanan & ketentuan impor umum.",
              "warna": "#0E7490"
            },
            {
              "unit_id": "dit-fasilitas-kepab",
              "nama": "Dit. Fasilitas Kepabeanan",
              "peran": "Pemberian fasilitas fiskal impor (pembebasan/keringanan bea masuk jika ada).",
              "warna": "#0E7490"
            }
          ]
        },
        {
          "no": 2,
          "judul": "Kedatangan Sarana Pengangkut",
          "deskripsi": "Pengangkut menyerahkan Rencana Kedatangan Sarana Pengangkut (RKSP) dan manifes kedatangan barang (Inward Manifest) sebelum kapal/pesawat tiba di pelabuhan/bandara.",
          "output": [
            "Nomor Register Manifes",
            "Persetujuan Bongkar Barang"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelabuhan Bongkar",
              "peran": "Penerimaan, penatausahaan, dan penelitian manifes kedatangan sarana pengangkut.",
              "warna": "#34D399"
            },
            {
              "unit_id": "pso",
              "nama": "PSO BC (UPT Patroli)",
              "peran": "Dukungan stasiun radio komunikasi pantai untuk memandu/mengawasi kapal pengangkut masuk perairan pabean.",
              "warna": "#6366F1"
            }
          ]
        },
        {
          "no": 3,
          "judul": "Pemeriksaan & Pengawasan Dokumen",
          "deskripsi": "Importir mengajukan Pemberitahuan Impor Barang (PIB) dan membayar pungutan negara. Sistem melakukan analisis risiko untuk menentukan jalur pelayanan (Jalur Hijau, Kuning, Merah).",
          "output": [
            "Hasil Analisis Jalur",
            "Dokumen Persetujuan Pemeriksaan"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelaksana",
              "peran": "Penetapan jalur pelayanan, pemeriksaan dokumen PIB, dan penghitungan denda manifes jika ada.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-pps",
              "nama": "Dit. Penerimaan & PS",
              "peran": "Penyediaan modul manajemen risiko (profil risiko importir/komoditi) untuk penentuan jalur.",
              "warna": "#0E7490"
            },
            {
              "unit_id": "blbc",
              "nama": "BLBC (UPT Laboratorium)",
              "peran": "Pengujian laboratorium untuk identifikasi kandungan kimia/fisik barang jika ragu akan klasifikasinya.",
              "warna": "#8B5CF6"
            }
          ]
        },
        {
          "no": 4,
          "judul": "Pemeriksaan Fisik Barang",
          "deskripsi": "Khusus barang impor yang masuk Jalur Merah, petugas pemeriksa melakukan pemeriksaan fisik barang (pemeriksaan visual atau menggunakan X-Ray kontainer) untuk mencocokkan jumlah dan jenis barang.",
          "output": [
            "Laporan Hasil Pemeriksaan Fisik (LHP)",
            "Berita Acara Pemeriksaan Fisik"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelaksana",
              "peran": "Pejabat Pemeriksa Fisik (Pemeriksa Barang) melakukan pencocokan langsung di lapangan penimbunan.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-p2",
              "nama": "Dit. Penindakan & Penyidikan",
              "peran": "Pengawasan melekat (patroli wewenang/anjing pelacak K-9 jika dicurigai membawa barang selundupan).",
              "warna": "#0E7490"
            }
          ]
        },
        {
          "no": 5,
          "judul": "Penetapan Tarif & Nilai Pabean",
          "deskripsi": "Pejabat Pemeriksa Dokumen melakukan penelitian mendalam atas tarif (klasifikasi HS Code) dan nilai pabean yang diberitahukan untuk memastikan bea masuk dihitung dengan benar.",
          "output": [
            "Surat Penetapan Tarif & Nilai Pabean (SPTNP)",
            "Nota Pembetulan (jika ada selisih tarif)"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelaksana",
              "peran": "Pejabat Fungsional Pemeriksa Dokumen menetapkan tarif dan nilai pabean secara mandiri.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-teknis-kepab",
              "nama": "Dit. Teknis Kepabeanan",
              "peran": "Penyediaan database harga barang impor (DBHI) dan penetapan klasifikasi mengikat (PKSI) sebagai acuan.",
              "warna": "#0E7490"
            }
          ]
        },
        {
          "no": 6,
          "judul": "Pengeluaran Barang Impor",
          "deskripsi": "Setelah seluruh kewajiban bea masuk dipenuhi dan tidak ada hambatan lartas, sistem menerbitkan Surat Persetujuan Pengeluaran Barang (SPPB), sehingga barang dapat keluar dari kawasan pabean.",
          "output": [
            "Surat Persetujuan Pengeluaran Barang (SPPB)",
            "Barang Keluar Kawasan Pabean"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelaksana",
              "peran": "Petugas pos gerbang pabean melakukan verifikasi SPPB dan mencatat jam pengeluaran kontainer.",
              "warna": "#34D399"
            }
          ]
        },
        {
          "no": 7,
          "judul": "Pengawasan Pasca Pengeluaran (Post-Clearance)",
          "deskripsi": "Audit kepabeanan dilakukan terhadap pembukuan/laporan keuangan importir secara berkala untuk mendeteksi adanya manipulasi tarif atau nilai transaksi setelah barang keluar.",
          "output": [
            "Laporan Hasil Audit (LHA)",
            "Tagihan Kekurangan Pembayaran (SPKP)"
          ],
          "unit_terlibat": [
            {
              "unit_id": "dit-audit",
              "nama": "Dit. Audit Kepabeanan & Cukai",
              "peran": "Melakukan perencanaan audit, penugasan auditor, dan pelaksanaan audit di kantor perusahaan.",
              "warna": "#0E7490"
            },
            {
              "unit_id": "kanwil",
              "nama": "Kantor Wilayah",
              "peran": "Melaksanakan audit kepabeanan untuk perusahaan skala menengah-kecil di wilayah wewenangnya.",
              "warna": "#10B981"
            },
            {
              "unit_id": "dit-ki",
              "nama": "Dit. Kepatuhan Internal",
              "peran": "Penjaminan kualitas pelaksanaan audit dan pemantauan tindak lanjut hasil temuan audit.",
              "warna": "#0E7490"
            }
          ]
        }
      ]
    },
    {
      "id": "ekspor",
      "nama": "Proses Ekspor (Pelayanan & Pengawasan)",
      "tahapan": [
        {
          "no": 1,
          "judul": "Pengajuan Dokumen Ekspor",
          "deskripsi": "Eksportir mengajukan Pemberitahuan Ekspor Barang (PEB) melalui sistem PDE dan membayar Bea Keluar jika komoditi tersebut dikenakan pungutan ekspor.",
          "output": [
            "Dokumen PEB Terdaftar",
            "Bukti Pembayaran Bea Keluar (SSPCP)"
          ],
          "unit_terlibat": [
            {
              "unit_id": "dit-teknis-kepab",
              "nama": "Dit. Teknis Kepabeanan",
              "peran": "Perumusan tata cara ekspor umum, ekspor curah, dan ketentuan bea keluar.",
              "warna": "#0E7490"
            },
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Ekspor",
              "peran": "Menerima pengajuan dokumen PEB dan memverifikasi kelengkapan pembayaran bea keluar.",
              "warna": "#34D399"
            }
          ]
        },
        {
          "no": 2,
          "judul": "Pemeriksaan Fisik Ekspor (Selektif)",
          "deskripsi": "Sebagian kecil barang ekspor dilakukan pemeriksaan fisik berdasarkan analisis risiko (misal: barang lartas ekspor, barang mendapat fasilitas ekspor kemudahan).",
          "output": [
            "LHP Ekspor",
            "Berita Pemeriksaan Barang"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Ekspor",
              "peran": "Pemeriksa fisik mencocokkan jumlah dan jenis barang ekspor di gudang eksportir atau kawasan pabean.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-p2",
              "nama": "Dit. Penindakan & Penyidikan",
              "peran": "Pengawasan intelijen atas komoditi sensitif (misal: kayu bulat ilegal, tambang mentah lartas).",
              "warna": "#0E7490"
            }
          ]
        },
        {
          "no": 3,
          "judul": "Pemuatan Barang ke Kapal",
          "deskripsi": "Setelah lolos pemeriksaan fisik/dokumen, diterbitkan persetujuan ekspor, dan barang dimuat ke sarana pengangkut di bawah pengawasan petugas bea cukai.",
          "output": [
            "Nota Pelayanan Ekspor (NPE)",
            "Barang Dimuat ke Kapal"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Ekspor",
              "peran": "Petugas gerbang pabean dan pelabuhan melakukan pengawasan pemuatan kontainer ekspor.",
              "warna": "#34D399"
            }
          ]
        },
        {
          "no": 4,
          "judul": "Keberangkatan & Rekonsiliasi Ekspor",
          "deskripsi": "Pengangkut menyerahkan manifes keberangkatan barang (Outward Manifest) untuk rekonsiliasi data ekspor dengan data PEB yang diajukan eksportir.",
          "output": [
            "Rekonsiliasi Data Sukses",
            "Persetujuan Keberangkatan Sarana Pengangkut"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Ekspor",
              "peran": "Seksi Administrasi Manifes melakukan pencocokan data PEB dengan Outward Manifest kapal.",
              "warna": "#34D399"
            }
          ]
        }
      ]
    },
    {
      "id": "cukai",
      "nama": "Proses Cukai (Pencatatan & Pelunasan)",
      "tahapan": [
        {
          "no": 1,
          "judul": "Registrasi Pengusaha BKC (NPPBKC)",
          "deskripsi": "Pengusaha pabrik, importir, atau penyalur barang kena cukai wajib memiliki Nomor Pokok Pengusaha Barang Kena Cukai (NPPBKC) sebelum beroperasi.",
          "output": [
            "Sertifikat NPPBKC",
            "Register Perusahaan Cukai"
          ],
          "unit_terlibat": [
            {
              "unit_id": "dit-tfc",
              "nama": "Dit. Teknis & Fasilitas Cukai",
              "peran": "Penyusunan kebijakan NPPBKC, standar administrasi pengusaha BKC, dan registrasi terpusat.",
              "warna": "#0E7490"
            },
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelayanan Cukai",
              "peran": "Pemeriksaan lokasi usaha (pabrik/gudang) dan penerbitan izin NPPBKC tingkat kantor wilayah/pelayanan.",
              "warna": "#34D399"
            }
          ]
        },
        {
          "no": 2,
          "judul": "Penyediaan & Pemesanan Pita Cukai",
          "deskripsi": "Pengusaha melakukan pemesanan pita cukai (khusus untuk hasil tembakau/rokok dan MMEA yang pelunasannya dengan pelekatan pita cukai) melalui sistem aplikasi cukai.",
          "output": [
            "Dokumen CK-1 (Pemesanan Pita Cukai)",
            "Alokasi Pita Cukai"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelayanan Cukai",
              "peran": "Verifikasi jaminan/pembayaran dan penyediaan/penyerahan keping pita cukai kepada pengusaha.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-tfc",
              "nama": "Dit. Teknis & Fasilitas Cukai",
              "peran": "Penyusunan desain, perencanaan kebutuhan, dan pencetakan pita cukai di Perum Peruri.",
              "warna": "#0E7490"
            }
          ]
        },
        {
          "no": 3,
          "judul": "Produksi & Pelekatan Pita Cukai",
          "deskripsi": "Pabrik memproduksi barang kena cukai (BKC) dan melekatkan pita cukai pada kemasan eceran sebagai tanda pelunasan cukai sebelum barang dikeluarkan.",
          "output": [
            "Barang Kena Cukai Siap Edar",
            "Laporan Produksi Harian (LHP)"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelayanan Cukai",
              "peran": "Petugas dinas luar melakukan pencacahan BKC, pengawasan berkala pelekatan pita di pabrik.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-ki",
              "nama": "Dit. Kepatuhan Internal",
              "peran": "Audit/pengawasan berkala terhadap kepatuhan pelayanan cukai dan integritas segel pita.",
              "warna": "#0E7490"
            }
          ]
        },
        {
          "no": 4,
          "judul": "Pengeluaran Barang Kena Cukai & Pelunasan",
          "deskripsi": "Barang dikeluarkan dari pabrik untuk diedarkan setelah cukai dilunasi (pelekatan pita atau pembayaran langsung untuk etil alkohol/MMEA tipe tertentu) dengan dokumen CK-5.",
          "output": [
            "Penerimaan Negara Cukai",
            "Persetujuan Pengeluaran (CK-5)"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pelayanan Cukai",
              "peran": "Penatausahaan dokumen pengeluaran BKC dan rekonsiliasi data setoran kas negara.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-pps",
              "nama": "Dit. Penerimaan & PS",
              "peran": "Pemantauan penerimaan cukai harian dan analisis proyeksi target penerimaan cukai.",
              "warna": "#0E7490"
            }
          ]
        }
      ]
    },
    {
      "id": "penindakan",
      "nama": "Proses Pengawasan & Penindakan",
      "tahapan": [
        {
          "no": 1,
          "judul": "Analisis Intelijen & Informasi",
          "deskripsi": "Petugas intelijen bea cukai mengumpulkan informasi dari berbagai sumber, menganalisis profil risiko kapal/penumpang/importir, dan menetapkan target operasi.",
          "output": [
            "Lembar Informasi Intelijen (LII)",
            "Nota Hasil Intelijen (NHI)"
          ],
          "unit_terlibat": [
            {
              "unit_id": "dit-p2",
              "nama": "Dit. Penindakan & Penyidikan",
              "peran": "Penyediaan radar, koordinasi intelijen lintas wilayah, dan pemetaan target kejahatan terorganisir.",
              "warna": "#0E7490"
            },
            {
              "unit_id": "dit-interdiksi",
              "nama": "Dit. Interdiksi Narkotika",
              "peran": "Fokus analisis target sindikat narkotika internasional dan pembawaan uang tunai lintas batas.",
              "warna": "#0E7490"
            },
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pengawasan",
              "peran": "Unit Intelijen KPPBC menyusun profil lokal dan memonitor aktivitas kepabeanan setempat.",
              "warna": "#34D399"
            }
          ]
        },
        {
          "no": 2,
          "judul": "Patroli Laut & Darat (Surveillance)",
          "deskripsi": "Armada patroli bea cukai melakukan pengawasan aktif di wilayah perairan selat strategis (misal: Selat Malaka) atau jalur darat perbatasan untuk mendeteksi pergerakan mencurigakan.",
          "output": [
            "Laporan Patroli Harian",
            "Hasil Deteksi Radar/Sonar"
          ],
          "unit_terlibat": [
            {
              "unit_id": "pso",
              "nama": "PSO BC (UPT Patroli)",
              "peran": "Menyiapkan kapal patroli (Fast Patrol Boat), persenjataan, navigasi, dan kru kapal untuk patroli laut.",
              "warna": "#6366F1"
            },
            {
              "unit_id": "dit-p2",
              "nama": "Dit. Penindakan & Penyidikan",
              "peran": "Pengendalian Pusat Komando dan Pengendalian (Puskodal) Patroli Laut nasional.",
              "warna": "#0E7490"
            }
          ]
        },
        {
          "no": 3,
          "judul": "Pemberhentian & Pemeriksaan Kapal",
          "deskripsi": "Kapal patroli bea cukai melakukan pemberhentian kapal yang dicurigai (ejeksi paksa/kejar), pemeriksaan dokumen kapal (manifest/logbook), dan pemeriksaan muatan di laut.",
          "output": [
            "Berita Acara Pemeriksaan (BAP)",
            "Catatan Muatan Kapal"
          ],
          "unit_terlibat": [
            {
              "unit_id": "pso",
              "nama": "PSO BC (UPT Patroli)",
              "peran": "Pemberhentian kapal, olah gerak merapat, pertahanan taktis, dan pemanggilan petugas bersenjata.",
              "warna": "#6366F1"
            },
            {
              "unit_id": "kppbc",
              "nama": "KPPBC / Satgas Patroli",
              "peran": "Melakukan pemeriksaan administratif dokumen kapal dan pemeriksaan fisik kompartemen palka.",
              "warna": "#34D399"
            }
          ]
        },
        {
          "no": 4,
          "judul": "Penindakan & Penyegelan Barang",
          "deskripsi": "Apabila ditemukan barang ilegal atau penyelundupan yang melanggar UU, dilakukan penindakan berupa penyegelan barang, penahanan kapal, dan mengamankan tersangka.",
          "output": [
            "Surat Bukti Penindakan (SBP)",
            "Penyegelan Barang Bukti"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC / Satgas Patroli",
              "peran": "Penerbitan SBP, pelekatan segel pabean, dan evakuasi barang bukti ke pangkalan terdekat.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-interdiksi",
              "nama": "Dit. Interdiksi Narkotika",
              "peran": "Penanganan khusus barang bukti narkotika (K-9 deteksi, tes lab narkoba portabel).",
              "warna": "#0E7490"
            }
          ]
        },
        {
          "no": 5,
          "judul": "Penyidikan Tindak Pidana",
          "deskripsi": "Petugas Penyidik Pegawai Negeri Sipil (PPNS) Bea Cukai melakukan pemeriksaan saksi, ahli, tersangka, penggeledahan, penyitaan barang bukti, dan penyusunan berkas perkara.",
          "output": [
            "Berkas Perkara (P-21)",
            "Penahanan Tersangka"
          ],
          "unit_terlibat": [
            {
              "unit_id": "kppbc",
              "nama": "KPPBC Pengawasan",
              "peran": "Penyidik PPNS KPPBC melakukan pemeriksaan tersangka dan penyusunan berkas perkara tingkat lokal.",
              "warna": "#34D399"
            },
            {
              "unit_id": "dit-p2",
              "nama": "Dit. Penindakan & Penyidikan",
              "peran": "Asistensi penyidikan nasional, koordinasi dengan Kejaksaan Agung/Kepolisian, dan pelacakan TPPU perdagangan.",
              "warna": "#0E7490"
            },
            {
              "unit_id": "dit-kbp",
              "nama": "Dit. Keberatan Banding & Peraturan",
              "peran": "Memberikan pertimbangan hukum kepabeanan/cukai dan bantuan hukum bagi penyidik.",
              "warna": "#0E7490"
            }
          ]
        }
      ]
    }
  ]
};
