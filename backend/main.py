from contextlib import asynccontextmanager
from typing import Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel

from xlsx_parser import xlsx_parser, load_price_df, PRICE_FILES


@asynccontextmanager
async def lifespan(app: FastAPI):
    for region in PRICE_FILES.keys():
        load_price_df(region)
    yield


app = FastAPI(default_response_class=ORJSONResponse, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AdjustmentPayload(BaseModel):
    month: int
    region: str
    # impacts from the frontend, e.g. { "scc": true, "so2": false, ... }
    impacts: Dict[str, bool]
    # "secondary impacts"
    discount: Optional[float] = None
    tax_rate: Optional[float] = None


@app.get("/prices")
def get_prices(month: int, region: str):
    try:
        return xlsx_parser(region, month)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/adjusted")
def adjust_prices(payload: AdjustmentPayload):
    try:
        return price_adjuster(payload)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def price_adjuster(payload: AdjustmentPayload):
    """
    For now: just log what came in and echo it back along with base prices.
    Later you can actually apply discount/tax adjustments here.
    """
    # Log to your server logs
    print("Received adjustment payload:", payload.dict())