from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from xlsx_parser import xlsx_parser

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/prices")
def get_prices(month: int, filename: str):
    return xlsx_parser(filename, month)