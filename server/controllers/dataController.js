import axios from "axios";
import { parseGoogleSheetData } from "../utils/dataParser.js";
import { parseDate, parseDate2 } from "../utils/dateParser.js";

export const fetchAnalyticsData = async (req, res) => {
  try {
    const sheetUrl =
      "https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/export?format=csv";
    const response = await axios.get(sheetUrl);
    const rawData = response.data;

    // Parse CSV data
    const parsedData = parseGoogleSheetData(rawData);

    const { startDate, endDate, ageGroup, gender } = req.query;

    // Apply filters
    let filteredData = parsedData.filter((item) => {
      // Parse the item date
      const itemDate = parseDate(item.Day);
      
      const isWithinDateRange =
        (!startDate || itemDate >= parseDate2(startDate)) &&
        (!endDate || itemDate <= parseDate2(endDate));

      const isMatchingAgeGroup = !ageGroup || item.Age === ageGroup;
      const isMatchingGender = !gender || item.Gender === gender;

      return isWithinDateRange && isMatchingAgeGroup && isMatchingGender;
    });

    // Calculate feature time spent
    const featureTimeSpent = filteredData.reduce((acc, item) => {
      const features = ["A", "B", "C", "D", "E", "F"];
      features.forEach((feature) => {
        acc[feature] = (acc[feature] || 0) + (Number(item[feature]) || 0);
      });
      return acc;
    }, {});

    // Prepare time series data for line chart
    const timeSeriesData = filteredData.map((item) => ({
      date: parseDate(item.Day),
      A: Number(item.A),
      B: Number(item.B),
      C: Number(item.C),
      D: Number(item.D),
      E: Number(item.E),
      F: Number(item.F),
    }));

    res.json({
      totalRecords: filteredData.length,
      featureTimeSpent,
      timeSeriesData,
      filters: { startDate, endDate, ageGroup, gender },
    });
  } catch (error) {
    console.error("Data fetch error:", error);
    res.status(500).json({
      message: "Error fetching analytics data",
      error: error.message,
    });
  }
};

// Controller to generate shareable URL
export const generateShareableUrl = (req, res) => {
  try {
    const { startDate, endDate, ageGroup, gender } = req.body;

    // Create a unique URL with encoded parameters
    const shareableUrl = new URL(process.env.FRONTEND_URL);

    // Add query parameters
    if (startDate) shareableUrl.searchParams.set("startDate", startDate);
    if (endDate) shareableUrl.searchParams.set("endDate", endDate);
    if (ageGroup) shareableUrl.searchParams.set("ageGroup", ageGroup);
    if (gender) shareableUrl.searchParams.set("gender", gender);

    res.json({
      shareableUrl: shareableUrl.toString(),
      message: "Shareable URL generated successfully",
    });
  } catch (error) {
    console.error("URL generation error:", error);
    res.status(500).json({
      message: "Error generating shareable URL",
      error: error.message,
    });
  }
};
