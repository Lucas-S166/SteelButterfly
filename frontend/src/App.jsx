import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

function App() {
  const [lineData, setLineData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_URL}/line`);
        const data = await res.json();
        setLineData(data);
      } catch (err) {
        console.error("Failed to fetch line data:", err);
      }
    }

    fetchData();
  }, [API_URL]);

  if (!lineData) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading chart...</div>;
  }

  const options = {
    title: {
      text: "Basic ECharts Line (FastAPI-powered)",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: lineData.x,
      name: "X",
    },
    yAxis: {
      type: "value",
      name: "Y",
    },
    series: [
      {
        name: "Sample series",
        type: "line",
        data: lineData.y,
        smooth: true,
      },
    ],
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <ReactECharts
        option={options}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );

}

export default App