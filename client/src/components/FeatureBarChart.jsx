import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const FeatureBarChart = ({ data, onFeatureClick }) => {
  const handleClick = (e) => {
    try {
      if (e?.activePayload) {
        onFeatureClick(e.activePayload[0].payload);
      }
    } catch (err) {
      console.error("Bar chart click error:", err);
    }
  };

  const formatTimeSpent = (value) => {
    return `${value.toLocaleString()}`;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          onClick={handleClick}
          margin={{ top: 5, right: 50, left: -50, bottom: 20 }}
          barSize={32}
        >
          <YAxis dataKey="feature" type="category" width={80} />
          <XAxis
            type="number"
            label={{
              value: "Time Spent",
              position: "bottom",
            }}
          />
          <Tooltip />
          <Bar dataKey="timeSpent" fill="#8884d8" cursor="pointer">
            <LabelList
              dataKey="timeSpent"
              position="right"
              formatter={formatTimeSpent}
              className="text-sm"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureBarChart;
