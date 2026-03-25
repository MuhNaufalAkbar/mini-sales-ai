import joblib
import os

# Mencari file pkl di folder ml (satu tingkat di atas backend)
MODEL_PATH = os.path.join("..", "ml", "sales_model.pkl")

def predict_status(data):
    try:
        # Load model
        model = joblib.load(MODEL_PATH)
        
        # Susun input sesuai urutan saat training (Jumlah, Harga, Diskon)
        input_features = [[data.jumlah_penjualan, data.harga, data.diskon]]
        
        # Lakukan prediksi
        prediction = model.predict(input_features)
        
        # Kembalikan hasil string (1 = Laris, 0 = Tidak Laris)
        return "Laris" if prediction[0] == 1 else "Tidak Laris"
    except Exception as e:
        return f"Error pada Model: {str(e)}"