from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from contextlib import asynccontextmanager
import math
import re
from typing import Dict, Optional


_COMPONENT_ALIAS_MAP = {
    "scc": "scc",
    "scco2": "scc",
    "sc-co2": "scc",
    "co2": "scc",
    "socialcostcarbon": "scc",
    "scso2": "so2",
    "so2": "so2",
    "sulfur": "so2",
    "water": "water",
    "waterscarcity": "water",
}

_DEFAULT_COMPONENT_FLAGS = {"scc": True, "so2": True, "water": True}


def _normalize_component_key(raw_key: str) -> Optional[str]:
    """
    Map arbitrary checkbox labels (SCC, SC_CO2, SCSO_2, etc.) to canonical keys.
    """
    if raw_key is None:
        return None
    normalized = re.sub(r"[^a-z0-9]", "", raw_key.lower())
    return _COMPONENT_ALIAS_MAP.get(normalized)


def _resolve_component_flags(flags: Optional[Dict[str, bool]]) -> Dict[str, bool]:
    """
    Merge user-provided component toggles with defaults so downstream math can
    rely on a complete dict.
    """
    resolved = _DEFAULT_COMPONENT_FLAGS.copy()
    if not flags:
        return resolved

    for raw_key, value in flags.items():
        canonical_key = _normalize_component_key(raw_key)
        if canonical_key:
            resolved[canonical_key] = bool(value)

    return resolved


def _compute_component_costs(
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
    component_flags: Dict[str, bool],
) -> Dict[str, float]:
    """
    Returns the monetary impact of each individual climate component. Any
    component toggled off will return 0 so the caller can simply sum values.
    """
    components = {"scc": 0.0, "so2": 0.0, "water": 0.0}

    if component_flags["scc"]:
        components["scc"] = SC_CO2 * (M_CO2 + T_CO2)

    if component_flags["so2"]:
        so2_cost_per_ton = (D_PM / E_SO2) * (Y) * (f_sulf)
        components["so2"] = so2_cost_per_ton * M_SO2

    if component_flags["water"]:
        components["water"] = C0 * (1 + beta * S) * W

    return components

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
    *,
    component_flags: Optional[Dict[str, bool]] = None,
    return_breakdown: bool = False,
):
    """
    Computes the climate-adjusted price using your full formula.
    """

    flags = _resolve_component_flags(component_flags)
    component_costs = _compute_component_costs(
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
        flags,
    )

    adjusted_price = P_orig + sum(component_costs.values())
    if return_breakdown:
        return adjusted_price, component_costs
    return adjusted_price

