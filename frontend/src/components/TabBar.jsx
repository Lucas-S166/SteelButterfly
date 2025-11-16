import React from "react";
import "./TabBar.css";

const TabBar = ({ activeTab, onChange }) => {
  return (
    <div className="tabbar">
      <button
        className={`tab-item ${activeTab === "visualizer" ? "active" : ""}`}
        onClick={() => onChange("visualizer")}
      >
        HRC Visualizer
      </button>

      <button
        className={`tab-item ${activeTab === "model" ? "active" : ""}`}
        onClick={() => onChange("model")}
      >
        Model Information
      </button>
    </div>
  );
};

export default TabBar;
