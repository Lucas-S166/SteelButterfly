import { useState } from "react";

const PURCHASING_METHODS = [
  "Spot Purchasing",
  "Volume-Commit",
  "Fixed Spread Contracts",
  "Futures",
  "Swaps",
  "Options",
];

const PurchasingMethodPanel = () => {
  const [method, setMethod] = useState(PURCHASING_METHODS[0]);

  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: "12px",
        backgroundColor: "#020617",
        border: "1px solid #1e293b",
        boxSizing: "border-box",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",             // row = full panel width
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          Purchase Method
        </h2>
        <select
          id="purchasing-method-select"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={{
            flex: 1,                  // ⬅️ take the rest of the row
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #1f2937",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            fontSize: "15px",
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          {PURCHASING_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        </div>
    </div>
  );
};

export default PurchasingMethodPanel;
