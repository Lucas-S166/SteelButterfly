import { useState } from "react";

const ClimateImpactAdjuster = () => {
  const [impacts, setImpacts] = useState({
    SCC: false,
    SCSO_2: false,
    Water: false,
    Uncertainties: false,
  });

  const [discount, setDiscount] = useState("2");

  const toggleImpact = (key) => {
    setImpacts((prev) => ({
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
        {["SCC", "SCSO_2", "Water", "Uncertainties"].map((key) => (
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
            {key}
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
