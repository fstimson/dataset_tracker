import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-500 text-white';
      case 'REJECTED':
        return 'bg-red-500 text-white';
      case 'APPEAL':
        return 'bg-blue-500 text-white';
      case 'APPEAL REJECTED':
        return 'bg-red-600 text-white';
      case 'PAID':
        return 'bg-green-600 text-white';
      case 'REMOVED':
        return 'bg-gray-500 text-white';
      case 'REVIEW':
        return 'bg-yellow-500 text-black';
      case 'SUBMITTED':
      case 'DS SUBMITTED':
        return 'bg-blue-400 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;