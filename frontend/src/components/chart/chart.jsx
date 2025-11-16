import { createChart, LineSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";

const REGION_COLORS = {
  china: "#FF1744", // red
  usa: "#2962FF",   // blue
  india: "#00C853", // green
};

const FALLBACK_COLORS = [
  "#2962FF", // blue
  "#FF6D00", // orange
  "#00C853", // green
  "#D500F9", // purple
  "#FF1744", // red
  "#00B0FF", // light blue
];

const Chart = ({ data, regions = [], height = 400 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRefs = useRef([]); // array of series

  // Create / destroy chart
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: container.clientWidth,
      height,
      layout: {
        background: { type: "solid", color: "#000000" },
        textColor: "#e6e6e6",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.1)" },
        horzLines: { color: "rgba(255, 255, 255, 0.1)" },
      },
      leftPriceScale: {
        visible: true,
        borderColor: "#cccccc",
      },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
      watermark: {
        visible: false,
      },
    });

    chartRef.current = chart;

    const handleResize = () => {
      if (!chartRef.current || !chartContainerRef.current) return;
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // clean up all series
      if (chartRef.current) {
        seriesRefs.current.forEach((s) => chartRef.current.removeSeries(s));
      }
      seriesRefs.current = [];
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [height]);

  // Create / sync series + set their data whenever `data` or `regions` change
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || !Array.isArray(data)) return;

    const datasets = data.filter(Array.isArray); // ensure only arrays

    // 🔴 IMPORTANT: clear all old series and recreate them
    seriesRefs.current.forEach((series) => {
      chart.removeSeries(series);
    });
    seriesRefs.current = [];

    // Recreate one series per dataset, matching index to regions
    datasets.forEach((dataset, i) => {
      const regionName = regions[i]?.toLowerCase?.();
      const color =
        (regionName && REGION_COLORS[regionName]) ||
        FALLBACK_COLORS[i % FALLBACK_COLORS.length];

      const series = chart.addSeries(LineSeries, {
        lineWidth: 2,
        color, // correct option
      });

      if (Array.isArray(dataset)) {
        series.setData(dataset);
      }

      seriesRefs.current.push(series);
    });

    chart.timeScale().fitContent();
  }, [data, regions]);

  return <div ref={chartContainerRef} style={{ width: "100%", height }} />;
};

export default Chart;