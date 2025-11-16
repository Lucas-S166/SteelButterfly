import { createChart, LineSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";

const REGION_COLORS_BASE = {
  china: "#FF1744",
  usa: "#2962FF",
  india: "#00C853",
};

const REGION_COLORS_ADJUSTED = {
  china: "#FF8A80",  // lighter red
  usa: "#82B1FF",    // lighter blue
  india: "#B9F6CA",  // lighter green
};

const Chart = ({
  baseData = [],
  adjustedData = [],
  regions = [],
  height = 400,
}) => {
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

  // Create / sync series + set their data whenever data or regions change
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const baseDatasets = Array.isArray(baseData)
      ? baseData.filter(Array.isArray)
      : [];
    const adjustedDatasets = Array.isArray(adjustedData)
      ? adjustedData.filter(Array.isArray)
      : [];

    // Clear all old series and recreate them
    seriesRefs.current.forEach((series) => {
      chart.removeSeries(series);
    });
    seriesRefs.current = [];

    regions.forEach((regionId, index) => {
      const regionName = regionId?.toLowerCase?.();
      const baseSeriesData = baseDatasets[index] || [];
      const adjustedSeriesData = adjustedDatasets[index] || [];

      // Base series
      if (baseSeriesData.length > 0) {
        const baseColor =
          (regionName && REGION_COLORS_BASE[regionName]) || "#ffffff";

        const baseSeries = chart.addSeries(LineSeries, {
          lineWidth: 2,
          color: baseColor,
        });

        baseSeries.setData(baseSeriesData);
        seriesRefs.current.push(baseSeries);
      }

      // Adjusted series
      if (adjustedSeriesData.length > 0) {
        const adjustedColor =
          (regionName && REGION_COLORS_ADJUSTED[regionName]) || "#bbbbbb";

        const adjSeries = chart.addSeries(LineSeries, {
          lineWidth: 2,
          color: adjustedColor,
        });

        adjSeries.setData(adjustedSeriesData);
        seriesRefs.current.push(adjSeries);
      }
    });

    if (seriesRefs.current.length > 0) {
      chart.timeScale().fitContent();
    }
  }, [baseData, adjustedData, regions]);

  return <div ref={chartContainerRef} style={{ width: "100%", height }} />;
};

export default Chart;