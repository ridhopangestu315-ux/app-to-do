/*
====================================================
MODIFIKASI SCRIPT UNTUK DATABASE
====================================================
File ini adalah modifikasi dari script.js yang dioptimalkan
untuk menggunakan backend PHP + MySQL database.

Perbedaan dari script.js:
1. Data tidak lagi disimpan di localStorage
2. Semua data diambil dari database melalui fetch API
3. Saat tambah/hapus/update todo, langsung ke database

File ini MENGGANTI script.js di dashboard.php
====================================================
*/

/*
================================
PENGATURAN NAMA DATA LOCAL STORAGE
================================
Sekarang hanya digunakan untuk data yang bersifat lokal (tidak user-specific)
- modeGelap: tetap di localStorage (preference user)
- notifikasiDeadline: tetap di localStorage (preference user)
- daftarMataKuliah: tetap di localStorage (preference user)
Tapi tidak lagi untuk menyimpan tugas, karena sudah di database.
*/
const namaPenyimpananLocalStorage = {
  tugas: "studentTodoTasks", // DEPRECATED - gunakan database
  jadwal: "studentCalendarEvents", // DEPRECATED - gunakan database
  fotoProfil: "studentProfilePhoto",
  namaPengguna: "studentTodoName", // Akan ambil dari session, tapi tetap simpan di localStorage
  modeGelap: "studentTodoDarkMode",
  notifikasiDeadline: "studentTodoNotification",
  daftarMataKuliah: "studentTodoCourseList" // Tetap pakai localStorage
};

const aturanFotoProfil = {
  ukuranMaksimal: 2 * 1024 * 1024,
  lebarMaksimal: 480,
  tinggiMaksimal: 480,
  tipeFileYangDiizinkan: ["image/jpeg", "image/jpg", "image/png"]
};

const daftarKategoriJadwal = {
  kuliah: { nama: "Kuliah", warna: "#4285f4" },
  organisasi: { nama: "Organisasi", warna: "#34a853" },
  ujian: { nama: "Ujian", warna: "#fbbc04" },
  pribadi: { nama: "Pribadi", warna: "#a142f4" },
  deadline: { nama: "Deadline", warna: "#ea4335" }
};

const daftarMataKuliahDefault = [
  "Analisis dan Perancangan Sistem",
  "Grafika Komputer",
  "Interaksi Manusia dan Komputer",
  "Jaringan Komputer",
  "Pendidikan Agama Islam",
  "Pemrograman Web",
  "Praktikum Jaringan Komputer",
  "Praktikum PBO",
  "Sistem Rekayasa Berkelanjutan",
  "Statistika Untuk Komputasi"
];

/*
================================
DATA UTAMA APLIKASI
================================
Sekarang daftarSemuaTugas diambil dari database, bukan dari localStorage
*/
const dataAplikasi = {
  daftarSemuaTugas: [], // Akan di-populate dari database saat halaman load
  daftarSemuaJadwal: ambilDataDariLocalStorage(namaPenyimpananLocalStorage.jadwal, []),

  daftarMataKuliah: ambilDataDariLocalStorage(namaPenyimpananLocalStorage.daftarMataKuliah, null),

  kataKunciPencarianTugas: "",
  filterStatusTugas: "semua",
  filterKategoriJadwal: "semua",
  halamanYangSedangDibuka: "dashboard",
  bulanKalenderYangDibuka: new Date(),
  tanggalJadwalYangDipilih: ubahTanggalMenjadiKode(new Date()),
  notifikasiDeadlineAktif: ambilDataDariLocalStorage(namaPenyimpananLocalStorage.notifikasiDeadline, true),
  modeGelapAktif: ambilDataDariLocalStorage(namaPenyimpananLocalStorage.modeGelap, false)
};

// Ambil semua element HTML
const elemenHalaman = {
  body: document.body,
  semuaTombolMenu: document.querySelectorAll(".tombol-menu"),
  semuaHalaman: document.querySelectorAll(".halaman"),
  semuaTombolNavMobile: document.querySelectorAll(".tombol-nav-mobile"),

  teksSapaan: document.getElementById("teksSapaan"),
  teksSapaanHero: document.getElementById("teksSapaanHero"),
  fotoProfilHeader: document.getElementById("fotoProfilHeader"),
  inisialProfilHeader: document.getElementById("inisialProfilHeader"),
  previewFotoProfil: document.getElementById("previewFotoProfil"),
  inisialPreviewProfil: document.getElementById("inisialPreviewProfil"),
  inputFotoProfil: document.getElementById("inputFotoProfil"),
  tombolUploadFoto: document.getElementById("tombolUploadFoto"),
  tombolHapusFoto: document.getElementById("tombolHapusFoto"),
  pesanErrorFotoProfil: document.getElementById("pesanErrorFotoProfil"),

  angkaTotalTugas: document.getElementById("angkaTotalTugas"),
  angkaTugasBelumSelesai: document.getElementById("angkaTugasBelumSelesai"),
  angkaTugasSelesai: document.getElementById("angkaTugasSelesai"),
  angkaDeadlineDekat: document.getElementById("angkaDeadlineDekat"),
  daftarNotifikasiDeadline: document.getElementById("daftarNotifikasiDeadline"),
  daftarTugasTerbaru: document.getElementById("daftarTugasTerbaru"),
  teksTanggalRealtime: document.getElementById("teksTanggalRealtime"),
  teksJamRealtime: document.getElementById("teksJamRealtime"),
  teksTanggalHero: document.getElementById("teksTanggalHero"),
  persenProgressHariIni: document.getElementById("persenProgressHariIni"),
  barProgressHariIni: document.getElementById("barProgressHariIni"),
  teksProgressHariIni: document.getElementById("teksProgressHariIni"),
  angkaFokusHariIni: document.getElementById("angkaFokusHariIni"),
  ringkasanSidebar: document.getElementById("ringkasanSidebar"),
  jumlahTugasHariIni: document.getElementById("jumlahTugasHariIni"),
  jumlahTugasBesok: document.getElementById("jumlahTugasBesok"),
  jumlahTugasSelesaiDashboard: document.getElementById("jumlahTugasSelesaiDashboard"),
  daftarTugasHariIni: document.getElementById("daftarTugasHariIni"),
  daftarTugasBesok: document.getElementById("daftarTugasBesok"),
  daftarTugasSelesaiDashboard: document.getElementById("daftarTugasSelesaiDashboard"),
  judulMiniKalender: document.getElementById("judulMiniKalender"),
  isiMiniKalender: document.getElementById("isiMiniKalender"),
  semuaTombolAksiCepat: document.querySelectorAll("[data-quick-action]"),

  formTambahTugas: document.getElementById("formTambahTugas"),
  inputNamaTugas: document.getElementById("inputNamaTugas"),
  pilihanMataKuliah: document.getElementById("pilihanMataKuliah"),
  inputDeadlineTugas: document.getElementById("inputDeadlineTugas"),
  pesanErrorNamaTugas: document.getElementById("pesanErrorNamaTugas"),
  pesanErrorMataKuliah: document.getElementById("pesanErrorMataKuliah"),
  pesanErrorDeadlineTugas: document.getElementById("pesanErrorDeadlineTugas"),
  inputPencarianTugas: document.getElementById("inputPencarianTugas"),
  filterStatusTugas: document.getElementById("filterStatusTugas"),
  daftarTugas: document.getElementById("daftarTugas"),

  teksBulanKalender: document.getElementById("teksBulanKalender"),
  tombolBulanSebelumnya: document.getElementById("tombolBulanSebelumnya"),
  tombolBulanBerikutnya: document.getElementById("tombolBulanBerikutnya"),
  tombolHariIni: document.getElementById("tombolHariIni"),
  tombolTambahJadwalCepat: document.getElementById("tombolTambahJadwalCepat"),
  filterKategoriJadwal: document.getElementById("filterKategoriJadwal"),
  isiKalender: document.getElementById("isiKalender"),
  daftarAgendaHariIni: document.getElementById("daftarAgendaHariIni"),
  daftarReminderDeadline: document.getElementById("daftarReminderDeadline"),

  inputNamaPengguna: document.getElementById("inputNamaPengguna"),
  tombolSimpanNama: document.getElementById("tombolSimpanNama"),
  toggleModeGelap: document.getElementById("toggleModeGelap"),
  toggleNotifikasiDeadline: document.getElementById("toggleNotifikasiDeadline"),
  tombolResetData: document.getElementById("tombolResetData"),

  inputNamaMataKuliah: document.getElementById("inputNamaMataKuliah"),
  tombolTambahMataKuliah: document.getElementById("tombolTambahMataKuliah"),
  pesanErrorMataKuliahBaru: document.getElementById("pesanErrorMataKuliahBaru"),
  daftarMataKuliahPengaturan: document.getElementById("daftarMataKuliahPengaturan"),

  modalKonfirmasi: document.getElementById("modalKonfirmasi"),
  judulModalKonfirmasi: document.getElementById("judulModalKonfirmasi"),
  pesanModalKonfirmasi: document.getElementById("pesanModalKonfirmasi"),
  tombolBatalKonfirmasi: document.getElementById("tombolBatalKonfirmasi"),
  tombolSetujuKonfirmasi: document.getElementById("tombolSetujuKonfirmasi"),

  modalJadwal: document.getElementById("modalJadwal"),
  formTambahJadwal: document.getElementById("formTambahJadwal"),
  teksTanggalJadwalDipilih: document.getElementById("teksTanggalJadwalDipilih"),
  inputNamaJadwal: document.getElementById("inputNamaJadwal"),
  inputTanggalJadwal: document.getElementById("inputTanggalJadwal"),
  inputJamJadwal: document.getElementById("inputJamJadwal"),
  pilihanKategoriJadwal: document.getElementById("pilihanKategoriJadwal"),
  pesanErrorNamaJadwal: document.getElementById("pesanErrorNamaJadwal"),
  pesanErrorTanggalJadwal: document.getElementById("pesanErrorTanggalJadwal"),
  pesanErrorJamJadwal: document.getElementById("pesanErrorJamJadwal"),
  tombolBatalJadwal: document.getElementById("tombolBatalJadwal"),

  tombolTambahCepatMobile: document.getElementById("tombolTambahCepatMobile"),
  wadahToast: document.getElementById("wadahToast")
};

let fungsiJawabanModalKonfirmasi = null;
const BATAS_RENDER_TUGAS = 80;
let idDebouncePencarianTugas = null;
let cacheRenderKalender = "";

/*
================================
FUNGSI BANTUAN LOCAL STORAGE
================================
*/
function ambilDataDariLocalStorage(namaData, nilaiDefault) {
  const dataTersimpan = localStorage.getItem(namaData);

  if (dataTersimpan === null) {
    return nilaiDefault;
  }

  try {
    return JSON.parse(dataTersimpan);
  } catch (error) {
    return dataTersimpan;
  }
}

function simpanDataKeLocalStorage(namaData, isiData) {
  localStorage.setItem(namaData, JSON.stringify(isiData));
}

/*
================================
FUNGSI BANTUAN DATABASE (FETCH API)
================================
Fungsi-fungsi ini menggantikan simpan/ambil localStorage
untuk data yang user-specific (todos yang disimpan di database)
*/

// Ambil semua todo dari database
async function ambilTugasDariDatabase() {
  try {
    const response = await fetch('backend/ambil_todo.php');
    const data = await response.json();

    if (data.success) {
      // Transformasi format database ke format aplikasi
      // Database: { id, nama_tugas, mata_kuliah, deadline, sudah_selesai, dibuat_pada }
      // Aplikasi: { id, namaTugas, mataKuliah, deadline, sudahSelesai, dibuatPada }
      dataAplikasi.daftarSemuaTugas = data.todos.map(todo => ({
        id: todo.id.toString(),
        namaTugas: todo.nama_tugas,
        mataKuliah: todo.mata_kuliah,
        deadline: todo.deadline,
        sudahSelesai: parseInt(todo.sudah_selesai) === 1,
        dibuatPada: todo.dibuat_pada
      }));

      return true;
    } else {
      console.error('Gagal ambil data:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error fetch:', error);
    return false;
  }
}

// Tambah todo ke database
async function tambahTugaKeDatabase(namaTugas, mataKuliah, deadline) {
  try {
    const response = await fetch('backend/tambah_todo.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nama_tugas: namaTugas,
        mata_kuliah: mataKuliah,
        deadline: deadline
      })
    });

    const data = await response.json();

    if (data.success) {
      // Tambah ke dataAplikasi (transform format)
      const todoBaru = {
        id: data.todo.id.toString(),
        namaTugas: data.todo.nama_tugas,
        mataKuliah: data.todo.mata_kuliah,
        deadline: data.todo.deadline,
        sudahSelesai: parseInt(data.todo.sudah_selesai) === 0 ? false : true,
        dibuatPada: data.todo.dibuat_pada
      };

      dataAplikasi.daftarSemuaTugas.unshift(todoBaru);
      return todoBaru;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error tambah:', error);
    throw error;
  }
}

// Hapus todo dari database
async function hapusTugaDariDatabase(idTugas) {
  try {
    const response = await fetch('backend/hapus_todo.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: parseInt(idTugas) })
    });

    const data = await response.json();

    if (data.success) {
      // Hapus dari dataAplikasi
      dataAplikasi.daftarSemuaTugas = dataAplikasi.daftarSemuaTugas.filter(
        tugas => tugas.id !== idTugas
      );
      return true;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error hapus:', error);
    throw error;
  }
}

// Update status todo di database
async function ubahStatusSelesaiTugaDiDatabase(idTugas) {
  try {
    // Cari status saat ini
    const tugas = dataAplikasi.daftarSemuaTugas.find(t => t.id === idTugas);
    if (!tugas) return false;

    const statusBaru = tugas.sudahSelesai ? 0 : 1; // Toggle status

    const response = await fetch('backend/update_todo.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: parseInt(idTugas),
        sudah_selesai: statusBaru
      })
    });

    const data = await response.json();

    if (data.success) {
      // Update di dataAplikasi
      dataAplikasi.daftarSemuaTugas = dataAplikasi.daftarSemuaTugas.map(t => {
        if (t.id === idTugas) {
          return { ...t, sudahSelesai: statusBaru === 1 };
        }
        return t;
      });
      return true;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error update:', error);
    throw error;
  }
}

// Simpan jadwal (tetap ke localStorage karena jadwal bukan user-specific di database)
function simpanDaftarJadwal() {
  simpanDataKeLocalStorage(namaPenyimpananLocalStorage.jadwal, dataAplikasi.daftarSemuaJadwal);
}

/*
================================
FUNGSI BANTUAN TANGGAL
================================
*/
function ubahTanggalMenjadiKode(tanggal) {
  const tahun = tanggal.getFullYear();
  const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
  const hari = String(tanggal.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

function ubahKodeMenjadiTanggal(kodeTanggal) {
  const bagianTanggal = kodeTanggal.split("-");
  const tahun = Number(bagianTanggal[0]);
  const bulan = Number(bagianTanggal[1]);
  const hari = Number(bagianTanggal[2]);

  return new Date(tahun, bulan - 1, hari);
}

function cekApakahTanggalSama(tanggalPertama, tanggalKedua) {
  return ubahTanggalMenjadiKode(tanggalPertama) === ubahTanggalMenjadiKode(tanggalKedua);
}

function formatTanggalIndonesia(kodeTanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(ubahKodeMenjadiTanggal(kodeTanggal));
}

function hitungSisaHari(kodeTanggalDeadline) {
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const tanggalDeadline = ubahKodeMenjadiTanggal(kodeTanggalDeadline);
  tanggalDeadline.setHours(0, 0, 0, 0);

  const selisihWaktu = tanggalDeadline - hariIni;
  return Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));
}

function buatTeksSisaDeadline(kodeTanggalDeadline) {
  const sisaHari = hitungSisaHari(kodeTanggalDeadline);

  if (sisaHari < 0) {
    return "Terlewat";
  }

  if (sisaHari === 0) {
    return "Hari ini";
  }

  if (sisaHari === 1) {
    return "Besok";
  }

  return `${sisaHari} hari lagi`;
}

function formatTanggalPanjangIndonesia(tanggal) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(tanggal);
}

function tampilkanTanggalRealtime() {
  const sekarang = new Date();
  const teksTanggal = formatTanggalPanjangIndonesia(sekarang);
  const teksJam = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(sekarang);

  if (elemenHalaman.teksTanggalRealtime) {
    elemenHalaman.teksTanggalRealtime.textContent = teksTanggal;
  }

  if (elemenHalaman.teksJamRealtime) {
    elemenHalaman.teksJamRealtime.textContent = teksJam;
  }

  if (elemenHalaman.teksTanggalHero) {
    elemenHalaman.teksTanggalHero.textContent = teksTanggal;
  }
}

/*
================================
FUNGSI BANTUAN KEAMANAN TEKS
================================
*/
function amankanTeksUntukHtml(teks) {
  return String(teks)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buatTampilanKosong(pesan) {
  return `<div class="kotak-kosong">${pesan}</div>`;
}

function tampilkanToast(pesan) {
  const toastBaru = document.createElement("div");

  toastBaru.className = "toast";
  toastBaru.textContent = pesan;
  elemenHalaman.wadahToast.appendChild(toastBaru);

  setTimeout(function () {
    toastBaru.classList.add("toast-keluar");
  }, 2400);

  setTimeout(function () {
    toastBaru.remove();
  }, 2800);
}

/*
================================
FUNGSI DATA TUGAS (dari script.js original)
================================
Tetap digunakan untuk business logic, tapi penyimpanan
sudah dihubungkan ke database.
*/
function buatDataTugas(namaTugas, mataKuliah, deadline) {
  return {
    id: Date.now().toString(),
    namaTugas: namaTugas,
    mataKuliah: mataKuliah,
    deadline: deadline,
    sudahSelesai: false,
    dibuatPada: new Date().toISOString()
  };
}

function ambilTugasYangDeadlineDekat() {
  return dataAplikasi.daftarSemuaTugas.filter(function (tugas) {
    const sisaHari = hitungSisaHari(tugas.deadline);
    return !tugas.sudahSelesai && sisaHari >= 0 && sisaHari <= 2;
  });
}

function ambilTugasSesuaiFilter() {
  const kataKunci = dataAplikasi.kataKunciPencarianTugas.toLowerCase();

  return dataAplikasi.daftarSemuaTugas.filter(function (tugas) {
    const cocokDenganKataKunci =
      tugas.namaTugas.toLowerCase().includes(kataKunci) ||
      tugas.mataKuliah.toLowerCase().includes(kataKunci);

    const cocokDenganStatus =
      dataAplikasi.filterStatusTugas === "semua" ||
      (dataAplikasi.filterStatusTugas === "selesai" && tugas.sudahSelesai) ||
      (dataAplikasi.filterStatusTugas === "belum" && !tugas.sudahSelesai);

    return cocokDenganKataKunci && cocokDenganStatus;
  });
}

/*
================================
RENDER HALAMAN
================================
Menggunakan data dari dataAplikasi.daftarSemuaTugas
yang sekarang diambil dari database.
*/
function render() {
  renderTampilan();
  renderHalamanAktif();
}

function renderTampilan() {
  const namaPengguna = ambilDataDariLocalStorage(namaPenyimpananLocalStorage.namaPengguna, "User");
  const inisialPengguna = namaPengguna.charAt(0).toUpperCase();

  elemenHalaman.teksSapaan.textContent = `Selamat datang kembali, ${namaPengguna} 👋`;
  elemenHalaman.teksSapaanHero.textContent = `Selamat datang kembali, ${namaPengguna} 👋`;
  elemenHalaman.inisialProfilHeader.textContent = inisialPengguna;
  elemenHalaman.inisialPreviewProfil.textContent = inisialPengguna;
  elemenHalaman.inputNamaPengguna.value = namaPengguna;

  tampilkanTanggalRealtime();
  perbaruhiTampilan();
}

function renderHalamanAktif() {
  const halamanAktif = dataAplikasi.halamanYangSedangDibuka;

  if (halamanAktif === "dashboard") {
    renderDashboard();
  } else if (halamanAktif === "tugas") {
    renderHalamanTugas();
  } else if (halamanAktif === "kalender") {
    renderKalender();
  }
}

function renderDashboard() {
  const daftarTugasHariIni = dataAplikasi.daftarSemuaTugas.filter(tugas => {
    const sisaHari = hitungSisaHari(tugas.deadline);
    return !tugas.sudahSelesai && sisaHari === 0;
  });

  const daftarTugasBesok = dataAplikasi.daftarSemuaTugas.filter(tugas => {
    const sisaHari = hitungSisaHari(tugas.deadline);
    return !tugas.sudahSelesai && sisaHari === 1;
  });

  const daftarTugasSelesai = dataAplikasi.daftarSemuaTugas.filter(tugas => tugas.sudahSelesai);

  const daftarTugasTerbaru = dataAplikasi.daftarSemuaTugas.slice(0, 5);

  elemenHalaman.jumlahTugasHariIni.textContent = daftarTugasHariIni.length;
  elemenHalaman.jumlahTugasBesok.textContent = daftarTugasBesok.length;
  elemenHalaman.jumlahTugasSelesaiDashboard.textContent = daftarTugasSelesai.length;

  elemenHalaman.daftarTugasHariIni.innerHTML = daftarTugasHariIni.length
    ? daftarTugasHariIni.map(buatHtmlItemTugasRingkas).join("")
    : buatTampilanKosong("Tidak ada tugas hari ini");

  elemenHalaman.daftarTugasBesok.innerHTML = daftarTugasBesok.length
    ? daftarTugasBesok.map(buatHtmlItemTugasRingkas).join("")
    : buatTampilanKosong("Tidak ada tugas besok");

  elemenHalaman.daftarTugasSelesaiDashboard.innerHTML = daftarTugasSelesai.length
    ? daftarTugasSelesai.map(buatHtmlItemTugasRingkas).join("")
    : buatTampilanKosong("Belum ada tugas selesai");

  elemenHalaman.daftarTugasTerbaru.innerHTML = daftarTugasTerbaru.length
    ? daftarTugasTerbaru.map(buatHtmlItemTugasRingkas).join("")
    : buatTampilanKosong("Tambahkan tugas pertamamu");

  perbaruhiStatistikDashboard();
  perbaruhiRingkasanSidebar();
}

function renderHalamanTugas() {
  const tugasYangDifilter = ambilTugasSesuaiFilter();

  elemenHalaman.daftarTugas.innerHTML = tugasYangDifilter.length
    ? tugasYangDifilter.slice(0, BATAS_RENDER_TUGAS).map(buatHtmlItemTugas).join("")
    : buatTampilanKosong("Tidak ada tugas yang sesuai filter");
}

function renderKalender() {
  const bulan = dataAplikasi.bulanKalenderYangDibuka;
  const namaKalender = bulan.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  elemenHalaman.teksBulanKalender.textContent = namaKalender;

  const daftarItem = ambilSemuaItemKalender();
  const petaItem = buatPetaItemKalenderBerdasarkanTanggal();
  urutkanPetaItemKalender(petaItem);

  isiKalender.innerHTML = buatHtmlKalender(bulan, petaItem);

  renderAgendaHariIni(petaItem);
  renderReminderDeadline();
}

function perbaruhiStatistikDashboard() {
  const totalTugas = dataAplikasi.daftarSemuaTugas.length;
  const tugasSelesai = dataAplikasi.daftarSemuaTugas.filter(t => t.sudahSelesai).length;
  const tugasBelumSelesai = totalTugas - tugasSelesai;
  const deadlineDekat = ambilTugasYangDeadlineDekat().length;

  elemenHalaman.angkaTotalTugas.textContent = totalTugas;
  elemenHalaman.angkaTugasSelesai.textContent = tugasSelesai;
  elemenHalaman.angkaTugasBelumSelesai.textContent = tugasBelumSelesai;
  elemenHalaman.angkaDeadlineDekat.textContent = deadlineDekat;

  const persenProgress = totalTugas === 0 ? 0 : Math.round((tugasSelesai / totalTugas) * 100);
  elemenHalaman.persenProgressHariIni.textContent = persenProgress + "%";
  elemenHalaman.barProgressHariIni.style.width = persenProgress + "%";

  const tugasHariIni = dataAplikasi.daftarSemuaTugas.filter(t => {
    const sisaHari = hitungSisaHari(t.deadline);
    return !t.sudahSelesai && sisaHari === 0;
  }).length;

  elemenHalaman.angkaFokusHariIni.textContent = tugasHariIni;

  if (tugasSelesai > 0) {
    elemenHalaman.teksProgressHariIni.textContent = `${tugasSelesai} tugas selesai dari ${totalTugas}.`;
  } else {
    elemenHalaman.teksProgressHariIni.textContent = "Belum ada tugas selesai hari ini.";
  }
}

function perbaruhiRingkasanSidebar() {
  const tugasAktif = dataAplikasi.daftarSemuaTugas.filter(t => !t.sudahSelesai).length;
  elemenHalaman.ringkasanSidebar.textContent = `${tugasAktif} tugas aktif`;
}

/*
================================
EVENT LISTENERS & INISIALISASI
================================
*/

// Form tambah tugas
elemenHalaman.formTambahTugas.addEventListener("submit", async function (e) {
  e.preventDefault();

  const namaTugas = elemenHalaman.inputNamaTugas.value.trim();
  const mataKuliah = elemenHalaman.pilihanMataKuliah.value;
  const deadline = elemenHalaman.inputDeadlineTugas.value;

  // Validasi
  let formValid = true;
  elemenHalaman.pesanErrorNamaTugas.textContent = "";
  elemenHalaman.pesanErrorMataKuliah.textContent = "";
  elemenHalaman.pesanErrorDeadlineTugas.textContent = "";

  if (namaTugas.length < 3) {
    elemenHalaman.pesanErrorNamaTugas.textContent = "Nama tugas minimal 3 karakter.";
    formValid = false;
  }

  if (!mataKuliah) {
    elemenHalaman.pesanErrorMataKuliah.textContent = "Pilih mata kuliah terlebih dahulu.";
    formValid = false;
  }

  if (!deadline) {
    elemenHalaman.pesanErrorDeadlineTugas.textContent = "Pilih tanggal deadline.";
    formValid = false;
  } else if (hitungSisaHari(deadline) < 0) {
    elemenHalaman.pesanErrorDeadlineTugas.textContent = "Deadline tidak boleh tanggal yang sudah lewat.";
    formValid = false;
  }

  if (!formValid) return;

  // Tambah ke database
  try {
    await tambahTugaKeDatabase(namaTugas, mataKuliah, deadline);
    tampilkanToast("Tugas berhasil ditambahkan");

    // Reset form
    elemenHalaman.formTambahTugas.reset();

    // Re-render
    render();
  } catch (error) {
    tampilkanToast("Gagal menambahkan tugas: " + error.message);
  }
});

// Event untuk ubah status tugas
document.addEventListener("click", async function (e) {
  if (e.target.matches(".checkbox-tugas")) {
    const idTugas = e.target.dataset.id;
    try {
      await ubahStatusSelesaiTugaDiDatabase(idTugas);
      render();
    } catch (error) {
      tampilkanToast("Gagal mengupdate tugas");
    }
  }

  if (e.target.matches(".tombol-hapus-tugas")) {
    const idTugas = e.target.dataset.id;
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;

    try {
      await hapusTugaDariDatabase(idTugas);
      tampilkanToast("Tugas berhasil dihapus");
      render();
    } catch (error) {
      tampilkanToast("Gagal menghapus tugas");
    }
  }
});

// Search & filter
elemenHalaman.inputPencarianTugas.addEventListener("input", function () {
  dataAplikasi.kataKunciPencarianTugas = this.value;
  clearTimeout(idDebouncePencarianTugas);
  idDebouncePencarianTugas = setTimeout(() => render(), 300);
});

elemenHalaman.filterStatusTugas.addEventListener("change", function () {
  dataAplikasi.filterStatusTugas = this.value;
  render();
});

// Menu navigation
elemenHalaman.semuaTombolMenu.forEach(tombol => {
  tombol.addEventListener("click", function () {
    const halaman = this.dataset.halaman;
    beralihHalaman(halaman);
  });
});

elemenHalaman.semuaTombolNavMobile.forEach(tombol => {
  tombol.addEventListener("click", function () {
    const halaman = this.dataset.halaman;
    beralihHalaman(halaman);
  });
});

function beralihHalaman(namaHalaman) {
  dataAplikasi.halamanYangSedangDibuka = namaHalaman;

  elemenHalaman.semuaTombolMenu.forEach(t => t.classList.remove("aktif"));
  elemenHalaman.semuaTombolNavMobile.forEach(t => t.classList.remove("aktif"));
  elemenHalaman.semuaHalaman.forEach(h => h.classList.remove("halaman-aktif"));

  document.querySelector(`[data-halaman="${namaHalaman}"].tombol-menu`).classList.add("aktif");
  document.querySelector(`[data-halaman="${namaHalaman}"].tombol-nav-mobile`).classList.add("aktif");
  document.getElementById(namaHalaman).classList.add("halaman-aktif");

  render();
}

// Modegelap
elemenHalaman.toggleModeGelap.addEventListener("change", function () {
  if (this.checked) {
    elemenHalaman.body.classList.add("mode-gelap");
  } else {
    elemenHalaman.body.classList.remove("mode-gelap");
  }
  simpanDataKeLocalStorage(namaPenyimpananLocalStorage.modeGelap, this.checked);
});

// Simpan nama user
elemenHalaman.tombolSimpanNama.addEventListener("click", function () {
  const namaBaru = elemenHalaman.inputNamaPengguna.value.trim();
  if (!namaBaru) {
    tampilkanToast("Nama tidak boleh kosong");
    return;
  }
  simpanDataKeLocalStorage(namaPenyimpananLocalStorage.namaPengguna, namaBaru);
  tampilkanToast("Nama berhasil disimpan");
  renderTampilan();
});

/*
================================
FUNGSI-FUNGSI RENDER HTML
================================
*/

function buatHtmlItemTugas(tugas) {
  const statusClass = tugas.sudahSelesai ? "tugas-selesai" : "";
  const checkboxChecked = tugas.sudahSelesai ? "checked" : "";
  const teksDeadline = buatTeksSisaDeadline(tugas.deadline);
  const formatDeadline = formatTanggalIndonesia(tugas.deadline);

  return `
    <div class="item-tugas ${statusClass}" data-id="${tugas.id}">
      <div class="bagian-checkbox">
        <input type="checkbox" class="checkbox-tugas" data-id="${tugas.id}" ${checkboxChecked}>
      </div>
      <div class="konten-tugas">
        <h4>${amankanTeksUntukHtml(tugas.namaTugas)}</h4>
        <p class="keterangan-tugas">${amankanTeksUntukHtml(tugas.mataKuliah)} • ${formatDeadline}</p>
      </div>
      <div class="badge-deadline ${teksDeadline === 'Terlewat' ? 'badge-terlewat' : ''}">${teksDeadline}</div>
      <button class="tombol-hapus-tugas" type="button" data-id="${tugas.id}">Hapus</button>
    </div>
  `;
}

function buatHtmlItemTugasRingkas(tugas) {
  const statusClass = tugas.sudahSelesai ? "tugas-selesai" : "";
  const checkboxChecked = tugas.sudahSelesai ? "checked" : "";
  const teksDeadline = buatTeksSisaDeadline(tugas.deadline);

  return `
    <div class="item-tugas-ringkas ${statusClass}">
      <input type="checkbox" class="checkbox-tugas" data-id="${tugas.id}" ${checkboxChecked}>
      <div>
        <h5>${amankanTeksUntukHtml(tugas.namaTugas)}</h5>
        <small>${teksDeadline}</small>
      </div>
    </div>
  `;
}

function buatHtmlKalender(bulan, petaItem) {
  const tahun = bulan.getFullYear();
  const bulanIndex = bulan.getMonth();

  const tanggalPertama = new Date(tahun, bulanIndex, 1);
  const hari1 = tanggalPertama.getDay();

  const jumlahHariDalamBulan = new Date(tahun, bulanIndex + 1, 0).getDate();

  let html = "";

  // Hari kosong di awal
  for (let i = 0; i < hari1; i++) {
    html += '<div class="hari-kalender hari-lain-bulan"></div>';
  }

  // Hari-hari dalam bulan
  for (let hari = 1; hari <= jumlahHariDalamBulan; hari++) {
    const kodeTanggal = ubahTanggalMenjadiKode(new Date(tahun, bulanIndex, hari));
    const jumlahItem = petaItem[kodeTanggal]?.length || 0;
    const isToday = cekApakahTanggalSama(new Date(), new Date(tahun, bulanIndex, hari));

    html += `
      <div class="hari-kalender ${isToday ? 'hari-hari-ini' : ''}${jumlahItem > 0 ? ' ada-item' : ''}"
           data-tanggal="${kodeTanggal}">
        <span class="nomor-hari">${hari}</span>
        ${jumlahItem > 0 ? `<span class="indikator-item">${jumlahItem}</span>` : ''}
      </div>
    `;
  }

  // Hari kosong di akhir
  const totalKotak = hari1 + jumlahHariDalamBulan;
  const kotakSisa = 35 - totalKotak;
  for (let i = 0; i < kotakSisa; i++) {
    html += '<div class="hari-kalender hari-lain-bulan"></div>';
  }

  return html;
}

function renderAgendaHariIni(petaItem) {
  const hariIniKode = ubahTanggalMenjadiKode(new Date());
  const itemHariIni = petaItem[hariIniKode] || [];

  elemenHalaman.daftarAgendaHariIni.innerHTML = itemHariIni.length
    ? itemHariIni.map(item => `<div class="item-agenda"><strong>${item.jam}</strong> ${amankanTeksUntukHtml(item.judul)}</div>`).join("")
    : buatTampilanKosong("Tidak ada agenda hari ini");
}

function renderReminderDeadline() {
  const deadlineDekat = ambilTugasYangDeadlineDekat();
  elemenHalaman.daftarReminderDeadline.innerHTML = deadlineDekat.length
    ? deadlineDekat.map(t => `<div class="item-reminder"><strong>${buatTeksSisaDeadline(t.deadline)}</strong> ${amankanTeksUntukHtml(t.namaTugas)}</div>`).join("")
    : buatTampilanKosong("Tidak ada deadline dekat");
}

function perbaruhiTampilan() {
  // Render mata kuliah dropdown
  const matakuList = dataAplikasi.daftarMataKuliah || daftarMataKuliahDefault;
  elemenHalaman.pilihanMataKuliah.innerHTML = '<option value="">Pilih mata kuliah</option>' +
    matakuList.map(mk => `<option value="${amankanTeksUntukHtml(mk)}">${amankanTeksUntukHtml(mk)}</option>`).join("");

  // Update checkbox mode gelap
  elemenHalaman.toggleModeGelap.checked = dataAplikasi.modeGelapAktif;
  if (dataAplikasi.modeGelapAktif) {
    elemenHalaman.body.classList.add("mode-gelap");
  }
}

/*
================================
INISIALISASI SAAT HALAMAN DIMUAT
================================
*/
window.addEventListener("load", async function () {
  // Ambil data dari database
  const berhasil = await ambilTugasDariDatabase();

  if (!berhasil) {
    tampilkanToast("Gagal mengambil data dari database");
  }

  // Render halaman
  render();

  // Atur update jam realtime
  setInterval(tampilkanTanggalRealtime, 1000);
});

// Jika user belum terhubung (optional - backend sudah handle di dashboard.php)
</script>
