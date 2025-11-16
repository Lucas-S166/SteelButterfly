import { useState } from "react";

export default function SpotPurchasing() {
  const [price, setPrice] = useState("");
  const [tons, setTons] = useState("");

  const MAX_PRICE = 10000;
  const MAX_TONS = 100_000_000;

  const formatCurrency = (value) => {
    if (isNaN(value)) return "$0.00";
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  const handlePriceChange = (value) => {
    if (value === "") {
      setPrice("");
      return;
    }

    const decimalRegex = /^\d*\.?\d*$/;
    if (!decimalRegex.test(value)) {
      return; // ignore invalid characters
    }

    setPrice(value);
  };

  const handleTonsChange = (value) => {
    if (value === "") {
      setTons("");
      return;
    }

    const decimalRegex = /^\d*\.?\d*$/;
    if (!decimalRegex.test(value)) {
      return;
    }

    setTons(value);
  };

  // Clamp and normalize on blur
  const handlePriceBlur = () => {
    if (price === "") return;

    let num = parseFloat(price);
    if (isNaN(num)) {
      setPrice("");
      return;
    }

    num = Math.max(0, Math.min(num, MAX_PRICE)); // clamp
    setPrice(num.toString());
  };

  const handleTonsBlur = () => {
    if (tons === "") return;

    let num = parseFloat(tons);
    if (isNaN(num)) {
      setTons("");
      return;
    }

    num = Math.max(0, Math.min(num, MAX_TONS)); // clamp
    setTons(num.toString());
  };

  const priceNum = parseFloat(price) || 0;
  const tonsNum = parseFloat(tons) || 0;
  const total = priceNum * tonsNum;

  return (
    <div
      style={{
        marginTop: "10px",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #1e293b",
        backgroundColor: "#0f172a",
        color: "white",
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "18px",
      }}
    >
      {/* Input Row */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          justifyContent: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
            onBlur={handlePriceBlur}
            style={{
              width: "100px",
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "white",
              fontSize: "20px",
              fontWeight: 600,
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Tons:</label>
          <input
            type="text"
            value={tons}
            onChange={(e) => handleTonsChange(e.target.value)}
            onBlur={handleTonsBlur}
            style={{
              width: "120px",
              padding: "6px 8px",
              borderRadius: "6px",
              border: "1px solid #334155",
              backgroundColor: "#0f172a",
              color: "white",
              fontSize: "20px",
              fontWeight: 600,
            }}
          />
        </div>
      </div>

      <div
        style={{
          fontSize: "26px",
          fontWeight: 800,
          textAlign: "center",
          width: "100%",
        }}
      >
        Total Cost: {formatCurrency(total)}
      </div>
    </div>
  );
}