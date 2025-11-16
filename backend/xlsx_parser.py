import pandas as pd
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parent
PRICES_DIR = BASE_DIR / "prices"

# Mapping of region → Excel filename
PRICE_FILES = {
    "china": "HC Closing Prices.xlsx",
    "india": "SI Closing Prices.xlsx",
    "usa": "HU Closing Prices.xlsx",
}


@lru_cache(maxsize=None)
def load_price_df(region: str) -> pd.DataFrame:
    """
    Load and cache the DataFrame for a region.
    This runs ONLY once per region. Subsequent calls use the cached DataFrame.
    """
    filename = PRICE_FILES.get(region)
    if filename is None:
        raise ValueError(f"Unknown region: {region}")

    file_path = PRICES_DIR / filename

    df = pd.read_excel(file_path)
    df["USD/mt"] = df["USD/mt"].dt.strftime("%Y-%m-%d")
    return df


def xlsx_parser(region: str, month: int):
    """
    Retrieve cached DataFrame and extract the desired month column.
    This is extremely fast because Excel is NOT reread each time.
    """
    df = load_price_df(region)  # cached!

    return dict(zip(df["USD/mt"], df[df.columns[month]]))