/**
 * Loading Spinner Component
 */

import React from 'react';

const Loading = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizeClasses[size]} border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin`} />
      {text && <p className="mt-4 text-gray-400">{text}</p>}
    </div>
  );
};

export default Loading;
