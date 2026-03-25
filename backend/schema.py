from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class PredictRequest(BaseModel):
    jumlah_penjualan: int
    harga: float
    diskon: float