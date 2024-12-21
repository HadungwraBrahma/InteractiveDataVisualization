import { useState, useEffect } from "react";
import axios from "../config/axiosConfig.js";
import { useCookies } from "../hooks/useCookies.js";
import { safeFormatDate } from "../utils/dateUtils.js";
import FilterPanel from "../components/FilterPanel.jsx";
import FeatureBarChart from "../components/FeatureBarChart.jsx";
import FeatureLineChart from "../components/FeatureLineChart.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [featureData, setFeatureData] = useState([]);
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [error, setError] = useState(null);

  const {
    filters,
    setFilters,
    clearFilters,
    filtersInitialized,
    removeCookie,
  } = useCookies();

  const fetchAnalyticsData = async (filters) => {
    try {
      const response = await axios.get("/api/data/analytics", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      throw new Error("Failed to fetch analytics data");
    }
  };

  useEffect(() => {
    if (!filtersInitialized) return;

    const loadData = async () => {
      try {
        setError(null);
        const { featureTimeSpent, timeSeriesData } = await fetchAnalyticsData(
          filters
        );

        const featureChartData = Object.entries(featureTimeSpent).map(
          ([feature, time]) => ({
            feature,
            timeSpent: time,
          })
        );

        setFeatureData(featureChartData);
        setTimeSeriesData(timeSeriesData);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to fetch analytics data. Please try again.");
      }
    };

    loadData();
  }, [filters, filtersInitialized]);

  const handleFeatureClick = (data) => {
    if (data?.feature) {
      setSelectedFeature(data.feature);
    }
  };

  return (
    <div className="analyticsDashboard">
      <ErrorMessage error={error} />

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        removeCookie={removeCookie}
      />

      <div className="charts">
        <h2>Feature Time Spent</h2>
        <FeatureBarChart
          data={featureData}
          onFeatureClick={handleFeatureClick}
        />

        {selectedFeature && (
          <>
            <h2>{selectedFeature} Feature Time Series</h2>
            <FeatureLineChart
              timeSeriesData={timeSeriesData}
              selectedFeature={selectedFeature}
              formatDate={safeFormatDate}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
