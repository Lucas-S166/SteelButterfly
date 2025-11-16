from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from xlsx_parser import xlsx_parser
from fastapi.responses import ORJSONResponse

app = FastAPI(default_response_class=ORJSONResponse)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/prices")
def get_prices(month: int, region: str):
    return xlsx_parser(region, month)