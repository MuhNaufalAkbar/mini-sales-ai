from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

# Import dari file lokal kita
from schema import PredictRequest, LoginRequest
from ml_handler import predict_status

app = FastAPI(title="Mini AI Sales API")

# PENTING: Aktifkan CORS agar React (port 5173) bisa memanggil API (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path ke file CSV
CSV_PATH = os.path.join("..", "data", "sales_data.csv")

# --- 1. ENDPOINT LOGIN (Dummy Auth) ---
@app.post("/login")
async def login(data: LoginRequest):
    # Gunakan .strip() untuk membuang spasi yang tidak sengaja terketik
    u = data.username.strip()
    p = data.password.strip()
    
    if u == "admin" and p == "admin123":
        return {"token": "dummy-token", "user": u}
    
    raise HTTPException(status_code=401, detail="Salah")

# --- 2. ENDPOINT AMBIL DATA SALES ---
@app.get("/sales")
async def get_sales():
    if not os.path.exists(CSV_PATH):
        raise HTTPException(status_code=404, detail="File sales_data.csv tidak ditemukan")
    
    df = pd.read_csv(CSV_PATH)
    return df.to_dict(orient="records")

# --- 3. ENDPOINT PREDIKSI AI ---
@app.post("/predict")
async def predict(data: PredictRequest):
    result = predict_status(data)
    return {"prediction": result}

if __name__ == "__main__":
    import uvicorn
    # Menjalankan server di port 8000
    uvicorn.run(app, host="127.0.0.1", port=8000)