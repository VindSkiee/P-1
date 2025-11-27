export class Mahasiswa {
  constructor(id, nama, jurusan) {
    this.id = id;
    this.nama = nama;
    this.jurusan = jurusan;
    this.nilai = new Map(); // key: kodeMataKuliah, value: skor
  }
}

export class MataKuliah {
  constructor(kode, nama, sks) {
    this.kode = kode;
    this.nama = nama;
    this.sks = sks;
  }
}

export class AnalisisKinerjaMahasiswa {
  constructor() {
    this.daftarMahasiswa = [];
    this.daftarMataKuliah = [];
  }

  // initial state: daftarMahasiswa kosong atau berisi beberapa objek Mahasiswa
  // final state: objek Mahasiswa baru ditambahkan ke daftarMahasiswa
  tambahMahasiswa(mahasiswa) {
    this.daftarMahasiswa.push(mahasiswa);
  }

  // initial state: daftarMataKuliah kosong atau berisi beberapa objek MataKuliah
  // final state: objek MataKuliah baru ditambahkan ke daftarMataKuliah
  tambahMataKuliah(mataKuliah) {
    this.daftarMataKuliah.push(mataKuliah);
  }

  // initial state: Mahasiswa dan MataKuliah sudah terdaftar, belum ada nilai untuk kombinasi tertentu
  // final state: nilai mahasiswa untuk mata kuliah tertentu tersimpan di Map nilai
  catatNilai(idMahasiswa, kodeMataKuliah, skor) {
    const mahasiswa = this.daftarMahasiswa.find(m => m.id === idMahasiswa);
    if (mahasiswa) {
      mahasiswa.nilai.set(kodeMataKuliah, skor);
    }
  }

  // initial state: daftarMahasiswa sudah memiliki nilai di berbagai mata kuliah
  // final state: mengembalikan daftar n mahasiswa dengan nilai tertinggi (berdasarkan GPA)
  dapatkanMahasiswaTerbaik(jumlah) {
     const arr = [];

    for (const m of this.daftarMahasiswa) {
      let total = 0;
      let count = 0;

      for (const val of m.nilai.values()) {
        total += val;
        count++;
      }

      const avg = count > 0 ? total / count : 0;
      const gpa = avg / 25;

      arr.push({ mahasiswa: m, gpa });
    }
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].gpa > arr[i].gpa) {
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
      }
    }

    const hasil = [];
    for (let i = 0; i < arr.length && hasil.length < jumlah; i++) {
      hasil.push(arr[i].mahasiswa);
    }

    return hasil;
  }

  // initial state: daftarMahasiswa sudah memiliki GPA atau nilai per mata kuliah
  // final state: mengembalikan daftar mahasiswa dengan GPA di antara minGPA dan maxGPA
  cariMahasiswaBerdasarkanRentangGPA(minGPA, maxGPA) {
    return this.daftarMahasiswa.filter(m => {
      const scores = Array.from(m.nilai.values());
      const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const gpa = average / 25;
      return gpa >= minGPA && gpa <= maxGPA;
    });
  }

  // initial state: setiap mahasiswa memiliki nilai untuk mata kuliah tertentu
  // final state: mengembalikan statistik (rata-rata, median, modus, dan standar deviasi) untuk satu mata kuliah
  dapatkanStatistikMataKuliah(kodeMataKuliah) {
    const scores = [];
    for (const m of this.daftarMahasiswa) {
      if (m.nilai.has(kodeMataKuliah)) {
        scores.push(m.nilai.get(kodeMataKuliah));
      }
    }
    if (scores.length === 0) return { rataRata: 0, median: 0, modus: 0, standarDeviasi: 0 };
    
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;

    const freq = {};
    scores.forEach(s => freq[s] = (freq[s] || 0) + 1);
    const modus = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
    
    const variance = scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
    const standarDeviasi = Math.sqrt(variance);
    return { mean, median: parseFloat(modus), modus: parseFloat(modus), standarDeviasi };
  }

  // initial state: daftarMahasiswa sudah memiliki nilai dan GPA
  // final state: mengembalikan peringkat (ranking) dari mahasiswa dengan id tertentu
  dapatkanPeringkatMahasiswa(idMahasiswa) {
    const mahasiswaDenganGPA = this.daftarMahasiswa.map(m => {
      const scores = Array.from(m.nilai.values());
      const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const gpa = average / 25;
      return { mahasiswa: m, gpa };
    });
    mahasiswaDenganGPA.sort((a, b) => b.gpa - a.gpa);
    const index = mahasiswaDenganGPA.findIndex(item => item.mahasiswa.id === idMahasiswa);
    return index + 1; 
  }

  // initial state: daftarMahasiswa berisi berbagai jurusan dan nilai
  // final state: mengembalikan laporan rekap nilai dan statistik berdasarkan satu jurusan
  dapatkanLaporanJurusan(jurusan) {
    const mhs = [];

    for (const m of this.daftarMahasiswa) {
      if (m.jurusan === jurusan) {
        mhs.push(m);
      }
    }

    const jumlahMahasiswa = mhs.length;
    const gpas = [];
    for (const m of mhs) {
      let total = 0;
      let count = 0;

      for (const s of m.nilai.values()) {
        total += s;
        count++;
      }

      const avg = count > 0 ? total / count : 0;
      gpas.push(avg / 25);
    }

    let totalGPA = 0;
    for (const g of gpas) totalGPA += g;
    const rataRataGPA = gpas.length > 0 ? totalGPA / gpas.length : 0;

    let terbaik = mhs[0];
    for (let i = 1; i < mhs.length; i++) {
      if (gpas[i] > gpas[mhs.indexOf(terbaik)]) {
        terbaik = mhs[i];
      }
    }

    return { jumlahMahasiswa, rataRataGPA, mahasiswaTerbaik: terbaik };
  }
}
