import { useSearchParams } from 'react-router-dom';

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setUrlParams = (filters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
  };

  const getUrlParams = () => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  return { setUrlParams, getUrlParams };
};
