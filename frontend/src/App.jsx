import React, { useEffect, useState } from "react";
import Header from "./components/header/Header";
import TabBar from "./components/TabBar";
import FuturesWidget from "./components/FuturesWidget";
import PurchasingMethodPanel from "./components/PurchaseMethodPanel";
import ClimateImpactAdjuster from "./components/ClimateImpactAdjuster";
import ModelInformation from "./components/ModelInformation";


const App = () => {
  const [region, setRegion] = useState("china");
  const [month, setMonth] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState("visualizer");

  useEffect(() => {
    if (activeTab !== "visualizer") return;
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
  }, [region, month, activeTab]); // <-- runs when dropdowns change

  return (
    <>
      <Header />
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
      
      {/* ===== HRC VISUALIZER TAB ===== */}
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
            <div style={{ marginLeft: "30px" }}>
              <ClimateImpactAdjuster />
            </div>
          </div>
          <div style={{ flex: "0 0 40%"}}>
            <PurchasingMethodPanel />
          </div>
        </div>
      )}
      {/* ===== MODEL INFORMATION TAB ===== */}
      {activeTab === "model" && (
        <div style={{ padding: "32px 48px" }}>
          <ModelInformation />
        </div>
      )}

      </>
  );
};

export default App;