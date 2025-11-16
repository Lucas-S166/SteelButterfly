import React, { useEffect, useState } from "react";
import Chart from "../chart/chart";
import "./FuturesWidget.css";

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

const FuturesWidget = () => {
  const [region, setRegion] = useState(["china"]);
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);

  const [month, setMonth] = useState(1);
  const [chartData, setChartData] = useState([]);

  const [view, setView] = useState("prices");
  const [menuOpen, setMenuOpen] = useState(false);

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

    const fetchSeriesForRegion = (r) =>
      fetch(`http://localhost:8000/prices?region=${r}&month=${month}`)
        .then((res) => res.json())
        .then((data) =>
          Object.entries(data).map(([date, value]) => ({
            time: date,
            value,
          }))
        );

    Promise.all(region.map((r) => fetchSeriesForRegion(r)))
      .then((allSeries) => {
        setChartData(allSeries);
      })
      .catch((err) => console.error("Error fetching prices:", err));
  }, [region, month, view]);

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
                      {[
                        { id: "china", label: "🇨🇳 China" },
                        { id: "usa", label: "🇺🇸 USA" },
                        { id: "india", label: "🇮🇳 India" },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          onClick={(e) => e.stopPropagation()}
                          className={`region-option ${
                            region.includes(opt.id) ? "selected" : ""
                          }`}
                        >
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

            <Chart data={chartData} regions={region} height={300} />
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