import React from "react";
import Logo from "../assets/logo_wide.png"; // <-- update path to your logo

const ModelInformation = () => {
  return (
    <div
      style={{
        width: "100%",
        padding: "40px",
        boxSizing: "border-box",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            padding: "20px",
            background: "#0f172a",
            borderRadius: "16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
          }}
        >
          <img
            src={Logo}
            alt="Steel Butterfly Logo"
            style={{
              width: "420",
              height: "260px",
              objectFit: "cover",
              borderRadius: "14px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      </div>

      {/* Documentation Section */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#020617",
          padding: "32px",
          borderRadius: "16px",
          border: "1px solid #1e293b",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "16px" }}>
          Model Information
        </h1>

        <p style={{ marginBottom: "24px", lineHeight: "1.6", opacity: 0.85 }}>
          This section provides documentation and technical details about the
          Steel Butterfly predictive framework, including architecture,
          assumptions, data sources, and computational methodology.
        </p>

        <hr
          style={{
            borderColor: "#1e293b",
            margin: "20px 0 30px 0",
          }}
        />

        <h2>📘 Overview</h2>
        <p style={{ lineHeight: "1.6", opacity: 0.85 }}>
          Add a high-level description of the forecasting system, its purpose,
          and its analytical scope.
        </p>

        <h2>📊 Modeling Approach</h2>
        <ul style={{ lineHeight: "1.7", opacity: 0.85 }}>
          <li>Describe statistical or ML methods used</li>
          <li>Outline key assumptions</li>
          <li>Data transformations / normalization</li>
          <li>Error measurement and validation procedures</li>
        </ul>

        <h2>🔧 Data Sources</h2>
        <ul style={{ lineHeight: "1.7", opacity: 0.85 }}>
          <li>Futures data (source, frequency, preprocessing)</li>
          <li>HRC price indices</li>
          <li>Macroeconomic indicators</li>
          <li>Any proprietary inputs</li>
        </ul>

        <h2>🧮 Calculations & Formulas</h2>
        <p style={{ lineHeight: "1.6", opacity: 0.85 }}>
          Insert equations, variable definitions, system boundaries, and
          computation logic for your forecasting pipeline.
        </p>

        <h2>⚠️ Limitations</h2>
        <p style={{ lineHeight: "1.6", opacity: 0.85 }}>
          Discuss limitations, uncertainties, and caveats that users should be
          aware of when interpreting forecasts.
        </p>

        <h2>📎 Appendix</h2>
        <ul style={{ lineHeight: "1.7", opacity: 0.85 }}>
          <li>Additional figures</li>
          <li>Experimental notes</li>
          <li>Parameter settings</li>
          <li>Glossary of technical terms</li>
        </ul>
      </div>
    </div>
  );
};

export default ModelInformation;