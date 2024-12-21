import { useState, useRef } from "react";
import { useDrag } from "@use-gesture/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/FeatureLineChart.css";

const FeatureLineChart = ({ timeSeriesData, selectedFeature, formatDate }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visiblePoints, setVisiblePoints] = useState(20);
  const chartRef = useRef(null);

  const filteredTimeSeries = timeSeriesData
    .map((item) => {
      try {
        return {
          date: item.date,
          timeSpent: item[selectedFeature] || 0,
        };
      } catch (err) {
        console.error("Time series data error:", err);
        return null;
      }
    })
    .filter(Boolean);

  const maxStartIndex = Math.max(0, filteredTimeSeries.length - visiblePoints);
  const visibleData = filteredTimeSeries.slice(
    startIndex,
    startIndex + visiblePoints
  );

  const bind = useDrag(
    ({ movement: [mx], memo = startIndex }) => {
      const chartWidth = chartRef.current?.getBoundingClientRect().width || 1;
      const pointsToMove = Math.round((mx / chartWidth) * visiblePoints);

      const newStartIndex = Math.max(
        0,
        Math.min(maxStartIndex, memo - pointsToMove)
      );

      setStartIndex(newStartIndex);

      return memo;
    },
    {
      filterTaps: true,
    }
  );

  const handleZoomIn = () => {
    if (visiblePoints > 5) {
      const newVisiblePoints = Math.max(5, Math.floor(visiblePoints * 0.7));
      const centerPoint = startIndex + visiblePoints / 2;
      const newStartIndex = Math.max(
        0,
        Math.min(maxStartIndex, Math.floor(centerPoint - newVisiblePoints / 2))
      );
      setVisiblePoints(newVisiblePoints);
      setStartIndex(newStartIndex);
    }
  };

  const handleZoomOut = () => {
    if (visiblePoints < filteredTimeSeries.length) {
      const newVisiblePoints = Math.min(
        filteredTimeSeries.length,
        Math.floor(visiblePoints * 1.4)
      );
      const centerPoint = startIndex + visiblePoints / 2;
      const newStartIndex = Math.max(
        0,
        Math.min(
          filteredTimeSeries.length - newVisiblePoints,
          Math.floor(centerPoint - newVisiblePoints / 2)
        )
      );
      setVisiblePoints(newVisiblePoints);
      setStartIndex(newStartIndex);
    }
  };

  return (
    <div className="chart-container">
      <div className="zoom-controls">
        <button className="zoom-button" onClick={handleZoomIn}>
          +
        </button>
        <button className="zoom-button" onClick={handleZoomOut}>
          -
        </button>
      </div>

      <div className="chart-wrapper" {...bind()} ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={visibleData}
            margin={{ top: 5, right: 50, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis
              label={{
                value: "Time Spent",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip labelFormatter={formatDate} />
            <Line
              type="monotone"
              dataKey="timeSpent"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeatureLineChart;
