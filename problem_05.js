export class Produk {
  constructor(id, nama, kategori, stokSekarang, stokMin, stokMax) {
    this.id = id;                // ID unik produk
    this.nama = nama;            // Nama produk
    this.kategori = kategori;    // Kategori produk
    this.stokSekarang = stokSekarang; // Jumlah stok saat ini
    this.stokMin = stokMin;      // Stok minimum
    this.stokMax = stokMax;      // Stok maksimum
  }
}

export class TransaksiStok {
  constructor(idProduk, tipe, jumlah, waktu) {
    this.idProduk = idProduk; // ID produk
    this.tipe = tipe;         // "MASUK" atau "KELUAR"
    this.jumlah = jumlah;     // Jumlah produk yang ditransaksikan
    this.waktu = waktu;       // Timestamp transaksi
  }
}

export class PengelolaInventaris {
  constructor() {
    this.produk = [];        // Daftar semua produk
    this.transaksi = [];     // Daftar semua transaksi
  }

  // initial state: produk berisi daftar produk dengan stok berbeda
  // final state: mengembalikan daftar produk dengan stok terendah, terbatas sesuai limit
  produkStokRendah(batas) {
    return this.produk.sort((a, b) => a.stokSekarang - b.stokSekarang).slice(0, batas);
  }

  // initial state: produk berisi produk dengan stok maksimum berbeda
  // final state: mengembalikan produk yang stoknya di bawah threshold % dari stok maksimum
  produkDiBawahThreshold(persentase) {
    const threshold = persentase / 100;
    return this.produk.filter(p => p.stokSekarang < threshold * p.stokMax);
  }

  // initial state: transaksi berisi daftar semua transaksi
  // final state: mengembalikan daftar transaksi produk tertentu dalam rentang tanggal
  riwayatTransaksi(idProduk, tanggalMulai, tanggalAkhir) {
    return this.transaksi.filter(t => 
      t.idProduk === idProduk && 
      t.waktu >= tanggalMulai && 
      t.waktu <= tanggalAkhir
    );
  }

  // initial state: transaksi berisi sejarah penggunaan produk
  // final state: memprediksi tanggal kapan produk harus direstock berdasarkan rata-rata penggunaan
  prediksiTanggalRestock(idProduk) {
  const produk = this.produk.find(p => p.id === idProduk);
  if (!produk) return null;

  const keluar = this.transaksi.filter(t => t.idProduk === idProduk && t.tipe === "KELUAR");
  if (keluar.length === 0) return null;
  const totalKeluar = keluar.reduce((a, t) => a + t.jumlah, 0);

  const tanggal = keluar
    .map(t => t.waktu.getTime())
    .sort((a, b) => a - b);

  const selisihHari = (tanggal.at(-1) - tanggal[0]) / (1000 * 60 * 60 * 24);
  if (selisihHari === 0) return null;

  const avgHarian = totalKeluar / selisihHari;
  const sisaStok = produk.stokSekarang - produk.stokMin;
  if (sisaStok <= 0) return new Date(); 
  const hariMenujuRestock = sisaStok / avgHarian;
  const predict = new Date(Date.now() + hariMenujuRestock * 24 * 60 * 60 * 1000);
  return predict;
  }

  // initial state: produk berisi daftar produk
  // final state: memperbarui stok beberapa produk sekaligus
  perbaruiStokBanyak(pembaruan) {
    for (const update of pembaruan) {
      const produk = this.produk.find(p => p.id === update.idProduk);
      if (produk && update.stokBaru >= 0) {
        produk.stokSekarang = update.stokBaru;
      }
    }
  }
}
