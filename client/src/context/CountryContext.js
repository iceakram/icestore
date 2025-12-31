/**
 * Country Context
 * Manages selected country for filtering products
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const CountryContext = createContext();

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

// Country configuration
export const COUNTRIES = [
  { code: 'DZ', name: 'Algeria', currency: 'DZD', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', currency: 'TND', flag: '🇹🇳' },
  { code: 'IT', name: 'Italy', currency: 'EUR', flag: '🇮🇹' }
];

export const CountryProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const saved = localStorage.getItem('selectedCountry');
    if (saved) {
      const country = COUNTRIES.find(c => c.code === saved);
      return country || COUNTRIES[2]; // Default to Italy
    }
    return COUNTRIES[2]; // Default to Italy
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCountry', selectedCountry.code);
  }, [selectedCountry]);

  const changeCountry = (countryCode) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
    }
  };

  // Format price based on currency
  const formatPrice = (price, currency = selectedCountry.currency) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'DZD' ? 0 : 2,
      maximumFractionDigits: currency === 'DZD' ? 0 : 2
    });
    return formatter.format(price);
  };

  const value = {
    selectedCountry,
    countries: COUNTRIES,
    changeCountry,
    formatPrice
  };

  return (
    <CountryContext.Provider value={value}>
      {children}
    </CountryContext.Provider>
  );
};
