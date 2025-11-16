// ClimateImpactAdjuster.jsx
import "./ClimateImpactAdjuster.css";

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

const DISCOUNT_VALUES = ["1.5", "2", "2.5", "3"];

const ClimateImpactAdjuster = ({
  impacts,
  secondaryImpacts,
  discount,
  onToggleImpact,
  onToggleSecondaryImpact,
  onDiscountChange,
}) => {
  return (
    <div className="climate-impact-adjuster">
      <h2 className="climate-impact-title">Climate Impact Adjuster</h2>

      <div className="climate-impact-grid">
        {IMPACT_OPTIONS.map(({ key, label }) => (
          <label key={key} className="climate-impact-checkbox-label">
            <input
              type="checkbox"
              checked={!!impacts[key]}
              onChange={() => onToggleImpact(key)}
              className="climate-impact-checkbox-input"
            />
            {label}
          </label>
        ))}

        {SECONDARY_OPTIONS.map(({ key, label }) => (
          <label key={key} className="climate-impact-checkbox-label">
            <input
              type="checkbox"
              checked={!!secondaryImpacts[key]}
              onChange={() => onToggleSecondaryImpact(key)}
              className="climate-impact-checkbox-input"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Only show Discount when SCC is selected */}
      {impacts.scc && (
        <div className="climate-impact-discount-section">
          <div className="climate-impact-discount-label-text">Discount</div>

          <div className="climate-impact-discount-options">
            {DISCOUNT_VALUES.map((value) => (
              <label
                key={value}
                className="climate-impact-discount-option-label"
              >
                <input
                  type="radio"
                  name="discount-rate"
                  value={value}
                  checked={discount === value}
                  onChange={() => onDiscountChange(value)}
                  className="climate-impact-radio-input"
                />
                {value}%
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateImpactAdjuster;