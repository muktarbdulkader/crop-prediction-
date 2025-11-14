from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Dict

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserRegister(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(UserBase):
    plan: str


class PaymentConfirmation(BaseModel):
    email: EmailStr
    transaction_id: str


users: Dict[str, Dict[str, str]] = {}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/auth/register", response_model=UserPublic)
async def register(user: UserRegister):
    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    users[user.email] = {
        "name": user.name,
        "email": user.email,
        "password": user.password,
        "plan": "free",
    }
    return {"name": user.name, "email": user.email, "plan": "free"}


@app.post("/auth/login", response_model=UserPublic)
async def login(data: UserLogin):
    stored = users.get(data.email)
    if not stored or stored["password"] != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "name": stored["name"],
        "email": stored["email"],
        "plan": stored["plan"],
    }


@app.post("/payments/confirm", response_model=UserPublic)
async def confirm_payment(data: PaymentConfirmation):
    stored = users.get(data.email)
    if not stored:
        raise HTTPException(status_code=404, detail="User not found")
    if not data.transaction_id.strip():
        raise HTTPException(status_code=400, detail="Invalid transaction id")
    stored["plan"] = "pro"
    return {
        "name": stored["name"],
        "email": stored["email"],
        "plan": stored["plan"],
    }
