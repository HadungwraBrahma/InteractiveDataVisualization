import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateRangeSelector from "./DateRangeSelector.jsx";
import "../styles/FilterPanel.css";
import Share from "./Share.jsx";
import { format } from "date-fns";

const FilterPanel = ({ filters, setFilters, clearFilters, removeCookie }) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("dashboardFilters");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (startDate, endDate) => {
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
    setIsDatePickerVisible(false);
  };

  const formatDateRange = () => {
    if (!filters.startDate || !filters.endDate) return "Select Date Range";

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return format(date, "yyyy-MM-dd");
    };

    return `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`;
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <div className="filter-group">
          <select
            name="ageGroup"
            value={filters.ageGroup}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Age Groups</option>
            <option value="15-25">15-25</option>
            <option value=">25">&gt;25</option>
          </select>

          <select
            name="gender"
            value={filters.gender}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <button onClick={clearFilters} className="reset-button">
            Reset Filters
          </button>
        </div>

        <div className="date-filter">
          <button
            className="date-range-button"
            onClick={() => setIsDatePickerVisible(!isDatePickerVisible)}
          >
            {formatDateRange()}
          </button>

          {isDatePickerVisible && (
            <>
              <div
                className="date-picker-backdrop"
                onClick={() => setIsDatePickerVisible(false)}
              />
              <DateRangeSelector
                onDateChange={handleDateChange}
                onClose={() => setIsDatePickerVisible(false)}
                initialStartDate={filters.startDate}
                initialEndDate={filters.endDate}
              />
            </>
          )}
        </div>
      </div>

      <div className="button-group">
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="share-button"
        >
          Share View
        </button>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {isShareModalOpen && (
        <Share isOpen={isShareModalOpen} onClose={setIsShareModalOpen} />
      )}
    </div>
  );
};

export default FilterPanel;
