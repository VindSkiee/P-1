export class Produk {
  constructor(id, nama, kategori, harga, tag, rating) {
    this.id = id;
    this.nama = nama;
    this.kategori = kategori;
    this.harga = harga;
    this.tag = tag; // array berisi label/kata kunci produk
    this.rating = rating;
  }
}

export class KatalogProduk {
  constructor() {
    this.daftarProduk = [];
  }

  // initial state: daftarProduk kosong atau sudah berisi beberapa produk
  // final state: produk baru ditambahkan ke dalam daftarProduk
  tambahProduk(produk) {
    this.daftarProduk.push(produk);
  }

  // initial state: daftarProduk berisi beberapa produk dengan id unik
  // final state: produk dengan id tertentu dihapus dari daftarProduk
  hapusProduk(idProduk) {
    this.daftarProduk = this.daftarProduk.filter(p => p.id !== idProduk);
  }

  // initial state: daftarProduk berisi produk dengan berbagai nama
  // final state: mengembalikan daftar produk yang nama-nya mengandung kata kunci tertentu
  cariBerdasarkanNama(kueri) {
    const query = kueri.toLowerCase();
    return this.daftarProduk.filter(p => p.nama.toLowerCase().includes(query));
  }

  // initial state: daftarProduk berisi produk dengan kategori, harga, rating, dan tag berbeda
  // final state: mengembalikan daftar produk yang sesuai dengan kriteria filter yang diberikan
  filterProduk(kriteria) {
    return this.daftarProduk.filter(p => {
      if (kriteria.kategori && p.kategori !== kriteria.kategori) return false;
      if (kriteria.hargaMinimum !== undefined && p.harga < kriteria.hargaMinimum) return false;
      if (kriteria.hargaMaksimum !== undefined && p.harga > kriteria.hargaMaksimum) return false;
      if (kriteria.ratingMinimum !== undefined && p.rating < kriteria.ratingMinimum) return false;
      if (kriteria.tag && !p.tag.includes(kriteria.tag)) return false;
      return true;
    });
  }

  // initial state: daftarProduk berisi produk dengan atribut harga, rating, dan nama
  // final state: mengembalikan daftar produk yang sudah diurutkan berdasarkan atribut tertentu
  dapatkanProdukTerurut(urutBerdasarkan, urutan) {
    const sorted = [...this.daftarProduk].sort((a, b) => {
      let valA, valB;
      if (urutBerdasarkan === 'harga') {
        valA = a.harga;
        valB = b.harga;
      } else if (urutBerdasarkan === 'rating') {
        valA = a.rating;
        valB = b.rating;
      } else if (urutBerdasarkan === 'nama') {
        valA = a.nama.toLowerCase();
        valB = b.nama.toLowerCase();
      }
      if (urutan === 'naik') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
    return sorted;
  }

  // initial state: daftarProduk berisi produk dengan berbagai harga
  // final state: mengembalikan daftar produk yang berada dalam rentang harga tertentu
  dapatkanProdukDalamRentangHarga(minimum, maksimum) {
    return this.daftarProduk.filter(p => p.harga >= minimum && p.harga <= maksimum);
  }

  // initial state: daftarProduk berisi produk dengan berbagai kategori dan tag
  // final state: mengembalikan daftar produk yang mirip dengan produk tertentu berdasarkan tag atau kategori
  dapatkanProdukSerupa(idProduk, batas) {
    const produk = this.daftarProduk.find(p => p.id === idProduk);
    if (!produk) return [];
    
    const serupa = this.daftarProduk.filter(p => {
      if (p.id === idProduk) return false;
      if (p.kategori === produk.kategori) return true;
      return p.tag.some(tag => produk.tag.includes(tag));
    });
    
    return serupa.slice(0, batas);
  }

  // initial state: daftarProduk berisi produk dengan berbagai nama
  // final state: mengembalikan daftar nama produk yang dimulai dengan prefix tertentu (auto-complete)
  autoLengkap(prefix, batas) {
    const pref = prefix.toLowerCase();
    const matching = this.daftarProduk.filter(p => p.nama.toLowerCase().startsWith(pref));
    return matching.map(p => p.nama).slice(0, batas);
  }
}
