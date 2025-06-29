// script.js

// Format angka ke Rupiah (contoh: 1000000 => "1.000.000")
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(angka);
  }
  
  // Format tanggal (contoh: "2023-07-01" => "01/07/2023")
  function formatTanggal(tanggal) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
  }
  
  // Tampilkan notifikasi
  function showAlert(message, type = 'success', duration = 3000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '1100';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 150);
    }, duration);
  }
  
 
  
  // Halaman Transaksi
  function initTransaksiPage() {
    if (!document.getElementById('formTransaksi')) return;
  
    // Data contoh transaksi
    const contohTransaksi = [
      { nama: "Budi Santoso", jumlah: 500000, kategori: "Simpanan", tanggal: "2023-07-01", keterangan: "Tabungan rutin" },
      { nama: "Ani Wijaya", jumlah: 1000000, kategori: "Pinjaman", tanggal: "2023-07-02", keterangan: "Modal usaha" }
    ];
  
    // Set tanggal default
    document.getElementById('tanggal').valueAsDate = new Date();
    // Cek apakah ada data di localStorage
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      try {
        const transactions = JSON.parse(storedTransactions);
        contohTransaksi.push(...transactions);
      } catch (e) {
        console.error('Error parsing transactions from localStorage:', e);
      }
    }
  
    // Load data ke tabel
    function loadTransactionData() {
      const tabelTransaksi = document.getElementById('tabelTransaksi');
      const fullTabelTransaksi = document.getElementById('fullTabelTransaksi');
      
      contohTransaksi.forEach((transaksi, index) => {
        // Untuk tabel transaksi terakhir (5 data)
        if (index < 5 && tabelTransaksi) {
          const row = tabelTransaksi.insertRow();
          row.innerHTML = `
            <td>${formatTanggal(transaksi.tanggal)}</td>
            <td>${transaksi.nama}</td>
            <td>Rp ${formatRupiah(transaksi.jumlah)}</td>
            <td><span class="badge bg-${getBadgeClass(transaksi.kategori)}">${transaksi.kategori}</span></td>
          `;
        }
        
        // Untuk tabel lengkap
        if (fullTabelTransaksi) {
          const fullRow = fullTabelTransaksi.insertRow();
          fullRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${formatTanggal(transaksi.tanggal)}</td>
            <td>${transaksi.nama}</td>
            <td>Rp ${formatRupiah(transaksi.jumlah)}</td>
            <td><span class="badge bg-${getBadgeClass(transaksi.kategori)}">${transaksi.kategori}</span></td>
            <td>${transaksi.keterangan || '-'}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary edit-btn me-1">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger delete-btn">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          `;
        }
      });
    }
  
    // Warna badge berdasarkan kategori
    function getBadgeClass(kategori) {
      const map = {
        'Simpanan': 'success',
        'Pinjaman': 'warning',
        'Pelunasan': 'info'
      };
      return map[kategori] || 'secondary';
    }
  
    // Validasi form transaksi
    const formTransaksi = document.getElementById('formTransaksi');
    if (formTransaksi) {
      formTransaksi.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const formTransaksi = document.getElementById('formTransaksi');
        const konfirmasiModal = new bootstrap.Modal(document.getElementById('konfirmasiModal'));
        
        formTransaksi.addEventListener('submit', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Validasi manual
          let isValid = true;
          const nama = document.getElementById('nama');
          const jumlah = document.getElementById('jumlah');
          const kategori = document.getElementById('kategori');
          const tanggal = document.getElementById('tanggal');
          
          if (!nama.value) {
            nama.classList.add('is-invalid');
            isValid = false;
          } else {
            nama.classList.remove('is-invalid');
          }
          
          if (!jumlah.value || parseInt(jumlah.value) < 1000) {
            jumlah.classList.add('is-invalid');
            isValid = false;
          } else {
            jumlah.classList.remove('is-invalid');
          }
          
          if (!kategori.value) {
            kategori.classList.add('is-invalid');
            isValid = false;
          } else {
            kategori.classList.remove('is-invalid');
          }
          
          if (!tanggal.value) {
            tanggal.classList.add('is-invalid');
            isValid = false;
          } else {
            tanggal.classList.remove('is-invalid');
          }
          
          if (isValid) {
            // Tampilkan modal konfirmasi
            document.getElementById('modalNama').textContent = nama.value;
            document.getElementById('modalJumlah').textContent = formatRupiah(jumlah.value);
            document.getElementById('modalKategori').textContent = kategori.value;
            document.getElementById('modalTanggal').textContent = formatTanggal(tanggal.value);
            
            konfirmasiModal.show();
          }
          
          formTransaksi.classList.add('was-validated');
        });
        
  
        // Validasi field wajib diisi
        ['nama', 'jumlah', 'kategori', 'tanggal'].forEach(field => {
          const el = document.getElementById(field);
          if (!el.value) {
            el.classList.add('is-invalid');
            isValid = false;
          } else {
            el.classList.remove('is-invalid');
          }

        });
  
        if (isValid) {
          // Simpan ke localStorage (simulasi)
          const newTransaction = {
            nama: document.getElementById('nama').value,
            jumlah: parseInt(document.getElementById('jumlah').value),
            kategori: document.getElementById('kategori').value,
            tanggal: document.getElementById('tanggal').value,
            keterangan: document.getElementById('keterangan').value || ''
          };
          
          contohTransaksi.push(newTransaction);
          localStorage.setItem('transactions', JSON.stringify(contohTransaksi));
          
          showAlert('Transaksi berhasil disimpan!');
          formTransaksi.reset();
          document.getElementById('tanggal').valueAsDate = new Date();
        }
      });
    }
  
    loadTransactionData();
  }
  
  // Halaman Login
  function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
  
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username');
      const password = document.getElementById('password');
      let isValid = true;
  
      if (!username.value) {
        username.classList.add('is-invalid');
        isValid = false;
      } else {
        username.classList.remove('is-invalid');
      }
  
      if (!password.value) {
        password.classList.add('is-invalid');
        isValid = false;
      } else {
        password.classList.remove('is-invalid');
      }
  
      if (isValid) {
        // Simulasi login berhasil
        showAlert('Login berhasil! Mengarahkan ke dashboard...');
        setTimeout(() => {
          window.location.href = 'transaksi.html';
        }, 2000);
      }
    });
  }
  
 
  document.addEventListener('DOMContentLoaded', function() {
    // Aktifkan tooltip Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  
    // Jalankan fungsi sesuai halaman
    if (window.location.pathname.includes('transaksi.html')) {
      initTransaksiPage();
    } else if (window.location.pathname.includes('login.html')) {
      initLoginPage();
    }
    // Inisialisasi halaman lainnya jika diperlukan
    
  });