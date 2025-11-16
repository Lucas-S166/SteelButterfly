import { useState } from "react";
import ClimateImpactAdjuster from "./components/ClimateImpactAdjuster";
import FuturesWidget from "./components/FuturesWidget/FuturesWidget";
import Header from "./components/header/Header";
import ModelInformation from "./components/ModelInformation";
import PurchasingMethodPanel from "./components/PurchaseMethodPanel";
import TabBar from "./components/TabBar";

const App = () => {
  const [activeTab, setActiveTab] = useState("visualizer");

  return (
    <>
      <Header />
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
      
      {activeTab === "visualizer" && (
        <div
          style={{
            width: "95%",
            display: "flex",
            alignItems: "flex-start",
            gap: "32px",
            marginTop: "30px",
          }}
        >
          <div style={{ flex: "0 0 70%" }}>
            <FuturesWidget />
            <div style={{ margin: "40px" }}>
              <ClimateImpactAdjuster />
            </div>
          </div>
          <div style={{ flex: "0 0 40%" }}>
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