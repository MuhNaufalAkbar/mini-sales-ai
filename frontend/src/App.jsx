import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // ── STATE MANAGEMENT ─────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [salesData, setSalesData] = useState([]);
  const [formData, setFormData] = useState({ jumlah_penjualan: '', harga: '', diskon: '' });
  const [prediction, setPrediction] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [predictLoading, setPredictLoading] = useState(false);

  // ── AUTHENTICATION ───────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchSales();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', loginData);
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      fetchSales();
    } catch {
      alert('Login Gagal! Gunakan admin / admin123');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setPrediction(null);
    setSalesData([]);
  };

  // ── DATA FETCHING ────────────────────────────────────────
  const fetchSales = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/sales');
      setTimeout(() => {
        setSalesData(response.data);
        setTableLoading(false);
      }, 800);
    } catch {
      console.error('Gagal mengambil data sales.');
      setTableLoading(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setPredictLoading(true);
    try {
      const payload = {
        jumlah_penjualan: parseInt(formData.jumlah_penjualan),
        harga: parseFloat(formData.harga),
        diskon: parseFloat(formData.diskon),
      };
      const response = await axios.post('http://127.0.0.1:8000/predict', payload);
      setPrediction(response.data.prediction);
    } catch {
      alert('Gagal koneksi ke Backend! Pastikan server Python aktif.');
    } finally {
      setPredictLoading(false);
    }
  };

  // ── UI: LOGIN PAGE ───────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand-dot" />
            <span className="login-brand-name">SalesCore</span>
          </div>
          <h1 className="login-title">Selamat<br /><span>Datang Kembali</span></h1>
          <p className="login-desc">Masuk untuk mengakses dashboard prediksi penjualan Anda.</p>
          <div className="login-divider" />
          <form onSubmit={handleLogin}>
            <div className="form-field mb-16">
              <label>Username</label>
              <div className="input-wrap">
                <input
                  type="text"
                  placeholder="admin"
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-field mb-24">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary full">Masuk ke Dashboard →</button>
          </form>
        </div>
      </div>
    );
  }

  // ── UI: DASHBOARD PAGE (FULL DESKTOP) ────────────────────
  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand">
            <div className="topbar-brand-dot" />
            <span className="topbar-brand-name">SalesCore</span>
          </div>
          <div className="topbar-actions">
            <span className="topbar-meta">Halo, <strong>Admin</strong></span>
            <button className="btn-logout" onClick={handleLogout}>Keluar</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <header className="page-header">
          <h1>Dashboard <span>Penjualan</span></h1>
          <p>Analisis data real-time dan prediksi kelayakan produk berbasis AI.</p>
        </header>

        {/* SECTION: PREDIKSI */}
        <section className="panel">
          <div className="panel-title">Cek Status Kelayakan Jual</div>
          <div className="panel-desc">Gunakan model Machine Learning untuk menganalisis performa produk.</div>
          <div className="panel-divider" />
          <form className="predict-form" onSubmit={handlePredict}>
            <div className="form-group">
              <label>Jumlah Terjual</label>
              <div className="input-wrap">
                <input type="number" className="has-suffix" placeholder="0" min="0" required
                  onChange={(e) => setFormData({ ...formData, jumlah_penjualan: e.target.value })} />
                <span className="input-suffix">unit</span>
              </div>
            </div>

            <div className="form-group">
              <label>Harga Satuan</label>
              <div className="input-wrap">
                <span className="input-prefix">Rp</span>
                <input type="number" className="has-prefix" placeholder="0" min="0" required
                  onChange={(e) => setFormData({ ...formData, harga: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Diskon</label>
              <div className="input-wrap">
                <input type="number" className="has-suffix" placeholder="0" min="0" max="100" required
                  onChange={(e) => setFormData({ ...formData, diskon: e.target.value })} />
                <span className="input-suffix">%</span>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={predictLoading}>
              {predictLoading ? <span className="spinner" /> : 'CEK STATUS →'}
            </button>
          </form>

          {prediction && (
            <div className={`result-box ${prediction === 'Laris' ? 'laris' : 'tidak'}`}>
              <div>
                <div className="result-label">Hasil Analisis</div>
                <div className="result-value">
                  {prediction === 'Laris' ? '✓ Produk Tergolong Laris' : '✕ Produk Kurang Laris'}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION: TABEL */}
        <section className="panel">
          <div className="panel-title">Riwayat Penjualan Terbaru</div>
          <div className="panel-desc">Data ditarik otomatis dari basis data CSV pusat.</div>
          <div className="panel-divider" />
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Produk</th>
                  <th>Terjual</th>
                  <th>Harga</th>
                  <th>Diskon</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tableLoading ? (
                  <tr><td colSpan="6" className="table-loading"><span className="spinner" /> Memuat data...</td></tr>
                ) : salesData.map((item, idx) => (
                  <tr key={idx}>
                    <td><span className="td-id">{item.product_id}</span></td>
                    <td>{item.product_name}</td>
                    <td>{item.jumlah_penjualan}</td>
                    <td><span className="td-price">Rp {item.harga?.toLocaleString()}</span></td>
                    <td>{item.diskon}%</td>
                    <td>
                      <span className={`badge ${item.status === 'Laris' ? 'laris' : 'tidak'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;