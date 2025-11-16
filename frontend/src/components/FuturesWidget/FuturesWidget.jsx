import { useEffect, useState } from "react";
import Chart from "../chart/chart";
import "./FuturesWidget.css";
import { REGION_OPTIONS } from "../../constants/regionOptions";

const createDefaultMillSelections = () =>
  REGION_OPTIONS.reduce((acc, region) => {
    acc[region.id] = region.mills.map((mill) => mill.id);
    return acc;
  }, {});

const MenuItem = ({ label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`menu-item ${active ? "active" : ""}`}
    >
      {label}
    </button>
  );
};

const FuturesWidget = ({ impacts, secondaryImpacts, discount }) => {
  const [region, setRegion] = useState(["china"]);
  const [millSelections, setMillSelections] = useState(
    createDefaultMillSelections
  );
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);

  const [month, setMonth] = useState(1);

  // Separate base vs adjusted chart data
  const [baseChartData, setBaseChartData] = useState([]);
  const [adjustedChartData, setAdjustedChartData] = useState([]);

  const [view, setView] = useState("prices");
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMillSelection = (regionId, millId) => {
    setMillSelections((prev) => {
      const existing = prev[regionId] ?? [];
      const hasMill = existing.includes(millId);
      const nextMills = hasMill
        ? existing.filter((item) => item !== millId)
        : [...existing, millId];

      return {
        ...prev,
        [regionId]: nextMills,
      };
    });
  };

  // Any impact toggled on?
  const anyImpactActive =
    impacts.scc ||
    impacts.so2 ||
    impacts.water ||
    secondaryImpacts.uncertainties ||
    secondaryImpacts.taxIncentives ||
    secondaryImpacts.tariffs;

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".region-dropdown")) {
        setRegionMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (view !== "prices") return;
    if (region.length === 0) return;

    // ----- Base (unadjusted) prices -----
    const fetchBaseSeriesForRegion = (r) =>
      fetch(`http://localhost:8000/prices?region=${r}&month=${month}`)
        .then((res) => res.json())
        .then((data) =>
          Object.entries(data).map(([date, value]) => ({
            time: date,
            value,
          }))
        );

    // ----- Adjusted prices (backend applies SCC / SO2 / etc.) -----
    const fetchAdjustedSeriesForRegion = (r) =>
      fetch("http://localhost:8000/adjusted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,                 // e.g. 1, 2, 3...
          region: r,             // "china", "india", "usa"
          impacts,               // { scc, so2, water }
          secondaryImpacts,      // { uncertainties, taxIncentives, tariffs }
          discount: Number(discount),
          mills: millSelections[r], // which mills are selected for this region
        }),
      })
        .then((res) => res.json())
        .then((data) =>
          Object.entries(data).map(([date, value]) => ({
            time: date,
            value,
          }))
        );

    // Fetch base series
    Promise.all(region.map((r) => fetchBaseSeriesForRegion(r)))
      .then((allBaseSeries) => {
        setBaseChartData(allBaseSeries);
      })
      .catch((err) => console.error("Error fetching base prices:", err));

    // Only fetch adjusted series if any impact is active
    if (anyImpactActive) {
      Promise.all(region.map((r) => fetchAdjustedSeriesForRegion(r)))
        .then((allAdjustedSeries) => {
          setAdjustedChartData(allAdjustedSeries);
        })
        .catch((err) => console.error("Error fetching adjusted prices:", err));
    }
  }, [
    region,
    month,
    view,
    impacts,
    secondaryImpacts,
    discount,
    millSelections,
    anyImpactActive,
  ]);

  const handleSelectView = (nextView) => {
    setView(nextView);
    setMenuOpen(false);
  };

  return (
    <div className="futures-widget-wrapper">
      <div className="futures-widget-card">
        <div className="futures-widget-header">
          <h1 className="futures-widget-title">HRC Futures</h1>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="futures-widget-plus-button"
          >
            +
          </button>
        </div>

        {menuOpen && (
          <div className="futures-widget-menu">
            <MenuItem
              label="Prices – Time Series"
              active={view === "prices"}
              onClick={() => handleSelectView("prices")}
            />
            <MenuItem
              label="Manufacturer Graph"
              active={view === "manufacturer"}
              onClick={() => handleSelectView("manufacturer")}
            />
          </div>
        )}

        {view === "prices" && (
          <>
            <div className="futures-widget-controls">
              <div className="region-dropdown futures-widget-region-dropdown">
                <span className="futures-widget-label">Country:</span>

                <div className="region-select-wrapper">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRegionMenuOpen((prev) => !prev);
                    }}
                    className="region-select-button"
                  >
                    {region.length === 0
                      ? "Select countries..."
                      : region.map((r) => r.toUpperCase()).join(", ")}
                  </button>

                  {regionMenuOpen && (
                    <div className="region-select-dropdown">
                      {REGION_OPTIONS.map((opt) => (
                        <div
                          key={opt.id}
                          className={`region-option ${
                            region.includes(opt.id) ? "selected" : ""
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="region-option-header">
                            <input
                              type="checkbox"
                              checked={region.includes(opt.id)}
                              onChange={() => {
                                setRegion((prev) => {
                                  const isSelected = prev.includes(opt.id);
                                  if (isSelected) {
                                    if (prev.length === 1) {
                                      return prev;
                                    }
                                    return prev.filter((r) => r !== opt.id);
                                  } else {
                                    return [...prev, opt.id];
                                  }
                                });
                              }}
                            />
                            {opt.label}
                          </label>

                          <div className="mill-options">
                            {opt.mills.map((mill) => {
                              const selected =
                                millSelections[opt.id]?.includes(mill.id) ??
                                false;

                              return (
                                <label key={mill.id} className="mill-option">
                                  <input
                                    type="checkbox"
                                    disabled={!region.includes(opt.id)}
                                    checked={selected}
                                    onChange={() =>
                                      toggleMillSelection(opt.id, mill.id)
                                    }
                                  />
                                  <span>{mill.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="futures-widget-months">
                <span className="futures-widget-label">Months Out:</span>

                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="month-select"
                >
                  {Array.from({ length: 15 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Chart
              baseData={baseChartData}
              adjustedData={anyImpactActive ? adjustedChartData : []}
              regions={region}
              height={300}
            />
          </>
        )}

        {view === "manufacturer" && (
          <div className="manufacturer-view">
            <p className="manufacturer-text">
              Manufacturer graph view selected. Plug in your manufacturer-specific
              chart or layout here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuturesWidget;