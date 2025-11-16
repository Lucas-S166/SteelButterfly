import { useState } from "react";
import ClimateImpactAdjuster from "./components/ClimateImpactAdjuster/ClimateImpactAdjuster";
import FuturesWidget from "./components/FuturesWidget/FuturesWidget";
import Header from "./components/header/Header";
import ModelInformation from "./components/ModelInformation";
import PurchasingMethodPanel from "./components/PurchaseMethodPanel";
import TabBar from "./components/TabBar";

const App = () => {
  const [activeTab, setActiveTab] = useState("visualizer");

  // 🔹 Primary impacts (SCC, SO2, Water)
  const [impacts, setImpacts] = useState({
    scc: false,
    so2: false,
    water: false,
  });

  // 🔹 Secondary impacts (uncertainties, tax incentives, tariffs)
  const [secondaryImpacts, setSecondaryImpacts] = useState({
    uncertainties: false,
    taxIncentives: false,
    tariffs: false,
  });

  // 🔹 Discount rate
  const [discount, setDiscount] = useState("2");

  const handleToggleImpact = (key) => {
    setImpacts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleSecondaryImpact = (key) => {
    setSecondaryImpacts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
  };

  return (
    <>
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "visualizer" && (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
            gap: "32px",
            margin: "20px",
          }}
        >
          <div>
            <FuturesWidget
              impacts={impacts}
              secondaryImpacts={secondaryImpacts}
              discount={discount}
            />

            <div style={{ marginTop: "16px" }}>
              <ClimateImpactAdjuster
                impacts={impacts}
                secondaryImpacts={secondaryImpacts}
                discount={discount}
                onToggleImpact={handleToggleImpact}
                onToggleSecondaryImpact={handleToggleSecondaryImpact}
                onDiscountChange={handleDiscountChange}
              />
            </div>
          </div>

          <div>
            <PurchasingMethodPanel />
          </div>
        </div>
      )}

      {activeTab === "model" && (
        <div style={{ padding: "32px 48px" }}>
          <ModelInformation />
        </div>
      )}
    </>
  );
};

export default App;