import { useState, useEffect } from "react";
import { useUrlParams } from "./useUrlParams";

export const useCookies = () => {
  const [filters, setFilters] = useState({
    ageGroup: "",
    gender: "",
    startDate: null,
    endDate: null,
  });
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  const { setUrlParams, getUrlParams } = useUrlParams();

  const setCookie = (name, value, days = 30) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${JSON.stringify(value)};${expires};path=/`;
  };

  const getCookie = (name) => {
    const cookieName = `${name}=`;
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(cookieName)) {
        try {
          return JSON.parse(cookie.substring(cookieName.length));
        } catch (e) {
          console.error("Error parsing cookie:", e);
          return null;
        }
      }
    }
    return null;
  };

  const clearFilters = () => {
    document.cookie =
      "dashboardFilters=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    setFilters({
      ageGroup: "",
      gender: "",
      startDate: null,
      endDate: null,
    });
    setUrlParams({});
  };

  const removeCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  };

  // Initialize filters from URL params or cookies
  useEffect(() => {
    const urlParams = getUrlParams();
    if (Object.keys(urlParams).length > 0) {
      setFilters(urlParams);
    } else {
      const savedFilters = getCookie("dashboardFilters");
      if (savedFilters) {
        setFilters(savedFilters);
      }
    }
    setFiltersInitialized(true);
  }, []);

  // Update URL and cookies when filters change
  useEffect(() => {
    if (filtersInitialized) {
      setCookie("dashboardFilters", filters);
      setUrlParams(filters);
    }
  }, [filters, filtersInitialized]);

  return { filters, setFilters, clearFilters, filtersInitialized , removeCookie};
};
