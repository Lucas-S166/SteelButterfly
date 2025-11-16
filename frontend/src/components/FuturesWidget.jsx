import React, { useEffect, useState } from "react";
import Chart from "./chart/chart";

// Reusable menu item component for the dropdown
const MenuItem = ({ label, active, onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        padding: "10px 14px",
        backgroundColor: hover
          ? "#1e293b" // hover color
          : active
          ? "#111827" // active/selected color
          : "transparent",
        border: "none",
        color: "#e5e7eb",
        textAlign: "left",
        cursor: "pointer",
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
        transition: "background-color 0.15s ease-in-out, color 0.15s ease-in-out",
      }}
    >
      {label}
    </button>
  );
};

const FuturesWidget = () => {
  const [region, setRegion] = useState("china");
  const [month, setMonth] = useState(1);
  const [chartData, setChartData] = useState([]);

  // which view is selected in the widget
  const [view, setView] = useState("prices"); // "prices" | "manufacturer"

  // is the + menu open?
  const [menuOpen, setMenuOpen] = useState(false);

  // hover state for the + button
  const [hoverPlus, setHoverPlus] = useState(false);

  useEffect(() => {
    // only fetch for the prices time-series view
    if (view !== "prices") return;

    fetch(`http://localhost:8000/prices?region=${region}&month=${month}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data).map(([date, value]) => ({
          time: date,
          value: value,
        }));
        setChartData(formatted);
      })
      .catch((err) => {
        console.error("Error fetching prices:", err);
      });
  }, [region, month, view]);

  const handleSelectView = (nextView) => {
    setView(nextView);
    setMenuOpen(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0 40px", // shifted left to leave space for right panel
      }}
    >
      {/* Widget card */}
      <div
        style={{
          width: "100%",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#111",
          boxSizing: "border-box",
          position: "relative", // for the dropdown menu positioning
        }}
      >
        {/* Top row: title on left, + button on right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
        <h1
          style={{
            color: "white",
            fontFamily: "Inter, sans-serif",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          HRC Futures
        </h1>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            onMouseEnter={() => setHoverPlus(true)}
            onMouseLeave={() => setHoverPlus(false)}
            style={{
              border: "1px solid #64748b",
              backgroundColor: hoverPlus ? "#1e293b" : "#020617",
              color: "white",
              borderRadius: "999px",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
              padding: 0,
              transition: "background-color 0.15s ease-in-out, border-color 0.15s ease-in-out",
            }}
            aria-label="Change view"
          >
            +
          </button>
        </div>

        {/* Dropdown menu for selecting view */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "48px",
              right: "16px",
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "6px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
              minWidth: "190px",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
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

        {/* Content area depends on selected view */}
        {view === "prices" && (
          <>
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{ padding: "8px" }}
              >
                <option value="china">China</option>
                <option value="usa">USA</option>
                <option value="india">India</option>
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                style={{ padding: "8px" }}
              >
                {Array.from({ length: 15 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Month {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <Chart data={chartData} height={300} />
          </>
        )}

        {view === "manufacturer" && (
          <div style={{ color: "white", fontFamily: "Inter, sans-serif" }}>
            <p style={{ marginTop: 0 }}>
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
