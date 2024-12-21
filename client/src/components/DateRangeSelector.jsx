import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import "../styles/DateRangeSelector.css";

const DateRangeSelector = ({
  onDateChange,
  onClose,
  initialStartDate,
  initialEndDate,
}) => {
  const [currentDate, setCurrentDate] = useState(() => {
    if (initialStartDate) {
      const date = new Date(initialStartDate);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    return new Date();
  });

  const [nextMonthDate, setNextMonthDate] = useState(() => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + 1);
    return nextDate;
  });

  const [startDate, setStartDate] = useState(() => {
    if (initialStartDate) {
      const date = new Date(initialStartDate);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    return null;
  });

  const [endDate, setEndDate] = useState(() => {
    if (initialEndDate) {
      const date = new Date(initialEndDate);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    return null;
  });

  // Update visible months when start date changes
  useEffect(() => {
    if (startDate) {
      const newCurrentDate = new Date(startDate);
      setCurrentDate(newCurrentDate);

      const newNextMonth = new Date(newCurrentDate);
      newNextMonth.setMonth(newCurrentDate.getMonth() + 1);
      setNextMonthDate(newNextMonth);
    }
  }, [startDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    const newCurrentDate = new Date(currentDate);
    newCurrentDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newCurrentDate);

    const newNextMonth = new Date(newCurrentDate);
    newNextMonth.setMonth(newCurrentDate.getMonth() + 1);
    setNextMonthDate(newNextMonth);
  };

  const handleDateClick = (date) => {
    if (!date) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
      } else {
        setEndDate(date);
      }
    }
  };

  const isDateInRange = (date) => {
    if (!date || !startDate) return false;
    if (!endDate) return date.getTime() === startDate.getTime();
    return date >= startDate && date <= endDate;
  };

  const handleQuickSelect = (option) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let start = null;
    let end = null;

    switch (option) {
      case "today":
        start = end = new Date(today);
        break;
      case "yesterday":
        start = end = new Date(today.setDate(today.getDate() - 1));
        break;
      case "last7":
        end = new Date(today);
        start = new Date(today.setDate(today.getDate() - 6));
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        break;
    }

    if (start && end) {
      setStartDate(start);
      setEndDate(end);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const handleApply = () => {
    if (startDate && endDate) {
      onDateChange(formatDate(startDate), formatDate(endDate));
      onClose();
    }
  };

  const renderCalendar = (date) => {
    const days = getDaysInMonth(date);
    const monthName = format(date, "MMM yyyy")
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
      <div className="calendar">
        <div className="calendar-header">{monthName}</div>
        <div className="calendar-grid">
          {weekDays.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day ? "empty" : ""} ${
                isDateInRange(day) ? "selected" : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              {day?.getDate()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="date-picker">
      <div className="quick-select">
        <button onClick={() => handleQuickSelect("today")}>Today</button>
        <button onClick={() => handleQuickSelect("yesterday")}>
          Yesterday
        </button>
        <button onClick={() => handleQuickSelect("last7")}>Last 7 Days</button>
        <button onClick={() => handleQuickSelect("thisMonth")}>
          This Month
        </button>
      </div>

      <div className="calendars-wrapper">
        <button className="nav-button" onClick={() => navigateMonth(-1)}>
          <ChevronLeft size={16} />
        </button>
        <div className="calendars">
          {renderCalendar(currentDate)}
          {renderCalendar(nextMonthDate)}
        </div>
        <button className="nav-button" onClick={() => navigateMonth(1)}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="date-range-display">
        {formatDate(startDate)} - {formatDate(endDate)}
      </div>

      <div className="actions">
        <button onClick={onClose} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="apply-btn"
          disabled={!startDate || !endDate}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangeSelector;
