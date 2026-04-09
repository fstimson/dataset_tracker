import React from 'react';
import { CheckCircle, XCircle, Clock, FileText, DollarSign, Trash2, Search } from 'lucide-react';

interface StatusIconProps {
  status: string;
  size?: number;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, size = 20 }) => {
  const getStatusIcon = () => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <CheckCircle size={size} className="text-green-500" />;
      case 'REJECTED':
        return <XCircle size={size} className="text-red-500" />;
      case 'APPEAL':
        return <Clock size={size} className="text-blue-500" />;
      case 'APPEAL REJECTED':
        return <XCircle size={size} className="text-red-600" />;
      case 'PAID':
        return <DollarSign size={size} className="text-green-600" />;
      case 'REMOVED':
        return <Trash2 size={size} className="text-gray-500" />;
      case 'REVIEW':
        return <Search size={size} className="text-yellow-500" />;
      case 'SUBMITTED':
      case 'DS SUBMITTED':
        return <FileText size={size} className="text-blue-400" />;
      default:
        return <Clock size={size} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getStatusIcon()}
    </div>
  );
};

export default StatusIcon;