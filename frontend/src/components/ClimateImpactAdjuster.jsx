import { useState } from "react";
import { useClimateImpacts } from "../context/ClimateImpactContext";

const IMPACT_OPTIONS = [
  { key: "scc", label: "SCC" },
  { key: "so2", label: "SC_SO2" },
  { key: "water", label: "Water" },
];

const SECONDARY_OPTIONS = [
  { key: "uncertainties", label: "Uncertainties" },
  { key: "taxIncentives", label: "Tax Incentives" },
  { key: "tariffs", label: "Tariffs" },
];

const ClimateImpactAdjuster = () => {
  const { impacts, toggleImpact } = useClimateImpacts();
  const [discount, setDiscount] = useState("2");
  const [secondaryImpacts, setSecondaryImpacts] = useState({
    uncertainties: false,
    taxIncentives: false,
    tariffs: false,
  });

  const handleSecondaryToggle = (key) => {
    setSecondaryImpacts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: "12px",
        backgroundColor: "#020617",
        border: "1px solid #1f2937",
        color: "white",
        fontFamily: "Inter, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "16px",
        }}
      >
        Climate Impact Adjuster
      </h2>

      {/* Impact checkboxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "8px 16px",
          marginBottom: "18px",
        }}
      >
        {IMPACT_OPTIONS.map(({ key, label }) => (
          <label
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              cursor: "pointer",
              gap: "6px",
            }}
          >
            <input
              type="checkbox"
              checked={impacts[key]}
              onChange={() => toggleImpact(key)}
              style={{ cursor: "pointer" }}
            />
            {label}
          </label>
        ))}
        {SECONDARY_OPTIONS.map(({ key, label }) => (
          <label
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              cursor: "pointer",
              gap: "6px",
            }}
          >
            <input
              type="checkbox"
              checked={secondaryImpacts[key]}
              onChange={() => handleSecondaryToggle(key)}
              style={{ cursor: "pointer" }}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Discount radio group */}
      <div>
        <div
          style={{
            fontSize: "14px",
            marginBottom: "8px",
          }}
        >
          Discount
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {["1.5", "2", "2.5", "3"].map((value) => (
            <label
              key={value}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                cursor: "pointer",
                gap: "6px",
              }}
            >
              <input
                type="radio"
                name="discount-rate"
                value={value}
                checked={discount === value}
                onChange={(e) => setDiscount(e.target.value)}
                style={{ cursor: "pointer" }}
              />
              {value}%
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClimateImpactAdjuster;
