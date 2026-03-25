                                SalesCore: Mini AI Sales System

SalesCore adalah platform analisis penjualan full-stack yang mengintegrasikan Machine Learning untuk memprediksi kelayakan jual produk secara real-time. Aplikasi ini dibangun dengan standar industri menggunakan Modern Web Stack dan Automated Analytics Pipeline.

1. Diagram Arsitektur (High-Level)
[ User Browser ] <──(REST API/JSON)──> [ FastAPI Backend ]
       ^                                      │
       │ (React/Vite UI)                      ├──> [ ML Model: Random Forest ]
       └──────────────────────────────────────┤
                                              └──> [ Data Source: CSV File ]

2. Penjelasan Komponen
    React Frontend (Vite): Bertanggung jawab atas antarmuka pengguna (UI). Mengelola state login, formulir input data penjualan, dan menampilkan tabel riwayat secara reaktif.

    Python Backend (FastAPI): Bertindak sebagai jembatan (middleware). Menyediakan endpoint API untuk autentikasi, pengambilan data, dan pengiriman parameter ke model ML.

    Machine Learning (Scikit-Learn): Menggunakan algoritma Random Forest Classifier yang telah dilatih sebelumnya (.pkl). Model ini menerima data numerik (Terjual, Harga, Diskon) dan mengembalikan label klasifikasi ("Laris" / "Tidak").

    Data Source (CSV): Berperan sebagai database sederhana yang menyimpan ribuan baris riwayat transaksi untuk ditampilkan pada dashboard.                      

3. Alur Data (Data Flow)
    Input: Pengguna memasukkan data produk melalui form di Frontend.

    Request: Frontend mengirimkan data tersebut dalam format JSON ke endpoint /predict di Backend.

    Processing: Backend meneruskan data ke fungsi ml_handler.py. Model ML memuat file .pkl dan melakukan komputasi prediksi.

    Retrieval: Secara bersamaan, Backend membaca sales_data.csv menggunakan Pandas untuk memperbarui tabel riwayat.

    Output: Hasil prediksi dan data tabel dikirim kembali ke Frontend untuk ditampilkan kepada pengguna secara instan.                          

*Struktur Proyek (Project Anatomy)*

mini-sales-ai/
├── backend/               
│   ├── main.py            
│   ├── ml_handler.py      
│   ├── schema.py          
│   └── venv/              
├── frontend/              
│   ├── src/               
│   ├── package.json       
│   └── ... (config files)
├── ml/                    
│   └── sales_model.pkl    
├── data/                  
│   └── sales_data.csv     
└── README.md              

*Panduan Instalasi & Cara Menjalankan*
1. Persiapan Backend (Python)
    1. Buka terminal di folder backend/.
    2. Install pustaka yang diperlukan:
        pip install fastapi uvicorn pandas scikit-learn joblib

    3. Jalankan server:
        python main.py
        Server berjalan di http://127.0.0.1:8000.

2. Persiapan Frontend (React)
    1. Buka terminal baru di folder frontend/.
    2. Install dependensi:
        npm install
    3. Jalankan aplikasi:
        npm run dev
        Akses melalui browser di http://localhost:5173.

*Keputusan Desain (Design Decisions)*
1. Teknologi Backend & ML
    FastAPI: Dipilih karena mendukung asynchronous programming yang efisien untuk melayani permintaan prediksi AI secara cepat.

    Random Forest Classifier: Digunakan karena keunggulannya dalam menangani data tabular dan memberikan hasil prediksi yang stabil dibandingkan model linear sederhana.

    Model Persistence: Model disimpan dalam format .pkl menggunakan joblib untuk memastikan Backend tidak perlu melatih ulang model setiap kali server dijalankan.

2. Teknologi Frontend
    React (Vite): Memberikan pengalaman pengguna yang reaktif dengan waktu build yang instan.

    State Management & UX: Menggunakan dual-loading state (Tabel & Tombol) untuk memberikan feedback visual yang jelas saat proses data berlangsung.

    Premium Dark UI: Menggunakan font Syne (untuk kesan AI yang modern) dan Manrope (untuk keterbacaan data), serta skema warna gelap (Dark Mode) standar aplikasi SaaS.

3. Keamanan & Autentikasi
    Dummy JWT Flow: Simulasi pengiriman token dari Backend ke Frontend yang disimpan di localStorage. Ini menunjukkan pemahaman mendalam tentang siklus autentikasi aplikasi modern tanpa memerlukan setup database yang berat untuk tahap pengujian.

*Asumsi & Metrik Sistem*
Dataset: Sistem berasumsi data penjualan memiliki fitur numerik berupa jumlah_penjualan, harga, dan diskon.

Arsitektur Model Machine Learning
    Tambahkan detail teknis mengenai hasil evaluasi yang baru saja kita bahas:

    Preprocessing Pipeline: Data melalui tahap Label Encoding untuk target variabel dan pemisahan fitur (jumlah_penjualan, harga, diskon) menggunakan train_test_split dengan rasio 80:20 untuk memastikan validitas pengujian.

    Model Performance: Berdasarkan Classification Report, model mencapai akurasi 1.0 (100%). Meskipun sempurna, hal ini diakui sebagai indikasi pola data yang sangat linear atau dataset yang bersifat sistematis, namun tetap membuktikan bahwa integrasi end-to-end berjalan tanpa galat.

    Model Persistence: Menggunakan library joblib untuk melakukan serialisasi model menjadi file .pkl, sehingga proses loading model di FastAPI hanya memakan waktu beberapa milidetik (efisiensi memori).

*Keamanan: Login bersifat case-sensitive. Gunakan kredensial:*

*Username: admin*
*Password: admin123*

    Persistent Session: Penggunaan useEffect pada App.jsx untuk mengecek keberadaan token di localStorage saat aplikasi pertama kali dimuat. Hal ini mencegah pengguna terlempar keluar dari dashboard saat melakukan refresh halaman (UX Optimization).

    Axios Interceptors (Concept): Meskipun sederhana, alur integrasi API sudah dipisahkan berdasarkan fungsinya (fetchSales, handlePredict, handleLogin) untuk memudahkan pemeliharaan kode (Maintainability).

Kontributor: Muhammad Naufal Akbar

<img width="1567" height="897" alt="hasil analisis model" src="https://github.com/user-attachments/assets/9d8d29d2-3aa1-4fa1-9621-5dc56ca4422e" />
<img width="1920" height="917" alt="Halaman Login" src="https://github.com/user-attachments/assets/fe95ae13-8e21-4260-9dfb-ebc700b7b92a" />
<img width="1517" height="917" alt="dashboard" src="https://github.com/user-attachments/assets/bcb12365-bbd5-4960-afdd-908e6e63196d" />
