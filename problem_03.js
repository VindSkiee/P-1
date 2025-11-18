// Kelas Pengguna
export class Pengguna {
  constructor(id, nama, minat) {
    this.id = id;            // ID unik pengguna
    this.nama = nama;        // Nama pengguna
    this.minat = minat;      // Array berisi minat pengguna
  }
}

// Kelas Koneksi
export class Koneksi {
  constructor(idPengguna1, idPengguna2, waktu) {
    this.idPengguna1 = idPengguna1; // ID pengguna pertama
    this.idPengguna2 = idPengguna2; // ID pengguna kedua
    this.waktu = waktu;             // Timestamp koneksi dibuat
  }
}

// Kelas Jaringan Sosial
export class JaringanSosial {
  constructor() {
    this.pengguna = [];     // Daftar semua pengguna
    this.koneksi = [];      // Daftar semua koneksi antar pengguna
  }

  // initial state: pengguna berisi daftar pengguna dengan beberapa koneksi
  // final state: mengembalikan daftar saran teman untuk pengguna tertentu, terbatas sesuai limit
  sarankanTeman(idPengguna, batas) {
    const temanLangsung = [];
    for (const k of this.koneksi) {
      if (k.idPengguna1 === idPengguna) temanLangsung.push(k.idPengguna2);
      else if (k.idPengguna2 === idPengguna) temanLangsung.push(k.idPengguna1);
    }

    const kandidat = {};
    for (const t of temanLangsung) {
      for (const k of this.koneksi) {
        let id = null;

        if (k.idPengguna1 === t) id = k.idPengguna2;
        else if (k.idPengguna2 === t) id = k.idPengguna1;

        if (id !== null) {
          if (id !== idPengguna) {
            let sudahTeman = false;
            for (const TL of temanLangsung) {
              if (TL === id) sudahTeman = true;
            }
            if (!sudahTeman) kandidat[id] = true;
          }
        }
      }
    }

    const saran = [];
    const kandidatArray = Object.keys(kandidat);
    for (let i = 0; i < kandidatArray.length && saran.length < batas; i++) {
      const id = parseInt(kandidatArray[i]);
      for (const p of this.pengguna) {
        if (p.id === id) saran.push(p);
      }
    }

    return saran;
  }

  // initial state: pengguna berisi daftar teman masing-masing pengguna
  // final state: mengembalikan jumlah teman yang sama antara dua pengguna
  hitungTemanSama(idPengguna1, idPengguna2) {
    const teman1 = [];
    const teman2 = [];

    for (const k of this.koneksi) {
      if (k.idPengguna1 === idPengguna1) teman1.push(k.idPengguna2);
      else if (k.idPengguna2 === idPengguna1) teman1.push(k.idPengguna1);
    }

    for (const k of this.koneksi) {
      if (k.idPengguna1 === idPengguna2) teman2.push(k.idPengguna2);
      else if (k.idPengguna2 === idPengguna2) teman2.push(k.idPengguna1);
    }

    let hitung = 0;
    for (const t1 of teman1) {
      for (const t2 of teman2) {
        if (t1 === t2 && t1 !== idPengguna1 && t2 !== idPengguna2) {
          hitung++;
        }
      }
    }

    return hitung;
  }

  // initial state: pengguna berisi graph koneksi
  // final state: mengembalikan derajat koneksi antara dua pengguna
  derajatKoneksi(idPengguna1, idPengguna2) {
    const queue = [{ id: idPengguna1, level: 0 }];
    const visited = {};
    visited[idPengguna1] = true;

    let idx = 0;

    while (idx < queue.length) {
      const current = queue[idx];
      idx++;

      const neighbors = [];
      for (const k of this.koneksi) {
        if (k.idPengguna1 === current.id) neighbors.push(k.idPengguna2);
        else if (k.idPengguna2 === current.id) neighbors.push(k.idPengguna1);
      }

      for (const n of neighbors) {
        if (n === idPengguna2) return current.level + 1;

        if (!visited[n]) {
          visited[n] = true;
          queue.push({ id: n, level: current.level + 1 });
        }
      }
    }

    return -1;
  }

  // initial state: pengguna berisi daftar minat masing-masing pengguna
  // final state: mengembalikan daftar pengguna yang memiliki minat sama, terbatas sesuai limit
  cariPenggunaDenganMinatSama(idPengguna, batas) {
    const penggunaUtama = this.pengguna.find(p => p.id === idPengguna);
    if (!penggunaUtama) return [];
    
    const kandidat = this.pengguna.filter(p => p.id !== idPengguna && p.minat.some(m => penggunaUtama.minat.includes(m)))
      .sort((a, b) => b.minat.filter(m => penggunaUtama.minat.includes(m)).length - a.minat.filter(m => penggunaUtama.minat.includes(m)).length)
      .slice(0, batas);
    
    return kandidat;
  }

  // initial state: pengguna berisi daftar semua pengguna dan koneksi mereka
  // final state: mengembalikan daftar pengguna yang paling banyak memiliki koneksi, terbatas sesuai limit
  penggunaPalingTerhubung(batas) {
    const hitungKoneksi = this.pengguna.map(p => ({
      pengguna: p,
      jumlah: this.koneksi.filter(k => k.idPengguna1 === p.id || k.idPengguna2 === p.id).length
    }));
    
    hitungKoneksi.sort((a, b) => b.jumlah - a.jumlah);
    return hitungKoneksi.slice(0, batas).map(item => item.pengguna);
  }
}
