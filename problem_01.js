import levenshtein from 'js-levenshtein';

export class Kontak {
  constructor(id, nama, email, telepon, perusahaan, tag) {
    this.id = id;
    this.nama = nama;
    this.email = email;
    this.telepon = telepon;
    this.perusahaan = perusahaan;
    this.tag = tag; // Array berisi label/kategori kontak
  }
}

export class PengelolaKontak {
  constructor() {
    this.daftarKontak = [];
  }

  // initial state: daftarKontak berisi beberapa kontak dengan berbagai nama
  // final state: mengembalikan daftar kontak yang namanya diawali dengan prefix tertentu
  cariBerdasarkanAwalanNama(prefix) {
    const pre = prefix.toLowerCase();
    return this.daftarKontak.filter(kontak => kontak.nama.toLowerCase().startsWith(pre));
  }

  // initial state: daftarKontak berisi beberapa kontak dengan nama berbeda
  // final state: mengembalikan daftar kontak yang memiliki kemiripan nama dengan query tertentu (berdasarkan jarak Levenshtein)
  cariNamaSerupa(kueri, jarakMaksimum) {
    return this.daftarKontak.map(kontak => ({kontak,distance : levenshtein(kontak.nama.toLowerCase(), kueri.toLowerCase())}))
      .filter(item => item.distance <= jarakMaksimum)
      .map(item => item.kontak);
  }

  // initial state: daftarKontak berisi beberapa kontak dengan nama dan email yang mungkin berulang
  // final state: mengembalikan daftar kontak yang terdeteksi sebagai duplikat berdasarkan nama atau email
  temukanDuplikat() {
    const duplikat = [];
    const see = new Set();
    for (const kontak of this.daftarKontak) {
      const keyname = kontak.nama.toLowerCase();
      const keyemail = kontak.email.toLowerCase();
      if (see.has(keyname) || see.has(keyemail)) {
        duplikat.push(kontak);
      } else {
        see.add(keyname);
        see.add(keyemail);
      }
    }
    return duplikat;
  }

  // initial state: daftarKontak berisi beberapa kontak dengan berbagai nama
  // final state: mengembalikan daftar saran nama kontak berdasarkan potongan nama (partialName) dengan batas jumlah tertentu
  dapatkanSaran(namaParsial, batas) {
    const partial = namaParsial.toLowerCase();
    return this.daftarKontak
      .filter(kontak => kontak.nama.toLowerCase().includes(partial))
      .slice(0, batas);
  }

  // initial state: daftarKontak berisi beberapa kontak dengan tag yang berbeda
  // final state: mengembalikan daftar kontak yang memiliki tag sesuai dengan kriteria (semua atau salah satu)
  dapatkanKontakBerdasarkanTag(tag, cocokSemua) {
    // cocokSemua: true = semua tag harus cocok (AND)
    // cocokSemua: false = minimal satu tag cocok (OR)
    const tagsLower = tag.map(t => t.toLowerCase());
    if (cocokSemua){
      return this.daftarKontak.filter(kontak =>
        tagsLower.every(t => kontak.tag.map(tagItem => tagItem.toLowerCase()).includes(t))
      );
    } else {
      return this.daftarKontak.filter(kontak =>
        tagsLower.some(t => kontak.tag.map(tagItem => tagItem.toLowerCase()).includes(t))
      );
    }
  }
}
