from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from contextlib import asynccontextmanager

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


@app.get("/prices")
def get_prices(month: int, region: str):
    try:
        return xlsx_parser(region, month)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def climate_adjusted_price(
    P_orig,
    SC_CO2,
    M_CO2,
    T_CO2,
    D_PM,
    E_SO2,
    Y,
    f_sulf,
    M_SO2,
    C0,
    beta,
    S,
    W,
    tau_US
):
    """
    Computes the climate-adjusted price using your full formula.
    """

    # --- Social cost of CO2 component ---
    co2_component = SC_CO2 * (M_CO2 + T_CO2)

    # --- SO2 damages component ---
    so2_cost_per_ton = (D_PM / E_SO2) * (Y / f_sulf)
    so2_component = so2_cost_per_ton * M_SO2

    # --- Water scarcity cost component ---
    water_component = C0 * (1 + beta * S) * W

    # --- Final adjusted price ---
    adjusted_price = (
        P_orig
        + co2_component
        + so2_component
        + water_component
    ) * tau_US

    return adjusted_price

def us_tarrifs(price):
    return 1.25 * price

def us_tax_incentive(price): 
    return 0.90* price
