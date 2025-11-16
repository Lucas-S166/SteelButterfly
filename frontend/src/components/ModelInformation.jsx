import React from "react";
import Logo from "../assets/logo_wide.png";

const SectionTitle = ({ children }) => (
  <h2
    style={{
      marginTop: "32px",
      color: "#f8fafc",
      borderBottom: "1px solid #1e293b",
      paddingBottom: "8px",
      letterSpacing: "0.5px",
    }}
  >
    {children}
  </h2>
);

const paragraphStyle = {
  lineHeight: 1.7,
  opacity: 0.9,
  marginTop: "12px",
};

const listStyle = {
  lineHeight: 1.7,
  opacity: 0.9,
  marginTop: "12px",
  paddingLeft: "20px",
};

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
              width: "420px",
              height: "260px",
              objectFit: "cover",
              borderRadius: "14px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#020617",
          padding: "32px",
          borderRadius: "16px",
          border: "1px solid #1e293b",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
          Steel Butterfly Climate Impact Model
        </h1>
        <p style={{ ...paragraphStyle, marginTop: 0 }}>
          This brief mirrors the LaTeX specification shipped in
          <code style={{ marginLeft: "4px" }}>docs/model_information.tex</code> so
          the Model Information tab always reflects the model that powers the
          climate-adjusted HRC calculator.
        </p>

        <SectionTitle>🌍 The Need</SectionTitle>
        <ul style={listStyle}>
          <li>
            Steel industry supply chains have massive environmental impacts, and
            upstream price talks rarely internalize those damages.
          </li>
          <li>
            The traded HRC sticker price ignores hidden costs to water, air, and
            public health, so procurement analyses must expose those externalities.
          </li>
          <li>
            Sulfur dioxide (SO₂) oxidizes into sulfate PM2.5 that drives lung
            disease, smog, and additional climate forcing, so it is explicitly
            modeled alongside carbon and water.
          </li>
        </ul>

        <SectionTitle>🧮 Climate Impact Adjusted Price</SectionTitle>
        <p style={paragraphStyle}>
          The UI feeds user inputs into the exact pricing equation running in
          <code style={{ margin: "0 4px" }}>backend/pricing.py</code>. Each
          damage block can be toggled to compare conventional procurement against
          climate-informed purchasing.
        </p>

        <div
          style={{
            background: "#0f172a",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "16px",
            fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
            fontSize: "0.9rem",
            overflowX: "auto",
          }}
        >
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{`P' = [
  P + SC_CO2 * (M_CO2 + T_CO2)
    + ((D_PM / E_SO2) * Y * f_sulf) * M_SO2
    + C0 * (1 + βS) * W
]`}
          </pre>
        </div>

        <div style={{ marginTop: "16px", display: "grid", gap: "6px" }}>
          {[
            ["P'", "Climate-adjusted HRC price"],
            ["P", "Original HRC price"],
            ["SC_CO2", "Social cost of CO₂ at the selected discount rate"],
            ["M_CO2", "Mill-level CO₂ emissions from manufacturing"],
            ["T_CO2", "Transportation CO₂ per destination region"],
            [
              "D_PM",
              "Monetized particulate matter damages per region per year",
            ],
            ["E_SO2", "Regional SO₂ emissions per year"],
            ["Y", "Mass yield converting SO₂ to sulfate aerosols"],
            ["f_sulf", "Fraction of PM damages attributable to sulfate"],
            ["M_SO2", "Mill-level SO₂ emissions"],
            ["C0", "Base water cost (e.g., $1/m³)"],
            ["β", "Scarcity sensitivity parameter"],
            ["S", "Water scarcity indicator (0–1)"],
            ["W", "Water usage per mill"],
          ].map(([symbol, description]) => (
            <div
              key={symbol}
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#010b19",
                borderRadius: "8px",
                padding: "8px 12px",
                border: "1px solid #0f172a",
                fontSize: "0.95rem",
              }}
            >
              <strong style={{ color: "#38bdf8" }}>{symbol}</strong>
              <span style={{ marginLeft: "16px", textAlign: "right" }}>
                {description}
              </span>
            </div>
          ))}
        </div>

        <SectionTitle>🌫️ Social Cost Blocks</SectionTitle>
        <h3 style={{ marginTop: "20px", color: "#94a3b8" }}>
          Carbon Dioxide
        </h3>
        <p style={paragraphStyle}>
          The SCC term multiplies the externally supplied schedule
          <em>SC_CO2</em> by the mill's total greenhouse-gas footprint
          <em>(M_CO2 + T_CO2)</em>. The discount-rate selector (1.5–3%) is wired
          to the 2022 Interagency Working Group values so users can stress-test
          sensitivity to policy scenarios. Toggling SCC off zeroes this
          component, enabling clean A/B comparisons.
        </p>

        <h3 style={{ marginTop: "20px", color: "#94a3b8" }}>
          Sulfur Dioxide
        </h3>
        <p style={paragraphStyle}>
          Sulfur dioxide—mislabelled as “silicon dioxide” in early drafts—is
          priced via a damage-function cascade. The ratio D_PM / E_SO2 maps
          aggregate particulate damages to an SO₂ cost per ton, Y handles the
          conversion to sulfate aerosols, and f_sulf isolates sulfate-specific
          damages. Multiplying by M_SO2 yields a monetized penalty for the mill's
          sulfur footprint.
        </p>

        <h3 style={{ marginTop: "20px", color: "#94a3b8" }}>Water Usage</h3>
        <p style={paragraphStyle}>
          Water impacts enter as a base volumetric charge C0 · W that is scaled
          by regional scarcity (1 + βS). This keeps the units intuitive while
          letting procurement teams test how drought (S → 1) magnifies water cost
          exposure for electric-arc furnace operations.
        </p>

        <SectionTitle>📦 Steel Purchasing Methods</SectionTitle>
        <p style={paragraphStyle}>
          The three interactive calculators in the Purchasing Methods panel are
          mirrored below so finance teams can map UI widgets to their underlying
          payoff math.
        </p>
        <ul style={listStyle}>
          <li>
            <strong>Spot / Volume-Commit</strong> (<code>components/SpotVolume.jsx</code>
            ): multiplies entered spot price and tonnage with scientific notation
            for ultra-large orders.
          </li>
          <li>
            <strong>Long Future</strong> (<code>components/LongFuture.jsx</code>):
            tracks entry notional, settlement notional, and mark-to-market P&L
            using (settlement − entry) × tonnage.
          </li>
          <li>
            <strong>Long Call</strong> (<code>components/LongCall.jsx</code>):
            collects strike, premium, quantity, and expected expiry price to
            compute payoff, total premium, net P/L, and per-ton breakeven.
          </li>
        </ul>

        <SectionTitle>📊 Data Pipeline</SectionTitle>
        <p style={paragraphStyle}>
          Historical hot-rolled coil curves ship with the repo as
          region-specific workbooks:
          <code style={{ marginLeft: "4px" }}>HC Closing Prices.xlsx</code> (China),
          <code style={{ marginLeft: "4px" }}>SI Closing Prices.xlsx</code> (India),
          and
          <code style={{ marginLeft: "4px" }}>HU Closing Prices.xlsx</code> (United
          States). The FastAPI backend loads each via
          <code style={{ margin: "0 4px" }}>pandas</code>, caches them in
          <code style={{ marginLeft: "4px" }}>backend/xlsx_parser.py</code>, and
          exposes a unified <code>/prices</code> endpoint consumed by the
          lightweight-charts widget in
          <code style={{ marginLeft: "4px" }}>components/FuturesWidget</code>. The
          raw files originate from London Metal Exchange CSV exports that we
          convert to XLSX for deployment because the public LME feed is not
          queryable in real time.
        </p>

        <SectionTitle>🔭 Future Work</SectionTitle>
        <ul style={listStyle}>
          <li>
            Assume the SCC schedule remains constant at the 2022 level with a 3%
            discount rate today; future releases should regenerate SCC surfaces
            whenever new integrated assessment model runs are published.
          </li>
          <li>
            Couple the tool to full climate-model ensembles for updated forcing
            pathways; current runs would take more than a day on commodity
            hardware.
          </li>
          <li>
            Introduce explicit regional basis differentials instead of assuming
            market and manufacturing HRC rates are identical.
          </li>
          <li>
            License a streaming futures feed to replace the static LME CSV
            extracts bundled with the app.
          </li>
          <li>
            Replace the simple water pricing multiplier with basin-scale
            hydrologic modeling for each procurement region.
          </li>
          <li>
            Update the SO₂ damage block with current epidemiological research to
            tighten uncertainty bands.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModelInformation;