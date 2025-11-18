export class SlotWaktu {
  constructor(mulai, selesai) {
    this.mulai = mulai;   // Objek Date
    this.selesai = selesai; // Objek Date
  }

  // initial state: dua slot waktu sudah diketahui (this dan other)
  // final state: mengembalikan true jika kedua slot waktu saling tumpang tindih (overlap)
  tumpangTindih(denganSlotLain) {
    return this.mulai < denganSlotLain.selesai && denganSlotLain.mulai < this.selesai;
  }

  // initial state: slot waktu memiliki waktu mulai dan selesai yang valid
  // final state: mengembalikan durasi waktu (dalam menit atau jam) antara mulai dan selesai
  durasi() {
    const selisih = this.selesai - this.mulai;
    return selisih / (1000 * 60); 
  }
}

export class Rapat {
  constructor(id, judul, slotWaktu, idRuang, peserta) {
    this.id = id;
    this.judul = judul;
    this.slotWaktu = slotWaktu; // Objek SlotWaktu
    this.idRuang = idRuang;
    this.peserta = peserta; // Array nama/id peserta
  }
}

export class RuangRapat {
  constructor(id, nama, kapasitas) {
    this.id = id;
    this.nama = nama;
    this.kapasitas = kapasitas;
  }
}

export class Penjadwal {
  constructor() {
    this.daftarRapat = [];
    this.daftarRuang = [];
  }

  // initial state: daftarRapat sudah berisi beberapa rapat dengan slot waktu tertentu
  // final state: mengembalikan true jika rapat baru memiliki konflik waktu dengan rapat lain di ruang yang sama
  adaKonflik(rapat) {
    let ada = false;
    for (const rapatLain of this.daftarRapat) {
      if (rapat.slotWaktu.tumpangTindih(rapatLain.slotWaktu)){
        ada = true;
      }
    }
    return ada;
  }

  // initial state: daftarRapat berisi rapat-rapat di berbagai ruang dan waktu
  // final state: mengembalikan daftar slot waktu kosong (tidak terpakai) pada tanggal dan durasi tertentu di ruang yang diminta
  cariSlotTersedia(idRuang, tanggal, durasi) {
    const solotKosong = [];
    const hariMulai = new Date(tanggal);
    hariMulai.setHours(0, 0, 0, 0);
    const hariSelesai = new Date(tanggal);
    hariSelesai.setHours(24, 0, 0, 0);
    const rapatDiRuang = this.daftarRapat.filter(rapat => rapat.idRuang === idRuang);
    rapatDiRuang.sort((a, b) => a.slotWaktu.mulai - b.slotWaktu.mulai);
    let waktuSekarang = hariMulai;

    for (const r of rapatDiRuang){
      const slot = new SlotWaktu(new Date(waktuSekarang), new Date(r.slotWaktu.mulai));
      if (slot.durasi() >= durasi){
        solotKosong.push(slot);
      }
      waktuSekarang = new Date(r.slotWaktu.selesai);
    }

    const slotAkhir = new SlotWaktu(new Date(waktuSekarang), new Date(hariSelesai));
    if (slotAkhir.durasi() >= durasi){
      solotKosong.push(slotAkhir);
    }
    return solotKosong;
  }

  // initial state: daftar rapat dan daftar ruang sudah diketahui
  // final state: menjadwalkan rapat-rapat ke ruang yang paling optimal dengan meminimalkan konflik waktu
  jadwalOptimal(daftarRapat) {
    const jadwalrapat = [];
    
    for (const rapat of daftarRapat) {
      let konflik = false;
      for (const rapatlain of this.daftarRapat) {
        if (rapat.slotWaktu.tumpangTindih(rapatlain.slotWaktu) && rapat.idRuang === rapatlain.idRuang) {
          konflik = true;
          break;
        }
      }
      
      if (!konflik) {
        this.daftarRapat.push(rapat);
        jadwalrapat.push(rapat);
      }
    }
    
    return jadwalrapat;
  }

  
  // initial state: daftarRapat berisi beberapa rapat dengan konflik waktu tertentu
  // final state: mengembalikan daftar alternatif waktu yang memungkinkan rapat diatur ulang tanpa konflik
    cariSlotAlternatif(rapat, rapatBerkonflik) {
      const alternatif = [];
      const durasi = rapat.slotWaktu.durasi();
      const tanggal = new Date(rapat.slotWaktu.mulai);
      
      const slotTersedia = this.cariSlotTersedia(rapat.idRuang, tanggal, durasi);
      
      for (const slot of slotTersedia) {
        if (!slot.tumpangTindih(rapatBerkonflik.slotWaktu) && slot.durasi() >= durasi) {
          alternatif.push(slot);
        }
      }
      
      return alternatif;
    }

  // initial state: daftarRapat berisi rapat-rapat dengan waktu mulai dan selesai
  // final state: mengembalikan daftar rapat yang berlangsung dalam rentang waktu tertentu
  dapatkanRapatDalamRentang(tanggalMulai, tanggalSelesai) {
    return this.daftarRapat.filter(rapat => 
      rapat.slotWaktu.mulai >= tanggalMulai && 
      rapat.slotWaktu.selesai <= tanggalSelesai
    );
  }
}
